/**
* Desc:&emsp;&ensp;客户管理V2卡片
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/9/15
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-table-chart
    ref="refTable"
    :table-id="dataId+''"
    :card-name="$t('card.cusMgr.title')"
    :search-place-holder="$t('card.cusMgr.placeholder')"
    :more-info-click-fn="moreInfoClickFn"
    :active-mode.sync="activeMode" :modes="modes"
    :data-url="tableDataUrl" request-type="POST" :default-load="true"
    :headerFields="headerFields" :searchDimOpts="searchDimOpts" :buttons="buttons"
    @search-change="searchChange"
    border row-height="35px"
  >
    <pie-charts slot="chart"
                :checks="chart.chartChecks"
                :data="chart.data"
                :cover-options="coverOptions" :legend-words="4"
                @change-checkbox="changeChart('checkBox',$event)"></pie-charts>
  </card-table-chart>
</template>

<script>
import config from "@/config/index.js";
import cardTableChart from "@/views/portal/card/components/card-tableChart";
import pieCharts from "@/views/portal/card/components/charts/pieCharts";
import corpPsMixin from "@/views/portal/card/routes/config/corpPsMixin";
import {lookup} from "@/utils";

lookup.reg("CORP_CUS_TYP,CUS_TYPE,CUS_STS");

export default {
  name: "myClientV2",
  components: {cardTableChart, pieCharts},
  mixins: [corpPsMixin],
  props: {
    dataId: {
      type: Number,
      require,
    },
    reqData:{
      type: Object,
      default() {
        return {};
      }
    },
  },
  data: function () {
    return {
      chart: {
        chartChecks: [{label: this.$t('card.cusMgr.hasTempCus'), value: true}],
        data: [
          {value: 0, label: this.$t('card.cusMgr.frmlCus')},
          {value: 0, label: this.$t('card.cusMgr.tempCus'), show: true}
        ],
        sum: 0,
      }
    }
  },
  computed: {
    // 需要覆盖pie chart中默认options的部分
    // 此处覆盖会使用深度合并对象来处理，而非Object.assign的浅合并
    coverOptions() {
      return {
        title: {
          text: '{a|' + this.chart.sum + '}\n{c| }\n{b|' + this.$t('card.cusMgr.cusTot') + '}',
          textStyle: {
            rich: {
              a: {
                fontSize: '20',
                color: '#666666',
              },
              b: {
                fontSize: '14',
                color: '#666666',
              },
              c: {
                fontSize: '6',
              }
            }
          },
        },
        tooltip: {
          formatter: (params) => {
            return `${params.marker}${params.name}<br/>&emsp;${this.$t('card.cusMgr.cusNum')}：${params.value}<br/>&emsp;${this.$t('card.cusMgr.population')}：${params.percent.toFixed(1)}%`
          }
        }
      }
    },
    // 筛选下拉选项
    searchDimOpts() {
      return this.corpPsConfig[this.activeMode].headerFields.filter(item => item.isSel).map(item => ({
        label: item.label,
        value: item.prop,
        dataCode: item.dataCode
      }))
    },
  },
  watch: {
    statUrl: {
      handler() {
        this.getPieChartData();
      },
      immediate: true
    }
  },
  mounted() {
    if (config.isdebug) {
      setTimeout(() => {
        window.debugV2 = this;
      }, 100)
    }
  },
  methods: {
    /**
     * 跳转到二级页面
     */
    moreInfoClickFn(e) {
      //this.clickEvent({'recordType':1, "module": 3, 'cardType':this.reqData.cardTypeCode, 'eventType':1, 'cardId':this.reqData.cardId, 'pageLevel':1, 'outLink':0}, e)
      const route = '/portal/card/subPages/cusMgr';
      this.$router.addRoute(route, this.$t('card.cusMgr.title'));
      this.$router.push({path: route, query: {mode: this.activeMode}});
    },
    /**
     * 获取客户数据
     */
    searchChange(searchFormData, cb, baseParams = {}) {
      const params = {}
      if (searchFormData.searchVal != "") {
        params.keyWord = searchFormData.searchVal
      }
      if (searchFormData.searchDimValue != "_ALL") {
        params[searchFormData.searchDim] = searchFormData.searchDimValue
      }
      if (this.hisParams == null) {
        this.hisParams = {}
      }
      Object.assign(params, baseParams)
      if (JSON.stringify(this.hisParams) == JSON.stringify(params)) {
        return;
      }
      this.hisParams = params;
      // 获取饼图数据
      this.getPieChartData(params)
      // 调用xtable的remote方法
      cb(params);
    },
    /**
     * 获取饼图数据
     */
    getPieChartData(params = {}) {
      this.$request({
        url: this.statUrl,
        data: params,
        method: "POST"
      }).then(res => {//解决res不存在code直接报错问题
        if (res && res.code === "0") {
          this.chart.sum = res.data.cusTotNum || 0;
          this.chart.data[0].value = res.data.frmlCusNum || 0;
          this.chart.data[1].value = res.data.tempCusNum || 0;
        } else {
          if(res && res.message) {
            this.$message.error(res.message);
          }
        }
      })
    },
    /**
     * 切换chart数据
     */
    changeChart(type, data) {
      if (type == "checkBox") {
        this.chart.data[1].show = data;
      }
    },
  }
}
</script>

