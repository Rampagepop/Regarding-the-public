<template>
  <div class="yu-cusomter-item">
    <span class="title">查询结果</span>
    <ul>
      <li>
        <label>客户编号：</label><span>{{ item.customerId }}</span>
      </li>
      <li>
        <label>客户名称：</label><span>{{ item.customerName }}</span>
      </li>
      <li>
        <label>证件类型：</label><span>{{ item.certType }}</span>
      </li>
      <li>
        <label>证件号码：</label><span>{{ item.certNo }}</span>
      </li>
      <li>
        <label>客户状态：</label><span>{{ item.status }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "YuCustomerItem",
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.yu-cusomter-item {
  padding: 6px 8px;
  .title {
    font-size: 14px;
    font-weight: bold;
  }
  li {
    line-height: 22px;
    font-size: 12px;
  }
}
</style>
