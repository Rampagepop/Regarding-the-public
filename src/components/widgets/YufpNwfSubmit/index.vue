<template>
  <div>
    <el-dialog :title="agreeNodeSelect.title" :visible.sync="agreeNodeSelect.showDialog" @close="agreeDialogClose">
      <el-form ref="form" label-width="20px" align="center">
        <el-radio-group v-model="agreeRadio" @change="agreeRadioChange" style="width: auto; padding-left: 20px" v-show="agreeShowRadio">
          <el-form-item v-for="(node, index1) in agreeNextNodes" style="min-width: 380px" align="left" :key="index1">
            <el-col :span="8">
              <el-radio :label="node.nodeId">{{ node.nodeName }}</el-radio>
            </el-col>
            <el-col :span="9">
              <el-row :gutter="2">
                <el-col :span="14">
                  <el-input v-model="node.userSelected" type="textarea" readonly autosize></el-input>
                </el-col>
                <el-col :span="8">
                  <el-button @click="agreeSelectNodeUser(node, index1)" v-if="node.isSysUser != true && node.selected == true">选择</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6" v-show="node.nodeType != 'E' && node.copyUserShow == true && node.selected == true">
              <el-row :gutter="2">
                <el-col :span="12">
                  <el-input v-model="node.copyUser" type="input" readonly autosize></el-input>
                </el-col>
                <el-col :span="8">
                  <el-button @click="agreeSelectCopyUser(node, index1)">抄送</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-form-item>
        </el-radio-group>
        <el-checkbox-group v-model="agreeCheckBox" v-show="!agreeShowRadio" @change="agreeRadioChange">
          <el-form-item v-for="(node, index1) in agreeNextNodes" style="min-width: 380px" align="left" :key="index1">
            <el-col :span="8">
              <el-checkbox :label="node.nodeId" :key="node.nodeId" :checked="node.selected == true">{{ node.nodeName }}</el-checkbox>
            </el-col>
            <el-col :span="9">
              <el-row :gutter="2">
                <el-col :span="14">
                  <el-input v-model="node.userSelected" type="input" readonly autosize></el-input>
                </el-col>
                <el-col :span="8">
                  <el-button @click="agreeSelectNodeUser(node, index1)" v-if="node.isSysUser != true && node.selected == true">选择</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6" v-show="node.nodeType != 'E' && node.copyUserShow == true && node.selected == true">
              <el-row :gutter="2">
                <el-col :span="12">
                  <el-input v-model="node.copyUser" type="input" readonly autosize></el-input>
                </el-col>
                <el-col :span="8">
                  <el-button icon="message" @click="agreeSelectCopyUser(node, index1)">抄送</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-form-item>
        </el-checkbox-group>
        <el-checkbox-group>
          <el-form-item v-if=" instanceIdInfo.handleType == 5 || instanceIdInfo.handleType == 6 " style="min-width: 380px" align="left">
            <el-col style="width: auto; padding-left: 125px">
              <el-row>
                <el-radio v-model="agreeIsLastRadio" label="N">不提前提交</el-radio>
                <el-radio v-model="agreeIsLastRadio" label="Y">提前提交</el-radio>
              </el-row>
            </el-col>
          </el-form-item>
        </el-checkbox-group>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="agreeFn">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="agreeNodeSelect.userTitle" :visible.sync="agreeNodeSelect.showUserDialog">
      <el-card class="box-card" v-show="agreeNextNodes[agreeIndex] != undefined">
        <el-tag v-for="tag in agreeNextNodes[agreeIndex].userInfos" :key="tag.userId" type="success" closable @close="agreeTagClose(tag)">
          {{ tag.userName }}
        </el-tag>
      </el-card>
      <el-table ref="agreeUserTableRef" :data="agreeNodeSelect.userTableData.slice((currpage-1)*pagesize,(currpage)*pagesize)" @row-dblclick="agreeRowDbClick">
        <el-table-column prop="userId" label="用户ID" align="center"> </el-table-column>
        <el-table-column prop="userName" label="姓名" align="center"> </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 30]" :page-size="pagesize" :total="agreeNodeSelect.userTableData.length" @current-change="currpageChange" @size-change="pagesizeChange">
      </el-pagination>
      <div style="margin-top: 20px">
        <el-button @click="agreeUserClose">选取返回</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="callbackNodeSelect.title" :visible.sync="callbackNodeSelect.showDialog" height="300px" @open="backDialogOpen" @close="wfCallBackClose">
      <el-tabs v-model="backActiveName" type="card">
        <el-tab-pane label="打回节点" name="first" align="center">
          <el-row style="margin-top: 20px" align="center">
            <el-col>
              <el-radio-group v-model="backNodeModel" @change="radioChange" style="width: 600px" align="left">
                <el-row :gutter="10" v-for="item in backNodes" :key="item.nodeId">
                  <el-col :span="8" font-size="14px">
                    <el-radio :label="item.nodeId" :key="item.nodeName">{{ item.nodeName }}
                    </el-radio>
                  </el-col>
                  <el-col :span="16">
                    <el-radio-group v-model="userModel" v-show="item.selected">
                      <el-radio v-for="item1 in item.usersList" :label="item1.userId" :key="item1.userName" font-size="14px">{{ item1.userName }}</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-row>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="打回后节点提交方式" name="second" align="center">
          <el-form ref="form" align="center">
            <el-form-item style="margin-bottom: 15px"></el-form-item>
            <el-form-item align="center">
              <el-radio-group v-model="backnode" align="center">
                <el-radio :label="0">直接提交到打回节点</el-radio>
                <el-radio :label="1">沿流程路径逐级提交</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" align="center">
        <el-button type="primary" @click="wfCallBack">确 定</el-button>
        <el-button type="primary" @click="wfCallBackClose">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="jumpNodeSelect.title" :visible.sync="jumpNodeSelect.showDialog" height="300px" @close="jumpClose">
      <el-form ref="form" label-width="120px">
        <el-radio-group v-model="jumpNodeModel" @change="jumpradioChange" style="width: 600px; margin-left: auto">
          <el-form-item v-for="(node, index1) in jumpNodes" style="margin: auto" :key="index1">
            <el-col :span="8">
              <el-radio :label="node.nodeId">{{ node.nodeId + "-" + node.nodeName }}
              </el-radio>
            </el-col>
            <el-col :span="12" v-show="node.selected">
              <el-input v-model="node.selectUser.userName" type="textarea" autosize></el-input>
            </el-col>
            <el-col :span="4" v-show="node.selected">
              <el-button @click="jumpSelectUser(node, index1)">选择</el-button>
            </el-col>
          </el-form-item>
        </el-radio-group>
      </el-form>
      <div slot="footer" align="center">
        <el-button type="primary" @click="jumpFn()">确 定</el-button>
        <el-button type="primary" @click="jumpClose">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="UserSelect[title]" :visible.sync="UserSelect.showUserDialog">
      <el-card class="box-card" v-show="true">
        <el-tag v-for="tag in UserSelect.SelectUsers" :key="tag.userId" type="success" closable @close="TagClose(tag)">
          {{ tag.userName }}
        </el-tag>
      </el-card>
      <el-table ref="UserTableRef" :data="UserSelect.Users.slice((currpage-1)*pagesize,(currpage)*pagesize)" @row-dblclick="RowDbClick">
        <el-table-column prop="userId" label="用户ID" align="center"> </el-table-column>
        <el-table-column prop="userName" label="姓名" align="center"> </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" :total="UserSelect.Users.length">
      </el-pagination>
      <div style="margin-top: 20px">
        <el-button v-if="title == 'jump' || title == 'copy'" @click="UserDialogClose">选取返回</el-button>
        <el-button type="primary" v-if="title == 'change'" @click="UserDialogClose">确定转办</el-button>
        <el-button type="primary" v-if="title == 'assist'" @click="UserDialogClose">确定协办</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { validator } from "@/utils/validate";
export default {
  name: "YufpNwfSubmit",
  props: {
    pagedata: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    var _this = this;
    return {
      urls: {
        index: backend.workflowService + "/api/bench/todo",
        instanceInfo: backend.workflowService + "/api/core/instanceInfo",
        saveComment: backend.workflowService + "/api/core/saveComment/",
        signIn: backend.workflowService + "/api/core/signIn/",
        unSignIn: backend.workflowService + "/api/core/unSignIn/",
        getComments: backend.workflowService + "/api/core/getAllComments/",
        getNextNodeInfos:
          backend.workflowService + "/api/core/getNextNodeInfos/",
        submit: backend.workflowService + "/api/core/submit",
        returnBack: backend.workflowService + "/api/core/returnBack",
        refuse: backend.workflowService + "/api/core/refuse",
        callBack: backend.workflowService + "/api/core/callBack",
        jump: backend.workflowService + "/api/core/jump",
        assist: backend.workflowService + "/api/core/assist",
        change: backend.workflowService + "/api/core/change",
        getchangeUser: backend.workflowService + "/api/core/getChangeUsers",
        getassistUser: backend.workflowService + "/api/core/getAssistUsers",
        unSignInTaskPool: backend.workflowService + "/api/core/unsignTaskPool",
        subFlowStart: backend.workflowService + "/api/core/subFlowStart",
        nwfbiz: backend.workflowService + "/api/biz/",
        getCopyUser: backend.workflowService + "/api/core/getCopyUsers",
        hang: backend.workflowService + "/api/core/hangup",
        wake: backend.workflowService + "/api/core/wakeup",
        tackBack: backend.workflowService + "/api/core/tackback",
        urge: backend.workflowService + "/api/core/urge",
        resetNodeUser: backend.workflowService + "api/core/resetNodeUser",
        tackbackToFirst: backend.workflowService + "/api/core/tackbackToFirst",
        activate: backend.workflowService + "api/core/activate"
      },
      height: yufp.frame.size().height - 103,
      currentOrgId: "",
      currentUserId: "",
      returnBackFuncId: "",
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
        opType: {}
      },
      commentInfo: {
        instanceId: "",
        nodeId: "",
        userId: "",
        commentId: "",
        commentSign: "",
        userComment: "",
        ext: "无",
        optType: "",
        optReasTyp: ""
      },
      flowParam: {},
      opNames: {
        // 操作权限常量列表
        submit: {
          label: "同意",
          value: "O-12"
        },
        takeBack: {
          key: "takeBack",
          label: "拿回",
          value: "O-0"
        },
        callBack: {
          key: "callBack",
          label: "打回",
          value: "O-1"
        },
        returnBack: {
          key: "returnBack",
          label: "退回",
          value: "O-2"
        },
        hangUp: {
          key: "hangUp",
          label: "挂起",
          value: "O-3"
        },
        wakeUp: {
          key: "wakeUp",
          label: "唤醒",
          value: "O-4"
        },
        urge: {
          key: "urge",
          label: "催办",
          value: "O-5"
        },
        change: {
          key: "change",
          label: "转办",
          value: "O-6"
        },
        assist: {
          key: "assist",
          label: "协办",
          value: "O-7"
        },
        refuse: {
          key: "refuse",
          label: "否决",
          value: "O-8"
        },
        jump: {
          key: "jump",
          label: "跳转",
          value: "O-9"
        },
        entrust: {
          key: "entrust",
          label: "委托",
          value: "O-10"
        },
        copy: {
          key: "copy",
          label: "抄送",
          value: "O-11"
        },
        auto: {
          key: "auto",
          label: "自动提交",
          value: "O-13"
        },
        end: {
          key: "end",
          label: "正常结束",
          value: "O-14"
        },
        takeBackFirst: {
          key: "takeBackFirst",
          label: "撤回",
          value: "O-15"
        },
        start: {
          key: "start",
          label: "待发起",
          value: "O-16"
        }
      },
      button: {
        // 按钮权限控制
        submit: "1",
        gather: "0",
        callBack: "0",
        entrust: "0",
        copy: "0",
        jump: "0",
        returnBack: "0",
        change: "0",
        unSignIn: "0",
        signIn: "0",
        assist: "0",
        refuse: "0",
        taskPoolId: "0",
        subFlowId: "0",
        subFlow: ""
      },
      agreeNodeSelect: {
        title: "同意提交",
        showDialog: false,
        nodeUrl: backend.workflowService + "/api/core/getNextNodeInfos/",
        userTitle: "办理人员选择（提示：请双击鼠标选择）",
        showUserDialog: false,
        userUrl: backend.workflowService + "/api/core/getNodeUsers",
        userTableData: []
      },
      callbackNodeSelect: {
        title: "打回节点选择",
        showDialog: false,
        nodeUrl: backend.workflowService + "/api/core/getCallBackNodes"
      },
      jumpNodeSelect: {
        title: "跳转节点选择",
        showDialog: false,
        nodeUrl: backend.workflowService + "/api/core/getJumpNodes",
        userTitle: "跳转节点办理人员选择"
      },
      UserSelect: {
        jump: "跳转节点办理人员选择",
        assist: "协办人员选择",
        change: "转办人员选择",
        copy: "抄送人员选择",
        showUserDialog: false,
        userUrl: backend.workflowService + "/api/core/getNodeUsers",
        Users: [],
        SelectUsers: []
      },

      jumpNodeModel: "",
      jumpNodes: [],
      input: "",
      title: "",
      index: 0,
      agreeIndex: 0,
      agreeNextNodes: [{}],
      agreeShowRadio: false,
      agreeRadio: "",
      agreeCheckBox: [],
      agreeIsLastRadio: "N",
      backActiveName: "first",
      backNodeModel: "",
      userModel: "",
      backNodes: [],
      pagesize: 10,
      currpage: 1,
      backnode: 0,
      nwfbiztypePage: "nwfbiztypePage" + Date.now(),
      nwfgatherPage: "nwfgatherPage" + Date.now(),
      gatherPage: "",
      gatherPageData: null,
      commentinfo: "",
      optypeOptions: [],
      // 退回原因
      reasonOptions: [
        {
          value: "1",
          label: "材料缺失"
        },
        {
          value: "2",
          label: "调查报告问题"
        },
        {
          value: "3",
          label: "其他"
        }
      ],
      currentOrgName: "",
      nwfmeetPage: "nwfmeetPage" + Date.now(),
      meetstart: "@/views/workflow/instance/metting/meetstart.vue",
      meetPageShow: false,
      meetData: null,
      tabValue: "first"
    };
  },
  computed: {
    ...mapGetters(["userCode", "org"])
  },
  created() {
    this.currentOrgId = this.org.id;
    this.currentOrgName = this.org.name;
    this.currentUserId = this.userCode;
    this.commentInfo.userId = this.currentUserId;
  },
  mounted: function() {
    console.log("flow.vue: ", this.pagedata);
    const params =
      this.pagedata == null ? this.$route.params : this.pagedata;
    if (null !== params) {
      this.flowParam = params.flowParam;
      this.instanceIdInfo = params.instanceInfo;
      this.optypeOptions = params.optypeOptions;
    }
  },
  methods: {
    setButtonData() {
      for (const key in this.button) {
        const value = this.pagedata.instanceInfo.opType[key];
        if (value) {
          this.button[key] = value;
        }
      }
    },
    getOptions: function() {
      if (this.button["submit"] == "1") {
        this.optypeOptions.push(this.opNames["submit"]);
      }
      if (this.button["callBack"] !== "0") {
        this.optypeOptions.push(this.opNames["callBack"]);
      }
      if (this.button["returnBack"] !== "0") {
        this.optypeOptions.push(this.opNames["returnBack"]);
      }
      if (this.button["refuse"] !== "0") {
        this.optypeOptions.push(this.opNames["refuse"]);
      }
    },
    submitFn: function(data) {
      const { opType, param, comment } = data;
      yufp.extend(this.commentInfo, comment);
      this.submitbefore();
      if (opType == "O-1") {
        // 打回
        this.callBackFn();
      } else if (opType == "O-2") {
        // 退回
        this.returnBackFn();
      } else if (opType == "O-6") {
        // 转办
        this.title = "change";
        this.getChangeUser();
      } else if (opType == "O-7") {
        // 协办
        this.title = "assist";
        this.getAssistUser();
      } else if (opType == "O-8") {
        // 否决
        this.doRefuse();
      } else if (opType == "O-9") {
        // 跳转
        this.title = "jump";
        this.jumpDialogOpen();
        this.jumpNodeSelect.showDialog = true;
      } else if (opType == "O-12") {
        // 同意提交
        this.agreeDialogOpen(param);
      } else if (opType == "O-0") {
        // 拿回
        this.takeBackFn();
      } else if (opType == "O-5") {
        // 催办
        this.urgeFn();
      } else if (opType == "O-3") {
        // 挂起
        this.Hang();
      } else if (opType == "O-4") {
        // 唤醒
        this.Awake();
      } else if (opType == "O-15") {
        // 撤回
        this.takeBackToFirstFn();
      }
    },
    cancel: function() {
      // 跳转到之前的页面
      this.$router.replace({
        name: this.returnBackFuncId
      });
    },
    saveComment: function() {
      // 保存评论
      var _this = this;
      if (
        null == _this.commentInfo.userComment ||
        "" == _this.commentInfo.userComment
      ) {
        _this.$message({ message: "没有输入意见", type: "warning" });
      }
      var data = _this.instanceIdInfo;
      yufp.extend(true, data, _this.commentInfo);
      data.commentSign = "";
      yufp.service.request({
        method: "POST",
        data: data,
        url: _this.urls.saveComment,
        callback: function(code, message, response) {
          if (response.code == 0) {
            if (response.data != null) {
              _this.$message({
                message: "保存成功",
                type: "success",
                duration: 6000
              });
              _this.commentInfo = response.data;
            } else {
              _this.$message({
                duration: 6000,
                message: "保存意见失败",
                type: "error"
              });
            }
          } else {
            _this.$message({
              duration: 6000,
              message: "保存异常:" + response.message,
              type: "error"
            });
          }
        }
      });
    },
    signIn: function() {
      // 签收
      var _this = this;
      _this.instanceIdInfo.userId = _this.currentUserId;
      yufp.service.request({
        method: "GET",
        data: _this.instanceIdInfo,
        url: _this.urls.signIn,
        callback: function(code, message, response) {
          if (response.code == 0) {
            _this.$message({
              duration: 6000,
              message: response.data.tip,
              type: "success"
            });
            _this.$emit("afterSubmit", "signIn");
            // _this.$router.replace({ name: _this.returnBackFuncId });
          } else {
            _this.$message({
              duration: 6000,
              message: "签收异常:" + response.message,
              type: "error"
            });
          }
        }
      });
    },
    unSignIn: function() {
      var _this = this;
      _this.instanceIdInfo.userId = _this.currentUserId;
      yufp.service.request({
        method: "GET",
        data: _this.instanceIdInfo,
        url: _this.urls.unSignIn,
        callback: function(code, message, response) {
          if (response.code == 0) {
            // 跳转到之前的页面
            _this.$message(response.data.tip);
            _this.$emit("afterSubmit", "unSignIn");
            // _this.$router.replace({ name: _this.returnBackFuncId });
          } else {
            _this.$message({
              duration: 6000,
              message: "撤销签收异常:" + response.message,
              type: "error"
            });
          }
        }
      });
    },
    isFill: function() {
      var _this = this;
      var isFill = false;
      var bizType = _this.instanceIdInfo.bizType;
      var flowId = _this.instanceIdInfo.flowId;
      var nodeId = _this.instanceIdInfo.nodeId;
      yufp.service.request({
        method: "GET",
        async: false,
        url:
          backend.workflowService +
          "/api/biz/node/" +
          bizType +
          "/" +
          flowId +
          "/" +
          nodeId,
        callback: function(code, message, response) {
          if (response.code == "0") {
            if (response.data && response.data.isOptTyp == "Y") {
              isFill = true;
            }
          } else {
            _this.$message({
              duration: 6000,
              message: "查询节点配置异常:" + response.message,
              type: "error"
            });
          }
        }
      });

      return isFill;
    },
    selectLookupItems: function(lookupType, keys) {
      var oriItems = yufp.lookup.find(lookupType);
      var resItems = [];
      for (var i = 0; i < oriItems.length; i++) {
        if (keys.indexOf(oriItems[i].key) != -1) {
          resItems.push(oriItems[i]);
        }
      }
      return resItems;
    },
    doRefuse: function() {
      // 否决
      var _this = this;
      _this
        .$confirm("确定否决此流程？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(function() {
          var param = {};
          param.orgId = _this.currentOrgId;
          _this.commentInfo.commentSign = "O-8";
          if (
            null == _this.commentInfo.userComment ||
            "" == _this.commentInfo.userComment
          ) {
            _this.commentInfo.userComment = "【否决】";
          }
          param.comment = _this.commentInfo;
          yufp.service.request({
            method: "POST",
            data: param,
            url: _this.urls.refuse,
            callback: function(code, message, response) {
              if (response.code == 0) {
                // 跳转到之前的页面
                _this.$message(response.data.tip + ";");
                _this.$emit("afterSubmit", "refuse");
              } else {
                _this.$message({
                  duration: 6000,
                  message: "否决异常:" + response.message,
                  type: "error"
                });
              }
            }
          });
        })
        .catch(function() {
          _this.$message({
            duration: 6000,
            type: "info",
            message: "已取消"
          });
        });
    },
    changeFn: function(userId) {
      // 转办
      var _this = this;
      var param = {};
      param.orgId = _this.currentOrgId;
      _this.commentInfo.commentSign = "O-6";
      if (_this.commentInfo.userComment == "") {
        _this.commentInfo.userComment = "[转办]";
      }
      param.comment = _this.commentInfo;
      param.changeUserId = userId;
      yufp.service.request({
        method: "POST",
        data: param,
        url: _this.urls.change,
        callback: function(code, message, response) {
          if (response.code == 0) {
            // 跳转到之前的页面
            _this.$message(response.data.tip + ";");
            _this.$emit("afterSubmit", "change");
            // _this.$router.replace({ name: _this.returnBackFuncId });
          } else {
            _this.$message({
              duration: 6000,
              message: "转办提交异常:" + response.message,
              type: "error"
            });
          }
        }
      });
    },
    getChangeUser: function() {
      // 获取转办可选的办理人员
      var _this = this;
      var param = {
        orgId: _this.currentOrgId,
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        userId: _this.currentUserId
      };
      yufp.service.request({
        method: "POST",
        data: param,
        url: _this.urls.getchangeUser,
        callback: function(code, message, response) {
          if (response.code == 0) {
            if (response.data != null) {
              // 跳转到之前的页面
              _this.UserSelect.Users = response.data;
              _this.UserSelect.showUserDialog = true;
            } else {
              _this.$message({
                duration: 6000,
                message: "未获取到可转办人员",
                type: "warning"
              });
            }
          } else {
            _this.$message({
              duration: 6000,
              message: "获取转办人员异常:" + response.message,
              type: "error"
            });
          }
        }
      });
    },
    assistFn: function(userId) {
      // 协办
      var _this = this;
      var param = {};
      param.orgId = _this.currentOrgId;
      _this.commentInfo.commentSign = "O-7";
      if (_this.commentInfo.userComment == "") {
        _this.commentInfo.userComment = "[协助办理]";
      }
      param.comment = _this.commentInfo;
      param.assistUserId = userId;
      yufp.service.request({
        method: "POST",
        data: param,
        url: _this.urls.assist,
        callback: function(code, message, response) {
          if (response.code == 0) {
            // 跳转到之前的页面
            _this.$message(response.data.tip + ";");
            _this.$emit("afterSubmit", "assist");
            // _this.$router.replace({ name: _this.returnBackFuncId });
          } else {
            _this.$message({
              duration: 6000,
              message: "协办提交异常:" + response.message,
              type: "error"
            });
          }
        }
      });
    },
    getAssistUser: function() {
      // 获取协办可选的办理人员
      var _this = this;
      var param = {
        orgId: _this.currentOrgId,
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        userId: _this.currentUserId
      };
      yufp.service.request({
        method: "POST",
        data: param,
        url: _this.urls.getassistUser,
        callback: function(code, message, response) {
          if (response.code == 0) {
            if (response.data != null) {
              // 跳转到之前的页面
              _this.UserSelect.Users = response.data;
              _this.UserSelect.showUserDialog = true;
            } else {
              _this.$message({
                duration: 6000,
                message: "未获取到可协助办理人员",
                type: "warning"
              });
            }
          } else {
            _this.$message({
              duration: 6000,
              message: "获取协助办理人员异常:" + response.message,
              type: "error"
            });
          }
        }
      });
    },
    agreeFn: function() {
      // 节点提交
      // 遍历选中节点
      var nodes = [];
      if (this.agreeRadio != "" && this.agreeShowRadio) {
        nodes.push(this.agreeRadio);
      }

      if (this.agreeCheckBox.length > 0 && !this.agreeShowRadio) {
        for (var i = 0; i < this.agreeCheckBox.length; i++) {
          nodes.push(this.agreeCheckBox[i]);
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
                var m = 0;
                m < this.agreeNextNodes[j].copyUserInfos.length;
                m++
              ) {
                // 去重
                nextCopyUser.push(
                  this.agreeNextNodes[j].copyUserInfos[m].userId
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
        _this.$message({ duration: 6000, message: "选择节点" });
        return;
      } else {
        for (var i = 0; i < nodeInfos.length; i++) {
          if (nodeInfos[i].nextNodeUserIds.length == 0) {
            _this.$message({ duration: 6000, message: "选择节点处理人" });
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
        _this.commentInfo.userComment = "[同意]";
        _this.commentInfo.commentSign = "O-12";
      }
      param.comment = _this.commentInfo;
      var paramWF = _this.flowParam;
      // for (var i = 0; i < _this.flowParam.length; i++) {
      //   // 流程参数提交
      //   paramWF[_this.flowParam[i].key] = _this.flowParam[i].value;
      // }
      param.param = _this.flowParam;
      yufp.service.request({
        method: "POST",
        data: param,
        url: _this.urls.submit,
        callback: function(code, message, response) {
          if (response.code == 0) {
            // 跳转到之前的页面
            for (var i = 0; i < response.data.length; i++) {
              if (response.data[i].code === "1") {
                // 提交失败
                _this.$message({
                  message: response.data[i].tip,
                  type: "warning"
                });
              } else if (response.data[i].code === "E") {
                // 正常结束
                _this.$message({
                  message: response.data[i].tip,
                  type: "success"
                });
              } else {
                _this.$message({
                  message:
                    response.data[i].tip +
                    ";下一节点：" +
                    response.data[i].nodeName +
                    "@下一节点审批人：" +
                    response.data[i].userNames,
                  type: "success"
                });
              }
            }
            _this.agreeNodeSelect.showDialog = false;
            _this.$emit("afterSubmit", "submit");
            // _this.$router.replace({ name: _this.returnBackFuncId });
          } else {
            if (response.message != null) {
              _this.$message({
                duration: 6000,
                message: "提交异常:" + response.message.substring(0, 80),
                type: "error"
              });
            } else {
              _this.$message({
                duration: 6000,
                message: "提交异常!",
                type: "error"
              });
            }
          }
        }
      });
    },
    agreeDialogOpen: function(rParam) {
      // 提交窗口打开事件
      var _this = this;
      var paramWF = _this.flowParam;
      // for (var i = 0; i < _this.flowParam.length; i++) {
      //   // 流程参数提交
      //   paramWF[_this.flowParam[i].key] = _this.flowParam[i].value;
      // }
      // 更新业务参数用于路由条件判断
      for (const key in rParam) {
        paramWF[key] = rParam[key];
      }
      var param = {
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        param: paramWF
      };
      yufp.service.request({
        method: "POST",
        data: param,
        url: _this.agreeNodeSelect.nodeUrl,
        callback: function(code, message, response) {
          if (response.code == 0) {
            // 跳转到之前的页面
            if (response.data != null) {
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
              _this.$message({
                duration: 6000,
                message: "未获取到下一提交节点信息!",
                type: "warning"
              });
            }
          } else {
            _this.$message({
              duration: 6000,
              message: "获取下一节点信息异常:" + response.message,
              type: "error"
            });
          }
        }
      });
    },
    checkCopyUser: function(data, index) {
      var _this = this;
      if (_this.agreeNextNodes[index].copyUserShow == undefined) {
        _this.$set(_this.agreeNextNodes[index], "copyUserShow", false);
      }
      var param = {
        orgId: _this.currentOrgId,
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        copyNodeId: data.nodeId
      };
      yufp.service.request({
        method: "POST",
        data: param,
        url: _this.urls.getCopyUser,
        callback: function(code, message, response) {
          if (response.code == 0) {
            // 跳转到之前的页面
            if (response.data != null) {
              _this.copyUserShow = true;
              _this.agreeNextNodes[index].copyUserShow = true;
            }
          }
        }
      });
    },
    agreeUserCheck: function(data) {
      // 判断节点是否是系统指定,并对其进行处理
      var _this = this;
      var isSingle = true;
      for (var i = 0; i < data.length; i++) {
        var users = data[i].users;
        _this.checkCopyUser(data[i], i);
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
            userName: users[j].userName
          };
          if (users[j].userId == "system_user") {
            _this.agreeNextNodes[i].isSysUser = true;
            _this.agreeNextNodes[i].selected = false;
            _this.agreeNextNodes[i].userInfos.push(user);
          } else if (users.length == 1) {
            _this.agreeNextNodes[i].isSysUser = false;
            _this.agreeNextNodes[i].selected = true;
            _this.agreeNextNodes[i].userInfos.push(user);
          } else {
            isSingle = false;
          }
        }
        // 只有一个节点、节点办理人只有一个的情况，不需要弹窗选择
        // if (data.length == 1 && isSingle) {
        //   // 提交处理，不显示弹窗处理节点参数
        //   if (_this.agreeShowRadio) {
        //     _this.agreeRadio = data[i].nodeId;
        //   } else {
        //     _this.agreeCheckBox.push(data[i].nodeId);
        //   }
        //   _this.agreeRadioChange(data[i].nodeId);
        //   _this.agreeFn();
        //   return;
        // }
        _this.agreeNodeSelect.showDialog = true;
        if (data.length == 1) {
          // 只有一个节点直接选中
          if (_this.agreeShowRadio) {
            _this.agreeRadio = data[i].nodeId;
          } else {
            _this.agreeCheckBox.push(data[i].nodeId);
          }
          _this.agreeRadioChange(data[i].nodeId);
        }
      }
    },
    agreeRadioChange: function(val) {
      // 节点选择变化事件
      var _this = this;
      var nodeIds = [];
      var checked = false;
      if (_this.agreeShowRadio) {
        nodeIds.push(val);
      } else {
        nodeIds = val;
      }
      // 未被选择的节点以及选择的数据项进行处理
      for (var i = 0; i < _this.agreeNextNodes.length; i++) {
        checked = false;
        for (var k = 0; k < nodeIds.length; k++) {
          if (nodeIds[k] == _this.agreeNextNodes[i].nodeId) {
            checked = true;
            _this.agreeNextNodes[i].selected = true;
            _this.agreeIndex = i;
            _this.agreeUserClose();
          }
        }
        if (!checked) {
          _this.agreeNextNodes[i].userSelected = "";
          _this.agreeNextNodes[i].selected = false;
        }
      }
    },
    agreeSelectNodeUser: function(node, index) {
      // 选择按钮
      this.agreeIndex = index;
      this.agreeUserDialogOpen(node.nodeId);
    },
    agreeUserDialogOpen: function(nodeId) {
      // 选择节点办理人员窗口打开事件处理
      var _this = this;
      var nodeInfo = {};
      nodeInfo.instanceId = _this.instanceIdInfo.instanceId;
      nodeInfo.nodeId = nodeId;
      var param = {
        condition: JSON.stringify(nodeInfo)
      };
      yufp.service.request({
        method: "GET",
        data: param,
        url: _this.agreeNodeSelect.userUrl,
        callback: function(code, message, response) {
          if (response.code == 0) {
            if (response.data != null) {
              _this.agreeNodeSelect.userTableData = response.data;
              _this.agreeNodeSelect.showUserDialog = true;
            } else {
              _this.$message({
                duration: 6000,
                message: "未获取到办理人员信息!",
                type: "warning"
              });
            }
          } else {
            _this.$message({
              duration: 6000,
              message: "获取办理人员异常:" + response.message,
              type: "warning"
            });
          }
        }
      });
    },
    agreeRowDbClick: function(row, event) {
      // tag双击事件
      var user = {};
      user.userId = row.userId;
      user.userName = row.userName;
      if (this.agreeNextNodes[this.agreeIndex].userInfos == undefined) {
        this.$set(this.agreeNextNodes[this.agreeIndex], "userInfos", []);
      }
      var userInfosT = this.agreeNextNodes[this.agreeIndex].userInfos;
      for (var i = 0; i < userInfosT.length; i++) {
        // 去重
        if (userInfosT[i].userId == user.userId) {
          return;
        }
      }
      userInfosT.push(user);
    },
    agreeTagClose: function(tag) {
      // tag关闭事件
      if (this.agreeNextNodes[this.agreeIndex].userInfos == undefined) {
        this.$set(this.agreeNextNodes[this.agreeIndex], "userInfos", []);
      }
      var userInfosT = this.agreeNextNodes[this.agreeIndex].userInfos;
      userInfosT.splice(userInfosT.indexOf(tag), 1);
    },
    agreeUserClose: function() {
      // 选取返回
      this.agreeNodeSelect.showUserDialog = false;
      var userName = "";
      if (this.agreeNextNodes[this.agreeIndex].userInfos == undefined) {
        this.$set(this.agreeNextNodes[this.agreeIndex], "userInfos", []);
      }
      var userInfosT = this.agreeNextNodes[this.agreeIndex].userInfos;
      for (var i = 0; i < userInfosT.length; i++) {
        userName = userName + userInfosT[i].userName + ";";
      }
      this.agreeNextNodes[this.agreeIndex].userSelected = userName;
    },
    agreeDialogClose: function() {
      // 提交窗口关闭事件
      this.agreeRadio = "";
      this.agreeCheckBox = [];
      this.agreeIsLastRadio = "N";
    },
    returnBackFn: function() {
      // 退回操作
      var _this = this;
      var param = {};
      // _this.$refs.commentForm.validate(function (vaild) {
      //   // 校验规则
      //   if (vaild) {

      //   } else {
      //     _this.$message({
      //       duration: 6000,
      //       message: '请检查输入项是否合法!',
      //       type: 'warning'
      //     });
      //   }
      // });
      param.orgId = _this.currentOrgId;
      _this.commentInfo.commentSign = "O-2";
      if (_this.commentInfo.userComment == "") {
        _this.commentInfo.userComment = "[退回]";
      }
      param.comment = _this.commentInfo;
      _this
        .$confirm("是否执行退回操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(function() {
          yufp.service.request({
            method: "POST",
            data: param,
            url: _this.urls.returnBack,
            callback: function(code, message, response) {
              if (response.code == 0) {
                // 跳转到之前的页面
                _this.$message(
                  response.data.tip +
                    ";" +
                    response.data.nodeName +
                    "@" +
                    response.data.userNames
                );
                _this.$emit("afterSubmit", "returnBack");
                // _this.$router.replace({ name: _this.returnBackFuncId });
              } else {
                _this.$message({
                  duration: 6000,
                  message: "退回异常:" + response.message,
                  type: "error"
                });
              }
            }
          });
        })
        .catch(function() {
          _this.$message({
            duration: 6000,
            type: "info",
            message: "已取消"
          });
        });
    },
    callBackFn: function() {
      // 打回操作
      var _this = this;
      // _this.$refs.commentForm.validate(function (vaild) {
      //   // 校验规则
      //   if (!vaild) {
      //     _this.$message({
      //       duration: 6000,
      //       message: '请检查输入项是否合法!',
      //       type: 'warning'
      //     });
      //   }
      // });
      _this.doCallBack();
    },
    doCallBack: function() {
      var _this = this;
      _this.backNodeModel = "";
      _this.callbackNodeSelect.showDialog = true;
    },
    backDialogOpen: function() {
      // 获取可打回节点的信息
      var _this = this;
      var param = {
        orgId: _this.instanceIdInfo.orgId,
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        userId: _this.currentUserId
      };
      yufp.service.request({
        method: "POST",
        data: param,
        url: _this.callbackNodeSelect.nodeUrl,
        callback: function(code, message, response) {
          if (response.code == 0) {
            if (response.data != null) {
              var nodes = response.data;
              for (var i = 0; i < nodes.length; i++) {
                var node = {
                  nodeId: nodes[i].nodeId,
                  nodeName: nodes[i].nodeName,
                  selected: false,
                  usersList: []
                };
                var users = nodes[i].users;
                if (users.length != 0) {
                  for (var k = 0; k < users.length; k++) {
                    var user = {
                      userId: users[k].userId,
                      userName: users[k].userName
                    };
                    node.usersList.push(user);
                  }
                }
                _this.backNodes.push(node);
              }
            } else {
              _this.$message({
                duration: 6000,
                message: "未获取到可打回节点!",
                type: "warning"
              });
            }
          } else {
            _this.$message({
              duration: 6000,
              message: "获取打回节点异常:" + response.message,
              type: "error"
            });
          }
        }
      });
    },
    radioChange: function(val) {
      // 打回节点选择
      this.userModel = "";
      for (var i = 0; i < this.backNodes.length; i++) {
        var id = this.backNodes[i].nodeId;
        this.backNodes[i].selected = false;
        if (id == val) {
          this.backNodes[i].selected = true;
        }
      }
    },
    wfCallBackClose: function() {
      // 打回界面关闭
      var _this = this;
      _this.backActiveName = "first";
      _this.backnode = 0;
      _this.backNodes = [];
      // _this.usersList = [];
      _this.callbackNodeSelect.showDialog = false;
    },
    wfCallBack: function() {
      // 打回接口调用
      var _this = this;
      if (!_this.backNodeModel) {
        _this.$message({
          duration: 6000,
          message: "请选择打回节点!",
          type: "error"
        });
        return false;
      }
      if (!_this.userModel) {
        _this.$message({
          duration: 6000,
          message: "请选择打回节点的办理人!",
          type: "error"
        });
        return false;
      }
      _this.callbackNodeSelect.showDialog = false;
      var param = {
        callbackNodeId: _this.backNodeModel,
        callbackUserId: _this.userModel,
        callbackModel: _this.backnode + "", // 打回模式 【 0-打回后提交直接给我，1-打回后提交沿流程路径（默认）】
        orgId: _this.currentOrgId
      };
      _this.commentInfo.commentSign = "O-1";
      if (_this.commentInfo.userComment == "") {
        _this.commentInfo.userComment = "[打回]";
      }
      param.comment = _this.commentInfo;
      // 打回接口调用
      yufp.service.request({
        method: "POST",
        data: param,
        url: _this.urls.callBack,
        callback: function(code, message, response) {
          if (response.code == 0) {
            // 跳转到之前的页面
            _this.$message({
              duration: 6000,
              message: response.data.tip,
              type: "success"
            });
            _this.$emit("afterSubmit", "callBack");
            // _this.$router.replace({ name: _this.returnBackFuncId });
          } else {
            _this.$message({
              duration: 6000,
              message: "打回异常:" + response.message,
              type: "error"
            });
          }
        }
      });
      _this.wfCallBackClose();
    },
    // 跳转
    jumpDialogOpen: function() {
      // 获取可跳转节点
      var _this = this;
      var param = {
        orgId: _this.instanceIdInfo.orgId,
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        userId: _this.currentUserId
      };
      yufp.service.request({
        method: "POST",
        data: param,
        url: _this.jumpNodeSelect.nodeUrl,
        callback: function(code, message, response) {
          if (response.code == 0) {
            if (response.data != null) {
              // 跳转到之前的页面
              var nodes = response.data;
              for (var i = 0; i < nodes.length; i++) {
                var n = {
                  nodeId: nodes[i].nodeId,
                  nodeName: nodes[i].nodeName,
                  selected: false,
                  selectUser: [],
                  usersList: nodes[i].users
                };
                _this.jumpNodes.push(n);
              }
            } else {
              _this.$message({
                duration: 6000,
                message: "未获取到可跳转节点!",
                type: "warning"
              });
            }
          } else {
            _this.$message({
              duration: 6000,
              message: "获取跳转节点异常:" + response.message,
              type: "error"
            });
          }
        }
      });
    },
    jumpSelectUser: function(node, index) {
      // 获取选择的节点的人员
      var _this = this;
      _this.index = index;
      if (node.usersList.length == 1) {
        _this.$nextTick(function() {
          _this.jumpNodes[index].selectUser = node.usersList[0];
        });
      } else {
        _this.UserSelect.Users = node.usersList;
        _this.UserSelect.showUserDialog = true;
      }
    },
    jumpradioChange: function(val) {
      // 跳转节点选择
      for (var i = 0; i < this.jumpNodes.length; i++) {
        this.jumpNodes[i].selected = false;
        var id = this.jumpNodes[i].nodeId;
        if (id == val) {
          this.jumpNodes[i].selected = true;
        }
        this.jumpNodes[i].selectUser = [];
      }
      this.UserSelect.SelectUsers = [];
    },
    jumpFn: function() {
      // 跳转接口调用
      var _this = this;
      var param = {
        jumpNodeId: _this.jumpNodeModel,
        jumpUserId: _this.jumpNodes[_this.index].selectUser.userId,
        orgId: _this.instanceIdInfo.orgId
      };
      _this.commentInfo.commentSign = "O-9";
      if (_this.commentInfo.userComment == "") {
        _this.commentInfo.userComment = "[跳转]";
      }
      param.comment = _this.commentInfo;
      yufp.service.request({
        method: "POST",
        data: param,
        url: _this.urls.jump,
        callback: function(code, message, response) {
          if (response.code == 0) {
            // 跳转到之前的页面
            _this.$message({
              duration: 6000,
              message: response.data.tip + ";",
              type: "success"
            });
            _this.$emit("afterSubmit", "jump");
            // _this.$router.replace({ name: _this.returnBackFuncId });
          } else {
            _this.$message({
              duration: 6000,
              message: "跳转异常:" + response.message,
              type: "error"
            });
          }
        }
      });
      _this.jumpClose();
    },
    jumpClose: function() {
      // 跳转窗口 关闭
      this.jumpNodes = [];
      this.jumpNodeModel = "";
      this.jumpNodeSelect.showDialog = false;
    },

    // 人员选择弹框
    submitbefore: function() {
      // 弹框前处理
      this.UserSelect.Users = [];
      this.UserSelect.SelectUsers = [];
    },
    RowDbClick: function(row, event) {
      // 列表双击事件
      var user = {
        userId: row.userId,
        userName: row.userName
      };
      if (this.UserSelect.SelectUsers == undefined) {
        this.$set(this.UserSelect, "SelectUsers", []);
      }
      var userInfosT = this.UserSelect.SelectUsers;
      for (var i = 0; i < userInfosT.length; i++) {
        // 去重
        if (userInfosT[i].userId == row.userId) {
          return;
        }
      }
      userInfosT.push(user);
    },
    TagClose: function(tag) {
      // tag页签关闭事件
      if (this.UserSelect.SelectUsers == undefined) {
        this.$set(this.UserSelect, "SelectUsers", []);
      }
      var userInfosT = this.UserSelect.SelectUsers;
      userInfosT.splice(userInfosT.indexOf(tag), 1);
    },
    UserDialogClose: function() {
      // 弹框关闭
      this.UserSelect.showUserDialog = false;

      if (this.UserSelect.SelectUsers == undefined) {
        this.$set(this.UserSelect, "SelectUsers", []);
      }
      var userInfosT = this.UserSelect.SelectUsers;
      if (
        this.title == "jump" ||
        this.title == "assist" ||
        this.title == "change"
      ) {
        if (userInfosT.length > 1) {
          this.$message({
            message: "该功能只能选择一个办理人员!",
            type: "warning",
            duration: 6000
          });
          return false;
        }
      }
      var userName = userInfosT[0].userName;
      var userId = userInfosT[0].userId;
      if (this.title == "jump") {
        this.jumpNodes[this.index].selectUser.userName = userName;
        this.jumpNodes[this.index].selectUser.userId = userId;
      } else if (this.title == "assist") {
        this.assistFn(userId);
      } else if (this.title == "change") {
        this.changeFn(userId);
      } else if (this.title == "copy") {
        for (var i = 0; i < userInfosT.length; i++) {
          userName = "";
          userName = userName + userInfosT[i].userName + ";";
        }
        this.agreeNextNodes[this.agreeIndex].copyUser = userName;
        this.agreeNextNodes[this.agreeIndex].copyUserInfos = userInfosT;
      }
    },
    wfGatherFn: function() {
      // 会办功能实现
      var _this = this;
      this.$confirm("确定要发起会办吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(function() {
          _this.gatherStartFn();
        })
        .catch(function() {
          _this.$message({ duration: 6000, type: "info", message: "已取消" });
        });
    },
    gatherStartFn: function() {
      var _this = this;
      var param = {
        instanceId: _this.instanceIdInfo.instanceId,
        userId: _this.currentUserId,
        nodeId: _this.instanceIdInfo.nodeId,
        orgId: _this.currentOrgId,
        orgName: _this.currentOrgName
      };
      yufp.service.request({
        method: "POST",
        data: param,
        url: backend.workflowService + "/api/metting/start",
        callback: function(code, message, response) {
          if (response.data !== null) {
            _this.$message({
              duration: 6000,
              message: "初始化会办会议成功!",
              type: "success"
            });
            _this.$nextTick(function() {
              try {
                _this.meetData = response.data;
                _this.meetPage = function() {
                  return Promise.resolve(
                    require("@/views/workflow/instance/metting/meetstart.vue")
                      .default
                  );
                };
                _this.gatherPageData = _this.meetData;
              } catch (e) {}
            });
          } else {
            _this.$message({
              duration: 6000,
              message: "该流程已经进行过会办!",
              type: "warning"
            });
          }
        }
      });
    },
    Select: function() {
      this.agreeNodeSelect.showUserDialog = true;
    },
    currpageChange: function(val) {
      this.currpage = val;
    },
    pagesizeChange: function(val) {
      this.pagesize = val;
    },
    unSignInTaskPool: function() {
      // 放回项目池
      var _this = this;
      var param = {
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        userId: _this.userCode,
        poolId: _this.button.taskPoolId
      };
      _this
        .$confirm("确定要放回项目池吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(function() {
          yufp.service.request({
            method: "POST",
            data: param,
            url: _this.urls.unSignInTaskPool,
            callback: function(code, message, response) {
              if (response.code == 0) {
                _this.$message({
                  duration: 6000,
                  message: response.data.tip,
                  type: "success"
                });
              } else {
                _this.$message({
                  duration: 6000,
                  message: "放回项目池异常:" + response.message,
                  type: "warning"
                });
              }
              _this.$emit("afterSubmit", "unSignInTaskPool");
              // _this.$router.replace({ name: _this.returnBackFuncId });
            }
          });
        })
        .catch(function() {
          _this.$message({ duration: 6000, type: "info", message: "已取消" });
        });
    },
    subFlowStart: function() {
      // 发起子流程功能
      var _this = this;
      // _this.$refs.commentForm.validate(function (vaild) {
      //   // 校验规则
      //   if (vaild) {

      //   } else {
      //     _this.$message({
      //       duration: 6000,
      //       message: '请检查输入项是否合法!',
      //       type: 'warning'
      //     });
      //   }
      // });
      _this
        .$confirm("是否执行发起子流程操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(function() {
          var param = {};
          param.orgId = _this.currentOrgId;
          param.systemId = "cmis";
          param.bizType = _this.button.subFlowId;
          _this.commentInfo.commentSign = "";
          if (_this.commentInfo.userComment == "") {
            _this.commentInfo.userComment = "[发起子流程]";
          }
          param.comment = _this.commentInfo;
          yufp.service.request({
            method: "POST",
            data: param,
            url: _this.urls.subFlowStart,
            callback: function(code, message, response) {
              if (response.code == 0) {
                // 跳转到之前的页面
                _this.$message(response.data.tip + ";");
                _this.$emit("afterSubmit", "subFlow");
                // _this.$router.replace({ name: _this.returnBackFuncId });
              } else {
                _this.$message({
                  duration: 6000,
                  message: "子流程发起异常:" + response.message + ";",
                  type: "error"
                });
              }
            }
          });
        })
        .catch(function() {
          this.$message({
            duration: 6000,
            type: "info",
            message: "已取消"
          });
        });
    },
    agreeSelectCopyUser: function(node, index) {
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
        copyNodeId: node.nodeId
      };
      yufp.service.request({
        method: "POST",
        data: param,
        url: _this.urls.getCopyUser,
        callback: function(code, message, response) {
          if (response.code == 0) {
            // 跳转到之前的页面
            if (response.data != null) {
              _this.UserSelect.Users = response.data;
              _this.title = "copy";
              _this.UserSelect.showUserDialog = true;
            } else {
              _this.$message({
                duration: 6000,
                message: "没有抄送人员可以选择!",
                type: "warning"
              });
            }
          } else {
            if (response.message != null) {
              _this.$message({
                duration: 6000,
                message: response.message,
                type: "warning"
              });
            } else {
              _this.$message({
                duration: 6000,
                message: "获取可抄送人员异常:" + response.message,
                type: "warning"
              });
            }
          }
        }
      });
    },
    // 拿回(已办)
    takeBackFn: function() {
      var _this = this;
      _this
        .$confirm("确定要拿回本条流程吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(function() {
          var param = {};
          _this.commentInfo.commentSign = "O-0";
          if (_this.commentInfo.userComment == "") {
            _this.commentInfo.userComment = "[拿回]";
          }
          param.comment = _this.commentInfo;
          param.orgId = _this.currentOrgId;
          yufp.service.request({
            method: "POST",
            data: param,
            url: _this.urls.tackBack,
            callback: function(code, message, response) {
              if (response.code == 0) {
                // 跳转到之前的页面
                if (response.data.code == "1") {
                  _this.$message({
                    message: response.data.tip + ";",
                    type: "error",
                    duration: 6000
                  });
                } else {
                  _this.$message({
                    message: response.data.tip + ";",
                    type: "success",
                    duration: 6000
                  });
                }
                _this.$router.replace({ name: _this.returnBackFuncId });
              } else {
                _this.$message({
                  message: response.message + ";",
                  type: "error",
                  duration: 6000
                });
              }
            }
          });
        })
        .catch(function() {});
    },
    // 撤回(我的发起-已办)
    takeBackToFirstFn: function() {
      var _this = this;
      _this
        .$confirm("确定要将本条流程撤回到起始节点吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(function() {
          var param = {};
          _this.commentInfo.commentSign = "O-15";
          if (_this.commentInfo.userComment == "") {
            _this.commentInfo.userComment = "[撤回]";
          }
          param.comment = _this.commentInfo;
          param.orgId = _this.currentOrgId;
          yufp.service.request({
            method: "POST",
            data: param,
            url: _this.urls.tackbackToFirst,
            callback: function(code, message, response) {
              if (response.code == 0) {
                // 跳转到之前的页面
                _this.$message({
                  message: response.data.tip + ";",
                  type: "success",
                  duration: 6000
                });
                _this.$router.replace({ name: _this.returnBackFuncId });
              } else {
                _this.$message({
                  message: response.message + ";",
                  type: "error",
                  duration: 6000
                });
              }
            }
          });
        })
        .catch(function() {});
    },
    // 催办(发起人)
    urgeFn: function() {
      var _this = this;
      _this
        .$confirm("确定要催促本条流程的办理进度吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(function() {
          var param = {
            instanceId: _this.instanceIdInfo.instanceId,
            nodeId: _this.instanceIdInfo.nodeId
          };
          yufp.service.request({
            method: "GET",
            data: param,
            url: _this.urls.urge,
            callback: function(code, message, response) {
              if (response.code == 0) {
                // 跳转到之前的页面
                _this.$message({
                  message: response.data.tip + ";",
                  type: "success",
                  duration: 6000
                });
                _this.$router.replace({ name: _this.returnBackFuncId });
              } else {
                _this.$message({
                  message: response.message + ";",
                  type: "error",
                  duration: 6000
                });
              }
            }
          });
        })
        .catch(function() {});
    },
    // 激活-我的发起-已办结
    activateFn: function() {
      var _this = this;
      _this
        .$confirm("确定要执行激活操作吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(function() {
          var param = {
            instanceId: _this.instanceIdInfo.instanceId,
            currentUserId: _this.currentUserId
          };
          yufp.service.request({
            method: "GET",
            data: param,
            url: _this.urls.activate,
            callback: function(code, message, response) {
              if (response.code == 0) {
                // 跳转到之前的页面
                _this.$message({
                  message: response.data.tip + ";",
                  type: "success",
                  duration: 4000
                });
                _this.$router.replace({ name: _this.returnBackFuncId });
              } else {
                _this.$message({
                  message: response.message + ";",
                  type: "error",
                  duration: 4000
                });
              }
            }
          });
        })
        .catch(function() {});
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
