<!--
  @Created by zhuly8@yusys.com.cn 2021-01-30
  @updated by
  @description 登录页面
 -->
<template>
  <div class="yu-login" :class="lightModel ? 'yu-login-light' : ''">
    <div class="yu-login-tools">
      <div class="yu-login-tools-left">{{ $t("login.sysName") }}</div>
      <div class="yu-login-tools-right">
        <div class="language-box yu-icon-network">
          {{ currentLanguage && currentLanguage.name }}
          <div
            class="yu-frame-dropdown-menu yu-frame-language"
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
        </div>
      </div>
    </div>
    <div class="yu-login-centext">
      <div class="yu-login-box-left"></div>
      <div class="yu-login-box" @keyup.13="loginFn" v-if="!isSingleLogin">
        <div class="yu-login-wrap">
          <div class="yu-login-logo" v-if="logoinfo">
            <span>{{ $t("login.logintitle") }}</span>
          </div>
          <ul class="yu-login-form">
            <li>
              <yu-input
                id="username"
                :focus="userNameFocus"
                v-model="username"
                type="text"
                :placeholder="$t('login.qsrzh')"
                prefix-icon="yu-icon-user"
              ></yu-input>
            </li>
            <!-- @blur="usernameBlur" -->
            <!-- <li>
              <yu-xselect
                ref="roleList"
                v-model="role"
                :options="roleList"
                :placeholder="$t('login.yhzt')"
              >
                <svg-icon slot="prefix" class="enterprise" icon-class="enterprise" style="line-height: 36px" />
              </yu-xselect>
            </li> -->
            <li>
              <yu-input
                id="password"
                show-password
                v-model="password"
                type="password"
                :placeholder="$t('login.qsrmm')"
                prefix-icon="yu-icon-lock"
              ></yu-input>
            </li>
            <li class="code">
              <input
                id="code"
                type="text"
                :placeholder="$t('login.yzm')"
                ref="imageCode"
                v-model="imageCode"
              />
              <i class="yu-icon-details"></i>
              <img
                class="yu-login-code"
                :title="$t('login.tpkbqdjhyz')"
                @click="freshImageCodeFn"
                :src="imageCodePicture"
              />
            </li>
            <li class="checkbox_li">
              <span>
                <yu-checkbox
                  id="remember"
                  type="checkbox"
                  v-model="checked"
                ></yu-checkbox>
                <label for="remember">{{ $t("login.jzyh") }}</label>
              </span>
              <span class="pwd" @click="toForgetPwd">{{ $t("login.wjmm") }}</span>
            </li>
            <li class="submit-btn">
              <yu-button
                id="submitBtn"
                type="primary"
                v-loading="btnLoginLoading.show"
                @click="loginFn"
              >
                {{ $t("login.dl") }}
              </yu-button>
            </li>
            <li class="msg" v-show="message">
              <span class="yu-icon-warning1"></span>
              <span class="yu-login-msg" id="msg">{{ message }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="single-login" v-if="isSingleLogin">跳转中，请稍等...</div>
    <div class="yu-login-footer" v-html="$t('login.yxkj')"></div>
    <!-- 首次登录 修改密码 v-if="dialogVisible" //还是v-if为解决虽然不弹窗但是进入了组件调用了created方法导致没有token的时候调用了接口拦截器报错-->
    <yufp-password-modify
      :dialog-visible.sync="dialogVisible"
      :login-code-first="loginCode"
      :old-passWord="password"
      :first-login-res="firstLoginRes"
      :first-login="true"
      :length-enabled="passwordLengthEnabled"
    >
    </yufp-password-modify>
    <yu-xdialog title="请选择" id="login-chose-org" :visible.sync="dialogFormVisible" width="480px">
      <yu-form :model="formRole">
        <yu-form-item label="用户主体：" label-width="100px">
          <yu-xselect
            ref="roleList"
            v-model="formRole.role"
            :options="roleList"
            required
            size="mini"
            @change="getChoseRole"
            :placeholder="$t('login.yhzt')"
          >
          </yu-xselect>
          <div style="font-size:12px;">登录后可在首页右上角“用户信息”进行主体切换</div>
        </yu-form-item>
      </yu-form>
      <div slot="footer" class="dialog-footer">
        <yu-button type="primary" @click="saveOrgRole" size="mini">确 定</yu-button>
        <yu-button @click="dialogFormVisible = false" size="mini">取 消</yu-button>
      </div>
    </yu-xdialog>

  </div>
</template>
<script>
/* eslint camelcase:0 */
/* eslint vars-on-top:0 */
/* eslint no-inner-declarations:0 */
import { loginFn, orgListFn, getUserMessageConfig, saveUserLastorgRoles, refreshTokenFn} from "@/api/common/oauth";
import { genUUID, localStore, sessionStore } from "@/utils";
import { JSEncrypt } from "jsencrypt";
import {getRSAPublicKey, getSystemName, toggleClass} from "@/utils/util";
import navbarMixinExt from "@/components/layout/Navbar/navbar.mixin.ext";
import { FROM_LOGIN, USER_MESSAGE_CONFIG, USER_STORE_TEMP} from "@/config/constant/app.data.common";
import {getLanguage} from "@/utils/i18n";
const isSingleServer = process.env.VUE_APP_SINGLE_SERVER === "true";
const isIdentifingCode = process.env.VUE_APP_IDENTIFING_CODE === "true";

export default {
  name: "YuLogin",
  mixins: [navbarMixinExt],
  props: {
    // 登录页logo
    logoinfo: {
      type: Object,
      default() {
        return {
          url: require("@/assets/common/images/logo.svg"),
          assisttext: getSystemName(),
        };
      },
    },
    // 公司名称
    corpName: {
      type: String,
      default: "宇信银行",
    },
  },
  data: function () {
    return {
      lightModel: false, // 浅色模式开关
      userNameFocus: false, // 浅色模式开关
      username: "",
      password: "",
      role: "",
      roleList: [],
      localToken: null,
      message: null,
      borderColor: null,
      imageCode: "", // 验证码
      imageUUID: genUUID(16, 16) + Date.parse(new Date()),
      imageCodePicture: "",
      // imageCodePicture: this.freshImageCodeFn(),
      btnLoginLoading: {
        // 控制登录按钮loading
        show: false,
        timeout: 12000,
      },
      resetPwdFormData: {
        oldPassWord: null,
        newPassWord: null,
        confirmPassWord: null,
      },
      dialogVisible: false,
      passwordLengthEnabled: false,
      firstLoginRes: {}, // 首次登录返回对象
      isSingleLogin: false,
      language: this.$store.state.app.language,
      languageText: "简体中文",
      checked: false, //是否选中记住登录信息
      dialogFormVisible:false, //选择主体弹窗
      formRole:{
        role:''
      }
    };
  },
  computed: {
    loginCode: function () {
      return this.username;
    },
  },
  watch: {
    username() {
      this.role = '';
    }
  },
  created() {
    this.getUserInfo();
  },
  beforeMount() {
    const language = getLanguage();
    // 获取字体默认选中数据
    for (let i = 0; i < this.languageList.length; i++) {
      const element = this.languageList[i];
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
  },
  mounted: function () {
    var url = window.location.href;
    if (
      process.env.VUE_APP_SINGLE_LOGING === "true" &&
      url.endsWith("success=true")
    ) {
      this.isSingleLogin = true;
      this.singleLoginFn(url);
    } else {
      this.imageCodePicture = this.freshImageCodeFn();
    }
    this.getLanguageText(this.language);
  },
  methods: {
    getLanguageText(l = "zh_CN") {
      this.language = l;
      this.languageText =
        (this.$refs.languagRef &&
          this.$refs.languagRef.items[l].$el.textContent) ||
        this.languageText;
    },
    // 从localStorage里获取用户信息
    getUserInfo() {
      if (localStorage.getItem("checked")) {
        this.username = localStorage.getItem("username");
        this.checked = true;
        // 有数据后，就调用接口获取对应的机构    确定这个是否要执行？？？
        if (this.username) {
          this.usernameBlur();
        }
      }
    },
    // 切换语言选择
    handleSelect: function (key) {
      this.getLanguageText(key);
      // 该方法在navbarMixin中声明
      this.switchLanguage(key);
    },
    //保存主体角色
    saveOrgRole() {
      const role = typeof this.role === "object" ? this.role.key : this.role;
      const [org_id, role_id] = role.split("-");
      const params = {
        org_id,
        role_id,
        imageUUID: this.imageUUID,
        imageCode: this.imageCode,
        username: this.username,
        password: this.encryptPassword(this.password),
        grant_type: "oca",
      }
      const tokenObj = sessionStore.get(USER_STORE_TEMP) || {};
      saveUserLastorgRoles(this.role).then((res) => {
        if(res.code === '0') {
          this.$store.dispatch('oauth/refreshAccessToken', {
            org_id,
            role_id,
            grant_type: 'refresh_token',
            refresh_token: tokenObj.refresh_token
          }).then((response) => {
            if (response.code === '00000000') {
              this.$store.commit("oauth/SET_TOKEN", {
                access_token: response.access_token,
                expires_in: response.expires_in,
                refresh_token: response.refresh_token,
              });
              this.$store.dispatch("oauth/getAccessInfo").then((resData) => {
                this.redirectToFrame();
                window.watermark && window.watermark.init()
              });
              sessionStore.remove(USER_STORE_TEMP)
            }
          })
        }
      })
    },
    //获取选中的主体
    getChoseRole(item) {
      this.role = item
      this.roleList.forEach((temp) => {
        if(temp.key === item) {
          this.role = temp
        }
      })
    },
    //获取主体
    usernameBlur() {
      const loginCode = this.username;
      if (loginCode === "") {
        this.message = this.$t("login.qsryhm");
        this.userNameFocus = true;
        return;
      }
      orgListFn({ loginCode }).then((res) => {
        if (res.code === "0") {
          this.roleList = res.data.map((item = {}) => {
            const { orgId, roleId, orgName, roleName } = item;
            item.key = `${orgId}-${roleId}`;
            item.value = `${orgName}(${roleName})`;
            return item;
          });
          if (this.roleList.length === 1) {
            this.role = this.roleList[0];
            this.saveOrgRole();
          }else{
            //当数据多余1条  这里弹窗显示
            this.dialogFormVisible = true
          }
        }
      });
    },
    singleLoginFn(url) {
      var data = {
        username: "admin",
      };
      this.$request({
        url: backend.uaaService + "/api/sso/login",
        method: "post",
        data,
        needToken: false,
      }).then((res) => {
        this.$store.commit("oauth/SET_TOKEN", {
          access_token: res.access_token,
          expires_in: res.expires_in,
        });
        this.$store.dispatch("oauth/getAccessInfo").then((resData) => {
          var newUrl = url.split("?")[0];
          window.location.href = newUrl;
        });
      });
    },
    freshImageCodeFn: function () {
      this.imageCodePicture =
        backend.uaaService +
        "/api/codeimage/" +
        this.imageUUID +
        "?t=" +
        new Date().getTime();
      this.imageCode = "";
      return this.imageCodePicture;
    },
    loginFn: function () {
      this.message = "";
      var nameEl = document.getElementById("username");
      var pwdEl = document.getElementById("password");
      var codeEl = document.getElementById("code");
      if (this.username === "") {
        this.message = this.$t("login.qsryhm");
        nameEl.focus();
        return;
      }
      // if (this.role === "") {
      //   this.message = this.$t("login.qxzyhzt");
      //   return;
      // }
      if (this.password === "") {
        this.message = this.$t("login.qsrmm");
        pwdEl.focus();
        return;
      }
      if (isIdentifingCode && this.imageCode === "") {
        this.message = this.$t("login.qsryzm");
        codeEl.focus();
        return;
      }
      this.btnLoginLoading.show = true;
      const timer = setTimeout(() => {
        clearInterval(timer);
        this.btnLoginLoading.show = false;
        this.message = "请求超时，请重试！";
        // this.$message({message: '请求超时，请重试！', type: 'warning'});
      }, this.btnLoginLoading.timeout);
      this.borderColor = "lightgreen";
      // 处理只有一个机构列表选中状况
      // const role = typeof this.role === "object" ? this.role.key : this.role;
      // const [org_id, role_id] = role.split("-");
      const data = {
        // org_id,
        // role_id,
        imageUUID: this.imageUUID,
        imageCode: this.imageCode,
        username: this.username,
        password: this.encryptPassword(this.password),
        grant_type: "oca",
      };
      this.rememberUserInfo(data);
      loginFn(data)
        .then((response) => {
          this.btnLoginLoading.show = false;
          clearInterval(timer);
          if (
            response &&
            response.access_token &&
            response.code === "00000000"
          ) {
            // 1、登录成功
            this.message = null;
            //屏蔽在机构保存成功后更新token避免登陆后刷新页面跳转到首页
            // this.$store.commit("oauth/SET_TOKEN", {
            //   access_token: response.access_token,
            //   expires_in: response.expires_in,
            //   refresh_token: response.refresh_token,
            // });
            sessionStore.set(USER_STORE_TEMP, {'access_token': response.access_token, 'expires_in': response.expires_in, 'refresh_token': response.refresh_token, })
            this.usernameBlur(this.username);
          }
          if (response && response.code === "10000002") {
            // 2、首次登录
            var _this = this;
            _this
              .$confirm(
                _this.$t("login.scdlmmxg"),
                _this.$t("component.msg_title"),
                {
                  confirmButtonText: _this.$t("component.btn_confirm"),
                  cancelButtonText: _this.$t("component.btn_cancel"),
                  type: "warning",
                }
              )
              .then(function () {

                _this.freshImageCodeFn();
                // 保存 token信息用于修改密码后登出
                _this.$store.commit("oauth/SET_TOKEN", {
                  access_token: response.access_token,
                  expires_in: response.expires_in,
                });
                const { access_token, expires_in } = response;
                _this.localToken = { access_token, expires_in }; // 暂存，此时还不能访问需要认证的资源
                _this.firstLoginRes = response;
                _this.dialogVisible = true;
                _this.passwordLengthEnabled = response.passwordLengthEnabled;

                // _this.message = response.message ? response.message : _this.$t('login.scdlmmxg');
              }).catch(err => {
                console.log(err, 'err确定接口异常')
              });
          }
          this.setUserMessageConfig()
          this.setStoreOfLogin();
        })
        .catch((e) => {
          const response = e.response.data;
          this.btnLoginLoading.show = false;
          clearInterval(timer);
          this.message = response.message || this.$t("login.dlsbqlxxtgly");
          this.freshImageCodeFn();
        });
    },
    //首次登陆成功修改密码后调用获取主体接口看是否显示弹窗
    // successChangePassword(){
    //   this.dialogVisible = false;
    //   //首次登陆后如果有多个角色项目弹窗选择主体，只有一个直接登陆不用弹窗
    //   this.usernameBlur(this.username)

    // },
    setStoreOfLogin() {
      sessionStore.set(FROM_LOGIN, '1')
    },
    async setUserMessageConfig() {
      const { data } = await getUserMessageConfig()
      sessionStore.set(USER_MESSAGE_CONFIG, data)
    },
    redirectToFrame: function () {
      this.$router.push({ path: this.redirect || "/" });
    },
    // 登录密码加密
    encodePassword: function (pwd) {
      var encryptPwd = this.encryptPassword(pwd);
      // #TODO 不进行encodeURIComponent编码
      // var encodePwd = encodeURIComponent(encryptPwd);
      // return encodePwd;
      return encryptPwd;
    },
    // 匹配密码加密
    encryptPassword: function (pwd) {
      var encrypt = new JSEncrypt();
      encrypt.setPublicKey(getRSAPublicKey());
      var encryptPwd = encrypt.encrypt(pwd);
      return encryptPwd;
    },
    // 忘记密码
    toForgetPwd: function () {
      this.$router.push("/forgetPwd");
    },
    // 记住用户登录信息，存入localStorage
    rememberUserInfo(data) {
      if (this.checked) {
        localStorage.setItem("username", data.username);
        localStorage.setItem("checked", this.checked);
      } else {
        ["username", "checked"].forEach((item) => {
          localStorage.removeItem(item);
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>

</style>
<style lang="scss">
@import "~~assets/styles/login.scss";
$bgcolor: transparent;
$color: white;
@mixin background-color-transparent {
  background-color: $bgcolor;
  color: $color;
  border-bottom-color: $bgcolor;
}
#login-chose-org .el-form .el-form-item__label {
  padding: 8px 4px 8px 0 !important;
}
.single-login {
  color: #fff;
  font-size: 20px;
  width: 200px;
  position: absolute;
  top: 50%;
  text-align: center;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  right: calc(50% - 100px);
}
.yu-login-tools-right {
  .el-menu {
    &.el-menu--dark {
      @include background-color-transparent;
      .el-submenu__title {
        @include background-color-transparent;
        &:hover {
          @include background-color-transparent;
        }
      }
      .el-submenu {
        .el-menu {
          @include background-color-transparent;
          border-color: $bgcolor;
          padding: 0;
          box-shadow: none;
          top: 30px;
          left: 10px;
        }
        .el-menu-item,
        .el-submenu-title {
          @include background-color-transparent;
          &:hover {
            @include background-color-transparent;
          }
        }
      }
    }
    > .el-submenu {
      .el-submenu__title {
        height: 32px;
        line-height: 32px;
        @include background-color-transparent;
        > i {
          float: right;
          margin-top: 10px;
          color: white;
        }
      }
      &:hover {
        .el-submenu__title {
          @include background-color-transparent;
        }
      }
    }
  }
}
</style>
