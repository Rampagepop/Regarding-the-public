<template>
  <card-wrap :cardName="cardName">
    <div class="yu-grid" v-if="listData.length !== 0">
      <yu-row :gutter="16">
        <yu-col
          :span="8"
          v-for="(item, index) of listData"
          :key="index"
          class="yu-grid-item"
          @click.native="toProgressCenter('allPrepare','undeal',item)"
        >
          <div class="yu-grid-item-num">{{ item.num }}</div>
          <div class="yu-grid-item-text" :title="item.bizType">
            {{ item.bizType }}
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
import mixin from "./agentReminderMixin";
export default {
  name: "agentReminder",
  mixins: [mixin],
  data() {
    return {
      type: 2,
      max: 5, // 小卡片最多显示6-1个分类
    };
  },
};
</script>

<style lang="scss" scoped>
.yu-grid {
  margin-top: 40px;
  background: #ffffff;
  &-item {
    margin-bottom: 46px;
    text-align: center;
    &-num {
      font-size: 24px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
    }
    &-text {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #666666;
      margin-top: 10px;
      padding: 5px 12px;
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      background: #F9F9F9;
      border-radius: 4px;
    }
  }
}
</style>
