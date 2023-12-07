<template>
  <div class="yu-frame-menu">
    <div class="el-menu-horizontal-scrollarea">
      <el-scrollbar class="set-overflow">
        <el-menu :default-active="activeMenu" class="portal-menu">
          <!--    'menu-active':
                currentTopMenu && currentTopMenu.menuId
                  ? currentTopMenu.menuId.includes('/')?currentTopMenu.menuId:('/'+currentTopMenu.menuId) === item.path
                  : currentIdx === idx,-->
          <a
            :class="{
              'menu-wrapper': true,
              'is-hover': currentTopMenu && currentTopMenu.menuId
                ? currentTopMenu.menuId.includes('/')?currentTopMenu.menuId:('/'+currentTopMenu.menuId) === item.path
                : currentIdx === idx,
            }"
            v-for="(item, idx) in menus"
            :key="idx"
            :hidden="!item.meta"
          >
            <!-- mouseover.stop -->
            <div
              v-if="item.meta && item.meta.title"
              @click="showMenuItemFn(item, idx, 'click')"
            >
              <item
                :icon="item.meta && item.meta.icon"
                :level="1"
                :title="generateTitle(item.meta.title)"
              />
            </div>
          </a>
        </el-menu>
        <side-drawer-item
          ref="sideDrawerRef"
          v-if="showDrawer"
          :sideDrawerData="currentItem"
          :allMenu="menus"
          @closeDrawer="closeFn"
        />
        <side-drawer-item
          ref="sideDrawerLikeMenuRef"
          :isLikedSide="true"
          v-else
          :sideDrawerData="likeMenuList"
          :allMenu="menus"
          @closeDrawer="closeFn"
          @refreshLikeMenuList="mapMenuList"
        />
      </el-scrollbar>
    </div>
    <div class="menu-like-list" :class="{'is-hover': currentIdx === -99}" @click="mapMenuList">
      <i title="yu-icon-star" class="yu-icon-star"></i>
      <span>我的收藏</span>
    </div>
  </div>
</template>

<script>
import { generateTitle } from "@/utils/i18n";
import { mapGetters } from "vuex";
import SideDrawerItem from "./SideDrawerItem";
import SideLikeMenu from "./SideLikeMenu";
import Item from "./Item";
import { sessionStore } from "@/utils";
import {
  MENU_STORE_KEY,
  MENU_LIKE,
  CURRENTFIRSTMENU,
  CURRENMENUINDEX,
  MENU_STOREOG_KEY,
  CURRENT_TOP_MENU_STORE_KEY,
} from "@/config/constant/app.data.common";
import { likeMenuList } from "@/api/common/oauth";
export default {
  components: {
    SideDrawerItem,
    SideLikeMenu,
    Item,
  },
  data() {
    return {
      // 自定义菜单相关参数
      direction: "ltr",
      keyword: "",
      showDrawer: false,
      // 二级菜单
      currentItem: {},
      currentIdx: "",
      likeMenuList: [], // 收藏菜单列表
    };
  },
  computed: {
    ...mapGetters(["originalMenus", "menus", "routes", "currentTopMenu"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path, params } = route;
      // if set path, the sidebar will highlight the path you set
      if (params.activeMenu) {
        return params.activeMenu;
      }
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
  },
  created() {
    this.setDefaultTopMenu();
  },
  mounted() {
    if (!sessionStore.get(MENU_LIKE)) {
      this.getLikeMenuList();
    }
  },
  methods: {
    // 获取收藏菜单
    getLikeMenuList() {
      likeMenuList({
        keepStatus: 1,
      }).then((res) => {
        sessionStore.set(MENU_LIKE, res.data); // 将数据缓存起来
        this.mapMenuList();
      });
    },
    mapMenuList() {
      this.currentIdx = -99;
      const likes = sessionStore.get(MENU_LIKE);
      // 遍历缓存中原始菜单数据，并展示到界面上
      const menus = sessionStore.get(MENU_STOREOG_KEY) || [];
      const likeMenus = [];
      likes.forEach((item) => {
        // 遍历获取菜单信息
        for (let i = 0, len = menus.length; i < len; i++) {
          if (item.menuId === menus[i].menuId) {
            likeMenus.push({
              id: menus[i].funcId,
              menuId: menus[i].menuId,
              menuName: menus[i].menuName,
              funcUrl: menus[i].funcUrl,
            });
            break;
          }
        }
      });
      this.showDrawer = false
      this.likeMenuList = likeMenus
    },
    setDefaultTopMenu() {
      // 默认进来是鼠标移动获取数据，不用，只留存点击的数据
      const originalMenus = sessionStore.get(MENU_STORE_KEY);
      // 默认第一个菜单项高亮
      if (!this.currentTopMenu || !this.currentTopMenu.path) {
        this.showMenuItemFn(originalMenus[0], 0, 'mouse');
      }
      if (this.currentTopMenu) {
        this.menus.forEach((item, idx) => {
          //这里经过测试存储的缓存有可能没有menuId只有path
          if (item.path === (this.currentTopMenu.path ? this.currentTopMenu.path : (this.currentTopMenu.menuId && (this.currentTopMenu.menuId.includes('/') ? this.currentTopMenu.menuId : ("/" + this.currentTopMenu.menuId))))) {
            this.showMenuItemFn(item, idx, 'mouse');
          }
        });
      }
    },
    generateTitle,
    closeFn() {
      this.$parent.$parent.showMenu = false;
      this.showDrawer = false;
    },
    showMenuItemFn(item, idx, type) {
      // 记录当前一级菜单索引
      this.currentIdx = idx;
      // 已经展示二级菜单的item不往下执行
      if (
        this.currentItem &&
        this.showDrawer &&
        this.currentItem.meta &&
        this.currentItem.meta.title && this.currentItem.meta.title === (item.meta && item.meta.title)
      ) {
        return;
      }
      this.currentItem = item;
      // 有子菜单的展示drawer
      this.showDrawer = Boolean(item.children);
      //解决用户缓存菜单后查看菜单没有定位到一级菜单的问题  避免菜单滑动的时候更新为默认的item而不是缓存的
      // if(sessionStore.get(CURRENT_TOP_MENU_STORE_KEY)) {
      //   return
      // }
      if(type === 'click') {
        this.$store.commit('oauth/SET_CURRENT_TOP_MENU', item);
      }

     
      // this.$nextTick(_ => {
      //  this.$refs.sideDrawerRef.keyword = '';
      // })
    },
  },
};
</script>
<style lang="scss" scoped>

.yu-frame-menu-left .yu-frame-menu {
  background: #fff;
}
.menu-like-list {
  margin-top: -68px;
  padding-left: 17px;
  height: 42px;
  font-size: 0;
  cursor: default;
  &.is-hover,&:hover {
    i, span {
      color: #447aff;
      cursor: pointer;
    }
  }
  span {
    margin-left: 13px;
    font-size: 14px;
    line-height: 42px;
    color: #333;
  }
}
.portal-menu {
  .menu-wrapper {
    display: block;
    padding-left: 16px;
    font-size: 14px;
    cursor: pointer;
    &:not(:hover){
      color: #333;
    }
    span {
      color: inherit;
      padding-left: 10px;
    }

    i {
      color: inherit;
    }
  }
}
.yu-frame-menu .el-menu {
  background-color: rgba(0, 0, 0, 0);
}

.el-menu-horizontal-scrollarea {
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 58px;
  & > .el-scrollbar .el-menu.tree-menu.el-menu--horizontal {
    display: flex;
    white-space: nowrap;
  }
}

.el-menu-horizontal-scrollarea > .el-scrollbar {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  > .el-scrollbar__wrap {
    height: 100%;
  }
  .el-scrollbar__bar.is-horizontal {
    display: none;
  }
}

.menu-drawer {
  .el-drawer {
    width: calc(100% - 224px) !important;
    .el-drawer__header {
      display: none !important;
    }
    .el-drawer__body {
      overflow: auto;
      background: #f1f2f5;
    }
    .el-button.el-button--default {
      width: 200px;
    }
  }
}
.drawer-modal {
  left: 224px !important;
  top: 80px !important;
  position: fixed;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: #000;
  z-index: 2000;
}
.menu-wrapper {
  height: 42px;
  line-height: 42px;
  &:first-child {
    margin-top: 20px;
  }
  li {
    cursor: default !important;
  }
  & > .el-submenu {
    height: inherit;
    line-height: inherit;
  }
}
.is-hover,
.menu-active {
  color: #447aff !important;
  .el-submenu__title {
    color: #447aff !important;
    font-weight: 600 !important;
    font-size: 0.088rem;
  }
}

$height-48: 48px;
$height-36: 36px;
$height-38: 38px;

.el-menu-item > i {
  margin-right: 8px;
}
.el-menu .menu-active {
  color: #447aff;
  border-right: 2px solid #447aff;
  background-color: transparent !important;
  background-image: linear-gradient(
    90deg,
    rgba(6, 99, 253, 0.04) 0%,
    rgba(6, 50, 253, 0.17) 97%
  ) !important;
  background-image: radial-gradient(
    46% -132%,
    rgba(255, 255, 255, 0.34) 100%,
    rgba(255, 255, 255, 0) 100%
  ) !important;
  background-image: radial-gradient(
    84% -115%,
    rgba(255, 255, 255, 0.34) 88%,
    rgba(255, 255, 255, 0) 100%
  ) !important;
}
.el-menu-item,
.el-submenu__title {
  cursor: default !important;
  .span-title {
    display: inline-block;
    min-width: 80px;
    cursor: pointer;
  }
}
#portal-menu .el-submenu .el-submenu__title:hover {
  color: unset !important;
}
</style>
<style>
  .el-menu-horizontal-scrollarea .el-scrollbar__bar.is-vertical {
    width: 0!important;
  }
  .set-overflow .el-scrollbar__wrap {
    overflow-x: visible !important;
    overflow-y: visible !important;
  }
</style>
