
<template>
  <div>
    <yu-panel :title="$t('wfmeethislist.title')" panel-type="normal" no-padding-top>
      <template slot="filter">
        <yu-xform ref="searchForm" v-model="formdata" related-table-name="reftable" label-width="120px">
          <yu-xform-group :column="3">
            <yu-xform-item :label="$t('wfmeethislist.lcslh')" :placeholder="$t('wfmeethislist.lcslh')" ctype="input" name="instanceId"></yu-xform-item>
            <yu-xform-item :label="$t('wfmeethislist.meetsub')" :placeholder="$t('wfmeethislist.meetsub')" ctype="input" name="mettingSub" fuzzy-query="both"></yu-xform-item>
            <yu-xform-item :label="$t('wfmeethislist.ywlsh')" :placeholder="$t('wfmeethislist.ywlsh')" name="bizId" ctype="input"></yu-xform-item>
            <yu-xform-item :label="$t('wfmeethislist.meetyear')" :placeholder="$t('wfmeethislist.meetyear')" name="mettingYear" ctype="input"></yu-xform-item>
            <yu-xform-item :label="$t('wfmeethislist.meetno')" :placeholder="$t('wfmeethislist.meetno')" name="mettingNo" ctype="input"></yu-xform-item>
            <div slot="custom" class="btn-group" style="text-align: right;padding-right: 20px">
              <yu-button type="primary" @click="searchFn">查询</yu-button>
              <yu-button @click="resetFn">重置</yu-button>
            </div>
          </yu-xform-group>
        </yu-xform>
      </template>
      <yu-xtable ref="reftable" :row-index="true" :base-params="baseParams" :data-url="urls.index" show-hidden-menu>
        <yu-xtable-column :label="$t('wfmeethislist.lcslh')" prop="instanceId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.ywlsh')" prop="bizId" :resizable="true" :hide-column="false"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.meetsub')" prop="mettingSub" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.starttime')" prop="startTime" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.endtime')" prop="endTime" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.meetyear')" prop="mettingYear" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.meetno')" prop="mettingNo" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.meetcomment')" prop="mettingComment" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.votestate')" prop="mettingSts" :resizable="true">
          <template slot-scope="scope">
            <yu-tag type="success" v-if="scope.row.mettingSts=='Y'">{{ $t('wfvotestate.votestatey') }}</yu-tag>
            <yu-tag type="danger" v-if="scope.row.mettingSts=='N'">{{ $t('wfvotestate.votestaten') }}</yu-tag>
            <yu-tag type="warning" v-if="scope.row.mettingSts=='G'">{{ $t('wfvotestate.votestateg') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.mettingSts==null">{{ $t('wfvotestate.votestatee') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.userid')" prop="userId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.username')" prop="userName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.option')" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="customRowOp(scope,'vote')">{{ $t('wfbutton.vote') }}</el-button>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <el-dialog-x :title="$t('wfmeethislist.vote')" :visible.sync="dialogVisible" width="650px" @close="cancel">
      <yu-xform ref="reform" label-width="100px" v-model="reformData">
        <yu-xform-group v-for="(item, index) in updateFields" :key="index" :column="item.columnCount">
          <yu-xform-item v-for="field in item.fields" :key="field.field" :label="field.label" :ctype="field.type" :options="field.options" :name="field.field" :rules="field.rules" :disabled="field.disabled || false" :hidden="field.hidden || false"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <!-- <el-form-x ref="reform" :group-fields="updateFields" label-width="100px"></el-form-x> -->
      <div slot="footer" align="center">
        <el-button type="primary" @click="nwfVoteFn">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="cancel">{{ $t('wfbutton.cancel') }}</el-button>
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
    var ResultOptions = [{
      key: 'Y',
      value: this.$t('wfvotestate.votestatey')
    }, {
      key: 'N',
      value: this.$t('wfvotestate.votestaten')
    }, {
      key: 'G',
      value: this.$t('wfvotestate.votestateg')
    }];
    return {
      reformData: {},
      urls: {
        index: backend.workflowService + '/api/metting/myOp',
        vote: backend.workflowService + '/api/metting/op'
      },
      updateFields: [{
        columnCount: 2,
        fields: [{
          label: this.$t('wfmeethislist.lcslh'),
          field: 'instanceId',
          type: 'input',
          disabled: true,
          rules: [{
            required: true,
            message: this.$t('wfmeethislist.msgbtx')
          }]
        }, {
          label: this.$t('wfmeethislist.ywlsh'),
          field: 'bizId',
          type: 'input',
          disabled: true,
          rules: [{
            required: false,
            message: this.$t('wfmeethislist.msgbtx')
          }]
        }, {
          label: this.$t('wfmeethislist.userid'),
          field: 'userId',
          type: 'input',
          disabled: true,
          rules: [{
            required: true,
            message: this.$t('wfmeethislist.msgbtx')
          }]
        }, {
          label: this.$t('wfmeethislist.username'),
          field: 'userName',
          type: 'input',
          disabled: true,
          rules: [{
            required: false,
            message: this.$t('wfmeethislist.msgbtx')
          }]
        }, {
          label: this.$t('wfmeethislist.endtime'),
          field: 'endTime',
          type: 'input',
          hidden: true,
          rules: [{
            required: false,
            message: this.$t('wfmeethislist.msgbtx')
          }]
        }, {
          label: this.$t('wfmeethislist.meetsub'),
          field: 'mettingSub',
          type: 'input',
          disabled: true,
          rules: [{
            required: false,
            message: this.$t('wfmeethislist.msgbtx')
          }]
        }, {
          label: this.$t('wfmeethislist.starttime'),
          field: 'startTime',
          type: 'input',
          disabled: true,
          rules: [{
            required: false,
            message: this.$t('wfmeethislist.msgbtx')
          }]
        }, {
          label: this.$t('wfmeethislist.meetyear'),
          field: 'mettingYear',
          type: 'input',
          disabled: true,
          rules: [{
            required: false,
            message: this.$t('wfmeethislist.msgbtx')
          }]
        }, {
          label: this.$t('wfmeethislist.meetno'),
          field: 'mettingNo',
          type: 'input',
          disabled: true,
          rules: [{
            required: false,
            message: this.$t('wfmeethislist.msgbtx')
          }]
        }]
      }, {
        columnCount: 1,
        fields: [{
          field: 'mettingSts',
          label: this.$t('wfmeethislist.votestate'),
          type: 'select',
          options: ResultOptions,
          rules: [{
            required: true,
            message: this.$t('wfmeethislist.msgbtx'),
            trigger: 'blur'
          }]
        }, {
          label: this.$t('wfmeethislist.meetcomment'),
          field: 'mettingComment',
          type: 'textarea',
          rules: [
            {
              required: true,
              message: this.$t('wfmeethislist.msgbtx'),
              trigger: 'blur'
            },
            {
              max: 30,
              message: this.$t('wfmeethislist.msgcdxz'),
            },
            { validator: validator.speChar }
          ]
        }]
      }],
      baseParams: {},
      height: sessionStore.get(VIEW_SIZE).height - 103,
      dialogVisible: false,
      formdata: {}
    };
  },
  computed: {
    ...mapGetters([
      "userCode"
    ])
  },
  created () {
    this.baseParams = {
      // condition: {
      //   userId: this.userCode
      // }
      userId: this.userCode
    }
  },
  methods: {
    searchFn: function () {
      var params = {
        userId: this.userCode,
        instanceId: this.formdata.instanceId,
        mettingSub: this.formdata.mettingSub,
        bizId: this.formdata.bizId,
        mettingYear: this.formdata.mettingYear,
        mettingNo: this.formdata.mettingNo
      }
      this.$refs.reftable.remoteData(params)
    },
    resetFn: function () {
      this.$refs.searchForm.resetFields();
      this.$refs.reftable.remoteData({userId: this.userCode});
    },
    customRowOp: function (scope, op) {
      // 表格操作按钮事件
      var _this = this; // 当前行号：scope.$index
      // 当前行数据：scope.row
      // 当前列对象：scope.column
      // this.$alert('你现在正在操作：' + op + '当前行ID值为：' + scope.row.flowId, '提示');


      if (op == 'vote') {
        if (scope.row.mettingSts != null) {
          _this.$message({
            message: _this.$t('wfmeethislist.voteend'),
            type: 'warning'
          });
        } else {
          _this.$nextTick(function () {
            _this.voteFn(scope.row);
          });
        }
      }
    },
    voteFn: function (obj) {
      // if (this.$refs.reftable.selections.length !== 1) {
      //   this.$message({
      //     message: '请选择至少一条数据!',
      //     type: 'warning'
      //   });
      //   return false;
      // }

      // var obj = this.$refs.reftable.selections[0];
      this.dialogVisible = true;
      this.reformData = obj;
    },
    nwfVoteFn: function () {
      var _this = this;

      var param = {};
      _this.$refs.reform.validate(function (valid) {
        if (valid) {
          extend(param, _this.reformData);
          _this.$request({
            url: _this.urls.vote,
            data: param,
            method: 'POST'
          }).then(({code, message, data}) => {
            if (data) {
              _this.$message({ message: _this.$t('wfmeethislist.votesuccess'), type: 'success' });
              _this.$refs.reform.resetFields();
              _this.dialogVisible = false;
              _this.$refs.reftable.remoteData();
            }
          })
        } else {
          _this.$message({
            message: _this.$t('wfmeethislist.inputillegal'),
            type: 'warning'
          });

          return false;
        }
      });
    },
    cancel: function () {
      this.dialogVisible = false;
    }
  }

}
</script>
