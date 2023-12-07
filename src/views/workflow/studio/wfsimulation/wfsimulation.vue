
<template>
  <div>
    <yu-panel :title="$t('wfsimulate.title1')" :collapse-hide="false">
      <yu-xform v-model="formdata" related-table-name="reftable" ref="searchForm" label-width="110px" form-type="search" :custom-search-fn="searchFn" :custom-reset-fn="resetFn">
        <yu-xform-group :column="4">
          <yu-xform-item :label="$t('wfsimulate.flowname')" :placeholder="$t('wfsimulate.flowname')" ctype="input" name="flowName"></yu-xform-item>
          <yu-xform-item :label="$t('wfsimulate.flowid')" :placeholder="$t('wfsimulate.flowid')" ctype="num" name="flowId"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <yu-xtable ref="reftable" :row-index="true" request-type="POST" :base-params="baseParams" :data-url="urls.index" show-hidden-menu>
        <yu-xtable-column :label="$t('wfsimulate.flowname')" prop="flowName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfsimulate.flowid')" prop="flowId" :resizable="true" :hide-column="false"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfsimulate.flowadmin')" prop="flowAdmin" :resizable="true" :hide-column="false"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfsimulate.updatetime')" prop="startTime" :resizable="true" :hide-column="false"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfsimulate.flowsign')" prop="flowSign" :resizable="true" :hide-column="false"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfsimulate.option')" width="200" fixed="right">
          <template slot-scope="scope">              
            <el-button type="text" @click="customRowOp(scope,'simu')">{{ $t('wfsimulate.start') }}</el-button>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <div class="panal_b"></div>
    <yu-panel :title="$t('wfsimulate.title2')" :collapse-hide="false">
      <el-table ref="logtable" :data="DoneNodes.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width:100%;">
        <el-table-column prop="startTime" :label="$t('wfsimulate.runtime')"></el-table-column>
        <el-table-column prop="nodeId" :label="$t('wfsimulate.nodeid')"></el-table-column>
        <el-table-column prop="nodeName" :label="$t('wfsimulate.nodename')"></el-table-column>
        <el-table-column prop="selectNode" :label="$t('wfsimulate.nextnode')"></el-table-column>
        <el-table-column prop="nextNodeName" :label="$t('wfsimulate.nodenamelist')"></el-table-column>
        <el-table-column prop="nextNode" :label="$t('wfsimulate.nodelist')"></el-table-column>
        <el-table-column prop="nodeSign" :label="$t('wfsimulate.routeresult')">
          <template slot-scope="scope">
            <span style="color:green" v-if="scope.row.nodeSign == 'success' ">{{ $t('wfsimulate.success') }}</span>
            <span style="color:orangered" v-if="scope.row.nodeSign == 'error' ">{{ $t('wfsimulate.error') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="SizeChange" @current-change="CurpageChange" :current-page="currentPage" :page-sizes="[20, 30, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="DoneNodes.length">
      </el-pagination>
    </yu-panel>

    <el-dialog-x :title="$t('wfsimulate.title3')" :visible.sync="dialogVisible" width="650px" @close="Close">
      <el-row :gutter="5" style="margin-top: 0px;margin-bottom: 20px;font-size: 14px;">
        <el-col :span="12" style="line-height: 36px;">{{ $t('wfsimulate.param') }}</el-col>
        <el-col :span="12">
          <el-row :gutter="10">
            <el-col :span="18" style="line-height: 36px;">{{ $t('wfsimulate.paramdemo') }}</el-col>
            <el-col :span="4" align="left">
              <el-button style="color:#2877ff" @click="click">{{ $t('wfsimulate.dw') }}</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-input type="textarea" :rows="6" :placeholder="$t('wfsimulate.msgparamtip')" v-model="inputParam"></el-input>
        </el-col>
        <el-col :span="12">
          <el-input type="textarea" disabled :rows="6" v-model="exampleParam" @click="click"></el-input>
        </el-col>
      </el-row>
      <div style="margin-top: 20px" align="right">
        <el-button type="primary" v-if="opType=='start'" @click="startFn">{{ $t('wfsimulate.start') }}</el-button>
        <el-button type="primary" v-if="opType=='submit'" @click="submitFn">{{ $t('wfsimulate.msgxyb') }}</el-button>
        <el-button type="primary" v-if="opType=='loding'" :loading="true">{{ $t('wfsimulate.msgfzjxz') }}</el-button>
        <el-button type="primary" v-if="opType=='close'" @click="Close">{{ $t('wfsimulate.msgckrz') }}</el-button>
      </div>
    </el-dialog-x>

    <el-dialog-x :title="$t('wfsimulate.title4')" :visible.sync="dialogVisibleNext" width="650px">
      <el-form ref="form" label-width="80px">
        <el-form-item v-for="node in NextNodes" :key="node.nodeId">
          <el-col :span="8">
            <el-radio v-model="agreeRadio" :label="node.nodeId">{{ node.nodeName }}</el-radio>
          </el-col>
        </el-form-item>
      </el-form>
      <div style="margin-top: 20px" align="center">
        <el-button type="primary" @click="returnNode">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="cancel">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog-x>
  </div>
</template>
<script>
import { sessionStore } from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
export default {
  data: function () {
    var _this = this;

    return {
      formdata: {},
      urls: {
        index: backend.workflowService + '/api/nwfflow/query',
        start: backend.workflowService + '/api/sim/start/',
        submit: backend.workflowService + '/api/sim/submit/'
      },
      baseParams: {
        flowName: '',
        flowId: '',
        flowState: 'R'
      },
      height: sessionStore.get(VIEW_SIZE).height - 103,
      dialogVisible: false,
      dialogVisibleNext: false,
      agreeRadio: '',
      inputParam: '',
      exampleParam: JSON.stringify({
        param1: "string1",
        param2: "string2",
        param3: "string3"
      }),
      opType: 'start',
      commonParam: {
        flowId: '',
        systemId: 'cmis'
      },
      extParam: {},
      NextNodes: [],
      nextNode: '',
      DoneNodes: [],
      startTime: '',
      currentPage: 1,
      pageSize: 20
    };
  },
  methods: {
    customRowOp: function (scope, op) {
      // 表格操作按钮事件
      var _this = this; // 当前行号：scope.$index
      // 当前行数据：scope.row
      // 当前列对象：scope.column
      // this.$alert('你现在正在操作：' + op + '当前行ID值为：' + scope.row.flowId, '提示');


      if (op == 'simu') {
        _this.DoneNodes = [];

        _this.getdate();

        _this.commonParam.flowId = scope.row.flowId;
        _this.commonParam.systemId = scope.row.systemId;
        _this.opType = 'start';
        _this.dialogVisible = true;
      }
    },
    checkRoute: function (nodes) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeSign == 'error') {
          this.$message({
            duration: 4000,
            message: this.$t('wfsimulate.msgczlycwsfjx'),
            type: 'warning'
          });
          nodes[i].nodeName = nodes[i].nodeName + this.$t('wfsimulate.msglycwktg');

          if (this.DoneNodes.length > 0) {
            var k = this.DoneNodes.length - 1;
            this.DoneNodes[k].nextNode = nodes[i].nodeId + ';';
            this.DoneNodes[k].nextNodeName = nodes[i].nodeName + ';';
            this.DoneNodes[k].selectNode = nodes[i].nodeId;
            this.DoneNodes[k].nodeSign = nodes[i].nodeSign;
          }

          this.dialogVisibleNext = true;
          return;
        }
      }

      if (nodes.length > 1) {
        this.opType = 'submit';
        this.dialogVisibleNext = true;
      } else {
        this.nextNode = nodes[0].nodeId;
        this.setNodes(nodes);
        this.submitFn();
      }
    },
    setNodes: function (nodes) {
      // 多个节点
      var nodeIds = '';
      var nodeNames = '';
      var nodeSign = '';
      var nodeType = '';
      var node = {
        nodeId: this.nextNode,
        nodeName: '',
        nodeSign: '',
        nextNode: '',
        nextNodeName: '',
        selectNode: '',
        startTime: this.startTime
      };

      for (var k = 0; k < nodes.length; k++) {
        nodeIds += nodes[k].nodeId + ';';
        nodeNames += nodes[k].nodeName + ';';

        if (this.nextNode == nodes[k].nodeId) {
          nodeSign = nodes[k].nodeSign;
          node.nodeName = nodes[k].nodeName;
          nodeType = nodes[k].nodeType;
        }
      }

      if (this.DoneNodes.length > 0) {
        var i = this.DoneNodes.length - 1;
        this.DoneNodes[i].nextNode = nodeIds;
        this.DoneNodes[i].nextNodeName = nodeNames;
        this.DoneNodes[i].selectNode = this.nextNode;
        this.DoneNodes[i].nodeSign = nodeSign;
      }

      if (nodeType != 'E') {
        this.DoneNodes.push(node);
      } else {
        this.nextNode = '';
      }
    },
    startFn: function () {
      // 发起流程
      var _this = this;

      _this.getdate();

      if (_this.inputParam != '') {
        try{
          if (typeof JSON.parse(_this.inputParam) != 'object') {
            throw new Error(_this.$t('wfsimulate.msgparamillegal'));
          } 
          _this.extParam = JSON.parse(_this.inputParam);
        } catch (e) {
          _this.$message(_this.$t('wfsimulate.msgparamerror'))
          return
        }
      }
      
      var param = _this.commonParam;
      _this.$request({
        method: 'POST',
        url: _this.urls.start,
        data: param
      }).then(({code, message, data}) => {
        if (code == 0) {
          if (data != null) {
            var nodes = data;
            _this.NextNodes = nodes;

            _this.checkRoute(nodes);

            _this.dialogVisible = false;
          } else {
            _this.$message({
              duration: 4000,
              message: _this.$t('wfsimulate.msgwzdlcjdxx'),
              type: 'warning'
            });
          }
        } else {
          _this.$message({
            duration: 4000,
            message: _this.$t('wfsimulate.msgstartfail') + message,
            type: 'error'
          });
        }
      })
    },
    submitFn: function () {
      // 开始仿真
      var _this = this;

      _this.getdate();

      _this.opType = 'loding';

      if (_this.nextNode == null || _this.nextNode == '') {
        return;
      }

      var param = {
        nodeId: _this.nextNode,
        param: _this.extParam
      };
      _this.$request({
        method: 'POST',
        url: _this.urls.submit,
        data: param
      }).then(({code, message, data}) => {
        if (code == 0) {
          if (data != null) {
            var nodes = data;
            _this.NextNodes = nodes;

            _this.checkRoute(nodes);

            if (nodes[0].nodeType == 'E') {
              _this.opType = 'close';

              _this.$message({
                duration: 4000,
                message: _this.$t('wfsimulate.msgsimsuccess'),
                type: 'success'
              });
            }
          } else {
            _this.DoneNodes.length = _this.DoneNodes.length - 1;
          }
        } else {
          _this.$message({
            duration: 4000,
            message: _this.$t('wfsimulate.msgsimfail') + message,
            type: 'error'
          });
        }
      })
    },
    returnNode: function () {
      // 选取下一节点方法
      if (this.agreeRadio != '') {
        this.nextNode = this.agreeRadio;
        this.agreeRadio = '';
        this.setNodes(this.NextNodes);
      } else {
        this.$message({
          duration: 4000,
          message: this.$t('wfsimulate.msgselectnext'),
          type: 'warning'
        });
        return false;
      }

      if (this.nextNode != '') {
        this.submitFn();
      }

      this.dialogVisibleNext = false;
    },
    cancel: function () {
      this.dialogVisibleNext = false;
    },
    Close: function () {
      // 弹框关闭处理事件
      this.inputParam = [];
      this.dialogVisible = false;
    },
    click: function () {
      // 路由参数示例格式复用
      var _this = this;

      _this.inputParam = _this.exampleParam;
    },
    getdate: function () {
      // 获取当前时间并转化格式为yyyy-mm-dd hh:mm:ss
      var d = new Date();
      var year = d.getFullYear();
      var month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
      var date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
      var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
      var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
      var seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
      var myWant = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds;
      this.startTime = myWant;
    },
    SizeChange: function (val) {
      // 分页-页面大小改变响应事件
      this.pageSize = val;
    },
    CurpageChange: function (val) {
      // 分页-当前页面改变响应事件
      this.currentPage = val;
    },
    searchFn: function () {
      var _this = this;
      _this.$refs.searchForm.validate(function(valid) {
        if (valid) {
          var model = _this.$refs.searchForm.formdata;
          var params = {
            flowState: 'R',
            flowName: model.flowName ? '%' + model.flowName + '%' : "",
            flowId: model.flowId ? model.flowId : ""
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
  .panal_b {
    height: 24px;
    background-color: #F2F2F2;
  }
</style>