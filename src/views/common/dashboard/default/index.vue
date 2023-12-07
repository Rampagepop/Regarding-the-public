<template>
  <div class="yu-dashboard-container" style="margin-top: -24px">
    <div class="el-top-container">
      <!-- banner autoplay -->
      <div class="yu-frame-banner-list" v-if="bannerList.length > 0">
        <el-carousel
          :style="'height:' + bannerHeight + 'px'"
          :interval="5000"
          arrow="never"
          autoplay
        >
          <el-carousel-item v-for="(item, index) in bannerList" :key="item.id">
            <!-- :href="item.skpLink" -->
            <a href="javascript:void(0);">
              <img
                ref="banner"
                :src="getFileUrl(item)"
                class="banner"
                v-if="isPicture(item)"
              />
              <!--              <div class="banner" v-if="isPicture(item)" :style="'background-image: url('+ getFileUrl(item) + ')'"></div>-->
              <video
                :src="getFileUrl(item)"
                :key="index"
                muted
                autoplay
                loop
                class="banner"
                v-else
              ></video>
              <!-- <div class="banner-title">
                <h2>{{ item.bannerTitle }}</h2>
                <span>{{ item.bannerRemark }}</span>
              </div> -->
            </a>
          </el-carousel-item>
        </el-carousel>
      </div>
      <el-row class="box-card" :gutter="16">
        <el-col :span="18">
          <el-row>
            <el-col :span="8" class="user-info-box">
              <div class="user-info">
                <div class="user-info-avatar">
                  <img :src="defaultAvatar" @click="acceptPowerFn" title="" />
                  <span>
                    <label>
                      {{
                        $t("dashboard.hyn", {
                          userName: userName,
                          sex:
                            userSex === "0"
                              ? $t("dashboard.ns")
                              : $t("dashboard.xs"),
                        })
                      }}
                    </label>
                    <label>{{ userRole }}</label>
                  </span>
                </div>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="common-funcions">
                <div class="functions-guide">
                  <span>{{ $t("dashboard.commonFunction") }}</span>
                  <template v-if="functionsGuide.length > 0">
                    <el-tooltip
                      :disabled="
                        strIsChn(item.menuName)
                          ? item.menuName.length <= 6
                          : item.menuName.length <= 13
                      "
                      :placement="idx < 3 ? 'top-start' : 'bottom-start'"
                      :content="item.menuName"
                      v-for="(item, idx) in functionsGuide"
                      :key="item.id"
                    >
                      <el-button
                        class="functions-item"
                        @click="clickMenuFn(item)"
                        :key="item.id"
                      >
                        {{ item.menuName }}
                      </el-button>
                    </el-tooltip>
                  </template>
                  <empty-msg :msg="$t('dashboard.nofunctions')" v-else />
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <div class="ask-center">
            <div class="ask-center-item">
              <div class="ask-center-title">
                <label>{{ $t("dashboard.askCenter") }}</label>
                <a href="javascript:void(0);" @click="viewList">{{
                  $t("dashboard.more")
                }}</a>
              </div>
              <template v-if="askcenterList">
                <div @click.stop="viewDetail($event)">
                  <vue-seamless-scroll
                    :data="askcenterList"
                    :class-option="classOption"
                  >
                    <p
                      v-for="item in askcenterList"
                      :class="getAskClass(item)"
                      :key="item.id"
                      :data-uid="item.id"
                    >
                      <span
                        class="title-suffix"
                        :title="item.infTitle"
                      >
                        <i :class="['ask-item-icon', 'icon-' + item.infType]"></i>
                        <i v-if="item.important === 1" class="ask-important-icon el-icon-warning"></i>
                        <span class="infinite">
                          <span class="title-suffix">
                            {{ item.infTitle }}
                          </span>
                        </span>
                      </span>
                    </p>
                  </vue-seamless-scroll>
                </div>
              </template>
              <empty-msg :msg="$t('dashboard.noask')" v-else />
            </div>
          </div>
        </el-col>
      </el-row>
      <yu-drag-view />
    </div>
    <yu-advertisement
      :visible="showAdvertise"
      :adsInfo="adsInfo"
      @closeDialog="closeFn"
    />
    <!-- <acceptPowerDia :showDialog.sync="showDialog" :diaData="rcrdData" :dialogTitle="dialogTitle"></acceptPowerDia> -->
    <yu-page-assist
      target=".topScroll0"
      help-icon="yu-icon-setting2"
      @custom-click="btnSettingsFn"
      help-title="设置"
      position="48px"
    />
    <yu-xdialog
      :visible.sync="askDialogVisible"
      :title="$t('dashboard.askdetailtitle')"
      class="ask-detail"
      width="960px"
      height="50%"
    >
      <ask-center-detail :ask-id="askID" />
    </yu-xdialog>
  </div>
</template>

<script>
import defaultAvatar from "@/assets/common/images/user_default_pic.png";
import YuAdvertisement from "@/views/common/dashboard/advertisement.vue";
import askCenterDetail from "@/views/common/dashboard/AskCenter/askCenterDetail.vue";
import EmptyMsg from "@/components/layout/emptyMsg/index.vue";
import {
  advertisementShow,
  findListLimit,
  getAskListTitle,
  showBanner,
} from "@/api/portal/backstageAdmin";
import { countMenuClick } from "@/api/common/oauth";
import YuDragView from "@/views/portal/card/dragView.vue";
import { getFileUrl, getUrl, strIsChn, textRange } from "@/utils/util";
import { extend, localStore, sessionStore } from "@/utils";
import {
  MAX_COMMON_MENU_COUNT,
  MENU_STOREOG_KEY,
  FROM_LOGIN
} from "@/config/constant/app.data.common";
import { mapGetters } from "vuex";

export default {
  name: "DashboardEditor",
  components: {
    YuAdvertisement,
    askCenterDetail, // 资讯详情展示
    YuDragView, // 工作台卡片列表
    EmptyMsg, // 空数据显示
  },
  data: function () {
    return {
      defaultAvatar: defaultAvatar,
      showAdvertise: false, //是否展示开屏广告
      adsInfo: {}, // 广告信息
      functionsGuide: [],
      askcenterList: [], // 资讯列表
      classOption: {
        step: 0.2, //控制无缝滚动速度，数值越大滚动越快
        limitMoveNum: 3,
      },
      showDialog: false,
      dialogTitle: this.$t("dashboard.zsq"),
      bannerList: [], // banner列表数据
      askDialogVisible: false, // 是否显示资讯详情
      askID: "", // 资讯ID
      bannerHeight: 0,
      askTimer: null, // 定时器获取资讯信息
    };
  },
  computed: {
    ...mapGetters([
      "userName",
      "userCode",
      "userSex",
      "genderCd",
      "theme",
      "org",
      "selectedRoles",
      "advertiseSign",
    ]),
    userRole() {
      if (this.selectedRoles) {
        return `${this.selectedRoles.orgName} / ${this.selectedRoles.roleName}`;
      }
      return "";
    },
  },
  watch: {
    theme: function (newVal) {
      this.theme = newVal;
      // 只调用未定义
      // this.setThemeColor();
    },
  },
  created() {
    this.calcBannerHeight();
  },
  mounted: function () {
    // 获取资讯列表
    this.getAskListTitle();
    // 资讯定时获取数据
    this.getCycleAskList();
    // 常用菜单
    this.findListLimit();
    // 获取banner列表
    this.getBannerList();
    // 开屏广告展示，广告看完不再打开了
    if(this.checkGetAdvert()) {
      this.advertisementShow();
    }
  },
  destroyed() {
    clearTimeout(this.askTimer);
  },
  methods: {
    // 获取资讯要闻样式
    getAskClass(item) {
      const cls = ["ask-readed"];
      item.readed === 0 && cls.push("un-read");
      item.important === 1 && cls.push("is-important");
      return cls.join(" ");
    },
    // 周期性资讯获取数据
    getCycleAskList() {
      this.askTimer = setTimeout(() => {
        clearTimeout(this.askTimer);
        this.getAskListTitle();
        this.getCycleAskList();
      }, 1000 * 60 * 10); // 每10分钟查询下
    },
    checkGetAdvert() {
      const isFromLogin = sessionStore.get(FROM_LOGIN) || '1';
      sessionStore.set(FROM_LOGIN, '0')
      return isFromLogin === '1' ? true : false
    },
    strIsChn,
    calcBannerHeight() {
      const windowWidth =
        document.documentElement.clientWidth || document.body.clientWidth;
      this.bannerHeight = (windowWidth / 1920) * 210;
    },
    isPicture(item) {
      return true;
    },
    // 获取文件路径
    getFileUrl(item) {
      return (item && getFileUrl(item.imgUrl)) || "";
    },
    // 获得门户banner列表
    getBannerList() {
      showBanner().then((res) => {
        if (res.code === "0") {
          this.bannerList = res.data.splice(0, 5) || [];
        }
      });
    },
    acceptPowerFn() {
      this.dialogTitle =
        Number(this.rcrdData.total) > 0
          ? this.$t("dashboard.bsq")
          : this.$t("dashboard.zsq");
      this.showDialog = true;
    },
    /**
     * @description 开屏广告展示
     */
    advertisementShow() {
      advertisementShow().then((res) => {
        if (res.code === "0") {
          if (res.data && res.data.fileAddr) {
            // 静态资源(图片、多媒体)资源存在时
            this.adsInfo = extend(res.data, {
              sourceUrl: getUrl({
                url: getFileUrl(res.data.fileAddr),
              }),
            });
            this.showAdvertise = true;
          }
        }
      });
    },
    // 关闭宣传广告
    closeFn() {
      this.showAdvertise = false;
    },
    btnSettingsFn() {
      // 点击跳转卡片设置界面
      this.$router.push("/dragable");
    },
    // 常用菜单
    findListLimit() {
      findListLimit().then((res) => {
        if (res.code === "0") {
          const datas = res.data || [];
          const menus = sessionStore.get(MENU_STOREOG_KEY) || [];
          this.functionsGuide = [];
          datas.forEach((item, idx) => {
            if (idx < MAX_COMMON_MENU_COUNT) {
              // 遍历获取菜单信息
              for (let i = 0, len = menus.length; i < len; i++) {
                if (item.menuId === menus[i].menuId) {
                  this.functionsGuide.push({
                    id: menus[i].funcId,
                    menuId: menus[i].menuId,
                    menuName: menus[i].menuName,
                    funcUrl: menus[i].funcUrl,
                  });
                  break;
                }
              }
            }
          });
          if (this.functionsGuide.length < MAX_COMMON_MENU_COUNT) {
            // 从缓存取数递去重递补凑够10个
            this.getcommonFun();
          }
        }
      });
    },
    // 从前端缓存取菜单数据
    getcommonFun() {
      const allMenu = sessionStore.get(MENU_STOREOG_KEY) || [];
      const menuIdArr = [];
      this.functionsGuide.forEach((item) => {
        menuIdArr.push(item.menuId);
      });
      for (let i = 0; i < allMenu.length; i++) {
        if (this.functionsGuide.length === MAX_COMMON_MENU_COUNT) {
          return;
        }
        // 取可跳转的并且去重
        if (
          allMenu[i].funcUrl &&
          allMenu[i].upMenuId != 0 &&
          menuIdArr.indexOf(allMenu[i].menuId) === -1 &&
          this.functionsGuide.length < MAX_COMMON_MENU_COUNT
        ) {
          this.functionsGuide.push(allMenu[i]);
        }
      }
    },
    jump() {
      this.$router.routePush({
        path: "content/systemManager/roleDataPowerManager/roleDataPowerManager",
      });
    },
    viewDetail($event) {
      const item = $event.target.closest('.ask-readed');
      // 弹窗展示资讯详情
      if (item) { // 是否是滚动组件的某一行/列
        this.askDialogVisible = true;
        const { uid } = item.dataset;
        this.askID = uid;
        // 后续操作
        const obj = this.askcenterList.find(item => {
          return item.id === Number(uid);
        })
        this.$set(obj, 'readed', 1);
      }
    },
    // 跳转到咨询列表
    viewList() {
      this.$router.push("/askcenterlist");
    },
    clickMenuFn(item) {
      /*菜单点击记录统计*/ //缓存的数据里面不是id 是menuId
      countMenuClick({
        menuId: item.id ? item.id : item.menuId,
      });
      /*菜单点击记录统计*/
      this.$router.push("/" + item.funcUrl);
    },
    // 获得咨询标题列表
    getAskListTitle() {
      getAskListTitle({
        page: 1,
        size: 7,
      }).then((res) => {
        if (res.code == "0") {
          res.data.map((v) => {
            this.$set(v, "tooltipShow", false);
          });
          this.askcenterList = res.data;
          // this.askcenterList.push();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 资讯是否显示弹窗 e dom元素 index 索引
    isShowToltip(e, index) {
      this.askcenterList[index].tooltipShow = textRange(e.target);
    },
    // 隐藏弹窗tooltip
    hideTip(index) {
      this.askcenterList[index].tooltipShow = false;
    },
    tableToggle: function () {
      if (this.isSelected) {
        this.isSelected = false;
        this.isSelected1 = true;
      } else {
        this.isSelected = true;
        this.isSelected1 = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.user-info-box {
  background: url(~~assets/common/images/home_userinfo_bg.png) 0 0 no-repeat;
  background-size: contain;
}
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.dashboard-editor-container {
  background-color: #e3e3e3;
  min-height: 100vh;
  padding: 50px 60px 0px;
  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;
    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
}

.banner {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.banner-title {
  position: absolute;
  top: 140px;
  left: 300px;
  & > h2 {
    opacity: 0.8;
    font-size: 30px;
    color: #1a1f36;
    letter-spacing: 0;
    line-height: 42px;
  }
  & > span {
    opacity: 0.7;
    font-size: 15px;
    color: #1a1f36;
    letter-spacing: 0;
  }
}
.box-card > .el-card__body {
  padding: 0 !important;
}
.ask-detail {
  .el-dialog-x__body,
  .el-card.box-card {
    padding-top: 0;
  }
  .ask-center-title {
    background-color: red;
  }
}
.un-read .title-suffix::after {
  content: "";
  position: absolute;
  top: 2px;
  right: 5px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: red;
}
</style>
