<template>
  <div>
    <el-tabs value="first" type="card" @tab-click="tabClick">
      <el-tab-pane :label="$t('wfinsinfo.tab1')" name="first">
        <el-collapse v-model="collapseValue">
          <el-collapse-item :title="$t('wfinsinfo.title1')" name="1">
            <div :id="nwfbiztypeLitePage">
              <component :is="bizPage" :biz-page-data="bizPageData"></component>
            </div>
          </el-collapse-item>

          <el-collapse-item :title="$t('wfinsinfo.title3')" name="4">
            <el-form ref="commentForm" label-width="160px" :model="commentInfo" :rules="commentRules">
              <el-form-item :label="$t('wfinsinfo.comment')" prop="userComment" v-show="isShow == 0">
                <el-input type="textarea" v-model="commentInfo.userComment" :disabled="button.signIn == 1"></el-input>
              </el-form-item>
              <el-form-item v-show="isShow == 0">
                <el-button @click="cancel">{{ $t('wfinsinfo.butback') }}</el-button>
                <el-button type="primary" @click="submitFn('O-0')" :disabled="button.tackBack == 0" v-if="button.recall == '0'">{{ $t('wfinsinfo.butnahui') }}</el-button>
                <el-button type="primary" @click="submitFn('O-15')" :disabled="button.recall == 0" v-if="button.recall == '1'">{{ $t('wfinsinfo.butchehui') }}</el-button>
                <el-button type="primary" @click="submitFn('O-5')" :disabled="button.urged == 0">{{ $t('wfinsinfo.butcuiban') }}</el-button>
                <el-button type="primary" @click="submitFn('O-3')" :disabled="button.hungUp == 0" v-if="instanceIdInfo.flowState == 'R'">{{ $t('wfinsinfo.buthung') }}</el-button>
                <el-button type="primary" @click="submitFn('O-4')" :disabled="button.hungUp == 0" v-if="instanceIdInfo.flowState == 'H'">{{ $t('wfinsinfo.butwake') }}</el-button>
                <el-button type="primary" @click="activateFn" :disabled="button.activate == 0" v-show="button.activate == '1'">{{ $t('wfinsinfo.butactivite') }}</el-button>
              </el-form-item>
              <el-form-item v-show="isShow == 1">
                <el-button @click="cancel">{{ $t('wfinsinfo.butback') }}</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane :label="$t('wfinsinfo.tab4')" name="5">
        <yu-timeline class="todo-process" v-if="timelineItems.length">
          <yu-timeline-item v-for="(item, indexh) in timelineItems" :key="indexh" :timeline-items="timelineItems">
            <div slot="title">
              {{ item.nodeName }}
              <span class="processTag" :class="'processTag' + item.processType">{{ item.commentSign }}</span>
            </div>
            <div slot="date">{{ item.startTime }}</div>
            <div slot="description">
              <ul>
                <li>
                  <span>{{ $t('wfinsinfo.spr') }}{{ item.userName }}&emsp;{{ $t('wfinsinfo.gh') }}{{ item.userId }}</span>
                </li>
                <li>
                  <span>{{ $t('wfinsinfo.spsc') }}{{ item.time }}({{ item.timeType }})</span>
                </li>
                <li style="word-break: break-all">
                  <span>{{ $t('wfinsinfo.spsm') }}{{ item.userComment }}</span>
                </li>
              </ul>
            </div>
          </yu-timeline-item>
        </yu-timeline>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { validator } from '@/utils/validate';
import { sessionStore } from '@/utils';
import { VIEW_SIZE } from '@/config/constant/app.data.common';
import { loadView } from '@/utils/loadView';
let data = {};
export default {
  name: 'InstanceInfoLite',
  data: function () {
    var _this = this;
    return {
      bizPage: null,
      collapseValue: ['1', '4'],
      collapse2FormDisable: true,
      bizPageData: null,
      urls: {
        index: backend.workflowService + '/api/bench/done',
        runInsInfo: backend.workflowService + '/api/core/myinstanceInfo',
        endInsInfo: backend.workflowService + '/api/core/myinstanceInfoHis',
        getComments: backend.workflowService + '/api/core/getAllComments/',
        hang: backend.workflowService + '/api/core/hangup',
        wake: backend.workflowService + '/api/core/wakeup',
        tackBack: backend.workflowService + '/api/core/tackback',
        urge: backend.workflowService + '/api/core/urge',
        resetNodeUser: backend.workflowService + 'api/core/resetNodeUser',
        tackbackToFirst: backend.workflowService + '/api/core/tackbackToFirst',
        activate: backend.workflowService + 'api/core/activate',
      },
      height: sessionStore.get(VIEW_SIZE).height - 103,
      currentOrgId: '',
      currentUserId: '',
      returnBackFuncId: '',
      returnBackRootId: '',
      instanceIdInfo: {
        instanceId: '',
        flowName: '',
        flowId: '',
        flowStarter: '',
        flowStarterName: '',
        startTime: '',
        systemId: '',
        orgId: '',
        flowState: '',
        bizId: '',
        bizUserName: '',
        bizUserId: '',
        lastNodeId: '',
        lastNodeName: '',
        nodeId: '',
        nodeSign: '',
        nodeName: '',
        nodeState: '',
        nodeType: '',
        handleType: '',
        bizPage: '',
        opType: {},
      },
      commentInfo: {
        instanceId: '',
        nodeId: '',
        userId: '',
        commentId: '',
        commentSign: 'O-12',
        userComment: '',
        ext: '',
      },
      commentRules: {
        userComment: [{ required: true, message: this.$t('wfinsinfo.msginputcomm'), trigger: 'blur' }, { max: 500, message: this.$t('wfinsinfo.msgcdxz500') }, { validator: validator.speChar }],
      },
      flowParam: [],
      button: {
        // 按钮权限控制
        hungUp: '0',
        tackBack: '0',
        urged: '0',
        recall: '0',
        activate: '0',
      },
      nwfbiztypeLitePage: 'nwfbiztypeLitePage' + Date.now(),
      title: 'reset',
      type: '',
      nodeHistory: [],
      commentinfo: '',
      isShow: 0,
      pagesize: 10,
      currentPage: 1,
      total: 0,
      timelineItems: [],
    };
  },
  computed: {
    ...mapGetters(['userCode', 'org']),
  },
  created() {
    this.currentOrgId = this.org.code;
    this.currentUserId = this.userCode;
  },
  mounted: function () {
    // 进入初始化
    data = this.$route.query;
    this.instanceInfoFn(data);
    this.type = data.type;
    this.instanceIdInfo.instanceId = data.instanceId;
    this.returnBackFuncId = data.returnBackFuncId;
    this.returnBackRootId = data.returnBackRootId;
    if (data.isShow != null) {
      this.isShow = data.isShow;
    }
  },
  methods: {
    tabClick: function (tab, event) {
      var _this = this;
      var url = _this.urls.getComments;
      if (tab.name == 'second' || tab.name === '5') {
        _this
          .$request({
            method: 'POST',
            url: url,
            data: { mainInstanceId: _this.instanceIdInfo.mainInstanceId },
          })
          .then(({ code, message, data }) => {
            if (code == 0) {
              if (data != null ? data.length > 0 : false) {
                _this.commentinfo = '';
                var nodeHistory = data;
                // commentSign翻译
                // for (var i = 0, length = nodeHistory.length; i < length; i++) {
                //   nodeHistory[i].commentSign = _this.$lookup.convertKey(
                //     "OP_TYPE",
                //     nodeHistory[i].commentSign
                //   );
                // }
                // _this.nodeHistory = nodeHistory;
                _this.convertTimeItems(data);
              } else {
                _this.commentinfo = _this.$t('wfinsinfo.msgnocomm');
              }
            }
          });
      }
    },
    convertTimeItems: function (items) {
      items.forEach((item) => {
        this.trans(item);
        item.commentSign = item.commentSign ? yufp.lookup.convertKey('OP_TYPE', item.commentSign) : this.$t('wfinsinfo.msgwsp');
      });
      this.timelineItems = items;
    },
    trans: function (item) {
      var day = 86400,
        hour = 3600,
        d = 3;
      item.processType = item.commentSign;
      if (item.approvalTime) {
        var time = parseInt(item.approvalTime);
        if (time > day) {
          var a = time / day;
          item.time = a.toFixed(d);
          item.timeType = this.$t('wfinsinfo.msgday');
        } else {
          var a = time / hour;
          item.time = a.toFixed(d);
          item.timeType = this.$t('wfinsinfo.msghour');
        }
      } else {
        item.time = 0.0;
        item.timeType = this.$t('wfinsinfo.msghour');
      }
    },
    instanceInfoFn: function (param) {
      // 初始化实例信息
      var _this = this;
      var url = '';
      var params = { instanceId: param.instanceId };
      if (param.nodeId != null) {
        params.nodeId = param.nodeId;
      }
      if (param.type == 'DONE') {
        url = _this.urls.runInsInfo;
      } else if (param.type == 'HIS') {
        url = _this.urls.endInsInfo;
      }
      _this
        .$request({
          method: 'POST',
          url: url,
          data: params,
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            _this.instanceIdInfo = data;
            _this.instanceIdInfo.nodeId = param.nodeId;
            if (data.param != null) {
              // 流程参数初始化
              for (var key in data.param) {
                var paramTT = {};
                paramTT.key = key;
                paramTT.value = data.param[key];
                _this.flowParam.push(paramTT);
              }
            }
            if (data.comment != null && data.comment.commentSign != null) {
              // 设置评论反显
              _this.commentInfo = data.comment;
            }
            _this.commentInfo.instanceId = _this.instanceIdInfo.instanceId;
            _this.commentInfo.userId = _this.currentUserId;
            _this.commentInfo.nodeId = _this.instanceIdInfo.nodeId;
            // 按钮权限
            var button = _this.instanceIdInfo.opType;
            if (button != null) {
              if (param != null) {
                for (var key in _this.button) {
                  var value = button[key];
                  if (value != null) {
                    if (value != '0' && param[key] != '0') {
                      _this.button[key] = value;
                    }
                  }
                  if (key == 'recall') {
                    _this.button[key] = param[key];
                  }
                }
              }
            }
            var bizPage = _this.instanceIdInfo.bizPage;
            if (bizPage.includes('?')) {
              var str = bizPage.split('?');
              bizPage = str[0];
              _this.convertParam(str[1]);
            }
            var paramT = {
              instanceInfo: _this.instanceIdInfo,
              flowParam: _this.flowParam,
            };
            _this.$nextTick(function () {
              try {
                _this.bizPage = loadView(bizPage);
                _this.bizPageData = paramT;
              } catch (e) {}
            });
          } else {
            _this.$message({
              duration: 6000,
              message: message ? message : _this.$t('wfinsinfo.msginfoerror'),
              type: 'error',
            });
            _this.cancel();
          }
        });
    },
    convertParam: function (params) {
      if (params.includes(',')) {
        params = params.split(',');
        for (var k = 0; k < params.length; k++) {
          var paramf = {};
          var item = params[k];
          paramf.key = item.split('=')[0];
          paramf.value = item.split('=')[1];
          var isHave = false;
          for (var i = 0; i < this.flowParam.length; i++) {
            if (this.flowParam[i].key === paramf.key) {
              this.flowParam[i].value = paramf.value;
              isHave = true;
            }
          }
          if (!isHave) {
            this.flowParam.push(paramf);
          }
        }
      } else {
        var paramf = {};
        paramf.key = params.split('=')[0];
        paramf.value = params.split('=')[1];
        var isHave = false;
        for (var i = 0; i < this.flowParam.length; i++) {
          if (this.flowParam[i].key === paramf.key) {
            this.flowParam[i].value = paramf.value;
            isHave = true;
          }
        }
        if (!isHave) {
          this.flowParam.push(paramf);
        }
      }
    },
    submitFn: function (opType) {
      // 功能方法实现接口
      var _this = this;
      //_this.submitbefore();
      if (opType == 'O-0') {
        // 拿回
        _this.$refs.commentForm.validate(function (vaild) {
          // 规则校验
          if (vaild) {
            _this.takeBackFn();
          } else {
            _this.$message({
              duration: 6000,
              message: _this.$t('wfinsinfo.msginputillegal'),
              type: 'warning',
            });
          }
        });
      } else if (opType == 'O-5') {
        // 催办
        _this.urgeFn();
      } else if (opType == 'O-3') {
        // 挂起
        _this.Hang();
      } else if (opType == 'O-4') {
        // 唤醒
        _this.Awake();
      } else if (opType == 'O-15') {
        // 撤回
        _this.$refs.commentForm.validate(function (vaild) {
          // 规则校验
          if (vaild) {
            _this.takeBackToFirstFn();
          } else {
            _this.$message({
              duration: 6000,
              message: _this.$t('wfinsinfo.msginputillegal'),
              type: 'warning',
            });
          }
        });
      }
    },
    cancel: function () {
      // if (this.$route.params && this.$route.params._form) {
      //   this.$router.rollback(this.$route.params._form)
      // } else {
      //   this.$router.go(-1)
      // }
      this.$router.replace({
        name: this.returnBackFuncId,
      });
    },
    // 挂起(发起人)
    Hang: function () {
      // 挂起操作
      var _this = this;
      _this
        .$confirm(_this.$t('wfinsinfo.msgsurehung'), _this.$t('wfinsinfo.tip'), {
          confirmButtonText: _this.$t('wfbutton.sure'),
          cancelButtonText: _this.$t('wfbutton.cancel'),
          type: 'warning',
          center: true,
        })
        .then(function () {
          var param = {
            instanceId: _this.instanceIdInfo.instanceId,
          };
          _this
            .$request({
              method: 'POST',
              data: param,
              url: _this.urls.hang,
            })
            .then(({ code, message, data }) => {
              if (code == 0) {
                // 跳转到之前的页面
                _this.$message({
                  message: data.tip + ';',
                  type: 'success',
                  duration: 6000,
                });
                _this.$router.replace({ name: _this.returnBackFuncId });
              } else {
                _this.$message({
                  message: message + ';',
                  type: 'error',
                  duration: 6000,
                });
              }
            });
        })
        .catch(function () {});
    },
    Awake: function () {
      var _this = this;
      _this
        .$confirm(_this.$t('wfinsinfo.msgsurewake'), _this.$t('wfinsinfo.tip'), {
          confirmButtonText: _this.$t('wfbutton.sure'),
          cancelButtonText: _this.$t('wfbutton.cancel'),
          type: 'warning',
          center: true,
        })
        .then(function () {
          var param = {
            instanceId: _this.instanceIdInfo.instanceId,
          };
          _this
            .$request({
              method: 'POST',
              data: param,
              url: _this.urls.wake,
            })
            .then(({ code, message, data }) => {
              if (code == 0) {
                // 跳转到之前的页面
                _this.$message({
                  message: data.tip + ';',
                  type: 'success',
                  duration: 6000,
                });
                _this.$router.replace({ name: _this.returnBackFuncId });
              } else {
                _this.$message({
                  message: message + ';',
                  type: 'error',
                  duration: 6000,
                });
              }
            });
        })
        .catch(function () {});
    },
    // 拿回(已办)
    takeBackFn: function () {
      var _this = this;
      _this
        .$confirm(_this.$t('wfinsinfo.msgsurenh'), _this.$t('wfinsinfo.tip'), {
          confirmButtonText: _this.$t('wfbutton.sure'),
          cancelButtonText: _this.$t('wfbutton.cancel'),
          type: 'warning',
          center: true,
        })
        .then(function () {
          var param = {};
          _this.commentInfo.commentSign = 'O-0';
          if (_this.commentInfo.userComment == '') {
            _this.commentInfo.userComment = _this.$t('wfinsinfo.butnahui');
          }
          param.comment = _this.commentInfo;
          param.orgId = _this.currentOrgId;
          _this
            .$request({
              method: 'POST',
              data: param,
              url: _this.urls.tackBack,
            })
            .then(({ code, message, data }) => {
              if (code == 0) {
                // 跳转到之前的页面
                if (data.code == '1') {
                  _this.$message({
                    message: data.tip + ';',
                    type: 'error',
                    duration: 6000,
                  });
                } else {
                  _this.$message({
                    message: data.tip + ';',
                    type: 'success',
                    duration: 6000,
                  });
                }
                _this.$router.replace({ name: _this.returnBackFuncId });
              } else {
                _this.$message({
                  message: message + ';',
                  type: 'error',
                  duration: 6000,
                });
              }
            });
        })
        .catch(function () {});
    },
    // 撤回(我的发起-已办)
    takeBackToFirstFn: function () {
      var _this = this;
      _this
        .$confirm(_this.$t('wfinsinfo.msgsurech'), _this.$t('wfinsinfo.tip'), {
          confirmButtonText: _this.$t('wfbutton.sure'),
          cancelButtonText: _this.$t('wfbutton.cancel'),
          type: 'warning',
          center: true,
        })
        .then(function () {
          var param = {};
          _this.commentInfo.commentSign = 'O-15';
          if (_this.commentInfo.userComment == '') {
            _this.commentInfo.userComment = _this.$t('wfinsinfo.butchehui');
          }
          param.comment = _this.commentInfo;
          param.orgId = _this.currentOrgId;
          _this
            .$request({
              method: 'POST',
              data: param,
              url: _this.urls.tackbackToFirst,
            })
            .then(({ code, message, data }) => {
              if (code == 0) {
                // 跳转到之前的页面
                _this.$message({
                  message: data.tip + ';',
                  type: 'success',
                  duration: 6000,
                });
                _this.$router.replace({ name: _this.returnBackFuncId });
              } else {
                _this.$message({
                  message: message + ';',
                  type: 'error',
                  duration: 6000,
                });
              }
            });
        })
        .catch(function () {});
    },
    // 催办(发起人)
    urgeFn: function () {
      var _this = this;
      _this
        .$confirm(_this.$t('wfinsinfo.msgsureurge'), _this.$t('wfinsinfo.tip'), {
          confirmButtonText: _this.$t('wfbutton.sure'),
          cancelButtonText: _this.$t('wfbutton.cancel'),
          type: 'warning',
          center: true,
        })
        .then(function () {
          var param = {
            instanceId: _this.instanceIdInfo.instanceId,
            nodeId: _this.instanceIdInfo.nodeId,
          };
          _this
            .$request({
              method: 'POST',
              data: param,
              url: _this.urls.urge,
            })
            .then(({ code, message, data }) => {
              if (code == 0) {
                // 跳转到之前的页面
                _this.$message({
                  message: data.tip + ';',
                  type: 'success',
                  duration: 6000,
                });
                _this.$router.replace({ name: _this.returnBackFuncId });
              } else {
                _this.$message({
                  message: message + ';',
                  type: 'error',
                  duration: 6000,
                });
              }
            });
        })
        .catch(function () {});
    },
    //激活-我的发起-已办结
    activateFn: function () {
      var _this = this;
      _this
        .$confirm(_this.$t('wfinsinfo.msgsureactivite'), _this.$t('wfinsinfo.tip'), {
          confirmButtonText: _this.$t('wfbutton.sure'),
          cancelButtonText: _this.$t('wfbutton.cancel'),
          type: 'warning',
          center: true,
        })
        .then(function () {
          var param = {
            instanceId: _this.instanceIdInfo.instanceId,
            currentUserId: _this.userCode,
          };
          _this
            .$request({
              method: 'POST',
              data: param,
              url: _this.urls.activate,
            })
            .then(({ code, message, data }) => {
              if (code == 0) {
                // 跳转到之前的页面
                _this.$message({
                  message: data.tip + ';',
                  type: 'success',
                  duration: 4000,
                });
                _this.$router.replace({ name: _this.returnBackFuncId });
              } else {
                _this.$message({
                  message: message + ';',
                  type: 'error',
                  duration: 4000,
                });
              }
            });
        })
        .catch(function () {});
    },
  },
};
</script>
