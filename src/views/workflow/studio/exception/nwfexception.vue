
<template>
  <div>
    <yu-panel :title="$t('wfexception.title1')" panel-type="normal" no-padding-top>
      <template slot="filter">
        <yu-xform v-model="formdata" related-table-name="reftable" ref="searchForm" label-width="120px">
          <yu-xform-group :column="4">
            <yu-xform-item :label="$t('wfexception.lcslh')" :placeholder="$t('wfexception.lcslh')" ctype="input" name="instanceId"></yu-xform-item>
            <yu-xform-item :label="$t('wfexception.ywlsh')" :placeholder="$t('wfexception.ywlsh')" ctype="input" name="bizId"></yu-xform-item>
            <yu-xform-item :label="$t('wfexception.nodename')" :placeholder="$t('wfexception.nodename')" ctype="input" name="nodeName"></yu-xform-item>
            <yu-xform-item :label="$t('wfexception.flowname')" :placeholder="$t('wfexception.flowname')" ctype="input" name="flowName"></yu-xform-item>
            <yu-xform-item :label="$t('wfexception.userid')" :placeholder="$t('wfexception.userid')" ctype="input" name="userId"></yu-xform-item>
            <yu-xform-item :label="$t('wfexception.optype')" :placeholder="$t('wfexception.optype')" ctype="select" name="opType" data-code="OP_TYPE"></yu-xform-item>
            <div slot="custom" class="search-btn-group">
              <yu-button type="primary" @click="searchFn" style="margin-left: 10px;">{{ $t('wfbutton.find') }}</yu-button>
              <yu-button @click="resetFn">{{ $t('wfbutton.reset') }}</yu-button>
            </div>
          </yu-xform-group>
        </yu-xform>
      </template>
      
      <yu-xtable ref="reftable" :row-index="true" request-type="POST" :base-params="baseParams" :data-url="urls.index" show-hidden-menu>
        <yu-xtable-column :label="$t('wfexception.lcslh')" prop="instanceId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfexception.ywlsh')" prop="bizId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfexception.flowname')" prop="flowName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfexception.flowid')" prop="flowId" :resizable="true" width="80"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfexception.nodeid')" prop="nodeId" :resizable="true" width="80"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfexception.nodename')" prop="nodeName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfexception.starttime')" prop="exceptionTime" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfexception.optype')" prop="opType" :resizable="true" width="100">
          <template slot-scope="scope">                
            <yu-tag type="gray" v-if="scope.row.opType=='O-0'">{{ $t('wfnodestate.nahui') }}</yu-tag>
            <yu-tag type="danger" v-if="scope.row.opType=='O-1'">{{ $t('wfnodestate.dahui') }}</yu-tag>
            <yu-tag type="warning" v-if="scope.row.opType=='O-2'">{{ $t('wfnodestate.tuihui') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.opType=='O-5'">{{ $t('wfnodestate.cuiban') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.opType=='O-6'">{{ $t('wfnodestate.change') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.opType=='O-7'">{{ $t('wfnodestate.xieban') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.opType=='O-9'">{{ $t('wfnodestate.jump') }}</yu-tag>
            <yu-tag type="success" v-if="scope.row.opType=='O-12'">{{ $t('wfnodestate.agree') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.opType=='O-15'">{{ $t('wfnodestate.chehui') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.opType=='O-10'">{{ $t('wfnodestate.weituo') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.opType=='O-16'">{{ $t('wfnodestate.faqi') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.opType=='O-13'">{{ $t('wfnodestate.zdtj') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.opType=='O-8'">{{ $t('wfnodestate.refuse') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.opType=='O-14'">{{ $t('wfnodestate.end') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.opType=='O-17'">{{ $t('wfnodestate.cancel') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.opType=='O-26'">{{ $t('wfnodestate.buqian') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.opType=='O-27'">{{ $t('wfnodestate.jiaqian') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfexception.userid')" prop="userId" :resizable="true" width="100"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfexception.biztype')" prop="bizType" :resizable="true" :hide-column="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfexception.option')" width="120" fixed="right">
          <template slot-scope="scope">                
            <el-button type="text" @click="customRowOp(scope,'detail')">{{ $t('wfexception.info') }}</el-button>
            <el-button type="text" @click="customRowOp(scope,'retry')">{{ $t('wfexception.retry') }}</el-button>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <el-dialog-x :title="$t('wfexception.title2')" :visible.sync="dialogVisible" width="1100px">
      <yu-xform ref="reform" label-width="110px" v-model="reformData">
        <yu-xform-group v-for="(item, index) in updateFields" :key="index" :column="item.columnCount">
          <yu-xform-item v-for="field in item.fields" :key="field.field" :label="field.label" :autosize="field.autosize" :ctype="field.type" :name="field.field" :hidden="field.hidden || false" :disabled="field.disabled || false"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="dialogVisible = false">{{ $t('wfexception.sure') }}</el-button>
      </div>
    </el-dialog-x>
  </div>
</template>
<script>
import { sessionStore, extend } from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
export default {
  data: function () {
    var _this = this;

    var autosize = {
      minRows: 5,
      maxRows: 25
    }; // 文本域大小

    return {
      reformData: {},
      formdata: {},
      urls: {
        index: backend.workflowService + '/api/nwfexception/query',
        retry: backend.workflowService + '/api/nwfexception/reTry'
      },
      updateFields: [{
        columnCount: 1,
        fields: [{
          label: '',
          field: 'exceptionInfo',
          type: 'textarea',
          autosize: autosize
        }]
      }],
      baseParams: {},
      height: sessionStore.get(VIEW_SIZE).height - 103,
      dialogVisible: false,
      viewType: 'DETAIL'
    };
  },
  methods: {
    customRowOp: function (scope, op) {
      var _this = this; // 当前行号：scope.$index
      // 当前行数据：scope.row
      // 当前列对象：scope.column
      // this.$alert('你现在正在操作：' + op + '当前行ID值为：' + scope.row.flowId, '提示');


      if (op == 'retry') {
        _this.retryFn(scope.row);
      } else if (op == 'detail') {
        _this.infoFn(scope.row);
      }
    },
    infoFn: function (row) {
      this.viewType = 'DETAIL';
      this.dialogVisible = true;
      this.$nextTick(function () {
        extend(this.reformData, row);
      });
    },
    retryFn: function (row) {
      var _this = this;

      var param = {
        pkId: row.pkId
      };
      _this.$request({
        method: 'POST',
        url: _this.urls.retry,
        data: param
      }).then(({code, message, data}) => {
        if (code == 0) {
          if (data == 0) {
            _this.$message({
              duration: 4000,
              message: message,
              type: 'success'
            });
          } else if (data == 1) {
            _this.$message({
              duration: 4000,
              message: message,
              type: 'error'
            });
          }
          _this.searchFn();
        } else {
          _this.$message({
            duration: 4000,
            message: message,
            type: 'error'
          });
        }
      })
    },
    searchFn: function () {
      var _this = this;
      _this.$refs.searchForm.validate(function(valid) {
        if (valid) {
          var model = _this.$refs.searchForm.formdata;
          var params = {
            flowName: model.flowName ? '%' + model.flowName + '%' : "",
            nodeName: model.nodeName ? '%' + model.nodeName + '%' : "",
            instanceId: model.instanceId ? model.instanceId : "",
            userId: model.userId ? model.userId : "",
            opType: model.opType ? model.opType : "",
            bizId: model.bizId ? model.bizId : ""
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
