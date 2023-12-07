/**
* Desc:&emsp;&ensp;我的客户v1卡片
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/9/15
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-search-chart-btx
    :card-name="$t('card.cusMgr.myCusTitle')"
    :notice="$t('card.cusMgr.notice').replace('$',dataDate)"
    :more-info-click-fn="moreInfoClickFn"
    :search-props="searchProps"
    :buttons="buttons"
    :max-length="6"
    :row-buttons-num="2">
    <div slot="chart" class="chart-wrap">
      <empty-img v-if="!showData"></empty-img>
      <div v-if="showData" class="chart-item">
        <horBar :data="horBar.data"></horBar>
      </div>
      <div v-if="showData" class="chart-item">
        <pie-charts
          :data="pieCharts.data"
          :cover-options="pieCharts.coverOptions"
          :left="0"
        ></pie-charts>
      </div>
    </div>
  </card-search-chart-btx>
</template>

<script>
import config from "@/config/index.js";
import emptyImg from "@/views/portal/card/components/empty-img"
import cardSearchChartBtx from "@/views/portal/card/components/card-searchChartBtx";
import horBar from "@/views/portal/card/components/charts/horBar";
import pieCharts from "@/views/portal/card/components/charts/pieCharts";
import {keywordLight} from "@/utils/util";

import Vue from "vue";
import multiSystemCfg from "@/config/multisystem";

// 搜索结果
Vue.component('my-client-search-item', {
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
      require: true
    },
  },
  computed: {
    keywords() {
      return this.$parent.$parent.$parent.value
    }
  },
  render(h) {
    const item = this.item;
    return h("ul", {
      class: "yu-customer-item",
      on: this.$listeners
    }, [
      h("li", {class: "c1"}, [h("span", {
        class: "title", domProps: {
          innerHTML: keywordLight(item.cusName, this.keywords),
        }
      })]),
      h("li", null, [
        h("label", null, "编号："),
        h("span", {
          domProps: {
            innerHTML: keywordLight(item.cusId, this.keywords),
          }
        })]),
      h("li", null, [
        h("label", null, "证件号码："),
        h("span", {
          domProps: {
            innerHTML: keywordLight(item.idNo, this.keywords),
          }
        })])
    ])
  }
});

export default {
  name: "myClientV1",
  components: {emptyImg, pieCharts, cardSearchChartBtx, horBar},
  mixins: [],
  props: {
    reqData:{
      type: Object,
      default() {
        return {};
      }
    },
  },
  data: function () {
    const getTitle = (num) => {
      return '{a|' + num + '}\n{c| }\n{b|' + this.$t('card.cusMgr.hvLoanCus') + '}'
    }
    const date = new Date();
    date.setDate(date.getDate() - 1)
    return {
      showData: false,
      dataDate: date.toJSON(),
      horBar: {
        data: [{label: this.$t('card.cusMgr.frmlCus'), value: 80}, {label: this.$t('card.cusMgr.tempCus'), value: 32}]
      },
      pieCharts: {
        getTitle,
        data: [{label: this.$t('card.cusMgr.hvLoanCus'), value: 52}, {
          label: this.$t('card.cusMgr.other'),
          value: 80 - 52
        }],
        coverOptions: {
          color: ["#2877FF", "#D0D0D0"],
          title: {
            text: getTitle(52),
            textStyle: {
              rich: {
                a: {
                  fontWeight: 'bold',
                  fontSize: '24',
                  color: '#333333',
                },
                b: {
                  fontSize: '14',
                  color: '#333333 ',
                },
                c: {
                  fontSize: '6',
                }
              }
            },
            left: '50%'
          },
          series: {
            radius: [36, 52],
            center: ['50%', '50%'],
          },
          legend: {
            show: false
          },
        }
      }
    }
  },
  computed: {
    buttons() {
      return [
        {
          label: this.$t('card.cusMgr.addCorp'),
          handleClick: () => {
            this.routeToCreditSys("addCorp");
          }
        },
        {
          label: this.$t('card.cusMgr.addPs'),
          handleClick: () => {
            this.routeToCreditSys("addPs");
          }
        },
        {
          label: this.$t('card.cusMgr.addTradeCus'),
          handleClick: () => {
            this.routeToCreditSys("cusSharingApply");
          }
        },
        {
          label: this.$t('card.cusMgr.importRiskCus'),
          handleClick: () => {
            this.routeToCreditSys("groupCorpIdentify");
          }
        },
      ]
    },
    searchProps() {
      const _this = this;
      return {
        // 搜索展示自定义组件
        customItem: "my-client-search-item",
        props: {value: "customerName", label: "customerName"},
        placeholder: this.$t('card.cusMgr.placeholder'),
        // 查询结果回调函数
        handleSearchContent: this.getCustomerList,
        // 选择返回
        select(item) {
          console.log(item);
          _this.tempBtnFn(item);
        },
      }
    }
  },
  watch: {},
  mounted() {
    this.getCustomerCount();
    if (config.isdebug) {
      setTimeout(() => {
        window.debug = this;
      }, 100)
    }
  },
  methods: {
    // 跳转二级页面
    moreInfoClickFn(e) {
      //this.clickEvent({'cardType':this.reqData.cardTypeCode, 'eventType':1, 'cardId':this.reqData.cardId, 'pageLevel':1}, e)
      const route = '/portal/card/subPages/cusMgr';
      this.$router.addRoute(route, this.$t('card.cusMgr.title'));
      this.$router.push(route);
    },
    // 获取统计信息
    getCustomerCount() {
      this.$request({
        url: `${this.$backend.cdpCusService}/api/xmhcus/v1/static`,
        method: "POST",
      }).then((res) => {
        if (res && res.code === "0") {
          const statData = {
            formCusCount: 0,
            loansCusCount: 0,
            tempCusCount: 0
          }
          // 处理null值
          Object.keys(statData).forEach(k => {
            if (res.data[k] != null) {
              statData[k] = res.data[k];
            }
          });
          // 正式客户
          this.horBar.data[0].value = statData.formCusCount;
          // 临时客户
          this.horBar.data[1].value = statData.tempCusCount;

          // 正式客户中的有贷客户
          this.pieCharts.data[0].value = statData.loansCusCount;
          // 正式客户中的无贷客户
          this.pieCharts.data[1].value = statData.formCusCount - statData.loansCusCount;
          // 中间title：有贷客户数量
          this.pieCharts.coverOptions.title.text = this.pieCharts.getTitle(statData.loansCusCount);

          this.showData = true;
        }
      });
    },
    // 获取客户数据
    getCustomerList(searchVal, cb) {
      this.$request({
        url: `${this.$backend.cdpCusService}/api/xmhcus/v1/search`,
        method: "POST",
        data: {
          keyWord: searchVal,
        }
      }).then((res) => {
        if (res.code === "0") {
          cb(res.data || []);
        }
      });
    },
    // 跳转中台
    routeToCreditSys(name) {
      multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", name, null)
    },
    tempBtnFn(item) {
      // aplCusTyp 判断客户是企业还是个人 01 对公 02同业 03个人， 对公与同业归属于企业
      const mode = item.aplCusTyp == "03" ? "ps" : "corp"; // 为O3表示个人，上送ps，反之为企业上送corp
      const route = '/portal/card/subPages/cusMgr';
      this.$router.addRoute(route, this.$t('card.cusMgr.title'));
      this.$router.push({path: route, query: {mode: mode, custID: item.cusId}});
    },
  }
}
</script>

<style lang="scss" scoped>
.chart-wrap {
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;

  .chart-item {
    flex: none;
    width: calc(50% - 5px);
    height: 100%;
  }
}

::v-deep .yu-customer-item {
  height: 75px;
  box-sizing: border-box;
  padding: 5px 16px;
  color: #666666;

  &:hover {
    background: #EEF1F6;
  }

  .title {
    font-size: 14px;
    line-height: 14px;
    color: #333333;
  }

  // 借助c1通用样式类通过hover时候继承color，实现多主题
  &:hover .title:first-of-type {
    color: inherit;
  }

  li {
    padding: 5px 0;
    line-height: 12px;

    span {
      font-size: 12px;
      line-height: 12px;
    }

    &:hover {
      background: none;
    }
  }
}
</style>
