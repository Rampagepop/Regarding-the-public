<template>
  <!-- //topScroll0 用于点击top的时候让首页滚动到最开头的时候用的class  用ck无效-->
  <div class="ck topScroll0">
    <div class="breadcrumb-container" v-if="lists.length > 0">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <!-- 固定增加首页 -->
          <router-link to="/">{{ $t("route.dashboard") }}</router-link>
        </el-breadcrumb-item>
        <div v-if="!isLink(lists[0], 0)">
          <el-breadcrumb-item v-for="(item, i) in lists" :key="item.path">
            <!-- 遍历路由信息并展示 -->
            <router-link v-if="isLink(item, i)" :to="item.path">
              {{ item.meta.title }}
            </router-link>
            <span v-else>{{ item.meta.title }}</span>
          </el-breadcrumb-item>
        </div>
      
      </el-breadcrumb>
    </div>
    <transition name="fade-transform" mode="out-in">
     
      <keep-alive>
        <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import settings from "@/config";
import {loadMicroElement, renderMicroContent} from "@yufp/xy-micro";

export default {
  name: "AppMain",
  data() {
    return {
      lists: [], // 定义一个数组 用于接收路由信息
    };
  },
  computed: {
    containter() {
      return this.$route.path !== "/login" ||
        settings.whiteList.indexOf(this.$route.path) === -1
        ? "RT_frame"
        : "";
    },
    cachedViews() {
      const cvs = [];
      this.$store.state.tagsView.cachedViews.forEach((element) => {
        cvs.push(element.name);
      });
      return cvs;
    },
    key() {
      // 根据路径缓存
      return this.$route.fullPath
    },
    containterID() {
      return this.$route.name;
    },
  },
  watch: {
    $route(to) {
      /* eslint prefer-rest-params:0 */
      this.loadSubApp(to);
      // 获取路由信息
      // 这里必须使用监听，否则无法实时获取路由变动信息,监听后路由会实时变动，不然需要手动刷新路径才会改变
      const matched = to.matched;
      // 当前路由为 dashboard时，自定清空
      if (matched && matched.length > 0 && to.path !== "/dashboard") {
        this.lists = matched;
      } else {
        this.lists = [];
      }
    },
  },

  created() {
    this.lists = this.$route.matched; //获取路由内的全部信息
  },
  mounted() {
    this.loadSubApp(this.$route);
    // 清除首页
    if (this.lists.length > 0 && this.lists[0].redirect === "/dashboard") {
      this.lists = [];
    }
  },
  methods: {
    isLink(item, i) {
      // return (
      //   i < this.lists.length - 1 && (!item.children || !item.children.length === 0)
      // );
      return i < this.lists.length - 1 && item.redirect === undefined;
    },
    loadSubApp(route) {
      if (window.MICRO) {
        this.$nextTick(() => {
          if (!this.loadFlag && this.containter === "RT_frame") {
            this.loadFlag = true;
            // 加载子应用节点，子应用将渲染在此节点之下
            loadMicroElement(".yu-frame-tab-box .ck");
            // 监听子应用路径
            MICRO.initStore(this.$store);
            MICRO.onGlobalStateChange((newStore, oldStore) => {
              // 全局状态数据改变监听
            });
          }
          // 渲染子应用
          renderMicroContent(route);
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
.breadcrumb-container {
  margin-top: -12px;
  background-color: transparent!important;
  padding-top: 0;

  .el-breadcrumb {
    line-height: $inputHeight;
    .el-breadcrumb__item {
      .el-breadcrumb__item__inner > span {
        color: $aColor;
        &:hover {
          color: $aColor;
          cursor: default;
          > a {
            color: $aColorHover;
          }
        }
      }
    }
  }
}
</style>
