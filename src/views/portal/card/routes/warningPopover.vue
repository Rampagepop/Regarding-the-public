<template>
  <div class="warning-popover">
    <yu-popover ref="popover" popper-class="w-popover" placement="right" width="400" trigger="hover">
      <div class="box">
        <div class="box-info" v-if="popoverData.status === 3">
          <span class="box-info-title">{{ $t("card.risk.update") }}：</span>
          <span class="box-info-content">{{ popoverData.update }}</span>
        </div>
        <div class="box-info" v-else>
          <span class="box-info-title">{{ $t("card.risk.takeeffect") }}：</span>
          <span class="box-info-content">{{ popoverData.update }}</span>
        </div>
        <div class="box-info">
          <span class="box-info-title">{{ $t("card.risk.userName") }}：</span>
          <span class="box-info-content">{{ popoverData.userName }}</span>
        </div>
        <div class="box-info">
          <span class="box-info-title">{{ $t("card.risk.updateOrg") }}：</span>
          <span class="box-info-content">{{ popoverData.updateOrg }}</span>
        </div>
        <div class="box-info" v-if="popoverData.status === 3">
          <span class="box-info-title">{{ $t("card.risk.reason") }}：</span>
          <span class="box-info-content">{{ popoverData.reason }}</span>
        </div>
        <div class="box-info" v-else>
          <span class="box-info-title">{{ $t("card.risk.takeeffectreason") }}：</span>
          <span class="box-info-content">{{ popoverData.reason }}</span>
        </div>
      </div>
    </yu-popover>
    <div class="content" v-popover:popover>{{ popoverData.content }}</div>
  </div>
</template>
<script>
export default {
  name: "warningPopover",
  props: {
    popoverData: {
      require: true,
      type: Object,
      default: function () {
        return {
          status: 1,
        };
      },
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.box-info {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  line-height: 24px;
  .box-info-title {
    display: inline-block;
    min-width: 80px;
    text-align: right;
    color: #999999;
  }
  .box-info-content {
    color: #444444;
  }
}
.warning-popover {
  display: flex;
}
.content {
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
<style>
.el-popover.w-popover {
  border-radius: 4px;
  border: 1px solid #ededed;
}
</style>
