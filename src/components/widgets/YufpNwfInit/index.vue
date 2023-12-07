<template>
  <div>
    <el-dialog
      :title="$t('wfyufpinit.titlety')"
      :visible.sync="agreeNodeSelect.showDialog"
      @close="agreeDialogClose"
    >
      <el-form ref="form" label-width="20px" align="center">
        <el-radio-group
          v-model="agreeRadio"
          @change="agreeRadioChange"
          v-if="agreeShowRadio"
        >
          <el-form-item
            v-for="(node, index1) in agreeNextNodes"
            style="min-width: 480px"
            align="left"
            :key="index1"
          >
            <el-row>
              <el-radio :label="node.nodeId">{{ node.nodeName }}</el-radio>
            </el-row>
            <el-row :gutter="2" v-if="node.selected == true">
              <el-col :span="6" align="right" style="padding-right: 10px">
                <span>{{ $t("wfinsinfo.userid") }}:</span>
              </el-col>
              <el-col :span="18" align="right">
                <yufp-select-user-for-wf
                  v-model="node.userInfos"
                  @click-icon="agreeUserDialogOpen(node, index1)"
                  @tag-close="agreeTagClose"
                ></yufp-select-user-for-wf>
              </el-col>
            </el-row>
            <el-row
              :gutter="2"
              v-show="
                node.isSysUser != true &&
                  node.selected == true &&
                  node.nodeType != 'E'
              "
            >
              <el-col :span="6" align="right" style="padding-right: 10px">
                <span>{{ $t("wfinsinfo.butcopy") }}:</span>
              </el-col>
              <el-col :span="18">
                <yufp-select-user-for-wf
                  v-model="node.copyUserInfos"
                  @click-icon="agreeSelectCopyUser(node, index1)"
                  @tag-close="copyTagClose"
                ></yufp-select-user-for-wf>
              </el-col>
            </el-row>
          </el-form-item>
        </el-radio-group>
        <el-checkbox-group
          v-model="agreeCheckBox"
          @change="agreeRadioChange"
          v-if="!agreeShowRadio"
        >
          <el-form-item
            v-for="(node, index1) in agreeNextNodes"
            style="min-width: 480px"
            align="left"
            :key="index1"
          >
            <el-row>
              <el-checkbox
                :label="node.nodeId"
                :key="node.nodeId"
                :checked="node.selected == true"
              >{{ node.nodeName }}</el-checkbox
              >
            </el-row>
            <el-row
              :gutter="2"
              v-if="node.isSysUser != true && node.selected == true"
            >
              <el-col :span="6" align="right" style="padding-right: 10px">
                <span>{{ $t("wfinsinfo.userid") }}:</span>
              </el-col>
              <el-col :span="18" align="right">
                <yufp-select-user-for-wf
                  v-model="node.userInfos"
                  @click-icon="agreeUserDialogOpen(node, index1)"
                  @tag-close="agreeTagClose"
                ></yufp-select-user-for-wf>
              </el-col>
            </el-row>
            <el-row
              :gutter="2"
              v-show="
                node.isSysUser != true &&
                  node.selected == true &&
                  node.nodeType != 'E'
              "
            >
              <el-col :span="6" align="right" style="padding-right: 10px">
                <span>{{ $t("wfinsinfo.butcopy") }}:</span>
              </el-col>
              <el-col :span="18">
                <yu-tooltip
                  :content="node.copyUser"
                  :disabled="null == node.copyUser || '' == node.copyUser"
                  placement="top"
                >
                  <yufp-select-user-for-wf
                    v-model="node.copyUserInfos"
                    @click-icon="agreeSelectCopyUser(node, index1)"
                    @tag-close="copyTagClose"
                  ></yufp-select-user-for-wf>
                </yu-tooltip>
              </el-col>
            </el-row>
          </el-form-item>
        </el-checkbox-group>
      </el-form>
      <el-radio-group
        v-model="agreeIsLastRadio"
        v-if="instanceIdInfo.handvarype == 5 || instanceIdInfo.handvarype == 6"
        style="min-width: 380px"
        align="left"
      >
        <el-row style="width: auto; padding-left: 120px">
          <el-radio label="N">{{ $t("wfinsinfo.butislast") }}</el-radio>
          <el-radio label="Y">{{ $t("wfinsinfo.butnolast") }}</el-radio>
        </el-row>
      </el-radio-group>
      <div slot="footer">
        <el-button type="primary" @click="agreeFn">{{
          $t("wfinsinfo.butsubmit")
        }}</el-button>
        <el-button @click="agreeNodeSelect.showDialog = false">{{
          $t("wfbutton.cancel")
        }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('wfinsinfo.titleuser')"
      :visible.sync="agreeNodeSelect.showUserDialog"
      @opened="afterAgreeUserDialogOpen"
    >
      <yu-xtable
        ref="agreeUserTableRef"
        :row-index="true"
        reserve-selection
        row-key="userId"
        :data="
          agreeNodeSelect.userTableData.slice(
            (currpage - 1) * pagesize,
            currpage * pagesize
          )
        "
        :pageable="false"
        selection-type="checkbox"
      >
        <yu-xtable-column
          prop="userId"
          :label="$t('wfinsinfo.login')"
          align="left"
        >
        </yu-xtable-column>
        <yu-xtable-column
          prop="userName"
          :label="$t('wfinsinfo.name')"
          align="left"
        >
        </yu-xtable-column>
      </yu-xtable>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30]"
        :page-size="pagesize"
        :current-page="currpage"
        :total="agreeNodeSelect.userTableData.length"
        @current-change="currpageChange"
        @size-change="pagesizeChange"
      >
      </el-pagination>
      <div style="margin-top: 20px" align="center">
        <el-button type="primary" @click="agreeUserClose">{{
          $t("wfbutton.sure")
        }}</el-button>
        <el-button @click="agreeNodeSelect.showUserDialog = false">{{
          $t("wfbutton.cancel")
        }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="UserSelect[title]"
      :visible.sync="UserSelect.showUserDialog"
      @opened="userDialogOpen"
    >
      <yu-xtable
        ref="UserTableRef"
        :row-index="true"
        reserve-selection
        row-key="userId"
        :data="
          UserSelect.Users.slice((currpage - 1) * pagesize, currpage * pagesize)
        "
        :pageable="false"
        selection-type="checkbox"
      >
        <yu-xtable-column
          prop="userId"
          :label="$t('wfinsinfo.login')"
          align="left"
        >
        </yu-xtable-column>
        <yu-xtable-column
          prop="userName"
          :label="$t('wfinsinfo.name')"
          align="left"
        >
        </yu-xtable-column>
      </yu-xtable>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="currpage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        :total="UserSelect.Users.length"
        @current-change="currpageChange"
        @size-change="pagesizeChange"
      >
      </el-pagination>
      <div style="margin-top: 20px" align="center">
        <el-button type="primary" @click="UserDialogClose">{{
          $t("wfbutton.sure")
        }}</el-button>
        <el-button @click="UserSelect.showUserDialog = false">{{
          $t("wfbutton.cancel")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/* eslint no-console:0 */
/**
 * yufp-nwf-init
 * 流程发起后第一个节点的审批人是节点配置的审批人员，
 * 和发起人并不一定是同一个人，
 * 所以发起后在进行一次提交操作一般是行不通的，
 * 所以在使用该组件时需要把流程图的第一个节点的办理人员设置为流程发起人自定义类
 * 这样发起人发起过后就可以在进行一次提交；
 * @created by zhouqh 2020-7-1
 * @description 流程初始化＋提交下一步组件
 */
import { mapGetters } from "vuex";
import { extend } from "@/utils";
import YufpSelectUserForWf from "@/components/widgets/YufpSelectUserForWf/index";
export default {
  name: "YufpNwfInit",
  components: { YufpSelectUserForWf },
  props: {
    commonParams: {
      type: Object,
      required: false,
    },
    echainServerName: {
      type: String,
      default: backend.workflowService,
    },
    el: String,
  },
  data: function () {
    const backend = this.$backend;
    return {
      nodeRouterType: "",
      checkList: [],
      nodeId: "",
      instanceId: "",
      applType: "",
      index: "0",
      urls: {
        start: backend.workflowService + "/api/core/start",
        instanceInfo: backend.workflowService + "/api/core/instanceInfo",
        saveComment: backend.workflowService + "/api/core/saveComment/",
        getComments: backend.workflowService + "/api/core/getAllComments/",
        getNextNodeInfos:
          backend.workflowService + "/api/core/getNextNodeInfos/",
        submit: backend.workflowService + "/api/core/submit",
        refuse: backend.workflowService + "/api/core/refuse",
        getNodeInfo: backend.workflowService + "/api/monitor/getCurrentNodeIds",
        getCopyUser: backend.workflowService + "/api/core/getCopyUsers",
        deleteByBizId: backend.workflowService + "/api/core/deleteByBizId",
        getInstanceByBiz:
          backend.workflowService + "/api/core/getInstanceByBiz",
      },
      agreeNodeSelect: {
        showDialog: false,
        nodeUrl: backend.workflowService + "/api/core/getNextNodeInfos/",
        showUserDialog: false,
        userUrl: backend.workflowService + "/api/core/getNodeUsers",
        userTableData: [],
      },
      agreeIndex: 0,
      agreeNextNodes: [{}],
      agreeShowRadio: false,
      agreeRadio: "",
      agreeCheckBox: [],
      agreeIsLastRadio: "N",
      pagesize: 10,
      currpage: 1,
      instanceIdInfo: {
        instanceId: "",
        mainInstanceId: "",
        flowName: "",
        flowId: "",
        flowStarter: "",
        flowStarterName: "",
        startTime: "",
        systemId: "",
        orgId: "",
        flowState: "",
        bizId: "",
        bizUserName: "",
        bizUserId: "",
        bizType: "",
        lastNodeId: "",
        lastNodeName: "",
        nodeId: "",
        nodeSign: "",
        nodeName: "",
        nodeState: "",
        nodeStateName: "",
        nodeType: "",
        handleType: "",
        opType: {},
      },
      commentInfo: {
        instanceId: "",
        nodeId: "",
        userId: "",
        commentId: "",
        commentSign: "O-12",
        userComment: "",
        ext: "无",
      },
      bizId: "",
      startResponseData: {},
      flowParam: [],
      currentUserId: "",
      currentOrgId: "",
      type: "init",
      UserSelect: {
        showUserDialog: false,
        userUrl: backend.workflowService + "/api/core/getNodeUsers",
        Users: [],
        SelectUsers: [],
      },
      title: "copy",
      copyUserName: "",
    };
  },
  computed: {
    ...mapGetters(["userCode", "org"]),
  },
  created() {
    this.currentUserId = this.loginCode;
    this.currentOrgId = this.org.code;
  },
  methods: {
    beforeClose: function () {
      this.checkList = [];
      this.$emit("after-close");
      var _this = this;
      // 发起流程后取消提交 关闭弹窗时删除初始化的数据
      if (_this.type == "init") {
        yufp.service.request({
          method: "POST",
          url: _this.urls.deleteByBizId,
          data: { bizId: _this.bizId },
          callback: function (code, message, response) {
            if (response.code == 0) {
              if (response.data != null) {
                // _this.$message({ duration: 6000, message: '取消流程发起：' + response.data.tip, type: 'success' });
                console.log(
                  _this.$t("wfyufpinit.msgstartcancel") +
                    "[" +
                    _this.bizId +
                    "]：" +
                    response.data.tip
                );
              }
            } else {
              _this.$message({
                duration: 4000,
                message: _this.$t("wfyufpinit.msgdeleteerror"),
                type: "error",
              });
            }
          },
        });
      }
    },
    wfInit: function (wfInitData) {
      var _this = this;
      _this.bizId = wfInitData.bizId;
      _this.startResponseData = {};
      yufp.service.request({
        // 初始化流程,先检查是否有关联实例存在
        url: _this.urls.getInstanceByBiz,
        data: { bizId: wfInitData.bizId },
        method: "POST",
        callback: function (code, message, response) {
          if (response.data != null && response.data.length > 0) {
            var instance = response.data;
            _this.type = "submit";
            for (var i = 0; i < instance.length; i++) {
              if (_this.currentUserId === instance[i].userId) {
                _this.instanceId = instance[i].instanceId;
                _this.currentUserId = instance[i].userId;
                _this.nodeId = instance[i].nodeId;
                var param = {
                  instanceId: instance[i].instanceId,
                  nodeId: instance[i].nodeId,
                  userId: _this.currentUserId,
                };
                _this.submitFn(param);
                _this.$message({
                  message: _this.$t("wfyufpinit.msgcantsubmit"),
                  type: "warning",
                });
              }
            }
            _this.$message({
              message: _this.$t("wfyufpinit.msgcansubmit"),
              type: "warning",
            });
          } else {
            _this.type = "init";
            yufp.service.request({
              // 初始化流程
              url: _this.urls.start,
              data: wfInitData,
              method: "POST",
              callback: function (cde, msg, res) {
                if (res.data != null) {
                  _this.nodeId = res.data.nodeId;
                  _this.instanceId = res.data.instanceId;
                  _this.currentUserId = res.data.currentUserId;
                  var paramT = {
                    instanceId: res.data.instanceId,
                    nodeId: res.data.nodeId,
                    userId: res.data.currentUserId,
                  };
                  _this.startResponseData = res.data; //保存发起流程成功后返回数据，用于消息提醒
                  _this.submitFn(paramT);
                } else {
                  _this.$message({
                    message: _this.$t("wfyufpinit.msginitfail"),
                    type: "error",
                  });
                }
              },
            });
          }
        },
      });
    },
    submitFn: function (param) {
      var _this = this;
      yufp.service.request({
        // 获取实例信息
        url: _this.urls.instanceInfo,
        data: param,
        method: "POST",
        // loadingUi: { show: true, target: this.el },
        callback: function (code, message, response) {
          if (code === "0" && response.data) {
            _this.instanceIdInfo = response.data;
            _this.nodeRouterType = response.data.nodeRouterType;
            if (response.data.param != null) {
              // 流程参数初始化
              for (var key in response.data.param) {
                var paramTT = {};
                paramTT.key = key;
                paramTT.value = response.data.param[key];
                _this.flowParam.push(paramTT);
              }
            }
            if (response.data.comment != null) {
              // 设置评论反显
              _this.commentInfo = response.data.comment;
            }
            _this.commentInfo.instanceId = _this.instanceIdInfo.instanceId;
            _this.commentInfo.nodeId = _this.instanceIdInfo.nodeId;
            _this.commentInfo.userId = _this.currentUserId;
            // _this.agreeNodeSelect.showDialog = true;
            _this.agreeDialogOpen();
            // setTimeout(_this.addMessage(res.data), 500); // 提交成功往消息表中插入数据 门户补充调用
          } else {
            _this.beforeClose();
            _this.$message({ message: response.message, type: "error" });
          }
        },
      });
    },
    agreeDialogOpen: function () {
      // 提交窗口打开事件
      var _this = this;
      var param = {
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        userId: _this.currentUserId,
        // param: {}
      };
      yufp.service.request({
        method: "POST",
        data: param,
        url: _this.agreeNodeSelect.nodeUrl,
        callback: function (code, message, response) {
          if (response.code === "0") {
            // 跳转到之前的页面
            if (response.data != null && response.data.length > 0) {
              _this.agreeNextNodes = response.data;
              var data = response.data;
              if (
                _this.instanceIdInfo.nodeType == "0" ||
                _this.instanceIdInfo.nodeType == "1" ||
                _this.instanceIdInfo.nodeType == "3"
              ) {
                _this.agreeShowRadio = true;
              } else {
                // 非单选节点
                _this.agreeShowRadio = false;
              }
              _this.agreeUserCheck(data);
            } else {
              _this.beforeClose();
              _this.$message({
                duration: 6000,
                message: _this.$t("wfyufpinit.msggetnonn"),
                type: "warning",
              });
            }
          } else {
            _this.beforeClose();
            _this.$message({
              duration: 6000,
              message:
                _this.$t("wfyufpinit.msggetnnerror") +
                (response.message === null ? "" : response.message),
              type: "error",
            });
          }
        },
      });
    },
    agreeUserCheck: function (data) {
      // 判断节点是否是系统指定,并对其进行处理
      const _this = this;
      const isSingle = true;
      for (var i = 0; i < data.length; i++) {
        var users = data[i].users;
        if (_this.agreeNextNodes[i].isSysUser == undefined) {
          _this.$set(_this.agreeNextNodes[i], "isSysUser", "");
        }
        if (_this.agreeNextNodes[i].selected == undefined) {
          _this.$set(_this.agreeNextNodes[i], "selected", "");
        }
        if (_this.agreeNextNodes[i].userInfos == undefined) {
          _this.$set(_this.agreeNextNodes[i], "userInfos", []);
        }
        // 节点办理人预处理，只有一个、系统指定、打回后提交情况直接选中；
        for (var j = 0; j < users.length; j++) {
          var user = {
            userId: users[j].userId,
            userName: users[j].userName,
          };
          if (users[j].userId === "system_user") {
            // 系统指定
            _this.agreeNextNodes[i].isSysUser = true;
            // _this.agreeNextNodes[i].selected = false;
            _this.agreeNextNodes[i].userInfos.push(user);
          } else if (users.length === 1) {
            // 只有一个用户
            _this.agreeNextNodes[i].isSysUser = false;
            // _this.agreeNextNodes[i].selected = true;
            _this.agreeNextNodes[i].userInfos.push(user);
          }
        }
        //只有一个节点、节点办理人只有一个的情况，不需要弹窗选择
        //if(data.length == 1 && isSingle){
        //// 提交处理，不显示弹窗处理节点参数
        //if (_this.agreeShowRadio) {
        //  _this.agreeRadio = data[i].nodeId;
        //} else {
        //  _this.agreeCheckBox.push(data[i].nodeId);
        //}
        //_this.agreeRadioChange(data[i].nodeId);
        //_this.agreeFn();
        //return;
        //}
        // 打开提交选择弹窗
        _this.agreeNodeSelect.showDialog = true;
        if (data.length === 1) {
          // 只有一个节点
          if (_this.agreeShowRadio) {
            _this.agreeRadio = data[i].nodeId;
            _this.agreeRadioChange(data[i].nodeId);
          } else {
            _this.agreeCheckBox.push(data[i].nodeId);
          }
        }
      }
      if (!_this.agreeShowRadio) {
        _this.agreeRadioChange(_this.agreeCheckBox);
      }
    },
    agreeRadioChange: function (val) {
      // 节点选择变化事件
      var _this = this;
      var nodeIds = [];
      var checked = false;
      if (_this.agreeShowRadio) {
        nodeIds.push(val);
      } else {
        if (!val) {
          _this.agreeCheckBox = [];
        }
        nodeIds = _this.agreeCheckBox;
      }
      // 未被选择的节点处理
      for (var i = 0; i < _this.agreeNextNodes.length; i++) {
        checked = false;
        for (var k = 0; k < nodeIds.length; k++) {
          if (nodeIds[k] === _this.agreeNextNodes[i].nodeId) {
            checked = true;
            _this.agreeNextNodes[i].selected = true;
            _this.agreeIndex = i;
          }
        }
        if (!checked) {
          _this.agreeNextNodes[i].selected = false;
        }
      }
    },
    agreeUserDialogOpen: function (node, index) {
      // 选择节点办理人员窗口打开事件处理
      this.agreeIndex = index;
      var _this = this;
      var nodeInfo = {
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: node.nodeId,
        orgId: _this.currentOrgId,
      };
      _this
        .$request({
          method: "POST",
          data: nodeInfo,
          url: _this.agreeNodeSelect.userUrl,
        })
        .then(({ code, message, data }) => {
          if (code !== "0") {
            _this.$message({
              message: message ? message : _this.$t("wfinsinfo.msggetnuerror"),
              type: "error",
            });
            return;
          }
          if (data) {
            _this.agreeNodeSelect.userTableData = data;
            _this.agreeNodeSelect.showUserDialog = true;
          } else {
            _this.$message({
              duration: 6000,
              message: _this.$t("wfinsinfo.msggetnonu"),
              type: "warning",
            });
          }
        });
    },
    afterAgreeUserDialogOpen: function () {
      // 人员列表弹窗打开时多选列表默认值处理
      var _this = this;
      var items = _this.agreeNextNodes[_this.agreeIndex].userInfos;
      _this.$refs.agreeUserTableRef.clearSelection();
      if (items && items.length > 0) {
        for (var i in items) {
          _this.$refs.agreeUserTableRef.tabledata.forEach((item) => {
            if (item.userId === items[i].userId) {
              _this.$refs.agreeUserTableRef.toggleRowSelection(item, true);
            }
          });
        }
      }
    },
    agreeTagClose: function (datas) {
      // tag关闭事件
      if (this.agreeNextNodes[this.agreeIndex].userInfos == undefined) {
        this.$set(this.agreeNextNodes[this.agreeIndex], "userInfos", []);
      }
      this.agreeNextNodes[this.agreeIndex].userInfos = datas;
    },
    copyTagClose: function (datas) {
      // tag关闭事件
      if (this.agreeNextNodes[this.agreeIndex].copyUserInfos == undefined) {
        this.$set(this.agreeNextNodes[this.agreeIndex], "copyUserInfos", []);
      }
      this.agreeNextNodes[this.agreeIndex].copyUserInfos = datas;
    },
    // 同意弹窗选人关闭处理数据
    agreeUserClose: function () {
      // 选取返回
      if (!this.$refs.agreeUserTableRef) {
        return;
      }
      var selections = this.$refs.agreeUserTableRef.selections;
      if (!selections || selections.length === 0) {
        this.$message({ message: "至少选择一条数据！", type: "warning" });
        return;
      }
      if (this.agreeNextNodes[this.agreeIndex].userInfos === undefined) {
        this.$set(this.agreeNextNodes[this.agreeIndex], "userInfos", []);
      }
      var items = [];
      extend(items, selections);
      this.agreeNextNodes[this.agreeIndex].userInfos = items;
      this.$refs.agreeUserTableRef.clearSelection();
      this.agreeNodeSelect.showUserDialog = false;
    },
    agreeDialogClose: function () {
      // 提交窗口关闭事件
      this.agreeRadio = "";
      this.agreeCheckBox = [];
      this.agreeIsLastRadio = "N";
      this.agreeIndex = 0;
      this.agreeNextNodes = [{}];
      this.agreeShowRadio = false;
      this.agreeNodeSelect.showDialog = false;
      this.beforeClose();
    },
    agreeFn: function () {
      // 节点提交操作
      // 遍历选中节点
      var nodes = [];
      if (this.agreeRadio != "" && this.agreeShowRadio) {
        nodes.push(this.agreeRadio);
      }

      if (this.agreeCheckBox.length > 0 && !this.agreeShowRadio) {
        for (var a = 0; a < this.agreeCheckBox.length; a++) {
          nodes.push(this.agreeCheckBox[a]);
        }
      }
      // 处理选中的下一节点相关信息
      var nodeInfos = [];
      for (var i = 0; i < nodes.length; i++) {
        for (var j = 0; j < this.agreeNextNodes.length; j++) {
          if (this.agreeNextNodes[j].nodeId == nodes[i]) {
            var nodeInfo = {};
            nodeInfo.nextNodeId = nodes[i];
            var nextUser = [];
            var nextCopyUser = [];
            if (
              this.agreeNextNodes[j].userInfos != null &&
              this.agreeNextNodes[j].userInfos != undefined
            ) {
              for (
                var k = 0;
                k < this.agreeNextNodes[j].userInfos.length;
                k++
              ) {
                // 去重
                nextUser.push(this.agreeNextNodes[j].userInfos[k].userId);
              }
            }
            if (
              this.agreeNextNodes[j].copyUserInfos != null &&
              this.agreeNextNodes[j].copyUserInfos != undefined
            ) {
              for (
                var l = 0;
                l < this.agreeNextNodes[j].copyUserInfos.length;
                l++
              ) {
                // 去重
                nextCopyUser.push(
                  this.agreeNextNodes[j].copyUserInfos[l].userId
                );
              }
            }
            nodeInfo.nextNodeUserIds = nextUser;
            nodeInfo.nextNodeCopyUserIds = nextCopyUser;
            nodeInfos.push(nodeInfo);
          }
        }
      }
      // 校验节点选择的处理人
      var _this = this;
      if (nodeInfos.length == 0) {
        _this.$message({
          duration: 6000,
          message: _this.$t("wfyufpinit.msgselectnn"),
        });
        return;
      } else {
        for (var b = 0; b < nodeInfos.length; b++) {
          if (nodeInfos[b].nextNodeUserIds.length == 0) {
            _this.$message({
              duration: 6000,
              message: _this.$t("wfyufpinit.msgselectnu"),
            });
            return;
          }
        }
      }
      var param = {};
      if (_this.agreeIsLastRadio == "Y") {
        // 是否直接提交， 一般【办理类型】是[多人顺序可结束]或[多人并行可结束]时生效，可以选择true和false;
        param.lastOne = true;
      }
      param.orgId = _this.currentOrgId;
      param.nextNodeInfos = nodeInfos;
      // 流程评论提交
      if (_this.commentInfo.userComment == "") {
        _this.commentInfo.userComment = _this.$t("wfyufpinit.commont");
        _this.commentInfo.commentSign = "O-12";
      }
      param.comment = _this.commentInfo;
      var paramWF = {};
      for (var c = 0; c < _this.flowParam.length; c++) {
        // 流程参数提交
        paramWF[_this.flowParam[c].key] = _this.flowParam[c].value;
      }
      param.param = paramWF;
      yufp.service.request({
        method: "POST",
        data: param,
        url: _this.urls.submit,
        callback: function (code, message, response) {
          if (response.code === "0") {
            // 跳转到之前的页面
            for (var i = 0; i < response.data.length; i++) {
              _this.type = "complete";
              if (response.data[i].code === "1") {
                // 提交失败，删除掉这笔数据
                _this.type = "init";
                _this.$message({
                  message: response.data[i].tip,
                  type: "warning",
                });
              } else if (response.data[i].code === "E") {
                // 正常结束
                _this.$message({
                  message: response.data[i].tip,
                  type: "success",
                });
              } else {
                _this.$message({
                  message:
                    response.data[i].tip +
                    _this.$t("wfyufpinit.msgnextnode") +
                    response.data[i].nodeName +
                    _this.$t("wfyufpinit.msgnextnodeuser") +
                    response.data[i].userNames,
                  type: "success",
                });
              }
              setTimeout(_this.addMessage(_this.startResponseData), 500);// 提交成功往消息表中插入数据 门户补充调用
            }
          } else {
            if (response.message != null) {
              _this.$message({
                duration: 6000,
                message: _this.$t("wfyufpinit.msgtjerror") + response.message,
                type: "error",
              });
            } else {
              _this.$message({
                duration: 4000,
                message: _this.$t("wfyufpinit.msgtjerror"),
                type: "error",
              });
            }
          }
          _this.$emit("success-click");
          _this.agreeNodeSelect.showDialog = false;
        },
      });
    },
    addMessage(data) {
      this.$request({
        url: `${backend.portalService}/api/xmhprocess/addmessage`,
        method: "POST",
        data: data,
      }).then((res) => {});
    },
    agreeSelectCopyUser: function (node, index) {
      var _this = this;
      _this.agreeIndex = index;
      if (_this.agreeNextNodes[_this.agreeIndex].copyUserInfos == undefined) {
        _this.$set(_this.agreeNextNodes[_this.agreeIndex], "copyUserInfos", []);
      }
      if (_this.agreeNextNodes[_this.agreeIndex].copyUser == undefined) {
        _this.$set(_this.agreeNextNodes[_this.agreeIndex], "copyUser", "");
      }
      var param = {
        orgId: _this.currentOrgId,
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        copyNodeId: node.nodeId,
      };
      _this
        .$request({
          method: "POST",
          data: param,
          url: _this.urls.getCopyUser,
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            // 跳转到之前的页面
            if (data != null) {
              _this.UserSelect.Users = data;
              _this.title = "copy";
              _this.UserSelect.showUserDialog = true;
            } else {
              _this.$message({
                duration: 6000,
                message: _this.$t("wfyufpinit.msgnocopyuser"),
                type: "warning",
              });
            }
          } else {
            if (message != null) {
              _this.$message({
                duration: 6000,
                message: message,
                type: "warning",
              });
            } else {
              _this.$message({
                duration: 6000,
                message: _this.$t("wfyufpinit.msggetcopyuerror"),
                type: "warning",
              });
            }
          }
        });
    },
    // 人员选择弹框
    submitbefore: function () {
      // 弹框前处理
      this.UserSelect.Users = [];
      this.UserSelect.SelectUsers = [];
    },
    userDialogOpen: function () {
      // 设置多选选中
      var _this = this;
      var items = _this.agreeNextNodes[this.agreeIndex].copyUserInfos;

      _this.$refs.UserTableRef.clearSelection();
      if (items && items.length > 0) {
        for (var i in items) {
          _this.$refs.UserTableRef.tabledata.forEach((row) => {
            if (row.userId === items[i].userId) {
              _this.$refs.UserTableRef.toggleRowSelection(row);
            }
          });
        }
      }
    },
    UserDialogClose: function () {
      // 弹框关闭

      var userInfosT = this.$refs.UserTableRef.selections;
      if (userInfosT == undefined || userInfosT.length < 1) {
        this.$message({ message: "请选择至少一条数据!", type: "warning" });
        return;
      }
      extend(this.UserSelect.SelectUsers, userInfosT);
      this.agreeNextNodes[this.agreeIndex].copyUserInfos = userInfosT;
      // if (this.title == "copy") {
      //   extend(this.UserSelect.SelectUsers, userInfosT);
      //   this.agreeNextNodes[this.agreeIndex].copyUserInfos = userInfosT;
      // }
      this.UserSelect.showUserDialog = false;
    },
    currpageChange: function (val) {
      this.currpage = val;
    },
    pagesizeChange: function (val) {
      this.pagesize = val;
    },
  },
};
</script>
