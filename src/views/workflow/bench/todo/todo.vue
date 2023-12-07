
<template>
  <div>
    <yu-panel :title="$t('wftodolist.title')" panel-type="normal" no-padding-top>
      <template slot="filter">
        <yu-xform v-model="formdata" related-table-name="reftable" ref="searchForm">
          <yu-xform-group :column="4">
            <yu-xform-item :label="$t('wftodolist.lcslh')" :placeholder="$t('wftodolist.lcslh')" ctype="input" name="instanceId"></yu-xform-item>
            <yu-xform-item :label="$t('wftodolist.flowname')" :placeholder="$t('wftodolist.flowname')" ctype="input" name="flowName"></yu-xform-item>
            <yu-xform-item :label="$t('wftodolist.ywlsh')" :placeholder="$t('wftodolist.ywlsh')" ctype="input" name="bizId"></yu-xform-item>
            <yu-xform-item :label="$t('wftodolist.nodestate')" :placeholder="$t('wftodolist.nodestate')" ctype="select" name="nodeState" data-code="NODE_STATE"></yu-xform-item>
            <yu-xform-item :label="$t('wftodolist.flowstate')" :placeholder="$t('wftodolist.flowstate')" ctype="select" name="flowState" data-code="FLOW_STATE"></yu-xform-item>
            <div slot="custom" class="search-btn-group" align="right">
              <yu-button type="primary" @click="searchFn" style="margin-left: 10px;">{{ $t('wfbutton.find') }}</yu-button>
              <yu-button @click="resetFn">{{ $t('wfbutton.reset') }}</yu-button>
            </div>
          </yu-xform-group>
        </yu-xform>
      </template>
      <yu-xtable ref="reftable" :row-index="true" request-type="POST" :base-params="baseParams" :data-url="urls.index">
        <yu-xtable-column :label="$t('wftodolist.lcslh')" prop="instanceId" width="200">
          <template slot-scope="scope">
            <a class="underline" @click="rowDblclick(scope.row)">{{ scope.row.instanceId }}</a>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wftodolist.ywlsh')" prop="bizId" width="200"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftodolist.flowname')" prop="flowName" width="120"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftodolist.flowstarter')" prop="flowStarterName" width="100"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftodolist.khbh')" prop="bizUserId" width="100"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftodolist.khmc')" prop="bizUserName" width="100"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftodolist.nodename')" prop="nodeName" width="110"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftodolist.username')" prop="userName" width="100"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftodolist.starttime')" prop="startTime" width="170" :formatter="formatData"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftodolist.lastnodename')" prop="lastNodeName" width="110"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftodolist.lastusername')" prop="lastUserName" width="80" :hide-column="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftodolist.nodestate')" prop="nodeState" min-width="80" align="center" show-overflow-tooltip>
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
        <yu-xtable-column :label="$t('wftodolist.signstate')" prop="signIn" min-width="85" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <yu-tag type="gray" v-if="scope.row.signIn==0">{{ $t('wfsignstate.sign0') }}</yu-tag>
            <yu-tag type="danger" v-if="scope.row.signIn==1">{{ $t('wfsignstate.sign1') }}</yu-tag>
            <yu-tag type="success" v-if="scope.row.signIn==2">{{ $t('wfsignstate.sign2') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wftodolist.flowstate')" prop="flowState" min-width="85" align="center" show-overflow-tooltip>
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
        <yu-xtable-column :label="$t('wftodolist.biztype')" prop="bizType" width="90" align="center" :hide-column="true" :show-overflow-tooltip="true"></yu-xtable-column>
      </yu-xtable>
    </yu-panel>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { sessionStore, lookup } from '@/utils'
import { parseTime } from '@/utils/util'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
// 同时注册多个字典类型（请直接一次性注册，不要多次调用reg方法）
lookup.reg('NODE_STATE, FLOW_STATE');
export default {
  data: function () {
    return {
      formdata: {},
      urls: {
        index: backend.workflowService + '/api/bench/todo'
      },
      // 查询当前办理人的待办
      baseParams: {},
      formatData : e => {
        return parseTime(e.startTime, '{y}-{m}-{d}')
      },
    };
  },
  computed: {
    ...mapGetters([
      'userCode'
    ])
  },
  watch: {
    $route(to) {
      if (to.path === "/workflow/bench/todo/todo") {
        // this.$refs.reftable.remoteData();
        this.searchFn();
      }
    },
    deep: true
  },
  created () {
    this.baseParams = {
      userId: this.userCode,
      flowState: "R"
    }
    this.returnBackFuncId = this.$route.name;
  },
  methods: {
    rowDblclick: function (row, event) {
      // 往实例信息页面跳转
      var query = {
        instanceId: row.instanceId,
        nodeId: row.nodeId,
        userId: row.userId,
        returnBackFuncId: this.$route.name,
        returnBackRootId: this.$route.name
      };

      if (row.flowState == 'H') {
        this.$message({
          message: this.$t('wftodolist.lcslcygqztwfjxcz'),
          type: 'warning'
        });
      } else {
        this.$router.replace({ name: 'instanceInfo', query });
      }
    },
    searchFn: function () {
      var _this = this;
      _this.$refs.searchForm.validate(function(valid) {
        if (valid) {
          var model = _this.$refs.searchForm.formdata;
          var params = {
            // flowState: "R",
            userId: _this.userCode,
            flowName: model.flowName ? '%' + model.flowName + '%' : "",
            instanceId: model.instanceId ? model.instanceId : "",
            bizId: model.bizId ? model.bizId : "",
            nodeState: model.nodeState ? model.nodeState : "",
            flowState: model.flowState ? model.flowState : "R",
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
