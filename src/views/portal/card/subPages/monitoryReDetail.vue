/**
* Desc: 还款监控二级页面
* @author  陈祖英
* @date    2022/10/18
* @since   1.0.0
* @version 1.0
*/
<template>
  <div class="cus-mgr-v2-sub-wrap">
    <yu-panel>
      <div class="title">
        <span class="h1">还款监控详情</span>
        <span>{{ orgName }} {{ new Date().toPreMonthLastDay() }}</span>
      </div>
      <yu-tabs v-model="activeMode" @tab-click="changeMode">
        <yu-tab-pane v-for="(tab,i) in modes" :key="i" :label="'    '+tab.label+'    '" :name="tab.value"></yu-tab-pane>
      </yu-tabs>
      <div class="body">
        <div class="cus-search">
          <div class="tag-select-wrap">
            <yu-xform class="el-form-search" ref="refFormDemo" label-width="100px" v-model="formData">
              <yu-xform-group :column="4">
                <yu-xform-item label="客户名称" ctype="input" name="cusName" :placeholder="$t('card.qsr')"></yu-xform-item>
                <yu-xform-item label="合同编号" ctype="input" name="cusId" :placeholder="$t('card.qsr')"></yu-xform-item>
                <yu-xform-item label="客户经理" ctype="input" name="manMgrName" :placeholder="$t('card.qsr')"></yu-xform-item>
                <yu-xform-item
                  name="orgId"
                  :label="$t('sysUserManager.ssjg')"
                  ctype="custom"
                >
                  <yu-combo-tree
                    ref="searchTree"
                    v-model="searchOrgName"
                    :placeholder="$t('sysUserManager.qxz')"
                    :local-data="orgTreeData"
                    data-id="orgId"
                    data-label="orgName"
                    data-pid="upOrgId"
                    :clearable="true"
                    @node-click="changeOrgIdFnSearch($event, false)"
                    @clear="clearUpOrgIdFn(false)"
                    :filter-node-method="filterNodeSearch"
                    :all-node-value="true"
                    :max-height="400"
                  >
                  </yu-combo-tree>
                </yu-xform-item>
                <div class="search-btn" slot="custom" style="font-size:0px;">
                  <div class="el-col el-col-6" style="float:right;">
                    <div class="search-btn-group" style="padding-left: 100px;">
                      <yu-button type="primary" @click="tempBtnFn">{{
                        $t('card.cusMgr.query')
                      }}
                      </yu-button>
                      <yu-button @click="reset">{{ $t('card.cusMgr.reset') }}</yu-button>
                      <yu-button style="margin-left:10px;position:absolute;top:-60px;right:70px;" @click="tempBtnFn">
                        刷新
                      </yu-button>
                      <yu-button style="position:absolute;top:-60px;right:0;" @click="tempBtnFn">
                        下载
                      </yu-button>
                    </div>
                  </div>
                
                </div>
              </yu-xform-group>
            </yu-xform>
            <xtableHeaderDrag ref="xtableHeaderDragMoni"
                              :data-url="tableDataUrl" request-type="POST"
                              border :headerFields="headerFields"
                              :default-load="true" 
                              row-height="35px"></xtableHeaderDrag>
          </div>
        </div>
      </div>
    </yu-panel>
  </div>
</template>

<script>
import config from "@/config/index.js";
import { mapGetters } from "vuex";
import { checkBelongToChooseNode } from "@/utils/util";
import xtableHeaderDrag from "@/views/portal/card/components/xtableHeaderDrag";
export default {
  name: "cusMgr",
  components: {xtableHeaderDrag},
  // mixins: [corpPsMixin],
  props: {},
  data: function () {
    return {
      searchOrgName:'',
      tempArray: '',
      baseParams: {page:1, size:10},
      getDataTime: "2022-09-03 11:22:00",
      activeMode: "1",
      modes: [
        {label: "3日本息未足额", value: "1"},
        {label: "当天到期未还", value: "2"},
        {label: "当天新增逾期", value: "3"},
        {label: "7日净新增逾期", value: "4"},
      ],
      tableDataUrl: backend.mockService + "/monitoryRepayment/list",
      headerFields: [
        {
          label: "序号",
          prop: "",
          show: true,
          width: 55
        },
        {
          label: "客户名称",
          prop: "customerName",
          show: true,
          // 超链接
          handleClick: this.tempBtnFn,
          minWidth: 100
        },
        {
          label: "业务品种",
          prop: "ywpz",
          show: true,
          handleClick: this.tempBtnFn,
          // 不允许在列信息过滤中进行修改
          minWidth: 100
        }, {
          label: "币种",
          prop: "currency",
          show: true,
          filter: true,
        }, {
          label: "余额（万元）",
          prop: "ye",
          handleClick: this.tempBtnFn,
          moneyFormatter: true,
          moneyFormatterNum: 2,
          show: true,
          showOverflowTooltip: true
        }, {
          label: '应还利息金额（万元）',
          prop: 'yhlxje',
          moneyFormatter: true,
          moneyFormatterNum: 2,
          show: true,
        }, {
          label: '应还分期还本金额（万元）',
          prop: 'yhfqhbje',
          moneyFormatter: true,
          moneyFormatterNum: 2,
          show: true,
        }, {
          label: '发放日',
          prop: 'ffr',
          show: true,
        }, {
          label: '到期日',
          prop: 'dqr',
          show: true,
        }, {
          label: '账户余额（万元）',
          prop: 'zhye',
          moneyFormatter: true,
          moneyFormatterNum: 2,
          show: true,
        }, {
          label: '是否足额',
          prop: 'sfze',
          show: true
        },
        {
          label: '客户经理',
          prop: 'cusManager',
          show: true,
        },
        {
          label: '客户风险经理',
          prop: 'ghfxjl',
          show: true,
        },
        {
          label: '客户部门',
          prop: 'ghbm',
          show: true,
        },
        {
          label: '所属分行',
          prop: 'org',
          show: true,
        },
      ],
      formData: {},
      orgInfoMap: {}, // 机构数map数据
      // 概况分析
      cusSearch: {
        allCheck: [{key: "_ALL", value: "全部"}],
        checkList: [],
        checkForm: {},
        orgTreeParams: {
          dataId: 'orgId',
          dataLabel: 'orgName',
          dataPid: 'updptId',
          dataUrl: backend.appOcaService + '/api/adminsmorg/treequeryauth',
          placeholder: this.$t('sysUserManager.qxz'),
          searchKey: 'orgName', // 树过滤关键字
          dataParams: {
            orgSts: ''
          }
        },
      },
    }
  },
  computed: {
    // tableDataUrl() {
    //   return this.corpPsConfig[this.activeMode].tableDataUrl
    // },
    ...mapGetters([
      "selectedRoles", "orgTreeData"
    ]),
    orgName() {
      if (this.selectedRoles) {
        return `${this.selectedRoles.orgName}`;
      }
      return "";
    },
  },
  watch: {
    activeMode: {
      handler: function (mode) {
        // 切换下边的列表选项
        // const cusSearch = this.corpPsConfig[mode].subPage.cusSearch;
      },
      immediate: true
    }
  },
  mounted() {
    if (config.isdebug) {
      setTimeout(() => {
        window.debug = this;
        this.renderOrg();
      }, 100)
    }
  },
  methods: {
    renderOrg() {
      this.$nextTick(() => {
        this.$store.dispatch("funData/orgTreeFn");
        this.orgTreeToMap();
      });
    },
    orgTreeToMap() {
      const _this = this;
      function fn(arr) {
        arr.forEach(item => {
          _this.orgInfoMap[item.orgId] = item.orgName;
          if (item.children) {
            fn(item.children);
          }
        });
      }
      fn(this.orgTreeData);
    },
    /**
     * 精确机构树搜索
     * @param value 当前输入信息
     * @param nodeData 当前节点属性信息
     * @param node 当前节点信息
     */
    filterNodeSearch: function(value, nodeData, node) {
      if (!this.$refs.searchTree.selectedLabel) {
        return true;
      }
      if (
        nodeData.orgName.indexOf(this.$refs.searchTree.selectedLabel) !== -1
      ) {
        return true;
      }
      return checkBelongToChooseNode(
        this.$refs.searchTree.selectedLabel,
        node,
        "orgName"
      );
    },
    loadTable(data) {
      //初始化
      // console.log(data, '初始获取当前表格等====')
    },
    changeMode() {
      // todo 加载数据
      // this.$refs.xtableHeaderDrag.clearData();
      // this.$refs.xtableHeaderDrag.remoteData();
    },
    // 选择机构
    selectOrg(node) {
      this.formData.orgId = node.orgId
    },
    /**
     * 通过所属机构查询
     * @param node 点击的节点信息
     * @param immidately 是否立即执行查询，区分快速查询和精确查询
     */
    changeOrgIdFnSearch: function (node, immidately) {
      if (immidately) {
        this.orgName = node.orgId;
        // this.exportParam = {
        //   orgId: node.orgId,
        //   keyWord: this.$refs.panel.inputVal,
        // };
        this.$refs.xtableHeaderDragMoni.remoteData({
          orgId: node.orgId,
          keyWord: this.$refs.panel.inputVal,
        });
        return;
      }
      this.formData.orgId = node.orgId;
      this.searchOrgName = node.orgId;
      // this.exportParam = { orgId: node.orgId };
    },
    /**
     * 清空所属机构查询条件
     * @param immidately 是否立即执行查询，区分快速查询和精确查询
     */
    clearUpOrgIdFn: function (immidately) {
      if (immidately) {
        this.$refs.xtableHeaderDragMoni.remoteData({
          orgId: "",
          keyWord: this.$refs.panel.inputVal,
        });
        return;
      }
      this.formData.orgId = "";
      this.searchOrgName = "";
    },
    /**
     * 清空所属机构查询条件
     * @param immidately 是否立即执行查询，区分快速查询和精确查询
     */
    // clearUpOrgIdFn: function () {
    //   this.$refs.refFormDemo.resetFields();
    //   this.formData.orgId = "";
    //   this.searchOrgName = "";
    // },
    // 查询，顺便重置tag信息
    search() {
      const formData = this.formData;
      const searchFormData = Object.keys(formData).reduce((obj, k) => {
        if (formData[k] && k !== "tagSelect") {
          obj[k] = k === 'orgId' ? formData[k] : ('%' + formData[k] + '%')
        }
        return obj
      }, {})
      if (Object.keys(searchFormData).length !== 0) {
        // this.resetTag();
        this.$refs.xtableHeaderDragMoni.remoteData(searchFormData)
      }else{
        this.$message.warning(this.$t('card.qsr'))
      }
    },
    // 重置
    reset() {
      // this.resetTag();
      this.$refs.refFormDemo.formdata.orgId = '';
      this.formData.orgId = ''
      this.searchOrgName = '';
      this.$refs.refFormDemo.resetFields();
    },
    // 筛选tag重置为全部
    // resetTag() {
    //   this.cusSearch.checkList.forEach(item => this.tagSelectChange(item, {key: "_ALL", value: true}, true));
    // },
    tempBtnFn() {
      this.$message("功能开发中，敬请期待。");
    },
  },
}
</script>

<style lang="scss" scoped>
.cus-mgr-v2-sub-wrap {
  /* height: calc(100% - 24px); */
  box-sizing: border-box;
  /* //calc(100% - 24px); */
  width: 100%;
  /* overflow-y: scroll; */
}
::v-deep .el-tabs {
  height: 48px;

  .el-tabs__header {
    margin: 0;

    .el-tabs__item {
      height: 48px;
      line-height: 48px;
      font-size: 16px;
      white-space: pre;
      padding: 0;
    }
  }

  .el-tabs__content {
    display: none;
  }
}

::v-deep .rank-wrap
{
  .rank-item>div{
    flex:0 1 auto;
    text-align: right;
  }
} 
.body {
  width: 100%;
  /* padding: 0 16px 16px 16px; */
  box-sizing: border-box;

  & > div {
    width: 100%;
  }
}

.title {
  width: 100%;
  height: 50px;
  line-height: 50px;

  .h1 {
    margin:0 4px 0 16px;
    font-size: 20px;
    font-weight: bold;
    color: #222222;
  }

  .h2 {
    margin-left: 9px;
    color: #666666;
  }
}

.cus-search {
  margin-top: 16px;
  /* ::v-deep .el-form {
    margin-top: 16px;
    .el-form-item {
      margin-bottom: 8px;
    }
  } */
}
</style>
