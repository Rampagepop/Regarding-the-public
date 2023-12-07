
<template>
  <div>
    <yu-panel :title="$t('wfbiz.title1')" class="adjust-height" show-search-input :placeholder="$t('wfbiz.biztype')" @search="fuzzyQuery" no-padding-top>
      <template slot="right">
        <yu-toolBar>
          <yu-button @click="addFn">{{ $t('wfbutton.add') }}</yu-button>
          <yu-button @click="bizOrgFn">{{ $t('wfbiz.buttonbizorg') }}</yu-button>
        </yu-toolBar>
      </template>
      <template slot="filter">
        <yu-xform v-model="formdata" related-table-name="reftable" ref="searchForm" form-type="search" :custom-search-fn="searchFn" @form-reset="resetFn">
          <yu-xform-group :column="4">
            <yu-xform-item :label="$t('wfbiz.biztype')" :placeholder="$t('wfbiz.biztype')" ctype="input" name="bizType"></yu-xform-item>
            <yu-xform-item :label="$t('wfbiz.flowsign')" :placeholder="$t('wfbiz.flowsign')" ctype="num" name="flowSign"></yu-xform-item>
            <yu-xform-item :label="$t('wfbiz.flowname')" :placeholder="$t('wfbiz.flowname')" ctype="input" name="flowName"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <yu-xtable :data-url="urls.index" row-number ref="reftable" request-type="POST" :base-params="baseParams">
        <yu-xtable-column prop="bizType" :label="$t('wfbiz.biztype')"></yu-xtable-column>
        <yu-xtable-column prop="ext" :label="$t('wfbiz.ext')"></yu-xtable-column>
        <yu-xtable-column prop="flowSign" :label="$t('wfbiz.flowsign')"></yu-xtable-column>
        <!--yu-xtable-column prop="flowId" :label="$t('wfbiz.flowid')"></yu-xtable-column>
        <yu-xtable-column-- prop="flowVersion" :label="$t('wfbiz.flowver')"></yu-xtable-column-->
        <yu-xtable-column prop="flowName" :label="$t('wfbiz.flowname')"></yu-xtable-column>
        <yu-xtable-column prop="pageUrl" :label="$t('wfbiz.pageurl')"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfbiz.option')" fixed="right" width="150px">
          <template slot-scope="scope">
            <yu-button-drop :show-length="2" type="text">
              <yu-button @click="customRowOp(scope, 'new')" type="text">{{ $t('wfbiz.config') }}</yu-button>
              <yu-button @click="customRowOp(scope, 'openBizNode')" type="text">{{ $t('wfbiz.nodeconfig') }}</yu-button>
              <yu-button @click="modifyFn(scope.row)" type="text">{{ $t('wfbutton.edit') }}</yu-button>
              <yu-button @click="deleteFn(scope.row)" type="text">{{ $t('wfbutton.delete') }}</yu-button>
            </yu-button-drop>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <!--业务配置新增弹框-->
    <el-dialog-x :title="$t('wfbiz.title2')" :visible.sync="newdialogVisible" width="750px" class="overflow: no;">
      <yu-xform ref="reform" label-width="130px" v-model="reformData" :rules="formRules">
        <yu-xform-group :column="2">
          <yu-xform-item :label="$t('wfbiz.biztype')" :placeholder="$t('wfbiz.biztype')" ctype="input" name="bizType" :disabled="bizTypeDiasbled"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.ext')" :placeholder="$t('wfbiz.ext')" ctype="input" name="ext"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.gllc')" :placeholder="$t('wfbiz.icon')" ref="readonlyInput" ctype="num" name="flowSign" @click="clickFn" icon="search" :readonly="true"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.flowname')" :placeholder="$t('wfbiz.flowname')" ctype="input" name="flowName" :disabled="true"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.flowid')" :placeholder="$t('wfbiz.flowname')" ctype="input" name="flowId" :hidden="true"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.flowver')" :placeholder="$t('wfbiz.flowname')" ctype="input" name="flowVersion" :hidden="true"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.orgid')" :placeholder="$t('wfbiz.flowname')" ctype="input" name="orgId" :hidden="true"></yu-xform-item>
        </yu-xform-group>
        <yu-xform-group :column="1">
          <yu-xform-item :label="$t('wfbiz.pageurl')" :placeholder="$t('wfbiz.pageurl')" ctype="input" name="pageUrl"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.extconfig')" :placeholder="$t('wfbiz.extconfig')" ctype="input" name="bizParam1"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="sureAdd">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="newdialogVisible = false">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog-x>
    <!--业务配置修改弹框-->
    <el-dialog-x :title="$t('wfbiz.title3')" :visible.sync="editdialogVisible" width="750px">
      <yu-xform ref="editform" label-width="130px" v-model="editformData" :rules="formRules">
        <yu-xform-group :column="2">
          <yu-xform-item :label="$t('wfbiz.biztype')" :placeholder="$t('wfbiz.biztype')" ctype="input" name="bizType" :disabled="true"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.ext')" :placeholder="$t('wfbiz.ext')" ctype="input" name="ext" :disabled="false"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.gllc')" :placeholder="$t('wfbiz.gllc')" ctype="num" name="flowSign" :disabled="true"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.flowname')" :placeholder="$t('wfbiz.flowname')" ctype="input" name="flowName" :disabled="true"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.flowid')" :placeholder="$t('wfbiz.flowid')" ctype="input" name="flowId" :hidden="true"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.flowver')" :placeholder="$t('wfbiz.flowver')" ctype="input" name="flowVersion" :hidden="true"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.orgid')" :placeholder="$t('wfbiz.orgid')" ctype="input" name="orgId" :hidden="true"></yu-xform-item>
        </yu-xform-group>
        <yu-xform-group :column="1">
          <yu-xform-item :label="$t('wfbiz.pageurl')" :placeholder="$t('wfbiz.pageurl')" ctype="input" name="pageUrl"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.extconfig')" :placeholder="$t('wfbiz.extconfig')" ctype="input" name="bizParam1"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="sureModify">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="editdialogVisible = false">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog-x>

    <!--流程业务关联节点详情框-->
    <el-dialog-x :title="$t('wfbiz.title6')" :visible.sync="bizNodedialogVisible" width="800px">
      <yu-button-drop class="config_button">
        <el-button @click="newBizNodeConfig">{{ $t('wfbutton.add') }}</el-button>
        <el-button @click="deleteBizNodeConfig">{{ $t('wfbutton.delete') }}</el-button>
      </yu-button-drop>
      <yu-xtable ref="bizNodeTable" :data-url="urls.bizNode" request-type="POST" :base-params="bizNodeParams" show-hidden-menu>
        <yu-xtable-column :label="$t('wfbiz.nodeid')" prop="nodeId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfbiz.nodename')" prop="nodeName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfbiz.pageurl')" prop="pageUrl" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfbiz.flowid')" prop="flowId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfbiz.biztype')" prop="bizType" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfbiz.biztypeext')" prop="ext" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfbiz.option')" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="customRowOp(scope,'config')">{{ $t('wfbutton.config') }}</el-button>
          </template>
        </yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="bizNodedialogVisible = false">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="refreshBizNodeConfig">{{ $t('wfbutton.refresh') }}</el-button>
      </div>
    </el-dialog-x>
    <!--业务关联节点配置弹框-->
    <el-dialog-x :title="viewTitle[configType]" :visible.sync="configdialogVisible" width="750px">
      <yu-xform ref="configform" label-width="130px" v-model="configformData" :rules="formRules">
        <yu-xform-group :column="2">
          <yu-xform-item :label="$t('wfbiz.biztype')" :placeholder="$t('wfbiz.biztype')" ctype="input" name="bizType" :disabled="true"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.flowsign')" :placeholder="$t('wfbiz.flowsign')" ctype="num" name="flowSign" :disabled="true"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.nodeid')" :placeholder="$t('wfbiz.nodeid')" ctype="input" name="nodeId" @click="nodeClickFn" icon="search" :disabled="nodeSelectDisabled" :readonly="!nodeSelectDisabled"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.nodename')" :placeholder="$t('wfbiz.nodename')" ctype="input" name="nodeName" :disabled="true"></yu-xform-item>
        </yu-xform-group>
        <yu-xform-group :column="1">
          <yu-xform-item :label="$t('wfbiz.pageurl')" :placeholder="$t('wfbiz.pageurl')" ctype="input" name="pageUrl"></yu-xform-item>
          <yu-xform-item :label="$t('wfbiz.extconfig')" :placeholder="$t('wfbiz.extconfig')" ctype="input" name="bizNodeParam1"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <!-- <el-form-x ref="configform" :group-fields="configFields" label-width="80px"></el-form-x> -->
      <div slot="footer" align="center">
        <el-button type="primary" @click="sureConfig">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="configdialogVisible = false">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog-x>

    <!--流程标识及名称选取框-->
    <el-dialog-x :title="$t('wfbiz.title4')" :visible.sync="flowdialogVisible" height="360px" width="750px">
      <yu-xform ref="search" v-model="searchFormdata" related-table-name="flowList" class="el-form-search">
        <yu-xform-group :column="3">
          <yu-xform-item :placeholder="$t('wfbiz.flowsign')" ctype="num" name="flowSign"></yu-xform-item>
          <yu-xform-item :placeholder="$t('wfbiz.flowname')" ctype="input" name="flowName"></yu-xform-item>
          <div slot="custom" class="btn-group">
            <yu-button-group>
              <yu-button type="primary" icon="search" @click="formQsearchFn">{{ $t('wfbutton.search') }}</yu-button>
              <yu-button type="primary" icon="edit" @click="formQresetFn">{{ $t('wfbutton.reset') }}</yu-button>
            </yu-button-group>
          </div>
        </yu-xform-group>
      </yu-xform>
      <!-- <el-form-q ref="search" form="queryflow" :field-data="queryflowFileds" search-table="flowList" :buttons="flowButtons"></el-form-q> -->
      <yu-xtable ref="flowList" :data-url="urls.getFlowUrl" request-type="POST" :base-params="flowParams">
        <yu-xtable-column :label="$t('wfbiz.flowname')" prop="flowName" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfbiz.flowsign')" prop="flowSign" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfbiz.flowid')" prop="flowId" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfbiz.flowver')" prop="flowVersion" :resizable="true" align="center"></yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="returnflow">{{ $t('wfbutton.xqfh') }}</el-button>
      </div>
    </el-dialog-x>
    <!--节点ID及名称选取框-->
    <el-dialog-x :title="$t('wfbiz.title5')" :visible.sync="nodedialogVisible" width="750px">
      <yu-xtable ref="nodeTable" request-type="POST" :data-url="urls.getNodeUrl" :pageable="true" :base-params="nodeParams" :default-load="false">
        <yu-xtable-column :label="$t('wfbiz.nodeid')" prop="nodeId" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfbiz.nodename')" prop="nodeName" :resizable="true" align="center"></yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="returnNode">{{ $t('wfbutton.xqfh') }}</el-button>
      </div>
    </el-dialog-x>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { validator } from '@/utils/validate'
import { sessionStore, extend } from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
export default {
  data: function () {
    var _this = this;
    return {
      configformData: {},
      editformData: {},
      reformData: {},
      searchFormdata: {},
      formdata: {},
      urls: {
        index: backend.workflowService + '/api/biz/query',
        create: backend.workflowService + '/api/biz/create',
        update: backend.workflowService + '/api/biz/update',
        batchdelete: backend.workflowService + '/api/biz/delete',
        bizNode: backend.workflowService + '/api/biz/node/query',
        bizNodeCreate: backend.workflowService + '/api/biz/node/create',
        bizNodeUpdate: backend.workflowService + '/api/biz/node/update',
        bizNodeDelete: backend.workflowService + '/api/biz/node/delete',
        getFlowUrl: backend.workflowService + '/api/nwfflow/query',
        getNodeUrl: backend.workflowService + '/api/biz/allnode/'
      },
      formRules: {
        flowSign: [{required: true, message: this.$t('wfbiz.msgselectflow')}],
        bizType: [
          {required: true, message: this.$t('wfbiz.msgqsrywlxbsf'), trigger: 'blur'},
          {max: 30, message: this.$t('wfbiz.msgcdxz30')},
          {validator: validator.speChar}
        ],
        ext: [
          {required: true, message: this.$t('wfbiz.msgqsryelxbthzms'), trigger: 'blur'},
          {max: 60, message: this.$t('wfbiz.msgcdxz60')},
          {validator: validator.speChar}
        ],
        pageUrl: [{required: true, message: this.$t('wfbiz.msgconfigpage'), trigger: 'blur'},
          {max: 60, message: this.$t('wfbiz.msgcdxz60')},
          {
            validator: function (rule, value, callback) {
              var reg = /[\u4E00-\u9FA5]/;
              if (value && reg.test(value)) {
                callback(new Error(this.$t('wfbiz.msgnochzn')));
              } else {
                callback();
              }
            }
          }],
        nodeId: [{required: true, message: this.$t('wfbiz.msgselectflow')}]
      },
      queryflow: {
        flowId: '',
        flowName: ''
      },
      flowParams: {
        flowState: 'R'
      },
      baseParams: {sort: "biz_type desc"},
      nodeParams: {},
      bizNodeParams: {},
      height: sessionStore.get(VIEW_SIZE).height - 103,
      newdialogVisible: false,
      editdialogVisible: false,
      configdialogVisible: false,
      flowdialogVisible: false,
      viewType: 'ADD',
      title: 'EDIT',
      configType: 'NEWCONFIG',
      viewTitle: {
        // 弹框类型以及对应标题
        BIZNODE: this.$t('wfbiz.title6'),
        NEWCONFIG: this.$t('wfbiz.title7'),
        CONFIG: this.$t('wfbiz.title8')
      },
      nodedialogVisible: false,
      bizNodedialogVisible: false,
      bizModel: {},
      bizTypeDiasbled: false,
      nodeSelectDisabled: false
    };
  },
  computed: {
    ...mapGetters([
      'org'
    ])
  },
  created() {
    const _this = this;
  },
  methods: {
    formQsearchFn() {
      var _this = this;
      _this.$refs.search.validate(function(valid) {
        if (valid) {
          var params = {};
          params.flowState = "R";
          params.flowSign = _this.searchFormdata.flowSign;
          if (_this.searchFormdata.flowName) {
            params.flowName = '%' + _this.searchFormdata.flowName + '%';
          }
          var param = {
            condition: JSON.stringify(params)
          };
          _this.$refs.flowList.remoteData(params);
        } else {
          return;
        }
      });
    },
    formQresetFn() {
      this.$refs.search.resetFields();
      this.$refs.flowList.remoteData();
    },
    clickFn: function () {
      this.$refs.readonlyInput.$refs.readonlyInput.focus();
      console.log(this.$refs.readonlyInput);
      this.title = 'FLOW';
      this.flowdialogVisible = true;
      this.$nextTick(function () {
        this.$refs.search.resetFields();
        this.$refs.flowList.remoteData({});
      });
    },
    customRowOp: function (scope, op) {
      // 表格操作按钮事件
      var _this = this; // 当前行号：scope.$index
      // 当前行数据：scope.row
      // 当前列对象：scope.column
      // this.$alert('你现在正在操作：' + op + '当前行ID值为：' + scope.row.flowId, _this.$t('wfbiz.tip'));
      if (op == 'config') {
        // 业务关联节点配置
        _this.configType = 'CONFIG';
        _this.configdialogVisible = true;
        _this.nodeSelectDisabled = true;

        _this.$nextTick(function () {
          _this.$refs.configform.resetFields();
          _this.configformData.flowSign = this.bizModel.flowSign;
          extend(_this.configformData, scope.row);
          _this.configformData.flowSign = _this.bizModel.flowSign;
        });
      } else if (op == 'openBizNode') {
        // 打开业务关联节点配置详情页
        _this.viewType = 'BIZNODE';
        _this.bizModel = scope.row;
        _this.bizNodeParams = {
          bizType: scope.row.bizType,
          flowId: scope.row.flowId
        };
        _this.bizNodedialogVisible = true;
      } else if (op == 'new') {
        // 新增业务类型关联配置
        _this.viewType = 'ADD';
        _this.newdialogVisible = true;
        _this.bizTypeDiasbled = true;
        _this.$nextTick(function () {
          _this.$refs.reform.resetFields();
          _this.reformData.bizType = scope.row.bizType;
          _this.reformData.ext = scope.row.ext;
          _this.reformData.pageUrl = scope.row.pageUrl;
        });
      }
    },
    addFn: function () {
      var _this = this;
      _this.viewType = 'ADD';
      _this.bizTypeDiasbled = false;
      _this.newdialogVisible = true;

      _this.$nextTick(function () {
        _this.$refs.reform.resetFields();
      });
    },
    sureAdd: function () {
      // 新增业务类型并关联流程
      var _this = this;
      var model = _this.reformData;
      _this.$refs.reform.validate(function (valid) {
        if (!valid) {
          _this.$message({
            duration: 4000,
            message: _this.$t('wfbiz.msginputillegal'),
            type: 'warning'
          });
          return;
        }
        model.orgId = _this.org.code;
        _this.$request({
          method: 'POST',
          url: _this.urls.create,
          data: model
        }).then(({code, message, data}) => {
          if (code == 0) {
            _this.$refs.reftable.remoteData();
            _this.$message({ message: _this.$t('wfbiz.msgsddsuccess'), type: 'success' });
            _this.newdialogVisible = false;
          } else {
            _this.$message({
              duration: 4000,
              message: message ? message.substring(0, 100) : _this.$t('wfbiz.msgadderror'),
              type: 'error'
            });
          }
        })

      });
    },
    modifyFn (row) {
      // 修改业务类型关联流程配置
      this.viewType = 'EDIT';
      this.editdialogVisible = true;
      this.$nextTick(function () {
        extend(this.editformData, row);
      });
    },
    sureModify: function () {
      var _this = this;
      var model = _this.editformData;
      _this.$refs.editform.validate(function (valid) {
        if (!valid) {
          _this.$message({
            duration: 4000,
            message: _this.$t('wfbiz.msginputillegal'),
            type: 'warning'
          });
          return;
        }
        model.orgId = _this.org.code;
        _this.$request({
          method: 'POST',
          url: _this.urls.update,
          data: model
        }).then(({code, message, data}) => {
          if (code == 0) {
            _this.searchFn();
            _this.$refs.editform.resetFields();
            _this.$message({
              duration: 4000,
              message: _this.$t('wfbiz.msgeditsuccess'),
              type: 'success'
            });
            _this.editdialogVisible = false;
          } else {
            _this.$message({
              duration: 4000,
              message: message ? message : _this.$t('wfbiz.msgediterror'),
              type: 'error'
            });
          }
        })
      });
    },
    deleteFn (row) {
      // 删除业务类型相关配置
      var _this = this;
      _this.$confirm(_this.$t('wfbiz.msgsuredelete'), _this.$t('wfbiz.tip'), {
        confirmButtonText: _this.$t('wfbutton.sure'),
        cancelButtonText: _this.$t('wfbutton.cancel'),
        type: 'warning',
        center: true
      }).then(function () {
        _this.$request({
          method: 'POST',
          url: _this.urls.batchdelete,
          data: {bizType: row.bizType, flowSign: row.flowSign}
        }).then(({code, message, data}) => {
          if (code == 0) {
            _this.searchFn();
            _this.$message({
              duration: 4000,
              message: _this.$t('wfbiz.msgdelsucess'),
              type: 'success'
            });
          } else {
            _this.$message({
              duration: 4000,
              message: message ? message.substring(0, 100) : _this.$t('wfbiz.msgdelerror'),
              type: 'error'
            });
          }
        });
      }).catch(e => {});
    },
    newBizNodeConfig: function () {
      var _this = this;
      _this.configType = 'NEWCONFIG';
      _this.configdialogVisible = true;
      _this.nodeSelectDisabled = false;
      _this.$nextTick(function () {
        _this.$refs.configform.resetFields();
        extend(_this.configformData, _this.bizModel);
      });
    },
    nodeClickFn: function () {
      this.title = 'NODE';
      if (this.configType == 'CONFIG') {
        return;
      }
      this.nodedialogVisible = true;
      this.$nextTick(function () {
        // this.$refs.nodeTable.remoteData();
        this.nodeParams = {
          flowSign: this.bizModel.flowSign
          // flowId: scope.row.flowId
        };
      });
    },
    sureConfig: function () {
      var _this = this;

      var param = _this.configformData;
      var url = _this.urls.bizNodeUpdate;
      var Message = _this.$t('wfbiz.msgnodeedit');

      if (_this.configType == 'NEWCONFIG') {
        url = _this.urls.bizNodeCreate;
        Message = _this.$t('wfbiz.msgnodeconfig');
      }

      _this.$refs.configform.validate(function (valid) {
        if (valid) {
          // 查询当前节点是否已被关联
          var params = {
            bizType: param.bizType,
            flowId: param.flowId,
            nodeId: param.nodeId
          }
          _this.$request({
            method: 'POST',
            url: backend.workflowService + '/api/biz/node/index',
            data: params
          }).then(({code, message, data}) => {
            if (code == 0 && data && data.nodeId && _this.configType == 'NEWCONFIG') {
              _this.$message({
                duration: 4000,
                message: _this.$t('wfbiz.msggjdybgl'),
                type: 'error'
              });
            } else {
              _this.$request({
                method: 'POST',
                url: url,
                data: param
              }).then(({code, message, data}) => {
                if (code == 0) {
                  _this.$refs.bizNodeTable.remoteData();

                  _this.$message({
                    duration: 4000,
                    message: Message,
                    type: 'success'
                  });

                  _this.configdialogVisible = false;
                } else {
                  _this.$message({
                    duration: 4000,
                    message: message ? message.substring(0, 100) : _this.$t('wfbiz.msgnodeerror'),
                    type: 'error'
                  });
                }
              })
            }
          })

        } else {
          _this.$message({
            duration: 4000,
            message: _this.$t('wfbiz.msginputillegal'),
            type: 'warning'
          });
        }
      });
    },
    deleteBizNodeConfig: function () {
      if (this.$refs.bizNodeTable.selections.length !== 1) {
        this.$message({
          duration: 4000,
          message: this.$t('wfbiz.msgselectone'),
          type: 'warning'
        });
        return false;
      }

      var _this = this;

      var row = _this.$refs.bizNodeTable.selections[0];

      _this.$confirm(_this.$t('wfbiz.msgsuredelete'), _this.$t('wfbiz.tip'), {
        confirmButtonText: _this.$t('wfbutton.sure'),
        cancelButtonText: _this.$t('wfbutton.cancel'),
        type: 'warning',
        center: true
      }).then(function () {
        var param = {
          bizType: row.bizType,
          flowId: row.flowId,
          nodeId: row.nodeId
        }
        _this.$request({
          method: 'POST',
          url: _this.urls.bizNodeDelete,
          data: param
        }).then(({code, message, data}) => {
          if (code == 0) {
            _this.$refs.bizNodeTable.remoteData();

            _this.$message({
              duration: 4000,
              message: _this.$t('wfbiz.msgdelsucess'),
              type: 'success'
            });
          } else {
            _this.$message({
              duration: 4000,
              message: message ? message.substring(0, 100) : _this.$t('wfbiz.msgdelerror'),
              type: 'error'
            });
          }
        })
      }).catch(e => {});
    },
    refreshBizNodeConfig: function () {
      if (this.bizModel != null) {
        this.$nextTick(function () {
          this.$refs.bizNodeTable.remoteData(this.bizNodeParams);
        });
      }
    },
    returnflow: function () {
      // 选取流程标识返回
      if (this.$refs.flowList.selections.length !== 1) {
        this.$message({
          duration: 4000,
          message: this.$t('wfbiz.msgselectone'),
          type: 'warning'
        });
        return;
      }
      this.$refs.readonlyInput.$refs.readonlyInput.focus();
      var row = this.$refs.flowList.selections[0];
      this.$nextTick(function () {
        this.reformData.flowSign = row.flowSign;
        this.reformData.flowVersion = row.flowVersion;
        this.reformData.flowId = row.flowId;
        this.reformData.flowName = row.flowName;
        this.flowdialogVisible = false;
      });
    },
    returnNode: function () {
      if (this.$refs.nodeTable.selections.length !== 1) {
        this.$message({
          duration: 4000,
          message: this.$t('wfbiz.msgselectone'),
          type: 'warning'
        });
        return;
      }
      var row = this.$refs.nodeTable.selections[0];
      this.$nextTick(function () {
        this.configformData.nodeId = row.nodeId;
        this.configformData.nodeName = row.nodeName;
        this.nodedialogVisible = false;
      });
    },
    searchFn: function () {
      var _this = this;
      _this.$refs.searchForm.validate(function(valid) {
        if (valid) {
          var model = _this.$refs.searchForm.formdata;
          var params = {
            bizType: model.bizType ? '%' + model.bizType + '%' : "",
            flowName: model.flowName ? '%' + model.flowName + '%' : "",
            flowSign: model.flowSign ? model.flowSign : ""
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
    /**
     * 快速查询
     * @param e 模糊查询关键字
     */
    fuzzyQuery: function(e) {
      var params = {
        bizType: e.value
      };
      this.$refs.reftable.remoteData(params);
      this.$refs.searchForm.resetFields(); // 清空精确查询查询参数
    },
    bizOrgFn: function() {
      var routeId = "biz_org_" + Date.now;
      var path = '/workflow/studio/config/nwfbizorg';
      var title = this.$t('wfbiz.buttonbizorg');
      this.$router.addRoute(path, title, {noCache: true}, path); // 第三个参数meta详情见VUE官方的router参数
      this.$router.push({name: path});
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-form-search .el-form-item {
    padding-right: 10px;
  }
  .config_button {
    float: right;
    margin-bottom: 20px;
  }
</style>
