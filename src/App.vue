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
import { sessionStore, isObject, isString} from "xy-utils";
import { SUB_ROUTER_ALL } from '@/config/constant/app.data.common';
import { loadMicroElement, renderMicroContent } from "@yufp/xy-micro";
function isEmpty(v) {
  return isObject(v) ? JSON.stringify(v) === "{}" : isString(v) && v === "";
}
const _TMP_ROUTES_ = Object.freeze({
  names: {},
  paths: {},
});
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
    $route(to, from) {
      yufp.globalEventBus.$on('clearSubKeepAlive', this.clearSubKeepAlive)
      if (to.fullPath !== from.fullPath) {
        // 前后路径相同时,不做处理
        this.checkContainer(to);
      }
    },
  },
  mouted() {
    window.addEventListener(
      "hashchange",
      () => {
        // 解决点击回退有时候路径变了但是实际页面没变 在进入新信管的时候不能跳转回到主应用中
        const currentPath = window.location.hash.slice(1);
        if (this.$route.path !== currentPath) {
          this.$router.push(currentPath)
        }
      },
      false
    );
  },
  methods: {
    // 对数组去重
    resetRouter(routes = []) {
      return (routes || []).filter((route) => {
        route.component = null
        return true;
      });
    },
    checkContainer(route) {
      this.containterID =
        route.path === "/login" || settings.whiteList.indexOf(route.path) != -1
          ? "RT_login"
          : "RT_frame";
      if (route.path === "/login") {
        this.loadFlag = false;
      }
      this.$nextTick(() => {
        if (window.MICRO) {
          const visitedViews = this.$store.state.tagsView.visitedViews;
          if (!this.loadFlag && this.containterID === "RT_frame") {
            this.loadFlag = true;
            // 加载子应用节点，子应用将渲染在此节点之下
            loadMicroElement(".yu-frame-tab-box .ck");
            // 监听子应用路径
            MICRO.initStore(this.$store);
            MICRO.onGlobalStateChange((newStore, oldStore) => {
              if (newStore.params.close) {
                // 关闭页签
                let target = newStore.params.target;
                const closeView = newStore.params.close;
                if (target && target.back === true) {
                  // 打开缓存的路由,要处理路由参数
                  const { source, goal, params } = target;
                  const backView = visitedViews.find((view) => view.path === target.path);
                  if (backView) {
                    this.$store.dispatch("tagsView/delView", closeView).then(() => {
                      this.$router.push(backView);
                    });
                    return;
                  }
                } else if (!target) {
                  target = this.$store.state.tagsView.visitedViews.length >=2 ? this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 2] : null;
                }
                this.$store.dispatch("tagsView/delView", closeView).then(() => {
                  target && this.$router.push(target);
                });
              }
              if (newStore.params && newStore.params.subRouter) {
                const filterRoutes = this.resetRouter(newStore.params.subRouter);
                // 相同子应用路由数据
                this.$router.addRoutes(filterRoutes);
                const subRouter = sessionStore.get(SUB_ROUTER_ALL) || [];
                sessionStore.set(SUB_ROUTER_ALL, [
                  ...subRouter,
                  ...filterRoutes,
                ]);
              }
              // 执行路由replace
              if (newStore.params && newStore.params.replaceRouter) {
                this.$router.replace(newStore.params.replaceRouter);
              }
              // 执行路由push
              if (newStore.params && newStore.params.pushRouter) {
                this.$router.replace(newStore.params.pushRouter.to);
              }
              // 全局状态数据改变监听
            });
          }
          // 渲染子应用
          renderMicroContent(route);
        }
      });
    },
    /**
     * @description type all:页签全部关闭 save: 除了当前页签其他关闭 del:关闭当前页签 view：页签参数
     */
    // 根据fullUrl清除keepAlive
    clearSubKeepAlive(view, type) {
      if (window.MICRO && window.microComp) {
        const alivekey = view && window.MICRO.getAppAliveName(view.path)
        if (type === 'del') {
          // 关闭页签的时候将子应用手动设置的缓存destory
          if (window.microComp[alivekey] && window.microComp[alivekey][0].data.keepAlive) {
            // 如果存在缓存
            delete window.microComp[alivekey]
            window.microLoaded[alivekey] = false;
          }
        } else if (type === 'all') {
          window.microLoaded = {}
        } else if (type === 'save') {
          const microLoaded = window.microLoaded
          for (const key in microLoaded) {
            if (Object.hasOwnProperty.call(microLoaded, key)) {
              if (alivekey !== key) {
                if (window.microComp[alivekey] && window.microComp[alivekey[0].data.keepAlive]) {
                  // 如果存在缓存
                  delete window.microComp[alivekey]
                  microLoaded[key] = false;
                }
              }
            }
          }
        }
      }
    }
  },
};
</script>
