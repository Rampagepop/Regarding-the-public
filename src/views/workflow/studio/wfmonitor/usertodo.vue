
<template>
  <div>
    <yu-panel :title="$t('wfusermonitor.title1')" panel-type="normal" no-padding-top>
      <template slot="filter">
        <yu-xform v-model="formdata" related-table-name="reftable" ref="searchForm" label-width="120px" :custom-search-fn="searchFn" :custom-reset-fn="resetFn" form-type="search">
          <yu-xform-group :column="4">
            <yu-xform-item :label="$t('wfusermonitor.lcslh')" :placeholder="$t('wfusermonitor.lcslh')" ctype="input" name="instanceId"></yu-xform-item>
            <yu-xform-item :label="$t('wfusermonitor.flowname')" :placeholder="$t('wfusermonitor.flowname')" ctype="input" name="flowName"></yu-xform-item>
            <yu-xform-item :label="$t('wfusermonitor.ywlsh')" :placeholder="$t('wfusermonitor.ywlsh')" ctype="input" name="bizId"></yu-xform-item>
            <yu-xform-item :label="$t('wfusermonitor.username')" :placeholder="$t('wfusermonitor.username')" ctype="input" name="userName"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>

      <yu-xtable ref="reftable" :row-index="true" request-type="POST" :data-url="urls.index" show-hidden-menu>
        <yu-xtable-column :label="$t('wfusermonitor.lcslh')" prop="instanceId" width="190"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfusermonitor.ywlsh')" prop="bizId" width="190"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfusermonitor.flowname')" prop="flowName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfusermonitor.flowStarterName')" prop="flowStarterName" width="100" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfusermonitor.khmc')" prop="bizUserName" :resizable="true" :hide-column="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfusermonitor.nodename')" prop="nodeName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfusermonitor.username')" prop="userName" width="100" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfusermonitor.starttime')" prop="startTime" width="170" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfusermonitor.lastnodename')" prop="lastNodeName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfusermonitor.lastusername')" prop="lastUserName" min-width="100" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfusermonitor.nodestate')" prop="nodeState" min-width="80" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">                
            <yu-tag type="gray" v-if="scope.row.nodeState=='O-0'">{{ $t('wfnodestate.nahui') }}</yu-tag>
            <yu-tag type="danger" v-if="scope.row.nodeState=='O-1'">{{ $t('wfnodestate.dahui') }}</yu-tag>
            <yu-tag type="warning" v-if="scope.row.nodeState=='O-2'">{{ $t('wfnodestate.tuihui') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.nodeState=='O-5'">{{ $t('wfnodestate.cuiban') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.nodeState=='O-6'">{{ $t('wfnodestate.change') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.nodeState=='O-7'">{{ $t('wfnodestate.xieban') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.nodeState=='O-9'">{{ $t('wfnodestate.jump') }}</yu-tag>
            <yu-tag type="success" v-if="scope.row.nodeState=='O-12'">{{ $t('wfnodestate.agree') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.nodeState=='O-15'">{{ $t('wfnodestate.chehui') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.nodeState=='O-10'">{{ $t('wfnodestate.weituo') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.nodeState=='O-16'">{{ $t('wfnodestate.faqi') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.nodeState=='O-13'">{{ $t('wfnodestate.zdtj') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.nodeState=='O-8'">{{ $t('wfnodestate.refuse') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.nodeState=='O-14'">{{ $t('wfnodestate.end') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.nodeState=='O-17'">{{ $t('wfnodestate.cancel') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.nodeState=='O-26'">{{ $t('wfnodestate.buqian') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.nodeState=='O-27'">{{ $t('wfnodestate.jiaqian') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfusermonitor.signstate')" prop="signIn" align="center" min-width="85" :show-overflow-tooltip="true">
          <template slot-scope="scope">                
            <yu-tag type="gray" v-if="scope.row.signIn==0">{{ $t('wfsignstate.sign0') }}</yu-tag>
            <yu-tag type="danger" v-if="scope.row.signIn==1">{{ $t('wfsignstate.sign1') }}</yu-tag>
            <yu-tag type="success" v-if="scope.row.signIn==2">{{ $t('wfsignstate.sign2') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfusermonitor.flowstate')" prop="flowState" min-width="80" align="center" :hide-column="true" :show-overflow-tooltip="true">
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
        <yu-xtable-column :label="$t('wfusermonitor.biztype')" prop="bizType" width="80" align="center" :hide-column="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfusermonitor.option')" width="110" fixed="right">
          <template slot-scope="scope">            
            <el-button type="text" @click="customRowOp(scope,'RESET')">{{ $t('wfusermonitor.reset') }}</el-button>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <el-dialog :title="$t('wfusermonitor.title2')" :visible.sync="UserSelect.showUserDialog" @open="submitbefore">
      <!--el-card class="box-card" v-show="true">
        <el-tag v-for="tag in UserSelect.SelectUsers" :key="tag.userId" type="success" closable @close="TagClose(tag)">
          {{ tag.userName }}
        </el-tag>
      </el-card-->
      <yu-xtable ref="UserTableRef" request-type="POST" selection-type="radio" reserve-selection row-key="userId" row-number :pageable="false" :data="UserSelect.Users.slice((currentPage - 1) * pagesize, currentPage * pagesize)" @row-dblclick="RowDbClick">
        <yu-xtable-column prop="userId" :label="$t('wfusermonitor.userid1')" align="left"></yu-xtable-column>
        <yu-xtable-column prop="userName" :label="$t('wfusermonitor.username1')" align="left"></yu-xtable-column>
      </yu-xtable>
      <el-pagination layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" :current-page="currentPage" :total="total" @current-change="CurrentChange" @size-change="SizeChange">
      </el-pagination>
      <div style="margin-top: 20px" align="center">
        <el-button type="primary" @click="UserDialogClose">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="UserSelect.showUserDialog = false">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { sessionStore } from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
export default {
  data: function () {
    var _this = this;

    return {
      formdata: {},
      urls: {
        index: backend.workflowService + '/api/monitor/userTodo',
        resetNodeUser: backend.workflowService + '/api/core/resetNodeUser'
      },
      height: sessionStore.get(VIEW_SIZE).height - 103,
      baseParams: {
        instanceId: '',
        nodeId: ''
      },
      UserSelect: {
        showUserDialog: false,
        userUrl: backend.workflowService + '/api/org/users',
        Users: [],
        SelectUsers: []
      },
      title: 'reset',
      pagesize: 10,
      currentPage: 1,
      total: 0
    };
  },
  computed: {
    ...mapGetters(['orgCode'])
  },
  methods: {
    customRowOp: function (scope, op) {
      // 表格操作按钮事件
      var _this = this; // 当前行号：scope.$index 当前行数据：scope.row 当前列对象：scope.column
      // this.$alert('你现在正在操作：' + op + '当前行ID值为：' + scope.row.flowId, '提示');


      if (op == 'RESET') {
        _this.title == 'reset';
        _this.baseParams.instanceId = scope.row.instanceId;
        _this.baseParams.nodeId = scope.row.nodeId;

        _this.getUserInfo();

        _this.UserSelect.showUserDialog = true;
      }
    },
    // 重置节点办理人
    getUserInfo: function () {
      var param = {
        orgId: this.orgCode,
        systemId: 'cmis',
        page: this.currentPage,
        size: this.pagesize
      };

      var _this = this;

      _this.$request({
        method: 'POST',
        data: param,
        url: _this.UserSelect.userUrl
      }).then(({code, message, data, total}) => {
        if (code == 0) {
          // 跳转到之前的页面
          if (data) {
            _this.total = total;
            _this.UserSelect.Users = data;
          } else {
            _this.$message({
              message: _this.$t('wfusermonitor.msguserlistnull'),
              type: 'error',
              duration: 4000
            });
          }
        } else {
          _this.$message({
            message: _this.$t('wfusermonitor.msguserlisterror') + message,
            type: 'error',
            duration: 6000
          });
        }
      })
    },
    // 人员选择弹框
    submitbefore: function () {
      this.UserSelect.Users = [];
      this.UserSelect.SelectUsers = [];
      this.$nextTick(function () {
        this.$refs.UserTableRef.clearSelection();
      });
      this.currentPage = 1;
      this.pagesize = 10;
      this.total = 0;
    },
    RowDbClick: function (row, event) {
      var user = {
        userId: row.userId,
        userName: row.userName
      };

      if (this.UserSelect.SelectUsers == undefined) {
        this.$set(this.UserSelect, 'SelectUsers', []);
      }

      var userInfosT = this.UserSelect.SelectUsers;

      for (var i = 0; i < userInfosT.length; i++) {
        // 去重
        if (userInfosT[i].userId == row.userId) {
          return;
        }
      }

      userInfosT.push(user);
    },
    // 页签关闭
    TagClose: function (tag) {
      if (this.UserSelect.SelectUsers == undefined) {
        this.$set(this.UserSelect, 'SelectUsers', []);
      }

      var userInfosT = this.UserSelect.SelectUsers;
      userInfosT.splice(userInfosT.indexOf(tag), 1);
    },
    UserDialogClose: function () {
      var userName = '';
      var userId = '';

      // if (this.UserSelect.SelectUsers == undefined) {
      //   this.$set(this.UserSelect, 'SelectUsers', []);
      // }

      var userInfosT = this.$refs.UserTableRef.selections;

      for (var i = 0; i < userInfosT.length; i++) {
        userId += userInfosT[i].userId;
        userName = userName + userInfosT[i].userName + ';';
      }

      var _this = this;

      var param = {
        instanceId: _this.baseParams.instanceId,
        nodeId: _this.baseParams.nodeId,
        userId: userId
      };

      _this.$confirm(_this.$t('wfusermonitor.msgsurereset'), _this.$t('wfusermonitor.tip'), {
        confirmButtonText: _this.$t('wfbutton.sure'),
        cancelButtonText: _this.$t('wfbutton.cancel'),
        type: 'warning',
        center: true
      }).then(function () {
        _this.$nextTick(function () {
          _this.UserSelect.showUserDialog = false;
          _this.$request({
            method: 'POST',
            data: param,
            url: _this.urls.resetNodeUser
          }).then(({code, message, data}) => {
            if (code == 0) {
              _this.$message({
                message: data.tip + ';',
                type: 'success',
                duration: 6000
              });

              _this.searchFn();
            } else {
              _this.$message({
                message: _this.$t('wfusermonitor.msgreseterror') + message,
                type: 'error',
                duration: 6000
              });
            }
          })
        });
      }).catch(function () {
        _this.$message({
          message: _this.$t('wfusermonitor.msgcancel'),
          type: 'info',
          duration: 2000
        });
      });
    },
    CurrentChange: function (cpage) {
      this.currentPage = cpage;
      this.getUserInfo();
    },
    SizeChange: function (psize) {
      this.pagesize = psize;
      this.getUserInfo();
    },
    searchFn: function () {
      var _this = this;
      _this.$refs.searchForm.validate(function(valid) {
        if (valid) {
          var model = _this.$refs.searchForm.formdata;
          var params = {
            flowName: model.flowName ? '%' + model.flowName + '%' : "",
            userName: model.userName ? '%' + model.userName + '%' : "",
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
    }
  }

}
</script>
<style scoped>
  .box-card {
    margin-bottom: 20px;
  }
</style>
