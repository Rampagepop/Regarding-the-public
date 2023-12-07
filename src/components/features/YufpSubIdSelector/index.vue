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
      <yu-xform ref="refFormQ" v-model="refFormdata" related-table-name="reftable" class="el-form-search">
        <yu-xform-group :column="4">
          <yu-xform-item v-for="(item, index) in queryFields" :key="index" :placeholder="item.placeholder" :ctype="item.type" :name="item.field"></yu-xform-item>
          <div slot="custom" class="btn-group">
            <yu-button-group>
              <yu-button type="primary" icon="search" @click="searchFn">{{ $t('wfsubidselector.search') }}</yu-button>
              <yu-button type="primary" icon="edit" @click="resetFn">{{ $t('wfsubidselector.reset') }}</yu-button>
            </yu-button-group>
          </div>
        </yu-xform-group>
      </yu-xform>
      <!-- <el-form-q
        ref="refFormQ"
        :field-data="queryFields"
        :buttons="queryButtons"
        search-table="reftable"
      ></el-form-q> -->
      <yu-xtable
        ref="reftable"
        v-if="dialogVisible"
        request-type="POST"
        :data-url="url.bizType"
        :base-params="baseParams"
      >
        <yu-xtable-column :label="$t('wfsubidselector.flowname')" prop="flowName" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfsubidselector.flowid')" prop="flowId" :resizable="true">
          <template slot-scope="scope">
            <a class="underline" @click="customRowOpFn(scope)">{{ scope.row.flowId }}</a>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfsubidselector.biztype')" prop="bizType" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfsubidselector.ext')" prop="ext" :resizable="true" align="center"></yu-xtable-column>
      </yu-xtable>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogClose">{{ $t('wfsubidselector.sure') }}</el-button>
        <el-button type="primary" @click="clearFn">{{ $t('wfsubidselector.clear') }}</el-button>
        <el-button @click="afterClose">{{ $t('wfsubidselector.cancel') }}</el-button>
      </div>
    </el-dialog-x>
    <el-dialog-x :title="tracktitle" :visible.sync="trackDialogVisible" height="490px" width="70%">
      <div id="nwfTrackPage">
        <work-travel :work-travel-data="workTravelData" v-if="trackDialogVisible == true"></work-travel>
      </div>
    </el-dialog-x>
  </div>
</template>
<script>
/**
 * yufp-subid-selector
 * 子流程业务类型选取弹窗
 *
 * 注：自定义组件规范：
 * 1、对外默认提供v-model配置,raw-value
 * 2、对外提供readonly、disabled、size属性
 * 3、对外接口事件：select-fn,具体参数请自定义
 * Created by zhouqh on 2020/2/11.
 */
/* eslint vue/require-prop-types:0 */
import workTravel from '@/views/workflow/studio/wfmonitor/workTravel/workTravel.vue'
export default {
  name: "YufpSubidSelector",
  components: { workTravel },
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
    params: Object,
  },
  data: function () {
    var _this = this;
    return {
      refFormdata: {},
      trackDialogVisible: false,
      tracktitle: this.$t('wfsubidselector.track'),
      workTravelData: null,
      url: {
        bizType: backend.workflowService + "/api/biz/query",
      },
      selectedVal: "",
      dialogVisible: false,
      dialogTitle: this.$t('wfsubidselector.title'),
      baseParams: {
        condition: {},
      },
      queryFields: [
        { placeholder: this.$t('wfsubidselector.biztype'), field: "bizType", type: "input" },
        { placeholder: this.$t('wfsubidselector.flowid'), field: "flowId", type: "input" },
        { placeholder: this.$t('wfsubidselector.flowname'), field: "flowName", type: "input" },
      ],
      queryButtons: [
        {
          label: this.$t('wfsubidselector.search'),
          op: "submit",
          type: "primary",
          icon: "search",
          click: function (model, valid) {
            if (valid) {
              var params = {};
              params.flowId = model.flowId;
              if (model.bizType != "") {
                params.bizType = "%" + model.bizType + "%";
              }
              if (model.flowName != "") {
                params.flowName = "%" + model.flowName + "%";
              }
              var param = {
                condition: JSON.stringify(params),
              };
              _this.$refs.reftable.remoteData(params);
            }
          },
        },
        { label: this.$t('wfsubidselector.reset'), op: "reset", type: "primary", icon: "yx-loop2" },
      ],
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
  },
  methods: {
    searchFn() {
      var _this = this;
      _this.$refs.refFormQ.validate(function(valid) {
        if (valid) {
          var params = {};
          params.flowId = _this.refFormdata.flowId || '';
          if (_this.refFormdata.bizType) {
            params.bizType = "%" + _this.refFormdata.bizType + "%";
          }
          if (_this.refFormdata.flowName) {
            params.flowName = "%" + _this.refFormdata.flowName + "%";
          }
          var param = {
            condition: JSON.stringify(params),
          };
          _this.$refs.reftable.remoteData(param);
        } else {
          return;
        }
      });
    },
    resetFn() {
      this.$refs.refFormQ.resetFields();
      this.$refs.reftable.remoteData();
    },
    customRowOpFn(scope) {
      var param = {
        instanceId: scope.row.instanceId,
        bizParam: scope.row,
        flowId: scope.row.flowId,
        type: 'HIS',
        returnBackFuncId: this.$route.name
      };
      this.trackDialogVisible = true;
      this.workTravelData = param;
    },
    clickFn: function () {
      this.$emit("click-fn", this);
    },
    onIconClickFn: function (val) {
      if (this.disabled) {
        return;
      }
      this.dialogVisible = true;
      // 弹窗显示时清空查询条件
      this.$nextTick(function () {
        this.$refs["refFormQ"].resetFields();
      });
    },
    dialogOpen: function () {
      var selection = [];
    },
    afterClose: function () {
      this.dialogVisible = false;
    },
    dialogClose: function () {
      var rows = this.$refs.reftable.selections;
      if (rows.length == 0) {
        this.$message({ message: this.$t('wfsubidselector.msgselectone'), type: "warning" });
      }
      var row = rows[0];
      this.selectedVal = row.bizType;
      this.$emit("input", row.bizType);
      this.$emit("select-fn", "subId", row.bizType);
      this.dialogVisible = false;
    },
    // 对外提供选择器显示值
    getRawValue: function () {
      return this.selectedVal;
    },
    convertKey: function (val) {
      // 将key转换为对应的value值
      return val;
    },
    clearFn() {
      this.selectedVal = '';
      this.$emit("input", '');
      this.$emit("select-fn", "subId", '');
      this.dialogVisible = false;
    }
  },
};
</script>

<style lang="scss" scoped>
  ::v-deep .el-form-search .el-form-item {
    padding-right: 10px;
  }
</style>
