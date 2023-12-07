
<template>
  <div>
    <yu-panel :title="$t('wfstarttodolist.title')" :collapse-hide="false">
      <yu-xform v-model="formdata" related-table-name="reftable" ref="searchForm" label-width="120px">
        <yu-xform-group :column="4">
          <yu-xform-item :label="$t('wfstarttodolist.lcslh')" :placeholder="$t('wfstarttodolist.lcslh')" ctype="input" name="instanceId"></yu-xform-item>
          <yu-xform-item :label="$t('wfstarttodolist.flowname')" :placeholder="$t('wfstarttodolist.flowname')" ctype="input" name="flowName"></yu-xform-item>
          <yu-xform-item :label="$t('wfstarttodolist.ywlsh')" :placeholder="$t('wfstarttodolist.ywlsh')" ctype="input" name="bizId"></yu-xform-item>
          <yu-xform-item :label="$t('wfstarttodolist.khmc')" :placeholder="$t('wfstarttodolist.khmc')" ctype="input" name="bizUserName"></yu-xform-item>
          <yu-xform-item :label="$t('wfstarttodolist.khbh')" :placeholder="$t('wfstarttodolist.khbh')" ctype="input" name="bizUserId"></yu-xform-item>
          <div slot="custom" class="search-btn-group">
            <yu-button type="primary" @click="searchFn" style="margin-left: 30px;">{{ $t('wfbutton.find') }}</yu-button>
            <yu-button @click="resetFn">{{ $t('wfbutton.reset') }}</yu-button>
          </div>
        </yu-xform-group>
      </yu-xform>
      <yu-xtable ref="reftable" :row-index="true" request-type="POST" :base-params="baseParams" :data-url="urls.index" show-hidden-menu>
        <yu-xtable-column :label="$t('wfstarttodolist.lcslh')" prop="instanceId" :resizable="true">
          <template slot-scope="scope">                                
            <a class="underline" @click="rowDblclick(scope.row)">{{ scope.row.instanceId }}</a>                            
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfstarttodolist.ywlsh')" prop="bizId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfstarttodolist.flowname')" prop="flowName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfstarttodolist.flowStarterName')" prop="flowStarterName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfstarttodolist.khbh')" prop="bizUserId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfstarttodolist.khmc')" prop="bizUserName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfstarttodolist.starttime')" prop="startTime" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfstarttodolist.flowstate')" prop="flowState" :resizable="true" align="center">
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
        <yu-xtable-column :label="$t('wfstarttodolist.biztype')" prop="bizType" :resizable="true" align="center"></yu-xtable-column>
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
      urls: {
        index: backend.workflowService + '/api/bench/start/doing'
      },
      formdata: {},
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
          message: _this.$t('wfstarttodolist.qxxzytjl'),
          type: 'warning'
        });

        return;
      }

      var button = {
        hungUp: '1',
        takeBack: '0',
        urged: '0',
        recall: '1',
        activate: '0'
      };
      var query = {
        instanceId: row.instanceId,
        userId: row.userId,
        type: 'DONE',
        hungUp: '1',
        takeBack: '0',
        urged: '0',
        recall: '1',
        activate: '0',
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
