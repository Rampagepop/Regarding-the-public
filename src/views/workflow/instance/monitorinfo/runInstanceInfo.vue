
<template>
  <div>
    <yu-panel :title="title" :collapse-hide="false">
      <el-tabs value="first" type="card" @tab-click="tabClick">
        <el-tab-pane :label="$t('wfinsinfo.title1')" name="first">
          <div :id="nwfbiztypePage">
            <component :is="bizPage" :biz-page-data="bizPageData"></component>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('wfinsinfo.tab4')" name="second">
          <yu-timeline class="todo-process" v-if="timelineItems.length">
            <yu-timeline-item v-for="(item, indexh) in timelineItems" :key="indexh" :timeline-items="timelineItems">
              <div slot="title">
                {{ item.nodeName }}
                <span class="processTag" :class="'processTag' + item.processType">{{ item.commentSign }}</span>
              </div>
              <div slot="date">{{ item.startTime }}</div>
              <div slot="description">
                <ul>
                  <li><span>{{ $t('wfinsinfo.spr') }}{{ item.userName }}&emsp;{{ $t('wfinsinfo.gh') }}{{ item.userId }}</span></li>
                  <li><span>{{ $t('wfinsinfo.spsc') }}{{ item.time }}({{ item.timeType }})</span></li>
                  <li style="word-break: break-all;"><span>{{ $t('wfinsinfo.spsm') }}{{ item.userComment }}</span></li>
                </ul>
              </div>
            </yu-timeline-item>
          </yu-timeline>
        </el-tab-pane>
        <el-card class="box-card">
          <div style="text-align: center;">
            <el-button @click="cancel">{{ $t('wfinsinfo.butback') }}</el-button>
          </div>
        </el-card>
      </el-tabs>
    </yu-panel>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { sessionStore } from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
import { loadView } from '@/utils/loadView'
const loadType = process.env.VUE_APP_YUXP_LOADTYPE // 加载方式，json , vue , database
let data = {}
export default {
  name: 'runInstanceInfo',
  data: function () {
    var _this = this;

    return {
      collapseValue: '1',
      urls: {
        index: backend.workflowService + '/api/bench/todo',
        instanceInfo: backend.workflowService + '/api/core/myinstanceInfo',
        endInfo: backend.workflowService + '/api/core/myinstanceInfoHis',
        getComments: backend.workflowService + '/api/core/getAllComments/'
      },
      bizPageData: null,
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
        bizPage: '',
        lastNodeId: '',
        lastNodeName: '',
        handleType: '',
        nodeId: '',
        nodeName: '',
        bizType: '',
        nodeSign: '',
        nodeState: '',
        opType: {}
      },
      commentInfo: {
        instanceId: '',
        nodeId: '',
        userId: '',
        commentId: '',
        commentSign: 'O-12',
        userComment: '',
        ext: ''
      },
      flowParam: [],
      commentTableData: [],
      nodeHistory: [],
      nwfbiztypePage: 'nwfbiztypePage' + Date.now(),
      commentinfo: '',
      type: '',
      timelineItems: [],
      bizPage: null,
      title: null
    };
  },
  computed: {
    ...mapGetters([
      'userCode', 'org'
    ])
  },
  created () {
    this.currentOrgId = this.org.code
    this.currentUserId = this.userCode
  },
  mounted: function () {
    data = this.$route.query
    // 进入初始化
    this.returnBackFuncId = data.returnBackFuncId;
    this.type = data.type;
    this.instanceInfoFn(data);
  },
  methods: {
    tabClick: function (tab, event) {
      var _this = this;

      var url = _this.urls.getComments;
      if (tab.name == 'second') {
        _this.$request({
          method: 'POST',
          url: url,
          data: {
            mainInstanceId: _this.instanceIdInfo.mainInstanceId
          }
        }).then(({code, message, data}) => {
          if (code == 0) {
            if (data == null ? false : data.length == 0) {
              _this.commentinfo = _this.$t('wfinsinfo.msgnocomm');
            }

            var nodeHistory = data; // commentSign翻译

            // for (var i = 0, length = nodeHistory.length; i < length; i++) {
            //   nodeHistory[i].commentSign = _this.$lookup.convertKey('OP_TYPE', nodeHistory[i].commentSign); // 时间格式化
            // }

            _this.nodeHistory = nodeHistory;
            _this.convertTimeItems(data);
          } else {
            _this.$message({
              message: message + ';',
              type: 'error',
              duration: 6000
            });
          }
        })
      }
    },
    convertTimeItems: function(items) {
      items.forEach(item => {
        this.trans(item);
        item.commentSign = item.commentSign ? yufp.lookup.convertKey("OP_TYPE", item.commentSign) : this.$t('wfinsinfo.msgwsp');
      });
      this.timelineItems = items;
    },
    trans: function(item) {
      var day = 86400, hour = 3600, d = 3;
      item.processType = item.commentSign;
      if (item.approvalTime) {
        var time = parseInt(item.approvalTime);
        if(time > day) {
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
      var params = {
        instanceId: param.instanceId
      };

      if (param.nodeId) {
        params.nodeId = param.nodeId;
      }

      if (param.type == 'DONE') {
        _this.title = _this.$t('wfinsinfo.title4');
        url = _this.urls.instanceInfo;
      } else if (param.type == 'HIS') {
        url = _this.urls.endInfo;
        _this.title = _this.$t('wfinsinfo.title5');
      }
      _this.$request({
        method: 'POST',
        url: url,
        data: params
      }).then(({code, message, data}) => {
        if (code == 0) {
          if (data != null) {
            _this.instanceIdInfo = data;

            if (data.param != null) {
              // 流程参数初始化
              for (var key in data.param) {
                var paramTT = {};
                paramTT.key = key;
                paramTT.value = data.param[key];

                _this.flowParam.push(paramTT);
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
              flowParam: _this.flowParam
            };

            _this.$nextTick(function () {
              try {
                _this.bizPage = loadView(bizPage);
                _this.bizPageData = paramT
              } catch (e) {}

            });
          }
        } else {
          _this.$message({
            duration: 6000,
            message: message ? message : _this.$t('wfinsinfo.msginfoerror'),
            type: 'error'
          });

          _this.cancel();
        }
      })
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
    cancel: function () {
      // 跳转到之前的页面
      this.$router.replace({ name: this.returnBackFuncId });
    }
  }

}
</script>
