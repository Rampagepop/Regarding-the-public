<template>
  <div>
    <yu-xdialog class="wrklfl" title="提交123" :visible.sync="dialogVisible" open="dialogOpen" width="700px" v-loading="dialogLoading" :befor-close="beforeClose">
      <yu-xform ref="refForm" label-width="92px" align="center" v-model="formdata">
        <yu-radio-group v-model="agreeRadio" v-show="showRadioFlag" @change="radioChange" style="width: auto; padding-left: 20px">
          <yu-xform-item v-for="(item,idx) in nextNodes" :key="idx" label="" style="min-width: 380px" align="left" ctype="custom" name="" colspan="24">
            <el-row :gutter="10">
              <el-col :span="4" style="text-align: right;">
                <yu-radio :label="item.nodeId">{{ filterFn(item.nodeName) }}</yu-radio>
              </el-col>
              <el-col :span="10">
                <el-row :gutter="10">
                  <el-col :span="16">
                    <yu-input type="textarea" v-model="item.userSelected" readonly></yu-input>
                  </el-col>
                  <el-col :span="8">
                    <yu-button size="small" v-if="item.isSysUser!=true && item.selected==true" @click="chooseFn(item,idx,'')">选择</yu-button>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="10" v-show="item.nodeType!='E'">
                <el-row :gutter="10">
                  <el-col :span="16">
                    <yu-input type="textarea" v-model="item.copyUser" readonly></yu-input>
                  </el-col>
                  <el-col :span="8">
                    <yu-button size="small" @click="chooseFn(item,idx,'send')">抄送</yu-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>


          </yu-xform-item>
        </yu-radio-group>

        <yu-xform-item label="意见" ctype="textarea" name="userComment" :rules="inputRules"></yu-xform-item>
      </yu-xform>
      <div slot="footer">
        <yu-button @click="submitFn" v-norepeat>提交</yu-button>
      </div>
    </yu-xdialog>
    <cdp-flow-user-select ref="userSeleRefs" :title="title" :sele-types="seleTypes" :methods="methods" :data-url="dataUrl" :params="params" @choose="chooseUserFn"></cdp-flow-user-select>
  </div>
</template>

<script>
import CdpFlowUserSelect from "./CdpFlowUserSelect.vue"; // 人员选择组件

export default {
  name: "CdpFlowStart",
  components: { CdpFlowUserSelect },
  data: function () {
    return {
      submitUrl: String, // 流程提交接口
      wrkflInfo: {}, // 工作流信息

      currentIdx: "", // 当前的idx
      methods: "", //
      title: "", // 人员选择弹框title
      seleTypes: "", // 审批人员选择类型（）
      eNodeType:'', //判断是否发起就结束
      dataUrl: "", // 审批人员列表url
      params: {}, // 审批人员列表参数
      formdata: {}, // 提交表单
      agreeRadio: "", // 单选框值
      showRadioFlag: false, // 是否展示单选框
      dialogLoading: false, // 提交弹框加载动画
      dialogVisible: false, // 提交选择弹框
      wrkflUrl: backend.workflowService + "/api/core/getNextNodeInfos", // 流程节点
      nextNodes: [], // 下一节点数据
      inputRules: {
        required: true,
        message: "该输入项为必输项",
      } // 表单必输校验
    };
  },
  mounted: function () {
    // this.$emit('childThis', this)
  },
  methods: {
    filterFn: function (str) {
      const reg = /[0-9]+/g;
      return str.replace(reg, "");
    },
    /**
     * 低代码配置页面调用初始化发起流程，要先定制区域配置
      let data = {
        preFlowUrl: '/cdp-cus/api/cus/itbk/applapp',
        bizType: "01_cusItbkAppl",// 业务类型，必填
        bizId: 1589776296225,// 业务主键，必填
        param: { // 流程路由参数
          "金额": "10000",
          "money": 200
        }
      }
      this.$refs.flowStart.startFlow(data)
     */
    startFlow(data) {
      const startUrl = data.preFlowUrl + '/flowStart'
      this.submitUrl = data.preFlowUrl + '/flowSubmit'
      data.param = data.param || {};
      // 业务功能对应的流程审批URL
      data.param.preFlowUrl = data.preFlowUrl
      delete data.preFlowUrl
      return this.$request({
        method: 'POST',
        url: startUrl,
        data: data
      }).then((res) => {
        if (res.code != '0') {
          const msg = (res.message || '发起流程失败！') + '';
          this.$message({message: msg, type: 'error'})
          return Promise.reject(msg);
        }
        const wrkflInfo = {}
        yufp.clone(res.data, wrkflInfo);
        data.bizId = res.data.bizId;
        this.wrkflInfo = wrkflInfo;
        this.agreeRadio = "";
        return this.$request({
          method: "GET",
          url: this.wrkflUrl,
          data: this.wrkflInfo
        })
      }).then(response => {
        if(response.code != '0') {
          const msg = (response.message || '获取流程节点失败！') + '';
          this.$message({message: msg, type: 'error'})
          return Promise.reject(msg)
        }
        this.nextNodes = yufp.extend([], response.data);
        const nodeType = this.wrkflInfo.nodeType;
        this.eNodeType = response.data[0].nodeType;
        this.showRadioFlag = (nodeType == "0" || nodeType == "1" || nodeType == "3") ? true : false;
        this.userCheck();
        this.dialogVisible = true;
      })
    },
    // 父组件打开提交弹框
    openDialog: function () {
      const _this = this
      _this.agreeRadio = "";
      _this.dialogVisible = true;
    },
    // 提交弹框打开事件
    dialogOpen: function () {
      const _this = this,
        wrkflInfo = _this.wrkflInfo,
        nodeType = _this.wrkflInfo.nodeType;
      _this.$request({
        method: "GET",
        url: _this.wrkflUrl,
        data: wrkflInfo
      })
        .then(response => {
          _this.nextNodes = yufp.extend([], response.data);
          _this.showRadioFlag =
            nodeType == "0" || nodeType == "1" || nodeType == "3"
              ? true
              : false;
          _this.userCheck();

        });

    },
    // 选择审批人员
    chooseFn: function (item, idx, type) {
      const _this = this;
      _this.currentIdx = idx;
      // 设置审批人员请求参数
      _this.dataUrl =
        type == "send" ? "/api/core/getCopyUsers" : "/api/core/getNodeUsers";
      _this.dataUrl = backend.workflowService + _this.dataUrl;
      _this.methods = type == "send" ? "POST" : "GET";
      if (type == "send") {
        _this.nextNodes[idx];
        if (_this.nextNodes[idx].copyUserInfos == undefined) {
          _this.$set(_this.nextNodes[idx], "copyUserInfos", []);
        }
        if (_this.nextNodes[idx].copyUser == undefined) {
          _this.$set(_this.nextNodes[idx], "copyUser", "");
        }
        _this.params = {
          orgId: yufp.session.org.id,
          instanceId: _this.wrkflInfo.instanceId,
          nodeId: _this.wrkflInfo.nodeId,
          copyNodeId: item.nodeId
        };
      } else {
        _this.params = {
          condition: JSON.stringify({
            instanceId: _this.wrkflInfo.instanceId,
            nodeId: item.nodeId
          })
        };
      }
      this.$refs.userSeleRefs.openDialog(type);
    },
    // 判断节点是否是系统指定,并对其进行处理
    userCheck: function () {
      const _this = this;
      _this.nextNodes.forEach(item => {
        if (item.isSysUser == undefined) {
          _this.$set(item, "isSysUser", "");
        }
        if (item.selected == undefined) {
          _this.$set(item, "selected", "");
        }
        item.users.forEach((ele, j) => {
          if (ele.userId == "system_user") {
            item.isSysUser = true;
            item.selected = false;
            const user = {
              userId: ele.userId,
              userName: ele.userName
            };
            if (item.userInfos == undefined) {
              _this.$set(item, "userInfos", []);
            }
            item.userInfos.push(user);
          }
        });
        if (_this.nextNodes.length === 1) {
          // 只有一个节点
          if (_this.showRadioFlag) {
            _this.agreeRadio = item.nodeId;
            _this.radioChange(item.nodeId);
          } else {
            //_this.checkBox.push(data[i].nodeId);
          }
        }
      });
    },
    radioChange: function (val) {
      // 节点选择变化事件
      var _this = this;
      var nodeIds = [];
      var checked = false;
      if (_this.showRadioFlag) {
        nodeIds.push(val);
      } else {
        if (!val) {
          _this.agreeCheckBox = [];
        }
        nodeIds = _this.agreeCheckBox;
      }
      // 未被选择的节点处理

      for (var i = 0; i < _this.nextNodes.length; i++) {
        checked = false;
        for (var k = 0; k < nodeIds.length; k++) {
          if (nodeIds[k] === _this.nextNodes[i].nodeId) {
            checked = true;
            _this.nextNodes[i].selected = true;
            _this.currentIdx = i;
            _this.agreeUserClose();
          }
        }
        if (!checked) {
          _this.nextNodes[i].userSelected = "";
          _this.nextNodes[i].selected = false;
        }
      }
      if(!checked) {
        const aArray = yufp.extend([], this.nextNodes)
        aArray[0].userSelected = '';
        aArray[0].selected = false;
        this.nextNodes = yufp.extend([], aArray)
      }
    },
    agreeUserClose: function () {
      // 选取返回
      var userName = "";
      if (this.nextNodes[this.currentIdx].userInfos === undefined) {
        this.$set(this.nextNodes[this.currentIdx], "userInfos", []);
      }
      var userInfosT = this.nextNodes[this.currentIdx].userInfos;
      for (var i = 0; i < userInfosT.length; i++) {
        userName = userName + userInfosT[i].userName + ";";
      }
      this.nextNodes[this.currentIdx].userSelected = userName;
    },
    // 提交
    submitFn: function () {
      const _this = this;
      const params = {},
        nodeInfos = {
          nextNodeId: "",
          nextNodeUserIds: [],
          nextNodeCopyUserIds: []
        },
        currentList = _this.nextNodes[_this.currentIdx];
      let valid = false;
      _this.$refs.refForm.validate(function (val) {
        valid = val;
      });
      if (!valid) {
        return;
      }
      if (
        !currentList ||
        !currentList.userInfos ||
        currentList.userInfos.length < 1
      ) {
        _this.$message.error("选择节点处理人");
        return;
      }
      // 参数处理
      nodeInfos.nextNodeId = currentList.nodeId;
      // 选择审批流程人员
      currentList.userInfos.forEach(item => {
        nodeInfos.nextNodeUserIds.push(item.userId);
      });
      // 选择审批抄送流程人员
      if (currentList.copyUserInfos) {
        currentList.copyUserInfos.forEach(item => {
          nodeInfos.nextNodeCopyUserIds.push(item.userId);
        });
      }
      params.orgId = yufp.session.org.id; // 当前机构号
      params.nextNodeInfos = [nodeInfos];
      // 判断用户是否录入意见
      delete _this.formdata[""];
      if (_this.formdata.userComment == "") {
        _this.formdata.userComment = "[同意]";
      }
      _this.formdata.commentSign = "O-12"; // 评论节点
      _this.formdata.instanceId = _this.wrkflInfo.instanceId; // 评论流程节点设置
      _this.formdata.nodeId = _this.wrkflInfo.nodeId; // 评论当前处理节点设置
      _this.formdata.userId = ""; // 评论当前处理节点设置
      _this.formdata.commentId = ""; // 评论当前处理节点设置
      _this.formdata.ext = "无"; // 评论当前处理节点设置
      params.comment = _this.formdata;
      params.bizId = _this.wrkflInfo.bizId; // 参数业务流水号
      params.isComplate = _this.eNodeType == '' || _this.eNodeType == undefined ? _this.wrkflInfo.nodeType : _this.eNodeType; // 参数当前节点类型
      params.bizType = _this.wrkflInfo.bizType;// 业务申请类型
      params.param = {};
      _this.$request({
        method: "POST",
        data: params,
        url: _this.submitUrl
      })
        .then(response => {
          if (response.code == 0) {
            _this.$message("流程提交成功");
            _this.dialogVisible = false;
            _this.$emit("complete", 'success');
            // _this.closeNowPage()
          } else {
            _this.$message.error(response.message);
          }
        });
    },
    // 选择返回设置当前数据
    chooseUserFn: function (params) {
      const currenrNodes = this.nextNodes[this.currentIdx];
      let userName = "";
      params.list.forEach(item => {
        userName = userName + item.userName + ",";
      });
      if (params.types == "send") {
        if (currenrNodes.copyUserInfos == undefined) {
          this.$set(currenrNodes, "copyUserInfos", []);
        }
        currenrNodes.copyUserInfos = yufp.extend([], params.list);
        currenrNodes.copyUser = userName;
      } else {
        if (currenrNodes.userInfos == undefined) {
          this.$set(currenrNodes, "userInfos", []);
        }
        currenrNodes.userInfos = yufp.extend([], params.list);
        currenrNodes.userSelected = userName;
        currenrNodes.nodeName = currenrNodes.nodeName + "1";
      }
    },
    beforeClose: function () {
      this.currentIdx = "";
      this.dialogVisible = false;
      this.$refs.refForm.resetFields();
    }
  }
};
</script>
