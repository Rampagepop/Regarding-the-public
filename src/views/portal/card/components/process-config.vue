<template>
  <div class="process-config">
    <div class="yu-title">
      <div class="yu-title-right yu-title-right-config" ref="mytab">
        <span class="tab-title">{{ $t('card.approveContractCfg.shyd') }}</span>
        <span v-if="tabData && tabData.length" class="tab-reset">
          <!-- style="max-width:188px"  -->
          <span ref="tabContentC" class="tab-content">
            <span v-for="(item,index) in cultData" :key="'process'+index" :ref="'tab'+index"
                  :class="['mode'].concat(mode === item.tabName?['active','c1','bc1','bdc1']:[])"
                  @click="changeMode(item.tabName, index)">
              {{ item.tabName }}
            </span>
          </span>
        </span>
      </div>
    </div>
    <div class="process-content-wrap">
      <div class="search-no-data" v-if="tabData && tabData.length === 0">
        <empty-msg></empty-msg>
      </div>
      <div v-else class="process-content-wrap-overauto">
        <div v-for="(temp,index) in currentTab" :key="'content'+index">{{ index+1 }}.{{ temp }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// 流程类卡片-配置模块
import EmptyMsg from "@/components/layout/emptyMsg/index.vue"
import YuCardEmpty from "@/views/portal/card/components/empty.vue";
export default {
  name: "processConfig",
  components: {
    YuCardEmpty,
    EmptyMsg
  },
  props: {
    configdata: {
      type: Array,
      default: () => [],
    },
    configWidth: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      boxWidth:100,
      mode:'',
      currenWidth:0,
      currentTab:[],
      cultData:[], //前端组装数据储存
      tabData:[],
      sort:true, // 正序
    }
  },
  watch:{
    configdata: {
      handler (newValue) {
        this.tabData = newValue
        this.cultData = this.tabData.reduce(function(pre, value, index, array) {
          const x = pre.find(a => a.tabName == value.auditType);
          if(x) {
            const cindex = pre.findIndex(item => item.tabName === value.auditType);
            pre[cindex].tabContent.push(value.auditDesc)
          }else {
            pre.push({tabName:value.auditType, tabContent:[value.auditDesc]})
          }
          return pre
        }, [])
        this.mode = this.cultData && this.cultData.length ? this.cultData[0].tabName : ''
        const temp = this.cultData.filter(item => item.tabName === this.mode)
        this.currentTab = temp && temp.length ? temp[0].tabContent : []
        this.$nextTick(() => {
          if(this.$refs['tabContentC']) {
            this.$refs['tabContentC'].scrollLeft = 0;
            this.$refs.tabContentC.style.width = (parseInt(this.boxWidth) - 60) + "px"
          }
        })
      },
      immediate: true
    },
    configWidth(newvalue) {
      this.boxWidth = newvalue;
      this.$nextTick(() => {
        if(this.$refs.mytab) {
          this.$refs.mytab.style.width = this.boxWidth + "px"
        }
      })
    } 
  },
  mounted() {
    
  },
  methods: {
    scrolleftTo(name, index) {
      const fixtitlew = 60
      const ref = `tab${index}`
      const nav = this.$refs['tabContentC'];
      const title = this.$refs[ref][0];
      nav.scrollLeft = ((title.offsetLeft - nav.offsetLeft) * index) / 2
    },
    changeMode(val, index) {
      //后期这里需要重新处理一下，有问题
      this.mode = val;
      this.scrolleftTo(val, index)
      const temp = this.cultData.filter(item => item.tabName === this.mode)
      this.currentTab = temp && temp.length ? temp[0].tabContent : []
      //动态计算宽度
      this.$nextTick(() => {
        if(this.$refs.tabContentC) {
          this.$refs.tabContentC.style.width = (parseInt(this.boxWidth) - 60) + "px"
        }
      })
    },
  }
};
</script>

  <style lang="scss" scoped>
    /*卡片总高度*/
$cardHeight: 320px;
/*header高度*/
$cardHeaderHeight: 48px;
/*下边的padding*/
$cardPaddingBottom: 16px;
/*内容里面的标题高度*/
$cardContentTitleHeight: 32px;
/*tab总宽度*/
$tabCardWidth: 252px;
$cardBodyHeight: $cardHeight - $cardHeaderHeight - $cardPaddingBottom - $cardContentTitleHeight - 24px;
 .yu-title {
  display: flex;
  height: 36px;
  line-height: 36px;
  .tab-title {
    color: #222;
    font-size: 14px;
    font-weight: 400;
    line-height: 36px;
    font-family: Microsoft YaHei;
  }
  &-left {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
  }
  &-right {
    .mode {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      line-height: 30px;
      /* width: 42px; */
      text-align:center;
      display: inline-block;
      /* padding:0 6px; */
      margin-right: 10px;
      cursor: pointer;
      background:none;
    }
    .mode.active {
      border-bottom-width: 1px;
      border-bottom-style: solid;
    }
  }
  .yu-title-right-config{
     font-size:0;
     overflow:hidden;
     white-space: nowrap;
  }
  .yu-title-right-config span {
      display:inline-block;
  }
  .tab-title {
    vertical-align: top;
  }
  .tab-reset {
    vertical-align: baseline;
    padding-top: 4px;
    white-space:nowrap;
    overflow-x:auto;
  }
  .tab-content{
    overflow-x:scroll;
    margin-left:6px;
    /* width:calc($tabCardWidth - 60px); */
    scroll-behavior: smooth;
  }
}
.process-content-wrap {
    padding: 12px 0 16px;
    color: #666;
    font-size: 12px;
    line-height: 24px;
    font-family: MicrosoftYaHei;
    overflow: hidden;
    &-overauto {
      max-height: $cardBodyHeight;
      overflow-y: auto;
      scrollbar-width: thin;
    }
}
  </style>
