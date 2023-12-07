<template>
  <div>
    <el-input
      v-model="selectedVal"
      readonly
      :placeholder="placeholder"
      :disabled="disabled"
      :size="size"
      :name="name"
      :icon="icon"
      :on-icon-click="onIconClickFn"
      @click.native="clickFn"
    >
    </el-input>
    <el-dialog-x
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      @open="dialogOpen"
    >
      <el-row>
        <el-button-group align="right" style="margin-bottom: 10px;">
          <el-button type="primary" @click="bizParamDialogOpen()">{{ $t('wfnodescript.param') }}</el-button>
          <el-button type="primary" @click="configDialogOpen()">{{ $t('wfnodescript.routescript') }}</el-button>
          <!--el-button type="primary" @click="shuffleDialogOpen()">规则引擎配置</el-button-->
        </el-button-group>
      </el-row>
      <el-row>
        <el-col>
          <el-input type="textarea" :rows="10" v-model="nodeScript" limitChar=""> </el-input>
        </el-col>
      </el-row>
      <div style="margin-top: 20px" slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">{{ $t('wfnodescript.sure') }}</el-button>
        <el-button @click="afterClose">{{ $t('wfnodescript.cancel') }}</el-button>
      </div>
    </el-dialog-x>
    <!-- 路由条件配置弹窗 -->
    <el-dialog-x :title="dialogTitle" :visible.sync="configDialogVisible">
      <div>
        <yu-xform ref="refFormDemo" v-model="formdata" :rules="configRules">
          <yu-xform-group :column="4">
            <yu-xform-item :placeholder="$t('wfnodescript.logic')" ctype="select" :options="logics" name="logic"></yu-xform-item>
            <yu-xform-item :placeholder="$t('wfnodescript.varid')" ctype="input" name="varName" icon="search" @click="openParamSelectDialog" clearable></yu-xform-item>
            <yu-xform-item :placeholder="$t('wfnodescript.relation')" ctype="select" :options="relations" name="relation" @change="relactionChange"></yu-xform-item>
            <yu-xform-item :placeholder="$t('wfnodescript.type')" ctype="input" name="varType" hidden></yu-xform-item>
            <yu-xform-item :placeholder="$t('wfnodescript.value')" ctype="input" name="value"></yu-xform-item>
            <div slot="custom" align="right" style="margin-bottom: 10px">
              <yu-button type="primary" @click="addFn" style="margin-left: 10px;">{{ $t('wfnodescript.add') }}</yu-button>
              <yu-button @click="resetFn">{{ $t('wfnodescript.reset') }}</yu-button>
            </div>
          </yu-xform-group>
        </yu-xform>
      </div>
      <div>
        <yu-xtable :data="dataModel" style="width: 100%" v-if="configDialogVisible == true">
          <yu-xtable-column prop="logic" :label="$t('wfnodescript.logic')" width="150" :options="logics"></yu-xtable-column>
          <yu-xtable-column prop="varName" :label="$t('wfnodescript.varid')" width="120"></yu-xtable-column>
          <yu-xtable-column prop="relation" :label="$t('wfnodescript.relation')" width="120" :options="relations"></yu-xtable-column>
          <yu-xtable-column prop="varType" :label="$t('wfnodescript.type')" width="120" :options="valueTypes"></yu-xtable-column>
          <yu-xtable-column prop="value" :label="$t('wfnodescript.value')"></yu-xtable-column>
          <yu-xtable-column fixed="right" :label="$t('wfnodescript.option')" width="120">
            <template slot-scope="scope">
              <yu-button @click="modify(scope)" type="text" size="small">{{ $t('wfbutton.edit') }}</yu-button>
              <yu-button @click="deleteFn(scope)" type="text" size="small">{{ $t('wfbutton.delete') }}</yu-button>
            </template>
          </yu-xtable-column>
        </yu-xtable>
      </div>
      <div style="margin-top: 20px" slot="footer" class="dialog-footer">
        <el-button @click="actionPerformed">{{ $t('wfnodescript.sure') }}</el-button>
        <el-button @click="configDialogClose">{{ $t('wfnodescript.cancel') }}</el-button>
      </div>
    </el-dialog-x>
    <!--流程变量详情弹窗 -->
    <el-dialog-x :title="$t('wfnodescript.titleparam')" :visible.sync="bizParamDialogVisible" width="800px">
      <yu-button-drop class="config_button">
        <el-button @click="customRowOp(null, 'new')">{{ $t('wfbutton.add') }}</el-button>
      </yu-button-drop>
      <yu-xtable ref="bizParamTable" request-type="POST" :data-url="urls.getBizParam" :base-params="bizParamParams" show-hidden-menu>
        <yu-xtable-column prop="varId" :label="$t('wfnodescript.varid')" :resizable="true"></yu-xtable-column>
        <yu-xtable-column prop="varName" :label="$t('wfnodescript.varname')" :resizable="true"></yu-xtable-column>
        <yu-xtable-column prop="varValue" :label="$t('wfnodescript.varvalue')" :resizable="true"></yu-xtable-column>
        <yu-xtable-column prop="varType" :label="$t('wfnodescript.vartype')" :resizable="true" :options="valueTypes"></yu-xtable-column>
        <!--yu-xtable-column prop="flowSign" :label="$t('wfnodescript.vartype')" :hidden="true"></yu-xtable-column-->
        <yu-xtable-column prop="bizField" :label="$t('wfnodescript.bizfield')" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfnodescript.option')" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="customRowOp(scope.row,'edit')">{{ $t('wfbutton.edit') }}</el-button>
            <el-button size="small" type="text" @click="deleteBizParamConfig(scope.row)">{{ $t('wfbutton.delete') }}</el-button>
          </template>
        </yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="bizParamDialogVisible = false">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="refresh">{{ $t('wfbutton.refresh') }}</el-button>
      </div>
    </el-dialog-x>
    <!--流程变量新增弹窗-->
    <el-dialog-x :title="$t('wfnodescript.titlenew')" :visible.sync="newParamDialogVisible" width="750px">
      <yu-xform ref="bizParamForm" label-width="110px" v-model="bizParamFormData" :rules="paramRules">
        <yu-xform-group :column="2">
          <yu-xform-item :label="$t('wfnodescript.varid')" :placeholder="$t('wfnodescript.varid')" ctype="input" name="varId" :disabled="paramDisabled"></yu-xform-item>
          <yu-xform-item :label="$t('wfnodescript.varname')" :placeholder="$t('wfnodescript.varname')" ctype="input" name="varName"></yu-xform-item>
          <yu-xform-item :label="$t('wfnodescript.varvalue')" :placeholder="$t('wfnodescript.varvalue')" ctype="input" name="varValue"></yu-xform-item>
          <yu-xform-item :label="$t('wfnodescript.vartype')" :placeholder="$t('wfnodescript.vartype')" ctype="select" name="varType" :options="valueTypes"></yu-xform-item>
          <yu-xform-item :label="$t('wfnodescript.bizfield')" :placeholder="$t('wfnodescript.bizfield')" ctype="input" name="bizField"></yu-xform-item>
          <yu-xform-item :label="$t('wfnodescript.range')" :placeholder="$t('wfnodescript.range')" ctype="select" name="flowSign" :options="ranges" :hidden="paramDisabled"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="sureConfig" v-if="viewType === 'ADD'">{{ $t('wfbutton.sure') }}</el-button>
        <el-button type="primary" @click="sureModify" v-if="viewType === 'EDIT'">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="cancelConfig">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog-x>
    <!--流程变量选取框-->
    <el-dialog-x :title="$t('wfnodescript.titleselect')" :visible.sync="paramSelectDialogVisible" width="750px">
      <yu-xform ref="search" v-model="searchFormdata" related-table-name="paramList" class="el-form-search" form-type="search" :custom-search-fn="searchFn">
        <yu-xform-group :column="3">
          <yu-xform-item :placeholder="$t('wfnodescript.varid')" ctype="input" name="varId"></yu-xform-item>
          <yu-xform-item :placeholder="$t('wfnodescript.varname')" ctype="input" name="varName"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <yu-xtable ref="paramList" request-type="POST" :data-url="urls.getBizParam" :base-params="bizParamParams" selection-type="radio">
        <yu-xtable-column :label="$t('wfnodescript.varname')" prop="varName" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfnodescript.varid')" prop="varId" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfnodescript.vartype')" prop="varType" :resizable="true" align="center" :options="valueTypes"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfnodescript.varvalue')" prop="varValue" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfnodescript.bizfield')" prop="bizField" :resizable="true" align="center"></yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="sureSelect">{{ $t('wfbutton.xqfh') }}</el-button>
      </div>
    </el-dialog-x>
    <el-dialog-x :title="$t('wfnodescript.shuffleconfig')" :visible.sync="shuffleDialogVisible">
      <div id="shuffleConfigTreeFiled">
        <component :is="shufflePage" @nodeClick="shuffleSelectChange" v-if="shuffleDialogVisible === true"></component>
      </div>
    </el-dialog-x>
  </div>
</template>
<script>
/**
 * yufp-nodescript-editor
 * 脚本编辑弹窗
 *
 * 注：自定义组件规范：
 * 1、对外默认提供v-model配置,raw-value
 * 2、对外提供readonly、disabled、size属性
 * 3、对外接口事件：select-fn,具体参数请自定义
 * Created by zhouqh on 2020/2/11.
 */
/* eslint vue/require-prop-types:0 */
import backend from "@/config/constant/app.data.service";
import { sessionStore, extend } from '@/utils';
export default {
  name: "YufpNodescriptEditor",
  props: {
    // 下述字段为el-input组件中部分属性，配置文档参见element-ui
    name: {
      type: String,
    },
    value: {
      required: true,
    },
    rawValue: String,
    size: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "edit",
    },
    flowSign: {
      type: Number,
      default: null,
    },
    params: Object,
    paramObject: {
      type: Array,
      default: function() { return []; },
    },
  },
  data: function () {
    return {
      urls: {
        getuserinfo: backend.workflowService + "/api/org/info",
        getBizParam: backend.workflowService + "/api/nwfvar/query",
        newBizParam: backend.workflowService + "/api/nwfvar/create",
        modifyBizParam: backend.workflowService + "/api/nwfvar/update",
        deleteBizParam: backend.workflowService + "/api/nwfvar/delete",
      },
      selectedVal: "",
      dialogVisible: false,
      configDialogVisible: false,
      bizParamDialogVisible: false,
      shuffleDialogVisible: false,
      newParamDialogVisible: false,
      paramSelectDialogVisible: false,
      paramDisabled: false,
      dialogTitle: this.$t('wfnodescript.title'),
      nodeScript: "",
      formdata: {
        relation: "",
        varName: "",
        varId: "",
        logic: "",
        varType: "",
        value: ""
      },
      bizParamParams: {},
      bizParams: {},
      bizParamFormData: {},
      searchFormdata: {},
      logics: [],
      dataModel: [],
      paramArray: [],
      relations: [],
      valueTypes: [],
      ranges: [],
      configRules: {
        relation: [
          {required: true, message: this.$t('wfnodescript.msgqxzrelation'), trigger: 'blur'}
        ],
        varName: [
          {required: true, message: this.$t('wfnodescript.msgqxzvarid'), trigger: 'blur'}
        ],
        logic: [
          {required: true, message: this.$t('wfnodescript.msgqxzlogic'), trigger: 'blur'}
        ],
        value: [
          {required: true, message: this.$t('wfnodescript.msgqsrvalue'), trigger: 'blur'}
        ]
      },
      paramRules: {
        varId: [
          {required: true, message: this.$t('wfnodescript.msgqsrvarid'), trigger: 'blur'},
          {max: 20, message: this.$t('wfnodescript.msgmax') + 20}
        ],
        varName: [
          {required: true, message: this.$t('wfnodescript.msgqsrvarname'), trigger: 'blur'},
          {max: 30, message: this.$t('wfnodescript.msgmax') + 30}
        ],
        varType: [
          {required: true, message: this.$t('wfnodescript.msgqxzvartype'), trigger: 'blur'}
        ],
        bizField: [{max: 20, message: this.$t('wfnodescript.msgmax') + 20}]
      },
      viewType: "ADD",
      shufflePage: null
    };
  },
  watch: {
    value: function (val) {
      // 将key转换为对应的value值
      if (!val) {
        this.selectedVal = "";
        return;
      }
      this.selectedVal = this.selectedVal ? this.selectedVal : val;
    },
    rawValue: function (val) {
      this.selectedVal = val;
    },
  },
  mounted: function () {
    this.selectedVal = this.rawValue ? this.rawValue : this.value;
    this.logics = [
      {key: "0", value: this.$t('wfnodescript.msgand')},
      {key: "1", value: this.$t('wfnodescript.msgor')}
    ]
    this.ranges = [
      {key: "0", value: this.$t('wfnodescript.msgall')},
      {key: "1", value: this.$t('wfnodescript.msgthis')}
    ]
    this.valueTypes = [
      {key: "0", value: this.$t("wfnodescript.msgnum")},
      {key: "1", value: this.$t("wfnodescript.msgchar")}
    ]
    this.relations = [
      {key: ">", value: this.$t('wfnodescript.msg0')},
      {key: ">=", value: this.$t('wfnodescript.msg1')},
      {key: "<", value: this.$t('wfnodescript.msg2')},
      {key: "<=", value: this.$t('wfnodescript.msg3')},
      {key: "==", value: this.$t('wfnodescript.msg4')},
      {key: "!=", value: this.$t('wfnodescript.msg5')},
      {key: "5", value: this.$t('wfnodescript.msg6')},
      {key: "6", value: this.$t('wfnodescript.msg7')},
      {key: "7", value: this.$t('wfnodescript.msg8')},
      {key: "8", value: this.$t('wfnodescript.msg9')},
      {key: "9", value: this.$t('wfnodescript.msg10')},
      {key: "10", value: this.$t('wfnodescript.msg11')},
    ]
    this.bizParamParams = {
      flowSign: this.flowSign
    }
    this.$nextTick(function () {
      try {
        this.shufflePage = function () {
          return Promise.resolve(
            require('@/views/workflow/demo/shuffle/modelTreeSelect.vue').default
          );
        };
      } catch (e) {}
    });
  },
  methods: {
    clickFn: function () {
      this.$emit("click-fn", this);
    },
    onIconClickFn: function (val) {
      if (this.disabled) {
        return;
      }
      this.dialogVisible = true;
    },
    //翻译初始的ID
    dialogOpen: function () {
      var _this = this;
      if (_this.selectedVal) {
        _this.nodeScript = _this.selectedVal;
      } else {
        _this.nodeScript = "";
      }
      if (_this.paramObject && _this.paramObject.length > 0) {
        extend(_this.paramArray, _this.paramObject);
        for(var i in _this.paramArray) {
          _this.paramArray[i].logic += "";
          _this.paramArray[i].varType += "";
          _this.paramArray[i].relation += "";
        }
      }
    },
    afterClose: function () {
      this.nodeScript = "";
      this.dataModel = [];
      this.paramArray = [];
      this.dialogVisible = false;
    },
    dialogClose: function () {
      this.selectedVal = this.nodeScript;
      this.$emit("input", this.nodeScript);
      this.$emit("select-fn", "script", this.nodeScript);
      this.$emit("config", this.paramArray);
      this.afterClose();
    },
    //
    configDialogOpen: function() {
      if (this.paramArray && this.paramArray.length > 0) {
        extend(this.dataModel, this.paramArray);
      }
      this.configDialogVisible = true;
      this.$nextTick(function() {
        this.$refs.refFormDemo.resetFields();
        this.formdata.logic = "0";
        this.formdata.relation = ">";
        this.formdata.varType = "0";
      });
    },
    configDialogClose: function() {
      this.$refs.refFormDemo.resetFields();
      this.configDialogVisible = false;
    },
    openParamSelectDialog: function() {
      this.paramSelectDialogVisible = true;
      this.$nextTick(function() {
        this.$refs.paramList.remoteData();
      })
    },
    // 新添加配置项
    addFn: function() {
      var validate = false;
      this.$refs.refFormDemo.validate(function(valid) {
        validate = valid;
      });
      if (!validate) {
        this.$message({message: this.$t('wfnodescript.msginputillegal'), type: "warning"});
        return;
      }
      var varType = "0";
      var str = ["5", "6", "7", "8", "9", "10"];
      if(str.indexOf(this.formdata.relation) > -1) {
        // 字符
        varType = "1";
      }
      if(!this.formdata.varType) {
        this.formdata.varType = varType;
      } else if(this.formdata.varType !== varType) {
        this.$message({message: this.$t('wfnodescript.msgqxzsametype'), type: "warning"});
        return;
      }
      var item = {};
      extend(item, this.formdata);
      this.dataModel.push(item);
      this.$nextTick(function() {
        this.$refs.refFormDemo.resetFields();
      });
    },
    // 修改加配置项
    modify: function(scope) {
      extend(this.formdata, scope.row);
      this.formdata.logic = scope.row.logic;
      this.deleteFn(scope);
    },
    // 删除加配置项
    deleteFn: function(scope) {
      if(this.dataModel.length > 0) {
        this.dataModel.splice(scope.$index, 1);
      }
    },
    // 重置表单
    resetFn: function() {
      this.$refs.refFormDemo.resetFields();
    },
    bizParamDialogOpen: function() {
      this.bizParamDialogVisible = true;
    },
    customRowOp: function (scope, op) {
      // 表格操作按钮事件
      // 当前行号：scope.$index\当前行数据：scope.row\ 当前列对象：scope.column
      // this.$alert('你现在正在操作：' + op + '当前行ID值为：' + scope.row.flowId, _this.$t('wfnodescript.tip'));
      if (op == 'edit') {
        // 流程变量修改
        this.viewType = "EDIT";
        this.paramDisabled = true;
        this.newParamDialogVisible = true;
        this.$nextTick(function () {
          this.$refs.bizParamForm.resetFields();
          extend(this.bizParamFormData, scope);
          this.bizParamFormData.flowSign = this.flowSign;
        });
      } else if (op == 'new') {
        // 流程变量修改
        this.viewType = "ADD";
        this.newParamDialogVisible = true;
        this.$nextTick(function () {
          this.paramDisabled = false;
          this.$refs.bizParamForm.resetFields();
          this.bizParamFormData.varType = "1";
          this.bizParamFormData.flowSign = "1";
        });
      }
    },
    // 删除一个流程变量
    deleteBizParamConfig: function(row) {
      if(!row) {
        this.$message({message: this.$t("wfnodescript.msgselectone"), type: "warning"});
        return;
      }
      var _this = this;
      _this.$confirm(_this.$t('wfnodescript.msgsuredelete'), _this.$t('wfnodescript.tip'), {
        confirmButtonText: _this.$t('wfbutton.sure'),
        cancelButtonText: _this.$t('wfbutton.cancel'),
        type: 'warning',
        center: true
      }).then(function () {
        _this.$request({
          method: 'POST',
          url: _this.urls.deleteBizParam,
          data: {varId: row.varId}
        }).then(({code, message, data}) => {
          if (code === '0') {
            _this.$message({ message: _this.$t('wfnodescript.msgdelsucess'), type: 'success' });
            _this.refresh();
          } else {
            _this.$message({ message: message ? message.substring(0, 100) : _this.$t('wfnodescript.msgdelerror'), type: 'error' });
          }
        })
      }).catch(e => {});
    },
    refresh: function() {
      this.$refs.bizParamTable.remoteData();
    },
    sureConfig: function() {
      var data = this.$refs.bizParamForm.formdata;
      var formValid = true;
      this.$refs.bizParamForm.validate(function (valid) {
        if(!valid) {
          formValid = false;
        }
      });
      if(!formValid) {
        this.$message({message: this.$t('wfnodescript.msginputillegal'), type: "warning"});
        return;
      }
      if(data.flowSign === "1") {
        data.flowSign = this.flowSign;
      } else {
        data.flowSign = null;
      }
      this.$request({
        url: this.urls.newBizParam,
        data: data,
        method: "POST"
      }).then(response => {
        if(response && response.data) {
          this.$message({message: this.$t('wfnodescript.msgaddsuccess'), type: "success"});
          this.cancelConfig();
        } else {
          this.$message({message: this.$t('wfnodescript.msgaddfail'), type: "error"});
        }
      });
    },
    cancelConfig: function() {
      this.$refs.bizParamForm.resetFields();
      this.newParamDialogVisible = false;
      this.$refs.bizParamTable.remoteData();
    },
    // 修改流程变量
    sureModify: function() {
      var data = this.$refs.bizParamForm.formdata;
      var formValid = true;
      this.$refs.bizParamForm.validate(function (valid) {
        if(!valid) {
          formValid = false;
        }
      });
      if(!formValid) {
        this.$message({message: this.$t('wfnodescript.msginputillegal'), type: "warning"});
        return;
      }
      this.$request({
        url: this.urls.modifyBizParam,
        data: data,
        method: "POST"
      }).then(response => {
        if(response && response.data) {
          this.$message({message: this.$t('wfnodescript.msgeditsuccess'), type: "success"});
          this.cancelConfig();
        } else {
          this.$message({message: this.$t('wfnodescript.msgeditfail'), type: "error"});
        }
      });
    },
    //
    shuffleDialogOpen: function() {
      this.shuffleDialogVisible = true;
    },
    shuffleConfig: function() {},
    sureSelect: function() {
      var selections = this.$refs.paramList.selections;
      if(selections.length < 1) {
        this.$message({message: this.$t('wfnodescript.msgselectone'), type: "warning"});
        return;
      }
      var item = selections[0];
      this.formdata.varId = item.varId;
      this.formdata.varName = item.varName;
      this.formdata.varType = item.varType;
      if(item.varValue && !this.formdata.value) {
        this.formdata.value = item.varValue;
      }
      this.paramSelectDialogVisible = false;
    },
    // 对外提供选择器显示值
    getRawValue: function () {
      return this.selectedVal;
    },
    convertKey: function (val) {
      // 将key转换为对应的value值
      return val;
    },
    relactionChange: function(val) {
      console.log(val);
    },
    actionPerformed: function() {
      var vect = this.dataModel;
      var hmKey = {};
      if (vect.length > 0) {
        var tip = "";
        var sb1 = "";
        var sb2 = "";
        for (var i = 0; i < vect.length; i++) {
          var v = vect[i];
          var key = v.varId;
          tip = tip + "//--" + v.logic + "," + key + "," + v.varType + "," + v.relation + "," + v.value + "--//\n";
          if (v.logic === "0") {
            // 并且关系
            if (hmKey[key]) {
              sb1 += key + "=(String)param.getParam().get(\"" + key + "\");\n";
            } else {
              sb1 += "String " + key + "=(String)param.getParam().get(\"" + key + "\");\n";
            }
            if (v.varType === "0") {
              // 数字比较
              var op = v.relation;
              sb1 += "if(Float.parseFloat(" + key + ")" + op + v.value + "){b=true;}\n";
              sb1 += "else{return false;}\n";
            } else {
              // 字符比较
              var op = v.relation;
              if (op != null && op === "5") {
                // if (hmKey[key] == null) {
                //   sb1 += "String " + key + "=(String)param.getParam().get(\"" + key + "\");\n";
                // } else {
                //   sb1 += key + "=(String)param.getParam().get(\"" + key + "\");\n";
                // }
                sb1 += "if(" + key + ".equals(\"" + v.value + "\")){b=true;}\n";
                sb1 += "else{return false;}\n";
              } else if (op != null && op === "6") {
                // if (hmKey[key] == null) {
                //   sb1 += "String " + key + "=(String)param.getParam().get(\"" + key + "\");\n";
                // } else {
                //   sb1 += key + "=(String)param.getParam().get(\"" + key + "\");\n";
                // }
                sb1 += "if(!" + key + ".equals(\"" + v.value + "\")){b=true;}\n";
                sb1 += "else{return false;}\n";
              } else if (op != null && op === "7") {
                // if (hmKey[key] == null) {
                //   sb1 += "String " + key + "=(String)param.getParam().get(\"" + key + "\");\n";
                // } else {
                //   sb1 += key + "=(String)param.getParam().get(\"" + key + "\");\n";
                // }
                sb1 += "if(" + key + ".indexOf(\"" + v.value + "\")!=-1){b=true;}\n";
                sb1 += "else{return false;}\n";
              } else if (op != null && op === "8") {
                // if (hmKey[key] == null) {
                //   sb1 += "String " + key + "=(String)param.getParam().get(\"" + key + "\");\n";
                // } else {
                //   sb1 += key + "=(String)param.getParam().get(\"" + key + "\");\n";
                // }
                sb1 += "if(" + key + ".indexOf(\"" + v.value + "\")==-1){b=true;}\n";
                sb1 += "else{return false;}\n";
              } else if (op != null && op === "9") {
                // if (hmKey[key] == null) {
                //   sb1 += "String " + key + "=(String)param.getParam().get(\"" + key + "\");\n";
                // } else {
                //   sb1 += key + "=(String)param.getParam().get(\"" + key + "\");\n";
                // }
                sb1 += "if(\"" + v.value + "\".indexOf(" + key + ")!=-1){b=true;}\n";
                sb1 += "else{return false;}\n";
              } else if (op != null && op === "10") {
                // if (hmKey[key] == null) {
                //   sb1 += "String " + key + "=(String)param.getParam().get(\"" + key + "\");\n";
                // } else {
                //   sb1 += key + "=(String)param.getParam().get(\"" + key + "\");\n";
                // }
                sb1 += "if(\"" + v.value + ",\".indexOf(" + key + "+\",\")!=-1){b=true;}\n";
                sb1 += "else{return false;}\n";
              }
              hmKey[key] = "1";
            }
          } else if (v.varType === "0") {
            // 或者关系，数字比较
            var op = v.relation;
            // op = op === "大于" ? ">" : (op === "大于等于" ? ">=" : (op === "小于" ? "<" : (op === "小于等于" ? "<=" : (op === "等于" ? "==" : "!="))));
            if (hmKey[key]) {
              sb1 += key + "=(String)param.getParam().get(\"" + key + "\");\n";
            } else {
              sb1 += "String " + key + "=(String)param.getParam().get(\"" + key + "\");\n";
            }
            sb2 += "if(Float.parseFloat(" + key + ")" + op + v.value + "){return true;}\n";
          } else {
            // 或者关系，字符比较
            var op = v.relation;
            if (hmKey[key]) {
              sb1 += key + "=(String)param.getParam().get(\"" + key + "\");\n";
            } else {
              sb1 += "String " + key + "=(String)param.getParam().get(\"" + key + "\");\n";
            }
            if (op != null && op === "5") {
              // if (hmKey[key] == null) {
              //   sb2 += "String " + key + "=(String)param.getParam().get(\"" + key + "\");\n";
              // } else {
              //   sb2 += key + "=(String)param.getParam().get(\"" + key + "\");\n";
              // }
              sb2 += "if(" + key + ".equals(\"" + v.value + "\")){return true;};\n";
            } else if (op != null && op === "6") {
              // if (hmKey[key] == null) {
              //   sb2 += "String " + key + "=(String)param.getParam().get(\"" + key + "\");\n";
              // } else {
              //   sb2 += key + "=(String)param.getParam().get(\"" + key + "\");\n";
              // }
              sb2 += "if(!" + key + ".equals(\"" + v.value + "\")){return true;}\n";
            } else if (op != null && op === "7") {
              // if (hmKey[key] == null) {
              //   sb2 += "String " + key + "=(String)param.getParam().get(\"" + key + "\");\n";
              // } else {
              //   sb2 += key + "=(String)param.getParam().get(\"" + key + "\");\n";
              // }
              sb2 += "if(" + key + ".indexOf(\"" + v.value + "\")!=-1){return true;}\n";
            } else if (op != null && op === "8") {
              // if (hmKey[key] == null) {
              //   sb2 += "String " + key + "=(String)param.getParam().get(\"" + key + "\");\n";
              // } else {
              //   sb2 += key + "=(String)param.getParam().get(\"" + key + "\");\n";
              // }
              sb2 += "if(" + key + ".indexOf(\"" + v.value + "\")==-1){return true;}\n";
            } else if (op != null && op === "9") {
              // if (hmKey[key] == null) {
              //   sb2 += "String " + key + "=(String)param.getParam().get(\"" + key + "\");\n";
              // } else {
              //   sb2 += key + "=(String)param.getParam().get(\"" + key + "\");\n";
              // }
              sb2 += "if(\"" + v.value + "\".indexOf(" + key + ")!=-1){return true;}\n";
            } else if (op != null && op === "10") {
              // if (hmKey[key] == null) {
              //   sb2 += "String " + key + "=(String)param.getParam().get(\"" + key + "\");\n";
              // } else {
              //   sb2 += key + "=(String)param.getParam().get(\"" + key + "\");\n";
              // }
              sb2 += "if(\"" + v.value + ",\".indexOf(" + key + "+\",\")!=-1){return true;}\n";
            }
          }
          hmKey[key] = "1";
        }
        var sb = "";
        if (this.nodeScript && this.nodeScript.indexOf("//!--start--!//") != -1) {
          sb += this.nodeScript.slice(0, this.nodeScript.indexOf("//!--start--!//") + 15) + "\n";
        } else {
          sb += this.nodeScript;
          sb += "//!--start--!//\n";
        }
        sb += tip;
        sb += "boolean b=true;\n";
        sb += sb1;
        if (sb2 !== "") {
          sb += "boolean bor=false;\n";
          sb += "while(true){\n";
          sb += sb2;
          sb += "break;\n";
          sb += "}\n";
          sb += "return b&&bor;\n";
        } else {
          sb += "return b;\n";
        }
        sb += "//!--end--!//\n";
        if (this.nodeScript && this.nodeScript.indexOf("//!--end--!//") != -1) {
          sb += this.nodeScript.slice(this.nodeScript.indexOf("//!--end--!//") + 13, this.nodeScript.length);
        }
        console.log(sb);
        this.nodeScript = sb;
      } else {
        var sb = "";
        if (this.nodeScript && this.nodeScript.length > 0) {
          if (this.nodeScript.indexOf("//!--start--!//") != -1) {
            sb += this.nodeScript.slice(0, this.nodeScript.indexOf("//!--start--!//"));
          } else {
            sb += this.nodeScript;
          }
        }
        this.nodeScript = sb;
      }
      this.paramArray = this.dataModel;
      this.configDialogClose();
    },
    searchFn: function () {
      var _this = this;
      _this.$refs.search.validate(function(valid) {
        if (valid) {
          var model = _this.$refs.search.formdata;
          var params = {
            flowSign: _this.flowSign,
            varId: model.bizType ? '%' + model.bizType + '%' : "",
            varName: model.flowName ? '%' + model.flowName + '%' : ""
          };
          var param = {
            condition: JSON.stringify(params)
          };
          _this.$refs.paramList.remoteData(params);
        }
      })
    },
    shuffleSelectChange: function(a) {
      console.log(a);
    }
  },
};
</script>
