<template>
  <yu-panel ref="panel" title="" class="adjust-height">
    <div class="process-track-c">
      <yu-tabs>
        <yu-tab-pane label="授信审批">
          <yu-xtable
            ref="refTable"
            :data-url="dataUrl"
            :base-params="baseParams1"
            condition-key="condition"
            :encode="false"
          >
            <yu-xtable-column
              type="index"
              label="序号"
              width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
                <i v-if="scope.row.liked === 1" class="el-icon-star-off"></i>
                <i
                  v-if="scope.row.reminded === 1"
                  style="background: rgba(245, 154, 35, 1); color: #fff"
                >
                  置顶
                </i>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="任务流水号" prop="bizId" sortable>
              <template slot-scope="scope">
                <!-- <i v-if="scope.row.liked === 1" class="el-icon-star-off"></i>
              <i
                v-if="scope.row.reminded === 1"
                style="background: rgba(245, 154, 35, 1); color: #fff"
              >
                置顶
              </i> -->
                <a class="underline" @click="detailFn(scope.row)">{{
                  scope.row.bizId
                }}</a>
              </template>
            </yu-xtable-column>
            <yu-xtable-column
              label="客户名称"
              prop="bizUserName"
            ></yu-xtable-column>
            <yu-xtable-column label="任务类型" prop="bizType" width="150"></yu-xtable-column>
            <!-- <yu-xtable-column label="处理状态" width="100">
            <template slot-scope="scope">
              <yu-tag :type="scope.row.eventType=== '01' ? 'success' : 'danger'">{{ userStatus[scope.row.eventType] }}</yu-tag>
            </template>
          </yu-xtable-column> -->
            <yu-xtable-column label="截止日期" prop="dueTime" width="120"></yu-xtable-column>
            <!-- <yu-xtable-column label="停留时长" prop="lastTime" width="130">
            <template slot-scope="scope">
              <yu-progress v-if="scope.row.lastTime > 20" :percentage="100"></yu-progress>
              <yu-progress v-if="scope.row.lastTime >= 0 && scope.row.lastTime < 3" :percentage="(20 - scope.row.lastTime) / 20 * 100" status="success"></yu-progress>
              <yu-progress v-if="scope.row.lastTime >= 3 && scope.row.lastTime < 5" :percentage="(20 - scope.row.lastTime) / 20 * 100" color="#f59a23"></yu-progress>
              <yu-progress v-if="scope.row.lastTime >= 5" :percentage="(20 - scope.row.lastTime) / 20 * 100" status="exception"></yu-progress>
            </template>
          </yu-xtable-column> -->
            <yu-xtable-column
              label="任务状态"
              prop="nodeState"
              width="180"
              data-code="OP_TYPE"
            >
            </yu-xtable-column>
            <yu-xtable-column
              label="当前阶段"
              prop="nodeName"
              width="120"
            ></yu-xtable-column>
            <yu-xtable-column
              label="经办"
              prop="userName"
              width="130"
            ></yu-xtable-column>
            <yu-xtable-column
              label="经办机构"
              prop="orgName"
              width="130"
            ></yu-xtable-column>
            <yu-xtable-column
              label="备注"
              prop="remark"
              width="300"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <yu-button
                  @click="openRemark(scope.row)"
                  type="text"
                  class="el-icon-edit"
                  style="cursor: pointer"
                ></yu-button>
                <span>{{ scope.row.remark }}</span>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="操作" width="160">
              <template slot-scope="scope">
                <yu-button-drop set-index="0" :show-length="2" type="text">
                  <!-- <yu-button type="text" @click="toggleFn(scope.row)">{{ scope.row.status === '01' ? '停用' : '启用' }}</yu-button> -->
                  <yu-button type="text" @click="infoFn(scope.row)">流程日志</yu-button>
                </yu-button-drop>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </yu-tab-pane>
        <yu-tab-pane label="放款审批">
          <yu-xtable
            ref="refTable1"
            :data-url="dataUrl"
            :base-params="baseParams"
            condition-key="condition"
            :encode="false"
          >
            <yu-xtable-column
              type="index"
              label="序号"
              width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
                <i v-if="scope.row.liked === 1" class="el-icon-star-off"></i>
                <i
                  v-if="scope.row.reminded === 1"
                  style="background: rgba(245, 154, 35, 1); color: #fff"
                >
                  置顶
                </i>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="任务流水号" prop="bizId" sortable>
              <template slot-scope="scope">
                <!-- <i v-if="scope.row.liked === 1" class="el-icon-star-off"></i>
              <i
                v-if="scope.row.reminded === 1"
                style="background: rgba(245, 154, 35, 1); color: #fff"
              >
                置顶
              </i> -->
                <a class="underline" @click="detailFn(scope.row)">{{
                  scope.row.bizId
                }}</a>
              </template>
            </yu-xtable-column>
            <yu-xtable-column
              label="客户名称"
              prop="bizUserName"
            ></yu-xtable-column>
            <yu-xtable-column label="任务类型" prop="bizType" width="150"></yu-xtable-column>
            <!-- <yu-xtable-column label="处理状态" width="100">
            <template slot-scope="scope">
              <yu-tag :type="scope.row.eventType=== '01' ? 'success' : 'danger'">{{ userStatus[scope.row.eventType] }}</yu-tag>
            </template>
          </yu-xtable-column> -->
            <!-- <yu-xtable-column label="截止日期" prop="department" width="120" data-code="DEPARTMENT"></yu-xtable-column> -->
            <!-- <yu-xtable-column label="停留时长" prop="lastTime" width="130">
            <template slot-scope="scope">
              <yu-progress v-if="scope.row.lastTime > 20" :percentage="100"></yu-progress>
              <yu-progress v-if="scope.row.lastTime >= 0 && scope.row.lastTime < 3" :percentage="(20 - scope.row.lastTime) / 20 * 100" status="success"></yu-progress>
              <yu-progress v-if="scope.row.lastTime >= 3 && scope.row.lastTime < 5" :percentage="(20 - scope.row.lastTime) / 20 * 100" color="#f59a23"></yu-progress>
              <yu-progress v-if="scope.row.lastTime >= 5" :percentage="(20 - scope.row.lastTime) / 20 * 100" status="exception"></yu-progress>
            </template>
          </yu-xtable-column> -->
            <yu-xtable-column
              label="任务状态"
              prop="nodeState"
              width="180"
              data-code="OP_TYPE"
            >
            </yu-xtable-column>
            <yu-xtable-column
              label="当前阶段"
              prop="nodeName"
              width="120"
            ></yu-xtable-column>
            <yu-xtable-column
              label="经办"
              prop="userName"
              width="130"
            ></yu-xtable-column>
            <yu-xtable-column
              label="经办机构"
              prop="orgName"
              width="130"
            ></yu-xtable-column>
            <yu-xtable-column
              label="备注"
              prop="remark"
              width="300"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <yu-button
                  @click="openRemark(scope.row)"
                  type="text"
                  class="el-icon-edit"
                  style="cursor: pointer"
                ></yu-button>
                <span>{{ scope.row.remark }}</span>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="操作" width="160">
              <template slot-scope="scope">
                <yu-button-drop set-index="0" :show-length="2" type="text">
                  <!-- <yu-button type="text" @click="toggleFn(scope.row)">{{ scope.row.status === '01' ? '停用' : '启用' }}</yu-button> -->
                  <yu-button type="text" @click="infoFn(scope.row)">流程日志</yu-button>
                </yu-button-drop>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </yu-tab-pane>
      </yu-tabs>
      <yu-xdialog
        title="添加备注"
        :visible.sync="remarkDialogVisible"
        width="500px"
      >
        <yu-xform ref="remarkForm" label-width="120px" v-model="remarkFormdata">
          <yu-xform-group :column="1">
            <yu-xform-item
              label="任务流水号"
              ctype="custom"
              name="bizId"
              value=""
            >
              <span>{{ remarkFormdata.bizId }}</span>
            </yu-xform-item>
            <yu-xform-item
              label="客户名称"
              ctype="custom"
              name="bizUserName"
              value=""
            >
              <span>{{ remarkFormdata.bizUserName }}</span>
            </yu-xform-item>
            <yu-xform-item
              label="备注"
              ctype="textarea"
              name="remark"
            ></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
        <div slot="footer" class="yu-grpButton">
          <yu-button type="primary" @click="addRemark">添加</yu-button>
          <yu-button @click="cancelFn">取消</yu-button>
        </div>
      </yu-xdialog>
      <yu-xdialog title="流程图详情" :visible.sync="trackDialogVisible" @close="trackClose" v-if="trackDialogVisible" height="460px" width="960px">
        <div id="nwfTrackPage">
          <workflow :flow-id="flowId"></workflow>
        </div>
      </yu-xdialog>
      <yu-xdialog
        title="流程图详情"
        :visible.sync="trackDoingDialogVisible"
        height="530px"
        width="70%"
      >
        <div id="nwfDoingTrackPage">
          <work-travel
            :key="worktravelKey"
            :work-travel-data="workTravelData"
          ></work-travel>
        </div>
      </yu-xdialog>
    </div>
  </yu-panel>
</template>
<script>

import {clone, extend, lookup} from "@/utils";
import {getUrl} from '@/utils/util'
import workflow from '@/views/workflow/studio/nwflist/workFlow/workFlow'
import workTravel from "@/views/workflow/studio/wfmonitor/workTravel/workTravel.vue";

lookup.reg("OP_TYPE,REMIND_TIME,REPEATED_TYPE,SHOW_UNREAD"); // 注册数据字典类型

export default {
  name: "processTrack",
  components: { workflow, workTravel },
  data() {
    return {
      dataUrl: `${backend.portalService}/api/xmhprocess/allprocess`, // 表格接口地址
      trackDialogVisible: false,
      trackDoingDialogVisible: false,
      dataList: [],
      remarkFormdata: {},
      remarkDialogVisible: false,
      baseParams: { condition: {"bizTypes": ["放款申请"]} },
      baseParams1: { condition: {"bizTypes": ["对公授信申请", "授信申请打回", "授信申请审批"]} },
      urls: {
        index: backend.workflowService + "/api/nwfflow/",
        show: backend.workflowService + "/api/nwfflow/flow",
        getNodeInfo: this.$backend.workflowService + "/api/monitor/getCurrentNodeIds",
        create: backend.workflowService + "/api/nwfflow/",
        update: backend.workflowService + "/api/nwfflow/update/",
        batchdelete: backend.workflowService + "/api/nwfflow/delete/",
        state: backend.workflowService + "/api/nwfflow/state/",
        exportFlow: backend.workflowService + "/api/nwfflow/exportFlow/",
        importFlow: getUrl({
          url: backend.workflowService + "/api/nwfflow/importFlow/"
        }),
        history: backend.workflowService + "/api/nwfflowhis/",
      },
      worktravelKey: 0,
      workTravelData: {}
    };
  },
  created() {
    // const type = this.$route.params.type
    // this.baseParams = { condition: { bizType: type } }
  },
  mounted() {
  },
  methods: {
    infoFn: function(row) {
      if (row.flowState === 'E') {
        var _this = this;
        _this.$request({
          method: "GET",
          url: _this.urls.show,
          data: {
            flowId: row.flowId
          }
        }).then(({code, message, data}) => {
          if (code == 0) {
            if (data != null) {
              if (data.flowContent == null) {
                _this.$message({
                  duration: 4000,
                  message: "流程图内容为空",
                  type: "warning"
                });
                return;
              }

              _this.flowId = row.flowId;
              _this.trackDialogVisible = true;
            } else {
              _this.$message({
                duration: 4000,
                message: "流程图内容不存在",
                type: "warning"
              });
            }
          } else {
            _this.$message({
              duration: 4000,
              message: "获取数据异常:" + message.substring(0, 100),
              type: "error"
            });
          }
        })
      } else {
        var param = {
          instanceId: row.instanceId,
          mainInstanceId: row.mainInstanceId,
          flowId: row.flowId,
          bizParam: row,
          type: "DONE",
          returnBackFuncId: this.$route.name,
          nodeInfo: [],
        };
        this.$request({
          method: "POST",
          url: this.urls.getNodeInfo,
          data: {
            instanceId: row.instanceId,
          },
        }).then(({ code, message, data }) => {
          if (code == "0") {
            if (data != null) {
              param.nodeInfo = data;
              this.workTravelData = param;
              this.trackDoingDialogVisible = true;
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
    trackClose: function() {
      this.trackDialogVisible = false;
      this.trackDoingDialogVisible = false;
    },
    openRemark(row) {
      row["remark"] = row["remark"] || "";
      this.remarkDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.remarkForm.resetFields();
        clone(row, this.remarkFormdata);
      });
    },
    // 添加备注
    addRemark() {
      const _this = this;
      var params = clone(this.remarkFormdata, {});
      this.$request({
        url: `${backend.portalService}/api/xmhprocess/remark`,
        method: "post",
        data: params,
      }).then(({ code, message, data, total }) => {
        if (code === "0") {
          _this.$refs.refTable.remoteData();
          _this.$refs.refTable1.remoteData();
          _this.$message({ message: "操作成功" });
          _this.remarkDialogVisible = false;
        } else {
          _this.$message({ message: message, type: "error" });
        }
      });
    },
    cancelFn(data) {
      this.remarkDialogVisible = false;
    },
    /**
     * 详情
     */
    detailFn(data) {
      this.viewType = "DETAIL";
      this.$nextTick(function () {
        // 复制对象
        extend(this.detailFormdata, data);
      });
      // 往实例信息页面跳转
      var query = {
        instanceId: data.instanceId,
        nodeId: data.nodeId,
        userId: data.userId,
        returnBackFuncId: this.$route.name,
        returnBackRootId: this.$route.name,
        row: clone(data, {})
      };
      if (data.flowState == "H") {
        this.$message({
          message: "流程实例处于挂起状态,无法进行操作!",
          type: "warning",
        });
      } else {
        this.$router.replace({ name: "instanceInfo", query });
      }
    }
  },
};
</script>
<style scoped>
   .process-track-c .el-tabs__content,.yu-xtable{
      /* max-height: calc(100vh - 120px); */
      overflow-y:hidden;
    }
</style>
