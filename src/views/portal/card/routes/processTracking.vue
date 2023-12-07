<template>
  <div>
    <card-wrap :cardName="cardName">
      <template slot="topCenter">
        <div class="yu-title">
          <div class="yu-title-right">
            <span
              :class="[
                'mode',
                { activeMode: mode === $t('card.processTracking.sx') },
              ]"
              @click="changeMode($t('card.processTracking.sx'))"
            >
              {{ $t("card.processTracking.sx") }}
            </span>
            <span
              :class="[
                'mode',
                { activeMode: mode === $t('card.processTracking.fk') },
              ]"
              @click="changeMode($t('card.processTracking.fk'))"
            >
              {{ $t("card.processTracking.fk") }}
            </span>
          </div>
        </div>
      </template>
      <div class="process-content-wrap" v-if="listData.length !== 0">
        <yu-row :gutter="16">
          <yu-col :span="8" v-for="(item, index) of listData" :key="index">
            <div class="yu-grid">
              <div class="yu-grid-serinalNum" :title="item.bizId">
                {{ $t("card.processTracking.bizId") }}：
                <span :title="item.bizId">
                  <a class="underline" @click="btnShowDetailFn(item)">
                    {{ item.bizId }}
                  </a>
                </span>
              </div>
              <div class="yu-grid-content">
                <div class="yu-grid-content-companyName">
                  {{ item.bizUserName }}
                </div>
                <div class="yu-grid-content-tag">
                  <yu-tag type="primary">{{
                    limitType[item.quotaType] ? limitType[item.quotaType] : "--"
                  }}</yu-tag>
                </div>
                <div class="yu-grid-content-info">
                  <div>
                    {{ $t("card.processTracking.fee") }}：<span>{{
                      moneyFormatter(item.fee, 2)
                        ? moneyFormatter(item.fee, 2)
                        : "--"
                    }}</span>
                  </div>
                  <div>
                    {{ $t("card.processTracking.startTime") }}：<span>{{
                      item.startTime && item.startTime.slice(0, 10)
                    }}</span>
                  </div>
                  <div>
                    {{ $t("card.processTracking.nodeName") }}：<span>{{
                      item.nodeName
                    }}</span>
                  </div>
                </div>
                <div class="yu-grid-content-btn">
                  <yu-button
                    size="small"
                    type="primary"
                    @click="btnShowDetailFn(item)"
                  >
                    {{ $t("card.processTracking.btnDetail") }}
                  </yu-button>
                  <yu-button size="small" @click="customRowOp(item, 'TRACK')">
                    {{ $t("card.processTracking.btnLog") }}
                  </yu-button>
                </div>
              </div>
            </div>
          </yu-col>
        </yu-row>
      </div>
      <empty-msg class="side-menu" v-if="listData.length === 0"></empty-msg>
      <template slot="menus">
        <li class="exportBox">
          <div class="showExportFn">导出</div>
          <yufp-excel-export
            class="hiddenExportFn"
            :show-progress="false"
            :export-url="excelExportUrl"
            :exportParam="exportParam"
            :title="$t('orgInfoManager.exceldc')"
          ></yufp-excel-export>
        </li>
        <li @click="moreFn">更多</li>
      </template>
    </card-wrap>
    <yu-xdialog
      :title="tracktitle"
      :visible.sync="trackDialogVisible"
      @close="trackClose"
      height="530px"
      width="70%"
    >
      <div :id="nwfTrackPage">
        <work-travel
          v-if="trackDialogVisible"
          :key="worktravelKey"
          :work-travel-data="workTravelData"
          @cellClickFn="cellClickFn"
        />
      </div>
    </yu-xdialog>
    <yu-xdialog
      title="流程图详情"
      :visible.sync="trackFinishDialogVisible"
      v-if="trackFinishDialogVisible"
      height="460px" width="960px">
      <div :id="nwfTrackPage">
        <workflow :flow-id="flowId"></workflow>
      </div>
    </yu-xdialog>
  </div>
</template>

<script>
import cardWrap from "@/views/portal/card/components/card-wrap";
import { moneyFormatter } from "@/utils/util";
import emptyMsg from "@/components/layout/emptyMsg/index.vue";
import workTravel from "@/views/workflow/studio/wfmonitor/workTravel/workTravel.vue";
import workflow from '@/views/workflow/studio/nwflist/workFlow/workFlow.vue'
import YufpExcelExport from "@/components/widgets/YufpExcelExport";
export default {
  name: "processTracking",
  components: {
    cardWrap,
    workTravel,
    workflow,
    emptyMsg,
    YufpExcelExport,
  },
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t("card.processTracking");
      },
    },
  },
  data() {
    return {
      moneyFormatter,
      listData: [],
      mode: this.$t("card.processTracking.sx"),
      limitType: this.$lookup.find("LIMIT_TYPE", false), // 额度类型
      trackDialogVisible: false,
      trackFinishDialogVisible: false,
      cancelButtonShow: false,
      resetButtonShow: false,
      tracktitle: this.$t("card.processTracking.tracktitle"),
      worktravelKey: 0,
      urls: {
        index: this.$backend.workflowService + "/api/monitor/todo",
        getNodeInfo:
          this.$backend.workflowService + "/api/monitor/getCurrentNodeIds",
        deleteByBizId:
          this.$backend.workflowService + "/api/core/deleteByBizId",
        resetNodeUser:
          this.$backend.workflowService + "/api/core/resetNodeUser",
        show: backend.workflowService + "/api/nwfflow/flow",
      },
      workTravelData: {},
      nwfTrackPage: "nwfTrackPage" + Date.now(),
      bizType: ["对公授信申请", "授信申请打回", "授信申请审批"],
      excelExportUrl: backend.portalService + "/api/xmhprocess/excelallexport", // Excel导出地址
      exportParam: {}, // 导出时的查询参数
    };
  },
  watch: {
    bizType: {
      handler(val) {
        this.exportParam.condition = JSON.stringify({
          bizTypes: val
        });
      },
      deep: true,
      immediate: true
    },
  },
  created() {
    this.$lookup.reg("LIMIT_TYPE");
    this.getData();
  },
  methods: {
    changeMode(val) {
      this.mode = val;
      if (this.mode === this.$t("card.processTracking.sx")) {
        this.bizType = ["对公授信申请", "授信申请打回", "授信申请审批"];
        this.getData();
      } else {
        this.bizType = [this.$t("card.pendingBusi.fksq")];
        this.getData();
      }
    },
    getData() {
      this.$request({
        url: backend.portalService + "/api/xmhprocess/allprocess",
        data: {
          condition: JSON.stringify({
            bizTypes: this.bizType,
          }),
          page: 1,
          size: 3,
        },
      }).then(({ code, message, data }) => {
        if (code === "0") {
          this.listData = data;
        }
      });
    },
    btnShowDetailFn(row) {
      // 已处理旧跳转到已处理页面 #TODO
      // 进行中就跳转到处理上
      // 往实例信息页面跳转
      var query = {
        instanceId: row.instanceId,
        nodeId: row.nodeId,
        userId: row.userId,
        returnBackFuncId: this.$route.name,
        returnBackRootId: this.$route.name,
      };
      // flowState 表示流程状态 R 运行 E 办结
      if (row.flowState == "H") {
        this.$message({
          message: "流程实例处于挂起状态,无法进行操作!",
          type: "warning",
        });
      }
      if(row.flowState === 'E') { // 已办结
        query['type'] = 'HIS'
        this.$router.push({ name: 'runInstanceInfo', query });
      }
      if(row.flowState === 'R') { // R 运行
      // type 表示当前节点状态 1-待办，2-已办，3-办结
        if (row.type === 1) {
          this.$router.push({ name: "instanceInfo", query });
        }
        if (row.type === 2) {
          query['type'] = 'DONE'
          this.$router.push({ name: 'instanceInfoLite', query });
        }
      }
    },
    customRowOp: function (item, op) {
      // flowState: R 运行 E 办结
      // 表格操作按钮事件
      // 当前行号：scope.$index 当前行数据：scope.row 当前列对象：scope.column
      // this.$alert('你现在正在操作：' + op + '当前行ID值为：' + scope.row.flowId, '提示');
      // console.log(scope.row.flowId);
      var param = {
        instanceId: item.instanceId,
        mainInstanceId: item.mainInstanceId,
        flowId: item.flowId,
        bizParam: item,
        type: "DONE",
        returnBackFuncId: this.$route.name,
        nodeInfo: [],
      };
      if (item.flowState === 'E') {
        // this.trackFinishDialogVisible = true;
        // this.flowId = item.flowId;
        this.trackDialogVisible = true;
        param['type'] = 'HIS'
        this.workTravelData = param;
        return;
      }

      if (op == "DETAIL") {
        this.$router.replace({ name: "runInstanceInfo", params: param });
      } else if (op == "DELETE") {
        this.deleteFn(item);
      } else if (op == "TRACK") {
        var params = {
          instanceId: item.instanceId,
        };
        this.$request({
          method: 'POST',
          url: this.urls.getNodeInfo,
          data: params,
        }).then(({ code, message, data }) => {
          if (code == 0) {
            if (data != null) {
              param.nodeInfo = data;
              var flowId = item.flowId;
              this.workTravelData = param;
              if (this.workTravelData.nodeInfo.length === 1) {
                this.selectNodeId = this.workTravelData.nodeInfo[0].nodeId;
                this.resetButtonShow = true;
              }
              this.checkNodeProperty(item.instanceId);
            }
          } else {
            this.$message({
              duration: 4000,
              message: "获取数据异常:" + message.substring(0, 100),
              type: "error",
            });
          }
        });
      }
    },
    checkNodeProperty: function (data) {
      var param = {
        instanceId: data,
      };
      var _this = this;
      _this
        .$request({
          method: "POST",
          url: backend.workflowService + "/api/core/myinstanceInfo",
          data: param,
        })
        .then(({ code, message, data }) => {
          if (code === "0" && data) {
            if (data.opType && data.opType["cancel"] === "1") {
              _this.cancelButtonShow = true;
            }
            _this.trackDialogVisible = true;
            _this.worktravelKey++;
          } else {
            _this.$message({
              duration: 4000,
              message: "获取数据异常:" + message.substring(0, 100),
              type: "error",
            });
          }
        });
    },
    trackClose: function () {
      this.trackDialogVisible = false;
      this.resetButtonShow = false;
      this.cancelButtonShow = false;
      this.workTravelData = {};
    },
    anolishFn() {
      var _this = this;
      _this
        .$confirm("确定作废此流程？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        })
        .then(function () {
          var param = {
            orgId: _this.orgCode,
            comment: {
              commentSign: "O-17",
              userComment: "管理员作废",
              instanceId: _this.workTravelData.instanceId,
              nodeId: _this.workTravelData.nodeInfo[0].nodeId,
              userId: _this.loginCode,
            },
          };
          _this
            .$request({
              method: "POST",
              data: param,
              url: backend.workflowService + "/api/core/cancel",
            })
            .then(({ code, message, data }) => {
              if (code === "0" && data.code === "0") {
                // 跳转到之前的页面
                _this.$message(data.tip + ";");
                _this.$refs.reftable.remoteData();
                _this.trackDialogVisible = false;
              } else {
                _this.$message({
                  message: "作废异常:" + message,
                  type: "error",
                });
              }
            });
        })
        .catch(function () {
          _this.$message({ type: "info", message: "已取消" });
        });
    },
    cellClickFn: function (cell) {
      console.log(cell);
      this.resetButtonShow = false;
      var nodeInfo = this.workTravelData.nodeInfo;
      if (nodeInfo && nodeInfo.length === 1) {
        this.selectNodeId = nodeInfo[0].nodeId;
        this.resetButtonShow = true;
      } else {
        this.selectNodeId = null;
        this.resetButtonShow = false;
        for (var i = 0; i < nodeInfo.length; i++) {
          if (
            cell.vertex &&
            cell.data.nid === nodeInfo[i].nodeId.split("_")[1]
          ) {
            // 待办节点
            this.selectNodeId = nodeInfo[i].nodeId;
            this.resetButtonShow = true;
            break;
          }
        }
      }
    },
    // 更多操作
    moreFn() {
      // this.$message("功能开发中，敬请期待。");
      // this.$router.push({
      //   name: 'wfruninstance',
      //   params: {
      //     flowName: this.mode
      //   },
      // });
      this.$router.push({path:'/portal/card/processCenter/processCenter', query:{'activeMode':'processTrack'}})
      // this.$router.push({
      //   name: 'processTrack'
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.yu-title {
  display: flex;
  flex-direction: row-reverse;
  line-height: 48px;
  &-left {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
  }
  &-right {
    .mode {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #999999;
      line-height: 14px;
      display: inline-block;
      margin-left: 16px;
      cursor: pointer;
    }
    .activeMode {
      color: #2877ff;
      padding-bottom: 8px;
      border-bottom: 1px solid #2877ff;
    }
  }
}
.yu-grid {
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  &-serinalNum {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    border-bottom: 1px dotted #ededed;
    padding: 12px 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &-content {
    padding: 4px 0 19px 16px;
    &-companyName {
      line-height: 40px;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #2877ff;
    }
    &-tag {
      .el-tag {
        height: 22px;
        box-sizing: border-box;
        line-height: 20px;
      }
    }
    &-info {
      padding-top: 6px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #999999;
      div {
        line-height: 26px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        span {
          color: #444444;
        }
      }
    }
    &-btn {
      margin-top: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .el-button:not(.el-button--text) {
        padding: 8px 12px;
      }
    }
  }
}
.menu-list {
  .exportBox {
    position: relative;
    overflow: hidden;
    .hiddenExportFn {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      padding-top: 0;
      margin-left: 0;
    }
  }
}
</style>
