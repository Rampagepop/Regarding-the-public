<template>
  <div class="processCenter">
    <el-tabs tab-position="left" v-model="activeMode" @tab-click="tabClick">
      <el-tab-pane v-for="(item,i) in tabs" :key="i" :label="item.label" :name="item.name">
        <compontent v-if="activeMode==item.name || item.loaded" :is="item.name"></compontent>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import allPrepare from '@/views/portal/card/processCenter/allPrepare.vue' // 全部代办
import reminderList from '@/views/portal/card/processCenter/reminderList.vue' // 催办清单
import processTrack from '@/views/portal/card/processCenter/processTrack.vue' // 流程跟踪
import riskWarning from '@/views/portal/card/processCenter/riskWarning.vue' // 风险预警
import endNotice from '@/views/portal/card/processCenter/endNotice.vue' // 到期提示
export default {
  name:'processCenter',
  components: {
    allPrepare,
    reminderList,
    processTrack,
    riskWarning,
    endNotice
  },
  data() {
    return {
      tabs: [{
        // name和组件名保持一致
        name: "allPrepare",
        label: "全部待办",
        // 第一个加载，默认为true
        loaded: true
      }, {
        name: "reminderList",
        label: "催办清单",
      }, {
        name: "processTrack",
        label: "流程跟踪",
      }, {
        name: "riskWarning",
        label: "风险预警",
      }, {
        name: "endNotice",
        label: "到期提示",
      }],
      activeMode: "allPrepare",
    };
  },
  activated() {
    if (this.$route.query && this.$route.query.activeMode) {
      this.activeMode = this.$route.query.activeMode;
    }
  },
  methods: {
    tabClick(curtTab) {
      // 切换tab后再切换路由可能导致去切换tab又还原的问题，需要设置一下query中的参数activeMode
      this.$route.query && (this.$route.query.activeMode = this.activeMode)
      this.tabs.some(tab => {
        if (tab.name == curtTab.name) {
          // 设置为加载过了
          tab.loaded = true;
          return true;
        }
        return false;
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.processCenter {
  ::v-deep .el-tabs__header.is-left .el-tabs__nav-wrap {
    padding: 0;

    .el-tabs__nav.is-left {
      width: 160px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
    }
  }

  ::v-deep .el-tabs__content {
    max-height: calc(100vh - 140px);
    overflow-y: auto;
  }
}
</style>
