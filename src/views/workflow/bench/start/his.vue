
<template>
  <div>
    <yu-panel :title="$t('wfstarthislist.title')" :collapse-hide="false">
      <yu-xform v-model="formdata" related-table-name="reftable" ref="searchForm" label-width="120px">
        <yu-xform-group :column="4">
          <yu-xform-item :label="$t('wfstarthislist.lcslh')" :placeholder="$t('wfstarthislist.lcslh')" ctype="input" name="instanceId"></yu-xform-item>
          <yu-xform-item :label="$t('wfstarthislist.flowname')" :placeholder="$t('wfstarthislist.flowname')" ctype="input" name="flowName"></yu-xform-item>
          <yu-xform-item :label="$t('wfstarthislist.ywlsh')" :placeholder="$t('wfstarthislist.ywlsh')" ctype="input" name="bizId"></yu-xform-item>
          <yu-xform-item :label="$t('wfstarthislist.khmc')" :placeholder="$t('wfstarthislist.khmc')" ctype="input" name="bizUserName"></yu-xform-item>
          <yu-xform-item :label="$t('wfstarthislist.khbh')" :placeholder="$t('wfstarthislist.khbh')" ctype="input" name="bizUserId"></yu-xform-item>
          <div slot="custom" class="search-btn-group">
            <yu-button type="primary" @click="searchFn" style="margin-left: 30px;">{{ $t('wfbutton.find') }}</yu-button>
            <yu-button @click="resetFn">{{ $t('wfbutton.reset') }}</yu-button>
          </div>
        </yu-xform-group>
      </yu-xform>
      <yu-xtable ref="reftable" :row-index="true" request-type="POST" :base-params="baseParams" :data-url="urls.index" show-hidden-menu>
        <yu-xtable-column :label="$t('wfstarthislist.lcslh')" prop="instanceId" :resizable="true">
          <template slot-scope="scope">           
            <a class="underline" @click="rowDblclick(scope.row)">{{ scope.row.instanceId }}</a>          
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfstarthislist.ywlsh')" prop="bizId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfstarthislist.flowname')" prop="flowName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfstarthislist.flowStarterName')" prop="flowStarterName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfstarthislist.khbh')" prop="bizUserId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfstarthislist.khmc')" prop="bizUserName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfstarthislist.starttime')" prop="startTime" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfstarthislist.endtime')" prop="endTime" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfstarthislist.flowstate')" prop="flowState" :resizable="true" align="center">
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
        <yu-xtable-column :label="$t('wfstarthislist.biztype')" prop="bizType" :resizable="true" align="center"></yu-xtable-column>
      </yu-xtable>
    </yu-panel>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { sessionStore } from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
export default {
  data: function () {
    var _this = this;

    return {
      formdata: {},
      urls: {
        index: backend.workflowService + '/api/bench/start/his'
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
      var _this = this;

      if (row.length < 1) {
        _this.$message({
          message: _this.$t('wfstarthislist.qxxzytjl'),
          type: 'warning'
        });

        return;
      }

      var button = {
        hungUp: '0',
        tackBack: '0',
        urged: '0',
        recall: '0',
        activate: '1'
      };
      var query = {
        instanceId: row.instanceId,
        userId: row.userId,
        type: 'HIS',
        hungUp: '0',
        tackBack: '0',
        urged: '0',
        recall: '0',
        activate: '1',
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
            flowName: model.flowName ? '%' + model.flowName + '%' : "",
            bizUserName: model.bizUserName ? '%' + model.bizUserName + '%' : "",
            instanceId: model.instanceId ? model.instanceId : "",
            bizUserId: model.bizUserId ? model.bizUserId : "",
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
