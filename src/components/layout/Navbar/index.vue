<template>
  <div class="navbar yu-frame-top-bar">
    <div v-if="isLeft || isRight" class="yu-frame-top-bar-left">
      <hamburger
        id="hamburger-container"
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleShow="toggleSideBar"
      />
      <breadcrumb
        v-if="baseFrameOptions.breadCrumb"
        id="breadcrumb-container"
        class="breadcrumb-container"
      />
    </div>
    <div class="yu-logo" @click="goHomeFn">{{ appName }}</div>
    <!--<logo v-else-if="showLogo && isTop" :is-collapse="false" />-->
    <div class="yu-frame-top-bar-right">
      <span
        class="sys-tools"
        v-for="(item, index) in sysToolsFiltered"
        :key="index"
        :title="item.event && item.event.click ? item.text : ''"
        :class="[
          item.icon,
          item.className,
          {
            'serach-show': showSearchInput && item.id === 'search',
            click: item.event && item.event.click,
          },
        ]"
        @click="toolClick(item, $event)"
        @mouseenter="toolMouseEnter(item, $event)"
        @mouseout="toolMouseOut(item, $event)"
      >
        <yu-badge
          class="badge-c"
          v-show="item.badgeDot"
          :is-dot="!item.showUnread"
          :value="item.messageNum"
        ></yu-badge>
        <div
          v-if="item.id === 'search'"
          class="yu-frame-dropdown-menu yu-frame-message search"
          title
        >
          <yu-search />
        </div>
        <!--search end  -->
        <!--message sta  -->
        <div
          v-if="item.id === 'message'"
          class="yu-frame-dropdown-menu yu-frame-message notice-tab-container"
          title
        >
          <yu-tabs value="all">
            <yu-tab-pane
              v-for="(p, i) in panes"
              :key="p"
              :label="messageTitle[p]"
              :name="p"
            >
              <ul
                class="yu-frame-message-list"
              >
                <li
                  v-for="(it, idx) in messagesListByType(i)"
                  :key="idx"
                  :class="{ 'is-readed': it.readed }"
                >
                  <i :class="getMessageTypeIcon(it)" />
                  <p>
                    <span :class="!it.readed ? 'is-unread' : ''" :title="it.messageTips">
                      {{ it.messageTips }}
                    </span>
                    <span>
                      <i>{{ it.remindTime }}</i>
                      <i v-if="it.state">{{ it.state }}</i>
                      <a href="javascript:void(0);">
                        <template>
                          <span @click="viewDetail(it)">{{
                            getMessageHandlerText(it)
                          }}</span>
                        </template>
                      </a>
                    </span>
                  </p>
                </li>
              </ul>
              <div
                class="yu-frame-message-buttons message-buttons-c"
              >
                <yu-button type="text" @click="btnReadAll">{{
                  messageBtn3
                }}</yu-button>
                <yu-button type="text" @click="btnMessageMore">{{
                  messageBtn4
                }}</yu-button>
              </div>
              <div class="search-no-data" v-if="messagesListByType(i).length === 0">
                <empty-msg></empty-msg>
              </div>
            </yu-tab-pane>
          </yu-tabs>
        </div>
        <!--message sta-->
        <!--themes sta-->
        <div
          v-if="item.id === 'themes'"
          class="yu-frame-dropdown-menu yu-frame-themes"
          title
        >
          <template v-for="itm in themeToolFiltered">
            <!--            <h1 :key="itm.id + '_' + i">-->
            <!--              {{ itm.text }}-->
            <!--              <span v-if="itm.extend === 'true'" class="yu-frame-themes-right">-->
            <!--                自动-->
            <!--                <yu-switch-->
            <!--                  @change="changeModelFn"-->
            <!--                  :width="48"-->
            <!--                  v-model="autoSizeModel"-->
            <!--                  on-text="是"-->
            <!--                  off-text="否"-->
            <!--                ></yu-switch>-->
            <!--              </span>-->
            <!--            </h1>-->
            <template v-if="itm.id === 'skin'">
              <div class="yu-frame-themes-list" :key="itm.id">
                <div
                  v-for="(it, idx) in themesList"
                  :key="idx"
                  :class="it.id"
                  :title="it.name"
                  @click="switchThemes(it.id)"
                >
                  <span :style="{ backgroundColor: it.color }"></span>
                  <i v-if="it.checked" class="yu-icon-checked2"></i>
                </div>
              </div>
            </template>
          </template>
        </div>
        <div
          class="yu-frame-dropdown-menu yu-frame-language"
          title
          v-if="item.id === 'language' && languageList.length > 1"
        >
          <span
            v-for="(it, idx) in languageList"
            :key="idx"
            @click="switchLanguage(it.id)"
            :class="[it.checked ? 'yu-icon-checked2' : 'yu-icon-choice-un']"
            :title="it.name"
          >
            {{ it.name }}
          </span>
        </div>
      </span>
      <div class="yu-frame-top-user">
        <i class="yu-icon-arr-down1"></i>
        <div class="pic">
          <img
            :src="userInfo.pic"
            :title="userInfo.name + '，' + selectedRoles.name"
          />
        </div>
        <div
          class="name-role"
          :title="getNameRole()"
        >
          <b>{{ userInfo.name }}</b>
          <span>{{ selectedRoles.roleName }}</span>
        </div>
        <div class="yu-frame-dropdown-menu" :class="userInfo.roles.length > 1 ? 'yu-frame-dropdown-menu-ar' : ''" title>
          <template v-if="userInfo.roles.length > 1">
            <span
              v-for="(item, index) in userInfo.roles"
              :key="index"
              @click="switchRole(item)"
              class="role-span"
              :class="getRolesChangeClass(selectedRoles, item)"
              :title="item.orgName + '(' +item.roleName + ')'"
            >
              {{ item.orgName }}({{ item.roleName }})
            </span>
            <hr />
          </template>
          <span @click="personalData">{{ $t("component.personalData") }}</span>
          <span @click="modifyPwdFn">{{ $t("component.changePassword") }}</span>
          <span @click="logoutFn">{{ $t("component.logout") }}</span>
        </div>
      </div>
    </div>
    <yufp-password-modify
      :dialog-visible.sync="pwdDialogVisible"
      :first-login="false"
    >
    </yufp-password-modify>
    <yufp-personal-data :dialog-visible.sync="personInfoDialogVisible">
    </yufp-personal-data>
    <yu-xdialog title="资讯详情" :visible.sync="newsDetailsVisible">
      <div v-html="newsDetails"></div>
    </yu-xdialog>
    <yu-calendar-detail :visible.sync="eventDialogVisible" :related-id="relatedId" />
  </div>
</template>

<script>
import navbarMixin from "./navbar.mixin";
import YufpPasswordModify from "@/components/widgets/YufpPasswordModify";
import YufpPersonalData from "@/components/widgets/YufpPersonalData";
import YuSearch from "@/components/layout/Navbar/search/index.vue";
import EmptyMsg from "@/components/layout/emptyMsg/index.vue";
import YuCalendarDetail from "@/views/content/portalManager/messageCenterManager/messageCalendarDetail.vue";
import { readMsg } from "@/api/portal/backstageAdmin";
import { sessionStore } from '@/utils'
import { USER_MESSAGE_CONFIG } from "@/config/constant/app.data.common";
export default {
  components: { YufpPasswordModify, YufpPersonalData, YuSearch, EmptyMsg, YuCalendarDetail },
  mixins: [navbarMixin],
  data() {
    return {
      pwdDialogVisible: false,
      personInfoDialogVisible: false,
      newsDetailsVisible: false,
      dialogTableVisible: false,
      formdata: {},
      newsData: [],
      newsDataTotal: 0,
      newsDetails: "",
      eventDialogVisible: false, // 日历事件详情
      relatedId: '', // 日历事件查询ID
    };
  },
  methods: {
    getNameRole() {
      return this.userInfo.name + '，' + this.selectedRoles.orgName + '/' + this.selectedRoles.roleName
    },
    getRolesChangeClass(selectedRoles, item) {
      return selectedRoles.orgId === item.orgId &&
        selectedRoles.roleId === item.roleId
        ? "yu-icon-checked2"
        : "yu-icon-choice-un";
    },
    // 获取消息列表操作按钮显示文本
    getMessageHandlerText(it) {
      return it.msgType === 1 ? this.messageBtn1 : this.messageBtn2;
    },
    // 点击跳转到详情
    viewDetail(it) {
      // 根据数据不同类型跳转不同详情
      // msgType: 消息类型，1-待办提醒(待办)、2-业务消息（消息）、3-提示事件(提醒)、0-全部
      // remindType: 消息提醒类型 1-风险预警、2-资讯、3-到期提醒、4-日历日程、0-全部
      console.log("消息类型 ===>>>是否点击", it.msgType, it.remindType);
      const userMessageConfig = sessionStore.get(USER_MESSAGE_CONFIG) || {}
      const showUnread = userMessageConfig.showUnread === 1 ? true : false
      readMsg(it.id).then(() => {
        this.getMessageDot(showUnread);
        switch (it.msgType) {
          case 3: // 提示事件(提醒)
            switch (it.remindType) {
              case 2: // 资讯
                this.$router.push("/askcenter/" + it.relatedId);
                break;
              case 3: // 到期提醒
                this.$router.push("/askcenter/" + it.id);
                break;
              case 4: // 日历日程
                // 加载日历事件
                this.eventDialogVisible = true; // 日历事件详情
                this.$nextTick(() => {
                  this.relatedId = it.relatedId; // 日历事件查询ID
                })
                break;
              default:
                this.$message("功能开发中，敬请期待。");
            }
            break;
          case 1://待办
          //跳转到业务中台的业务编辑页面（对接客户管理、授信管理）
            this.$message("功能开发中，敬请期待。跳转到业务中台的业务编辑页面");
            break;
          case 2://业务消息
            this.$message("功能开发中，敬请期待。跳转到业务中台的详情查看页面");
            //跳转到业务中台的详情查看页面（对接客户管理、授信管理）
            break;
          default:
            this.$message("功能开发中，敬请期待。");
        }
      })
    },
    // 点击系统标题返回首页
    goHomeFn() {
      this.$router.push("/dashboard");
    },
    /**
     * 修改密码
     */
    modifyPwdFn() {
      this.pwdDialogVisible = true; // 打开修改密码弹出框
    },
    logoutFn() {
      const _this = this;
      _this
        .$confirm(_this.$t("component.qdsftcdl"), _this.$t("component.ts"), {
          confirmButtonText: _this.$t("component.qd"),
          cancelButtonText: _this.$t("component.qx"),
          type: "warning",
        })
        .then(function () {
          _this.logout();
        });
    },
    // 查看个人资料
    personalData() {
      this.personInfoDialogVisible = true;
    },
    toggleSideBar() {
      this.$parent.showMenu = true;
    }
  },
};
</script>
<style lang="scss" scoped>
.search-no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.yu-frame-message.notice-tab-container .yu-frame-message-list>li,.notify-content-cz {
  color: #999;

  .is-unread {
    color: #333333;
  }

  a span {
    color: #2877ff;
  }
}
.yu-frame-message.notice-tab-container .yu-frame-message-list>li.is-readed i,.notify-content-cz .is-readed i {
  opacity: 0.7;
}
 

</style>
<style>
.notify-content-box-cz .yu-icon-warning1{
  font-size:40px;
  color:#2877ff;
} 
.notify-content-cz p span{
  display:block;
  word-break:break-all;
  text-align: left;
}
.notify-content-box-cz .ahover{
      color: #2877ff!important;
      border: 1px #2877ff solid!important;
}
.notify-content-box-cz .anothover{
  color: #666666!important;
  border: 1px #E0E0E0 solid!important;
}
.notify-content-box-cz a{
    display: inline-block;
    float: right;
    font-size: 12px;
    padding: 0 10px;
    -webkit-transition: .2s;
    transition: .2s;
    border-radius: 10px;
    height: 20px;
    line-height: 20px;
    margin-top: 5px;
    
}
.notify-content-box-cz a span{
  color: #2877ff;
}
.yu-frame-message-list .no-notice-data {
  text-align: center;
  font-size: 14px;
  position: absolute;
  top: 36%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.yu-frame-top-bar {
  position: relative;
  z-index: 99;
}
.yu-frame-message-buttons.message-buttons-c {
  padding: 15px 16px;
  display: flex;
}
.badge-c {
  top: 6px !important;
  right: 1px !important;
}
.compact .yu-frame-top-bar-right .yu-frame-dropdown-menu.notice-tab-container,
.compact .yu-frame-top-bar-right .yu-frame-dropdown-menu.search {
  height: calc(100vh - 47px);
  max-height: calc(100vh - 47px);
  position: fixed;
  top: 50px;
  left: auto;
  right: 0;
  width: 424px;
  overflow-x: hidden;
}
.compact .yu-frame-top-bar-right .yu-frame-dropdown-menu.notice-tab-container,
.compact .yu-frame-dropdown-menu.search .el-tabs__nav-wrap,
.compact .yu-frame-dropdown-menu.notice-tab-container .el-tabs__nav-wrap {
  padding: 0;
}
.compact .yu-frame-dropdown-menu.notice-tab-container .el-tabs__item {
  height: 36px;
  line-height: 36px;
}
.notice-tab-container > .el-tabs > .el-tabs__content {
  height: 100%;
}
.yu-frame-message-list .is-unread::after,.notify-content-cz .is-unread::after{
  content: '';
  width: 6px;
  height: 6px;
  top: 14px;
  display: inline-block;
  background: red;
  position: absolute;
  border-radius: 50%;
}
.compact .yu-frame-top-bar-right .yu-frame-dropdown-menu.notice-tab-container > .el-tabs > .el-tabs__content > .el-tab-pane > .yu-frame-message-list {
  height: calc(100vh - 150px);
  overflow-x: hidden;
}
.compact .yu-frame-top-bar-right .yu-frame-dropdown-menu.notice-tab-container > .el-tabs > .el-tabs__content > .el-tab-pane > .yu-frame-message-list li {
  padding: 10px 16px;
  border: none;
  position: relative;
}
.compact .yu-frame-top-bar-right .yu-frame-dropdown-menu.notice-tab-container > .el-tabs > .el-tabs__content > .el-tab-pane > .yu-frame-message-list li::after {
  content: '';
  position: absolute;
  width: 392px;
  height: 1px;
  background-color: #ededed;
  top: 77px;
}
.compact .yu-frame-dropdown-menu.notice-tab-container .yu-frame-message-list>li>i {
  margin-left: 0;
}
.compact .yu-frame-dropdown-menu.notice-tab-container .yu-frame-message-list>li>p {
  margin: 0 0 0 58px;
}
.compact .yu-frame-dropdown-menu.notice-tab-container .yu-frame-message-list>li:last-child {
  border-bottom: 1px #ededed solid;
}

.search .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 12px;
}
.search .el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 12px;
}

.blue .message-buttons-c .el-button.el-button--text {
  color: #666666;
}
.blue .message-buttons-c .el-button.el-button--text:hover {
  color: #2877FF;
}
</style>
