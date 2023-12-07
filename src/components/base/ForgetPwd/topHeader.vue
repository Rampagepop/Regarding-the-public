<template>
  <yu-row class="top-header" align="middle" type="flex" justify="space-between">
    <yu-col class="top-header-left">
      <div class="yu-logo"></div>
      <span class="top-name">{{ appName }}</span>
      <span>找回密码</span>
    </yu-col>
    <yu-col class="top-header-right">
      <span class="blue-text" @click="goLogin">返回登录</span>
      <span>简体中文</span>
    </yu-col>
  </yu-row>
</template>

<script>
import { title } from '@/config'
export default {
  name: "topHeader",
  data() {
    return {
      appName: title
    }
  },
  methods: {
    goLogin() {
      this.$router.replace({
        path: '/login'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.top-header {
  padding: 0 25px 0 13px;
  height: 50px;
  border-bottom: 1px solid #ECECEC;
}
.yu-logo {
  margin: 0;
}
.top-header-left {
  display: flex;
  align-items: center;
  & > span {
    margin-left: 11px;
    font-size: 18px;
    color: #333;
  }
  .top-name {
    position: relative;
    margin-left: 0;
    padding-right: 12px;
  }
  .top-name:after {
    position: absolute;
    top: 3px;
    right: 0;
    content: '';
    width: 1px;
    height: 17px;
    background: #E0E0E0;
  }
}
.top-header-right {
  text-align: right;
  font-size: 14px;
  span {
    margin-left: 17px;
    cursor: pointer;
  }
  .blue-text {
    color: #2877FF;
  }
}

</style>
