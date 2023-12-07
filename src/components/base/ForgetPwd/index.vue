<template>
  <div class="forget-wrap">
    <top-header></top-header>
    <div class="step-ac">
      <yu-steps class="step-wrap" :space="286" :align-center="true" :active="active" finish-status="success" center>
        <yu-step title="填写账号"></yu-step>
        <yu-step title="身份认证"></yu-step>
        <yu-step title="设置密码"></yu-step>
        <yu-step title="完成"></yu-step>
      </yu-steps>
    </div>
    <div class="step-ac">
      <yu-xform ref="forgetPwdForm" :rules="formRules" class="w400 mt64" v-model="formData">
        <yu-xform-group :column="1">
          <template v-if="active==0">
            <yu-xform-item label="用户名" size="small" placeholder="请输入用户名" ctype="input" name="loginCode"></yu-xform-item>
            <yu-xform-item ctype="custom" name="action">
              <div class="btn-wrap">
                <yu-button type="primary" @click="goNext">下一步</yu-button>
              </div>
            </yu-xform-item>
          </template>
          <template v-if="active==1">
            <yu-xform-item label="用户名" ctype="custom" name="loginCode" :readonly="true">
              <span>{{ formData.loginCode }}</span>
            </yu-xform-item>
            <yu-xform-item label="手机号码" placeholder="该账号预留的手机号" size="small" ctype="input" name="phone"></yu-xform-item>
            <yu-xform-item label="验证码" placeholder="请输入验证码" size="small" ctype="input" name="smsCode"
                           colspan="18"></yu-xform-item>
            <yu-xform-item class="tar" size="small" ctype="custom" name="ac" colspan="6">
              <span class="count-wrap" @click="getSmsCode">{{ smsDisabled ? count + 's' : '发送验证码' }}</span>
            </yu-xform-item>
            <yu-xform-item ctype="custom" name="action">
              <div class="btn-wrap">
                <yu-button @click="goPrev">上一步</yu-button>
                <yu-button type="primary" @click="checkCode">下一步</yu-button>
              </div>
            </yu-xform-item>
          </template>
          <template v-if="active===2">
            <yu-xform-item label="用户名" ctype="custom" name="loginCode" :readonly="true">
              <span>{{ formData.loginCode }}</span>
            </yu-xform-item>
            <yu-xform-item ctype="input" label="新密码" name="userPassword" show-password size="small"></yu-xform-item>
            <yu-xform-item ctype="input" label="确认新密码" size="small"
                           name="reuserPassword" show-password></yu-xform-item>
            <yu-xform-item ctype="custom" name="action">
              <div class="btn-wrap">
                <yu-button type="primary" @click="submitInfo">提交</yu-button>
                <yu-button @click="resetPwd">重置</yu-button>
              </div>
            </yu-xform-item>
          </template>
          <template v-if="active===3">
            <yu-xform-item class="success-info" ctype="custom" name="action">
              <i class="el-icon-circle-check"></i>
              <div class="success-info-text">密码设置成功！</div>
            </yu-xform-item>
            <yu-xform-item ctype="custom" name="action">
              <div class="btn-wrap">
                <yu-button type="primary" @click="goLogin">完成，前往登录</yu-button>
              </div>
            </yu-xform-item>
          </template>
        </yu-xform-group>
      </yu-xform>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import topHeader from './topHeader.vue'
import {countDown, getRSAPublicKey, mobileNoHide} from '@/utils/util.js'
import {validator} from '@/utils/validate';
import {SMS_CODE_TIMEOUT} from '@/config/constant/app.data.common'
import {checkSmsCode, checkuserexist, revisepassword, sendSmsCode} from "@/api/common/oauth";
import {JSEncrypt} from "jsencrypt";

export default {
  components: {
    topHeader,
  },
  data() {
    const _this = this;
    /*const validatePass2 = function (rule, value, callback) {
      if (value !== _this.formData.userPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }*/
    var validatePass1 = function (rule, value, callback) {
      if (value === '') { // todo 工具类中的方法
        callback(new Error(_this.$t('login.qzcsrmm')));
      } else if (!_this.lengthEnabled && (value.length < 5 || value.length > 24)) {
        callback(new Error(_this.$t('login.cdfw')));
      } else {
        callback();
      }
    };
    var validatePass2 = function (rule, value, callback) {
      if (value === '') {
        callback(new Error(_this.$t('login.qzcsrmm')));
      } else if (value !== _this.formData.userPassword) {
        callback(new Error(_this.$t('login.lcmmsrbyz')));
      } else {
        callback();
      }
    };
    return {
      active: 0,
      smsDisabled: false, // 发送验证码且倒计时未结束时禁用按钮
      lengthEnabled: false, //是否启用密码长度策略
      count: -1, // 倒计时
      formData: {
        loginCode: '',
        phone: '',
        smsCode: '',
        userPassword: '',
        reuserPassword: '',
      },
      formRules: {
        loginCode: [
          {required: true, message: this.$t('sysUserManager.btx')},
        ],
        phone: [
          {required: true, message: this.$t('sysUserManager.btx')},
          {validator: validator.mobile}
        ],
        smsCode: [
          {required: true, message: this.$t('sysUserManager.btx')},
        ],
        userPassword: [
          {required: true, message: this.$t('login.qsrxmm')},
          {validator: validatePass1, trigger: 'blur'}
          // {validator: validator.password}
        ],
        reuserPassword: [
          {required: true, message: this.$t('login.qsrqrmm')},
          // {validator: validator.password},
          {validator: validatePass2, trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    goPrev() {
      this.active--
    },
    validatorForm() {
      var validate = false;
      this.$refs.forgetPwdForm.validate(function (valid) {
        validate = valid;
      });
      return validate
    },
    goNext() {
      if (!this.validatorForm()) {
        return;
      }
      const loginCode = this.formData.loginCode;
      checkuserexist({loginCode}).then(res => {
        if(res.code === '0') {
          this.active++;
        }
      })
    },
    /**
       * 倒计时
       */
    smsCountDown: function (time) {
      const _this = this;
      _this.count = time;
      this.countDown = countDown({
        time: time,
        change: (currentTime) => {
          _this.smsDisabled = true;
          _this.count = currentTime;
        },
        finish: () => {
          _this.smsDisabled = false;
          _this.count = -1;
        }
      });
    },
    // 登录前，发送验证码
    getSmsCode() {
      if (!this.smsDisabled) { // 已发送且倒计时未归0时，不能触发下一次请求
        // if (!validator.phone.test(this.formData.phone)) {
        //   return;
        // }
        const param = {
          loginCode: this.formData.loginCode,
          phone: this.formData.phone,
        };
        sendSmsCode(param).then((res) => {
          if (res.code === '0') {
            console.log('发送验证码suc：' + JSON.stringify(res));
            // this.formData.state = res.state;
            // 记录当前获取验证码成功通过的手机号码，用来和当前input框输入的手机号对比，
            // 避免客户输入手机获取验证码通过后，重新输入其他手机号，但没有重新获取验证码
            this.lastPhone = this.formData.phone;
            this.smsCountDown(SMS_CODE_TIMEOUT);
            this.lengthEnabled = res.data.passwordLengthEnabled;
            this.$message({
              message: '已发送短信验证码至' + mobileNoHide(this.formData.phone),
              type: 'success'
            });
          }
        }).catch(error => {
          console.log('发送验证码fail：' + JSON.stringify(error));
        })
      }
    },
    checkCode() {
      if (!this.validatorForm()) {
        return;
      }
      const {loginCode, phone, smsCode} = this.formData;
      checkSmsCode({loginCode, phone, smsCode}).then((res = {}) => {
        if(res.code === '0') {
          this.active++;
        }
      });
    },
    submitInfo() {
      if (!this.validatorForm()) {
        return;
      }
      const {loginCode, userPassword, phone, smsCode} = this.formData;
      const reviseBo = {loginCode, smsCode, phone, userPassword: this.encryptPassword(userPassword)};
      revisepassword(reviseBo).then((res = {}) => {
        if(res.code === '0') {
          this.active++;
        }
      });
    },
    // 匹配密码加密
    encryptPassword: function (pwd) {
      var encrypt = new JSEncrypt();
      encrypt.setPublicKey(getRSAPublicKey());
      var encryptPwd = encrypt.encrypt(pwd);
      return encryptPwd;
    },
    goLogin() {
      this.$router.replace({
        path: '/login'
      })
    },
    resetPwd() {
      this.formData.userPassword = '';
      this.formData.reuserPassword = '';
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .forget-wrap {
    height: 100%;
    background: #fff;
  }

  .step-ac {
    display: flex;
    justify-content: center;
  }

  .step-wrap {
    margin-top: 64px;
  }

  .w400 {
    width: 400px;
  }

  .mt64 {
    margin-top: 64px;
  }

  .btn-wrap {
    margin-top: 44px;
    text-align: center;
  }

  .tar {
    text-align: right;
  }
  .count-wrap {
    color: #1677FF;
  }
  .success-info {
    text-align: center;
    .el-icon-circle-check {
      display: block;
      font-size: 64px;
      color: #1677FF;
    }
    .success-info-text {
      margin-top: 38px;
      font-size: 20px;
      color: #333;
    }
  }

</style>
<style lang="scss">
  .step-ac {
    .el-step__head.is-text.is-process {
      color: #fff;
      background: #2877FF;
      border-color: #2877FF;
    }
    .el-step__head.is-text.is-success {
      color: #1677FF;
      border-color: #1677FF;
      background: #fff;
    }
    .el-step__title.is-process {
      font-weight: normal;
      color: #999999;
    }
    .el-step__title.is-success {
      font-weight: normal;
      color: #333333;
    }
  }
</style>
