/**
* Desc:&emsp;&ensp;水平条状图
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/9/16
* @since   1.0.0
* @version 1.0
*/
<template>
  <div class="legend">
    <div class="legend-item" v-for="(item,i) in data" :key="i">
      <div class="value">{{ item.value }}</div>
      <div class="label">{{ item.label }}</div>
    </div>
    <div class="bar" :style="{'background':linearGradient}"></div>
  </div>
</template>

<script>
export default {
  name: "horBar",
  components: {},
  mixins: [],
  props: {
    data: {
      type: Array,
      default: () => [{
        label: "正式客户",
        value: 80,
        // 颜色可不传
        color: "#2877FF"
      }, {
        label: "临时客户",
        value: 32,
        // 颜色可不传
        color: "#D0D0D0"
      }]
    },
    colors: {
      type: Array,
      default: () => ["#2877FF", "#D0D0D0"]
    },
  },
  data: function () {
    return {}
  },
  computed: {
    linearGradient() {
      const sum = this.data.reduce((acc, item) => acc + item.value, 0);
      //不需要渐变效果，只需要计算正式客户的比例即可
      const colorBar = this.data.map((item, i) => (item.color || this.colors[i % this.colors.length]) + " " + (item.label == "临时客户" ? "0%" : ((item.value / sum * 100) + "%"))).join(", ");
      return `linear-gradient(to right, ${colorBar})`
    }
  }
}
</script>

<style lang="scss" scoped>
.legend{
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: stretch;
  align-content: center;
  &-item{
    display: inline-block;
    flex: auto;
    color: #333333;
    text-align: center;
    .value{
      font-size: 24px;
      line-height: 24px;
      font-weight: bold;
      margin-bottom: 6px;
    }
    .label{
      font-size: 14px;
      line-height: 14px;
    }
  }
}
.bar{
  flex: none;
  width: 100%;
  height: 16px;
  margin-top: 16px;
  border-radius: 4px;
}
</style>
