
<template>
  <div>
    <yu-panel :title="$t('wfhislist.title')" :collapse-hide="false">
      <yu-xform v-model="formdata" related-table-name="reftable" ref="searchForm">
        <yu-xform-group :column="4">
          <yu-xform-item :label="$t('wfhislist.lcslh')" :placeholder="$t('wfhislist.lcslh')" ctype="input" name="instanceId"></yu-xform-item>
          <yu-xform-item :label="$t('wfhislist.ywlsh')" :placeholder="$t('wfhislist.ywlsh')" ctype="input" name="bizId"></yu-xform-item>
          <yu-xform-item :label="$t('wfhislist.flowStarterName')" :placeholder="$t('wfhislist.flowStarterName')" ctype="input" name="flowStarterName"></yu-xform-item>
          <div slot="custom" class="search-btn-group">
            <yu-button type="primary" @click="searchFn" style="margin-left: 10px;">{{ $t('wfbutton.find') }}</yu-button>
            <yu-button @click="resetFn">{{ $t('wfbutton.reset') }}</yu-button>
          </div>
        </yu-xform-group>
      </yu-xform>
      <yu-xtable ref="reftable" :row-index="true" request-type="POST" :base-params="baseParams" :data-url="urls.index" show-hidden-menu>
        <yu-xtable-column :label="$t('wfhislist.lcslh')" prop="instanceId" :resizable="true">
          <template slot-scope="scope">
            <a class="underline" @click="rowDblclick(scope.row)">{{ scope.row.instanceId }}</a>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfhislist.ywlsh')" prop="bizId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhislist.flowname')" prop="flowName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhislist.flowStarterName')" prop="flowStarterName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhislist.khbh')" prop="bizUserId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhislist.khmc')" prop="bizUserName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhislist.starttime')" prop="startTime" :resizable="true" :formatter="formatData"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhislist.endtime')" prop="endTime" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhislist.nodeid')" prop="nodeName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhislist.nodename')" prop="nodeName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhislist.nodestate')" prop="nodeState" :resizable="true" align="center">
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
        <yu-xtable-column :label="$t('wfhislist.flowstate')" prop="flowState" :resizable="true" align="center">
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
        <yu-xtable-column :label="$t('wfhislist.biztype')" prop="bizType" :resizable="true" align="center" :hide-column="true"></yu-xtable-column>
      </yu-xtable>
    </yu-panel>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { sessionStore } from '@/utils'
import { parseTime } from '@/utils/util'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
export default {
  data: function () {
    var _this = this;

    return {
      formdata: {},
      urls: {
        index: backend.workflowService + '/api/bench/his'
      },
      baseParams: {},
      height: sessionStore.get(VIEW_SIZE).height - 103,
      formatData:e => {
        return parseTime(e.startTime, '{y}-{m}-{d}')
      },
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
      var button = {
        hungUp: '0',
        takeBack: '0',
        urged: '0',
        activate: '0'
      };
      var query = {
        instanceId: row.instanceId,
        userId: row.userId,
        type: 'HIS',
        isShow: 1,
        hungUp: '0',
        takeBack: '0',
        urged: '0',
        activate: '0',
        returnBackFuncId: this.$route.name,
        returnBackRootId: this.$route.name
      };

      if (row.flowState == 'H') {
        this.$message({
          message: this.$t('wfhislist.lcslcygqztwfjxcz'),
          type: 'warning'
        });
      } else {
        this.$router.replace({ name: 'instanceInfoLite', query });
      }
    },
    searchFn: function () {
      var _this = this;
      _this.$refs.searchForm.validate(function(valid) {
        if (valid) {
          var model = _this.$refs.searchForm.formdata;
          var params = {
            userId: _this.userCode,
            flowStarterName: model.flowStarterName ? '%' + model.flowStarterName + '%' : "",
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
