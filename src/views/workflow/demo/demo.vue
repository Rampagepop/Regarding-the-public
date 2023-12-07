<template>
  <div>
    <yu-panel title="业务发起流程示例表单" :collapse-hide="false">
      <yu-xform ref="refForm" v-model="wfDemo" class="yu-form-gap" label-width="120px">
        <yu-xform-group :column="1">
          <yu-xform-item :label="$t('wfdemo.ywlsh')" ctype="custom" name="pkId" :colspan="13">
            <yu-row>
              <yu-col :span="20">
                <yu-input v-model="wfDemo.pkId" readonly></yu-input>
              </yu-col>
              <yu-col :span="4" style="padding-left: 20px;">
                <yu-button @click="reSet">{{ $t('wfdemo.resetid') }}</yu-button>
              </yu-col>
            </yu-row>
          </yu-xform-item>
          <yu-xform-item :label="$t('wfdemo.khmc')" :placeholder="$t('wfdemo.khmc')" ctype="input" name="name" :colspan="13"></yu-xform-item>
          <yu-xform-item :label="$t('wfdemo.khbh')" :placeholder="$t('wfdemo.khbh')" ctype="input" name="id" :colspan="13"></yu-xform-item>
          <yu-xform-item :label="$t('wfdemo.biztype')" :placeholder="$t('wfdemo.biztype')" ctype="input" name="bizType" :disabled="true" :colspan="13" icon="search" :on-icon-click="openDialog"></yu-xform-item>
          <yu-xform-item label="业务参数列表" ctype="custom" :colspan="13" name="param">
            <yu-xtable :data="flowParam" :pageable="false">
              <yu-xtable-column prop="key" label="参数" width="200px"></yu-xtable-column>
              <yu-xtable-column prop="label" label="名称" width="200px"></yu-xtable-column>
              <yu-xtable-column prop="value" label="参数值" ctype="input"></yu-xtable-column>
            </yu-xtable>
          </yu-xform-item>
          <yu-xform-item label="子流程参数列表" ctype="custom" :colspan="13" name="sub">
            <el-table :data="subFlowData" style="width: 100%" border>
              <el-table-column label="序号" type="index" width="50px"></el-table-column>
              <el-table-column align="center" v-for="(item,index,key) in editColumns" :item="item" :key="key" :index="index" :label="item.label">
                <template slot-scope="scope">
                  <yu-input icon="search" v-model="scope.row[item.prop]" @click="selectUser(scope.$index,scope.row)" v-if="item.type ==='search'" clearable></yu-input>
                  <yu-input v-model="scope.row[item.prop]" v-if="item.type ==='input'"></yu-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('wfmeetstart.option')" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="removeUser(scope.$index, scope.row)" v-if="subFlowData.length > 0">{{ $t('wfmeetstart.butdelete') }}</el-button>
                  <el-button size="mini" type="text" @click="addUser(scope.$index, scope.row)" v-if="scope.$index === subFlowData.length-1">{{ $t('wfmeetstart.butadd') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </yu-xform-item>
        </yu-xform-group>
      </yu-xform>

      <el-dialog-x :title="$t('wfdemo.biztype')" :visible.sync="dialogVisible" height="360px" width="750px">
        <yu-xform ref="refFormQ" v-model="formdata" related-table-name="reftable" class="el-form-search">
          <yu-xform-group :column="4">
            <yu-xform-item v-for="(item, index) in queryFields" :key="index" :placeholder="item.placeholder" :ctype="item.type" :name="item.field"></yu-xform-item>
            <div slot="custom" class="btn-group">
              <yu-button-group>
                <yu-button type="primary" icon="search" @click="searchFn">{{ $t('wfbutton.search') }}</yu-button>
                <yu-button type="primary" icon="edit" @click="resetFn">{{ $t('wfbutton.reset') }}</yu-button>
              </yu-button-group>
            </div>
          </yu-xform-group>
        </yu-xform>
        <yu-xtable ref="refTable" :data-url="urls.flow" request-type="POST">
          <yu-xtable-column :label="$t('wfdemo.biztype')" prop="bizType" :resizable="true" align="center"></yu-xtable-column>
          <yu-xtable-column :label="$t('wfdemo.biztypeext')" prop="ext" :resizable="true" align="center"></yu-xtable-column>
          <yu-xtable-column :label="$t('wfdemo.flowsign')" prop="flowSign" :resizable="true" align="center"></yu-xtable-column>
          <yu-xtable-column :label="$t('wfdemo.flowname')" prop="flowName" :resizable="true" align="center"></yu-xtable-column>
          <yu-xtable-column :label="$t('wfdemo.pageurl')" prop="pageUrl" :resizable="true" align="center"></yu-xtable-column>
        </yu-xtable>
        <div slot="footer" align="center">
          <el-button type="primary" @click="selectFn" v-if="viewType === 'bizType'">{{ $t('wfbutton.xqfh') }}</el-button>
          <el-button type="primary" @click="selectFn2" v-if="viewType === 'subType'">{{ $t('wfbutton.xqfh') }}</el-button>
        </div>
      </el-dialog-x>
    </yu-panel>
    <yu-form-buttons style="padding-left: 140px;">
      <!--yu-button type="primary" @click="start">{{ $t('wfdemo.starta') }}</yu-button-->
      <yu-button type="primary" @click="startAndSubmit">{{ $t('wfdemo.startb') }}</yu-button>
    </yu-form-buttons>
    <!-- 引入工作流 发起提交 组件-->
    <yufp-nwf-init ref="yufpNwfInit"></yufp-nwf-init>
  </div>
</template>
<script>
import { extend } from '@/utils'
import { mapGetters } from "vuex"
import yufpNwfInit from '@/components/widgets/YufpNwfInit';
export default {
  data: function () {
    var _this = this;
    return {
      formdata: {},
      urls: {
        flow: backend.workflowService + '/api/biz/query',
        start: backend.workflowService + '/api/core/start',
        var: backend.workflowService + '/api/nwfvar/vars/bybizflag'
      },
      wfDemo: {
        pkId: '12345678',
        name: '客户甲',
        id: 'customA',
        flowId: '',
        bizType: ''
      },
      dialogVisible: false,
      queryFields: [{
        placeholder: this.$t('wfdemo.biztype'),
        field: 'bizType',
        type: 'input'
      }, {
        placeholder: this.$t('wfdemo.biztypeext'),
        field: 'ext',
        type: 'input'
      }],
      editColumns: [
        // 表头信息
        {
          type: 'search',
          prop: 'bizType',
          label: "业务类型",
          width: '300'
        },
        {
          type: 'input',
          prop: 'flowName',
          label: "流程名称",
          width: '150'
        },
        {
          type: 'input',
          prop: 'subNum',
          label: "数目",
          width: '150'
        }
      ],
      collapseValue: "1",
      flowParam: [],
      tableIndex: 0,
      subFlowData: [{
        bizType: '',
        flowName: '',
        subNum: 1
      }],
      viewType: "bizType"
    };
  },
  computed: {
    ...mapGetters([
      'userCode', 'org'
    ])
  },
  mounted: function () {
    this.reSet();
  },
  methods: {
    searchFn() {
      var _this = this;
      _this.$refs.refFormQ.validate(function(valid) {
        if (valid) {
          var params = {};
          params.bizType = _this.formdata.bizType || '';

          if (_this.formdata.ext) {
            params.ext = '%' + _this.formdata.ext + '%';
          }

          _this.$refs.refTable.remoteData(params);
        } else {
          return;
        }
      });
    },
    resetFn() {
      this.$refs.refFormQ.resetFields();
      this.$refs.refTable.remoteData();
    },
    selectUser: function (index, row) {
      var _this = this;
      _this.tableIndex = index;
      _this.viewType = "subType";
      _this.dialogVisible = true;
      _this.$nextTick(function () {
        _this.$refs.refFormQ.resetFields();
        _this.$refs.refTable.remoteData({});
      });
    },
    addUser: function (index, row) {
      var form = {
        bizType: '',
        flowName: '',
        subNum: 1
      };
      this.subFlowData.push(form);
    },
    removeUser: function (index, row) {
      this.subFlowData.splice(index, 1);
      if(this.subFlowData.length === 0) {
        this.subFlowData = [{}]
      }
    },
    selectFn: function () {
      var selections = this.$refs.refTable.selections;

      if (selections.length < 1) {
        this.$message({ message: this.$t('wfmessage.qxzytjl'), type: 'warning' });
        return;
      }

      this.wfDemo.bizType = selections[0].bizType;
      this.dialogVisible = false;
      this.getVar(selections[0].bizType);
    },
    selectFn2: function () {
      var selections = this.$refs.refTable.selections;
      if (selections.length < 1) {
        this.$message({ message: this.$t('wfmessage.qxzytjl'), type: 'warning' });
        return;
      }
      this.subFlowData[this.tableIndex].bizType = selections[0].bizType;
      this.dialogVisible = false;
    },
    getVar: function(bizType) {
      this.flowParam = []
      this.$request({
        method: 'POST',
        data: {bizType: bizType, orgCode: this.org.code},
        url: this.urls.var
      }).then(response => {
        if(response) {
          var items = response.data;
          for(var i in items) {
            var item = {
              key: items[i].varId,
              label: items[i].varName,
              value: items[i].varValue ? items[i].varValue : ""
            }
            this.flowParam.push(item);
          }
          console.log(this.flowParam);
        }
      });
    },
    openDialog: function () {
      var _this = this;
      _this.viewType = "bizType";
      _this.dialogVisible = true;
      _this.$nextTick(function () {
        _this.$refs.refFormQ.resetFields();
        _this.$refs.refTable.remoteData({});
      });
    },
    reSet: function () {
      var myDate = new Date();
      // 获取日期与时间
      this.wfDemo.pkId = myDate.getTime();
    },
    // 【提交】按钮，直接调用流程引擎的初始化接口
    start: function () {
      var _this = this;
      if (_this.wfDemo.bizType === null || _this.wfDemo.bizType === "" || _this.wfDemo.bizType === undefined) {
        _this.$message({message: this.$t('wfmessage.biztyeisnull'), type: "warning"});
        return;
      }
      // 根据业务表单数据组装流程发起所需的参数
      var startdto = {};
      startdto.systemId = "cmis"; // 当前系统标识
      startdto.orgId = _this.org.code; // 发起机构
      startdto.userId = _this.userCode; // 发起人
      startdto.bizType = _this.wfDemo.bizType; // 要发起的业务类型
      startdto.bizId = _this.wfDemo.pkId; // 业务流水号（业务主键）
      startdto.bizUserName = _this.wfDemo.name; // 自定义业务数据（客户名称）
      startdto.bizUserId = _this.wfDemo.id; // 自定义业务数据（客户编号）
      startdto.bizParam4 = '111';
      // 需要携带到流程数据中的业务参数，用于后续业务判断
      startdto.param = {
        '金额': '10000',
        'money': _this.wfDemo.money
      };
      _this.getBizParam(startdto.param);
      // 获取子流程参数
      var subParams = _this.getSubFlowParams();
      if(subParams && subParams.length > 0) {
        startdto.param.subStartParams = subParams;
      }
      _this.$request({
        method: 'POST',
        data: startdto,
        url: backend.workflowService + '/api/core/start'
      }).then(({code, message, data}) => {
        if (code == 0) {
          if (data.flowStarterName) {
            var str = data.flowStarterName + _this.$t('wfmessage.startsuccess') + '@' + data.flowName;
            _this.$message({ message: str, type: 'success' });
          }
          _this.reSet();
        } else {
          _this.$message({ message: _this.$t('wfmessage.starterror') + message ? message.substring(0, 100) : "", type: 'warning' });
        }
      })
    },
    // 【发起并提交】按钮，
    startAndSubmit: function() {
      var _this = this;
      if (_this.wfDemo.bizType === null || _this.wfDemo.bizType === "" || _this.wfDemo.bizType === undefined) {
        _this.$message({message: _this.$t('wfmessage.biztyeisnull'), type: "warning"});
        return;
      }
      // 根据业务表单数据组装流程发起所需的参数
      var startdto = {};
      startdto.systemId = "cmis"; // 当前系统标识
      startdto.orgId = _this.org.code; // 发起机构
      startdto.userId = _this.userCode; // 发起人
      startdto.bizType = _this.wfDemo.bizType; // 要发起的业务类型
      startdto.bizId = _this.wfDemo.pkId; // 业务流水号（业务主键）
      startdto.bizUserName = _this.wfDemo.name; // 自定义业务数据（客户名称）
      startdto.bizUserId = _this.wfDemo.id; // 自定义业务数据（客户编号）
      // 需要携带到流程数据中的业务参数，用于后续业务判断
      startdto.param = {
        金额: "10000",
        money: _this.wfDemo.money,
        startOrgId: _this.org.code
      };
      _this.getBizParam(startdto.param);
      startdto.bizParam4 = "111"; // 流程数据中可自定义业务数据的扩展字段
      // 获取子流程参数
      var subParams = _this.getSubFlowParams();
      if(subParams && subParams.length > 0) {
        startdto.param.subStartParams = subParams;
      }
      // 调用【发起提交】组件的初始化方法
      _this.$refs.yufpNwfInit.wfInit(startdto);
      _this.reSet();
    },
    getBizParam: function(param) {
      if(this.flowParam && this.flowParam.length > 0) {
        for(var i in this.flowParam) {
          var item = this.flowParam[i];
          param[item.key] = item.value;
        }
      }
    },
    getSubFlowParams: function() {
      var subFlowParams = [];
      var startdto = {};
      startdto.systemId = "cmis"; // 当前系统标识
      startdto.orgId = this.org.code; // 发起机构
      startdto.userId = this.userCode; // 发起人
      startdto.bizId = this.wfDemo.pkId; // 业务流水号（业务主键）
      startdto.bizUserName = this.wfDemo.name; // 自定义业务数据（客户名称）
      startdto.bizUserId = this.wfDemo.id; // 自定义业务数据（客户编号）
      // 需要携带到流程数据中的业务参数，用于后续业务判断
      startdto.param = {
        金额: "10000",
        money: this.wfDemo.money,
        startOrgId: this.org.code
      };
      if(this.subFlowData && this.subFlowData.length > 0) {
        for(var i in this.subFlowData) {
          if (this.subFlowData[i].bizType) {
            // 要发起的业务类型
            var newDto = {};
            extend(newDto, startdto);
            newDto.bizType = this.subFlowData[i].bizType;
            newDto.flowName = this.subFlowData[i].flowName ? this.subFlowData[i].flowName : null;
            if(!this.subFlowData[i].subNum || this.subFlowData[i].subNum == undefined) {
              subFlowParams.push(newDto);
              continue;
            }
            for(var k = 0; k < this.subFlowData[i].subNum; k++) {
              subFlowParams.push(newDto);
            }
          }
        }
      }
      return subFlowParams;
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-form-search .el-form-item {
    padding-right: 10px;
  }
</style>
