<!--
  @Created by liuyw6@yusys.com.cn 2021-05-26
  @updated by
  @description 消息中心
-->
<template>
  <div class="data-schedule">
    <yu-panel
      :title="$t('messageCenterManager.xxzx')"
      panel-type="normal"
      no-padding-top
    >
      <!-- <template slot="right">
        <yu-button key="add" @click="addMessgeConfig()">{{
          $t("messageCenterManager.tssz")
        }}</yu-button>
      </template> -->
      <yu-tabs v-model="activeName" @tab-click="switchTabs">
        <yu-tab-pane :label="$t('messageCenterManager.dbrw')" name="1">
          <yu-xform
            v-model="formdata"
            related-table-name="taskTable"
            ref="taskSearchForm"
            class="el-form-search"
          >
            <yu-xform-group :column="4">
              <yu-xform-item
                :label="$t('messageCenterManager.tslx')"
                :placeholder="$t('messageCenterManager.qxz')"
                ctype="select"
                name="flowBizType"
                :options="taskFlowBizType"
              ></yu-xform-item>
              <yu-xform-item
                :label="$t('messageCenterManager.rqfw')"
                name="remindDate"
                ctype="datepicker"
                type="datetimerange"
                :start-placeholder="$t('messageCenterManager.ksrq')"
                :end-placeholder="$t('messageCenterManager.jsrq')"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['12:00:00']"
                unlink-panels
              >
              </yu-xform-item>
              <yu-xform-item
                :label="$t('messageCenterManager.tsnr')"
                :placeholder="$t('messageCenterManager.gjz')"
                ctype="input"
                name="keyWord"
              ></yu-xform-item>
              <div slot="custom" class="search-btn-group">
                <yu-button
                  type="primary"
                  @click="searchFn"
                  style="margin-left: 10px"
                >{{ $t("messageCenterManager.cx") }}
                </yu-button>
                <yu-button @click="resetTaskFn">{{
                  $t("messageCenterManager.czh")
                }}</yu-button>
              </div>
            </yu-xform-group>
          </yu-xform>
          <yu-xtable ref="taskTable" row-number :data-url="tableUrl1" :base-params="{'msgType':1}">
            <yu-xtable-column
              :label="$t('messageCenterManager.tsnr')"
            ></yu-xtable-column>
            <yu-xtable-column
              :label="$t('messageCenterManager.khmc')"
              prop="msgTitle"
            ></yu-xtable-column>
            <yu-xtable-column
              :label="$t('messageCenterManager.tslx')"
              prop="flowBizType"
            ></yu-xtable-column>
            <yu-xtable-column
              :label="$t('messageCenterManager.tsrq')"
              prop="createDate"
            ></yu-xtable-column>
            <yu-xtable-column
              fixed="right"
              :label="$t('component.operate')"
              width="160"
            >
              <template slot-scope="scope">
                <yu-button-drop set-index="0" :show-length="2" type="text">
                  <yu-button
                    @click="disposeTask(scope.row)"
                    type="text"
                    v-if="checkCtrl('dispose')"
                  >{{ $t("messageCenterManager.cl") }}
                  </yu-button>
                </yu-button-drop>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </yu-tab-pane>
        <yu-tab-pane :label="$t('messageCenterManager.ywxx')" name="2">
          <yu-xform
            v-model="formdata"
            related-table-name="bussTable"
            ref="bussSearchForm"
            class="el-form-search"
          >
            <yu-xform-group :column="4">
              <yu-xform-item
                :label="$t('messageCenterManager.tslx')"
                :placeholder="$t('messageCenterManager.qxz')"
                ctype="select"
                name="flowBizType"
                :options="bussFlowBizType"
              ></yu-xform-item>
              <yu-xform-item
                :label="$t('messageCenterManager.rqfw')"
                name="remindDate"
                ctype="datepicker"
                type="datetimerange"
                :start-placeholder="$t('messageCenterManager.ksrq')"
                :end-placeholder="$t('messageCenterManager.jsrq')"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['12:00:00']"
              >
              </yu-xform-item>
              <yu-xform-item
                :label="$t('messageCenterManager.tsnr')"
                :placeholder="$t('messageCenterManager.gjz')"
                ctype="input"
                name="keyWord"
              ></yu-xform-item>
              <div slot="custom" class="search-btn-group">
                <yu-button
                  type="primary"
                  @click="searchFn"
                  style="margin-left: 10px"
                >
                  {{ $t("messageCenterManager.cx") }}
                </yu-button>
                <yu-button @click="resetBussFn">{{
                  $t("messageCenterManager.czh")
                }}</yu-button>
              </div>
            </yu-xform-group>
          </yu-xform>
          <yu-xtable ref="bussTable" row-number :data-url="tableUrl2" :base-params="{'msgType':2}">
            <yu-xtable-column :label="$t('messageCenterManager.tsnr')">
              <template slot-scope="scope">
                <a class="underline" @click="cardDetailFn(scope.row)">{{
                  scope.row.msgContent
                }}</a>
              </template>
            </yu-xtable-column>
            <yu-xtable-column
              :label="$t('messageCenterManager.khmc')"
              prop="msgTitle"
            ></yu-xtable-column>
            <yu-xtable-column
              :label="$t('messageCenterManager.tslx')"
              prop="flowBizType"
            ></yu-xtable-column>
            <yu-xtable-column
              :label="$t('messageCenterManager.tsrq')"
              prop="createDate"
            ></yu-xtable-column>
            <yu-xtable-column
              fixed="right"
              :label="$t('component.operate')"
              width="160"
            >
              <template slot-scope="scope">
                <yu-button-drop set-index="0" :show-length="2" type="text">
                  <yu-button
                    v-if="checkCtrl('showBuss')"
                    @click="viewBuss(scope.row)"
                    type="text"
                  >{{ $t("messageCenterManager.ck") }}
                  </yu-button>
                </yu-button-drop>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </yu-tab-pane>
        <yu-tab-pane :label="$t('messageCenterManager.sjtx')" name="3">
          <yu-xform
            v-model="formdata"
            related-table-name="eventTable"
            ref="eventSearchForm"
            class="el-form-search"
          >
            <yu-xform-group :column="4">
              <yu-xform-item
                :label="$t('messageCenterManager.tslx')"
                :placeholder="$t('messageCenterManager.qxz')"
                ctype="select"
                name="remindType"
                data-code="MSG_REMIND_TYPE"
              ></yu-xform-item>
              <yu-xform-item
                :label="$t('messageCenterManager.rqfw')"
                name="remindDate"
                ctype="datepicker"
                type="datetimerange"
                :start-placeholder="$t('messageCenterManager.ksrq')"
                :end-placeholder="$t('messageCenterManager.jsrq')"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['12:00:00']"
              >
              </yu-xform-item>
              <yu-xform-item
                :label="$t('messageCenterManager.tsnr')"
                :placeholder="$t('messageCenterManager.gjz')"
                ctype="input"
                name="keyWord"
              ></yu-xform-item>
              <div slot="custom" class="search-btn-group">
                <yu-button
                  type="primary"
                  @click="searchFn"
                  style="margin-left: 10px"
                >
                  {{ $t("messageCenterManager.cx") }}
                </yu-button>
                <yu-button @click="resetEventFn">{{
                  $t("messageCenterManager.czh")
                }}</yu-button>
              </div>
            </yu-xform-group>
          </yu-xform>
          <yu-xtable ref="eventTable" row-number :data-url="tableUrl3" :base-params="{'msgType':3}">
            <yu-xtable-column
              :label="$t('messageCenterManager.tsnr')"
              prop="msgTitle"
            ></yu-xtable-column>
            <yu-xtable-column
              :label="$t('messageCenterManager.tslx')"
              prop="remindType"
              data-code="MSG_REMIND_TYPE"
            ></yu-xtable-column>
            <yu-xtable-column
              :label="$t('messageCenterManager.tsrq')"
              prop="createDate"
            ></yu-xtable-column>
            <yu-xtable-column
              fixed="right"
              :label="$t('component.operate')"
              width="160"
            >
              <template slot-scope="scope">
                <yu-button-drop set-index="0" :show-length="2" type="text">
                  <yu-button
                    v-if="checkCtrl('showEvent')"
                    @click="viewEvent(scope.row)"
                    type="text"
                  >{{ $t("messageCenterManager.ck") }}
                  </yu-button>
                </yu-button-drop>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </yu-tab-pane>
      </yu-tabs>
    </yu-panel>
    <yu-xdialog
      :title="$t('messageCenterManager.tssz')"
      :visible.sync="dialogVisible"
    >
      <yu-xform
        ref="messageConfigForm"
        label-width="148px"
        v-model="messageConfigFormData"
        :rules="messageConfigRules"
      >
        <yu-xform-group :column="1">
          <yu-xform-item
            :label="$t('messageCenterManager.tslx')"
            ctype="checkbox"
            name="remindType"
            data-code="MSG_REMIND_TYPE"
          ></yu-xform-item>
          <yu-xform-item
            :label="$t('messageCenterManager.tzpl')"
            ctype="radio"
            name="noticeFrequency"
            data-code="NOTICE_FREQUENCY"
          ></yu-xform-item>
          <yu-xform-item
            :label="$t('messageCenterManager.xswdxxsl')"
            ctype="radio"
            name="showUnread"
            data-code="SHOW_UNREAD"
          ></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" class="dialog-footer" key="add">
        <yu-button type="primary" @click="saveMsgConfigFn">{{
          $t("messageCenterManager.bc")
        }}</yu-button>
        <yu-button @click="dialogVisible = false">{{
          $t("schedule.qx")
        }}</yu-button>
      </div>
    </yu-xdialog>

    <!-- 日历弹出框 -->
    <yu-calendar-detail
      :visible.sync="eventDialogVisible"
      :related-id="relatedId"
    />
    <!-- <yu-xdialog :title="$t('messageCenterManager.sjtx')" :visible.sync="eventDialogVisible">
      <yu-xform ref="cardForm" v-model="calendarFormData" form-type="details" label-width="100px">
        <yu-xform-group :column="1">
          <yu-xform-item :label="$t('messageCenterManager.sjmc')" name="eventName"></yu-xform-item>
          <yu-xform-item :label="$t('messageCenterManager.kssj')" name="startDate"></yu-xform-item>
          <yu-xform-item :label="$t('messageCenterManager.jssj')" name="endDate"></yu-xform-item>
          <yu-xform-item :label="$t('messageCenterManager.ts')" name="remindTime" ctype="radio" data-code="REMIND_TIME"></yu-xform-item>
          <yu-xform-item :label="$t('messageCenterManager.cf')" name="repeated" ctype="radio" data-code="REPEATED_TYPE"></yu-xform-item>
          <yu-xform-item :label="$t('messageCenterManager.zy')" name="important" ctype="radio" data-code="IMPORTANT_TYPE"></yu-xform-item>
          <yu-xform-item :label="$t('messageCenterManager.sjms')" name="eventDesc"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
    </yu-xdialog> -->
    <yu-xdialog
      :visible.sync="askDialogVisible"
      :title="$t('dashboard.askdetailtitle')"
      width="75%"
      height="75%"
    >
      <askCenterDetail :ask-id="askID" />
    </yu-xdialog>

    <yu-dialog
      :modal-append-to-body="false"
      :append-to-body="false"
      title="提示"
      :draggable="false"
      :visible.sync="todoDialogVisible"
      size="tiny"
    >
      <span>功能开发中，敬请期待。</span>
      <span slot="footer" class="dialog-footer"></span>
    </yu-dialog>
  </div>
</template>
<script>
import { clone, lookup, sessionStore } from "@/utils";
import askCenterDetail from "@/views/common/dashboard/AskCenter/askCenterDetail.vue";
import YuCalendarDetail from "@/views/content/portalManager/messageCenterManager/messageCalendarDetail.vue";
import { USER_MESSAGE_CONFIG } from "@/config/constant/app.data.common";

lookup.reg(
  "MSG_REMIND_TYPE,NOTICE_FREQUENCY,SHOW_UNREAD,MSG_TYPE,REMIND_TIME,REPEATED_TYPE,IMPORTANT_TYPE"
);

export default {
  components: {
    askCenterDetail, // 资讯详情展示
    YuCalendarDetail, // 日历详情
  },
  data() {
    return {
      formdata: {},
      messageConfigFormData: {
        remindType: "1, 2, 3, 4",
        id: "",
        showUnread: 1,
        noticeFrequency: 5,
      }, // 表单数据
      remindDate: "",
      activeName: "1",
      tableUrl: backend.portalService + "/api/xmhmessage/list", // 卡片列表查询地址
      tableUrl1: backend.portalService + "/api/xmhmessage/list", // 卡片列表查询地址
      tableUrl2: backend.portalService + "/api/xmhmessage/list", // 卡片列表查询地址
      tableUrl3: backend.portalService + "/api/xmhmessage/list", // 卡片列表查询地址
      dialogVisible: false, // 弹出框是否展示
      viewType: "ADD", // 弹出框默认新增
      viewTitle: lookup.find("CRUD_TYPE", false), // 弹出框类型
      formDisabled: false, // 表单是否禁用
      props: { label: "orgName", children: "children" },
      formType: "details",
      messageConfigRules: {
        remindType: {
          required: true,
          message: this.$t("messageCenterManager.btx"),
        }, // 必填项校验
        noticeFrequency: {
          required: true,
          message: this.$t("messageCenterManager.btx"),
        }, // 必填项校验
        showUnread: {
          required: true,
          message: this.$t("messageCenterManager.btx"),
        }, // 必填项校验
      }, // 表单验证规则
      searchFormdata: {}, // 查询表单数据
      status: {},
      taskFlowBizType: [],
      bussFlowBizType: [],
      eventDialogVisible: false,
      askDialogVisible: false,
      calendarFormData: {},
      relatedId: "",
      informationFormData: {},
      askID: "",
      todoDialogVisible: false,
    };
  },
  created() {
    this.queryFlowBizType(1);
    this.queryFlowBizType(2);
    this.addMessgeConfig();//获取用户配置，相当于原来的点击推送设置
  },
  mounted() {
    this.cardTypeCode = lookup.find("MSG_REMIND_TYPE", false);
    this.cardSpecCode = lookup.find("NOTICE_FREQUENCY", false);
    this.useStatus = lookup.find("SHOW_UNREAD", false);
    this.msgType = lookup.find("MSG_TYPE", false);
    this.remindTime = lookup.find("REMIND_TIME", false);
    this.repeatedType = lookup.find("REPEATED_TYPE", false);
    this.importantType = lookup.find("IMPORTANT_TYPE", false);
  },
  methods: {
    // 加载工作流
    queryFlowBizType: function (type) {
      var _this = this;
      _this
        .$request({
          url:
            backend.portalService + "/api/xmhmessage/queryflowbiztype/" + type,
        })
        .then(({ code, message, data, total }) => {
          if (code === "0") {
            var result = [];
            data.forEach((d) => {
              var obj = {};
              obj.key = d;
              obj.value = d;
              result.push(obj);
            });
            if (type == 1) {
              _this.taskFlowBizType = result;
            } else {
              _this.bussFlowBizType = result;
            }
          } else {
            _this.$message({
              message: message,
              type: "error",
            });
          }
        });
    },
    disposeTask: function (row) {
      this.todoDialogVisible = true;
    },
    viewBuss: function (row) {
      this.todoDialogVisible = true;
    },
    viewEvent: function (row) {
      var _this = this;
      if (row.remindType == 4) {
        this.eventDialogVisible = true;
        this.$nextTick(() => {
          this.relatedId = row.relatedId;
        });
        // // 加载日历事件
        // _this.$request({
        //   method: 'GET',
        //   url: backend.portalService + '/api/xmhcalender/info/' + row.relatedId
        // }).then(({code, message, data, total}) => {
        //   if (code === '0') {
        //     _this.calendarFormData = data;
        //     _this.eventDialogVisible = true;
        //   } else {
        //     _this.$message({
        //       message: message,
        //       type: 'error'
        //     });
        //   }
        // });
      } else if (row.remindType == 2) {
        // 加载资讯事件
        _this.askID = row.relatedId;
        this.askDialogVisible = true;
      } else {
        this.todoDialogVisible = true;
      }
    },
    searchFn: function () {
      var _this = this;
      _this.$refs.taskSearchForm.validate(function (valid) {
        if (valid) {
          var param = {};
          if (_this.activeName == "1") {
            param = _this.$refs.taskSearchForm.formdata;
            _this.formatParam(param);
            _this.$refs.taskTable.remoteData(param);
          } else if (_this.activeName == "2") {
            param = _this.$refs.bussSearchForm.formdata;
            _this.formatParam(param);
            _this.$refs.bussTable.remoteData(param);
          } else {
            param = _this.$refs.eventSearchForm.formdata;
            _this.formatParam(param);
            _this.$refs.eventTable.remoteData(param);
          }
        }
      });
    },
    formatParam: function (param) {
      if (param.remindDate && param.remindDate.length > 0) {
        param.remindDateStart = param.remindDate[0];
        param.remindDateEnd = param.remindDate[1];
      } else {
        delete param.remindDateStart;
        delete param.remindDateEnd;
      }
    },
    // 自定义重置功能
    resetTaskFn: function () {
      this.$refs.taskSearchForm.resetFields();
      this.$refs.taskTable.remoteData();
    },
    resetBussFn: function () {
      this.$refs.bussSearchForm.resetFields();
      this.$refs.bussTable.remoteData();
    },
    resetEventFn: function () {
      this.$refs.eventSearchForm.resetFields();
      this.$refs.eventTable.remoteData();
    },
    switchTabs() {},
    addMessgeConfig() {
      var _this = this;
      // 加载用户消息配置
      _this
        .$request({
          url: backend.portalService + "/api/xmhmessageconfig/getuserconfig",
        })
        .then(({ code, message, data, total }) => {
          if (code === "0") {
            clone(data, _this.messageConfigFormData);
            if (_this.messageConfigFormData.remindType) {
              var strArr = _this.messageConfigFormData.remindType.split(",");
              var arr = [];
              strArr.forEach((item) => {
                arr.push(+item);
              });
              _this.messageConfigFormData.remindType = arr;
            }
            this.saveMsgConfigFn()
            // _this.dialogVisible = true;
            // _this.remoteData();
          } else {
            _this.$message({
              message: message,
              type: "error",
            });
          }
        });
    },

    /**
     * 清空快速查询区域查询条件
     */
    clearFuzzyFn() {
      this.$refs.panel.inputVal = "";
    },
    /**
     * 关闭弹出框
     */
    cancelFn() {
      this.dialogVisible = false;
    },
    /**
     * 保存消息配置 bug 10039
     */
    saveMsgConfigFn() {
      var _this = this;
      // var validate = false;
      // _this.$refs.messageConfigForm.validate(function (valid) {
      //   validate = valid;
      // });
      // if (!validate) {
      //   return;
      // }
      _this.messageConfigFormData.remindType =
        _this.messageConfigFormData.remindType.toString();
      var url = _this.messageConfigFormData.id
        ? "/api/xmhmessageconfig/update"
        : "/api/xmhmessageconfig/save";
      _this
        .$request({
          method: "POST",
          url: backend.portalService + url,
          data: _this.messageConfigFormData,
        })
        .then(({ code, message, data, total }) => {
          if (code === "0") {
            // _this.$message({
            //   message: _this.$t("messageCenterManager.bccg"),
            //   type: "success",
            // });
            sessionStore.set(USER_MESSAGE_CONFIG, _this.messageConfigFormData);
            _this.dialogVisible = false;
            _this.remoteData();
          } else {
            _this.$message({
              message: message,
              type: "error",
            });
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  
  .el-range-editor.el-input__inner{
    height:32px;
    box-sizing: border-box;
  }
  .yu-xform .el-form-item__content{
    line-height:33px!important;
    box-sizing: border-box;
  }
}
/* .el-date-editor.el-range-editor{
  height:32px;
} */
.el-date-table td.today {
  color: #2877ff;
}
.blue .el-date-table td.today {
  color: #fff;
}
</style>
