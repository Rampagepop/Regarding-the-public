<template>
  <div class="card-empty">
    <i class="el-icon-loading el-icon-fit"></i>
    <span>{{ text }}</span>
  </div>
</template>

<script>
// 卡片为空状态、loading
export default {
  name: "YuCardEmpty",
  props: {
    text: {
      type: String,
      default() {
        return this.$t("card.emptyText");
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.card-empty {
  height: 160px;
  text-align: center;
  padding-top: 72px;
  > * {
    display: inline-block;
    width: 100%;
  }
  > span {
    font-size: 12px;
    color: rgba(127, 127, 127, 1);
  }
}
</style>
