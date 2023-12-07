
<template>
  <div>
    <yu-panel title="三人会商投票列表" :collapse-hide="false">
      <yu-xform v-model="formdata" related-table-name="reftable" form-type="search">
        <yu-xform-group :column="3">
          <yu-xform-item label="业务流水号" placeholder="业务流水号" ctype="input" name="bizId"></yu-xform-item>
          <yu-xform-item label="客户编号" placeholder="客户编号" ctype="input" name="bizUserId" fuzzy-query="both"></yu-xform-item>
          <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="bizUserName" fuzzy-query="both"></yu-xform-item>
          <yu-xform-item label="投票结论" placeholder="投票结论" ctype="select" name="voteSts" :options="mettingStsOptions"></yu-xform-item>
          <yu-xform-item label="投票状态" placeholder="投票状态" ctype="select" name="voteRes" :options="voteResOptions"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <el-table-x ref="reftable" :row-index="true" :base-params="baseParams" :data-url="urls.dataUrl" :table-columns="tableColumns" @custom-row-op="customRowOp" :default-sort="meetOrder"></el-table-x>
    </yu-panel>
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
        index: backend.workflowService + '/api/metting/myStart',
        dataUrl: backend.workflowService + '/api/bench/meetting/myOpList'
      },
      tableColumns: [
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
          hidden: true,
          resizable: true
        },
        {
          label: '业务流水号',
          prop: 'bizId',
          resizable: true
        },
        {
          label: '业务类型',
          prop: 'bizType',
          resizable: true,
          dataCode: 'FLOW_BIZ_TYPE'
        },
        {
          label: '客户编号',
          prop: 'bizUserId',
          resizable: true
        },
        {
          label: '客户名称',
          prop: 'bizUserName',
          resizable: true
        },
        {
          label: '发起人',
          prop: 'flowStarterName',
          resizable: true
        },
        {
          label: '发起机构',
          prop: 'appOrgName',
          resizable: true
        },
        {
          label: '流程名称',
          prop: 'flowName',
          hidden: true,
          resizable: true
        },
        {
          label: '呈报人',
          prop: 'userName',
          hidden: true,
          resizable: true
        },
        {
          label: '呈报机构',
          prop: 'orgName',
          hidden: true,
          resizable: true
        },
        {
          label: '业务页面',
          prop: 'bizPage',
          resizable: true,
          hidden: true
        },
        {
          label: '开始时间',
          prop: 'startTime',
          resizable: true
        },
        {
          label: '审批模式',
          prop: 'meetType',
          resizable: true,
          template: function () {
            return '<template slot-scope="scope">\
            <yu-tag type="success" v-if="scope.row.meetType==\'05\'">贷审会模式</yu-tag>\
            <yu-tag type="success" v-if="scope.row.meetType==\'04\'">三人会商模式</yu-tag>\
            <yu-tag type="success" v-if="scope.row.meetType==\'06\'">投审会模式</yu-tag>\
          </template>';
          }
        },
        {
          label: '会议状态',
          prop: 'mettingSts',
          resizable: true,
          template: function () {
            return '<template slot-scope="scope">\
            <yu-tag type="gary" v-if="scope.row.mettingSts==\'S\' || scope.row.mettingSts==null">尚未开始</yu-tag>\
            <yu-tag type="success" v-if="scope.row.mettingSts==\'R\'">投票中</yu-tag>\
            <yu-tag type="danger" v-if="scope.row.mettingSts==\'E\'">会议结束</yu-tag>\
          </template>';
          }
        },
        {
          label: '投票结论',
          prop: 'voteSts',
          resizable: true,
          template: function () {
            return '<template slot-scope="scope">\
            <yu-tag type="gary" v-if="scope.row.voteSts==\'\' || scope.row.voteSts==null">等待投票</yu-tag>\
            <yu-tag type="success" v-if="scope.row.voteSts==\'Y\'">同意</yu-tag>\
            <yu-tag type="danger" v-if="scope.row.voteSts==\'N\'">否决</yu-tag>\
            <yu-tag type="warning" v-if="scope.row.voteSts==\'G\'">再议</yu-tag>\
          </template>';
          }
        },
        {
          label: '投票状态',
          prop: 'voteRes',
          resizable: true,
          template: function () {
            return '<template slot-scope="scope">\
            <yu-tag type="gary" v-if="scope.row.voteSts==\'\' || scope.row.voteSts==null">未投票</yu-tag>\
            <yu-tag type="success" v-if="scope.row.voteSts==\'Y\' || scope.row.voteSts==\'N\' || scope.row.voteSts==\'G\'">已投票</yu-tag>\
          </template>';
          }
        },
        {
          label: '会议顺序',
          prop: 'meetOrder',
          resizable: true
        },
        {
          label: '操作',
          width: 100,
          fixed: 'right',
          template: function () {
            return `<template slot-scope="scope">
                    <el-button size="small" type="text" @click="$emit('custom-row-op',scope,'vote')">开始投票</el-button>
                  </template>`;
          }
        }
      ],
      mettingStsOptions: [
        {
          key: 'Y',
          value: '同意'
        },
        {
          key: 'N',
          value: '否决'
        },
        {
          key: 'G',
          value: '再议'
        }
      ],
      voteResOptions: [
        {
          key: '1',
          value: '已投票'
        },
        {
          key: '0',
          value: '未投票'
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
              _this.$refs.reftable.remoteData(model);
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
          prop: 'voteSts',
          resizable: true,
          template: function () {
            return `<template slot-scope="scope">
            <yu-tag type="success" v-if="scope.row.voteSts=='Y'">同意</yu-tag>
            <yu-tag type="danger" v-if="scope.row.voteSts=='N'">否决</yu-tag>
            <yu-tag type="warning" v-if="scope.row.voteSts=='G'">再议</yu-tag>
            <yu-tag type="gray" v-if="scope.row.voteSts==null">未投票</yu-tag>
          </template>`;
          }
        },
        {
          label: '会议意见',
          prop: 'mettingComment',
          resizable: true
        }
      ],
      height: yufp.frame.size().height - 103
    };
  },
  computed: {
    ...mapGetters(['userCode', 'org'])
  },
  watch: {
    $route (to, from) {
      if (to.name === this.$route.name) {
        this.$refs.reftable.remoteData();
      }
    }
  },
  created () {
    this.baseParams = {
      // condition: JSON.stringify({
      //   userId: this.userCode,
      //   excludeType: '04'
      // }),
      userId: this.userCode,
      excludeType: '04',
      sort: 't.start_time desc,M.meet_order asc'
    };
  },
  methods: {
    customRowOp: function (scope, op) {
      // 表格操作按钮事件
      var _this = this; // 当前行号：scope.$index
      // 当前行数据：scope.row
      // 当前列对象：scope.column
      // this.$alert('你现在正在操作：' + op + '当前行ID值为：' + scope.row.flowId, '提示');

      if (op == 'vote') {
        if (scope.row != null) {
          // 选择了一条数据
          if (scope.row.voteSts) {
            _this.$message({
              message: '已经投票，不能进行修改!',
              type: 'warning'
            });
            return false;
          }
          var routeId = 'router_vote_' + scope.row.voteId;
          var path = 'workflow/instance/metting/votepage';
          _this.openMeetPage(scope.row, routeId, path);
        } else {
          _this.$message({
            message: '请选择一条数据!',
            type: 'warning'
          });
          return false;
        }
      }
    },
    openMeetPage: function (data, routeId, path) {
      // 重新打开节点页面
      var r = yufp.router.getRoute(path);
      if (r && r.fullPath === '/404') {
        yufp.router.addRoute(path, routeId, {});
      }

      data.title = '会办投票';
      yufp.frame.addTab({
        id: path,
        title: data.title,
        name: data.title,
        key: data.title + data.bizId,
        // 页签名称
        data: data // 传递的业务数据，可选配置
      });
    }
  }
};
</script>
