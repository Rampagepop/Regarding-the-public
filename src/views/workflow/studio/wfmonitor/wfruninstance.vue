
<template>
  <div>
    <yu-panel :title="$t('wftodomonitor.title1')" panel-type="normal" no-padding-top>
      <template slot="filter">
        <yu-xform v-model="formdata" related-table-name="reftable" ref="searchForm" label-width="120px">
          <yu-xform-group :column="4">
            <yu-xform-item :label="$t('wftodomonitor.lcslh')" :placeholder="$t('wftodomonitor.lcslh')" ctype="input" name="instanceId"></yu-xform-item>
            <yu-xform-item :label="$t('wftodomonitor.ywlsh')" :placeholder="$t('wftodomonitor.ywlsh')" ctype="input" name="bizId"></yu-xform-item>
            <yu-xform-item :label="$t('wftodomonitor.flowname')" :placeholder="$t('wftodomonitor.flowname')" ctype="input" name="flowName"></yu-xform-item>
            <div slot="custom" class="search-btn-group">
              <yu-button type="primary" @click="searchFn" style="margin-left: 10px;">{{ $t('wfbutton.find') }}</yu-button>
              <yu-button @click="resetFn">{{ $t('wfbutton.reset') }}</yu-button>
            </div>
          </yu-xform-group>
        </yu-xform>
      </template>
      <yu-xtable ref="reftable" request-type="POST" :base-params="baseParams" :data-url="urls.index" show-hidden-menu>
        <yu-xtable-column :label="$t('wftodomonitor.lcslh')" prop="instanceId" :resizable="true">
          <template slot-scope="scope">
            <a class="underline" @click="customRowOp(scope,'DETAIL')">{{ scope.row.instanceId }}</a>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wftodomonitor.ywlsh')" prop="bizId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftodomonitor.flowname')" prop="flowName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftodomonitor.flowstarter')" prop="flowStarterName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftodomonitor.khbh')" prop="bizUserId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftodomonitor.khmc')" prop="bizUserName" :resizable="true"></yu-xtable-column>

        <yu-xtable-column :label="$t('wftodomonitor.flowstate')" prop="flowState" min-width="90" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-tag type="danger" v-if="scope.row.flowState=='C'">{{ $t('wfflowstate.flowstatec') }}</yu-tag>
            <yu-tag type="success" v-if="scope.row.flowState=='E'">{{ $t('wfflowstate.flowstatee') }}</yu-tag>
            <yu-tag type="danger" v-if="scope.row.flowState=='F'">{{ $t('wfflowstate.flowstatef') }}</yu-tag>
            <yu-tag type="warning" v-if="scope.row.flowState=='H'">{{ $t('wfflowstate.flowstateh') }}</yu-tag>
            <yu-tag type="primary" v-if="scope.row.flowState=='W'">{{ $t('wfflowstate.flowstatew') }}</yu-tag>
            <yu-tag type="success" v-if="scope.row.flowState=='R'">{{ $t('wfflowstate.flowstater') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.flowState=='S'">{{ $t('wfflowstate.flowstates') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wftodomonitor.starttime')" prop="startTime" width="180" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftodomonitor.option')" width="180" fixed="right" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button type="text" @click="customRowOp(scope,'DELETE')">{{ $t('wfbutton.delete') }}</el-button>
            <el-button type="text" @click="customRowOp(scope,'TRACK')">{{ $t('wfbutton.track') }}</el-button>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>

    <yu-xdialog :title="$t('wftodomonitor.title2')" :visible.sync="trackDialogVisible" @close="trackClose" height="530px" width="70%">
      <div :id="nwfTrackPage">
        <work-travel :key="worktravelKey" :work-travel-data="workTravelData" @cellClickFn="cellClickFn"></work-travel>
      </div>
      <div class="footer_buttons">
        <yu-button type="primary" @click="beforeResetFn" v-if="resetButtonShow">{{ $t('wftodomonitor.reset') }}</yu-button>
        <yu-button @click="anolishFn" v-if="cancelButtonShow">{{ $t('wftodomonitor.cancel') }}</yu-button>
        <!-- <yu-button @click="trackDialogVisible=false">关闭</yu-button> -->
      </div>
    </yu-xdialog>

    <el-dialog :title="$t('wftodomonitor.title3')" :visible.sync="UserSelect.showUserDialog">
      <yu-xform ref="userSearchForm" related-table-name="UserTableRef" v-model="searchFormdata">
        <yu-xform-group :column="2">
          <yu-xform-item label="用户名称" name="userName" placeholder="用户名称"></yu-xform-item>
          <div slot="custom" class="search-btn-group">
            <yu-button type="primary" @click="formSearchFn" style="margin-left: 10px;">查询</yu-button>
            <yu-button @click="formResetFn">重置</yu-button>
          </div>
        </yu-xform-group>
      </yu-xform>
      <yu-xtable ref="UserTableRef" :base-params="userParams" :data-url="UserSelect.userUrl" selection-type="radio">
        <yu-xtable-column prop="userId" :label="$t('wftodomonitor.userid')" align="center">
        </yu-xtable-column>
        <yu-xtable-column prop="userName" :label="$t('wftodomonitor.username')" align="center">
        </yu-xtable-column>
      </yu-xtable>
      <div style="margin-top: 20px" align="center">
        <el-button type="primary" @click="resetTransactorFn">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="UserSelect.showUserDialog = false">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { sessionStore } from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
import workTravel from '@/views/workflow/studio/wfmonitor/workTravel/workTravel.vue'
const cite = {}
export default {
  name: 'wfruninstance',
  components: { workTravel },
  data: function () {
    return {
      searchFormdata: {},
      worktravelKey: 0,
      formdata: {},
      urls: {
        index: backend.workflowService + '/api/monitor/todo',
        getNodeInfo: backend.workflowService + '/api/monitor/getCurrentNodeIds',
        deleteByBizId: backend.workflowService + '/api/core/deleteByBizId',
        resetNodeUser: backend.workflowService + '/api/core/resetNodeUser'
      },
      height: sessionStore.get(VIEW_SIZE).height - 103,
      trackDialogVisible: false,
      cancelButtonShow: false,
      resetButtonShow: false,
      baseParams: {},
      userParams: {},
      workTravelData: {},
      UserSelect: {
        showUserDialog: false,
        userUrl: backend.workflowService + '/api/org/users',
        SelectUsers: []
      },
      selectNodeId: null,
      nwfTrackPage: 'nwfTrackPage' + Date.now()
    };
  },
  computed: {
    ...mapGetters(['orgCode', 'loginCode'])
  },
  methods: {
    anolishFn() {
      // this.commentDialogVisiable = true;
      // this.cancelFn();
      var _this = this;
      _this.$confirm(_this.$t('wftodomonitor.msgsurecancel'), _this.$t('wftodomonitor.tip'), {
        confirmButtonText: _this.$t('wfbutton.sure'),
        cancelButtonText: _this.$t('wfbutton.cancel'),
        type: "warning",
        center: true,
      }).then(function () {
        var param = {
          orgId: _this.orgCode,
          comment: {
            commentSign: "O-17",
            userComment: _this.$t('wftodomonitor.msgcancelcomment'),
            instanceId: _this.workTravelData.instanceId,
            nodeId: _this.workTravelData.nodeInfo[0].nodeId,
            userId: _this.loginCode
          }
        };
        _this.$request({
          method: "POST",
          data: param,
          url: backend.workflowService + "/api/core/cancel"
        }).then(({code, message, data}) => {
          if (code === "0" && data.code === "0") {
            // 跳转到之前的页面
            _this.$message(data.tip + ";");
            _this.$refs.reftable.remoteData();
            _this.trackDialogVisible = false;
          } else {
            _this.$message({message: _this.$t('wftodomonitor.msgcaccelerror') + message, type: "error"});
          }
        })
      }).catch(function () {
        _this.$message({ type: "info", message: _this.$t('wftodomonitor.msgcancel') });
      });
    },
    // 作废
    // cancelFn: function () {
    //   var _this = this;
    //   _this.$refs.commentForm.validate(function (valid) {
    //     if (valid) {

    //     } else {
    //       _this.$message({ message: "请检查输入项是否合法!", type: "warning" });
    //     }
    //   });
    // },
    beforeResetFn: function() {
      if(!this.selectNodeId) {
        this.$message({message: this.$t('wftodomonitor.msgselectnode')});
        return;
      }
      this.UserSelect.SelectUsers = [];
      this.userParams = {
        orgId: this.orgCode,
        systemId: 'cmis'
      };
      // _this.getUserInfo();
      this.UserSelect.showUserDialog = true;
    },
    resetTransactorFn() {
      var _this = this;
      var userId = '';
      var sel = _this.$refs.UserTableRef.selections;
      if(sel === null || sel.length === 0) {
        _this.$message({message: _this.$t('wftodomonitor.msgselectone'), type: "error"});
        return;
      }
      _this.UserSelect.showUserDialog = false;
      var param = {
        instanceId: _this.workTravelData.instanceId,
        nodeId: _this.selectNodeId,
        userId: sel[0].userId
      };
      _this.$request({
        method: 'POST',
        url: _this.urls.resetNodeUser,
        data: param
      }).then(({code, message, data}) => {
        if (code === "0") {
          _this.$message({message: _this.$t('wftodomonitor.msgresetsuccess'), type: 'success'});
          _this.$refs.reftable.remoteData();
          _this.trackDialogVisible = false;
        } else {
          _this.$message({
            duration: 4000,
            message: _this.$t('wftodomonitor.msgreseterror') + message.substring(0, 100),
            type: 'error'
          });
        }
      })
    },
    customRowOp: function (scope, op) {
      // 表格操作按钮事件
      var _this = this; // 当前行号：scope.$index 当前行数据：scope.row 当前列对象：scope.column
      // this.$alert('你现在正在操作：' + op + '当前行ID值为：' + scope.row.flowId, '提示');
      // console.log(scope.row.flowId);
      var params = {
        instanceId: scope.row.instanceId,
        mainInstanceId: scope.row.mainInstanceId,
        flowId: scope.row.flowId,
        type: 'DONE',
        returnBackFuncId: this.$route.name,
        nodeInfo: []
      };

      if (op == 'DETAIL') {
        this.$router.replace({name: 'runInstanceInfo', params})
      } else if (op == 'DELETE') {
        _this.deleteFn(scope.row);
      } else if (op == 'TRACK') {
        var parameters = {
          instanceId: scope.row.instanceId
        };
        _this.$request({
          method: 'POST',
          url: _this.urls.getNodeInfo,
          data: parameters
        }).then(({code, message, data}) => {
          if (code == 0) {
            if (data != null) {
              params.nodeInfo = data;
              var flowId = scope.row.flowId;
              _this.workTravelData = params;
              if(_this.workTravelData.nodeInfo.length === 1) {
                _this.selectNodeId = _this.workTravelData.nodeInfo[0].nodeId;
                _this.resetButtonShow = true;
              }
              _this.checkNodeProperty(scope.row.instanceId);
            }
          } else {
            _this.$message({
              duration: 4000,
              message: _this.$t('wftodomonitor.msgdataerror') + message.substring(0, 100),
              type: 'error'
            });
          }
        })
      }
    },
    checkNodeProperty: function(data) {
      var param = {
        instanceId: data
      }
      var _this = this;
      _this.$request({
        method: 'POST',
        url: backend.workflowService + "/api/core/myinstanceInfo",
        data: param
      }).then(({code, message, data}) => {
        if (code === "0" && data) {
          if (data.opType && data.opType["cancel"] === "1") {
            _this.cancelButtonShow = true;
          }
          _this.trackDialogVisible = true;
          _this.worktravelKey++;
        } else {
          _this.$message({
            duration: 4000,
            message: _this.$t('wftodomonitor.msgdataerror') + message.substring(0, 100),
            type: 'error'
          });
        }
      })
    },
    deleteFn: function (data) {
      var _this = this;
      var param = {
        bizId: data.bizId
      };

      _this.$confirm(_this.$t('wftodomonitor.msgsuredelete'), _this.$t('wftodomonitor.tip'), {
        confirmButtonText: _this.$t('wfbutton.sure'),
        cancelButtonText: _this.$t('wfbutton.cancel'),
        type: 'warning',
        center: true
      }).then(function () {
        _this.$request({
          method: 'POST',
          url: _this.urls.deleteByBizId,
          data: param
        }).then(({code, message, data}) => {
          if (code == 0) {
            if (data != null) {
              _this.$message({
                duration: 6000,
                message: data.tip,
                type: 'success'
              });

              _this.searchFn();
            }
          } else {
            _this.$message({
              duration: 4000,
              message: _this.$t('wftodomonitor.msgdeleteerror') + message.substring(0, 100),
              type: 'error'
            });
          }
        })
      }).catch(function () {
        _this.$message({
          duration: 6000,
          type: 'info',
          message: _this.$t('wftodomonitor.msgcancel')
        });
      });
    },
    trackClose: function () {
      this.trackDialogVisible = false;
      this.resetButtonShow = false;
      this.cancelButtonShow = false;
      this.workTravelData = {};
    },
    searchFn: function () {
      var _this = this;
      _this.$refs.searchForm.validate(function(valid) {
        if (valid) {
          var model = _this.$refs.searchForm.formdata;
          var params = {
            flowName: model.flowName ? '%' + model.flowName + '%' : "",
            instanceId: model.instanceId ? model.instanceId : "",
            bizId: model.bizId ? model.bizId : ""
          };

          var param = {
            condition: JSON.stringify(params)
          };

          _this.$refs.reftable.remoteData(params);
        }
      })
    },
    // 自定义重置功能
    resetFn: function () {
      this.$refs.searchForm.resetFields();
      this.$refs.reftable.remoteData();
    },
    cellClickFn: function(cell) {
      console.log(cell);
      this.resetButtonShow = false;
      var nodeInfo = this.workTravelData.nodeInfo;
      if(nodeInfo && nodeInfo.length === 1) {
        this.selectNodeId = nodeInfo[0].nodeId;
        this.resetButtonShow = true;
      } else {
        this.selectNodeId = null;
        this.resetButtonShow = false;
        for (var i = 0; i < nodeInfo.length; i++) {
          if (cell.vertex && cell.data.nid === nodeInfo[i].nodeId.split('_')[1]) {
            // 待办节点
            this.selectNodeId = nodeInfo[i].nodeId;
            this.resetButtonShow = true;
            break;
          }
        }
      }
    },
    formSearchFn: function () {
      this.userParams = {
        condition: JSON.stringify({
          orgId: this.orgCode,
          systemId: 'cmis',
          userName: this.searchFormdata.userName
        })
      };
      // this.$refs.UserTableRef.remoteData(this.userParams);
    },
    formResetFn(type) {
      this.$refs.userSearchForm.resetFields();
      this.userParams = {
        condition: JSON.stringify({
          orgId: this.orgCode,
          systemId: 'cmis'
        })
      };
      // this.$refs.UserTableRef.remoteData(this.userParams);
      // this.$refs.UserTableRef.remoteData();
    }

  } // end method

}
</script>
<style scoped>
  .footer_buttons {
    text-align: center;
    margin-top: 15px;
  }
</style>
