<template>
  <card-wrap :cardName="cardName">
    <div class="yu-grid" v-if="listData.length !== 0">
      <yu-row :gutter="12">
        <yu-col
          :span="8"
          v-for="(item, index) of listData"
          :key="index"
          @click.native="toProgressCenter('allPrepare','undeal',item)"
        >
          <div class="yu-grid-item">
            <div class="yu-grid-item-text">
              <el-row>
                <el-col :span="12">
                  <span :class="item.icon" :title="item.bizType">{{
                    item.bizType
                  }}</span>
                </el-col>
                <el-col :span="12">
                  <span class="icon-text">{{ item.num }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </yu-col>
      </yu-row>
    </div>
    <empty-msg class="side-menu" msg="恭喜您，今日已完成全部待办" v-if="listData.length === 0"></empty-msg>
    <template slot="menus">
      <li @click="btnEditReminderFn">
        {{ $t("card.agentReminder.settings") }}
      </li>
      <li @click="toProgressCenter('allPrepare','undeal')">{{ $t('card.cardmore') }}</li>
    </template>
    <yu-agent-reminder-edit
      v-if="dataId"
      :visibled.sync="dialogVisible"
      :card-id="type"
      :data-map="dataMap"
      @save="quickEntranceEditSaveFn"
    />
  </card-wrap>
</template>

<script>
import cardWrap from "@/views/portal/card/components/card-wrap";
import YuAgentReminderEdit from "@/views/portal/card/routes/agentReminder-edit.vue";
import emptyMsg from "@/components/layout/emptyMsg/index.vue";

import mixin from "./agentReminderMixin";
export default {
  name: "agentReminder2",
  mixins: [mixin],
  data() {
    return {
      type: 4,
      max: 8, // 中卡片最多显示9-1个分类
    };
  }
};
</script>

<style lang="scss" scoped>
.yu-grid {
  background: #ffffff;
  padding-top: 16px;
  &-item {
    margin-bottom: 12px;
    text-align: center;
    text-align: left;
    line-height: 48px;
    &-text {
      background: #F9F9F9;
      border-radius: 4px;
      color: #666666;
      padding: 10px 15px;
      &::before {
        font-size: 16px;
      }
      span {
        display: inline-block;
        width: 100%;
        font-size: 14px;
        white-space: nowrap;
        &::before{
          margin-right: 16px;
          font-size: 24px;
          vertical-align: bottom;
        }
        &.icon-text {
          text-align: right;
          font-size: 24px;
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          color: #333333;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
