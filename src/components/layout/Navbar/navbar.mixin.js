/* eslint vars-on-top:0 */
/* eslint no-inner-declarations:0 */
/* eslint no-lonely-if:0 */
/* eslint guard-for-in:0 */
/* eslint prefer-const:0 */
/* eslint camelcase:0  */

import { clone, isString, sessionStore, type } from '@/utils'
import { saveUserLastorgRoles } from "@/api/common/oauth";
import { mapGetters } from "vuex";
// import Breadcrumb from '@/components/base/Breadcrumb'
import Hamburger from "@/components/base/Hamburger";
// import ErrorLog from "@/components/base/ErrorLog";
// import Screenfull from "@/components/base/Screenfull";
import defaultAvatar from "@/assets/common/images/user_default_pic.png";
import Logo from "@/components/layout/Sidebar/Logo";
import frameConfig from "@/config/frame";
import baseConfig from "@/config";
import { changeSizeModel, changeTheme, getSystemName, toggleClass } from "@/utils/util";
import { getLanguage } from '@/utils/i18n'
import { getI18nMessage } from "@/locale";
import { XIAO_YU_TOKEN, USER_MESSAGE_CONFIG } from "@/config/constant/app.data.common";
import { getMessagesHasNoRead, getUserMessagesList, readAllMsg } from "@/api/portal/backstageAdmin";
import navbarMixinExt from "@/components/layout/Navbar/navbar.mixin.ext.js";

const bfOpts = frameConfig.baseFrameOptions; // frame中基础配置项

export default {
  components: {
    // Breadcrumb,
    Hamburger,
    // ErrorLog,
    // Screenfull,
    Logo,
  },
  mixins: [navbarMixinExt],
  data() {
    return {
      userInfo: { name: "", roles: [], pic: "" },
      // 默认用户信息
      defaultUserInfo: clone(bfOpts.defaultUserInfo, []),
      baseFrameOptions: bfOpts,
      showSearchInput: bfOpts.showSearchInput,
      userMessages: bfOpts.userMessages,
      searchTypeList: bfOpts.searchType,
      moreSystem: bfOpts.moreSystem, // 是否配置多系统
      sysTools: bfOpts.sysTools,
      themeTool: bfOpts.themeTool,
      messageTipTitle:'', //消息中心信息标题
      messageTips:'', //用于公共统一展示消息中心的文本内容
      themesList: clone(bfOpts.themesList, []),
      // 菜单模式列表
      menuModelList: clone(bfOpts.modelList, []),
      // 字号
      fontSizeList: clone(bfOpts.fontSizeList, []),
      // 多语言移动到 navbar.mixin.ext.js文件中
      sizeModelList: clone(bfOpts.sizeModel, []),
      applicationId: "1",
      // 当前系统 id
      appOptions: bfOpts.appOptions,
      // 搜索框的值
      searchValue: "",
      appName: getSystemName(),
      // 搜索框 过滤后的值
      searchValueOption: [],
      // 被选中的搜索类型
      searchType: {},
      // 存储上一次选中的皮肤对象
      currentTheme: this.theme,
      // 已选中的语言 移动到 navbar.mixin.ext.js文件中
      // 菜单模式（left/right/topTree/topTile）
      currentMenuModel: {},
      // 选中模式
      sizeModel: {},
      // 多语言翻译部分
      messageTitle1: bfOpts.messageTitle.all,
      messageTitle2: bfOpts.messageTitle.todo,
      messageTitle3: bfOpts.messageTitle.xx,
      messageTitle4: bfOpts.messageTitle.notice,
      messageBtn1: bfOpts.messageBtn.handle,
      messageBtn2: bfOpts.messageBtn.checkInfo,
      messageBtn3: bfOpts.messageBtn.cleanAll,
      messageBtn4: bfOpts.messageBtn.checkMore,
      searchPlaceholder: bfOpts.searchPlaceholder,
      currentSystemText: bfOpts.messageBtn.currentSystem, // 当前应用
      rightArrowText: bfOpts.messageBtn.rightArrow, // 向前
      leftArrowText: bfOpts.messageBtn.leftArrow, // 向后
      unfoldText: bfOpts.messageBtn.unfold, // 展开
      menuShow1Text: bfOpts.messageBtn.menuShow1, // 收起
      menuShow2Text: bfOpts.messageBtn.menuShow2, // 展开
      autoText: bfOpts.messageBtn.auto, // 自动
      yesText: bfOpts.messageBtn.yes, // 是
      noText: bfOpts.messageBtn.no, // 否
      personalDataText: bfOpts.messageBtn.personalData, // 个人资料
      changePasswordText: bfOpts.messageBtn.changePassword, // 修改密码
      logoutText: bfOpts.messageBtn.logout, // 注销登录
      noticeList: [],
      noticeTit: getI18nMessage('component.notice'),
      noticeUrl: backend.appOcaService + '/api/adminsmnotice/unread/list',
      messageTimer: null, // 定时器获取消息是否红点
      messageTitle: bfOpts.messageTitle, // 消息列表清单
      panes: Object.keys(bfOpts.messageTitle), // 消息列表分类列表,
      notifyTimer:null//用于解决notify多个重叠的问题
    };
  },
  mounted() {
    yufp.globalEventBus.$on('readNoticeFinish', this.getNoticeList);
    const userMessageConfig = sessionStore.get(USER_MESSAGE_CONFIG) || {}
    const showUnread = userMessageConfig.showUnread === 1 ? true : false
    this.$nextTick(() => {
      // this.getUserMessagesList();
      this.getMessageDot(showUnread);
      this.getCycleMesssage()
    })
    yufp.globalEventBus.$on('eventNotice', (item) => {
      // const userMessageConfig = sessionStore.get(USER_MESSAGE_CONFIG) || {}
      // const showUnread = userMessageConfig.showUnread === 1 ? true : false
      let timer = setTimeout(() => {
        clearTimeout(timer)
        this.getMessageDot(showUnread)
        timer = null
      }, 30000)
    });
  },
  destroyed() {
    yufp.globalEventBus.$off('readNoticeFinish', this.getNoticeList);
    yufp.globalEventBus.$off('eventNotice');
    clearTimeout(this.messageTimer);
  },
  computed: {
    ...mapGetters([
      "sidebar",
      "userName",
      "userCode",
      "userAvatar",
      "device",
      "roles",
      "selectedRoles",
      "size",
      "theme",
      "menuModel",
      "menuShowStat",
      "currentSizeModeId" // 当前选中模式的id
    ]),
    sysToolsFiltered() {
      return this.sysTools.filter((item) => {
        return item.show;
      });
    },
    themeToolFiltered() {
      return this.themeTool.filter((item) => {
        return item.show;
      });
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    // 判断菜单模式是否是左侧
    isLeft: function () {
      return this.currentMenuModel.id === "left";
    },
    // 判断菜单模式是否是右侧菜单
    isRight: function () {
      return this.currentMenuModel.id === "right";
    },
    // 判断菜单模式是否是垂直的
    isVertical: function () {
      return (
        this.currentMenuModel.id === "left" ||
        this.currentMenuModel.id === "right"
      );
    },
    // 是否是顶部菜单
    isTop: function () {
      return (
        this.currentMenuModel.id === "topTile" ||
        this.currentMenuModel.id === "topTree"
      );
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    sysToolsFilters() {
      return this.baseFrameOptions.sysTools.filter((item) => {
        return item.show;
      });
    },
    themeToolFilters() {
      return this.baseFrameOptions.themeTool.filter((item) => {
        return item.show;
      });
    },
    userMessagesType0() {
      return this.baseFrameOptions.themeTool.filter((item) => {
        return item.type === 0;
      });
    },
    userMessagesType1() {
      return this.baseFrameOptions.themeTool.filter((item) => {
        return item.type === 1;
      });
    },
  },
  beforeMount: function () {
    // //设置 加载当前应用
    this.setAppOptionLoad();
    var roles = [];
    if (!this.roles || this.roles.length === 0) {
      roles = this.defaultUserInfo.roles;
    } else {
      roles = this.roles;
    }
    let pic = defaultAvatar;
    if (this.userAvatar) {
      pic = yufp.util.addTokenInfo(backend.fileService + '/api/file/provider/download?fileId=' + this.userAvatar)
    }
    this.userInfo = {
      // 用户名
      name: this.userName || this.defaultUserInfo.name,
      // 角色
      roles: roles,
      // 头像
      pic,
    };
    var i, element;
    try {
      // 获取皮肤默认选中数据
      // 1、读取localStorage -> 2、读取index.js提供配置 -> 3、读取frame.js默认选中
      let defaultTheme = this.theme || baseConfig.theme || {};
      for (i = 0; i < this.themesList.length; i++) {
        element = this.themesList[i];
        if (!defaultTheme.id && element.checked) {
          defaultTheme = element;
        }
        if (element.id === defaultTheme.id) {
          this.currentTheme = element;
          this.$set(this.themesList[i], "checked", true);
          var dom = document.querySelector(".yu-frame-body");
          var classname = dom.getAttribute("class");
          if (classname.indexOf(element.id) === -1) {
            // #TODO 需要剔除已经存在的样式
            classname = classname + " " + element.id;
            dom.setAttribute("class", classname);
          }
          break;
        } else {
          this.$set(this.themesList[i], "checked", false);
        }
      }

      // 没有设置默认值时，设置第一项
      if (!this.currentTheme.id) {
        this.thecurrentThememes = this.themesList[0];
        // 设置第一项checked属性
        var tmpDom = document.querySelector(".yu-frame-body");
        var classnameTmp = tmpDom.getAttribute("class");
        if (classnameTmp.indexOf(this.currentTheme.id) === -1) {
          classnameTmp = classnameTmp + " " + this.currentTheme.id;
          tmpDom.setAttribute("class", classnameTmp);
        }
        this.$set(this.themesList[0], "checked", true);
      }
      // 获取菜单模式默认选中数据
      this.currentMenuModel = this.menuModel || {};
      for (i = 0; i < this.menuModelList.length; i++) {
        element = this.menuModelList[i];
        if (!this.currentMenuModel.id && element.checked) {
          this.currentMenuModel = element;
        }

        if (element.id === this.currentMenuModel.id) {
          this.currentMenuModel = element;
          this.$set(this.menuModelList[i], "checked", true);
        } else {
          this.$set(this.menuModelList[i], "checked", false);
        }
      }
      // 没有设置默认值时，设置第一项
      if (!this.currentMenuModel.id) {
        // 设置第一项checked属性
        this.$set(this.menuModelList[0], "checked", true);
        this.currentMenuModel = this.menuModelList[0];
      }

      // 获取字体默认选中数据
      // for (i = 0; i < this.fontSizeList.length; i++) {
      //   element = this.fontSizeList[i];
      //   if (element.checked === true) {
      //     this.fontSize = element;
      //     break;
      //   }
      // }
      // // 没有设置默认值时，设置第一项
      // if (!this.fontSize.id) {
      //   this.fontSize = this.fontSizeList[0];
      //   // 设置第一项checked属性
      //   this.fontSizeList.length > 0 &&
      //     this.$set(this.fontSizeList[0], "checked", true);
      // }

      const language = getLanguage();
      // 获取字体默认选中数据
      for (i = 0; i < this.languageList.length; i++) {
        element = this.languageList[i];
        if (language && element.id === language) {
          element.checked = true;
          this.currentLanguage = element;
          break;
        }
      }
      // 没有设置默认值时，设置第一项
      if (!this.currentLanguage.id) {
        this.currentLanguage = this.languageList[0];
        // 设置第一项checked属性
        this.languageList.length > 0 &&
          this.$set(this.languageList[0], "checked", true);
      } else {
        // 给body上增加语言对应的样式类 #TODO fixed: 系统名称切换成英文过长时，导致页面显示不正常 qfkong 2021.02.05
        toggleClass(document.querySelector(".yu-frame-body"), language);
      }

      // 获取字体默认选中数据
      for (i = 0; i < this.searchTypeList.length; i++) {
        element = this.searchTypeList[i];
        if (element.checked === true) {
          this.searchType = element;
          break;
        }
      }
      // 没有设置默认值时，设置第一项
      if (!this.searchType.id) {
        this.searchType = this.searchTypeList[0];
        // 设置第一项checked属性
        this.$set(this.searchTypeList[0], "checked", true);
      }
    } catch (error) {
      throw new Error("用户角色数据错误");
    }
    this.initCurrentSizeModeId();
  },
  methods: {
    //通过类型和相关的字段显示相应的messagetips
    getItemInfoToShowMessage(it) {
      switch (it.msgType) {
        case 3: // 提示事件(提醒)
          switch (it.remindType) {
            case 2: // 资讯
              this.messageTips = `${it.msgTitle}` 
              this.messageTipTitle = '资讯' 
              break;
            case 3: // 到期提醒
              this.messageTips = `${it.flowBizType} ${it.msgContent}`
              this.messageTipTitle = '到期提醒' 
              break;
            case 4: // 日历日程
              // 加载日历事件
              this.messageTips = `${it.msgTitle} ${it.msgContent} `
              this.messageTipTitle = '日程' 
              break;
            default:
              this.messageTips = `${it.msgTitle}`  
          }
          break;
        case 1://待办
        //跳转到业务中台的业务编辑页面（对接客户管理、授信管理）
          this.messageTipTitle = '待办'
          this.messageTips = `您有一条${it.flowBizType}(${it.relatedId})待处理`
          break;
        case 2://业务消息
        //跳转到业务中台的详情查看页面（对接客户管理、授信管理）
          this.messageTipTitle = '业务'
          this.messageTips = `您的已办任务${it.flowBizType}(${it.relatedId})当前所处阶段进入 ${it.msgTitle}`
          break;
        default:  
      }
      this.$set(it, 'messageTipTitle', this.messageTipTitle)
      this.$set(it, 'messageTips', this.messageTips)
      // return this.messageTips;
    },
    // 消息阅读全部
    btnReadAll() {
      readAllMsg().then(res => {
        if (res.code === '0') {
          this.$message.success('全部已读!')
          // this.getUserMessagesList();
          this.getMessageDot();
        } else {
          this.$message.error(res.message)
        }
      })
    },
    messagesListByType(type) {
      // 0: 全部消息
      // 1：过滤消息类型-待办提醒(待办)
      // 2：过滤消息类型-业务消息（消息）
      // 3：过滤消息类型-提示事件(提醒)
      return this.userMessagesFiltered(type)
    },
    // 获取用户消息
    getUserMessagesList() {
      getUserMessagesList({
        msgType: 0
      }).then(res => {
        if (res) {
          this.userMessages = res.data || []
        }
      })
    },
    // 对消息提醒进行过滤
    userMessagesFiltered(type) {
      if (type === 0) {
        return this.userMessages
      }
      return this.userMessages.filter((item) => {
        return item.msgType === type;
      });
    },
    // 获取消息列表类型图标
    getMessageTypeIcon(it) {
      return it.msgType === 1 ? 'yu-icon-finish todo' : 'yu-icon-message2 msg'
    },
    // 获取消息红点，判断有未读消息即增加红点
    getMessageDot(showUnread) {
      getMessagesHasNoRead({
        msgType: 0,
        readed: 0
      }).then(res => {
        // 有未读消息
        const h = this.$createElement
        let _this = this;
        const delayTime = 2000;
        if (res && res.data) {
          this.userMessages = res.data || []
          this.userMessages.forEach((it, index) => {
            this.getItemInfoToShowMessage(it)
            // if(index < 4) {
            if(it.pushed === 0) {
              this.notifyTimer = window.setTimeout(() => {//解决notify重叠问题
                this.$notify({
                  title: it.messageTipTitle,
                  dangerouslyUseHTMLString: true,
                  iconClass:'yu-icon-warning1',
                  message:
                  h('div', {
                    class:'notify-content-cz',
                    style:'height:auto'
                  }, [
                    h('p', [
                      h('span', {
                        title:it.messageTips
                      }, it.messageTips),
                      h('span', [
                        h('a', {
                          attrs:{
                            href:'javascript:void(0)'
                          },
                          style:{
                            color: '#666666',
                            border: '1px #E0E0E0 solid'
                          },
                          on:{
                            mouseleave:_this.aMouseEvent.bind(this, 'mouseeout'),
                            mouseenter:_this.aMouseEvent.bind(this, 'mouseover')
                          }

                        }, [
                          h('span', {
                            on:{
                              click:_this.messageNoticeClick.bind(this, it)
                            }
                          }, this.getMessageHandlerText(it))
                        ])
                      ])
                    ]),
                  ]),
                  customClass:'notify-content-box-cz',
                  position: 'top-right',
                  duration: delayTime,
                });
              }, 5000)
            }
            // }
          })
          this.sysTools.forEach(tool => {
            if (tool.id === 'message') {
              tool.badgeDot = res.data.length > 0 ? true : false
              tool.showUnread = showUnread || false
              tool.messageNum = res.data.length
              tool.badgeDot && this.$notify({title: '消息提醒', message: '您有重要消息，请及时查看！' })
            }
          })
        }
      })
    },
    //用于解决createelement a标签hover效果无效的问题
    aMouseEvent(type, e) {
      e.currentTarget.className = ''
      if(type === 'mouseeout') {
        e.currentTarget.className = 'anothover'
      }else{
        e.currentTarget.className = 'ahover'
      } 
    },
    messageNoticeClick(it) {
      this.viewDetail(it)
    },
    // 周期性获取消息红点
    getCycleMesssage() {
      const timeIntervalList = [60 * 5, 60 * 15, 60 * 60 * 1, 60 * 60 * 3, 60 * 0.5]
      const userMessageConfig = sessionStore.get(USER_MESSAGE_CONFIG) || {}
      // fixed: 频率数据不存在时报错,取默认5分钟频率
      let noticeFrequency = timeIntervalList[0]
      if (userMessageConfig && userMessageConfig.noticeFrequency) {
        noticeFrequency = timeIntervalList[userMessageConfig.noticeFrequency - 1]
      }
      const showUnread = userMessageConfig.showUnread === 1 ? true : false
      this.messageTimer = setTimeout(() => {//解决只轮询一次的问题
        clearTimeout(this.messageTimer);  
        console.log(`消息更新频率 ${noticeFrequency}s`)
        this.getMessageDot(showUnread);
        this.getCycleMesssage()
      }, 1000 * noticeFrequency)
    },
    // 消息查看更多
    btnMessageMore() {
      const route = '/content/portalManager/messageCenterManager/messageCenterManager';
      this.$router.addRoute(route, this.$t("card.infoCenter"));
      this.$router.push(route);
      // this.$router.push('/content/portalManager/messageCenterManager/messageCenterManager')
    },
    /**
     *  清除公告列表设为已读
     */
    clearNoticeFn: function () {
      var _this = this;
      var ids = [];
      if (!_this.noticeList.length) {
        _this.$message({
          message: _this.$t('notice.zwwdgg'),
          type: 'warning'
        });
        return;
      }
      _this.noticeList.forEach(item => {
        ids.push(item.noticeId);
      });
      ids = ids.join(',');
      this.$request({
        url: backend.appOcaService + `/api/notice/adminsmnoticeread/save?noticeIds=${ids}`,
        data: {},
      }).then(({ code, message, data }) => {
        if (code === '0') {
          _this.noticeList.splice(0);
        } else {
        }
      });
    },
    /**
     *  查看更多公告
     */
    moreNoticeFn: function () {
      const route = 'content/systemManager/notice/noticeList';
      const title = this.$t('notice.qbgg');
      const path = '/' + 'noticeList';
      this.$router.addRoute(route, title, {}, path); // 第三个参数meta详情见VUE官方的router参数
      this.$router.push({ path: path, query: {} }); // query 可传递新页面初始化加载的参数
    },
    /**
     *  查询公告详情
     */
    noticeInfoFn: function (row) {
      const _this = this;
      const route = 'content/systemManager/notice/noticeInfo';
      this.$router.addTab({
        name: route, // 路由名称
        key: "infoNotice" + Date.now(), // 自定义唯一页签key,请统一使用custom_前缀开头
        title: this.$t('notice.ggxq'), // 页签名称
        data: { noticeId: row.noticeId, isGetNotice: 'true' } // 传递的业务数据，可选配置
      });
      _this.noticeList.forEach((item, index) => {
        if (item.noticeId === row.noticeId) {
          _this.noticeList.splice(index, 1);
        }
      });
    },

    /**
     * 切换系统应用
     */
    changeApp: function (item, index) {
      var _this = this;
      if (item.applicationId === _this.applicationId) {
        return false;
      } else {
        _this.$confirm(
          "此操作将切换应用为" + item.applicationName + ", 是否继续?",
          "提示",
          {
            type: "info",
            callback: function (action) {
              if (action === "confirm") {
                _this.resetCheck(index);
                _this.setAppOptionLoad(item, true);
                if (_this.currentMenuModel.id === 'topLeft') {
                  _this.getTopBarRightWidth();
                }
              }
            },
          }
        );
      }
    },
    resetCheck(index) {
      sessionStore.set('currentApp', this.appOptions[index]);
    },
    /**
     * 设置应用根据配置加载
     */
    setAppOptionLoad(item, reload) {
      var _this = this;
      var confirmBox = document.querySelector(
        ".el-message-box__wrapper, .v-modal"
      );
      if (confirmBox) {
        confirmBox.remove();
      }
      var appId = "";
      if (!item) {
        item = sessionStore.get('currentApp') || this.appOptions[0];
      }
      for (var i = 0, len = this.appOptions.length; i < len; i++) {
        var opt = this.appOptions[i];
        if (opt.applicationId === item.applicationId) {
          opt.checked = true;
          appId = opt.applicationId;
          this.appName = opt.applicationName;
        } else {
          opt.checked = false;
        }
      }
      this.applicationId = appId;
      sessionStore.set("APPLICATION-ID", appId);
      this.$store
        .dispatch("oauth/getAccessInfo", {
          appId: appId,
        })
        .then(() => { })
        .catch((err) => {
          console.dir(err);
        });
    },
    toggleSideBar() {
      switch (this.menuShowStat) {
        // 展开状态
        case 1:
          this.$store.commit("app/CLOSE_SIDEBAR");
          this.$store.commit("app/SET_MENU_SHOW_STAT", 2);
          break;
        // 收起状态
        case 2:
          this.$store.commit("app/OPEN_SIDEBAR");
          this.$store.commit("app/SET_MENU_SHOW_STAT", 1);
          break;
        // 收起后mouseenter
        case 3:
          this.$store.commit("app/SET_MENU_SHOW_STAT", 4);
          break;
        // mouseenter后点击锁定icon
        case 4:
          this.$store.commit("app/CLOSE_SIDEBAR");
          this.$store.commit("app/SET_MENU_SHOW_STAT", 2);
          break;
        default:
          break;
      }
    },
    async logout() {
      await this.$store.dispatch("oauth/logout");
      window.watermark && window.watermark.clearWatermark()
      if (frameConfig.redirect) {
        this.$router.push(
          `/login?redirect=${frameConfig.redirect || this.$route.fullPath}`
        );
      } else {
        this.$router.push(`/login`);
      }
    },
    /**
     * 系统工具点击事件
     * @param item 系统工具项
     */
    toolClick: async function (item, $event) {
      if (item.event && item.event.click) {
        // 兼容处理当前事件,字符串的话，执行当前this中的方法，函数的话直接执行click事件
        if (isString(item.event.click)) {
          this[item.event.click]($event, this);
        } else {
          if (item.id === "pickup") {
            item.event.click($event, this.currentMenuModel);
            this.$emit("pickup", true);
          } else if (item.id === "logOut") {
            await item.event.click($event, this.currentMenuModel);
            this.$router.push(`/login`);
          } else {
            item.event.click($event, this);
          }
        }
      }
    },
    /**
     * 系统工具mouseenter事件
     * @param item 系统工具项
     */
    toolMouseEnter: function (item, $event) {
      if (item.event && item.event.mouseEnter) {
        item.event.mouseEnter($event);
      }
    },
    /**
     * 系统工具mouseout事件
     * @param item 系统工具项
     */
    toolMouseOut: function (item, $event) {
      // if (item.event && item.event.mouseOut) {
      //   item.event.mouseOut($event);
      // }
      if (item.event && item.event.mouseEnter) {
        item.event.mouseEnter($event);
      }
    },
    /**
     * 工具栏搜索类型切换
     * @param id 类型id
     * @param $event 事件
     */
    searchTypeSwitch: function (id, $event) {
      for (let i = 0; i < this.searchTypeList.length; i++) {
        const element = this.searchTypeList[i];
        if (element.id === id) {
          this.$set(element, "checked", true);
          // 设置选中的 搜索类型
          this.searchType = element;
        } else {
          this.$set(element, "checked", false);
        }
      }
    },
    /**
     * 搜索过滤返回的数据集
     */
    searchDataFilter: function () {
      // 调用外部接口
      if (
        frameConfig.searchDataFilter &&
        type(frameConfig.searchDataFilter) === "function"
      ) {
        var value = frameConfig.searchDataFilter(
          this.searchType,
          this.searchValue
        );
        if (type(value) === "array") {
          this.searchValueOption = value;
        } else {
          if (value) {
            throw new Error("过滤返回数据类型错误！");
          }
        }
      }
    },
    /**
     * 搜索框的图标点击事件
     */
    searchBarClick: function (ev) {
      // // 调用外部接口
      if (
        frameConfig.searchBarClick &&
        type(frameConfig.searchBarClick) === "function"
      ) {
        frameConfig.searchBarClick(this.searchType, this.searchValue);
      }
      if (!this.showSearchInput) {
        ev.target.parentNode.parentNode.classList.remove("search-show");
      }
    },

    /**
     * 设置角色
     * @param role 角色对象
     */
    switchRole: function (role) {
      console.log(role, '=========roleswitchRole')
      const org_id = role.orgId;
      const role_id = role.roleId;
      const org_name = role.orgName;
      const roles = this.roles;
      const tokenObj = sessionStore.get(XIAO_YU_TOKEN) || {};
      saveUserLastorgRoles(role).then((res) => {
        if(res.code === '0') {
          this.$store.dispatch('oauth/refreshAccessToken', {
            org_id,
            role_id,
            org_name,
            grant_type: 'refresh_token',
            refresh_token: tokenObj.refresh_token
          }).then(async ({ code, message, data }) => {
            if (code === '00000000') {
              for (let i = 0; i < roles.length; i++) {
                if (roles[i].orgId === role.orgId && roles[i].roleId === role.roleId) {
                  this.$set(roles[i], "checked", true);
                  this.$store.commit("oauth/SET_SELECTED_ROLES", roles[i]);
                  this.$store.dispatch('oauth/getAccessInfo');
    
                  await this.$store.dispatch("tagsView/delAllViews").then(({ visitedViews }) => {
                    // const latestView = visitedViews.slice(-1)[0];
                    // if (latestView) {
                    //   this.$router.push(latestView);
                    // } else {
                    //   this.$router.push("/");
                    // }
                    window.location.reload();
                  });
                } else {
                  this.$set(roles[i], "checked", false);
                }
              }
            }
          });
        }
      })
      if (this.currentMenuModel.id === 'topLeft') {
        this.getTopBarRightWidth();
      }
    },
    initCurrentSizeModeId() {
      if (!this.currentSizeModeId && this.sizeModelList.length > 0) {
        this.$store.dispatch('app/setCurrentSizeModeId', this.sizeModelList[0].id);
      }
      if (this.currentSizeModeId === 'compact') {
        changeSizeModel(true);
      }
    },
    /**
     * 切换紧凑模式正常模式
     * @param id 切换模式
     * @param flag 是否触发保存配置
     */
    switchFontSizeModel: function (id, flag) {
      // #TODO 此处需要根据是否紧凑模式调整值
      // 前一次和这次的id 相等就不处理
      if (this.sizeModel.id === id) {
        return;
      }
      this.$store.dispatch('app/setCurrentSizeModeId', id);
      // 如果切换为紧凑模式
      if (id === "compact") {
        changeSizeModel(true);
      } else {
        changeSizeModel(false);
      }
    },
    /**
     * 切换皮肤
     * @param id 皮肤对象其中一项的id值
     * @param flag true表示不触发保存配置
     */
    switchThemes: function (id, flag) {
      // 前一次和这次的id 相等就不处理
      const oldId = this.currentTheme.id;
      if (this.currentTheme.id === id) {
        return;
      }
      // 用于标志是否查找到历史皮肤，未查找到就直接加载
      let findFlag = true;
      // 当没有找到对应的时候css的时候
      let selectElement = {};
      for (let i = 0; i < this.themesList.length; i++) {
        const element = this.themesList[i];
        if (element.id === id) {
          // 暂存先当前的对象
          selectElement = element;
          this.$set(element, "checked", true);
          // const target = document.getElementsByTagName("link");
          // if (target.length > 0) {
          //   for (let j = 0; j < target.length; j++) {
          //     const ctrlLink = target[j];
          //     const cssOld = ctrlLink.getAttribute("href");
          //     // 查找到皮肤样式问题件
          //     if (cssOld.indexOf("assets/" + element.id) > -1) {
          //       this.$set(element, "checked", true);
          //       // 替换后要闪烁，所以直接加载
          //       changeTheme(this.currentTheme, oldId);
          //       // import('@/assets/themes/' + this.theme.id + '/main.css')
          //       this.$store.commit("app/SET_THEME", element);
          //       findFlag = false;
          //       break;
          //     }
          //   }
          // }
        } else {
          this.$set(element, "checked", false);
        }
      }
      // 未查找到就直接加载
      if (findFlag) {
        this.$store.commit("app/SET_THEME", selectElement);
        this.$set(selectElement, "checked", true);
        this.currentTheme = selectElement;
        changeTheme(selectElement, oldId);
      }
      // if (flag !== true) {
      //   this.saveConfig();
      // }
    },

    /**
     * 切换字体
     * @param id 切换字体
     * @param flag 不触发保存配置
     */
    switchFontSize: function (id, flag) {
      const oldFonSize = clone({}, this.size);
      let target, j, ctrlLink, cssOld;
      // 选中为正常大小
      if (id === "normal") {
        // 上次被选中的不是normal，表示字体css 已加载过，现在需要移除该项（normal 没有字体css文件）
        if (this.size.id !== "normal") {
          // 移除css
          target = document.getElementsByTagName("link");
          if (target.length > 0) {
            for (j = 0; j < target.length; j++) {
              ctrlLink = target[j];
              cssOld = ctrlLink.getAttribute("href");
              // 查找到皮肤样式文件
              if (cssOld.indexOf("fontSize/" + this.size.id) > -1) {
                ctrlLink.remove();
                break;
              }
            }
          }
        }
      } else if (this.size.id === "normal") {
        // 上次选中的是normal,表示没有字体css文件，需要引入css文件
        // 添加css
        // require('./themes/common/fontSize/' + id + '.css'); // TODO
      } else {
        // 前一次和这次的id 相等就不处理
        if (this.size.id === id) {
          return;
        }
        // 替换css
        target = document.getElementsByTagName("link");
        if (target.length > 0) {
          for (j = 0; j < target.length; j++) {
            ctrlLink = target[j];
            cssOld = ctrlLink.getAttribute("href");
            // 查找到皮肤样式问题件
            if (cssOld.indexOf("fontSize/" + this.size.id) > -1) {
              const cssNew = cssOld.replace(this.size.id, id);
              ctrlLink.setAttribute("href", cssNew);
              ctrlLink.setAttribute("id", cssNew);
              break;
            }
          }
        }
      }
      // 设置checked 属性
      for (let i = 0; i < this.baseFrameOptions.fontSizeList.length; i++) {
        const element = this.baseFrameOptions.fontSizeList[i];
        if (element.id === id) {
          this.$set(element, "checked", true);
          this.$store.commit("app/SET_SIZE", element);
        } else {
          this.$set(element, "checked", false);
        }
      }
      // // 首页被选中时oldFonSize.id 会等于选中的id
      // if (flag !== true && oldFonSize.id != id) {
      //   this.saveConfig();
      // }
    },

    /**
     * 菜单模式
     * @param id 菜单对象中某一项的id
     * @param flag true表示不触发保存配置
     */
    switchMenuModel: function (id, flag) {
      // 前一次和这次的id 相等就不处理
      if (this.currentMenuModel.id === id) {
        return;
      }
      for (let i = 0; i < this.menuModelList.length; i++) {
        const element = this.menuModelList[i];
        if (element.id === id) {
          this.$set(element, "checked", true);
          this.$store.commit("app/SET_MENU_MODEL", element);
          this.currentMenuModel = this.$store.state.app.menuModel;
        } else {
          this.$set(element, "checked", false);
        }
      }
      // if (flag !== true) {
      //   this.saveConfig();
      // }
    },
  },
};
