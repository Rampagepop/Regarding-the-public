<template>
  <div class="config-table">
    <div class="panel-container">
      <el-panel class="top-panel" :title="header.title" v-if="header.title||header.buttons&&header.buttons.length>0">
        <template slot="right">
          <el-row class="button-group">
            <el-col :span="24">
              <el-button
                v-for="(item, index) in header.buttons||[]"
                :key="index"
                :type="index === header.buttons.length -1 ? 'primary' : item.type" @click="item.handle"
              >
                <i :class="item.icon"></i>  
                {{ item.name }}
              </el-button>
            </el-col>
          </el-row>
        </template>
        <!-- 查询区域 -->
        <yu-xform ref="refForm" formType="search" :customResetFn="resetData" :customSearchFn="searchData" v-if="search.fields&&search.fields.length>0" v-model="formData">
          <!-- unlink-panels 不强制时间段前后关联 -->
          <yu-xform-group :column="4">
            <yu-xform-item
              v-for="(item, index) in search.fields"
              :key="index"
              :label="item.label"
              :name="item.prop"
              :ctype="item.ctype"
              :type="item.type"
              :placeholder="item.placeholder||item.ctype=='select'&&$t('ask.qxz')||$t('ask.all')"
              :start-placeholder="$t('ask.ksrq')"
              :end-placeholder="$t('ask.jsrq')"
              :value-format="item.valueFormat"
              :options="item.options"
              :icon="item.icon"
              :unlink-panels="item.unlinkPanels"
              @click="searchData"
              @change="(val)=>formChange(val, item.prop)"
            ></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </el-panel>
      <el-panel :title="table.title" v-if="table.title||table.buttons&&table.buttons.length>0">
        <template slot="right">
          <el-row class="button-group">
            <el-col :span="24">
              <el-button
                v-for="(item, index) in table.buttons||[]"
                :key="index"
                :type="index === table.buttons.length -1 ? 'primary' : item.type" @click="item.handle"
              >
                <i :class="item.icon"></i>  
                {{ item.name }}
              </el-button>
            </el-col>
          </el-row>
        </template>
        <!-- 表格数据 -->
        <el-xtable ref="refTable" :selection-type="table.selection" :data-url="table.dataUrl" :base-params="table.baseParams" @row-click="rowClick" @sort-change="sortTableFn" :page-size="table.pageSize" :page-sizes="table.pageSizes" tooltip-effect="light">
          <el-xtable-column :label="$t('ask.xh')" type="index" align="center" width="90"></el-xtable-column>
          <el-xtable-column
            v-for="(item, index) in table.fields"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :min-width="item.minwidth"
            :sortable="item.sort"
            show-overflow-tooltip
            :align="item.align||'left'">
            <template slot-scope="scope">
              <!-- 插槽 -->
              <slot v-if="item.slot" :name="item.slot" :row="scope.row" :index="scope.$index" :cellValue="scope.row[item.prop]"></slot>
              <!-- 格式化 -->
              <span v-else-if="item.format" :style="{color: item.colorFormat&&item.colorFormat(scope.row[item.prop], scope.row)||item.color}">
                <i class="icon-point" v-if="item.point" :style="{background: item.bgColorFormat&&item.bgColorFormat(scope.row[item.prop], scope.row)||item.bgColor}"></i>
                {{ item.format(scope.row[item.prop], scope.row) }} 
              </span>
              <!-- 开关按钮 -->
              <span v-else-if="item.switch" @click.stop="stopOpen">
                <el-switch :width="42" :value="item.onValue&&item.onValue(scope.row[item.prop], scope.row)" on-text="" off-text="" @change="(val) => item.change(scope.row, val)"></el-switch>
              </span>
              <!-- 默认 -->
              <span v-else :style="{color: item.colorFormat&&item.colorFormat(scope.row[item.prop], scope.row)||item.color}">
                <i class="icon-point" v-if="item.point" :style="{background: item.bgColorFormat&&item.bgColorFormat(scope.row[item.prop], scope.row)||item.bgColor}"></i>
                {{ scope.row[item.prop] || '--' }} 
              </span>
            </template>
          </el-xtable-column>
          <el-xtable-column v-if="table.handle" :label="$t('ask.cz')" :width="table.handle.width||'300'" fixed="right" align="center">
            <template slot-scope="scope">
              <div class="handle-column-btn">
                <span v-for="(item, index) in table.handle.buttons" :key="index" :class="{'is-disabled':item.disabled?item.disabled(scope.row):false}" v-show="item.hide ? !item.hide(scope.row) : true" @click="item.handle(scope.row)">
                  {{ item.name }}
                </span>
                <el-popover v-if="table.handle.pButtons" popper-class="handle-popover" :tabindex="scope.$index" trigger="hover">
                  <i slot="reference" class="el-icon-more"></i>
                  <li v-for="(item, index) in table.handle.pButtons" :key="index" v-show="item.hide ? !item.hide(scope.row) : true" @click="item.handle(scope.row)">
                    {{ item.name }}
                  </li>
                </el-popover>
              </div>
            </template>
          </el-xtable-column>
        </el-xtable>
      </el-panel>
    </div>
  </div>
</template>

<script>
import { deleteAdvertisemenById } from "@/api/portal/backstageAdmin";
export default {
  name: "YuConfigTable",
  props: {
    // 头部
    header: {
      type: Object,
      default: () => {
        return {
          title: '', // 标题
          buttons: [] // 操作按钮
        }
      }
    },
    // 查询
    search: {
      type: Object,
      default: () => {
        return {
          fileds: [] // 查询字段
        }
      }
    },
    // 表格
    table: {
      type: Object,
      default: () => {
        return {
          dataUrl: '', // 查询路径
          title: '', // 表格标题
          tip: '', // 表格提示
          buttons: [], // 表格操作按钮
          fields: [], // 表格字段
          // 操作列
          handle: {
            type: Object,
            default: () => {
              return {
                width: '', // 操作列宽度
                buttons: [], // 操作按钮列表
                pButtons: [] // popper中的按钮列表
              }
            }
          },
          // 是否可选
          selection: false
        }
      }
    }
  },
  data() {
    return {
      // 查询表单数据
      formData: {},
    }
  },
  methods: {
    // 阻止触发点击行事件
    stopOpen() {
      return
    },
    // 重新加载数据
    remoteData(condition = '') {
      this.$refs.refTable.remoteData({condition: condition});
    },
    // 重置表单数据
    resetData() {
      this.$refs.refForm.resetFields();
      this.remoteData();
    },
    // 搜索数据
    searchData() {
      this.remoteData(JSON.stringify(this.formData));
    },
    // 时间范围数据转换
    formChange(val, prop) {
      this.$emit('form-change', val, prop)
    },
    // 表格排序
    sortTableFn(col) {
      this.$emit('sort-change', col)
    },
    // 表格点击某行操作
    rowClick(row, e, column, index) {
      // 点击位置为操作列
      if (column.label == this.$t('ask.cz')) {
        return
      }
      this.$emit('row-click', row, column, index)
    },
    /**
     * 删除数据
     * @param {function} func 调用的删除方法 
     * @param {String} ids 传入的数据id 
     * @param {String} tip 删除提示语 
     */
    deleteData(func, data, tip) {
      this.$confirm(tip, {
        type: 'warning',
        confirmButtonText: this.$t('button.sc'),
        confirmButtonClass: 'delete-btn',
        center: true
      }).then(() => {
        func(data).then(response => {
          if (response.code === '0000') {
            this.$message.success(this.$t('askInfo.delsuccess'));
            this.remoteData();
          } else {
            this.$message.error(response.msg);
          }
        }).catch(e => {
        })
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.config-table {
  // height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #f8f8fb;
  .panel-container {
    height: 100%;
    background: #fff;
    box-shadow: 0px 6px 14px 0px rgba(223,224,239,1);
    overflow: auto;
    padding: 20px;
    .panel-top {
      padding: 10px 30px;
      .el-row {
        font-size: 18px;
        color: #000;
        height: 55px;
        .tip {
          font-size: 15px;
          color: #3f4454;
          opacity: .5;
          i {
            margin: 0 5px;
            font-size: 16px;
          }
        }
      }
    }
    .icon-point {
      width: 6px;
      height: 6px;
      display: inline-block;
      border-radius: 50%;
      margin-right: 5px;
      vertical-align: middle;
    }
  }
}
</style>

<style lang="scss">
.handle-popover {
  min-width: auto!important;
  width: 110px;
  box-sizing: border-box;
  li {
    font-size: 13px;
    color: #3f4454;
    line-height: 22px;
    cursor: pointer;
    text-align: center;
  }
}
.config-table {
  .panel-container {
    .search-btn-group{padding-left: 0 !important;text-align: right;}
  }
}
// .top-panel{
//   .el-base-panel-title{
//     padding-left: 0 !important;
//   }
// }
</style>