
<!-- 流程关联机构配置 -->
<template>
  <div>
    <yu-panel :title="$t('wfbizorg.title1')">
      <template slot="right">
        <yu-toolbar>
          <yu-button @click="addFn">{{ $t('wfbutton.add') }}</yu-button>
        </yu-toolbar>
      </template>
      <yu-xform v-model="queryForm" ref="searchForm" related-table-name="refTable" form-type="search" :remove-empty="true" :custom-search-fn="searchFn" @form-reset="resetFn">
        <yu-xform-group :column="3">
          <yu-xform-item :label="$t('wfbizorg.biztype')" :placeholder="$t('wfbizorg.biztype')" ctype="input" name="bizType"></yu-xform-item>
          <yu-xform-item :label="$t('wfbizorg.flowname')" :placeholder="$t('wfbizorg.flowname')" ctype="input" name="flowName"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <yu-xtable row-number ref="refTable" request-type="POST" :data-url="queryUrl" :base-params="baseParams">
        <yu-xtable-column prop="bizType" :label="$t('wfbizorg.biztype')"></yu-xtable-column>
        <yu-xtable-column prop="orgName" :label="$t('wfbizorg.orgname')"></yu-xtable-column>
        <yu-xtable-column prop="flowSign" :label="$t('wfbizorg.flowsign')"></yu-xtable-column>
        <yu-xtable-column prop="flowName" :label="$t('wfbizorg.flowname')"></yu-xtable-column>
        <yu-xtable-column prop="ext" :label="$t('wfbizorg.ext')"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfbizorg.option')" fixed="right" width="150px">
          <template slot-scope="scope">
            <yu-button-drop :show-length="2" type="text">
              <yu-button @click="modifyFn(scope.row)" type="text">{{ $t('wfbutton.edit') }}</yu-button>
              <yu-button @click="viewFn(scope.row)" type="text">{{ $t('wfbutton.info') }}</yu-button>
              <yu-button @click="deleteFn(scope.row)" type="text">{{ $t('wfbutton.delete') }}</yu-button>
            </yu-button-drop>
          </template>
        </yu-xtable-column>
      </yu-xtable>

      <!-- 新增弹框 -->
      <yu-xdialog :title="dialogTitle" :visible.sync="dialogVisible" @close="cancelFn">
        <yu-xform ref="refForm" label-width="100px" label-suffix="：" v-model="formdata" :rules="orgConfigRules" v-if="dialogVisible == true">
          <yu-xform-group>
            <yu-xform-item :label="$t('wfbizorg.biztype')" ctype="select" name="bizType" :options="bizTypes" @change="changeFn" :filterable="true"></yu-xform-item>
            <yu-xform-item :label="$t('wfbizorg.flowsign')" :hidden="hidden.flowSign" :placeHolder="$t('wfbizorg.icon')" ctype="input" name="flowSign" :readonly="true" icon="search" @click="openFlowDialog"></yu-xform-item>
            <yu-xform-item :label="$t('wfbizorg.orgid')" ctype="yufp-search-tree" name="orgName" :params="treeParams" :select-value="selectValue" :details-value="detailsValue" @node-click="changeOrgFn"></yu-xform-item>
            <yu-xform-item :label="$t('wfbizorg.flowname')" :hidden="hidden.flowName" ctype="input" name="flowName" :readonly="true"></yu-xform-item>
            <yu-xform-item :label="$t('wfbizorg.ext')" ctype="textarea" name="ext" :colspan="24"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
        <div slot="footer" class="dialog-footer">
          <yu-button type="primary" @click="saveFn">{{ $t('wfbutton.save') }}</yu-button>
          <yu-button type="primary" @click="cancelFn">{{ $t('wfbutton.cancel') }}</yu-button>
        </div>
      </yu-xdialog>
      <!-- 修改、查看弹框 -->
      <yu-xdialog :title="dialogTitle" :visible.sync="editDialogVisible">
        <yu-xform ref="editForm" label-width="100px" label-suffix="：" v-model="editformdata">
          <yu-xform-group>
            <yu-xform-item :label="$t('wfbizorg.biztype')" ctype="select" name="bizType" :options="bizTypes" @change="changeFn" :disabled="true"></yu-xform-item>
            <yu-xform-item :label="$t('wfbizorg.flowsign')" ctype="input" name="flowSign" :disabled="true"></yu-xform-item>
            <yu-xform-item :label="$t('wfbizorg.orgid')" ctype="input" name="orgName" :disabled="true"></yu-xform-item>
            <yu-xform-item :label="$t('wfbizorg.flowname')" ctype="input" name="flowName" :disabled="true"></yu-xform-item>
            <yu-xform-item :label="$t('wfbizorg.ext')" ctype="textarea" name="ext" :colspan="24" :disabled="viewType !== 'EDIT'" :rules="[{max: 60, message: this.$t('wfbizorg.msgcdxz60')}]"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
        <div slot="footer" class="dialog-footer">
          <yu-button v-show="viewType === 'EDIT'" type="primary" @click="updateFn">{{ $t('wfbutton.save') }}</yu-button>
          <yu-button type="primary" @click="editDialogClose">{{ $t('wfbutton.cancel') }}</yu-button>
        </div>
      </yu-xdialog>

      <!-- 流程选择弹框 -->
      <yu-xdialog :title="$t('wfbizorg.title4')" :visible.sync="flow.dialogVisible" @close="flowCancelFn">
        <yu-xform ref="flowRefForm" v-model="flow.queryForm" related-table-name="flowRefTable" form-type="search" :remove-empty="true" :custom-search-fn="searchFlowFn" :custom-reset-fn="resetFlowFn">
          <yu-xform-group :column="3">
            <yu-xform-item :label="$t('wfbizorg.flowsign')" :placeholder="$t('wfbizorg.flowsign')" ctype="num" name="flowSign" :colspan="8"></yu-xform-item>
            <yu-xform-item :label="$t('wfbizorg.flowname')" :placeholder="$t('wfbizorg.flowname')" ctype="input" name="flowName" fuzzy-query="both" :colspan="8"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
        <yu-xtable row-number ref="flowRefTable" request-type="POST" :data-url="flow.queryUrl" :base-params="flow.baseParams">
          <yu-xtable-column prop="flowName" :label="$t('wfbizorg.flowname')"></yu-xtable-column>
          <yu-xtable-column prop="flowSign" :label="$t('wfbizorg.flowsign')"></yu-xtable-column>
          <yu-xtable-column prop="flowId" :label="$t('wfbizorg.flowid')"></yu-xtable-column>
          <yu-xtable-column prop="flowVersion" :label="$t('wfbizorg.flowver')"></yu-xtable-column>
        </yu-xtable>
        <div slot="footer" class="dialog-footer">
          <yu-button type="primary" @click="selectFn">{{ $t('wfbutton.sure') }}</yu-button>
          <yu-button type="primary" @click="flowCancelFn">{{ $t('wfbutton.cancel') }}</yu-button>
        </div>
      </yu-xdialog>
    </yu-panel>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { validator } from "@/utils/validate";
import { extend } from '@/utils'
import YufpOrgTree from "@/components/widgets/YufpOrgTree/index.vue";
export default {
  components: { YufpOrgTree },
  data: function() {
    var _this = this;
    return {
      queryForm: {},
      queryUrl: backend.workflowService + "/api/biz/org/query",
      insertUrl: backend.workflowService + "/api/biz/org/create",
      updateUrl: backend.workflowService + "/api/biz/org/update",
      deleteUrl: backend.workflowService + "/api/biz/org/delete",
      dialogVisible: false,
      editDialogVisible: false,
      formdata: {
        flowSign: "",
        flowName: "",
        bizType: "",
        orgCode: "",
        orgName:"",
        ext: ""
      },
      editformdata: {},
      saveBtnShow: true,
      updateBtnShow: false,
      dialogTitle: "",
      disabled: {
        form: false,
        bizType: false,
        orgName: false
      },
      hidden: {
        flowSign: false,
        flowName: false,
        info: true
      },
      baseParams: {sort: "biz_type desc"},
      flow: {
        baseParams: {},
        dialogVisible: false,
        queryUrl: backend.workflowService + "/api/biz/query"
      },
      bizTypes: [],
      treeParams: {
        dataId: 'orgId',
        dataLabel: 'orgName',
        dataPid: 'upOrgId',
        dataUrl: backend.appOcaService + '/api/adminsmorg/allorgtree',
        placeholder: this.$t('dutyManager.qxz'),
        searchKey: 'orgName' // 树过滤关键字
      }, // 机构树选择
      selectValue: '', // 弹出框上级机构显示值
      searchOrgName: '', // 查询机构名称
      detailsValue: '', // 搜索树详情字段
      orgConfigRules:{
        bizType: [{required: true, message: this.$t('wfbizorg.msgqxzywlx'), trigger: 'blur'}],
        orgName: [{required: true, message: this.$t('wfbizorg.msgqxzsyjg'), trigger: 'blur'}],
        flowSign: [{required: true, message: this.$t('wfbizorg.msgselectflow'), trigger: 'blur'}],
        flowName: [{required: true, message: this.$t('wfbizorg.msgselectflow'), trigger: 'blur'}],
        ext: [{max: 60, message: this.$t('wfbizorg.msgcdxz60')}],
      },
      viewType: "EDIT",
    };
  },
  computed: {
    ...mapGetters(["org"])
  },
  mounted: function() {},
  methods: {
    initBizTypes: function() {
      var _this = this;
      this.bizTypes = [];
      yufp.service.request({
        method: "POST",
        url: backend.workflowService + "/api/biz/all",
        callback: function(code, message, response) {
          if (response.code == 0 && null != response.data) {
            var datas = response.data;
            _this.convertData(datas);
          } else {
            _this.$message({message: this.$t('wfbizorg.msggetywlxerror'), type: "warning"});
          }
        }
      });
    },
    convertData: function(datas) {
      var biztypes = [];
      for (var i = 0; i < datas.length; i++) {
        if(biztypes.indexOf(datas[i].bizType) == -1) {
          var opt = {
            key: datas[i].bizType,
            value: datas[i].ext
          };
          this.bizTypes.push(opt);
          biztypes.push(datas[i].bizType);
        }
      }
    },
    addFn: function() {
      var _this = this;
      _this.initBizTypes();
      _this.dialogTitle = _this.$t('wfbizorg.title2');
      _this.hidden.flowSign = true;
      _this.hidden.flowName = true;
      _this.hidden.info = true;
      _this.dialogVisible = true;
      // _this.$refs.refForm.resetFields();
      // _this.$nextTick(function() {
      //   _this.$refs.refForm.resetFields();
      // });
    },
    modifyFn: function(row) {
      var _this = this;
      if (!row) {
        _this.$message({ type: "warning", message: _this.$t('wfbizorg.msgselectone') });
        return;
      }
      _this.dialogTitle = _this.$t('wfbizorg.title3');
      _this.viewType = "EDIT";
      extend(_this.editformdata, row);

      _this.editDialogVisible = true;
      _this.$nextTick(function() {
        _this.editformdata.orgCode = row.orgCode;
      })
    },
    newDialogClose: function() {
      this.$refs.refForm.resetFields();
      this.dialogVisible = false;
      this.viewType = "ADD";
    },
    editDialogClose: function() {
      this.$refs.editForm.resetFields();
      this.editDialogVisible = false;
      this.viewType = "EDIT";
    },
    deleteFn: function(row) {
      var _this = this;
      if (!row) {
        _this.$message({ type: "warning", message: _this.$t('wfbizorg.msgselectone') });
        return;
      }

      var params = {
        bizType: row.bizType,
        flowSign: row.flowSign,
        orgCode: row.orgCode
      }
      _this.$confirm(_this.$t('wfbizorg.msgsuredelete'), _this.$t('wfbizorg.tip'), {
        confirmButtonText: _this.$t('wfbutton.sure'),
        cancelButtonText: _this.$t('wfbutton.cancel'),
        type: "warning",
        center: true
      }).then(function() {
        _this.$request({
          method: "POST",
          url: _this.deleteUrl,
          data: params
        }).then(({code, message, data}) => {
          if (data > 0) {
            _this.$refs.refTable.remoteData();
            _this.$message({message: _this.$t('wfbizorg.msgdelsucess'), type: "success"});
          } else {
            _this.$message({message: _this.$t('wfbizorg.msgdelerror'), type: "warning"});
          }
          _this.resetFn();
        })
      });
    },
    saveFn: function() {
      var _this = this;
      var isValid = true;
      _this.$refs.refForm.validate(function(result) {
        isValid = result;
      });
      if (!isValid) {
        _this.$message({message: _this.$t('wfbizorg.msginputillegal'), type: "warning"});
        return;
      }

      var model = _this.formdata;
      if(model.ext && model.ext.length > 60) {
        _this.$message({message: _this.$t('wfbizorg.msgextmax60'), type: "warning"});
        return;
      }
      yufp.service.request({
        method: "POST",
        url: _this.insertUrl,
        data: model,
        callback: function(code, message, response) {
          if (response.code == 0) {
            _this.$refs.refTable.remoteData();
            _this.$message({
              duration: 6000,
              message: _this.$t('wfbizorg.msgsddsuccess'),
              type: "success"
            });
            _this.dialogVisible = false;
          } else {
            _this.$message({
              duration: 4000,
              message: _this.$t('wfbizorg.msgadderror'),
              type: "error"
            });
          }
          _this.resetFn();
        }
      });
    },
    updateFn: function() {
      var _this = this;
      var isValid = true;
      _this.$refs.editForm.validate(function(result) {
        isValid = result;
      });
      if (!isValid) {
        _this.$message({message: _this.$t('wfbizorg.msginputillegal'), type: "success"});
        return;
      }
      var model = _this.editformdata;
      if(model.ext && model.ext.length > 60) {
        _this.$message({message: _this.$t('wfbizorg.msgextmax60'), type: "success"});
        return;
      }

      yufp.service.request({
        method: "POST",
        url: _this.updateUrl,
        data: model,
        callback: function(code, message, response) {
          if (response.code == 0) {
            _this.$refs.refTable.remoteData();
            _this.$message({
              duration: 6000,
              message: _this.$t('wfbizorg.msgeditsuccess'),
              type: "success"
            });
            _this.editDialogVisible = false;
          } else {
            _this.$message({
              duration: 4000,
              message: _this.$t('wfbizorg.msgediterror'),
              type: "error"
            });
          }
          _this.resetFn();
        }
      });
    },
    cancelFn: function() {
      this.$refs.refForm.resetFields();
      this.dialogVisible = false;
      this.selectValue = null;
    },
    viewFn: function(row) {
      var _this = this;
      if (!row) {
        _this.$message({ type: "warning", message: _this.$t('wfbizorg.msgselectone') });
        return;
      }

      _this.dialogTitle = _this.$t('wfbizorg.title6');
      _this.viewType = "INFO";
      extend(_this.editformdata, row);
      _this.editDialogVisible = true;
    },
    selectFn: function() {
      var _this = this;
      var selections = _this.$refs.flowRefTable.selections;
      if (selections.length > 0) {
        _this.$refs.refForm.formdata.flowSign = selections[0].flowSign;
        _this.$refs.refForm.formdata.flowName = selections[0].flowName;
        // _this.formdata.flowSign = selections[0].flowSign;
        // _this.formdata.flowName = selections[0].flowName;
      }
      _this.$refs.refForm.validate(function(result) {
        // isValid = result;
      });
      _this.flow.dialogVisible = false;
      _this.$refs.flowRefForm.resetFields();
    },
    flowCancelFn: function() {
      this.flow.dialogVisible = false;
      this.$refs.flowRefForm.resetFields();
    },
    openFlowDialog: function() {
      this.flow.dialogVisible = true;
      this.$nextTick(function() {
        this.$refs.flowRefTable.remoteData();
      })
    },
    changeFn: function(newValue) {
      if (newValue == "") {
        this.hidden.flowSign = true;
        this.hidden.flowName = true;
      } else {
        this.hidden.flowSign = false;
        this.hidden.flowName = false;
        this.flow.baseParams.bizType = newValue;
      }
      this.formdata.flowSign = "";
      this.formdata.flowName = "";
    },
    searchFn: function () {
      var _this = this;
      _this.$refs.searchForm.validate(function(valid) {
        if (valid) {
          var model = _this.$refs.searchForm.formdata;
          var params = {
            bizType: model.bizType ? '%' + model.bizType + '%' : "",
            flowName: model.flowName ? '%' + model.flowName + '%' : ""
          };

          _this.$refs.refTable.remoteData(params);
        }
      })
    },
    searchFlowFn: function () {
      var _this = this;
      _this.$refs.flowRefForm.validate(function(valid) {
        if (valid) {
          var model = _this.$refs.flowRefForm.formdata;
          var params = {
            bizType: _this.flow.baseParams.bizType,
            flowName: model.flowName ? '%' + model.flowName + '%' : "",
            flowSign: model.flowSign ? model.flowSign : ""
          };
          _this.$refs.flowRefTable.remoteData(params);
        }
      })
    },
    resetFlowFn: function () {
      this.$refs.flowRefForm.resetFields();
      this.$refs.flowRefTable.remoteData();
    },
    // 自定义重置功能
    resetFn: function () {
      this.$refs.searchForm.resetFields();
      this.$refs.refTable.remoteData();
    },
    changeOrgFn: function(node) {
      this.formdata.orgCode = node.orgCode;
      this.formdata.orgName = node.orgName;
      this.selectValue = node.orgCode;
    },
  }
};
</script>
