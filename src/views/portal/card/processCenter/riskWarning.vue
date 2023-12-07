<template>
  <div>
    <yu-panel
      title="风险预警"
      panel-type="combination"
      is-filter
      collapse
      collaspase-text="查询条件"
    >
      <template slot="filter">
        <yu-xform
          v-model="searchFormData"
          form-type="search" ref="refBaseForm" related-table-name="refTable"
          label-width="110px"
          :custom-search-fn="searchFn"
          :custom-reset-fn="resetFn"
        >
          <yu-xform-group :column="4">
            <yu-xform-item label="客户名称" placeholder="请输入" ctype="input" name="bizUserName"
                           @keyup.enter.native="searchFn"></yu-xform-item>
            <yu-xform-item label="客户编号" ctype="input" name="bizUserId"
                           @keyup.enter.native="searchFn"></yu-xform-item>
            <yu-xform-item label="预警状态" placeholder="请选择" ctype="select" name="status"
                           :options="statusOptions"
                           @keyup.enter.native="searchFn"></yu-xform-item>
            <yu-xform-item label="预警生成时间" placeholder="请选择"
                           ctype="datepicker"
                           type="daterange"
                           :value="[]"
                           name="startTime"
                           :picker-options="pickerOptions"
                           @keyup.enter.native="searchFn"></yu-xform-item>
            <yu-xform-item label="预警提示内容" placeholder="请输入关键词" ctype="input" name="warnCon"
                           @keyup.enter.native="searchFn"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <yu-xtable
        ref="refTable"
        :data-url="dataUrl"
        :base-params="baseParams"
        condition-key="condition"
        :encode="false"
      >
        <yu-xtable-column type="index" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ $refs.refTable.tabledata.indexOf(scope.row) + 1 }}</span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="客户名称" prop="bizUserName" show-overflow-tooltip></yu-xtable-column>
        <yu-xtable-column label="客户编号" prop="bizUserId" show-overflow-tooltip></yu-xtable-column>
        <yu-xtable-column label="预警等级" prop="level"></yu-xtable-column>
        <yu-xtable-column label="预警状态" prop="status">
          <template slot-scope="scope">
            <yu-tag :type="statusMap[scope.row.status].type">{{ statusMap[scope.row.status].value }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="预警信息类型" prop="infoType"></yu-xtable-column>
        <yu-xtable-column label="预警提示内容" prop="tipCon" show-overflow-tooltip></yu-xtable-column>
        <yu-xtable-column label="预警生成时间" prop="startTime"></yu-xtable-column>
        <yu-xtable-column label="预警解除时间" prop="endTime"></yu-xtable-column>
        <yu-xtable-column label="预警解除原因" prop="reason" show-overflow-tooltip></yu-xtable-column>
        <yu-xtable-column label="处理人" prop="orgUserName" show-overflow-tooltip></yu-xtable-column>
        <yu-xtable-column label="处理机构" prop="orgName" show-overflow-tooltip></yu-xtable-column>
        <yu-xtable-column label="操作" width="50" fixed="right">
          <template slot-scope="scope">
            <yu-button type="text" @click="detailFn(scope.row)">查看</yu-button>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <!-- 添加提醒 -->
    <yu-xdialog title="查看" :visible.sync="dialogVisible" width="640px">
      <yu-xform ref="viewForm" label-width="120px" v-model="formData" form-type="details">
        <yu-xform-group :column="2">
          <yu-xform-item label="客户名称" name="bizUserName" ctype="input"></yu-xform-item>
          <yu-xform-item label="客户编号" name="bizUserId" ctype="input"></yu-xform-item>
          <yu-xform-item label="预警等级" name="level" ctype="input"></yu-xform-item>
          <yu-xform-item label="预警状态" name="status" ctype="select" :options="statusOptions"></yu-xform-item>
          <yu-xform-item label="预警信息类型" name="infoType" ctype="input"></yu-xform-item>
          <yu-xform-item label="预警生成时间" name="startTime" ctype="input"></yu-xform-item>
          <yu-xform-item label="预警提示内容" name="tipCon" ctype="textarea" :autosize="{minRows:1,maxRows:5}"
                         :colspan="24"></yu-xform-item>
          <yu-xform-item label="预警解除时间" name="endTime" ctype="input" :hidden="isActive"></yu-xform-item>
          <yu-xform-item label="预警解除原因" name="reason" ctype="textarea" :autosize="{minRows:1,maxRows:5}" :colspan="24"
                         :hidden="isActive"></yu-xform-item>
          <yu-xform-item label="处理人" name="orgUserName" ctype="input" :hidden="isActive"></yu-xform-item>
          <yu-xform-item label="处理机构" name="orgName" ctype="input" :hidden="isActive"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" class="yu-grpButton">
        <yu-button @click="dialogVisible = false">取消</yu-button>
      </div>
    </yu-xdialog>
  </div>
</template>
<script>

import {extend} from "@/utils";

export default {
  name: "riskWarning",
  components: {},
  data() {
    const statusOptions = [
      {key: "0", value: "已解除", type: "success"},
      {key: "1", value: "生效中", type: "primary"}
    ]
    return {
      searchFormData: {},
      dataUrl: `${backend.mockService}/riskwarning/list`,
      baseParams: {},
      formData: {},
      dialogVisible: false,
      statusOptions,
      statusMap: statusOptions.reduce((o, kv) => {
        o[kv.key] = kv;
        return o
      }, {}),
      pickerOptions: {
        shortcuts: [{
          text: '近一周',
          onClick: function (picker) {
            var end = new Date();
            var start = new Date();
            end.setTime(start.getTime() - (3600 * 1000 * 24 * 7));
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '近一个月',
          onClick: function (picker) {
            var end = new Date();
            var start = new Date();
            end.setTime(start.getTime() - (3600 * 1000 * 24 * 30));
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '近三个月',
          onClick: function (picker) {
            var end = new Date();
            var start = new Date();
            end.setTime(start.getTime() - (3600 * 1000 * 24 * 90));
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '近一年',
          onClick: function (picker) {
            var end = new Date();
            var start = new Date();
            end.setTime(start.getTime() - (3600 * 1000 * 24 * 365));
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };
  },
  computed: {
    isActive() {
      return this.formData && this.formData.status != "0"
    }
  },
  methods: {
    /**
     * 详情
     */
    detailFn(data) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        // 复制对象
        extend(this.formData, data);
      });
    },
    searchFn() {
      const params = extend({}, this.searchFormData);
      Object.keys(params).forEach(k => {
        if (params[k] == null || params[k] == "") {
          delete params[k]
        }
      })
      // 时间段数组转换为字符串
      if (params.startTime) {
        params.startTime = params.startTime.join(",")
      }
      this.$refs.refTable.remoteData(params);
    },
    resetFn() {
      this.$refs.refBaseForm.resetFields();
    },
  },
};
</script>
<style scoped>
.yu-base-panel-right-content .el-button-group {
  padding: 0;
}
</style>
