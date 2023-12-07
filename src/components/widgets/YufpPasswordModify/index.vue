<template>
  <div>
    <yu-xdialog :title="$t('login.xgmm')" :visible.sync="dialogVisibleProp" width="480px" @close="close">
      <yu-xform ref="resetPwdForm" :rules="resetPwdFormRules" v-model="resetPwdFormData">
        <yu-xform-item :label="$t('login.ymm')" name="oldPassWord" type="password" autoComplete="new-password">
        </yu-xform-item>
        <yu-xform-item :label="$t('login.xmm')" name="newPassWord" :placeholder="passwordRuleInfo" type="password" autoComplete="new-password1">
        </yu-xform-item>
        <yu-xform-item :label="$t('login.qrmm')" name="confirmPassWord" type="password" autoComplete="new-password2">
        </yu-xform-item>
        <!-- <div>密码规则：{{ passwordRuleInfo }}</div> -->
        <!-- <div class="button-group" style="text-align: center">
          <yu-button type="primary" @click="saveResetPwdFn()">{{ $t('login.bc') }}</yu-button>
          <yu-button @click="resetForm()">{{ $t('login.zz') }}</yu-button>
        </div> -->
      </yu-xform>

      <div slot="footer" class="dialog-footer">
        <yu-button type="primary" @click="saveResetPwdFn()">{{ $t('login.bc') }}</yu-button>
        <yu-button @click="resetForm()">{{ $t('login.zz') }}</yu-button>
      </div>
    </yu-xdialog>
  </div>
</template>
<script>
/* eslint camelcase:0 */
import {getToken} from '@/utils/oauth'
import {mapGetters} from "vuex";
import {getRSAPublicKey} from '@/utils/util';
import {JSEncrypt} from 'jsencrypt';

export default {
  name: 'YufpPasswordModify',
  componentName: 'YufpPasswordModify',
  props: {
    loginCodeFirst: {
      type: String,
      default: ''
    },
    username: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 首次登录返回对象
    firstLoginRes: {
      type: Object,
      default: function () {
        return {};
      }
    },
    firstLogin: {
      type: Boolean,
      default: false
    },
    lengthEnabled: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    var _this = this;
    // 密码校验 写在方法中 todo
    var validatePass1 = function (rule, value, callback) {
      if (value === '') { // todo 工具类中的方法
        callback(new Error(_this.$t('login.qzcsrmm')));
      } else if (!_this.lengthEnabled && (value.length < 5 || value.length > 24)) {
        callback(new Error(_this.$t('login.cdfw')));
      } else if (value === _this.resetPwdFormData.oldPassWord) {
        callback(new Error(_this.$t('login.xmmbnylmmyz')));
      } else {
        callback();
      }
    };
    var validatePass2 = function (rule, value, callback) {
      if (value === '') {
        callback(new Error(_this.$t('login.qzcsrmm')));
      } else if (value !== _this.resetPwdFormData.newPassWord) {
        callback(new Error(_this.$t('login.lcmmsrbyz')));
      } else {
        callback();
      }
    };
    return {
      // 设置密码规则
      passwordRuleInfo: '',
      // 密码表单
      resetPwdFormData: {
      },
      // 表单校验规则
      resetPwdFormRules: {
        oldPassWord: [
          { required: true, message: this.$t('login.qsrymm'), trigger: 'blur' }
        ],
        newPassWord: [
          { required: true, message: this.$t('login.qsrxmm'), trigger: 'blur' },
          {validator: validatePass1, trigger: 'blur'}
        ],
        confirmPassWord: [
          { required: true, message: this.$t('login.qsrqrmm'), trigger: 'blur' },
          {validator: validatePass2, trigger: 'blur'}
        ]
      },
      pwdResetUrl: backend.appOcaService + '/api/password/passwordmodification', // 密码修改接口
      dialogVisibleProp: false // 修改密码弹出框是否显示
    };
  },
  computed: {
    ...mapGetters(['loginCode'])
  },
  watch: {
    dialogVisible: function (newVal, oldVal) {
      this.dialogVisibleProp = newVal;
      if (newVal) {
        this.$nextTick(function () {
          this.$refs.resetPwdForm.resetFields();
        });
      }
    }
  },
  created() {
  
  },
  mounted() {
    if(this.dialogVisible) {
      this.getPasswordRuleInfo();
    }
  },
  methods: {
    /**
     * 关闭弹出框
     */
    close: function () {
      this.$emit('update:dialogVisible', false); // 关闭密码修改弹出框
    },
    /**
     * 获取密码规则
     */
    getPasswordRuleInfo() {
      this.$request({
        url: backend.appOcaService + '/api/adminsmcrelstra/getupdatepasswordcrel'
      }).then(({code, message, data}) => {
        this.passwordRuleInfo = data;
        console.log('密码规则', data)
      })
    },
    // 密码表单重置
    resetForm: function () {
      this.$refs.resetPwdForm.resetFields();
    },

    /**
     * 保存登录修改密码
     */
    saveResetPwdFn: function () {
      var _this = this;
      var headersFirst = {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: 'Bearer ' + _this.firstLoginRes.access_token
      };
      var headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: 'Bearer ' + getToken().access_token
      };
      this.$refs.resetPwdForm.validate(function (valid) {
        if (valid) {
          _this.$confirm(_this.$t('login.xgmmhjcxdlsfxg'), _this.$t('login.ts'), {
            confirmButtonText: _this.$t('login.qd'),
            cancelButtonText: _this.$t('login.qx'),
            type: 'warning',
            callback: function (action) {
              if (action === 'confirm') {
                _this.$request({
                  headers: _this.firstLogin ? headersFirst : headers,
                  needToken: false, // 在 headers 中添加首次登录获取的临时 token 用于修改密码
                  url: _this.pwdResetUrl,
                  method: 'post',
                  data: JSON.stringify({
                    loginCode: _this.firstLogin ? _this.loginCodeFirst : _this.loginCode,
                    rawPassword: _this.encodePassword(_this.resetPwdFormData.oldPassWord),
                    password: _this.encodePassword(_this.resetPwdFormData.newPassWord)
                  }),
                  async: true
                }).then(({code, message, data}) => {
                  if (code === '00000000') {
                    _this.$message({
                      message: _this.$t('login.mmxgcgqsyxmmdl'),
                      type: 'success'
                    });
                    if(_this.firstLogin) {
                      _this.$store.commit('oauth/SET_TOKEN', {
                        access_token: _this.firstLoginRes.access_token,
                        expires_in: _this.firstLoginRes.expires_in
                      });
                    }
                    _this.$emit('update:dialogVisible', false); // 关闭密码修改弹出框
                    _this.logout();
                  } else {
                    _this.$message({
                      message: message,
                      type: 'error'
                    });
                  }
                });
              }
            }
          });
        }
      });
    },
    async logout() {
      await this.$store.dispatch("oauth/logout");
      this.$router.push(`/login`);
    },
    /**
     * 密码加密
     */
    encodePassword: function (pwd) {
      var encrypt = new JSEncrypt();
      encrypt.setPublicKey(getRSAPublicKey());
      var encryptPwd = encrypt.encrypt(pwd);
      // var encodePwd = encodeURIComponent(encryptPwd);
      return encryptPwd;
    }
  }
};
</script>
