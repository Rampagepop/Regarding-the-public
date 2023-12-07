
<template>
  <div>
    <yu-panel :title="$t('wftaskpoolinfo.title')" panel-type="normal" class="adjust-height" no-padding-top>
      <template slot="right">
        <yu-toolBar>
          <yu-button @click="backFn">{{ $t('wftaskpoolinfo.return') }}</yu-button>
        </yu-toolBar>
      </template>
      <template slot="filter">
        <yu-xform v-model="formdata" related-table-name="reftable" ref="searchForm" :custom-search-fn="searchFn" :custom-reset-fn="resetFn" form-type="search">
          <yu-xform-group :column="4">
            <yu-xform-item :label="$t('wftaskpoolinfo.lcslh')" :placeholder="$t('wftaskpoolinfo.lcslh')" ctype="input" name="instanceId"></yu-xform-item>
            <yu-xform-item :label="$t('wftaskpoolinfo.khmc')" :placeholder="$t('wftaskpoolinfo.khmc')" ctype="input" name="bizUserName"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <yu-xtable ref="reftable" :row-index="true" request-type="POST" :base-params="baseParams" @row-dblclick="rowDblclick" show-hidden-menu :data-url="urls.index" :default-load="false">
        <yu-xtable-column :label="$t('wftaskpoolinfo.lcslh')" prop="instanceId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftaskpoolinfo.ywlsh')" prop="bizId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftaskpoolinfo.flowname')" prop="flowName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftaskpoolinfo.flowstarter')" prop="flowStarterName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftaskpoolinfo.khbh')" prop="bizUserId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftaskpoolinfo.khmc')" prop="bizUserName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftaskpoolinfo.nodename')" prop="nodeName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftaskpoolinfo.username')" prop="userName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftaskpoolinfo.starttime')" prop="startTime" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftaskpoolinfo.nodestate')" prop="nodeState" :resizable="true" align="center">
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
        <yu-xtable-column :label="$t('wftaskpoolinfo.biztype')" prop="bizType" :resizable="true" align="center" :hide-column="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftaskpoolinfo.option')" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" @click="customRowOp(scope,'edit')">{{ $t('wftaskpoolinfo.sign') }}</el-button>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { sessionStore } from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
const data = {}
const cite = {}
export default {
  data: function () {
    var poolId = this.$route.params.poolId;
    return {
      urls: {
        index: backend.workflowService + '/api/bench/todo',
        signIn: backend.workflowService + '/api/core/signTaskPool'
      },
      formdata: {},
      baseParams: {},
      height: sessionStore.get(VIEW_SIZE).height - 103,
      poolId: poolId,
      currentOrgId: '',
      currentUserId: '',
      returnBackFuncId: '',
      returnBackRootId: ''
    };
  },
  computed: {
    ...mapGetters([
      "userCode", "org"
    ])
  },
  created () {
    this.currentOrgId = this.org.code
    this.currentUserId = this.userCode
  },
  mounted: function () {
    // 进入初始化
    var data = this.$route.query;
    this.poolId = data.poolId;
    this.baseParams = {
      userId: 'T.' + this.poolId,
      currentUserId: 'T.' + this.poolId
    }
    this.returnBackFuncId = data.returnBackFuncId;
    this.returnBackRootId = data.returnBackRootId;
  },
  methods: {
    customRowOp: function (scope, op) {
      var _this = this; // 当前行号：scope.$index
      // 当前行数据：scope.row
      // 当前列对象：scope.column
      // this.$alert('你现在正在操作：' + op + '当前行ID值为：' + scope.row.flowId, '提示');
      if (op == 'edit') {
        _this.signIn(scope.row);
      }
    },
    signIn: function (row) {
      // 签收
      var _this = this;
      var param = {
        instanceId: row.instanceId,
        nodeId: row.nodeId,
        userId: _this.userCode,
        poolId: _this.poolId
      };
      _this.$request({
        method: 'POST',
        data: param,
        url: _this.urls.signIn
      }).then(({code, message, data}) => {
        if (code == 0) {
          _this.$message({message: data.tip, type: "success"});
          _this.$refs.reftable.remoteData();
          // 往实例信息页面跳转
          var query = {
            instanceId: row.instanceId,
            nodeId: row.nodeId,
            userId: _this.currentUserId,
            returnBackFuncId: _this.returnBackFuncId,
            returnBackRootId: _this.$route.name
          };
          if (row.flowState !== 'H') {
            _this.$router.replace({ name: 'instanceInfo', query });
          }
        } else {
          _this.$message(message);
        }
      });
    },
    backFn: function () {
      this.$router.rollback({name: this.returnBackFuncId, params: {rollback: true}});
    },
    rowDblclick: function (row, event) {
      // 往实例信息页面跳转
      var param = {
        instanceId: row.instanceId,
        nodeId: row.nodeId,
        // userId: row.userId,
        returnBackFuncId: this.$route.name,
        returnBackRootId: this.$route.name
      };
    },
    searchFn: function () {
      var _this = this;
      _this.$refs.searchForm.validate(function(valid) {
        if (valid) {
          var model = _this.$refs.searchForm.formdata;
          var params = {
            userId: 'T.' + _this.poolId,
            currentUserId: 'T.' + _this.poolId,
            bizUserName: model.bizUserName ? '%' + model.bizUserName + '%' : "",
            instanceId: model.instanceId ? model.instanceId : ""
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
    /**
     * 快速查询
     * @param e 模糊查询关键字
     */
    fuzzyQuery: function(e) {
      var params = {
        userId: 'T.' + this.poolId,
        currentUserId: 'T.' + this.poolId,
        instanceId: e.value
      };
      var param = {
        condition: JSON.stringify(params)
      };
      this.$refs.reftable.remoteData(params);
      this.$refs.searchForm.resetFields(); // 清空精确查询查询参数
    }
  }

}
</script>
