/*
 * Desc: 统计类卡片-还款类-还款监控
 * @Author: 陈祖英
 * @Date: 2022-10-14 10:25:23
 * @Last Modified time: 2022-10-14 10:25:23
 */
<template>
  <card-wrap :cardName="cardName" id="monitory-repayment-box">
    <template slot="topCenter" class="top-center">
      <span class="top-left-text">
        <span class="money-unit">{{ orgName }}</span>
        <span class="time">{{ new Date().toPreMonthLastDay() }}</span>
      </span>
      <span style="float:right;">
        <i @click="btnMgrFn()" class="yu-icon-refresh"></i>
        <yu-button @click="toDetailPage" type="text">
          {{ $t("card.monitoryReplayment.moreInfo") }}
        </yu-button>
      </span>
    </template>
    <div class="grating-client-info" id="grating-client-content">
      <div class="yu-grid">
        <div class="yu-grid-client-wrap" style="position:relative">
          <div>
            <div>
              <div class="header">
                <div v-for="(temp,i) in listTitle" :key="i+'mr'">{{ temp }}</div>
              </div>
              <div class="body" ref="calStyle">
                <div class="body-item" v-for="(item,index) in tempdata" :key="'grating'+index">
                  <div>{{ item.tagname }}</div>
                  <div>
                    <span>{{ item.taffValue }}</span>
                    <span :class="[item.taffFloat < 0?'red-arrow':'green-arrow']">
                      <i :class="[item.taffFloat < 0?'yu-icon-up':'yu-icon-down']"></i>
                      <span>{{ (item.taffFloat+"%").replace(/-/,'') }}</span>
                    </span>
                  </div>
                  <div><span>{{ item.moneyValue }}</span><span :class="[item.moneyFloat < 0?'red-arrow':'green-arrow']"><i :class="[item.moneyFloat < 0?'yu-icon-up':'yu-icon-down']"></i><span>{{ (item.moneyFloat+"%").replace(/-/,'') }}</span></span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div></card-wrap>
</template>

<script>
// 需要全局注入组件YuCustomerItem
import { extend } from "@/utils";
import cardWrap from "@/views/portal/card/components/card-wrap";
import YuCardEmpty from "@/views/portal/card/components/empty.vue";
import { debounce } from "throttle-debounce";
import { mapGetters } from "vuex";
export default {
  name: "gratingClientDo",
  components: {
    cardWrap,
    YuCardEmpty,
  },
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t("card.monitoryReplayment");
      },
    },
  },
  data() {
    return {
      listTitle:['指标', '户数（户）', '金额（亿元）'],
      tempdata:[
        {
          tagname:'3日本息未足额',
          taffValue:27,
          taffFloat:-2.5,
          moneyValue:768.23,
          moneyFloat:-12.1,
        },
        {
          tagname:'当天到期未还',
          taffValue:27,
          taffFloat:-2.5,
          moneyValue:768.23,
          moneyFloat:12.1,
        },
        {
          tagname:'当天新增逾期',
          taffValue:27,
          taffFloat:2.5,
          moneyValue:768.23,
          moneyFloat:12.1,
        },
        {
          tagname:'7日净新增逾期',
          taffValue:27,
          taffFloat:2.5,
          moneyValue:768.23,
          moneyFloat:-12.1,
        }
      ],
      staticData: null,
      searchVal: "",
      debounce: 100,
    };
  },
  computed: {
    ...mapGetters([
      "selectedRoles",
    ]),
    orgName() {
      if (this.selectedRoles) {
        return `${this.selectedRoles.orgName}`;
      }
      return "";
    },
  },
  mounted() {
  },
  methods: {
    moreInfoClickFn() {
      const route = '/portal/card/subPages/monitoryReDetail';
      this.$router.addRoute(route, this.$t('card.monitoryReplayment.title'));
      this.$router.push(route);
    },
    btnMgrFn() {
      this.$message("功能开发中，敬请期待。");
    },
    toDetailPage() {
      this.moreInfoClickFn();
    },
  },
};
</script>
    <style>
     #monitory-repayment-box .card-enter-wrap{
        white-space: nowrap;
        -ms-flex: 1;
        /* word-break: break-all; */
        flex: 1;
        height: 30px;
        overflow: hidden;
        clear: both;
      }
    </style>
    <style lang="scss" scoped>
    .header {
      display:flex;
      flex-direction: row;
      font-size: 14px;
      justify-content: space-around;
    }
    .header div {
      box-sizing: border-box;
      /* min-width:70px; */
      text-align:left;
      color: #333333;
    }
    .header div:first-child{
      padding:0 10px;
    }
    .header div:nth-child(1),.body-item div:nth-child(1){
      width:37%;
    }
    .header div:nth-child(2),.body-item div:nth-child(2){
      width:28%;
    }
    .header div:nth-child(3),.body-item div:nth-child(3){
      width:35%;
    }
    .red-arrow {
     color:#F52C36;
     vertical-align: middle;
     i {
       padding:0 3px;
       font-size:12px;
      }
    }
    .green-arrow {
     vertical-align: middle;
     color:#11BD19;
     i {
       padding:0 3px;
       font-size:12px;
      }
    }
    .body {
     margin-top:10px;
    }
    .body-item div {
     font-size:14px;
     display: flex;
     align-items: center;
     /* flex: 1 0 auto;
     width: 10px; */
     text-align:left;;
    }
    body-item div>span {
      vertical-align: middle;
    }
    .body-item div:first-child {
     /* width:60%; */
    }
    .body-item {
      padding:0 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      height:40px;
      line-height:1;
      text-align:left;
      background:rgba(224, 224, 224, 0.2500);
      margin-bottom:16px;
    }
    .top-center {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #666666;
    }
    .top-left-text {
       float: left;
       padding-top: 6px;
    }
    .el-table__header {
      width: 100%!important;
    }
    .money-unit {
        padding-left: 9px;
        padding-right: 6px;
      }
    </style>
