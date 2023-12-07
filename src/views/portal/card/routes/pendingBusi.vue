<template>
  <card-wrap :cardName="cardName">
    <template slot="topCenter">
      <div class="yu-title">
        <div class="yu-title-right">
          <span
            :class="['mode', { activeMode: mode === $t('card.processTracking.sx') }]"
            @click="changeMode($t('card.processTracking.sx'))"
          >
            {{ $t('card.processTracking.sx') }}
          </span>
          <span
            :class="['mode', { activeMode: mode === $t('card.processTracking.fk') }]"
            @click="changeMode($t('card.processTracking.fk'))"
          >
            {{ $t('card.processTracking.fk') }}
          </span>
        </div>
      </div>
    </template>
    <div class="pending-busi-content-wrap" v-if="listData.length !== 0">
      <yu-row :gutter="16">
        <yu-col :span="8" v-for="(item, index) of listData" :key="index">
          <div class="yu-grid">
            <div class="yu-grid-top">
              <div class="yu-grid-top-serinalNum" :title="item.bizId">
                {{ $t('card.processTracking.bizId') }}：{{ item.bizId }}
              </div>
              <div class="yu-grid-top-type">
                <img
                  v-if="item.eventType === 2"
                  src="@/assets/common/images/dragable/blue-bg.svg"
                  alt=""
                />
                <img
                  v-if="item.eventType === 1"
                  src="@/assets/common/images/dragable/orange-bg.svg"
                  alt=""
                />
              </div>
              <div v-if="item.eventType === 1" class="yu-grid-top-type type1">
                {{ $t('card.pendingBusi.zq') }}
              </div>
              <div v-if="item.eventType === 2" class="yu-grid-top-type type2">
                {{ $t('card.pendingBusi.add') }}
              </div>
            </div>
            <div class="yu-grid-content">
              <div class="yu-grid-content-companyName">
                {{ item.bizUserName }}
              </div>
              <div class="yu-grid-content-tag">
                <yu-tag type="primary">{{ limitType[item.quotaType] ? limitType[item.quotaType] : '--' }}</yu-tag>
              </div>
              <div class="yu-grid-content-info">
                <div>
                  {{ $t('card.processTracking.fee') }}：<span>{{ moneyFormatter(item.fee, 2) ? moneyFormatter(item.fee, 2) : '--' }}</span>
                </div>
                <div>
                  {{ $t('card.pendingBusi.sxqx') }}：<span>{{ item.creditTime ? item.creditTime : '--' }}</span>
                </div>
                <div>
                  {{ $t('card.pendingBusi.jb') }}：<span>{{ item.userName ? item.userName : '--' }}</span>
                </div>
              </div>
              <div class="yu-grid-content-btn">
                <yu-button
                  size="small"
                  type="primary"
                  @click="btnClickHandlerFn(item)"
                >
                  {{ $t('card.pendingBusi.handle') }}
                </yu-button>
              </div>
            </div>
            <div class="yu-grid-process">
              <yu-progress
                v-if="item.lastTime < 3"
                :percentage="item.lastTime * 5"
                :show-text="false"
              ></yu-progress>
              <yu-progress
                v-if="item.lastTime >= 3 && item.lastTime < 5"
                :percentage="item.lastTime * 5"
                status="success"
                :show-text="false"
              ></yu-progress>
              <yu-progress
                v-if="item.lastTime >= 5"
                :percentage="item.lastTime * 5 > 100 ? 100 : item.lastTime * 5"
                status="exception"
                :show-text="false"
              ></yu-progress>
            </div>
          </div>
        </yu-col>
      </yu-row>
    </div>
    <empty-msg class="side-menu" v-if="listData.length === 0"></empty-msg>
    <template slot="menus">
      <li @click="btnShowAllFn('allPrepare','undeal')">{{ $t("card.pendingBusi.all") }}</li>
    </template>
  </card-wrap>
</template>

<script>
import cardWrap from "@/views/portal/card/components/card-wrap";
import emptyMsg from "@/components/layout/emptyMsg/index.vue";
import { moneyFormatter } from "@/utils/util";
import {clone, extend, lookup} from "@/utils";
lookup.reg("LIMIT_TYPE");
export default {
  name: "pendingBusi",
  components: {
    cardWrap,
    emptyMsg
  },
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t("card.pendingBusi");
      },
    },
  },
  data() {
    return {
      moneyFormatter,
      listData: [],
      mode: this.$t('card.processTracking.sx'),
      limitType: lookup.find("LIMIT_TYPE", false), // 额度类型
      bizType: ['对公授信申请', '授信申请打回', '授信申请审批']
    };
  },
  created() {
    this.getData();
  },
  methods: {
    changeMode(val) {
      this.mode = val;
      if(this.mode === this.$t('card.processTracking.sx')) {
        this.bizType = ['对公授信申请', '授信申请打回', '授信申请审批'];
        this.getData();
      } else {
        this.bizType = [this.$t("card.pendingBusi.fksq")];
        this.getData();
      }
    },
    getData() {
      this.$request({
        url: backend.portalService + "/api/xmhprocess/processquery",
        data: {
          condition: JSON.stringify({
            bizTypes: this.bizType
          }),
          selectType: 1,
          page: 1,
          size: 3,
        },
      }).then(({code, _message, data}) => {
        if (code === "0") {
          this.listData = data;
        }
      });
    },
    btnClickHandlerFn(row) {
      // 往实例信息页面跳转
      var query = row;
      this.$nextTick(function () {
        // 复制对象
        extend(this.detailFormdata, row);
      });
      // 往实例信息页面跳转
      var query = {
        instanceId: row.instanceId,
        nodeId: row.nodeId,
        userId: row.userId,
        returnBackFuncId: this.$route.name,
        returnBackRootId: this.$route.name,
        row: clone(row, {})
      };
      if (row.flowState == "H") {
        this.$message({
          message: "流程实例处于挂起状态,无法进行操作!",
          type: "warning",
        });
      } else {
        this.$router.push({ name: "instanceInfo", query });
      }
    },
    btnShowAllFn(activeMode, mode, item) {
      // 显示全部待处理
      // 跳转到进度中心
      const tarRoute = this.$router.match("/portal/card/processCenter/processCenter");
      if (tarRoute) {
        this.$router.push({
          path: tarRoute.path,
          query: Object.assign({activeMode, mode}, item ? {type: item.label} : {})
        })
      } else {
        this.$message.warning(this.$t('card.complTrans.noAccessOfPrcCenter'))
      }
      // this.$router.push({name: "allPrepare", params: {activeMode: "allPrepare", mode: 'undeal'}});
    },
  },
};
</script>

<style lang="scss" scoped>
.yu-title {
  display: flex;
  flex-direction: row-reverse;
  line-height: 48px;
  &-left {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
  }
  &-right {
    .mode {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #999999;
      line-height: 14px;
      display: inline-block;
      margin-left: 16px;
      cursor: pointer;
    }
    .activeMode {
      color: #2877ff;
      padding-bottom: 8px;
      border-bottom: 1px solid #2877ff;
    }
  }
}
.yu-grid {
  position: relative;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  &-top {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    border-bottom: 1px dotted #ededed;
    padding: 12px 16px;
    position: relative;
    &-serinalNum {
      padding-right: 34px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-type {
      position: absolute;
      right: -4px;
      top: 25%;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 20px;
    }
    .type1 {
      right: 9px;
      color: #fc974d;
    }
    .type2 {
      right: 9px;
      color: #2877ff;
    }
  }
  &-content {
    padding: 4px 0 19px 16px;
    &-companyName {
      line-height: 40px;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #2877ff;
    }
    &-tag {
      .el-tag {
        height: 22px;
        box-sizing: border-box;
        line-height: 20px;
      }
    }
    &-info {
      padding-top: 6px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #999999;
      div {
        line-height: 26px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        span {
          color: #444444;
        }
      }
    }
    &-btn {
      margin-top: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .el-button:not(.el-button--text) {
        padding: 8px 12px;
      }
    }
  }
  &-process {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 4px;
  }
}
::v-deep .el-progress {
  .el-progress-bar__outer {
    border-radius: 8px;
    background-color: #e0e0e0;
    height: 4px;
    .el-progress-bar__inner {
      background-color: #09d695;
    }
  }
  &.is-success .el-progress-bar__inner {
    background-color: #fc974d;
  }
  &.is-exception .el-progress-bar__inner {
    background-color: #ff3b30;
  }
}
</style>
