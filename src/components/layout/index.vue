<template>
  <!-- @mousewheel.stop="srollFn" -->
  <div :class="[classObj,showMenu?'add-menu-hover-box-shadow':'']" class="app-wrapper yu-frame-div">
    <slide-model v-model="showMenu" placement="top" :client="getBodyWidth">
      <sidebar ref="sideBar" class="sidebar-container side-menu" v-if="menus.length>0" />
      <div class="empty-data" v-else>
        <empty-msg class="side-menu" :msg="$t('menu.noMenuData')"></empty-msg>
      </div>
      <left-menu v-if="menuModel.id === 'topLeft'" class="sidebar-container" />
    </slide-model> 
    <div :class="{hasTagsView:needTagsView,bgTpian:bgClsass || bannerimg}" class="el-main-box main-container">
      <navbar-top-left v-if="menuModel.id === 'topLeft'" class="sidebar-container" ref="elMenu" />
      <navbar v-else :top-opacity="topOpacity" />
      <div :class="bgClsass? 'yu-top-container' : ''"></div>
      <sidebar v-if="menuModel.id === 'topTree' || menuModel.id === 'topTile'" class="sidebar-container2" ref="elMenu" />
      <tags-view v-show="needTagsView" :content="content" />
    </div>
  </div>
</template>

<script>
import Navbar from './Navbar'
import NavbarTopLeft from './Navbar/topLeft'
import LeftMenu from './TopLeft/leftMenu.vue';
import Sidebar from './Sidebar/index.vue'
import TagsView from './TagsView/index.vue'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState, mapGetters } from 'vuex'
import frameConfig from '@/config/frame'
import slideModel from './slide-model'
import emptyMsg from "@/components/layout/emptyMsg/index.vue"
import { sessionStore } from "@/utils";
import { MENU_STOREOG_KEY } from "@/config/constant/app.data.common";
export default {
  name: 'Layout',
  components: {
    Navbar,
    NavbarTopLeft,
    LeftMenu,
    Sidebar,
    TagsView,
    slideModel,
    emptyMsg
  },
  mixins: [ResizeMixin],
  props: {
    content: String, // 内容
    isChildApp: { // 是否子应用
      type: Boolean,
      default () {
        return false;
      }
    }
  },
  data() {
    return {
      showMenu: false,
      topOpacity: false,
      topOpacityNo: false,
      bgClsass: false,
      currentPath: '',
      khcx: false,
      bannerimg: false,
      routeArr: ['myAttention', 'myRemindList', 'AskCenterList']
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    ...mapGetters([
      'menuModel',
      'menuShowStat',
      'menus',
      'currentTopMenu',
      'currentMenuItem',
      'showLeftMenu',
      'originalMenus'
    ]),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
        'yu-frame-menu-vertical': this.menuModel.id === 'left' || this.menuModel.id === 'right',
        'yu-frame-menu-left': this.menuModel.id === 'left',
        'yu-frame-menu-right': this.menuModel.id === 'right',
        'yu-frame-menu-top': this.menuModel.id === 'topTree' || this.menuModel.id === 'topTile',
        'yu-frame-menu-top-left': this.menuModel.id === 'topLeft',
        'yu-frame-menu-show-left-menu': this.showLeftMenu,
        'yu-frame-menu-hover': this.menuShowStat === 3,
        'yu-frame-has-footer': frameConfig.baseFrameOptions.isFooter,
        'yu-frame-menu-collapse': !this.sidebar.opened && !(this.menuModel.id === 'topTree' || this.menuModel.id === 'topTile')
      }
    },
    getBodyWidth() {
      const rect = document.body.getBoundingClientRect();
      const w = parseInt(rect.width) * 0.4
      return w;
    },
  },
  watch: {
    /**
       * 监听菜单模式
       */
    menuModel: function (val, oldVal) {
      if (val.id === "topTree" || val.id === "topTile") {
        this.$nextTick(() => {
          this.$refs.elMenu.getMenuSize(val);
        });
      }
    },
    $route(to, from) {
      // 我的关注菜单背景图
      // 此处可以给有需要的界面添加透过头部导航栏的背景图，
      // 注：如果需要的背景图不同。需要另外写不同的样式（bgClass只是其中一种样式）
      /*
          主工程添加：  to.name === "路由最后的名称"；
          子工程添加：  this.$route.path === "/#/之后的全部名称"
         */
      // console.log("location", window.location)
      // console.log("router", this.$route);
      // console.log("hhhhh", this.$route.name)
      if (this.$route.name === 'yu-customer') {
        this.topOpacityNo = true;
      } else {
        this.topOpacityNo = false;
      }
      if (this.routeArr.indexOf(to.name) > -1) {
        this.bgClsass = true;
      } else {
        this.bgClsass = false;
      }
      if (this.$route.path === '/yu-query/queryNestedForm' || this.$route.path === '/yu-config/customerList' || this.$route.path === '/yu-config/implicitDebt' || this.$route.path === '/yu-config/customerQueryInfo') {
        this.khcx = true;
      } else {
        this.khcx = false;
      }
      if (this.$route.name === '/role/unit/unitTreeList') {
        this.topOpacityNo = false;
      } else {
        this.topOpacityNo = true;
      }
      // if(to.name === 'AskCenterList') {
      //   this.bannerimg = true;
      // }else{
      //   this.bannerimg = false;
      // }
      // this.bgClsass = to.name === 'myAttention';
      this.showMenu = false;
      // // 如果跳转到首页，则清空标记当前菜单的sessionStorge
      if (to.path === '/dashboard') {
        // 清空设置当前顶级菜单
        this.$store.commit('oauth/SET_CURRENT_TOP_MENU', '');
        // 清空设置当前最低一级菜单
        this.$store.commit('oauth/SET_CURRENT_MENU_ITEM', '');
      } else {
        // 设置当前最低一级菜单
        this.$store.commit('oauth/SET_CURRENT_MENU_ITEM', to);
        // 设置当前顶级菜单
        const toItem = Object.assign({}, to);
        toItem.menuId = toItem.meta.id;
        toItem.upMenuId = toItem.meta.pid;
        const topMenuItem = this.getTopMenu(toItem);
        this.$store.commit('oauth/SET_CURRENT_TOP_MENU', topMenuItem);
      }
    },
    showMenu(val) {
      if (val) {
        let currentMenu = '';
        this.menus.forEach(item => {
          if (this.currentTopMenu && item.path === this.currentTopMenu.path) {
            currentMenu = item;
          }
        })
        if (this.currentMenuItem.path) {
          this.$nextTick(_ => {
            this.$refs.sideBar.showDrawer = true;
            this.$refs.sideBar.currentItem = currentMenu;
          })
        }
      }
    }
  },
  created() {
    // 我的关注菜单背景图
    if (this.$route.name === 'yu-customer') {
      this.topOpacityNo = true;
    } else {
      this.topOpacityNo = false;
    }
    if (this.routeArr.indexOf(this.$route.name) > -1) {
      this.bgClsass = true;
    } else {
      this.bgClsass = false;
    }
    if (this.$route.path === '/yu-query/queryNestedForm' || this.$route.path === '/yu-config/customerList' || this.$route.path === '/yu-config/implicitDebt' || this.$route.path === '/yu-config/customerQueryInfo') {
      this.khcx = true;
    } else {
      this.khcx = false;
    }
    // 统一权限背景图
    if (this.$route.name === '/role/unit/unitTreeList') {
      this.topOpacityNo = false;
    } else {
      this.topOpacityNo = true;
    }
    // if(this.$route.name === 'AskCenterList') {
    //   this.bannerimg = true;
    // }else{
    //   this.bannerimg = false;
    // }
    // this.bgClsass = this.$route.name === 'myAttention';
  },
  mounted() {
    const frameDom = document.body.querySelector('.yu-frame-tab-box')
    this.$store.dispatch('app/setViewSize', { width: frameDom.clientWidth, height: frameDom.clientHeight - 80});
    document.body.addEventListener('scroll', this.srollFn, true)
    // 添加鼠标点击菜单范围
    document.addEventListener("mouseup", this.handleMouseup);
  },
  destroyed() {
    document.body.removeEventListener('scroll', this.srollFn)
    document.removeEventListener("mouseup", this.handleMouseup);
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },

    openLeftMenu() {
      this.$store.commit('oauth/SET_SHOW_LEFT_MENU', true);
    },
    srollFn(ev) {
      if (this.topOpacityNo && ev.target.classList.contains('yu-frame-tab') && ev.target.classList.contains('app-main')) {
        const fontSize = document.querySelector('html').style.fontSize.split('p')[0]
        this.topOpacity = ev.target.scrollTop > fontSize * 0;
      } else if (ev.target.classList.contains('yu-frame-tab') && ev.target.classList.contains('app-main')) {
        const rate = 200 / 192
        const fontSize = document.querySelector('html').style.fontSize.split('p')[0]
        this.topOpacity = ev.target.scrollTop > fontSize * rate;
      }
    },
    handleMouseup(e) {
      const sideBar = document.querySelector('.side-menu');
      const menuIcon = document.querySelector('.menu-icon');
      if (sideBar && menuIcon) {
        if (!sideBar.contains(e.target) && !menuIcon.contains(e.target)) {
          this.showMenu = false;
        }
      }
    },
    getTopMenu(item) {
      let result;
      // 如果是最顶级菜单，直接返回结果
      if (item.upMenuId === '0') {
        return item;
      } else {
        // 遍历查找父级菜单
        const allMenu = sessionStore.get(MENU_STOREOG_KEY) || [];
        for (let i = 0, len = allMenu.length; i < len;i++) {
          const curMenu = allMenu[i];
          if (curMenu.menuId && curMenu.menuId === item.upMenuId) {
            result = this.getTopMenu(curMenu);
            if (result) {
              return result;
            }
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .add-menu-hover-box-shadow{
  .yu-slide-model{
    box-shadow: 12px 12px 18px 0px rgba(0, 0, 0, 0.08);
  }
}
  .yu-frame-div > .el-main-box{
    position: relative;
    display: block;
    background-color: #f9f9fb;
    padding: 0 0 0 0;
    height: 100%;
    overflow: hidden;
  }
  .el-switch-show-left-menu {
    position: absolute;
    top: 64px;
    left: 0;
    bottom: 0;
    margin: auto;
    width: 16px;
    height: 32px;
    line-height: 32px;
    color: #fff;
    z-index: 8;
    text-align: center;
    cursor: pointer;
    background: #2877FF;
    border-radius: 0 4px 4px 0;
  }
  .bgTpian {
    //background-image: url('~assets/common/images/banner.png');
    background-repeat: no-repeat;
    position: fixed;
    width: 100%;
    min-width: 1000PX;
    background-size: 1920px 441px;
    background-position: center 0;
  }
  .yu-top-container {
    width: 100%;
    top:350px;
    height: 179px;
    // margin-top: 340px;
    background-position-y: 34px;
    // background: url('~assets/common/images/dashboard/mb.png') no-repeat;
    position: absolute;
    // background-size: 100% 100%;
    // margin-top: -160px;
    // z-index: 2;
    // position: relative;
    // padding: 0 44px 28px 44px;
    // background: url("~assets/common/images/dashboard/mb.png") no-repeat;
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.05) 5%,
        rgba(242,242,242,1) 32%
    );
    // background-position-y: 70px;
    box-sizing: border-box;
    // z-index: 1;
  }
  .banner{
    height: 519px;
    object-fit: fill;
    width: 100%;
  }
  .empty-data{
    margin-top: 300px;
  }
  .nest-warning{
    position: absolute;
    object-fit: fill;
    width: 100%;
    height: 100%;
    content: "";
  }
  .bannerimg{
    position: absolute;
    object-fit: fill;
    width: 100%;
    height: 519px;
    z-index: 0;
  }
  .yu-frame-tab{
    z-index: auto;
  }
</style>
