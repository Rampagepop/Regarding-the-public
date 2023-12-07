/**
* Desc:&emsp;&ensp;授信审批V2卡片
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/9/15
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-table-chart
    :table-id="dataId+''"
    :card-name="$t('card.creditApprove.title')"
    :search-place-holder="$t('card.creditApprove.placeholder')"
    :data-url="tableDataUrl" request-type="POST"
    border
    :headerFields="headerFields"
    row-height="35px" :buttons="buttons"
    :default-load="true"
    :isConfigWrapMenu="true"
    @search-change="searchChange"
  >
    <div slot="chart" class="stat-wrap">
      <div class="stat-item" v-for="(item,i) in statIdxes" :key="i">
        <div class="value">{{ item.value }}</div>
        <div class="label">{{ item.label }}</div>
      </div>
      <div class="stat-item" v-for="(item,i) in charts.bars" :key="i+statIdxes.length">
        <div style="height:calc(100% - 14px)">
          <vert-bar
            :title="item.title" :data="item.data"
            :cover-options="charts.coverOptions(i)"
          ></vert-bar>
        </div>
        <div class="chartText">{{ item.title }}</div>
      </div>
      <div class="tip">*注：按行业与企业规模划分客户</div>
    </div>

  </card-table-chart>
</template>

<script>
import config from "@/config/index.js";
import cardTableChart from "@/views/portal/card/components/card-tableChart";
import vertBar from "@/views/portal/card/components/charts/vertBar";
import {lookup} from "@/utils";

lookup.reg("CORP_CUS_TYP,CUS_TYPE,CUS_STS");

export default {
  name: "creditApprove",
  components: {cardTableChart, vertBar},
  mixins: [],
  props: {
    dataId: {
      type: Number,
      require,
    },
  },
  data: function () {
    return {
      tableDataUrl: backend.mockService + "/creditApprove/list",
      headerFields: [{
        label: "任务流水号",
        prop: "taskId",
        show: true,
        // 超链接
        handleClick: this.tempBtnFn,
        // 点击单元格直接复制
        copyEnabled: true,
        minWidth: 100,
        // 不允许在列信息过滤中进行修改
        disabled: true,
        showColFilter: true,
        sortEnabled: true
      }, {
        label: "客户名称",
        prop: "cusName",
        show: true,
        // 超链接
        handleClick: this.tempBtnFn,
        copyEnabled: true,
        minWidth: 100,
        showColFilter: true,
        sortEnabled: true
      }, {
        label: "客户编号",
        prop: "cusId",
        show: false,
        copyEnabled: true,
        sortEnabled: true
      }, {
        label: "授信类型",
        prop: "creditTyp",
        show: true,
        sortEnabled: true
      }, {
        label: "业务品种",
        prop: "bizTyp",
        show: true,
        showOverflowTooltip: true,
        sortEnabled: true
      }, {
        label: '授信申请方式',
        prop: 'creditApplyTyp',
        show: true,
        copyEnabled: true,
        sortEnabled: true
      }, {
        label: '授信金额（万元）',
        prop: 'creditAmt',
        width: 135,
        show: true,
        moneyFormatter: true,
        align: "right",
        sortEnabled: true
      }, {
        label: '授信期限',
        prop: 'ddl',
        show: true,
        sortEnabled: true
      }, {
        label: '经办机构',
        prop: 'org',
        show: true,
        sortEnabled: true
      }, {
        label: '审批时长',
        prop: 'approveTime',
        show: true,
        width: 120,
        showOverflowTooltip: false,
        sortEnabled: true,
        getBgc: num => {
          if (num < 25) {
            return "#1ABE95"
          } else if (num < 50) {
            return "#fceb4d"
          } else if (num < 75) {
            return "#FC974D"
          } else {
            return "#FF3B30"
          }
        },
        render: (h, col, row) => {
          return h("div", {
            class: "approve-process-wrap",
          }, [h("div", {
            style: {
              width: row.approveTime + "%",
              background: col.getBgc(row.approveTime)
            }
          }, null)])
        }
      }],
      buttons: [{label: "处理", handleClick: this.tempBtnFn}],
      // 统计指标
      statIdxes: [
        {value: '106', label: '历史申请笔数'},
        {value: '98', label: '审批通过笔数'},
        // 保留一位小数
        {value: '68.0%', label: '批核率'},
        {value: '1.2%', label: '不良率（还原核销）'}
      ],
      charts: {
        bars: [
          {
            title: "授信金额区间",
            data: [
              {value: 20, label: '10万以内'},
              {value: 40, label: '10万-50万'},
              {value: 30, label: '50万-100万'},
              {value: 20, label: '100万-1000万'},
              {value: 15, label: '1000万以上'}],
            valueFormatter(val) {
              return "（该类企业中，" + val + "%的批复所处的授信区间）";
            }
          },
          {
            title: "授信期限",
            data: [
              {value: 20, label: '半年内'},
              {value: 30, label: '半年至一年内'},
              {value: 40, label: '一年至三年'},
              {value: 15, label: '三年以上'}],
            valueFormatter(val) {
              return "（该类企业中，" + val + "%的批复涉及的授信期限）";
            }
          },
          {
            title: "还款方式",
            data: [
              {value: 40, label: '等额本金'},
              {value: 30, label: '等额本息'},
              {value: 20, label: '到期还本付息'},
              {value: 20, label: '按期结息到期不还本'},
              {value: 15, label: '按期结息到期还本'}],
            valueFormatter(val) {
              return "（该类企业中，" + val + "%的批复涉及的还款方式）";
            }
          },
          {
            title: "授信品种",
            data: [
              {value: 20, label: 'A'},
              {value: 40, label: 'B'},
              {value: 30, label: 'C'},
              {value: 20, label: 'D'},
              {value: 15, label: 'E'}],
            valueFormatter(val) {
              return "（该类企业中，" + val + "%的批复对应的授信品种）";
            }
          }
        ],
        // 计算tooltip显示位置
        coverOptions: (index) => ({
          formatter: (params) => {
            return params[0].marker + params[0].axisValue + "<br/>" +
              this.charts.bars[index].valueFormatter("<strong>" + params[0].value + "</strong>")
          },
          tooltip: {
            // 178%是测试得出的在wrap过小时不超过wrap容器而显示的最大百分比(wrap设置了overflow:hidden)
            // max-width是能让文字不自动换行所需的最小宽度，在wrap过大时,能避免过多空白
            // white-space:pre-wrap：tooltip限制宽度后超出的宽度的文本是不会换行的，因此添加超出自动换行
            extraCssText: 'width:178%;max-width:290px;white-space:pre-wrap',
            position: function () {
              // index%2==0 靠左侧边
              // index%2==1 靠右侧边
              const obj = {top: -50};
              obj[['left', 'right'][index % 2]] = 10;
              return obj;
            }
          }
        }),
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.initChart();
    if (config.isdebug) {
      setTimeout(() => {
        window.debugCreditApprove = this;
      }, 100)
    }
  },
  methods: {
    // 获取客户数据
    searchChange(searchFormData, cb) {
      const params = {
        keyWord: searchFormData.searchVal,
      }
      // 调用xtable的remote方法
      cb(params);
    },
    tempBtnFn() {
      this.$message("功能开发中，敬请期待。");
    },
    /**
     * 初始化图表数据
     */
    initChart() {
      // 组装数据
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .approve-process-wrap {
  margin-top: 15px;
  width: 100px;
  height: 6px;
  border-radius: 3px;
  background: #E0E0E0;

  & > div {
    height: 6px;
    border-radius: 3px;
  }
}

.stat-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-flow: row wrap;
  justify-content: center;
  align-content: flex-start;
  position: relative;


  .stat-item {
    flex: auto;
    width: 50%;
    // 留出底部tip区域
    height: calc(25% - 5px);
    box-sizing: border-box;

    .value {
      width: 100%;
      height: 50%;
      text-align: center;
      vertical-align: bottom;
      font-size: 24px;
      font-weight: bold;
      color: #333333;
    }

    .label {
      width: 100%;
      height: 50%;
      text-align: center;
      vertical-align: top;
      color: #666666;
      font-size: 14px;
    }

    .chartText {
      text-align: center;
      width: 100%;
      font-size: 14px;
      line-height: 14px;
      color: #666666;
    }
  }

  .tip {
    width: 100%;
    padding-left: 24px;
    text-align: left;
    color: #aaaaaa;
    font-size: 12px;
    line-height: 12px;
    margin-top: 8px;
  }
}
</style>

