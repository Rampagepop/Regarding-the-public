<template>
  <div id="app" class="yu-frame-root">
    <transition>
      <div v-if="containterID === 'RT_login'" id="RT_login">
        <router-view />
      </div>
      <div v-if="containterID === 'RT_frame'" id="RT_frame">
        <layout></layout>
      </div>
    </transition>
  </div>
</template>

<script>
import settings from "@/config";
import { loadMicroElement, renderMicroContent } from "@yufp/xy-micro";
export default {
  name: "App",
  components: {
    layout: () => import("@/components/layout"),
  },
  data() {
    return {
      containterID: "RT_frame",
      loadFlag: false,
    };
  },
  watch: {
    $route(val) {
      this.checkContainer(val);
    },
  },
  methods: {
    checkContainer(route) {
      this.containterID =
        route.path === "/login" || settings.whiteList.indexOf(route.path) != -1
          ? "RT_login"
          : "RT_frame";
      if (route.path === "/login") {
        this.loadFlag = false;
      }
      this.$nextTick(() => {
        const visitedViews = this.$store.state.tagsView.visitedViews;
        if (!this.loadFlag && this.containterID === "RT_frame") {
          this.loadFlag = true;
          // 加载子应用节点，子应用将渲染在此节点之下  await
          loadMicroElement(".yu-frame-tab-box .ck");
          // 监听子应用路径
          MICRO.initStore(this.$store);     
          MICRO.onGlobalStateChange((newStore, oldStore) => {
            // 全局状态数据改变监听
            if(newStore.params.close) {
              // 关闭页签
              let target = newStore.params.target;
              const closeView = newStore.params.close;
              if(target && target.back === true) { // 打开缓存的路由，要处理路由参数
                const { source, goal, params} = target
                const backView = visitedViews.find((view) => view.path === target.path)
                if (backView) {
                  this.$store.dispatch('tagsView/delView', closeView).then(() => {
                    this.$router.push(backView)
                  })
                  return
                }
              } else if(!target) {
                target = this.$store.state.tagsView.visitedViews.length >= 2 ? this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 2] : null
              }
              this.$store.dispatch('tagsView/delView', closeView).then(() => {
                target && this.$router.push(target);
              });
            }
            console.log(newStore, oldStore, 'newStore, oldStoremicro watch')
          });
        }
        // 渲染子应用
        renderMicroContent(route);
      });
    },
  },
};
</script>
