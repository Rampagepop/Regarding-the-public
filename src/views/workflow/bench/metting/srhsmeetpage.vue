
<template>
  <div>
    <yu-panel title="三人会商会办任务" :collapse-hide="false">
      <yu-xform v-model="formdata" related-table-name="refTable" form-type="search">
        <yu-xform-group :column="3">
          <yu-xform-item label="流程实例号" placeholder="流程实例号" ctype="input" name="instanceId"></yu-xform-item>
          <yu-xform-item label="业务流水号" placeholder="业务流水号" ctype="input" name="bizId"></yu-xform-item>
          <yu-xform-item label="会议状态" placeholder="会议状态" ctype="select" name="mettingSts" :options="mettingStsOptions"></yu-xform-item>
          <yu-xform-item label="开始日期" placeholder="开始日期" ctype="datepicker" name="startTime"></yu-xform-item>
          <yu-xform-item label="结束日期" placeholder="结束日期" ctype="datepicker" name="endTime"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <yu-xtable ref="refTable" row-number selection-type="checkbox" @row-click="onRowClick" @row-dblclick="onRowDBClick" @cell-click="onCellClick" :pageable="true" :data-url="urls.index" :base-params="baseParams">
        <yu-xtable-column label="业务流水号" prop="bizId"></yu-xtable-column>
        <yu-xtable-column label="业务类型" prop="bizType" data-code="FLOW_BIZ_TYPE"></yu-xtable-column>
        <yu-xtable-column label="客户编号" prop="bizUserId"></yu-xtable-column>
        <yu-xtable-column label="客户名称" prop="bizUserName"></yu-xtable-column>
        <yu-xtable-column label="发起人" prop="flowStarterName"></yu-xtable-column>
        <yu-xtable-column label="发起机构" prop="appOrgName"></yu-xtable-column>
        <yu-xtable-column label="开始时间" prop="startTime"></yu-xtable-column>
        <yu-xtable-column label="审批模式" prop="meetType">
          <template slot-scope="scope">
            <yu-tag type="success" v-if="scope.row.meetType=='05'">贷审会模式</yu-tag>
            <yu-tag type="success" v-if="scope.row.meetType=='04'">三人会商模式</yu-tag>
            <yu-tag type="success" v-if="scope.row.meetType=='06'">投审会模式</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="参与投票人数" prop="totalNum"></yu-xtable-column>
        <yu-xtable-column label="待投票人数" prop="todoNum"></yu-xtable-column>
        <yu-xtable-column label="会议状态" prop="mettingSts">
          <template slot-scope="scope">
            <yu-tag type="gary" v-if="scope.row.mettingSts=='S'">尚未开始</yu-tag>
            <yu-tag type="success" v-if="scope.row.mettingSts=='R'">正在投票中</yu-tag>
            <yu-tag type="danger" v-if="scope.row.mettingSts=='E'">会议已结束</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="会议顺序" prop="meetOrder">
          <template slot-scope="scope">
            <yu-input v-model="scope.row.meetOrder"></yu-input>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="text" v-if="scope.row.mettingSts !=='E'" @click="customRowOp(scope,'start')">调整参会人员</el-button>
            <el-button size="small" type="text" @click="customRowOp(scope,'detail')">查看</el-button>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>

    <el-dialog-x :title="viewTitle[viewType]" :visible.sync="detaildialogVisible" width="900px">
      <el-table-x ref="gathertable" :data-url="urls.dataUrl" :pageable="false" :base-params="detailParams" :table-columns="detailColumns"></el-table-x>
      <div slot="footer" align="center">
        <el-button type="primary" @click="detaildialogVisible = false">确定</el-button>
      </div>
    </el-dialog-x>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data: function () {
    var _this = this;
    return {
      pickerOptions: {
        disabledDate: function (time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      urls: {
        index: backend.workflowService + '/api/bench/meetting/myStartList',
        dataUrl: backend.workflowService + '/api/metting/voteAll'
      },
      mettingStsOptions: [
        {
          key: 'S',
          value: '会议未开始'
        },
        {
          key: 'E',
          value: '会议已结束'
        },
        {
          key: 'R',
          value: '正在投票中'
        }
      ],
      formdata: {},
      baseParams: {},
      queryButtons: [
        {
          label: '搜索',
          op: 'submit',
          type: 'primary',
          click: function (model, valid) {
            if (valid) {
              var param = {
                condition: JSON.stringify(model)
              };

              _this.$refs.refTable.remoteData(model);
            }
          }
        },
        {
          label: '重置',
          op: 'reset'
        }
      ],

      detailParams: {},
      detailColumns: [
        {
          label: '会议号',
          prop: 'meetId',
          resizable: true,
          hidden: true,
          align: 'center'
        },
        {
          label: '流程实例号',
          prop: 'instanceId',
          resizable: true
        },
        {
          label: '会议标题',
          prop: 'mettingSub',
          resizable: true
        },
        {
          label: '会议年份',
          prop: 'mettingYear',
          resizable: true
        },
        {
          label: '会议期号',
          prop: 'mettingNo',
          resizable: true
        },
        {
          label: '投票人',
          prop: 'userId',
          resizable: true
        },
        {
          label: '投票人姓名',
          prop: 'userName',
          resizable: true
        },
        {
          label: '开始时间',
          prop: 'startTime',
          resizable: true
        },
        {
          label: '结束时间',
          prop: 'endTime',
          resizable: true
        },
        {
          label: '结论',
          prop: 'mettingSts',
          resizable: true,
          template: function () {
            return `<template slot-scope="scope">
            <yu-tag type="success" v-if="scope.row.mettingSts=='Y'">同意</yu-tag>
            <yu-tag type="danger" v-if="scope.row.mettingSts=='N'">否决</yu-tag>
            <yu-tag type="warning" v-if="scope.row.mettingSts=='G'">再议</yu-tag>
            <yu-tag type="gray" v-if="scope.row.mettingSts==null">未投票</yu-tag>
          </template>`;
          }
        },
        {
          label: '会议意见',
          prop: 'mettingComment',
          resizable: true
        }
      ],
      height: yufp.frame.size().height - 103,
      viewType: 'START',
      viewTitle: {
        START: '开始会办处理',
        EDIT: '修改会议事项',
        DETAIL: '参会人投票详情'
      },
      startdialogVisible: false,
      detaildialogVisible: false,
      gatherModel: {
        meetId: {},
        instanceId: {},
        mettingSub: '',
        mettingYear: '',
        mettingNo: '',
        userId: [],
        totalCount: 0
      },
      number: [],
      selectMembers: [],
      Members: [],
      cancelHidden: true
    };
  },
  computed: {
    ...mapGetters(['userCode', 'org'])
  },
  watch: {
    $route (to, from) {
      if (to.name === this.$route.name) {
        this.$refs.refTable.remoteData();
      }
    }
  },
  created () {
    this.baseParams = {
      // condition: JSON.stringify({
      //   userId: this.userCode,
      //   meetType: '04'
      // })
      userId: this.userCode,
      meetType: '04'
    };
  },
  methods: {
    customRowOp: function (scope, op) {
      // 表格操作按钮事件
      var _this = this; // 当前行号：scope.$index
      // 当前行数据：scope.row
      // 当前列对象：scope.column
      // this.$alert('你现在正在操作：' + op + '当前行ID值为：' + scope.row.flowId, '提示');

      if (op == 'detail') {
        _this.viewType = 'DETAIL';
        _this.detailParams = {
          // condition: JSON.stringify({
          //   meetId: scope.row.meetId
          // })
          meetId: scope.row.meetId
        };

        _this.$nextTick(function () {
          _this.detaildialogVisible = true;
        });
      } else if (op == 'start') {
        if (scope.row != null) {
          // 选择了一条数据
          if (scope.row.mettingSts === 'E') {
            _this.$message({
              message: '会议已经结束，不能进行修改!',
              type: 'warning'
            });
            return false;
          }
          _this.openMeetPage(scope.row);
        } else {
          _this.$message({
            message: '请选择一条数据!',
            type: 'warning'
          });
          return false;
        }
      }
    },
    openMeetPage: function (data) {
      // 重新打开节点页面
      var routeId = 'router_meetedit_' + data.meetId;
      var path = 'workflow/instance/metting/meetedit';

      var r = yufp.router.getRoute(path);
      if (r && r.fullPath === '/404') {
        yufp.router.addRoute(path, routeId, {});
      }

      data.title = '三人会商会议';
      yufp.frame.addTab({
        id: path,
        title: data.title,
        name: data.title,
        key: data.title,
        // 页签名称
        data: data // 传递的业务数据，可选配置
      });
    }
  }
};
</script>
