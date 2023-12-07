<template>
  <div>
    <yu-panel :title="$t('wfhismonitor.title1')" panel-type="normal" no-padding-top>
      <template slot="filter">
        <yu-xform v-model="formdata" related-table-name="reftable" ref="searchForm" label-width="120px">
          <yu-xform-group :column="4">
            <yu-xform-item :label="$t('wfhismonitor.lcslh')" :placeholder="$t('wfhismonitor.lcslh')" ctype="input" name="instanceId"></yu-xform-item>
            <yu-xform-item :label="$t('wfhismonitor.ywlsh')" :placeholder="$t('wfhismonitor.ywlsh')" ctype="input" name="bizId"></yu-xform-item>
            <yu-xform-item :label="$t('wfhismonitor.flowname')" :placeholder="$t('wfhismonitor.flowname')" ctype="input" name="flowName"></yu-xform-item>
            <div slot="custom" class="search-btn-group">
              <yu-button type="primary" @click="searchFn" style="margin-left: 10px;">{{ $t('wfbutton.find') }}</yu-button>
              <yu-button @click="resetFn">{{ $t('wfbutton.reset') }}</yu-button>
            </div>
          </yu-xform-group>
        </yu-xform>
      </template>

      <yu-xtable ref="reftable" request-type="POST" :base-params="baseParams" :data-url="urls.index" show-hidden-menu>
        <yu-xtable-column :label="$t('wfhismonitor.lcslh')" prop="instanceId" width="170">
          <template slot-scope="scope">
            <a class="underline" @click="customRowOp(scope,'DETAIL')">{{ scope.row.instanceId }}</a>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfhismonitor.ywlsh')" prop="bizId" width="170"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhismonitor.flowname')" prop="flowName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhismonitor.flowstarter')" prop="flowStarterName" width="100"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhismonitor.khbh')" prop="bizUserId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhismonitor.khmc')" prop="bizUserName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhismonitor.flowstate')" prop="flowState" min-width="85" align="center" :show-overflow-tooltip="true">
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
        <yu-xtable-column :label="$t('wfhismonitor.starttime')" prop="startTime" width="170" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhismonitor.endtime')" prop="endTime" width="170" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhismonitor.biztype')" prop="bizType" min-width="100" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfhismonitor.option')" min-width="180" fixed="right" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button type="text" @click="customRowOp(scope,'TRACK')">{{ $t('wfbutton.track') }}</el-button>
            <el-button type="text" @click="customRowOp(scope,'ACTIVATE')">{{ $t('wfhismonitor.activate') }}</el-button>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>

    <el-dialog-x :title="$t('wfhismonitor.title2')" :visible.sync="trackDialogVisible" height="490px" width="70%">
      <el-row>
        <el-col>
          <div id="nwfTrackPage">
            <work-travel :work-travel-data="workTravelData" v-if="trackDialogVisible == true"></work-travel>
            <!-- <router-view /> -->
          </div>
        </el-col>
      </el-row>
    </el-dialog-x>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { sessionStore } from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
import workTravel from '@/views/workflow/studio/wfmonitor/workTravel/workTravel.vue'
const cite = {}
export default {
  name: 'wfendinstance',
  components: { workTravel },
  data: function () {
    var _this = this;

    return {
      formdata: {},
      urls: {
        index: backend.workflowService + '/api/monitor/his',
        activate: backend.workflowService + '/api/core/activate'
      },
      workTravelData: null,
      baseParams: {},
      height: sessionStore.get(VIEW_SIZE).height - 103,
      trackDialogVisible: false,
      nwfTrackPage: 'nwfTrackPage'
    };
  },
  computed: {
    ...mapGetters(['userCode'])
  },
  methods: {
    customRowOp: function (scope, op) {
      // 表格操作按钮事件
      var _this = this; // 当前行号：scope.$index 当前行数据：scope.row 当前列对象：scope.column
      // this.$alert('你现在正在操作：' + op + '当前行ID值为：' + scope.row.flowId, '提示');
      // console.log(scope.row.flowId);


      var params = {
        instanceId: scope.row.instanceId,
        flowId: scope.row.flowId,
        type: 'HIS',
        returnBackFuncId: this.$route.name
      };
      if (op == 'DETAIL') {
        this.$router.replace({ name: 'runInstanceInfo', params });
      } else if (op == 'ACTIVATE') {
        _this.activateFn(scope.row.instanceId);
      } else if (op == 'TRACK') {
        _this.trackDialogVisible = true;
        var flowId = scope.row.flowId;
        var routeId = 'router_flow_' + flowId;
        var url = 'workflow/studio/wfmonitor/wfendinstance/workTravel'; // 判断路由是否已经存在

        _this.workTravelData = params;
      }
    },
    // 将已结束的-否决的流程激活重新办理
    activateFn: function (instanceId) {
      var _this = this;

      _this.$confirm(_this.$t('wfhismonitor.msgsureactivite'), _this.$t('wfhismonitor.tip'), {
        confirmButtonText: _this.$t('wfbutton.sure'),
        cancelButtonText: _this.$t('wfbutton.cancel'),
        type: 'warning',
        center: true
      }).then(function () {
        var param = {
          instanceId: instanceId,
          currentUserId: _this.userCode
        };
        _this.$request({
          method: 'POST',
          data: param,
          url: _this.urls.activate
        }).then(({code, message, data}) => {
          if (code == 0) {
            // 跳转到之前的页面
            _this.searchFn();

            _this.$message({
              message: data.tip + ';',
              type: 'success',
              duration: 4000
            });
          } else {
            _this.$message({
              message: message + ';',
              type: 'error',
              duration: 4000
            });
          }
        })
      }).catch(function () {});
    },
    searchFn: function () {
      var _this = this;
      _this.$refs.searchForm.validate(function(valid) {
        if (valid) {
          var model = _this.$refs.searchForm.formdata;
          var params = {
            flowName: model.flowName ? '%' + model.flowName + '%' : "",
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
