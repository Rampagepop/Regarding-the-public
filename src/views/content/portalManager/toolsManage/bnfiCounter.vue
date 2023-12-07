<template>
  <div id="beforeCreditInfo">
    <yu-panel>
      <yu-panel :title="$t('toolManager.dqss')">
        <yu-xform ref="refForm" label-width="450px" v-model="formdata" style="overflow:auto" height="450px">
          <yu-xform-group>
            <yu-xform-item :label="$t('toolManager.dkll')" :placeholder="$t('toolManager.dkll')" ctype="yu-num" name="loanRate" :precision="4" number-formatter="0,000.0000" :format-rate="true" :rules="inputRules"></yu-xform-item>
            <yu-xform-item :label="$t('toolManager.hkfs')" ctype="select" name="planCode" data-code="REPY_MODE" :rules="inputRules" @change="resetOthers"></yu-xform-item>
            <yu-xform-item :label="$t('toolManager.khr')" name="opnDate" ctype="datepicker" :rules="inputRules" :hidden="formdata.planCode=='7'" @change="compaStrtToEndDateOpn"></yu-xform-item>
            <yu-xform-item :label="$t('toolManager.dqr')" name="mtrDate" ctype="datepicker" :rules="inputRules" @change="compaStrtToEndDateOpn" :hidden="formdata.planCode=='7'"></yu-xform-item>
            <yu-xform-item :label="$t('toolManager.bz')" ctype="select" name="curCode" data-code="CUR_CODE" :rules="inputRules"></yu-xform-item>
            <yu-xform-item :label="$t('toolManager.fkje')" ctype="yu-num" name="lnAmt" :precision="2" number-formatter="0.00" :rules="inputRules"></yu-xform-item>
            <yu-xform-item :label="$t('toolManager.zdhkr')" ctype="num" name="repayDate" :hidden="formdata.planCode=='7'" :rules="inputRules"></yu-xform-item>
            <yu-xform-item :label="$t('toolManager.hkzq')" ctype="select" name="cycleTerm" data-code="CYCLE_TERM" :hidden="formdata.planCode=='7'" :rules="inputRules"></yu-xform-item>
            <yu-xform-item :label="$t('toolManager.hkzqjg')" ctype="input" name="cycleSpace" :rules="inputRules" :hidden="formdata.planCode=='7'"></yu-xform-item>
            <yu-xform-item :label="$t('toolManager.txbz')" ctype="select" name="subsidyFlag" data-code="SUBSIDE_FLAG" :rules="inputRules" @change="trnfScopChange"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </yu-panel>
      <yu-panel :title="$t('toolManager.txjh')" v-if="hiddenList">
        <yu-button-drop>
          <yu-button @click="addFn" plain>{{ $t('toolManager.xz') }}</yu-button>
          <yu-button @click="checkFn" plain>{{ $t('toolManager.sc') }}</yu-button>
        </yu-button-drop>
        <yu-xtable index selection-type="radio" ref="refTableList" :data="list" :convert-to-string="false" request-type="POST" stripe row-number @row-click="rowClick">
          <yu-xtable-column :label="$t('toolManager.txlx')" prop="subsidyType" data-code="SUBSIDY_TYPE"></yu-xtable-column>
          <yu-xtable-column :label="$t('toolManager.txqsrq')" prop="subsidyStartDate"></yu-xtable-column>
          <yu-xtable-column :label="$t('toolManager.txzzrq')" prop="subsidyStopDate"></yu-xtable-column>
          <yu-xtable-column :label="$t('toolManager.txz')" prop="subsidyVal" :formatter="tableFormatter"></yu-xtable-column>
        </yu-xtable>
      </yu-panel>

      <yu-panel :title="$t('toolManager.hkjhxx')" v-if="formdata.planCode=='7'">
        <yu-button-drop>
          <yu-button @click="addFn1" plain>{{ $t('toolManager.xz') }}</yu-button>
        </yu-button-drop>
        <yu-xtable selection-type="radio" row-number ref="refTable1" :data="tableData1" :default-load="false" style="width: 100%" stripe @row-click="rowClickFn1">
          <yu-xtable-column :label="$t('toolManager.ksrq')" prop="stagStrtDate" :disabled="disabled" ctype="datepicker" :rules="inputRules"></yu-xtable-column>
          <yu-xtable-column :label="$t('toolManager.dqr')" prop="stagEndDate" :disabled="disabled" ctype="datepicker" :rules="inputRules"></yu-xtable-column>
          <yu-xtable-column :label="$t('toolManager.bjy')" prop="stagAmt" :disabled="disabled" ctype="num" :formatter="tableFormatter" :rules="inputRules"></yu-xtable-column>
          <yu-xtable-column :label="$t('toolManager.hkfs')" prop="repyMode" :disabled="disabled" ctype="select" data-code="REPAY_MODE" :rules="inputRules"></yu-xtable-column>
          <yu-xtable-column :label="$t('toolManager.hkzqpl')" :disabled="disabled" prop="repyFreq" ctype="select" data-code="REPAY_PERIOD" :rules="inputRules"></yu-xtable-column>
          <yu-xtable-column :label="$t('toolManager.hkjg')" :disabled="disabled" prop="repyIntv" ctype="num" :rules="inputRules"></yu-xtable-column>
          <yu-xtable-column :label="$t('toolManager.hkr')" :disabled="disabled" prop="repyDay" ctype="num" :rules="inputRules" maxlength="2"></yu-xtable-column>
          <yu-xtable-column :label="$t('toolManager.cz')" align="center" fixed="right" width="100">
            <template slot-scope="scope">
              <yu-button size="mini" @click="deleteFn1(scope.$index, scope.row)" plain>{{ $t('toolManager.sc') }}</yu-button>
            </template>
          </yu-xtable-column>

        </yu-xtable>
      </yu-panel>
      <div class="button-group" style="text-align: center; margin-top:10px">
        <el-button @click="submitButton">{{ $t('toolManager.sscc') }}</el-button>
        <el-button @click="formResetFn">{{ $t('toolManager.cczz') }}</el-button>
      </div>
    </yu-panel>

    <yu-xdialog :title="$t('toolManager.xztxjh')" :visible.sync="custDialog" v-if="custDialog" width="80%" height="450px" :before-close="handleClose">
      <yu-xform ref="refCustForm" label-width="150px" v-model="customForm">
        <yu-xform-group :column="2">
          <yu-xform-item :label="$t('toolManager.txlx')" ctype="select" name="subsidyType" data-code="SUBSIDY_TYPE" :rules="inputRules"></yu-xform-item>
          <yu-xform-item :label="$t('toolManager.txqsrq')" name="subsidyStartDate" ctype="datepicker" :rules="inputRules" @change="subsidyStopDateCheck"></yu-xform-item>
          <yu-xform-item :label="$t('toolManager.txzzrq')" name="subsidyStopDate" ctype="datepicker" :rules="inputRules" @change="subsidyStopDateCheck"></yu-xform-item>
          <yu-xform-item :label="$t('toolManager.txz')" name="subsidyVal" ctype="yu-num" :precision="2" number-formatter="0.00" :formatter="formFormatter" maxlength="17" :rules="inputRules"></yu-xform-item>
        </yu-xform-group>
        <div class="yu-grpButton">
          <yu-button @click="handleClose">{{ $t('toolManager.qx') }}</yu-button>
          <yu-button @click="saveCustFn" v-norepeat.disabled="{timeout:10000}">{{ $t('toolManager.qr') }}</yu-button>
        </div>
      </yu-xform>
    </yu-xdialog>
    <yu-xdialog :title="$t('toolManager.hkfa')" :visible.sync="repayDialog" width="80%" top="5%" :middle="false" height="450px">
      <yu-xform ref="refForm2" label-width="450px" v-model="formdataPlanInfo">
        <yu-xform-group>
          <yu-xform-item :label="$t('toolManager.hkze')" :placeholder="$t('toolManager.hkze')" name="sumPrcplAmt" ctype="num" :formatter="formFormatter" :rules="inputRules" class="label-padding" readonly></yu-xform-item>
          <yu-xform-item :label="$t('toolManager.lxze')" :placeholder="$t('toolManager.lxze')" name="sumIntAmt" ctype="num" :formatter="formFormatter" :rules="inputRules" readonly></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <yu-xtable index selection-type="radio" ref="refTable" :data-url="dataUrl" json-data="data.prvAcctList" :parse-response="resTable" json-total="total" :default-load="false" :pageable="false" :convert-to-string="false" request-type="POST" stripe row-number>
        <yu-xtable-column :label="$t('toolManager.hkjhxh')" prop="repaySeqn" align=""></yu-xtable-column>
        <yu-xtable-column :label="$t('toolManager.qc')" prop="periodTimes" align=""></yu-xtable-column>
        <yu-xtable-column :label="$t('toolManager.bjy')" prop="prcplAmt" align="" :formatter="tableFormatter"></yu-xtable-column>
        <yu-xtable-column :label="$t('toolManager.lxy')" prop="intAmt" align="" :formatter="tableFormatter"></yu-xtable-column>
        <yu-xtable-column :label="$t('toolManager.zje')" prop="totalAmt" align="" :formatter="tableFormatter"></yu-xtable-column>
        <yu-xtable-column :label="$t('toolManager.sxf')" prop="chrgAmt" align="" :formatter="tableFormatter"></yu-xtable-column>
        <yu-xtable-column :label="$t('toolManager.hkqbjye')" prop="preBookBal" align="" :formatter="tableFormatter"></yu-xtable-column>
        <yu-xtable-column :label="$t('toolManager.hkhsybj')" prop="bookBal" align="" :formatter="tableFormatter"></yu-xtable-column>
        <yu-xtable-column :label="$t('toolManager.qxrq')" prop="valueStartDate" align=""></yu-xtable-column>
        <yu-xtable-column :label="$t('toolManager.zxrq')" prop="valueStopDate" align=""></yu-xtable-column>
        <yu-xtable-column :label="$t('toolManager.jxrq')" prop="capDate" align=""></yu-xtable-column>
      </yu-xtable>
      <div slot="footer" class="yu-grpButton">
        <yu-button @click="returnFnRepay" plain>{{ $t('toolManager.fh') }}</yu-button>
        <yu-button @click="exportFn" plain>{{ $t('toolManager.ddcc') }}</yu-button>
      </div>
    </yu-xdialog>
  </div>
</template>

<script>

import { lookup } from '@/utils';
lookup.reg("CUR_CODE,CYCLE_TERM,REPY_MODE,REPAY_MODE,SUBSIDE_FLAG,SUBSIDY_TYPE,REPAY_PERIOD");

// import {
//   moneyFormatter,
//   judgeFn,
//   accAdd,
//   accMul,
//   accSub,
//   accDiv,
//   cmpaDate,
//   sortData,
//   compaStrtToEndDate,
//   handleObj
// } from "@/utils/cusdUtil";
import { parseTime, exportExcelByTable } from "@/utils/util";
//import mixinbuttontype from '@/utils/mixinbuttontype';
export default {
  components: {},
  mixins: [100],
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      formdata: {},
      // timeUrl: backend.appOcaService + "/api/adminsctrl/q/detail", //系统时间
      curPrcsDt: "",
      repayDialog: false,
      formdataPlanInfo: {},
      dataUrl: backend.portalService + "/api/repayPlanCalculateList",
      //dataUrl1: backend.appOcaService + "/api/cmbnRepyMode/q/list",
      list: [],
      delIdx: "",
      loading: true,
      customForm: {}, // 弹窗表格
      custDialog: false, // 新增客户向导
      hiddenList: false, //是否隐藏列表
      tableData1: [], // 列表数据
      inputRules: { required: true, message: this.$t('toolManager.btx') } // 表单必输校验
    };
  },
  // mounted: function() {
  //   this.init();
  // },
  methods: {
    // 获取当前业务时间
    // init() {
    //   const _this = this;
    //   yufp.service.request({
    //     method: "GET",
    //     url: this.timeUrl,
    //     data: { instuCode: yufp.session.instu.code },
    //     callback: function(code, message, response) {
    //       _this.curPrcsDt = response.curPrcsDt;
    //     }
    //   });
    // },
    //返回
    returnFnRepay: function() {
      const _this = this;
      _this.repayDialog = false;
    },
    /**
     * 导出操作
     */
    exportFn() {
      const _this = this;
      exportExcelByTable({
        fileName: "还款方案",
        importType: "page",
        ref: _this.$refs.refTable,
      });
    },

    moneyFormatter: function(money, num) {
      /*
      * 参数说明：
      * money：要格式化的数字
      * num：保留几位小数
      * */
      num = num >= 0 && num <= 20 ? num : 2;
      money = parseFloat((money + '').replace(/[^\d.-]/g, '')).toFixed(num) + '';
      const l = money.split('.')[0].split('').reverse(),
        r = money.split('.')[1];
      let t = '';
      for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '');
      }
      let formatNum = 0;
      if (num == 0) {
        formatNum = t.split('').reverse().join('');
      } else {
        formatNum = t.split('').reverse().join('') + '.' + r;
      }
      return formatNum;
    },

    // 删除操作
    checkFn: function() {
      const _this = this,
        selection = _this.$refs.refTableList.selections;
      if (selection.length != 1) {
        _this.$message({ message: this.$t('toolManager.qxzjl'), type: "warning" });
        return;
      }
      _this.$confirm(this.$t('toolManager.cczjyjscsfjx'), this.$t('toolManager.ts'), {
        confirmButtonText: this.$t('toolManager.qr'),
        cancelButtonText: this.$t('toolManager.qx'),
        type: "warning",
        callback: function(action) {
          if (action === "confirm") {
            _this.list.splice(_this.delIdx, 1);
          }
        }
      });
    },
    // 新增客户弹框关闭前执行操作
    handleClose: function() {
      this.loading = false; // 加载遮罩关闭
      this.custDialog = false; // 关闭弹框发了se
      this.$refs.refCustForm.resetFields(); // 清空新增客户表单
    },
    // 保存客户信息
    saveCustFn: function() {
      const _this = this;
      const data = {};
      var validCust = false;
      _this.$refs.refCustForm.validate(function(valid) {
        validCust = valid;
      });
      if (!validCust) {
        return;
      }
      _this.customForm.subsidyStartDate = parseTime(
        _this.customForm.subsidyStartDate,
        "{y}{m}{d}"
      );
      _this.customForm.subsidyStopDate = parseTime(
        _this.customForm.subsidyStopDate,
        "{y}{m}{d}"
      );
      yufp.clone(_this.customForm, data);
      _this.list.push(data);
      _this.$refs.refCustForm.resetFields();
      _this.custDialog = false;
    },
    // 新增
    addFn: function() {
      const _this = this;
      _this.custDialog = true;
      _this.$nextTick(function() {
        _this.$refs.refCustForm.resetFields();
      });
    },
    rowClick: function(row, event, column, index) {
      this.delIdx = index;
    },
    rowClickFn1: function (row) {
      // 将表格上选中的行数据复制给变量
      this.selections = this.$refs.refTable1.selections;
    },
    // 校验表单
    validFn1: function() {
      const _this = this;
      let flag = false;
      _this.$refs.refTable1.validate(function(fields) {
        if (!fields) {
          flag = true;
        } else {
          _this.$message({
            message:  this.$t('toolManager.qsrwzxx'),
            type: "warning"
          });
        }
      });
      return flag;
    },
    // 新增账号信息
    addFn1: function() {
      const _this = this,
        row = {
          stagStrtDate: "",
          stagEndDate: "",
          stagAmt: "",
          repyMode: "",
          repyFreq: "",
          repyIntv: ""
        };
      if (!_this.validFn1()) {
        return;
      }
      _this.tableData1.push(row);
      _this.$refs.refTable1.setCurrentRow(row);
    },
    // 删除账户信息
    deleteFn1: function(index, row) {
      this.tableData1.splice(index, 1);
    },
    trnfScopChange: function(val) {
      if (val == "Y") {
        this.hiddenList = true;
      } else if (val == "N") {
        this.hiddenList = false;
      }
    },
    resetOthers: function() {
      // opnDate mtrDate repayDate cycleTerm cycleSpace
      if (this.formdata.planCode === "7") {
        this.formdata.opnDate = null;
        this.formdata.mtrDate = null;
        this.formdata.repayDate = null;
        this.formdata.cycleTerm = null;
        this.formdata.cycleSpace = null;
      }
    },
    compaStrtToEndDateOpn: function() {
      if (
        this.formdata.opnDate &&
        this.formdata.opnDate != "" &&
        this.formdata.mtrDate &&
        this.formdata.mtrDate != ""
      ) {
        var opnDate = parseTime(this.formdata.opnDate, "{y}{m}{d}");
        var mtrDate = parseTime(this.formdata.mtrDate, "{y}{m}{d}");
        if (opnDate > mtrDate) {
          this.$message({
            message: "到期日不得小于开户日",
            type: "warning"
          });
          this.formdata.mtrDate != "";
          return;
        }
        if (mtrDate < this.curPrcsDt) {
          this.$message({
            message: this.$t('toolManager.dqrbdxydqjyr'),
            type: "warning"
          });
          this.formdata.mtrDate != "";
          return;
        }
      }
    },
    subsidyStopDateCheck: function() {
      const _this = this;
      if (
        _this.customForm.subsidyStartDate &&
        _this.customForm.subsidyStartDate != "" &&
        _this.customForm.subsidyStopDate &&
        _this.customForm.subsidyStopDate != ""
      ) {
        var subsidyStart = parseTime(
          _this.customForm.subsidyStartDate,
          "{y}{m}{d}"
        );
        var subsidyStopDate = parseTime(
          _this.customForm.subsidyStopDate,
          "{y}{m}{d}"
        );
        if (subsidyStart > subsidyStopDate) {
          _this.$message({
            message: this.$t('toolManager.txzzrbdxytxqsr'),
            type: "warning"
          });
          _this.customForm.subsidyStopDate != "";
          return;
        }
        if (subsidyStopDate < this.curPrcsDt) {
          _this.$message({
            message: this.$t('toolManager.txzzrbdxydqjyr'),
            type: "warning"
          });
          _this.customForm.subsidyStopDate != "";
          return;
        }
      }
    },
    resTable(code, message, response) {
      const _this = this;
      if (response.code == 0) {
        _this.formdataPlanInfo.sumPrcplAmt = response.data.sumPrcplAmt;
        _this.formdataPlanInfo.sumIntAmt = response.data.sumIntAmt;
      }
    },
    formResetFn: function() {
      const _this = this;
      this.$refs.refForm.resetFields();
    },

    submitButton: function() {
      const _this = this;
      if (this.formdata.planCode == "7") {
        //组合还款校验
        // for (var i = 0; i < _this.tableData1.length; i++) {
        //   if (parseTime(_this.tableData1[i].stagEndDate) < this.curPrcsDt) {
        //     _this.$message({
        //       message: this.$t('toolManager.dqrbdxyjyr'),
        //       type: "warning"
        //     });
        //     return;
        //   }
        // }

        var sum = _this.tableData1.reduce(
          (acc, cur) => acc + Number(cur.stagAmt),
          0
        );
        console.log(sum);
        console.log(_this.formdata.lnAmt);
        if (Number(sum) != Number(_this.formdata.lnAmt)) {
          _this.$message({
            message: this.$t('toolManager.hkjhbjzeyfkjebyz'),
            type: "warning"
          });
          return;
        }
      }
      var reg = /^([1-2]\d|3[0-1]|[1-9])$/;
      if (_this.formdata.repayDate && !reg.test(_this.formdata.repayDate)) {
        _this.$message({
          message: this.$t('toolManager.qsrzzs'),
          type: "warning"
        });
        return;
      }

      var model = {};
      yufp.clone(_this.formdata, model);
      model.loanRate = _this.formdata.loanRate * 100;
      if(this.formdata.planCode != "7") {
        var opnDate = parseTime(_this.formdata.opnDate, "{y}{m}{d}");
        var mtrDate = parseTime(_this.formdata.mtrDate, "{y}{m}{d}");
        model.opnDate = opnDate;
        model.mtrDate = mtrDate;
      }
      if (_this.formdata.subsidyFlag == "Y" && _this.list.length == 0) {
        _this.$message({
          message: this.$t('toolManager.txlbbnwk'),
          type: "warning"
        });
        return;
      }
      model.subsidyDetailList = _this.list;
      model.tCmbnRepyModeList = _this.tableData1;
      _this.repayDialog = true;
      _this.$nextTick(() => {
        _this.$refs.refTable.remoteData(model);
      });
    },

    /**
     *公共方法 start
     */
    // 用户列表组件
    // 表单金额格式化，千分位，两位小数
    formFormatter: function(value) {
      if (value == 0) {
        return "0.00";
      } else {
        return value;
        //return moneyFormatter(value);
      }
    },
    // 表格金额格式化
    tableFormatter: function(row, colum, cellValue) {
      if (cellValue == 0) {
        return 0.0;
      } else if (cellValue == null || cellValue == undefined) {
        return "";
      } else {
        return cellValue;
        //return moneyFormatter(cellValue);
      }
    },
    // 数字格式化
    numberFormatter: function(value) {
      if (value == 0) {
        return "0";
      } else {
        return value;
        //return moneyFormatter(value, 0);
      }
    }
    /**
     *公共方法 end
     */
  }
};
</script>
