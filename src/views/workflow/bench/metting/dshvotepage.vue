
<template>
  <div>
    <yu-panel :title="$t('wfmeethislist.title')" :collapse-hide="false">
      <yu-xform v-model="formdata" related-table-name="reftable" form-type="search">
        <yu-xform-group :column="3">
          <yu-xform-item :label="$t('wfmeethislist.ywlsh')" :placeholder="$t('wfmeethislist.ywlsh')" ctype="input" name="bizId"></yu-xform-item>
          <yu-xform-item :label="$t('wfmeethislist.bizuserid')" :placeholder="$t('wfmeethislist.bizuserid')" ctype="input" name="bizUserId"></yu-xform-item>
          <yu-xform-item :label="$t('wfmeethislist.bizusername')" :placeholder="$t('wfmeethislist.bizusername')" ctype="input" name="bizUserName" fuzzy-query="both"></yu-xform-item>
          <yu-xform-item :label="$t('wfmeethislist.votestate')" :placeholder="$t('wfmeethislist.votestate')" ctype="select" name="voteSts" :options="mettingStsOptions"></yu-xform-item>
          <yu-xform-item :label="$t('wfmeethislist.voteres')" :placeholder="$t('wfmeethislist.voteres')" ctype="select" name="voteRes" :options="voteResOptions"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <!--el-table-x ref="reftable" :row-index="true" :base-params="baseParams" :data-url="urls.dataUrl" :table-columns="tableColumns" @custom-row-op="customRowOp" :default-sort=" {prop: 'meetOrder', order: 'descending'} "></el-table-x-->
      <yu-xtable ref="reftable" selection-type="radio" request-type="POST" :pageable="true" :row-index="true" :base-params="baseParams" :data-url="urls.dataUrl" :default-sort=" {prop: 'meetOrder', order: 'descending'} ">
        <yu-xtable-column :label="$t('wfmeethislist.lcslh')" prop="instanceId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.ywlsh')" prop="bizId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.bizuserid')" prop="bizUserId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.bizusername')" prop="bizUserName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.flowstarter')" prop="flowStarterName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.startorg')" prop="orgName"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.starttime')" prop="startTime"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.endtime')" prop="endTime"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.meettype')" prop="meetType">
          <template slot-scope="scope">
            <yu-tag type="success" v-if="scope.row.meetType=='05'">{{ $t('wfmeethislist.typadsh') }}</yu-tag>
            <yu-tag type="success" v-if="scope.row.meetType=='06'">{{ $t('wfmeethislist.typetsh') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.meetstate')" prop="mettingSts">
          <template slot-scope="scope">
            <yu-tag type="gary" v-if="scope.row.mettingSts=='S'">{{ $t('wfmeethislist.statues') }}</yu-tag>
            <yu-tag type="success" v-if="scope.row.mettingSts=='R'">{{ $t('wfmeethislist.statuer') }}</yu-tag>
            <yu-tag type="danger" v-if="scope.row.mettingSts=='E'">{{ $t('wfmeethislist.statuee') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.votestate')" prop="voteSts">
          <template slot-scope="scope">
            <yu-tag type="success" v-if="scope.row.voteSts=='Y'">{{ $t('wfmeethislist.statey') }}</yu-tag>
            <yu-tag type="danger" v-if="scope.row.voteSts=='N'">{{ $t('wfmeethislist.staten') }}</yu-tag>
            <yu-tag type="warning" v-if="scope.row.voteSts=='G'">{{ $t('wfmeethislist.stateg') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.voteSts==null || scope.row.voteSts==''">{{ $t('wfmeethislist.statee') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.voteres')" prop="voteRes">
          <template slot-scope="scope">
            <yu-tag type="warning" v-if="scope.row.voteSts=='Y' || scope.row.voteSts=='N' || scope.row.voteSts=='G'">{{ $t('wfmeethislist.statea') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.voteSts==null || scope.row.voteSts==''">{{ $t('wfmeethislist.statee') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.meetcomment')" prop="mettingComment"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeethislist.option')">
          <template slot-scope="scope">
            <yu-button-drop set-index="0" :show-length="2" type="text">
              <yu-button v-norepeat.disabled @click="customRowOp(scope, 'vote')" type="text">{{ $t('wfmeethislist.butstartvote') }}</yu-button>
            </yu-button-drop>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
  </div>
</template>
<script>
yufp.lookup.reg('FLOW_BIZ_TYPE');
import { mapGetters } from 'vuex';
import { sessionStore, extend } from '@/utils'
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
        dataUrl: backend.workflowService + '/api/metting/myVoteList',
        // dataUrl: backend.workflowService + '/api/bench/meetting/myOpList'
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
          label: '流程发起人',
          prop: 'flowStarterName',
          resizable: true
        },
        {
          label: '发起机构',
          prop: 'appOrgName',
          resizable: true
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
          value: this.$t('wfmeethislist.statey')
        },
        {
          key: 'N',
          value: this.$t('wfmeethislist.staten')
        },
        {
          key: 'G',
          value: this.$t('wfmeethislist.stateg')
        }
      ],
      voteResOptions: [
        {
          key: '1',
          value: this.$t('wfmeethislist.statea')
        },
        {
          key: '0',
          value: this.$t('wfmeethislist.statee')
        }
      ],
      formdata: {},
      baseParams: {},
      queryButtons: [
        {
          label: this.$t('wfbutton.search'),
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
          label: this.$t('wfbutton.reset'),
          op: 'reset'
        }
      ],
      height: yufp.frame.size().height - 103,
    };
  },
  computed: {
    ...mapGetters(['userCode', 'org'])
  },
  watch: {
    $route (to, from) {
      if (to.path === "/workflow/bench/metting/dshvotepage.vue") {
        this.$refs.reftable.remoteData();
      }
    }
  },
  created () {
    // <yu-tag type="gary" v-if="scope.row.voteSts==\'\' || scope.row.voteSts==null">等待投票</yu-tag>\
    this.baseParams = {
      userId: this.userCode,
      // excludeType: '05,06'
      voteRes: "2",
      sort: 'M.meet_order asc,t.start_time desc'
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
              message: _this.$t('wfmeethislist.voteend'),
              type: 'warning'
            });
            return false;
          }
          if (scope.row.mettingSts === 'S' && scope.row.isCheckBiz === '0') {
            _this.$message({
              message: _this.$t('wfmeethislist.msghywksbntp'),
              type: 'warning'
            });
            return false;
          }
          var routeId = 'router_vote_' + scope.row.voteId;
          var path = '/workflow/instance/metting/votepage';

          _this.openMeetPage(scope.row, routeId, path);
        } else {
          _this.$message({
            message: _this.$t('wfmeethislist.qxxzytjl'),
            type: 'warning'
          });
          return false;
        }
      }
    },
    openMeetPage: function (queryData, routeId, path) {
      queryData.title = this.$t('wfmeethislist.titleinfo');
      // 重新打开节点页面
      this.$router.addRoute(path, queryData.title, {noCache: true}, path);
      // 缓存路由数据
      const params = sessionStore.get('DYNAMIC_ROUTES_PARMS')
      if(params) {
        params[path] = queryData
        sessionStore.set('DYNAMIC_ROUTES_PARMS', params)
      } else {
        sessionStore.set('DYNAMIC_ROUTES_PARMS', {[path]: queryData})
      }
      this.$router.push({
        name: path,
        params: {queryData}
      });
    }
  }
};
</script>
