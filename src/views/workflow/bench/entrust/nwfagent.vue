
<template>
  <yu-panel :title="$t('wfentrustlist.title')" :collapse-hide="false">
    <yu-xform v-model="formdata" related-table-name="reftable" ref="searchForm">
      <yu-xform-group :column="4">
        <yu-xform-item :label="$t('wfentrustlist.lcslh')" :placeholder="$t('wfentrustlist.lcslh')" ctype="input" name="instanceId"></yu-xform-item>
        <yu-xform-item :label="$t('wfentrustlist.ywlsh')" :placeholder="$t('wfentrustlist.ywlsh')" ctype="input" name="bizId"></yu-xform-item>
        <div slot="custom" class="search-btn-group">
          <yu-button type="primary" @click="searchFn" style="margin-left: 10px;">{{ $t('wfbutton.find') }}</yu-button>
          <yu-button @click="resetFn">{{ $t('wfbutton.reset') }}</yu-button>
        </div>
      </yu-xform-group>
    </yu-xform>
    <yu-xtable ref="reftable" :row-index="true" request-type="POST" :base-params="baseParams" :data-url="urls.index" show-hidden-menu>
      <yu-xtable-column :label="$t('wfentrustlist.lcslh')" prop="instanceId" :resizable="true" min-width="100px" :show-overflow-tooltip="true">
        <template slot-scope="scope">                                
          <a class="underline" @click="rowDblclick(scope.row)">{{ scope.row.instanceId }}</a>                            
        </template>
      </yu-xtable-column>
      <yu-xtable-column :label="$t('wfentrustlist.ywlsh')" prop="bizId" :resizable="true" min-width="100px" :show-overflow-tooltip="true"></yu-xtable-column>
      <yu-xtable-column :label="$t('wfentrustlist.flowname')" prop="flowName" :resizable="true"></yu-xtable-column>
      <yu-xtable-column :label="$t('wfentrustlist.khbh')" prop="bizUserId" :resizable="true"></yu-xtable-column>
      <yu-xtable-column :label="$t('wfentrustlist.khmc')" prop="bizUserName" :resizable="true"></yu-xtable-column>
      <yu-xtable-column :label="$t('wfentrustlist.username')" prop="userName" :resizable="true"></yu-xtable-column>
      <yu-xtable-column :label="$t('wfentrustlist.nodename')" prop="nodeName" :resizable="true"></yu-xtable-column>
      <yu-xtable-column :label="$t('wfentrustlist.starttime')" prop="startTime" :resizable="true" min-width="100px" :show-overflow-tooltip="true"></yu-xtable-column>
      <yu-xtable-column :label="$t('wfcopylist.nodestate')" prop="nodeState" :resizable="true" min-width="60px" :show-overflow-tooltip="true">
        <template slot-scope="scope">                
          <yu-tag type="gray" v-if="scope.row.nodeState=='O-0'">{{ $t('wfnodestate.nahui') }}</yu-tag>
          <yu-tag type="danger" v-if="scope.row.nodeState=='O-1'">{{ $t('wfnodestate.dahui') }}</yu-tag>
          <yu-tag type="warning" v-if="scope.row.nodeState=='O-2'">{{ $t('wfnodestate.tuihui') }}</yu-tag>
          <yu-tag type="gray" v-if="scope.row.nodeState=='O-5'">{{ $t('wfnodestate.cuiban') }}</yu-tag>
          <yu-tag type="gray" v-if="scope.row.nodeState=='O-6'">{{ $t('wfnodestate.change') }}</yu-tag>
          <yu-tag type="gray" v-if="scope.row.nodeState=='O-7'">{{ $t('wfnodestate.xieban') }}</yu-tag>
          <yu-tag type="gray" v-if="scope.row.nodeState=='O-9'">{{ $t('wfnodestate.jump') }}</yu-tag>
          <yu-tag type="success" v-if="scope.row.nodeState=='O-12'">{{ $t('wfnodestate.agree') }}</yu-tag>
          <yu-tag type="gray" v-if="scope.row.nodeState=='O-8'">{{ $t('wfnodestate.refuse') }}</yu-tag>
          <yu-tag type="gray" v-if="scope.row.nodeState=='O-14'">{{ $t('wfnodestate.end') }}</yu-tag>
          <yu-tag type="gray" v-if="scope.row.nodeState=='O-17'">{{ $t('wfnodestate.cancel') }}</yu-tag>
          <yu-tag type="gray" v-if="scope.row.nodeState=='O-26'">{{ $t('wfnodestate.buqian') }}</yu-tag>
          <yu-tag type="gray" v-if="scope.row.nodeState=='O-27'">{{ $t('wfnodestate.jiaqian') }}</yu-tag>
        </template>
      </yu-xtable-column>
      <yu-xtable-column :label="$t('wfcopylist.flowstate')" prop="flowState" :resizable="true" min-width="60px" :show-overflow-tooltip="true">
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
      <yu-xtable-column :label="$t('wfentrustlist.biztype')" prop="bizType" :resizable="true" align="center" :hidden-column="true"></yu-xtable-column>
    </yu-xtable>
  </yu-panel>
</template>
<script>
import { mapGetters } from "vuex"
import { sessionStore } from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
export default {
  data: function () {
    return {
      formdata: {},
      urls: {
        index: backend.workflowService + '/api/bench/entrust'
      },
      baseParams: {},
      height: sessionStore.get(VIEW_SIZE).height - 103
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
    rowDblclick: function (row, event) {
      // 往实例信息页面跳转
      var query = {
        instanceId: row.instanceId,
        nodeId: row.nodeId,
        isShow: 1,
        type: 'DONE',
        returnBackFuncId: this.$route.name,
        returnBackRootId: this.$route.name
      };
      this.$router.replace({ name: 'instanceInfoLite', query });
    },
    searchFn: function () {
      var _this = this;
      _this.$refs.searchForm.validate(function(valid) {
        if (valid) {
          var model = _this.$refs.searchForm.formdata;
          var params = {
            userId: _this.userCode,
            lastUserName: model.lastUserName ? '%' + model.lastUserName + '%' : "",
            instanceId: model.instanceId ? model.instanceId : "",
            bizId: model.bizId ? model.bizId : ""
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
