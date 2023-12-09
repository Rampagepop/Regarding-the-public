/**
* Desc:&emsp;&ensp;风险提示
* @author  王登凯&emsp;liyuan7@yusys.com.cn
* @date    2022/12/9
* @since   1.0.0
* @version 1.0
*/
<template>
    <card-wrap cardName="风险提示">
        <div class="stat-chart">
            <div class="yu-maoyan-item hand-roeter" @click="smoking">
                <div class="yu-maoyan-item-icon">
                    <img src="../../../../../assets/common/images/dragable/maoyan.svg" width="48" height="48">
                </div>
                <div class="yu-maoyan-item-text" title="冒烟指数">
                    冒烟指数
                </div>
            </div>
            <div class="yu-maoyan-item hand-roeter" @click="moreInfoClickFn">
                <div class="yu-maoyan-item-icon">
                    <img src="../../../../../assets/common/images/dragable/zaowanbao.svg" width="48" height="48">
                </div>
                <div class="yu-maoyan-item-text" title="风险预警早晚报">
                    风险预警早晚报
                </div>
            </div>
            <div class="yu-maoyan-item hand-roeter" @click="heimingdan">
                <div class="yu-maoyan-item-icon">
                    <img src="../../../../../assets/common/images/dragable/heimingdan.svg" width="48" height="48">
                </div>
                <div class="yu-maoyan-item-text" title="黑名单查询">
                    黑名单查询
                </div>
            </div>
            <div class="yu-maoyan-item hand-roeter" @click="fengxian">
                <div class="yu-maoyan-item-icon">
                    <img src="../../../../../assets/common/images/dragable/caiwu.svg" width="48" height="48">
                </div>
                <div class="yu-maoyan-item-text" title="财务分析预警">
                    财务分析预警
                </div>
            </div>
        </div>
        <div class="start-line"></div>
        <div class="start-table">
            <div class="parent">
                <div class="parent-yu" v-for="(item, index) of listData" :key="index">
                    <div v-if="item.remindType === '01' || item.remindType === '04' || item.remindType === '06' || item.remindType === '07' || item.remindType === '09' || item.remindType === '10'" class="yu-grid-item hand-roeter" @click="toolClickFn(item)">
                        <div class="yu-icon-item">
                            <img v-if="item.num > 0" src="../../../../../assets/common/images/jinjijinggao.gif" width="24" height="24">
                            <img v-else :src="item.img" width="24" height="24">
                        </div>
                        <div class="yu-data-item">
                            <div class="yu-data-item-name" :title="item.name">{{ item.name }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="start-line"></div>
        <div class="start-table">
            <div class="parent">
                <div class="parent-yu" v-for="(item, index) of listData" :key="index">
                    <div v-if="item.remindType === '02' || item.remindType === '03' || item.remindType === '05' || item.remindType === '08'" class="yu-grid-item hand-roeter" @click="toolClickFn(item)">
                        <div class="yu-icon-item">
                            <img :src="item.img" width="24" height="24">
                        </div>
                        <div class="yu-data-item">
                            <div :class="item.num > 0 ? 'yu-data-item-namered' : 'yu-data-item-name'" :title="item.name">{{ item.name }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </card-wrap>
</template>

<script>
import cardWrap from "@/views/portal/card/components/card-wrap";
import base64 from "js-base64";
import { sessionStore } from '@/utils';
import { COMMON_TOKEN } from "@/config/constant/app.data.common";
import { mapGetters } from "vuex";

export default {
  components: {
    cardWrap
  },
  data() {
    return {
      listData:[
        {
            img: require(`@/assets/common/images/dragable/yewu.svg`),
            name: '表内业务即将到期',
            num: 0,
            remindType: '01'
        },
        {
            img: require(`@/assets/common/images/dragable/biaowai.svg`),
            name: '表外业务即将到期',
            num: 0,
            remindType: '04'
        },
        {
            img: require(`@/assets/common/images/dragable/daoqi.svg`),
            name: '还款计划即将到期',
            num: 0,
            remindType: '06'
        },
        {
            img: require(`@/assets/common/images/dragable/huankuan.svg`),
            name: '集团限额即将失效',
            num: 0,
            remindType: '07'
        },
        {
            img: require(`@/assets/common/images/dragable/biaowai.svg`),
            name: '提款期到期日提醒',
            num: 0,
            remindType: '10'
        },
        {
            img: require(`@/assets/common/images/dragable/shixiao.svg`),
            name: '押品重估超时提醒',
            num: 0,
            remindType: '09'
        }],
      listData1:[
        {
            img: require(`@/assets/common/images/dragable/biaonei.svg`),
            name: '表内业务未结清',
            num: 0,
            remindType: '02'
        },
        {
            img: require(`@/assets/common/images/dragable/qianxi.svg`),
            name: '表内业务欠息',
            num: 0,
            remindType: '03'
        },
        {
            img: require(`@/assets/common/images/dragable/huankuan.svg`),
            name: '还款计划未执行',
            num: 0,
            remindType: '05'
        },
        {
            img: require(`@/assets/common/images/dragable/shixiao.svg`),
            name: '集团限额已失效',
            num: 0,
            remindType: '08'
        }]
    };
  },
  computed: {
    ...mapGetters(["locationconfig","selectedRoles"]),
  },
  created() {
    this.getInfo();
  },
  methods: {
    // 获取详情
    getInfo() {
        var data = { operateOrgId: this.selectedRoles.orgId }
        this.$request({
            method: "POST",
            url: backen.portalService + "/api/xmhinformation/query",
            data
            }).then(res => {
            if (res && res.code === '0') {
                res.data.map(item => {
                    this.listData.map(i => {
                        if (item.remindType === i.remindType){
                            i.num = item.exporeNum
                        }
                    })
                    this.listData1.map(i => {
                        if (item.remindType === i.remindType){
                            i.num = item.exporeNum
                        }
                    })
                })
            }
        })
    },
  },
};
</script>

<style lang='scss' scoped>
@-webkit-keyframes imageAnim{
    0% {opacity: 1;}
    50% {opacity: 0.6;}
    100% {opacity: 0.2;}
}
.stat-chart {
    float: left;
    width: calc(30% - 12px);
    height: calc(100% - 10px);
    margin-left: -14px;
    margin-right: 12px;
    .yu-maoyan-item {
        width: 50%;
        float: left;
        margin-top: 20px;
        text-align: center;
        .yu-maoyan-item-icon {
            img {
                float: none;
                object-fit: contain;
            }
        }
        .yu-maoyan-item-text {
            font-size: 14px;
            color: #333333;
            line-height: 34px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .hand-roeter {
        cursor: pointer;
    }
    .has-router {
        opacity: 0.5;
    }
}
.stat-line {
    float: left;
    width: 1px;
    height: calc(100% - 10px);
    background: #cac8c8;
}
.stat-table {
    float: left;
    width: calc(35% - 0px);
    height: calc(100% - 10px);
    .parent{
        width: 100%;
        height: 100%;
        writing-mode: vertical-lr;
        .parent-yu{
            margin-top: 10ox;
            margin-left: 10px;
            width: 49%;
            height: 50px;
            display: inline-block;
            writing-mode: lr-tb;
            .yu-grid-item{
                display: flex;
                align-items: center;
                .yu-icon-item {
                    width: 48px;
                    height: 48px;
                    line-height: 48px;
                    background: #FFF7F6;
                    border-radius: 4px;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .yu-icon-item img {
                    width: 24px;
                    height: 24px;
                    margin: 0 auto;
                }
                .yu-data-item {
                    margin-left: 5px;
                    &-name{
                        font-size: 14px;
                        color: #333333;
                        cursor: pointer;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    &-namered {
                        font-size: 14px;
                        color: #E32C20;
                        cursor: pointer;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
}
.top-center {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;

    .tab-title{
        flex: none;

        &-left {
            font-size: 16px;
            font-weight: bold;
            color: #333333;
        }
    }
}

@media only screen and (max-width:1500px) {
    .yu-data-item-name{
        width: 90px;
    }
}
</style>