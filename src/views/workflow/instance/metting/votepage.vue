
<template>
  <div>
    <el-tabs v-model="tabValue" tab-position="top">
      <el-tab-pane :label="$t('wfmeetstart.titlebiz')" name="first">
        <div :id="nwfbiztypePage">
          <component :is="bizPage" :biz-page-data="bizPageData"></component>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('wfmeetstart.titleinfo')" name="vote">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ $t('wfmeetstart.titlevote') }}</span>
          </div>
          <el-form-x ref="voteform" :group-fields="updateFields" label-width="100px" height="400px"></el-form-x>
          <div align="center">
            <el-button type="primary" @click="cancel">{{ $t('wfbutton.cancel') }}</el-button>
            <el-button type="primary" @click="nwfVoteFn" v-show="isShowCfmBtn" v-norepeat.loading>{{ $t('wfbutton.sure') }}</el-button>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ $t('wfmeetstart.titlehis') }}</span>
          </div>
          <el-table ref="hisTable" :data="nodeHistory" border style="width: 100%">
            <el-table-column prop="nodeName" :label="$t('wfmeetstart.nodename')"> </el-table-column>
            <el-table-column prop="userName" :label="$t('wfmeetstart.applyusername')"> </el-table-column>
            <el-table-column prop="startTime" :label="$t('wfmeetstart.starttime')"> </el-table-column>
            <el-table-column prop="userId" :label="$t('wfmeetstart.applyuser')"> </el-table-column>
            <el-table-column prop="nodeId" :label="$t('wfmeetstart.nodeid')"> </el-table-column>
            <el-table-column prop="userComment" :label="$t('wfmeetstart.usercomment')"> </el-table-column>
            <el-table-column prop="ext" :label="$t('wfmeetstart.extcomment')"> </el-table-column>
            <el-table-column prop="commentSign" :label="$t('wfmeetstart.commentsign')"> </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
const data = {};
import { mapGetters } from 'vuex';
import { validator } from '@/utils/validate';
export default {
  data: function () {
    var ResultOptions = [
      {
        key: 'Y',
        value: this.$t('wfmeetlist.statey')
      },
      {
        key: 'N',
        value: this.$t('wfmeetlist.staten')
      },
      {
        key: 'G',
        value: this.$t('wfmeetlist.stateg')
      }
    ];
    var MeetTypes = [
      {
        key: '05',
        value: this.$t('wfmeetlist.typadsh')
      },
      {
        key: '06',
        value: this.$t('wfmeetlist.typetsh')
      }
    ];
    return {
      urls: {
        userUrl: backend.workflowService + '/api/metting/user',
        getComments: backend.workflowService + '/api/core/getAllComments/',
        opUrl: backend.workflowService + '/api/metting/op'
      },
      requestType: 'POST',
      dataParams: {},
      updateFields: [
        {
          columnCount: 4,
          fields: [
            {
              label: '会议号',
              filed: 'meetId',
              type: 'input',
              disabled: true,
              hidden: true
            },
            {
              label: '投票号',
              filed: 'voteId',
              type: 'input',
              disabled: true,
              hidden: true
            },
            {
              label: this.$t('wfmeetlist.lcslh'),
              field: 'instanceId',
              type: 'input',
              disabled: true,
              rules: [
                {
                  required: false,
                  message: this.$t('wfmeetlist.msgbtx')
                }
              ]
            },
            {
              label: this.$t('wfmeetlist.ywlsh'),
              field: 'bizId',
              type: 'input',
              disabled: true,
              rules: [
                {
                  required: false,
                  message: this.$t('wfmeetlist.msgbtx')
                }
              ]
            },
            {
              label: this.$t('wfmeetlist.userid'),
              field: 'userId',
              type: 'input',
              disabled: true,
              hidden: true,
              rules: [
                {
                  required: false,
                  message: this.$t('wfmeetlist.msgbtx')
                }
              ]
            },
            {
              label: this.$t('wfmeetlist.flowstarter'),
              field: 'flowStarterName',
              type: 'input',
              disabled: true,
              rules: [
                {
                  required: false,
                  message: this.$t('wfmeetlist.msgbtx')
                }
              ]
            },
            {
              label: this.$t('wfmeetlist.meettype'),
              field: 'meetType',
              type: 'select',
              disabled: true,
              options: MeetTypes,
              rules: [
                {
                  required: false,
                  message: this.$t('wfmeetlist.msgbtx')
                }
              ]
            },
            {
              label: this.$t('wfmeetlist.starttime'),
              field: 'startTime',
              type: 'input',
              disabled: true,
              rules: [
                {
                  required: false,
                  message: this.$t('wfmeetlist.msgbtx')
                }
              ]
            },
            {
              label: this.$t('wfmeetlist.endtime'),
              field: 'endTime',
              type: 'input',
              hidden: true,
              rules: [
                {
                  required: false,
                  message: this.$t('wfmeetlist.msgbtx')
                }
              ]
            },
            {
              label: this.$t('wfmeetlist.meetsub'),
              field: 'mettingSub',
              type: 'input',
              disabled: true,
              rules: [
                {
                  required: false,
                  message: this.$t('wfmeetlist.msgbtx')
                }
              ]
            },
            {
              label: this.$t('wfmeetlist.meetyear'),
              field: 'mettingYear',
              type: 'input',
              disabled: true,
              rules: [
                {
                  required: false,
                  message: this.$t('wfmeetlist.msgbtx')
                }
              ]
            },
            {
              label: this.$t('wfmeetlist.meetno'),
              field: 'mettingNo',
              type: 'input',
              disabled: true,
              rules: [
                {
                  required: false,
                  message: this.$t('wfmeetlist.msgbtx')
                }
              ]
            }
          ]
        },
        {
          columnCount: 1,
          fields: [
            {
              field: 'mettingSts',
              label: this.$t('wfmeetlist.votestate'),
              type: 'select',
              options: ResultOptions,
              rules: [
                {
                  required: true,
                  message: this.$t('wfmeetlist.msgbtx'),
                  trigger: 'blur'
                }
              ]
            },
            {
              label: this.$t('wfmeetlist.meetcomment'),
              field: 'mettingComment',
              type: 'textarea',
              autosize: { minRows: 5 },
              rules: [
                {
                  required: true,
                  message: this.$t('wfmeetlist.msgbtx'),
                  trigger: 'blur'
                }
                // { validator: validator.speChar }
              ]
            }
          ]
        }
      ],
      meetForm: {
        meetId: '',
        voteId: '',
        mettingSts: '',
        mettingComment: ''
      },
      baseParams: {
        meetId: '',
        orgId: ''
      },
      nodeHistory: [],
      meetId: '',
      currentOrgId: '',
      currentUserId: '',
      returnBackFuncId: '',
      tabValue: 'vote',
      nwfbiztypePage: 'nwfbiztypePage' + Date.now(),
      bizPage: '',
      bizPageData: null,
      bizParam: {},
      isShowCfmBtn: true, // 是否展示投票按钮
      gatherPageData: null, // 页面传参
      instanceIdInfo: {
      }
    };
  },
  computed: {
    ...mapGetters(['userCode', 'org'])
  },
  created () {
    this.currentOrgId = this.org.code;
    this.currentUserId = this.userCode;
    this.baseParams.orgId = this.org.code;
    if (this.$route.params.queryData && this.$route.params.queryData.mettingSts === 'S') {
      this.isShowCfmBtn = false;
      this.updateFields[1].fields[0].disabled = true;
      this.updateFields[1].fields[1].disabled = true;
    }
  },
  mounted: function () {
    // 路由参数处理
    const params =
      this.bizPageData == null ? this.$route.params.queryData : this.bizPageData;
    // if(!params) {
    //   const data = sessionStore.get('DYNAMIC_ROUTES_PARMS')
    //   params = data && data[this.$route.name]
    // }
    if (params != null) {
      this.dataParams = {
        // condition: JSON.stringify({
        //   instanceId: params.instanceId
        // })
        instanceId: params.instanceId
      };
      this.baseParams.meetId = params.meetId;
      this.meetId = params.meetId;
      this.getComment(params.instanceId);
      this.initData(params);
    }
  },
  methods: {
    initData: function (data) {
      yufp.extend(this.$refs.voteform.formModel, data);
      this.$refs.voteform.formModel.mettingSts = data.voteSts;
      var bizPage = data.bizPage;
      if (bizPage == null ? false : bizPage.includes('?')) {
        var str = bizPage.split('?');
        bizPage = str[0];
        this.convertParam(str[1]);
      }
      var paramT = {
        instanceInfo: data,
        flowParam: this.bizParam,
        optypeOptions: []
      };
      this.$nextTick(function () {
        try {
          this.bizPageData = paramT;
          this.bizPage = () =>
            Promise.resolve(require('@/views/' + bizPage).default);
        } catch (e) {}
      });
    },
    convertParam: function (params) {
      if (params == null) {
        return;
      }
      if (params.includes(',')) {
        params = params.split(',');
        for (var k = 0; k < params.length; k++) {
          var paramf = {};
          var item = params[k];
          paramf.key = item.split('=')[0];
          paramf.value = item.split('=')[1];
          this.bizParam[paramf.key] = paramf.value;
        }
      } else {
        var paramf = {};
        paramf.key = params.split('=')[0];
        paramf.value = params.split('=')[1];
        this.bizParam[paramf.key] = paramf.value;
      }
    },
    getComment: function (val) {
      var _this = this;
      yufp.service.request({
        method: 'POST',
        url: _this.urls.getComments,
        data: { mainInstanceId: val },
        callback: function (code, message, response) {
          if (response.code == 0) {
            if (response.data != null ? response.data.length > 0 : false) {
              var nodeHistory = response.data;
              // commentSign翻译
              for (var i = 0, length = nodeHistory.length; i < length; i++) {
                nodeHistory[i].commentSign = yufp.lookup.convertKey(
                  'OP_TYPE',
                  nodeHistory[i].commentSign
                );
              }
              _this.nodeHistory = nodeHistory;
            }
          }
        }
      });
    },
    nwfVoteFn: function () {
      var _this = this;
      var isValid = true;
      _this.$refs.voteform.validate(function (valid) {
        isValid = valid;
      });
      if (!isValid) {
        _this.$message({ message: _this.$t('wfmeethislist.inputillegal'), type: 'warning' });
        return false;
      }
      var model = _this.$refs.voteform.formModel;
      var param = {
        voteId: model.voteId,
        meetId: model.meetId,
        instanceId: model.instanceId,
        userId: _this.currentUserId,
        mettingComment: model.mettingComment,
        mettingSts: model.mettingSts
      };
      yufp.service.request({
        method: 'POST',
        url: _this.urls.opUrl,
        data: param,
        callback: function (code, message, response) {
          if (response.code == 0 && response.data) {
            _this.$message({ message: _this.$t('wfmeethislist.msgtpcg'), type: 'success' });
            yufp.router.removeTab(_this.$route.path);
          }
        }
      });
    },
    cancel: function () {
      yufp.router.removeTab(this.$route.path);
    }
  }
};
</script>
