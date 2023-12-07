
<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t('wfmeetedit.title') }}</span>
      </div>
      <el-form :model="meetForm" ref="refForm" label-width="100px" align="center" style="margin-left: 100px;margin-right: 100px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('wfmeetedit.meetleader')" prop="userId" align="center">
              <el-input v-model="meetForm.userId" placeholder="" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('wfmeetedit.starttime')" prop="startTime" align="center">
              <el-input v-model="meetForm.startTime" placeholder="" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('wfmeetedit.meettype')" prop="meetType" align="center">
              <el-select v-model="meetForm.meetType" clearable disabled>
                <el-option v-for="item in meetTypes" :key="item.key" :value="item.key" :label="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('wfmeetedit.meetstate')" prop="mettingSts" align="center">
              <el-select v-model="meetForm.mettingSts" clearable disabled>
                <el-option v-for="item in mettingStsOptions" :key="item.key" :value="item.key" :label="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('wfmeetedit.votenum')" prop="totalNum" align="center">
              <el-input v-model="meetForm.totalNum" placeholder="" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('wfmeetedit.donenum')" prop="doneNum" align="center">
              <el-input v-model="meetForm.doneNum" placeholder="" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item align="left">
          <el-button type="primary" @click="addUser">{{ $t('wfmeetedit.butadd') }}</el-button>
          <el-button type="primary" @click="rmUser">{{ $t('wfmeetedit.butdelete') }}</el-button>
          <el-button type="primary" @click="reSet">{{ $t('wfmeetedit.butreset') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="voteTable" :data="meetForm.meetUser" style="width: 100%" border highlight-current-row @row-click="selectionLineChangeHandle">
        <el-table-column align="center" prop="userName" :label="$t('wfmeetedit.voteuser')" />
        <el-table-column align="center" prop="mettingSts" :label="$t('wfmeetedit.votestate')" />
        <el-table-column align="center" prop="startTime" :label="$t('wfmeetedit.taskstattime')" />
        <el-table-column align="center" prop="endTime" :label="$t('wfmeetedit.taskendtime')"></el-table-column>
        <el-table-column align="center" prop="voteSts" :label="$t('wfmeetedit.taskstate')"></el-table-column>
      </el-table>
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
    <el-dialog-x :title="$t('wfmeetedit.titleuser')" :visible.sync="userSelectDialog">
      <!--yu-xform v-model="formdata" related-table-name="reftable" form-type="search">
        <yu-xform-group :column="3">
          <yu-xform-item :label="$t('wfmeetstart.userid')" :placeholder="$t('wfmeetstart.userid')" ctype="input" name="userId"></yu-xform-item>
          <yu-xform-item :label="$t('wfmeetstart.username')" :placeholder="$t('wfmeetstart.username')" ctype="input" name="userName"></yu-xform-item>
        </yu-xform-group>
      </yu-xform-->
      <yu-xtable ref="reftable" :base-params="baseParams" :data-url="urls.userUrl">
        <yu-xtable-column prop="userId" :label="$t('wfmeetedit.userid')"></yu-xtable-column>
        <yu-xtable-column prop="userName" :label="$t('wfmeetedit.username')"></yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="selectFn">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="userSelectDialog = false">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog-x>
    <el-dialog-x :title="$t('wfmeetedit.isbiz')" :visible.sync="isCheckBizDialog" width="400px">
      <yu-xform label-width="120px">
        <yu-xform-group :column="1" align="center">
          <yu-xform-item :label="$t('wfmeetstart.isbiz')" ctype="select" name="isCheckBiz" v-model="isCheckBiz" :options="isCheckBizs"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="sureAdd">{{ $t('wfbutton.sure') }}</el-button>
      </div>
    </el-dialog-x>
  </div>
</template>
<script>
const data = {};
import { mapGetters } from 'vuex';
import {clone, extend, sessionStore} from '@/utils'
export default {
  data: function () {
    return {
      urls: {
        userUrl: backend.workflowService + '/api/metting/user',
        getComments: backend.workflowService + '/api/core/getAllComments/',
        dataUrl: backend.workflowService + '/api/metting/myStart',
        vote: backend.workflowService + '/api/metting/voteAll',
        rmUser: backend.workflowService + '/api/metting/deleteVoteUser',
        refresh: backend.workflowService + '/api/metting/refreshMeet',
        addUser: backend.workflowService + '/api/metting/addVoteUser'
      },
      requestType: 'POST',
      dataParams: {},
      meetForm: {
        meetType: '1',
        meetUser: [
          {
            userId: '',
            userName: '',
            check: ''
          }
        ]
      },
      // meetType: '1',
      meetTypes: [
        {
          key: '05',
          value: this.$t('wfmeetlist.typadsh')
        },
        {
          key: '06',
          value: this.$t('wfmeetlist.typetsh')
        }
      ],
      mettingStsOptions: [
        {
          key: 'S',
          value: this.$t('wfmeetlist.statues')
        },
        {
          key: 'E',
          value: this.$t('wfmeetlist.statuee')
        },
        {
          key: 'R',
          value: this.$t('wfmeetlist.statuer')
        }
      ],
      baseParams: {
        meetId: '',
        orgId: ''
      },
      isCheckBizs: [
        {
          key: '0',
          value: this.$t('wfmeetstart.no')
        },
        {
          key: '1',
          value: this.$t('wfmeetstart.yes')
        }
      ],
      meetId: '',
      currentOrgId: '',
      currentUserId: '',
      readyUsers: [],
      voteSelection: null,
      userSelectDialog: false,
      isCheckBizDialog: false,
      isCheckBiz: '1',
      formdata: null,
      meetData: null,
      nodeHistory: []
    };
  },
  computed: {
    ...mapGetters(['userCode', 'org'])
  },
  created () {
    this.currentOrgId = this.org.code;
    this.currentUserId = this.userCode;
    this.baseParams.orgId = this.org.code;
  },
  mounted: function () {
    let data =
      this.bizPageData == null ? this.$route.params.queryData : this.bizPageData;
    if(!data) {
      const params = sessionStore.get('DYNAMIC_ROUTES_PARMS')
      data = params && params[this.$route.name]
    }
    if (data != null) {
      this.dataParams = {
        instanceId: data.instanceId
      };
      this.meetData = data;
      this.baseParams.meetId = data.meetId;

      this.meetId = data.meetId;
      this.getComment(data.instanceId);
      yufp.extend(this.meetForm, data);
      this.initData(data.meetId);
    }
  },
  methods: {
    initData: function (val) {
      var _this = this;
      var params = {
        userId: _this.meetData.userId,
        meetType: _this.meetData.meetType
      };
      _this.readyUsers = [];
      _this.meetForm.doneNum = _this.meetForm.totalNum - _this.meetForm.todoNum;
      yufp.service.request({
        method: 'POST',
        url: _this.urls.dataUrl,
        data: params,
        callback: function (code, message, response) {
          if (response.code == 0) {
            if (response.data != null ? response.data.length > 0 : false) {
              _this.refreshMeetData(response.data);
              yufp.service.request({
                method: 'POST',
                url: _this.urls.vote,
                data: { meetId: _this.meetData.meetId},
                callback: function (code, message, response) {
                  if (response.code == 0) {
                    if (response.data != null ? response.data.length > 0 : false) {
                      var nodeHistory = response.data;
                      // 处理投票状态
                      for (var j = 0, len = nodeHistory.length; j < len; j++) {
                        if (
                          nodeHistory[j].mettingSts == null ||
                          nodeHistory[j].mettingSts == ''
                        ) {
                          nodeHistory[j].mettingSts = _this.$t('wfmeetedit.statee');
                          nodeHistory[j].voteSts = _this.$t('wfmeetedit.statea');
                        } else {
                          switch (nodeHistory[j].mettingSts) {
                            case 'Y':
                              nodeHistory[j].mettingSts = _this.$t('wfmeetedit.statey');
                              break;
                            case 'N':
                              nodeHistory[j].mettingSts = _this.$t('wfmeetedit.staten');
                              break;
                            case 'G':
                              nodeHistory[j].mettingSts = _this.$t('wfmeetedit.stateg');
                              break;
                            default:
                              nodeHistory[j].mettingSts = '';
                          }
                          nodeHistory[j].voteSts = _this.$t('wfmeetedit.statej');
                        }
                        _this.readyUsers.push(nodeHistory[j].userId);
                      }
                      _this.meetForm.meetUser = nodeHistory;
                    } else {
                      _this.readyUsers = [];
                      _this.meetForm.meetUser = [];
                    }
                  }
                }
              });
            }
          }
        }
      });
    },
    refreshMeetData: function (data) {
      if (!data || data.length == 0) {
        return;
      }
      for (var i in data) {
        if (data[i] && data[i].meetId === this.meetData.meetId) {
          var val = data[i];
          yufp.extend(this.meetForm, val);
          this.meetForm.doneNum = this.meetForm.totalNum - this.meetForm.todoNum;
          if (this.meetForm.totalNum != 0 && this.meetForm.totalNum == this.meetForm.doneNum) {
            this.checkMeetSts();
          }
        }
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
    addUser: function () {
      // if (_this.meetForm.meetType === '04' && !_this.checkUserNum('add')) {
      //   return false;
      // }
      this.userSelectDialog = true;
    },
    selectFn: function() {
      this.isCheckBizDialog = true;
    },
    selectionLineChangeHandle: function (selection) {
      console.log(selection);
      this.voteSelection = selection;
    },
    sureAdd: function () {
      var _this = this;
      _this.isCheckBizDialog = false;
      _this.userSelectDialog = false;

      var row = _this.$refs.reftable.selections;
      if (row == null || row.length !== 1) {
        this.$message({ message: this.$t('wfmeetedit.qxxzytjl'), type: 'warning' });
        return;
      }
      if (row[0].userId == '' || row[0].userId == null || row[0].userName == '' || row[0].userName == null) {
        this.$message({ message: this.$t('wfmeetedit.msguserexit'), type: 'warning' });
        return;
      }
      for (var i = 0; i < this.meetForm.meetUser.length; i++) {
        if (_this.readyUsers.indexOf(row[0].userId) > -1) {
          this.$message({ message: this.$t('wfmeetedit.msgyjxz'), type: 'warning' });
          return;
        }
      }
      var param = {};
      yufp.clone(_this.meetData, param);
      param.userId = row[0].userId;
      param.userName = row[0].userName;
      param.isCheckBiz = _this.isCheckBiz;
      yufp.service.request({
        method: 'POST',
        url: _this.urls.addUser,
        data: param,
        callback: function (code, message, response) {
          if (response.code == '0' && response.data) {
            _this.$message({ message: _this.$t('wfmeetedit.msgxzyhcg'), type: 'success' });
            _this.initData(_this.meetId);
          }
        }
      });
    },
    // 删除指定用户会议记录
    rmUser: function () {
      var _this = this;
      var row = _this.voteSelection;
      if (row == null) {
        _this.$message({ message: _this.$t('wfmeetedit.qxxzytjl'), type: 'warning' });
        return false;
      }
      // if (_this.meetForm.meetType === '04' && !_this.checkUserNum('add')) {
      //   return false;
      // }
      var param = {
        userId: row.userId,
        voteId: row.voteId
      };
      yufp.service.request({
        method: 'POST',
        url: _this.urls.rmUser,
        data: param,
        callback: function (code, message, response) {
          if (response.code == 0 && response.data.code == '0') {
            _this.$message({ message: response.data.tip, type: 'success' });
            _this.initData(_this.meetId);
          }
        }
      });
    },
    checkMeetSts: function () {
      var _this = this;
      var param = {
        meetId: _this.meetId
      };
      _this
        .$confirm(this.$t('wfmeetedit.msgsureend'), this.$t('wfmeetedit.tip'), {
          confirmButtonText: this.$t('wfbutton.sure'),
          cancelButtonText: this.$t('wfbutton.cancel'),
          type: 'warning',
          center: true
        }).then(function () {
          yufp.service.request({
            method: 'POST',
            url: _this.urls.refresh,
            data: param,
            callback: function (code, message, response) {
              if (response.code == 0 && response.data) {
                yufp.router.removeTab(_this.$route.path);
              }
            }
          });
        }).catch(function () {
          _this.$message({ duration: 6000, type: 'info', message: this.$t('wfmeetedit.msgcancel') });
        });
    },
    // 重置任务，将投票结论和意见置空
    reSet: function () {
      var _this = this;
      var row = _this.voteSelection;
      if (row == null) {
        _this.$message({ message: this.$t('wfmeetedit.qxxzytjl'), type: 'warning' });
        return false;
      }
      var param = {
        userId: row.userId,
        meetId: row.meetId,
        voteId: row.voteId
      };
      yufp.service.request({
        method: 'POST',
        url: _this.urls.addUser,
        data: param,
        callback: function (code, message, response) {
          if (response.code == '0' && response.data) {
            _this.$message({ message: _this.$t('wfmeetedit.msgreset'), type: 'success' });
            _this.initData(_this.meetId);
          }
        }
      });
    },
    // checkUserNum: function (type) {
    //   var user = this.meetForm.meetUser;
    //   if (user != null && user.length == 3 && type == 'add') {
    //     this.$message({
    //       message: '三人会商模式只允许三人参会',
    //       type: 'warning'
    //     });
    //     return false;
    //   }
    //   if ((user == null || user.length < 3) && type == 'submit') {
    //     this.$message({ message: '三人会商模式需要三人参会', type: 'warning' });
    //     return false;
    //   }
    //   return true;
    // }
  }
};
</script>
