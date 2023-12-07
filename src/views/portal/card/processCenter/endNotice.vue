<template>
  <div>
    <yu-panel
      ref="panel"
      title="到期提示"
      panel-type="combination"
      is-filter
      collapse
      collaspase-text="查询条件"
    >
      <template slot="filter">
        <yu-xform
          v-model="searchFormData"
          form-type="search"
          ref="refBaseForm"
          related-table-name="refTable"
          label-width="110px"
          :custom-search-fn="searchFn"
          :custom-reset-fn="resetFn"
        >
          <yu-xform-group :column="4">
            <yu-xform-item
              label="任务流水号"
              placeholder="请输入"
              ctype="input"
              value=""
              name="busiNo"
              @keyup.enter.native="searchFn"
            ></yu-xform-item>
            <yu-xform-item
              label="客户名称"
              placeholder="请输入"
              ctype="input"
              value=""
              name="cusName"
              @keyup.enter.native="searchFn"
            ></yu-xform-item>
            <yu-xform-item
              label="客户编号"
              placeholder="请输入"
              ctype="input"
              value=""
              name="cusNo"
              @keyup.enter.native="searchFn"
            ></yu-xform-item>
            <yu-xform-item
              label="任务到期时间"
              ctype="datepicker"
              type="daterange"
              :value="[]"
              name="expireDate"
              placeholder="请选择"
              :picker-options="pickerOptions"
              @keyup.enter.native="searchFn"
            ></yu-xform-item>
            <yu-xform-item
              label="提示类型"
              ctype="custom"
              name="hintTyp"
              :colspan="12"
              :value="[]"
            >
              <div>
                <yu-checkbox :indeterminate="!checkAll && isIndeterminate" v-model="checkAll"
                             @change="handleCheckAllChange">全选
                </yu-checkbox>
                <yu-checkbox-group style="display:inline-block" v-model="checkHintTyps" @change="handleChange">
                  <yu-checkbox v-for="t in hintTyps" :label="t.key" :key="t.key">{{ t.value }}</yu-checkbox>
                </yu-checkbox-group>
              </div>
            </yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <yu-xtable
        ref="refTable"
        :data-url="dataUrl"
        :base-params="baseParams"
        condition-key="condition"
        :encode="false"
        :default-load="false"
        @loaded="dealTableData"
      >
        <yu-xtable-column type="index" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ $refs.refTable.tabledata.indexOf(scope.row) + 1 }}</span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="任务流水号" prop="busiNo" show-overflow-tooltip></yu-xtable-column>
        <yu-xtable-column label="客户编号" prop="cusNo" show-overflow-tooltip></yu-xtable-column>
        <yu-xtable-column label="客户名称" prop="cusName" show-overflow-tooltip></yu-xtable-column>
        <yu-xtable-column label="提示类型" prop="hintTyp">
          <template slot-scope="scope">
            <yu-tag v-if="hintTypsMap[scope.row.hintTyp]" :type="hintTypsMap[scope.row.hintTyp].type">
              {{ hintTypsMap[scope.row.hintTyp].value }}
            </yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="业务类型" prop="busiType">
          <template slot-scope="scope">
            <yu-tag v-if="busiTypsMap[scope.row.busiTyp]" :type="busiTypsMap[scope.row.busiTyp].type">
              {{ busiTypsMap[scope.row.busiTyp].value }}
            </yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="到期日" prop="expireDate"></yu-xtable-column>
        <yu-xtable-column label="剩余天数" prop="remainDay" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.remainDay<=0">{{ Math.abs(scope.row.remainDay) }}</span>
            <span v-else style="color:red">已逾期{{ scope.row.remainDay }}天</span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="管户客户经理" prop="cusManage"></yu-xtable-column>
        <yu-xtable-column label="还款状态" prop="refundSts"></yu-xtable-column>
        <yu-xtable-column label="还款账户" prop="refundAcct"></yu-xtable-column>
        <yu-xtable-column label="提示信息" prop="hintMsg" show-overflow-tooltip></yu-xtable-column>
        <yu-xtable-column label="经办机构" prop="handOrg"></yu-xtable-column>
        <yu-xtable-column label="经办人" prop="handPer"></yu-xtable-column>
        <yu-xtable-column label="操作" width="50" fixed="right">
          <template slot-scope="scope">
            <yu-button type="text" @click="detailFn(scope.row)">查看</yu-button>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <!-- 查看 -->
    <yu-xdialog title="查看" :visible.sync="dialogVisible" width="640px">
      <yu-xform ref="noticeForm" label-width="120px" v-model="formData" form-type="details">
        <yu-xform-group :column="2">
          <yu-xform-item label="客户编号" ctype="input" name="cusNo"></yu-xform-item>
          <yu-xform-item label="客户名称" ctype="input" name="cusNo"></yu-xform-item>
          <yu-xform-item label="提示类型" ctype="select" name="hintTyp" :options="hintTyps">></yu-xform-item>
          <yu-xform-item label="业务类型" ctype="select" name="busiTyp" :options="busiTyps"></yu-xform-item>
          <yu-xform-item label="到期日" ctype="input" name="expireDate"></yu-xform-item>
          <yu-xform-item label="剩余天数" ctype="custom" name="remainDay">
            <span v-if="formData.remainDay>=0">{{ formData.remainDay }}</span>
            <span v-else style="color:red">已逾期{{ Math.abs(formData.remainDay) }}天</span>
          </yu-xform-item>
          <yu-xform-item label="管户客户经理" ctype="input" name="cusManage"></yu-xform-item>
          <yu-xform-item label="还款状态" ctype="input" name="refundSts"></yu-xform-item>
          <yu-xform-item label="还款账户" ctype="input" name="refundAcct"></yu-xform-item>
          <yu-xform-item label="提示信息" ctype="input" name="hintMsg"></yu-xform-item>
          <yu-xform-item label="经办机构" ctype="input" name="handOrg"></yu-xform-item>
          <yu-xform-item label="经办人" ctype="input" name="handPer"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" class="yu-grpButton">
        <yu-button @click="dialogVisible = false">取消</yu-button>
      </div>
    </yu-xdialog>
  </div>
</template>
<script>
import {clone, extend, lookup} from "@/utils";
import YufpExcelExport from "@/components/widgets/YufpExcelExport";

lookup.reg("OP_TYPE,REMIND_TIME,REPEATED_TYPE,SHOW_UNREAD"); // 注册数据字典类型
export default {
  name: "allPrepare",
  components: {YufpExcelExport},
  mixins: [],
  data() {
    const hintTyps = [
      {key: "1", value: "授信到期", type: "primary"},
      {key: "2", value: "还款到期", type: "gray"},
      {key: "3", value: "到期收费", type: "success"},
    ];
    const busiTyps = [
      {key: "1", value: "新增", type: "primary"},
      {key: "2", value: "续作", type: "success"},
    ];
    return {
      pickerOptions: {
        shortcuts: [{
          text: '未来一周',
          onClick: function (picker) {
            var end = new Date();
            var start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 7));
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '未来一个月',
          onClick: function (picker) {
            var end = new Date();
            var start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 30));
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '未来三个月',
          onClick: function (picker) {
            var end = new Date();
            var start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 90));
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '未来一年',
          onClick: function (picker) {
            var end = new Date();
            var start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 365));
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      dataUrl: `${backend.portalService}/api/xmhexpire/hint/list`, // 表格接口地址
      searchFormData: {}, // 表单数据
      checkAll: false,
      isIndeterminate: false,
      hintTyps,
      hintTypsMap: hintTyps.reduce((o, kv) => {
        o[kv.key] = kv;
        return o
      }, {}),
      busiTyps,
      busiTypsMap: busiTyps.reduce((o, kv) => {
        o[kv.key] = kv;
        return o
      }, {}),
      checkHintTyps: [],
      baseParams: {},
      dialogVisible: false, // 编辑弹框
      formData: {}, // 详情表单数据
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.activated();
  },
  activated() {
    this.activated();
  },
  methods: {
    activated() {
      const type = this.$route.query ? this.$route.query.type : null
      if (type) {
        // 先清空所有
        this.resetFn()
        // 展开高级查询
        this.$refs.panel && (this.$refs.panel.hide = false);
        this.$nextTick(() => {
          this.$nextTick(() => {
            const hintTyp = this.hintTyps.find(item => item.key == type || item.value == type)
            hintTyp && (this.checkHintTyps.push(hintTyp.key))
            this.searchFn()
          })
        })
      } else {
        // 关闭高级查询
        this.$refs.panel && (this.$refs.panel.hide = true);
        this.$nextTick(() => {
          this.searchFn()
        })
      }
    },
    dealTableData(data) {
      data.forEach(row => {
        // 剩余天数显示
        row.remainDay = parseInt(row.remainDay);
      })
    },
    checkHas(array, key) {
      var result = array.filter(item => {
        return item.value === key
      })
      return result && result.length !== 0
    },
    handleCheckAllChange: function (_evt, checked) {
      this.checkHintTyps.splice(0, this.checkHintTyps.length);
      if (checked) {
        this.hintTyps.forEach(t => this.checkHintTyps.push(t.key))
      }
    },
    handleChange() {
      const length = this.checkHintTyps.length;
      this.checkAll = length === 3;
      this.isIndeterminate = length > 0 && length < 3;
    },
    searchFn() {
      // .join(",")
      // .replace(/,+/g, ",")
      // .replace(/^,|,$/g, "");
      var params = clone(this.searchFormData, {});
      Object.keys(params).forEach(k => {
        if (params[k] == null || params[k] == "") {
          delete params[k]
        }
      })
      if (this.checkHintTyps.length !== 0) {
        params.hintTyp = this.checkHintTyps.join(",")
      } else {
        delete params.hintTyp
      }
      // 时间段数组转换为字符串
      if (params.expireDate) {
        params.expireDate = params.expireDate.join(",")
      }
      this.$refs.refTable.remoteData(params);
    },
    resetFn() {
      this.$refs.refBaseForm.resetFields();
      this.checkHintTyps.splice(0, this.checkHintTyps.length);
      this.$nextTick(() => {
        this.isIndeterminate = false;
        this.checkAll = false;
      })
    },
    /**
     * 详情
     */
    detailFn(data) {
      this.dialogVisible = true;
      this.$nextTick(function () {
        // 复制对象
        extend(this.formData, data);
      });

    },
  },
};
</script>
