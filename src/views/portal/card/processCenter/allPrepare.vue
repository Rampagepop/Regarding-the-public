<template>
  <div>
    <yu-panel
      ref="panel"
      title="全部待办"
      panel-type="combination"
      is-filter
      placeholder="任务流水号，客户名称"
      collapse
      collaspase-text="查询条件"
    >
      <template slot="right">
        <yufp-excel-export
          :show-progress="false"
          :export-url="excelExportUrl"
          :exportParam="exportParam"
          :title="$t('orgInfoManager.exceldc')"
        ></yufp-excel-export>
        <yu-button-group>
          <yu-button
            :type="mode === 'undeal' ? 'primary' : ''"
            @click="search('undeal')"
          >
            待处理
          </yu-button>
          <yu-button
            :type="mode === 'dealed' ? 'primary' : ''"
            @click="search('dealed')"
          >
            已处理
          </yu-button>
          <yu-button
            :type="mode === 'done' ? 'primary' : ''"
            @click="search('done')"
          >
            已办结
          </yu-button>
        </yu-button-group>
      </template>
      <template slot="filter">
        <!-- label-width="90px" -->
        <yu-xform
          v-model="formdata"
          form-type="search"
          ref="refBaseForm"
          related-table-name="refTable"
         
          :custom-search-fn="searchFn"
          :custom-reset-fn="resetFn"
        >
          <yu-xform-group :column="4">
            <yu-xform-item
              label="任务类型"
              ctype="custom"
              name="bizTypes"
              :colspan="24"
              :value="[]"
            >
              <div>
                <yu-checkbox
                  :indeterminate="isIndeterminate"
                  v-model="checkAll"
                  @change="handleCheckAllChange"
                >
                  全选
                </yu-checkbox>
              </div>
              <el-col :span="3">
                <check-all-checkbox
                  v-model="formdata.customer"
                  :options="customerManage"
                  title="客户管理"
                  @change="handleChange"
                ></check-all-checkbox>
              </el-col>
              <el-col :span="3">
                <check-all-checkbox
                  v-model="formdata.credit"
                  :options="creditManage"
                  title="授信管理"
                  @change="handleChange"
                ></check-all-checkbox>
              </el-col>
              <el-col :span="3">
                <check-all-checkbox
                  v-model="formdata.collateral"
                  :options="collateralManage"
                  title="押品管理"
                  @change="handleChange"
                ></check-all-checkbox>
              </el-col>
              <el-col :span="3">
                <check-all-checkbox
                  v-model="formdata.contract"
                  :options="contractManage"
                  title="合同管理"
                  @change="handleChange"
                ></check-all-checkbox>
              </el-col>
              <el-col :span="3">
                <check-all-checkbox
                  v-model="formdata.useLetter"
                  :options="useLetterManage"
                  title="用信管理"
                  @change="handleChange"
                ></check-all-checkbox>
              </el-col>
              <el-col :span="3">
                <check-all-checkbox
                  v-model="formdata.loan"
                  :options="loanManage"
                  title="放款管理"
                  @change="handleChange"
                ></check-all-checkbox>
              </el-col>
              <el-col :span="3">
                <check-all-checkbox
                  v-model="formdata.postLoan"
                  :options="postLoanManage"
                  title="贷后管理"
                  @change="handleChange"
                ></check-all-checkbox>
              </el-col>
            </yu-xform-item>
            <yu-xform-item
              label="任务流水号"
              placeholder="请输入"
              ctype="input"
              value=""
              name="bizId"
            ></yu-xform-item>
            <yu-xform-item
              label="客户名称"
              placeholder="请输入"
              ctype="input"
              value=""
              name="bizUserName"
            ></yu-xform-item>
            <yu-xform-item
              label="客户编号"
              ctype="input"
              value=""
              name="bizUserId"
            ></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <yu-xtable
        ref="refTable"
        :data-url="dataUrl"
        :base-params="baseParams"
        condition-key="condition"
        :encode="false"
        :default-load="false"
      >
        <yu-xtable-column
          type="index"
          label="序号"
          width="50">
          <template slot-scope="scope">
            <span>{{ $refs.refTable.tabledata.indexOf(scope.row) + 1 }}</span>
            <em v-if="scope.row.liked === 1" class="el-icon-star-off"></em>
            <em
              v-if="scope.row.reminded === 1"
              style="background: rgba(245, 154, 35, 1); color: #fff;padding:2px 4px;"
            >
              置顶
            </em>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="任务流水号" prop="bizId" sortable width="150">
          <template slot-scope="scope">
            <a class="underline" @click="detailFn(scope.row)">{{ scope.row.bizId }}</a>
          </template>
        </yu-xtable-column>
        <yu-xtable-column
          label="客户编号"
          width="150"
          prop="bizUserId"
        ></yu-xtable-column>
        <yu-xtable-column
          label="客户名称"
          width="150"
          prop="bizUserName"
        ></yu-xtable-column>
        <yu-xtable-column label="任务类型" prop="bizType" width="150"></yu-xtable-column>
        <yu-xtable-column label="截止日期" prop="dueTime" width="200"></yu-xtable-column>
        <yu-xtable-column
          label="任务状态"
          prop="nodeState"
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
        <yu-xtable-column label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <yu-button-drop set-index="0" :show-length="2" type="text">
              <yu-button v-if="mode === 'dealed'" type="text" @click="urging(scope.row)">催办</yu-button>
              <yu-button type="text" @click="pushing(scope.row)">
                添加提醒
              </yu-button>
              <yu-button type="text" @click="doLike(scope.row)">{{
                scope.row.liked === 1 ? "取消收藏" : "收藏"
              }}
              </yu-button>
              <yu-button type="text" @click="cancelTop(scope.row)">{{
                scope.row.reminded === 1 ? "取消置顶" : "置顶"
              }}
              </yu-button>
            </yu-button-drop>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <!-- 添加提醒 -->
    <yu-xdialog title="添加提醒" class="reset-overflow-c" :visible.sync="dialogVisible" width="640px">
      <yu-xform ref="noticeForm" label-width="120px" v-model="noticeFormdata" :rules="rules">
        <yu-xform-group :column="2">
          <yu-xform-item
            label="事件名称"
            ctype="input"
            name="eventName"
            :colspan="24"
          ></yu-xform-item>
          <yu-xform-item
            label="开始时间"
            ctype="datepicker"
            name="startDate"
            type="datetime"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></yu-xform-item>
          <yu-xform-item
            label="结束时间"
            ctype="datepicker"
            name="endDate"
            type="datetime"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </yu-xform-item>
          <yu-xform-item
            label="提醒"
            ctype="select"
            name="remindTime"
            data-code="REMIND_TIME"
          ></yu-xform-item>
          <!-- <yu-xform-item
            label="重复"
            ctype="select"
            name="repeated"
            data-code="REPEATED_TYPE"
          ></yu-xform-item> -->
          <yu-xform-item
            label="重要提醒"
            ctype="radio"
            name="important"
            data-code="SHOW_UNREAD"
          ></yu-xform-item>
          <yu-xform-item label="事件描述" ctype="textarea" name="eventDesc" :colspan="24"></yu-xform-item>
          <yu-xform-item label="任务信息" ctype="custom" name="taskInfo" :colspan="24">
            <span class="task-info-c">{{ noticeFormdata.taskInfo }}</span>
          </yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" class="yu-grpButton">
        <yu-button type="primary" @click="addNotice">保存</yu-button>
        <yu-button @click="dialogVisible = false">取消</yu-button>
      </div>
    </yu-xdialog>
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
        <yu-button type="primary" @click="addRemark">保存</yu-button>
        <yu-button @click="cancelFn">取消</yu-button>
      </div>
    </yu-xdialog>
  </div>
</template>
<script>
import Vue from "vue";
import xymixin from "@/utils/mixin";
import {clone, extend, lookup} from "@/utils";
import {validator} from "@/utils/validate";
import {exportExcelByTable} from "@/utils/util";
import YufpExcelExport from "@/components/widgets/YufpExcelExport";

lookup.reg("OP_TYPE,REMIND_TIME,REPEATED_TYPE,SHOW_UNREAD"); // 注册数据字典类型
Vue.component("CheckAllCheckbox", {
  props: {
    value: Array,
    trueLabel: String,
    falseLabel: String,
    options: Array,
    title: String,
  },
  data() {
    return {
      isIndeterminate: false,
      checkList: [],
      checkAll: false,
      optionsKeys: [],
    };
  },
  watch: {
    value(val) {
      this.checkList = val || [];
    },
  },
  mounted() {
    this.getAllKey();
  },
  methods: {
    handleCheckAllChange(event) {
      this.checkList = event.target.checked ? this.optionsKeys : [];
      this.$emit("input", this.checkList);
      this.$emit("change", this.checkList);
      this.isIndeterminate = false;
    },
    handleChange() {
      this.$emit("input", this.checkList);
      this.$emit("change", this.checkList);
      var checkedCount = this.checkList.length;
      this.checkAll = checkedCount === this.optionsKeys.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.optionsKeys.length;
    },
    getAllKey() {
      this.options.forEach((item) => {
        this.optionsKeys.push(item.key);
      });
    },
  },
  template: `
    <div>
    <yu-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">{{ title }}
    </yu-checkbox>
    <yu-xcheckbox v-model="checkList" :options="options" @change="handleChange"
                  style="margin-left: 20px;"></yu-xcheckbox>
    </div>`,
});
export default {
  name: "allPrepare",
  components: {YufpExcelExport},
  mixins: [xymixin],
  props: {},
  data() {
    return {
      pickerOptions: {
        disabledDate: function (time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        }
      },
      rules: {
        eventName: [
          {required: true, message: this.$t('sysUserManager.btx')}
        ],
        remindTime: [
          {required: true, message: this.$t('sysUserManager.btx')}
        ],
        repeated: [
          {required: true, message: this.$t('sysUserManager.btx')}
        ],
        important: [
          {required: true, message: this.$t('sysUserManager.btx')}
        ],
        startDate: [
          {validator: this.validateTime},
          {required: true, message: this.$t('sysUserManager.btx')}
        ],
        endDate: [
          {validator: this.validateTime},
          {required: true, message: this.$t('sysUserManager.btx')}
        ]
      },
      excelExportUrl: `${backend.portalService}/api/xmhprocess/excelexport`, // Excel导出地址
      exportParam: {
        bizId: '',
        bizUserId: '',
        bizUserName: '',
        bizType: '',
        dueTime: '',
        nodeState: '',
        nodeName: '',
        orgName: '',
        remark: '',
        selectType: "1",
      }, // 导出时的查询参数
      dataUrl: `${backend.portalService}/api/xmhprocess/processquery`, // 表格接口地址
      userStatus: {}, // 用户状态
      viewType: "DETAIL", // 视图类型
      viewTitle: lookup.find("CRUD_TYPE", false), // 标题字典
      dialogVisible: false, // 编辑弹框
      remarkDialogVisible: false,
      formdata: {
        customer: [],
        credit: [],
        collateral: [],
        useLetter: [],
        loan: [],
        postLoan: [],
        contract: [],
      }, // 表单数据
      remarkFormdata: {},
      noticeFormdata: {}, // 详情表单数据
      rule: [
        // 校验规则
        {required: true, message: "必填项"},
        {validator: validator.number, message: "数字"},
      ],
      options: [
        // 密码选项值
        {key: "default", value: "默认(8888)"},
        {key: "define", value: "自定义"},
      ],
      checkAll: false,
      isIndeterminate: false,
      mode: "undeal", // 按钮类型
      dataList: [],
      customerAll: "",
      creditAll: "",
      collateralAll: "",
      contractAll: "",
      useLetterAll: "",
      loanAll: "",
      postLoanAll: "",
      customerHalf: false,
      creditHalf: false,
      collateralHalf: false,
      contractHalf: false,
      useLetterHalf: false,
      loanHalf: false,
      postLoanHalf: false,
      customerManage: [
        {key: "客户信息补充", value: "客户信息补充"},
        {key: "客户信息变更", value: "客户信息变更"},
        {key: "客户移交", value: "客户移交"},
      ],
      creditManage: [
        {key: "对公授信申请", value: "对公授信申请"},
        {key: "授信申请打回", value: "授信申请打回"},
        {key: "授信申请审批", value: "授信申请审批"},
      ],
      collateralManage: [
        {key: "押品变更", value: "押品变更"},
        {key: "押品管户移交", value: "押品管户移交"},
        {key: "权证出库", value: "权证出库"},
      ],
      contractManage: [
        {key: "合同签订", value: "合同签订"},
        {key: "合同修改", value: "合同修改"},
        {key: "合同新增", value: "合同新增"},
      ],
      useLetterManage: [
        {key: "展期申请", value: "展期申请"},
        {key: "业务调查", value: "业务调查"},
      ],
      loanManage: [{key: "放款申请", value: "放款申请"}],
      postLoanManage: [
        {key: "定期检查", value: "定期检查"},
        {key: "不定期检查", value: "不定期检查"},
      ],
      baseParams: {selectType: '1'},
      rowData: {}
    };
  },
  watch: {
    formdata: {
      handler: function (val) {
        var params = {};
        var bizTypes = []
          .concat(val.customer)
          .concat(val.credit)
          .concat(val.collateral)
          .concat(val.useLetter)
          .concat(val.loan)
          .concat(val.postLoan)
          .concat(val.contract);
        if (bizTypes.length > 0) {
          params.bizTypes = bizTypes;
        }
        params.bizId = val.bizId;
        params.bizUserId = val.bizUserId;
        params.bizUserName = val.bizUserName;
        this.exportParam.condition = JSON.stringify(params);
      },
      deep: true
    }
  },
  activated() {
    // 可能是处在进度中心中，或自成页面
    if (this.$route.query && this.$route.query.mode) {
      this.mode = this.$route.query.mode
    }
    const type = this.$route.query ? this.$route.query.type : null
    if (type) {
      // 先清空所有
      this.resetFn()
      // 展开高级查询
      this.$refs.panel && (this.$refs.panel.hide = false);
      this.$nextTick(() => {
        if (this.checkHas(this.customerManage, type)) {
          this.formdata.customer = [type]
        } else if (this.checkHas(this.creditManage, type)) {
          this.formdata.credit = [type]
        } else if (this.checkHas(this.collateralManage, type)) {
          this.formdata.collateral = [type]
        } else if (this.checkHas(this.contractManage, type)) {
          this.formdata.contract = [type]
        } else if (this.checkHas(this.useLetterManage, type)) {
          this.formdata.useLetter = [type]
        } else if (this.checkHas(this.loanManage, type)) {
          this.formdata.loan = [type]
        } else if (this.checkHas(this.postLoanManage, type)) {
          this.formdata.postLoan = [type]
        }
        this.$nextTick(() => {
          // 传递了type，则需要携带高级查询表单进行查询
          this.search(this.mode, true)
        })
      })
    } else {
      // 关闭高级查询
      this.$refs.panel && (this.$refs.panel.hide = true);
      this.$nextTick(() => {
        this.search(this.mode)
      })
    }
    this.$nextTick(() => {
      // 如果传递了type，则需要携带高级查询表单进行查询
      this.search(this.mode, type ? true : false)
    })
  },
  methods: {
    validateTime(_rule, value, callback) {
      var curTime = new Date();
      var str = curTime.toLocaleDateString().replace(/\//g, '-') + ' ' + curTime.toLocaleTimeString()
      if (value && new Date(value) < new Date(str)) {
        callback(new Error('不能小于系统当前时间'));
      }
      if (this.noticeFormdata.startDate && this.noticeFormdata.endDate && this.noticeFormdata.startDate > this.noticeFormdata.endDate) {
        callback(new Error('开始时间不能大于结束时间'));
      } else {
        callback();
      }
    },
    checkHas(array, key) {
      var result = array.filter(item => {
        return item.value === key
      })
      return result && result.length !== 0
    },
    // 添加备注
    addRemark() {
      const _this = this;
      var params = clone(this.remarkFormdata, {});
      this.$request({
        url: `${backend.portalService}/api/xmhprocess/remark`,
        method: "post",
        data: params,
      }).then(({code, message}) => {
        if (code === "0") {
          _this.$refs.refTable.remoteData();
          _this.$message({message: "操作成功"});
          _this.remarkDialogVisible = false;
        } else {
          _this.$message({message: message, type: "error"});
        }
      });
    },
    openRemark(row) {
      row["remark"] = row["remark"] || "";
      this.remarkDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.remarkForm.resetFields();
        clone(row, this.remarkFormdata);
      });
    },
    handleCheckAllChange: function (event) {
      if (event.target.checked) {
        this.formdata.customer = ["客户信息补充", "客户信息变更", "客户移交"];
        this.formdata.credit = ["对公授信申请", "授信申请打回", "授信申请审批"];
        this.formdata.collateral = ["押品变更", "押品管户移交", "权证出库"];
        this.formdata.contract = ["合同签订", "合同修改", "合同新增"];
        this.formdata.useLetter = ["展期申请", "业务调查"];
        this.formdata.loan = ["放款申请"];
        this.formdata.postLoan = ["定期检查", "不定期检查"];
      } else {
        this.formdata.customer = [];
        this.formdata.credit = [];
        this.formdata.collateral = [];
        this.formdata.useLetter = [];
        this.formdata.loan = [];
        this.formdata.postLoan = [];
        this.formdata.contract = [];
      }
    },
    handleChange() {
      var length =
        (this.formdata.customer && this.formdata.customer.length) || 0;
      var length1 = (this.formdata.credit && this.formdata.credit.length) || 0;
      var length2 =
        (this.formdata.collateral && this.formdata.collateral.length) || 0;
      var length3 =
        (this.formdata.useLetter && this.formdata.useLetter.length) || 0;
      var length4 = (this.formdata.loan && this.formdata.loan.length) || 0;
      var length5 =
        (this.formdata.postLoan && this.formdata.postLoan.length) || 0;
      var length6 =
        (this.formdata.contract && this.formdata.contract.length) || 0;
      var sum =
        length + length2 + length3 + length4 + length5 + length6 + length1;
      this.checkAll = sum === 17;
      this.isIndeterminate = sum > 0 && sum < 17;
    },
    searchFn() {
      this.formdata.bizTypes = []
        .concat(this.formdata.customer)
        .concat(this.formdata.credit)
        .concat(this.formdata.collateral)
        .concat(this.formdata.useLetter)
        .concat(this.formdata.loan)
        .concat(this.formdata.postLoan)
        .concat(this.formdata.contract)
      // .join(",")
      // .replace(/,+/g, ",")
      // .replace(/^,|,$/g, "");
      var params = clone(this.formdata, {});
      if (params.bizTypes.length === 0) delete params.bizTypes
      delete params["customer"];
      delete params["credit"];
      delete params["collateral"];
      delete params["useLetter"];
      delete params["loan"];
      delete params["postLoan"];
      delete params["contract"];
      this.$refs.refTable.remoteData(Object.keys(params).length !== 0 ? {condition: params} : {});
    },
    resetFn() {
      this.$refs.refBaseForm.resetFields();
      this.checkAll = [];
    },
    search(type, withFormData = false) {
      this.mode = type;
      if (type === "undeal") {
        this.baseParams.selectType = '1';
        this.exportParam.selectType = "1";
      } else if (type === "dealed") {
        this.baseParams.selectType = '2';
        this.exportParam.selectType = "2";
      } else if (type === "done") {
        this.baseParams.selectType = '3';
        this.exportParam.selectType = "3";
      }
      withFormData ? this.searchFn() : this.$refs.refTable.remoteData();
    },
    // 催办
    urging(data) {
      const _this = this;
      this.$request({
        url: `${backend.portalService}/api/xmhprocess/press`,
        method: "post",
        data: data,
      }).then(({code, message}) => {
        if (code === "0") {
          _this.$refs.refTable.remoteData();
          _this.$message({message: "操作成功"});
          _this.dialogVisible = false;
        } else {
          _this.$message({message: message, type: "error"});
        }
      });
    },
    pushing(data) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.noticeForm.resetFields();
        this.noticeFormdata.taskInfo = this.getTaskInfo(data)
      });
    },
    // 获取任务信息
    getTaskInfo(data) {
      const stateObj = {}
      lookup.lookupMgr.OP_TYPE.forEach(item => {
        stateObj[item.key] = item.value
      })
      return `${data.bizId} / ${data.bizType} / ${stateObj[data.nodeState]} / ${data.nodeName} / ${data.startTime}`
    },
    /**
     * 添加提醒
     */
    addNotice() {
      const _this = this;
      let validate = false;
      this.$refs.noticeForm.validate(function (valid) {
        validate = valid;
      });
      if (!validate) {
        return;
      }
      _this.noticeFormdata.repeated = 1;
      var params = clone({}, _this.noticeFormdata);
      params.relatedEventType = 1;
      params.relatedEventInfo = _this.noticeFormdata.taskInfo;
      this.$request({
        url: backend.portalService + "/api/xmhcalender/save",
        method: "post",
        data: params,
      }).then(({code, message}) => {
        if (code === "0") {
          _this.$refs.refTable.remoteData();
          _this.$message({message: "操作成功"});
          _this.dialogVisible = false;
        } else {
          _this.$message({message: message, type: "error"});
        }
      });
    },
    /**
     * 收藏
     */
    doLike(data) {
      const _this = this;
      var params = clone(data, {})
      params.liked = params.liked === 1 ? 0 : 1;
      this.$request({
        url: `${backend.portalService}/api/xmhprocess/updatefield`,
        method: "post",
        data: params,
      }).then(({code, message}) => {
        if (code === "0") {
          _this.$refs.refTable.remoteData();
          _this.$message({message: "操作成功"});
        } else {
          _this.$message({message: message, type: "error"});
        }
      });
    },
    cancelTop(data) {
      const _this = this;
      var params = clone(data, {})
      params.reminded = params.reminded === 1 ? 0 : 1;
      this.$request({
        url: `${backend.portalService}/api/xmhprocess/updatefield`,
        method: "post",
        data: params,
      }).then(({code, message}) => {
        if (code === "0") {
          _this.$refs.refTable.remoteData();
          _this.$message({message: "操作成功"});
        } else {
          _this.$message({message: message, type: "error"});
        }
      });
    },
    /**
     * 导出操作
     */
    exportFn() {
      const _this = this;
      exportExcelByTable({
        fileName: "导出",
        importType: "page",
        ref: _this.$refs.refTable,
        url: _this.dataUrl,
      });
    },
    /**
     * 详情
     */
    detailFn(data) {
      this.$nextTick(function () {
        // 复制对象
        extend(this.detailFormdata, data);
      });
      var query = {
        instanceId: data.instanceId,
        nodeId: data.nodeId,
        userId: data.userId,
        returnBackFuncId: this.$route.name,
        returnBackRootId: this.$route.name,
        row: clone(data, {})
      };
      // flowState 表示流程状态 R 运行 E 办结
      if (data.flowState == "H") {
        this.$message({
          message: "流程实例处于挂起状态,无法进行操作!",
          type: "warning",
        });
      }
      if(data.flowState === 'E') { // 已办结
        query['type'] = 'HIS'
        this.$router.push({ name: 'runInstanceInfo', query });
      }
      if(data.flowState === 'R') { // R 运行
      // type 表示当前节点状态 1-待办，2-已办，3-办结
        if (data.type === 1) {
          this.$router.push({ name: "instanceInfo", query });
        }
        if (data.type === 2) {
          query['type'] = 'DONE'
          this.$router.push({ name: 'instanceInfoLite', query });
        }
      }
    },
    /**
     * 取消弹框
     */
    cancelFn() {
      this.remarkDialogVisible = false;
    },
  },
};
</script>
<style>
  .reset-overflow-c .el-dialog-x__body{
  overflow-x:hidden
}
.task-info-c {
  display: inline-block;
  /* padding-top: 1px; */
  color: #2877FF;
  text-decoration: underline;
}
</style>
<style lang="scss" scoped>
  ::v-deep{
    .search-btn-group{
    padding-left:10px!important;
    }
  }
</style>
