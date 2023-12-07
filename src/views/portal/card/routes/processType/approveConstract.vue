/**
* Desc: 合同审批任务
* @author  陈祖英
* @date    2022/10/11
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-wrap :cardName="cardName">
    <template class="top-center" slot="topCenter">
      <div class="search">
        <yu-input class="search-item search-input autocomplete-reset" :placeholder="$t('card.constract.placeholder')"
                  suffix-icon="el-icon-search" v-model.lazy.trim="searchVal" clearable @change="searchChange">
        </yu-input>
      </div>
    </template>
    <template slot="menus">
      <li @click="toConfigPage">{{ $t('card.configTurn') }}</li>
      <li @click="jumpProcessCenter('allPrepare','undeal')">{{ $t('card.cardmore') }}</li>
    </template>
    <div class="yu-grid">
      <yu-row :gutter="16">
        <yu-col :span="18">
          <xtableHeaderDrag
            :table-id="dataId+''"
            v-on="$listeners" v-bind="$attrs"
            ref="approveConstractTable"
            :headerFields="headerFields"
            no-page-sizes
            :page-size="5" :page-sizes="[5]"
            :buttons="buttons"
            @sort="sortChange"
            @row-click="getNewConfig"
            :data-url="$backend.portalService + '/api/xmhconttask/list'"
            border
            @loaded="loadTable"
            style="width: 100%">
          </xtableHeaderDrag>
        </yu-col>
        <yu-col :span="6">
          <processConfig ref="processConfig" :configWidth="configWidth" :configdata="configData"></processConfig>
        </yu-col>
      </yu-row>
    </div>
  </card-wrap>
</template>
<script>
import xtableHeaderDrag from "@/views/portal/card/components/xtableHeaderDrag";
import cardWrap from "@/views/portal/card/components/card-wrap";
import YuCardEmpty from "@/views/portal/card/components/empty.vue";
import processConfig from "@/views/portal/card/components/process-config.vue";
export default {
  name: "approveConstract",
  components: {
    cardWrap,
    YuCardEmpty,
    processConfig,
    xtableHeaderDrag
  },
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t("card.approveContract");
      },
    },
    dataId: {
      type: Number,
      require,
    },
  },
  data() {
    return {
      configWidth:100,
      headerFields: [{
        label: '任务流水号',
        prop: 'busiNo',
        show: true,
        showColFilter: true,
        minWidth:110,
        disabled: true,
        handleClick: this.tempBtnFn,
        // 排序
        sortEnabled: true
      }, {
        label: "合同编号",
        prop: "contNo",
        minWidth:100,
        show: true,
        showColFilter: true,
        // 排序
        sortEnabled: true
      }, {
        label: "合同类型",
        prop: "contTyp",
        show: true,
        dataCode:'CTRT_TYPE',
        showOverflowTooltip: true,
        // 排序
        sortEnabled: true
      }, {
        label: "客户编号",
        prop: "cusNo",
        show: true,
        // 排序
        sortEnabled: true
      }, {
        label: "客户名称",
        prop: "cusName",
        handleClick: this.tempBtnFn,
        show: true,
        // 排序
        sortEnabled: true
      }, {
        label: '币种',
        prop: 'coinTyp',
        show: true,
      }, {
        label: '金额(万元)',
        prop: 'contMoney',
        moneyFormatter: true,
        show: true,
        minWidth:90,
        showOverflowTooltip: true,
        // 排序
        sortEnabled: true
      }, {
        label: '责任机构',
        prop: 'respOrg',
        show: true,
        // 排序
        sortEnabled: true
      }, {
        label: '登记日期',
        prop: 'regDate',
        show: true,
        // 排序
        sortEnabled: true
      }],
      searchVal: "",
      debounce: 100,
      configData:[],
    };
  },
  computed: {
    buttons() {
      return [{label: "处理", handleClick: this.tempBtnFn}]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.configWidth = this.$refs.processConfig.$el.offsetWidth
    })
  },
  methods: {
    // 跳转到进度中心
    jumpProcessCenter(activeMode, mode, item) {
      const tarRoute = this.$router.match("/portal/card/processCenter/processCenter");
      if (tarRoute) {
        this.$router.push({
          path: tarRoute.path,
          query: Object.assign({activeMode:activeMode, mode:mode}, item ? {type: item.label} : {})
        })
      } else {
        this.$message.warning(this.$t('card.complTrans.noAccessOfPrcCenter'))
      }
    },
    //点击字段排序
    sortChange(sortObj) {
      var param = {
        keyWord: this.searchVal,
        sort: sortObj == null ? "" : (sortObj.prop + " " + sortObj.sort),
      };
      this.$refs.approveConstractTable.remoteData(param);
    },
    //点击配置到二级页面
    toConfigPage() {
      this.$router.push('/content/portalManager/constractApprovelConfigs/constractApprovelConfig')
    },
    //查询条件
    searchChange() {
      const likeSearchVal = this.searchVal;
      const params = {
        cusNo: likeSearchVal,
        cusName: likeSearchVal,
        busiNo: likeSearchVal
      }
      this.$refs.approveConstractTable.remoteData(params);
    },
    // 默认第一行选中
    loadTable(_data, _total, res) {
      if(res.data && res.data.length) {
        this.getConfigDataById(res.data[0].contTyp);
      }else{
        this.configData = []
      }
    },
    configTurn() {
      //跳转到作台管理-合同审核要点配置页面。
      this.$message("功能开发中，敬请期待。");
    },
    searchContent(_queryString, cb) {
      // 只取第一条数据
      this.debouncedGetCustomerList({
        page: 1,
        size: 5,
      }, cb);
    },
    getNewConfig(row) {
      this.getConfigDataById(row.contTyp);
    },
    //通过id获取到相应的配置数据
    getConfigDataById(id) {
      const _this = this;
      _this.$request({
        url: `${_this.$backend.portalService}/api/xmhcontexamconf/list`,
        data:
          {
            contractType: id,
          },
      }).then((res) => {
        if (res.code === "0") {
          _this.configData = res.data
        }
      });
    },
    tempBtnFn() {
      this.$message("功能开发中，敬请期待。");
    },
  },
};
</script>

  <style lang="scss" scoped>
  .autocomplete-reset{
    width: 240px;
    padding-left:22px;
  }
  .my-client-wrap {
    padding-top: 12px;
  }
  .top-center {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  .search {
    margin-left: 24px;

    .search-item {
      margin-left: 10px;

      &:first-of-type {
        margin-left: 0;
      }
    }

    .search-input {
      width: 240px
    }

    .search-select {
      width: 128px
    }
  }
}
  .yu-grid {
    background: #ffffff;
    /* padding: 30px 0 0; */
    &-item {
      margin-bottom: 46px;
      text-align: center;
      &-num {
        line-height: 56px;
        font-size: 24px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #333333;
      }
      .blueStyle {
        color: #2877ff;
      }
      &-text {
        display: block;
        padding: 0 12px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        border-radius: 4px;
        font-size: 14px;
        background: #f5f5f5;
        font-family: MicrosoftYaHei;
        color: #666666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &-client-wrap {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    &-client {
      display: flex;
      align-items: center;
      font-size: 0;
      overflow: hidden;
      .client-icon {
        position: relative;
        display: flex;
        box-sizing: border-box;
        width: 40px;
        height: 40px;
        border: 1px solid #e0e0e0;
        border-radius: 20px;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        cursor: pointer;
        img {
          float: none;
          &.manage {
            width: 24px;
            height: 24px;
          }
        }
        &-svg {
          font-size: 16px;
        }
      }
      .client-text {
        flex: 1;
        color: #333333;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  </style>
