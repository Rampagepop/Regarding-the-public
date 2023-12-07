/*
 * Desc: 统计类卡片-评价类--授信运行情况跟踪卡片
 * @Author: 陈祖英
 * @Date: 2022-10-14 10:25:23
 * @Last Modified time: 2022-10-14 10:25:23
 */
<template>
  <card-wrap :cardName="cardName">
    <template slot="topCenter" class="top-center">
      <span class="money-unit">单位：亿元</span>
      <span class="time">{{ new Date().toPreMonthLastDay() }}</span>
    </template>
    <div class="grating-client-info" id="grating-client-content">
      <div class="yu-grid">
        <div class="yu-grid-client-wrap" style="position:relative">
          <div style="position:absolute;top:22px;left:20px;width:50%;">
            <funnalChart style="height:240px;width:100%" :option="option"></funnalChart>
          </div>

          <div>
            <div>
              <div class="header">
                <div style="width:60%"></div>
                <div>比昨天</div>
                <div>比上月</div>
              </div>
              <div class="body" ref="calStyle">
                <div class="body-item" v-for="(item,index) in tempdata" :key="'grating'+index">
                  <div></div>
                  <div :class="[item.type === 'up'?'red-arrow':'green-arrow']"><i :class="[item.type==='up'?'yu-icon-up':'yu-icon-down']"></i><span>{{ item.dotvalue }}</span></div>
                  <div :class="[item.mouthtype === 'up'?'red-arrow':'green-arrow']"><i :class="[item.mouthtype==='up'?'yu-icon-up':'yu-icon-down']"></i><span>{{ item.mouthvalue }}</span></div>
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
import funnalChart from "@/components/widgets/Echarts/funnelChart";
import { debounce } from "throttle-debounce";
export default {
  name: "gratingClientDo",
  components: {
    cardWrap,
    YuCardEmpty,
    funnalChart
  },
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t("card.gratingClientInfo");
      },
    },
  },
  data() {
    const lastDay = new Date()
    lastDay.setDate(lastDay.getDate() - 1);
    return {
      lastDay: lastDay.toJSON(),
      tempdata:[
        {
          tagname:'已批复额度',
          tagvalue:8792.15,
          type:'up',
          mouthtype:'down',
          dotvalue:'15.20%',
          mouthvalue:'20.00%'
        },
        {
          tagname:'已占用额度',
          tagvalue:7700.40,
          type:'down',
          mouthtype:'down',
          dotvalue:'12.20%',
          mouthvalue:'20.00%'
        },
        {
          tagname:'授信余额',
          tagvalue:6736.82,
          type:'up',
          mouthtype:'down',
          dotvalue:'13.20%',
          mouthvalue:'20.00%'
        }
      ],
      staticData: null,
      searchVal: "",
      debounce: 100,
      funnalData: [
        { value: 8792.15, name: '已批复额度' },
        { value: 7700.40, name: '已占用额度' },
        { value: 6736.82, name: '授信余额' },
      ],
      option: {
        color:['rgba(40, 119, 255, 0.6000)', 'rgba(40, 119, 255, 0.5000)', 'rgba(40, 119, 255, 0.4000)'],
        series: [
          {
            name: 'Funnel',
            type: 'funnel',
            left: '0%',
            top: 10,
            bottom: 10,
            width: '90%',
            // min: 0,
            // max: 100,
            minSize: '60%',
            maxSize: '100%',
            sort: 'descending',
            gap: 16,
            // itemStyle: {
            //   color:'rgba(40, 119, 255, 0.6)',
            // },
            label: {
              color:'#fff',
              show: true,
              position: 'inside',
              fontSize: 14,
              formatter:function(data) {
                const aa = data.value.toFixed(2);
                const bb = data.name;
                return [`{a|${aa}}`, `{b|${bb}}`].join('\n')
              },
              rich: {
                a: {
                  color:'#fff',
                  fontSize: 16,
                  padding:[0, 0, 7, 0],
                },
                b: {
                  color:'#fff',
                  fontSize: 12,
                },
              },

            },
            data: []
          }
        ]
      }
    };
  },
  mounted() {
    this.option.series[0].data = this.funnalData
  },
  methods: {
    handleSelect() {},
    searchContent(queryString, cb) {
      // 只取第一条数据
      this.debouncedGetCustomerList({
        page: 1,
        size: 1,
      }, cb);
    },
    getCustomerCount() {
      this.$request({
        url: `${this.$backend.mockService}/customer/static`,
      }).then((res) => {
        if (res && res.code === "0") {
          this.staticData = res.data;
        }
      });
    },
    // 获取客户数据
    getCustomerList(params, cb) {
      this.$request({
        url: `${this.$backend.mockService}/customer/list`,
        params: extend(
          {
            keyword: this.searchVal,
          },
          params || {}
        ),
      }).then((res) => {
        if (res.code === "0") {
          cb(res.data || []);
        }
      });
    },
    btnMgrFn() {
      this.$message("功能开发中，敬请期待。");
    },
    btnAddFn() {
      this.$message("功能开发中，敬请期待。");
    },
  },
};
</script>
  <style lang="scss" scoped>
  .header {
    display:flex;
    flex-direction: row;
    justify-content: space-around;
    font-size:14px;
  }
  .header div {
    min-width:70px;
    text-align:center;
    color: #333333;
    text-align: left;
  }
  .header div:first-child{
      padding:0 10px;
    }
    .header div:nth-child(1){
      width:60%;
    }
    .header div:nth-child(2){ 
      width:70px;
    }
    .header div:nth-child(3){
      width:70px;
    }
  .red-arrow {
   color:#F52C36;
   vertical-align: middle;
   i {
     padding-right:3px;
     font-size:12px;
    }
  }
  .green-arrow {
   vertical-align: middle;
   color:#11BD19;
   i {
     padding-right:3px;
     font-size:12px;
    }
  }
  .body {
   margin-top:10px;
  }
  .body-item div {
   font-size:14px;
   line-height:1;
   width:70px;
  }
  .body-item div:first-child {
   width:60%;
  }
  .body-item {
    padding:0 10px;
    box-sizing: border-box;
    display:flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height:64px;
    line-height:1;
    background:rgba(224, 224, 224, 0.2500);
    margin-bottom:16px;
  }
  .top-center {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #666666;
  }
  .el-table__header {
    width:100%!important;
  }
  .money-unit {
      padding-left: 9px;
      padding-right: 6px;
    }
  </style>
