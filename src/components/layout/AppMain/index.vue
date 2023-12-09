/**
 * @created by pan
 * @updated by helin3 2019-04-06
 * @description 面包屑展示区域
 */
<template>
  <!-- //topScroll0 用于点击top的时候让首页滚动到最开头的时候用的class  用ck无效-->
  <div class="ck topScroll0">
    <div class="breadcrumb-container" v-if="lists.length > 0">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <!-- 固定增加首页 -->
          <router-link to="/" class="noRedirect">{{ $t("route.dashboard") }}</router-link>
        </el-breadcrumb-item>
        <div v-if="!isLink(lists[0], 0)">
          <el-breadcrumb-item v-for="(item) in lists" :key="item.path">
            <!-- 遍历路由信息并展示 -->
            <span v-if="!isLink || item.redirect === 'noRedirect'">{{ item.meta.title }}</span>
            <a v-else-if="isLink" @click.prevent="handleLink(item)" class="noRedirect">{{ item.meta.title }}</a>
          </el-breadcrumb-item>
        </div>
      </el-breadcrumb>
    </div>
    <div class="breadcrumb-container" v-if="liston.length > 0">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <!-- 固定增加首页 -->
          <router-link to="/" class="noRedirect">{{ $t("route.dashboard") }}</router-link>
        </el-breadcrumb-item>
        <div v-if="liston.length > 0">
          <el-breadcrumb-item v-for="(item, index) in liston" :key="item">
            <!-- 遍历路由信息并展示 -->
            <a v-if="liston.length - 1 === index" @click.prevent="handleroute()" class="noRedirect">{{ item }}</a>
            <span v-else-if="liston.length - 1 !== index">{{ item }}</span>
          </el-breadcrumb-item>
        </div>
      </el-breadcrumb>
    </div>
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import settings from "@/config";
import { mapGetters } from "vuex";
import { MENU_STORE_KEY, MENU_STOREOG_KEY } from "@/config/constant/app.data.common";
import { sessionSore } from "@/utils";
import { getUpMenu } from "@/utils/utils";
import { loadMicroElement, renderMicroContent } from "@yufp/xy-micro";

export default {
  name: "AppMain",
  data() {
    return {
      lists: [], // 定义一个数组 用于接收路由信息
      liston: []
    };
  },
  computed: {
    ...mapGetters(["selectedRoles"]),
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
    $route(to, from) {
      /* eslint prefer-rest-params:0 */
      this.loadSubApp(to);
      // 获取路由信息
      // 这里必须使用监听，否则无法实时获取路由变动信息,监听后路由会实时变动，不然需要手动刷新路径才会改变
      const matched = to.matched;
      const allMenu = sessionSore.get(MENU_STOREOG_KEY) || [];
      const originalMenus = sessionSore.get(MENU_STORE_KEY)
      // 当前路由为 dashboard时，自定清空
      if (matched && matched.length > 0 && to.path !== "/dashboard") {
        if (to.meta.menuId) {
          let parentPath = getUpMenu(originalMenus, to.meta.menuId, 'top') + to.meta.title
          let parentPathmatched = parentPath.split('/')
          this.liston = parentPathmatched
        } else {
          this.lists = matched;
        }
      } else {
        this.lists = [];
        this.liston = [];
      }
    },
  },

  created() {
    this.lists = this.$route.matched; //获取路由内的全部信息
  },
  mounted() {
    // this.loadSubApp(this.$route);
    // 清除首页
    if (this.lists.length > 0 && this.lists[0].redirect === "/dashboard") {
      this.lists = [];
    }
  },
  methods: {
    isLink(item, i) {
      return i < this.lists.length - 1 && item.redirect === undefined;
    },
    handleLink (item) {
      if (item.path.indexOf("crdtBankWeb") > -1) {
        // 此处item.name为菜单编号,与新信管达成一致,触发点击事件,新信管获取事件ID
        if (item.meta.id) {
          $("#" + item.name).click()
        } else {
          this.$router.push('/dashboard')
        }
      } else {
        this.$router.push(item.path);
      }
    },
    handleroute () {
      this.$router.push('/dashboard')
    }
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
          color: $aColorHover;
        }
      }
      .noRedirect {
        font-weight: 700;
        color: #e32c20;
        cursor: default;
        &:hover {
          color: $aColorHover;
        }
      }
    }
  }
}
</style>
