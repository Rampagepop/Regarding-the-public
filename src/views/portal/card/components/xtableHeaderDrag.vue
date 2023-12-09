/**
* Desc:&emsp;&ensp;可设定表格头显示以及拖动改变表格头顺序的表格组件
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/9/15
* @since   1.0.0
* @version 1.0
*/
<template>
  <div style="position: relative">
    <yu-xtable ref="refTable" v-on="$listeners" v-bind="$attrs" style="width: 100%;"
               :class="{'no-el-pagination__sizes':noPageSizes}" @cell-click="cellClick">
      <yu-xtable-column v-for="(item, index) in tableHeader" :key="index" v-bind="item" v-on="item.$listeners"
                        :render-header="renderHeader"
                        :show-overflow-tooltip="item.showOverflowTooltip==undefined?true:item.showOverflowTooltip"
                        :class-name="item.align=='right'?'pdr10':''">
        <template v-slot="scope">
          <compontent v-if="item.render" :is="getItemComponent(item)" :col="item" :row="scope.row"></compontent>
          <span v-else-if="item.optionsMap">{{ item.optionsMap[scope.row[item.prop]] }}</span>
          <span v-else :class="item.handleClick!=undefined?'c1 link':''"
                @click="item.handleClick && item.handleClick(scope.row,item.prop,$event)">
            <p v-if="item.prop === 'remainTime' && cardtype" :class="getClassByNum(scope.row[item.prop])"></p>
            {{
              item.label === "序号" ? (scope.$index + 1) : (item.prop === "apltTerm" && tableId ==="credit2ZH") ? formatter(item, scope.row[item.prop]) + '个月' : formatter(item, scope.row[item.prop])
            }}
          </span>
        </template>
      </yu-xtable-column>
       
      <yu-xtable-column v-if="buttons && buttons.length" :label="$t('card.cz')" :width="czColWidth"
                        fixed="right">
        <template v-slot="scope">
          <!-- 这里使用v-show更多里面的按钮隐藏不了没效果 -->
          <yu-button-drop set-index="0" :show-length="maxLength" type="text" style="margin-left:-10px;margin-right:0px">
            <yu-button v-for="(bt,i) in getRealButtons(scope.row)" :key="i+'buttonShow'" type="text" 
                       :title="bt.label" :style="{width: czColBtWidth+'px'}"
                       @click="() => bt.handleClick(scope.row)">
              {{ bt.label }}
            </yu-button>
          </yu-button-drop>
        </template>
      </yu-xtable-column>
    </yu-xtable>
    <ul v-show="colFilterMenu.show" class="yu-card-col-filter-menu"
        ref="colFilterMenu"
        :style="{left:colFilterMenu.left+'px',top:colFilterMenu.top+'px'}">
      <li class="yu-card-col-filter-item" v-for="(item,i) in headerFields" :key="i">
        <yu-button>
          <yu-checkbox class="yu-card-col-filter-item--label card-table-head-text" v-model="item.show" size="large"
                       :disabled="item.disabled?item.disabled:false" @change="()=>saveCfgDebounce()">
            {{ item.label }}
          </yu-checkbox>
          <svg-icon class="yu-card-col-filter-item--icon" icon-class="drag"></svg-icon>
        </yu-button>
      </li>
    </ul>
  </div>

</template>

<script>
import Vue from 'vue'
import Sortable from 'sortablejs';
import config from "@/config";
import {mapGetters} from "vuex";
import {moneyFormatter} from '@/utils/util';
import {debounce} from "@/utils/debounce";
import {getOptsByDataCodes} from "@/views/portal/card/routes/config/cardUtil";

export default {
  // name: "xtableHeaderDrag",
  props: {
    // 表格Id，用来获取和保存拖动数据，默认null，不进行保存和获取
    tableId: {
      type: String,
      default: null
    },
    headerFields: {
      type: Array,
      default: () => []
    },
    // 默认不显示分页列表数组
    noPageSizes: {
      type: Boolean,
      default: false
    },
    // 默认不显示按钮组
    buttons: {
      type: Array,
      //[{label:"";handleClick:null}]
      default: () => []
    },
    // 最多展示的按钮数量，超出用更多功能下拉展示
    maxLength: {
      type: Number,
      default: 2
    },
    cardtype: {
      type: Boolean,
      default: false
    },
    // 是否多级排序模式，即允许同时点击多列排序
    multiSort: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      colFilterMenu: {
        show: false,
        left: 0,
        top: 0,
        curtProperty: undefined
      },
      menuFields: [],
      // 延迟保存
      saveCfgDebounce: null,
      // 排序信息，multiSort模式下分先后，否则最多只有一个列字段
      sort: [],
      SORT: {
        ASC: "asc",
        DES: "des",
      }
    }
  },
  computed: {
    tableHeader() {
      return this.menuFields.filter(field => field.show)
    },
    ...mapGetters([
      "language",
    ]),
    czColBtWidth() {
      // 针对中文较短英文较长的优化
      return this.language == "zh_CN" ? 35 : 50
    },
    czColWidth() {
      // 针对中文较短英文较长的优化,8是边距，4是冗余量
      return Math.min(this.maxLength, this.buttons.length) * (this.czColBtWidth + 8) + 8
    },
    sortMap() {
      return this.sort.reduce((o, item) => {
        o[item.prop] = item;
        return o
      }, {})
    }
  },
  watch: {
    headerFields: {
      handler: function (_n, _o) {
        if (_o != undefined && JSON.stringify(_o.map(f => f.prop)) === JSON.stringify(_n.map(f => f.prop)) && JSON.stringify(_o.map(f => f.tabletype) === JSON.stringify(_n.map(f => f.tabletype)))) {
          // 重复触发
          return;
        }
        // 防止切换headerfields引起拖动乱序的情况,添加随机数种子
        const random = (Math.randow()*100000).toFixed(0)
        this.headerFields.forEach((field,i) =>field.key = random + i)
        // 获取列配置
        this.getTableFieldsConfig((cfgCols) => {
          if (cfgCols != null) {
            const colsProp = cfgCols.map(item => item.prop)
            const colsMap = cfgCols.reduce((map, item) => {
              map[item.prop] = item;
              return map
            }, {})
            // 按照保存好的配置恢复
            // 1.恢复show
            this.headerFields.forEach(item => colsMap[item.prop] && (item.show = colsMap[item.prop].show))
            // 2.恢复顺序
            this.headerFields.sort((f1, f2) => colsProp.indexOf(f1.prop) - colsProp.indexOf(f2.prop))
          }
          this.menuFields.splice(0, this.menuFields.length, ...this.headerFields);
        })
        // 处理字典
        this.dealLookup();
        // 注册组件
        this.regComponents();
        // 列筛选下拉重新初始化
        this.sortable && this.sortable.destroy();
        this.sortable = null;
        this.colFilterMenuDrop();
      },
      immediate: true
    },
    sort: {
      handler: function () {
        this.sortChange()
      },
      deep: true
    },
  },
  mounted() {
    if (config.isdebug) {
      setTimeout(() => {
        window.debug3 = this;
      }, 100)
    }
    this.saveCfgDebounce = debounce(this.saveTableFieldsConfig, 1000);
    document.addEventListener("click", this.filterDownIconClick);
  },
  destroyed() {
    this.sortable && this.sortable.destroy();
    document.removeEventListener("click", this.filterDownIconClick)
  },
  methods: {
    getClassByNum (val) {
      if (val === '0天' || val === '1天') {
        return "status-released";
      } else if (val === '2天') {
        return "status-effect";
      } else {
        return "status-other";
      }
    },
    // 处理buttons
    getRealButtons(data) {
      const tempButtons = [];
      for (let i = 0; i < this.buttons.length; i++) {
        const element = this.buttons[i];
        if(element.show == null || element.show(data)) {
          tempButtons.push(element);
        }
      }
      return tempButtons;
    },
    /**
     * 处理字典
     */
    dealLookup() {
      const fields = this.headerFields.filter(f => f.dataCode && f.options == null);
      if (fields.length == 0) {
        return
      }
      // 批量获取
      getOptsByDataCodes(fields.map(f => f.dataCode), dataCodeObj => {
        fields.forEach(field => {
          this.$set(field, "options", this.$lookup.lookupMgr[field.dataCode]);
          this.$set(field, "optionsMap", dataCodeObj[field.dataCode]);
        }, false)
        this.$emit("dict-loaded")
      }, false)
    },
    /**
     * 获取当前用户的表格配置
     */
    getTableFieldsConfig(cb) {
      if (!this.tableId || cb == undefined) {
        cb();
        return;
      }
      this.$request({
        url: backend.portalService + "/api/xmhcardtabcol/v2/list",
        method: "POST",
        data: {
          tableId: this.tableId
        }
      }).then(({code, data}) => {
        if (code === '0' && data.length > 0) {
          cb(JSON.parse(data[0].tableCol))
        } else {
          cb()
        }
      }).catch(() => {
        cb()
      })
    },
    /**
     * 保存前用户的表格配置
     */
    saveTableFieldsConfig() {
      if (!this.tableId) {
        return;
      }
      const tableCol = this.menuFields.map(field => ({prop: field.prop, show: field.show}))
      this.$request({
        url: backend.portalService + "/api/xmhcardtabcol/v2/save",
        method: "POST",
        data: {
          tableCol: JSON.stringify(tableCol),
          tableId: this.tableId
        }
      })
    },
    /**
     * 渲染可以下拉过滤的列表头
     */
    renderHeader(h, {column, $index}) {
      if (this.tableHeader[$index].showColFilter || this.tableHeader[$index].sortEnabled) {
        // if(!column.realWidth) {
        //   column.realWidth = 80
        // }
        const children = [h("span", {
          domProps: {title: column.label},
          style: {"flex": "auto"},
          class: "card-table-head-text"
        }, column.label)]
        // 筛选列和列顺序按钮
        if (this.tableHeader[$index].showColFilter) {
          children.push(h("a", {
            on: {
              click: (evt) => {
                this.filterDownIconClick(evt, column.property)
              }
            },
            style: {
              "flex": "none",
              cursor: "pointer",
              "font-size": "12px",
              "padding-left": "5px",
              "line-height": "35px"
            },
            class: ["yu-icon-arr-down1", {"active": this.colFilterMenu.show && this.colFilterMenu.curtProperty == column.property}]
          }))
        }
        // 排序按钮
        if (this.tableHeader[$index].sortEnabled) {
          children.push(h("span", {
            domProps: {title: column.label},
            class: ["sort-caret-wrap", {"active": this.sortMap[column.property]}]
          }, [
            h("a", {
              on: {
                click: () => {
                  this.clickSortBtn(column.property, this.SORT.ASC);
                }
              },
              class: ["sort-caret-btn ascending", {"active": this.sortMap[column.property] && this.sortMap[column.property].sort === this.SORT.ASC}]
            }), h("a", {
              on: {
                click: () => {
                  this.clickSortBtn(column.property, this.SORT.DES);
                }
              },
              class: ["sort-caret-btn descending", {"active": this.sortMap[column.property] && this.sortMap[column.property].sort === this.SORT.DES}]
            })
          ]))
        }
        return h("span", {
          class: "card-table-head",
          style: {
            display: "flex",
            flexFlow: "row nowrap",
            justifyContent: "space-between",
            width: "100%",
            "font-weight": "bold"
          },
        }, children)
      } else {
        return h("span", {
          class: "card-table-head-text",
          domProps: {title: column.label},
        }, column.label)
      }
    },
    /**
     * 点击下拉图标
     */
    filterDownIconClick(evt, property) {
      evt.stopPropagation();
      const evtX = evt.clientX;
      const evtY = evt.clientY;
      //菜单内部点击判断
      if (this.colFilterMenu.show) {
        const menuPos = this.$refs.colFilterMenu.getBoundingClientRect();
        if (menuPos.left <= evtX && evtX <= menuPos.right &&
          menuPos.top <= evtY && evtY <= menuPos.bottom) {
          return;
        }
      }
      // property == undefined 为屏幕其他位置点击
      // property == curtProperty 为当前按钮点击（关闭）
      // property != curtProperty 为其他下拉按钮点击，则进行位置切换
      if (property == undefined || (this.colFilterMenu.show && property == this.colFilterMenu.curtProperty)) {
        this.colFilterMenu.show = false;
        this.colFilterMenu.curtProperty = property;
        return;
      }
      // 计算位置,btX和btY为下拉按钮距离窗口左边和上边的距离
      const btX = evtX - evt.offsetX,
        btY = evtY - evt.offsetY,
        btHeight = 16, menuShowOffset = 15;
      const cardPos = this.$el.getBoundingClientRect();
      this.colFilterMenu.left = btX - cardPos.left;
      this.colFilterMenu.top = btY - cardPos.top + btHeight + menuShowOffset;
      this.colFilterMenu.show = true;
      this.colFilterMenu.curtProperty = property;
      this.colFilterMenuDrop()
    },
    /**
     * 拖动改变列展示顺序
     */
    colFilterMenuDrop() {
      if (this.sortable || !this.headerFields.some(field => field.showColFilter) || this.$refs.colFilterMenu == undefined) {
        return;
      }
      // 第二步，给列容器指定对应拖拽规则
      // 第二步，给列容器指定对应拖拽规则
      this.sortable = Sortable.create(this.$refs.colFilterMenu, {
        animation: 200,
        delay: 0,
        onEnd: (event) => {
          // 根据旧索引和新索引去更新，其实就是交换位置",
          //   event.oldIndex,
          //   event.newIndex
          if (event.oldIndex == event.newIndex) {
            return;
          }
          // 先删再添，相当于交换位置
          const tempItem = this.menuFields[event.oldIndex];
          this.menuFields.splice(event.oldIndex, 1);
          this.menuFields.splice(event.newIndex, 0, tempItem);
          // 保存拖动配置
          this.saveCfgDebounce();
        },
      });
    },
    /**
     * 重新加载数据
     */
    remoteData(params) {
      this.$refs.refTable.remoteData(params);
    },
    /**
     * 单元格单击,进行辅助
     */
    cellClick(row, column, _cell, _event) {
      const col = this.tableHeader.find(field => field.prop == column.property)
      if (col && col.copyEnabled) {
        this.copy(row[column.property])
      }
    },
    /**
     * 排序回调
     */
    sortChange() {
      this.$emit("sort", this.multiSort ? this.sort : this.sort[0])
    },
    /**
     * 点击某一列的排序按钮
     */
    clickSortBtn(prop, sort) {
      // this.sort中按照顺序记录排序点击次序
      const sortItemIndex = this.sort.findIndex(item => item.prop === prop);
      if (sortItemIndex === -1) {
        if (!this.multiSort) {
          // 单列排序模式，全部清除掉
          this.sort.splice(0, this.sort.length)
        }
        // 不存在该列相关的排序，添加
        this.sort.push({prop, sort})
      } else if (this.sort[sortItemIndex].sort === sort) {
        // 取消该列排序
        if (this.multiSort) {
          // 多列排序模式，只取消当前类别的排序
          this.sort.splice(sortItemIndex, 1)
        } else {
          // 单列排序模式，全部清除掉
          this.sort.splice(0, this.sort.length)
        }
      } else {
        // 切换当前列排序方式
        this.sort[sortItemIndex].sort = sort
      }
    },
    /**
     * 获取动态组件名字
     */
    getItemComponent(item) {
      return 'portal-cart-table-' + item.prop.toLocaleString();
    },
    /**
     * 注册动态组件
     */
    regComponents() {
      this.headerFields.forEach(field => {
        if (field.render) {
          Vue.component(this.getItemComponent(field), {
            props: {col: Object, row: Object},
            render(h) {
              return field.render(h, this.col, this.row)
            }
          })
        }
      })
    },
    /**
     * copy
     */
    copy: function (val) {
      var input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("value", this.transForm(val));
      input.style.float = "left";
      input.style.width = "2px";
      input.style.height = "2px";
      this.$el.append(input);
      input.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      input.remove();
      this.$message.success(this.$t('card.copySuccess'))
    },
    transForm: function (v) {
      return typeof v === "string" ? v : JSON.stringify(v)
    },
    /**
     * 格式化处理
     */
    formatter: function (item, value) {
      if (item.prop === 'apltAmt' || item.prop === 'contractAmt' || item.prop === 'flowExtParamName5' || item.prop === 'limitAmt') {
        if (value === '' || value === '0') {
          return value
        } else if (value === null) {
          return ''
        } else {
          return moneyFormatter(value)
        }
      } else {
        return value
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.link {
  text-decoration: underline;
  cursor: pointer;
}

::v-deep .pdr10 .cell {
  padding-right: 10px;
}

::v-deep .card-table-head-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

::v-deep .card-table-head {
  .yu-icon-arr-down1 {
    color: #949494;

    &:hover, &.active {
      color: #2877FF;
    }
  }

  .sort-caret-wrap {
    flex: none;
    width: 10px;
    padding-left: 5px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;

    .sort-caret-btn {
      display: inline-block;
      width: 0;
      height: 0;
      border: 0;
      margin: 1px 0;
      cursor: pointer;
      font-size: 12px;

      &.ascending, &.descending {
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
      }

      &.ascending {
        border-top: none;
        border-bottom: 7px solid #949494;
      }

      &.descending {
        border-bottom: none;
        border-top: 7px solid #949494;
      }

      &.active, &:hover {
        border-bottom-color: #2877FF;
        border-top-color: #2877FF;
      }
    }
  }

  // 鼠标移入显示列选择和排序图标
  .yu-icon-arr-down1:not(.active), .sort-caret-wrap:not(.active) {
    display: none;
  }

  &:hover .yu-icon-arr-down1 {
    display: inline;
  }

  &:hover .sort-caret-wrap {
    display: flex
  }

}

.yu-card-col-filter-menu {
  position: absolute;
  width: 180px;
  box-sizing: border-box;
  max-height: 230px;
  overflow-y: scroll;
  margin: 0;
  padding: 8px 0;
  background-color: #fff;
  border: 1px solid #d1dbe5;
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 12%);
  z-index: 100;

  .yu-card-col-filter-item {
    width: 100%;
    box-sizing: border-box;
    padding: 0 8px 0 10px;

    &:hover {
      background: rgba(0, 0, 0, 0.05) !important;
    }

    // 借助button组件实现多主题
    .el-button {
      width: 100%;
      line-height: 30px !important;
      height: 30px !important;
      padding: 0 !important;
      border: none !important;;
      background: none !important;
      transition: none !important;
      text-align: left !important;
      box-shadow: none !important;

      ::v-deep & > span {
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
      }

      .yu-card-col-filter-item--label {
        flex: auto;
        color: inherit;
        // check图标
        ::v-deep .el-checkbox__inner {
          width: 18px;
          height: 18px;

          &::after {
            width: 4px;
            height: 8px;
            left: 5px;
            top: 1px;
          }
        }

        // label文字
        ::v-deep .el-checkbox__label {
          font-size: 12px;
          padding-left: 7px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .yu-card-col-filter-item--icon {
        flex: none;
        color: #BBBBBB;
        width: 16px;
        height: 16px;
        cursor: move;
      }

      &:hover .yu-card-col-filter-item--icon {
        color: inherit;

      }
    }
  }
}

::v-deep .el-pagination {
  padding-top: 10px !important;
}

// 控制是否显示分页列表数组
::v-deep .no-el-pagination__sizes {
  .el-pagination__sizes {
    display: none;
  }
}

// 控制操作栏中按钮间距
::v-deep .cell .yu-buttons {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;

  & > .el-button, & > .el-dropdown {
    margin-left: 8px !important;
    text-align: center;
    flex: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & .el-button ~ .el-button {
    margin-left: 8px !important;
  }
}
</style>
