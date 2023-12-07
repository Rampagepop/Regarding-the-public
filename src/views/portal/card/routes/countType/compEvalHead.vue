/**
* Desc:&emsp;&ensp;综合评价（总行）卡片
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/10/09
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-top-last
    :card-name="$t('card.eval.compEvalHead')"
    :num="32" :group-num="10"
    :is-show-process="showProcess"
    :top-data="topData" :last-data="lastData"
  >
    <template slot="ctlTopCenter">
      <div class="top-left">{{ $t('card.eval.orgNum').replace('$',num) }}</div>
    </template>
    <template slot="headerTop">
      <div class="top">{{ $t('card.eval.rank') }}&thinsp;TOP&thinsp;{{ groupNum }}</div>
      <div class="last">{{ $t('card.eval.rank') }}&thinsp;LAST&thinsp;{{ groupNum }}</div>
    </template>
  </card-top-last>
</template>

<script>
import cardTopLast from "@/views/portal/card/components/card-topLast";

export default {
  name: "compEvalHead",
  components: {cardTopLast},
  mixins: [],
  props: {},
  data: function () {
    return {
      showProcess: true,
      num: 32,
      groupNum: 10,
      topData: [
        {label: "上海分行", value: "96.2", rank: 1, ratio: {grow: true, value: "1"}},
        {label: "深圳分行", value: "94.6", rank: 2, ratio: {grow: false, value: "1"}},
        {label: "北京分行", value: "93.0", rank: 3, ratio: {grow: true, value: "2"}},
        {label: "南京分行", value: "89.5", rank: 4, ratio: {grow: false, value: "3"}},
        {label: "佛山分行", value: "82.7", rank: 5, ratio: {grow: true, value: "5"}},
        {label: "成都分行", value: "81.0", rank: 6, ratio: {grow: true, value: "1"}},
        {label: "长沙分行", value: "76.9", rank: 7, ratio: {grow: true, value: "2"}},
        {label: "珠海分行", value: "72.2", rank: 8, ratio: {grow: false, value: "4"}},
        {label: "东莞分行", value: "70.8", rank: 9, ratio: {grow: false, value: "6"}},
        {label: "西安分行", value: "69.3", rank: 10, ratio: {grow: true, value: "5"}}],
      lastData: [
        {label: "南宁分行", value: "65.1", rank: 23, ratio: {grow: false, value: "3"}},
        {label: "桂林分行", value: "62.8", rank: 24, ratio: {grow: true, value: "1"}},
        {label: "天津分行", value: "58.2", rank: 25, ratio: {grow: false, value: "6"}},
        {label: "太原分行", value: "52.9", rank: 26, ratio: {grow: false, value: "2"}},
        {label: "哈尔滨分行", value: "47.0", rank: 27, ratio: {grow: true, value: "4"}},
        {label: "大连分行", value: "39.7", rank: 28, ratio: {grow: true, value: "3"}},
        {label: "宁波分行", value: "27.3", rank: 29, ratio: {grow: false, value: "2"}},
        {label: "德阳分行", value: "27.3", rank: 30, ratio: {grow: true, value: "3"}},
        {label: "海口分行", value: "20.6", rank: 31, ratio: {grow: false, value: "1"}},
        {label: "湛江分行", value: "12.6", rank: 32, ratio: {grow: true, value: "1"}}]
    }
  },
  computed: {},
  watch: {},
  mounted() {
    // 获取数据
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
  .rank-title {
  display: flex;
  width: 100%;
  padding: 0;
  flex-flow: row nowrap;
  justify-content: space-around;

  > div {
    height: 28px;
    border-radius: 14px;
    padding: 0 15px;
    line-height: 28px;
    font-size: 14px;
    font-weight: bold;
  }

  .top {
    background: rgba(40, 119, 255, 0.2500);
    color: #2877FF;
  }

  .last {
    background: rgba(251, 141, 18, 0.2500);
    color: #FB8D12;
  }
}
</style>

