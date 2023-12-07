/**
* Desc:&emsp;&ensp;统计类卡片-top-last
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/10/10
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-wrap :cardName="cardName">
    <div slot="topCenter">
      <slot name="ctlTopCenter"></slot>
    </div>
    <div class="rank-title">
      <slot name="headerTop"></slot>
    </div>
    <div class="rank-wrap">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <div class="rank-item" v-for="(item,i) in topLastData" :key="i">
        <div class="rank" :style="getRankStyle(item.rank)">
          {{ (groupNum >= item.rank ? "Top" : "Last") + item.rank }}
        </div>
        <div class="ratio" v-if="item.ratio">
          <span class="ratio-label">{{ item.ratio.label }}</span>
          <span class="ratio-value"
                :class="item.ratio.grow?'ratio-up yu-icon-up':'ratio-down yu-icon-down'">{{ item.ratio.value }}</span>
        </div>
        <div class="label" :title="item.label">{{ item.label }}</div>
        <div v-if="isShowProcess" class="process"
             :style="{background:item.rank <= groupNum ? 'rgba(40, 119, 255, 0.2500)' : 'rgba(251, 141, 18, 0.2500)'}">
          <div
            :style="{width:parseFloat(item.value)+'%',background:item.rank <= groupNum ? 'rgba(40, 119, 255, 1)' : 'rgba(251, 141, 18, 1)'}"></div>
        </div>
        <div class="value">{{ item.value }}</div>
      </div>
    </div>
  </card-wrap>
</template>

<script>
import cardWrap from "@/views/portal/card/components/card-wrap";
import YuCardEmpty from "@/views/portal/card/components/empty.vue";
import config from "@/config";

export default {
  name: "cardTopLast",
  components: {
    cardWrap,
    YuCardEmpty,
  },
  props: {
    cardName:{
      type: String,
      default: ''
    },
    // 参与排名总数
    num: {
      type: Number,
      default: 32
    },
    //每组内项目数
    groupNum: {
      type: Number,
      default: 10
    },
    topData: {
      type: Array,
      default: () => []
    },
    lastData: {
      type: Array,
      default: () => []
    },
    isShowProcess: {
      type: Boolean,
      default: false
    },
    isMock: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {};
  },
  computed: {
    topLastData: function () {
      const lastData = this.lastData;
      if(this.isMock) {
        lastData.reverse()
      }
      return this.topData.concat(lastData)
    }
  },
  watch: {},
  mounted() {
    if (config.isdebug) {
      setTimeout(() => {
        window.debugTopLast = this;
      }, 100)
    }
  },
  methods: {
    // 获取rank
    getRankTitle(rank) {
      if (rank <= this.groupNum ? "Top" : "Last" + rank) {
        return "Top" + rank
      } else {
        return "Last" + rank
      }
    },
    // 获取rank颜色和透明度
    getRankStyle(index) {
      const res = {color: "#666666"}
      if (index <= 3) {
        res.color = "#2877FF"
      } else if (index >= this.num - 2) {
        res.color = "#FB8D12"
      }
      if (index == 2 || index == this.num - 1) {
        res.opacity = "0.8"
      } else if (index == 3 || index == this.num - 2) {
        res.opacity = "0.6"
      }
      return res
    },
  },
};
</script>

<style lang="scss" scoped>

.top-left {
  font-size: 14px;
  color: #666666;
}

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


.rank-wrap {
  display: flex;
  width: 100%;
  height: 215px;
  margin-top: 13px;
  position: relative;
  padding: 0;
  flex-flow: column wrap;
  align-content: space-between;

  .rank-item {
    flex: none;
    width: 23%;
    position: relative;
    height: 43px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;

    > div {
      flex: 1 0 auto;
      width: 10px;
    }

    .rank {
      font-weight: bold;
      font-style: italic;
      text-align: left;
    }

    .ratio {
      text-align: center;
      margin-left: 5px;

      .ratio-label {
        color: #949494;
        font-size: 12px;
        line-height: 14px;
      }

      .ratio-value {
        font-size: 12px !important;
        line-height: 14px;
      }

      .ratio-value.ratio-up {
        color: #F52C36;
      }

      .ratio-value.ratio-down {
        color: #11BD19;
      }
    }


    .label, .value {
      color: #666666;
    }

    .label{
      flex-grow: 2;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .value{
      text-align: right;
    }

    .process {
      flex: 3 1 auto;
      height: 10px;
      margin: 0 9px;
      border-radius: 5px;
      background: rgba(40, 119, 255, 0.2500);

      > div {
        height: 10px;
        border-radius: 5px;
        background: rgba(40, 119, 255, 1);
      }
    }
  }

  .line {
    position: absolute;
    height: 100%;
    width: 1px;
    top: 0;
  }

  .line:nth-of-type(1), .line:nth-of-type(3) {
    left: 24.33%;
    background-image: linear-gradient(to bottom, #E0E0E0 0%, #E0E0E0 50%, transparent 50%);
    background-size: 1px 8px;
    background-repeat: repeat-Y;
  }

  .line:nth-of-type(2) {
    left: 50%;
    background: #E0E0E0;
  }

  .line:nth-of-type(3) {
    left: 75.66%;
  }
}

</style>

