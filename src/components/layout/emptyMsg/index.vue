<template>
  <aside class="empty-msg">
    <svg-icon class="no-img" icon-class="no-data"></svg-icon>
    <div>{{ msg }}</div>
    <slot></slot>
  </aside>
</template>
<script>
export default {
  props: {
    msg: {
      type: String,
      default: ''
    },
    showImg: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
.empty-msg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .no-img {
    float: none;
    display: block;
    width: 110px;
    height: 126px;
    font-size: 110px;
    color: #C9C9C9;
  }
  & > div {
    margin-top: 8px;
    line-height: 30px;
    font-size: 14px;
    color: #666666;
  }
}
</style>
