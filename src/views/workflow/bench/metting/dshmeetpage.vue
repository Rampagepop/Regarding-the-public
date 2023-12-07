
<template>
  <div>
    <yu-panel :title="$t('wfmeetlist.title')" :collapse-hide="false">
      <yu-xform v-model="searchFormdata" form-type="search" ref="refForm" related-table-name="refTable">
        <yu-xform-group :column="4">
          <yu-xform-item :label="$t('wfmeetlist.ywlsh')" :placeholder="$t('wfmeetlist.ywlsh')" ctype="input" name="bizId"></yu-xform-item>
          <yu-xform-item :label="$t('wfmeetlist.bizuserid')" :placeholder="$t('wfmeetlist.bizuserid')" ctype="input" name="bizUserId"></yu-xform-item>
          <yu-xform-item :label="$t('wfmeetlist.bizusername')" :placeholder="$t('wfmeetlist.bizusername')" ctype="input" name="bizUserName" fuzzy-query="both"></yu-xform-item>
          <yu-xform-item :label="$t('wfmeetlist.meetstate')" :placeholder="$t('wfmeetlist.meetstate')" ctype="select" name="mettingSts" :options="mettingStsOptions"></yu-xform-item>
          <yu-xform-item :label="$t('wfmeetlist.meettype')" :placeholder="$t('wfmeetlist.meettype')" ctype="select" name="meetType" :options="mettingTypeOptions"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <yu-xtable ref="refTable" row-number selection-type="checkbox" request-type="POST" :pageable="true" :data-url="urls.index" :base-params="baseParams">
        <yu-xtable-column :label="$t('wfmeetlist.lcslh')" prop="instanceId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.ywlsh')" prop="bizId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.flowname')" prop="flowName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.bizusername')" prop="bizUserName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.bizuserid')" prop="bizUserId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.flowstarter')" prop="flowStarterName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.startorg')" prop="orgName"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.starttime')" prop="startTime"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.meettype')" prop="meetType">
          <template slot-scope="scope">
            <yu-tag type="success" v-if="scope.row.meetType=='05'">{{ $t('wfmeetlist.typadsh') }}</yu-tag>
            <yu-tag type="success" v-if="scope.row.meetType=='06'">{{ $t('wfmeetlist.typetsh') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.notvotenum')" prop="todoNum" align="center">
          <template slot-scope="scope">
            <span style="color: blue">{{ scope.row.todoNum + "/" + scope.row.totalNum }}</span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.meetstate')" prop="mettingSts">
          <template slot-scope="scope">
            <yu-tag type="gary" v-if="scope.row.mettingSts=='S'">{{ $t('wfmeetlist.statues') }}</yu-tag>
            <yu-tag type="success" v-if="scope.row.mettingSts=='R'">{{ $t('wfmeetlist.statuer') }}</yu-tag>
            <yu-tag type="danger" v-if="scope.row.mettingSts=='E'">{{ $t('wfmeetlist.statuee') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.meetorder')" prop="meetOrder">
          <template slot-scope="scope">
            <yu-input v-model="scope.row.meetOrder" :readonly="scope.row.mettingSts == 'E'"></yu-input>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.option')">
          <template slot-scope="scope">
            <yu-button-drop set-index="0" :show-length="2" type="text">
              <yu-button v-norepeat.disabled v-if="scope.row.mettingSts !=='E'" @click="customRowOp(scope,'start')" type="text">{{ $t('wfmeetlist.butchangevote') }}</yu-button>
              <yu-button v-norepeat.disabled @click="customRowOp(scope,'detail')" type="text">{{ $t('wfmeetlist.butinfo') }}</yu-button>
              <yu-button v-norepeat.disabled @click="customRowOp(scope,'delete')" type="text">{{ $t('wfbutton.delete') }}</yu-button>
            </yu-button-drop>
          </template>
        </yu-xtable-column>
      </yu-xtable>
      <div align="center">
        <el-button type="primary" @click="updateOrder">{{ $t('wfmeetlist.butsurechange') }}</el-button>
        <el-button type="primary" @click="startFn">{{ $t('wfmeetlist.butstart') }}</el-button>
      </div>
    </yu-panel>

    <el-dialog-x :title="$t('wfmeetlist.titlevoteinfo')" :visible.sync="detaildialogVisible" width="900px">
      <yu-xtable ref="gathertable" selection-type="radio" :pageable="true" :data-url="urls.dataUrl" :base-params="detailParams">
        <yu-xtable-column :label="$t('wfmeetlist.lcslh')" prop="instanceId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.meetsub')" prop="mettingSub" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.meetyear')" prop="mettingYear" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.meetno')" prop="mettingNo" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.meetuser1')" prop="userName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.starttime')" prop="startTime"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.endtime')" prop="endTime"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.votestate')" prop="mettingSts">
          <template slot-scope="scope">
            <yu-tag type="success" v-if="scope.row.mettingSts=='Y'">{{ $t('wfmeetlist.statey') }}</yu-tag>
            <yu-tag type="danger" v-if="scope.row.mettingSts=='N'">{{ $t('wfmeetlist.staten') }}</yu-tag>
            <yu-tag type="warning" v-if="scope.row.mettingSts=='G'">{{ $t('wfmeetlist.stateg') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.mettingSts==null || scope.row.mettingSts==''">{{ $t('wfmeetlist.statee') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.meetcomment')" prop="mettingComment"></yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="detaildialogVisible = false">{{ $t('wfbutton.sure') }}</el-button>
      </div>
    </el-dialog-x>

    <el-dialog-x :title="$t('wfmeetlist.titlews')" :visible.sync="startdialogVisible" width="650px" @close="cancel">
      <div class="box-card" style="margin: 15px;">
        <el-form ref="reform" :model="gatherModel" label-width="80px" :rules="rules">
          <el-form-item :label="$t('wfmeetlist.meetsub')" prop="mettingSub">
            <el-input type="input" v-model="gatherModel.mettingSub"></el-input>
          </el-form-item>
          <el-form-item :label="$t('wfmeetlist.meetyear')" prop="mettingYear">
            <el-date-picker v-model="gatherModel.mettingYear" type="year" :placeholder="$t('wfmeetlist.selecty')" value-format="yyyy" @change="getyear" :picker-options="pickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('wfmeetlist.meetno')" prop="mettingNo">
            <el-select v-model="gatherModel.mettingNo" :placeholder="$t('wfmeetlist.selectn')">
              <el-option v-for="index in number" :label="index.value" :value="index.key+''" :key="index.key+''">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" align="center">
        <el-button type="primary" v-if="cancelHidden == true" @click="sureStart">{{ $t('wfmeetlist.butstart') }}</el-button>
        <el-button @click="cancel">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog-x>
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
        delete: backend.workflowService + '/api/metting/deleteMeet',
        // start: backend.workflowService + '/api/metting/updateAllSubDataByMeetId',
        start: backend.workflowService + '/api/metting/updateAllSubDataByMeetId',
        index: backend.workflowService + '/api/metting/myStartList',
        dataUrl: backend.workflowService + '/api/metting/voteAll',
        changeOrder: backend.workflowService + '/api/metting/updateMeetBatch'
      },
      mettingStsOptions: [
        {
          key: 'S',
          value: this.$t('wfmeetlist.statues')
        },
        {
          key: 'E',
          value: this.$t('wfmeetlist.statuee')
        },
        {
          key: 'R',
          value: this.$t('wfmeetlist.statuer')
        }
      ],
      mettingTypeOptions: [
        {
          key: '05',
          value: this.$t('wfmeetlist.typadsh')
        },
        {
          key: '06',
          value: this.$t('wfmeetlist.typetsh')
        }
      ],
      searchFormdata: {},
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

              _this.$refs.refTable.remoteData(model);
            }
          }
        },
        {
          label: this.$t('wfbutton.reset'),
          op: 'reset'
        }
      ],
      detailParams: {},
      height: yufp.frame.size().height - 103,
      startdialogVisible: false, // 会议主题相关信息页面
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
      cancelHidden: true,
      rules: {
        mettingYear: [
          {
            required: false,
            message: this.$t('wfmeetlist.msgbtx'),
            trigger: 'blur'
          }
        ],
        mettingSub: [
          {required: false, message: this.$t('wfmeetlist.msgbtx'), trigger: 'blur'},
          {max: 60, message: this.$t('wfmeetlist.msgcdxz')}
        ],
        mettingNo: [
          {
            required: false,
            message: this.$t('wfmeetlist.msgbtx'),
            trigger: 'blur'
          }
        ]
      },
      meetForm: {
        instanceId: '',
        meetId: '',
        meetType: '05',
        meetUser: [
          {
            userId: '',
            userName: '',
            isCheckBiz: ''
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['userCode', 'org'])
  },
  watch: {
    $route (to, from) {
      if (to.path === "/workflow/bench/metting/dshmeetpage.vue") {
        this.$refs.refTable.remoteData();
      }
    }
  },
  created () {
    this.baseParams = {
      userId: this.userCode,
      // meetType: '05,06'
    };
    for (var i = 1; i < 101; i++) {
      var no = {
        key: i,
        value: i
      };
      this.number.push(no);
    }
  },
  methods: {
    customRowOp: function (scope, op) {
      // 表格操作按钮事件
      var _this = this; // 当前行号：scope.$index
      // 当前行数据：scope.row
      // 当前列对象：scope.column
      // this.$alert('你现在正在操作：' + op + '当前行ID值为：' + scope.row.flowId, '提示');

      if (op == 'detail') {
        _this.detailParams = {
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
              message: _this.$t('wfmeetlist.meetendcantedit'),
              type: 'warning'
            });
            return false;
          }
          var path = '/workflow/instance/metting/meetedit';
          _this.openMeetPage(scope.row, path);
        } else {
          _this.$message({
            message: _this.$t('wfmeetlist.selectone'),
            type: 'warning'
          });
          return false;
        }
      } else if (op == 'delete') {
        if(scope.row.mettingSts === "E") {
          _this.$message({message: _this.$t('wfmeetlist.msgendcantdelete'), type: 'warning'});
          return false;
        }
        _this.deleteFn(scope.row.meetId);
      }
    },
    deleteFn: function(meetId) {
      var _this = this;
      _this
        .$confirm(_this.$t('wfmeetlist.msgsuredelete') + "【" + meetId + "】？", _this.$t('wfmeetlist.tip'), {
          confirmButtonText: _this.$t('wfbutton.sure'),
          cancelButtonText: _this.$t('wfbutton.cancel'),
          type: "warning",
          center: true
        })
        .then(function() {
          _this.$request({
            method: "POST",
            data: {meetId: meetId},
            url: _this.urls.delete
          }).then(({code, message, data}) => {
            if (code === "0") {
              _this.$refs.refTable.remoteData();
              _this.$message({ message: _this.$t('wfmeetlist.msgsccg'), type: "success" });

            } else {
              _this.$message({ message: _this.$t('wfmeetlist.msgscsb') + message, type: "error"});
            }
          })
        })
        .catch(function () {});
    },
    // 打开会议详情页
    openMeetPage: function (queryData, path) {
      var routeId = "router_meetedit_" + queryData.meetId;
      var title = '会办会议';
      if (queryData.meetType === '05') {
        title = this.$t('wfmeetlist.titledsh'); // 贷审会
      } else if (queryData.meetType === '06') {
        title = this.$t('wfmeetlist.titletsh'); // 投审会会议
      }
      queryData.title = title;
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
    },
    updateOrder: function () {
      var data = this.$refs.refTable.selections;
      console.log(data);
      var _this = this;
      var params = [];
      if (data.length === 0) {
        _this.$message({message: _this.$t('wfmeetlist.selectone'), type: 'warning'});
        return;
      }
      for (var i = 0; i < data.length; i++) {
        var param = {
          meetId: data[i].meetId,
          meetOrder: parseInt(data[i].meetOrder)
        };
        params.push(param);
      }
      yufp.service.request({
        method: 'POST',
        data: { meets: params },
        url: _this.urls.changeOrder,
        callback: function (code, message, response) {
          if (response.data && response.data == data.length) {
            _this.$message({
              message: _this.$t('wfmeetlist.msgchangeorder'),
              type: 'success'
            });
            _this.$refs.refTable.remoteData();
          }
        }
      });
    },
    startFn: function () {
      var _this = this;
      var data = this.$refs.refTable.selections;
      if (data.length == 1) {
        _this.startdialogVisible = true;
      } else if (data.length > 1) {
        for (let i = 0; i < data.length; i++) {
          for (let j = i + 1; j < data.length; j++) {
            if (data[i].meetOrder == data[j].meetOrder) {
              _this.$message({
                message: _this.$t('wfmeetlist.msgsameorder'),
                type: 'success'
              });
              return;
            }
          }
        }
        // 校验完成后 进入会议主题相关页面
        _this.startdialogVisible = true;
      } else {
        _this.$message({
          message: _this.$t('wfmeetlist.selectone'),
          type: 'warning'
        });
        return;
      }
    },
    // 完善会议主题相关信息
    sureStart: function () {
      var _this = this;
      var data = _this.$refs.refTable.selections;
      _this.$refs.reform.validate(function (vaild) {
        if (vaild) {
          // let instanceIdList = [];
          // let meetIdList = [];
          for (let i = 0; i < data.length; i++) {
            // meetIdList.push(data.meetId);
            // instanceIdList.push(data.instanceId);
            _this.nwfstartFn(data[i]);// 更新会议主题相关
          }
          _this.startdialogVisible = false;
          _this.$refs.refTable.remoteData();
        }
      });
    },
    nwfstartFn: function (data) {
      var _this = this;
      var meetForm = {
        meetId: data.meetId,
        mettingSub: _this.gatherModel.mettingSub,
        mettingYear: _this.gatherModel.mettingYear,
        mettingNo: _this.gatherModel.mettingNo
      };
      var params = meetForm;
      yufp.service.request({
        async: false,
        method: 'POST',
        data: params,
        url: _this.urls.start,
        callback: function (code, message, response) {
          if (response.data) {
            _this.updateMeettingSts(data);
          } else {
            _this.$message({
              message: _this.$t('wfmeetlist.msgstartfail') + "【" + data.meetId + '】@' + response.message,
              type: 'error'
            });
            return;
          }
        }
      });
    },

    // 查询当前 会议的投票人员
    // selectVoteMemByMeetting (meetId) {
    //   let user = [];
    //   yufp.service.request({
    //     async: false,
    //     data: {meetId: meetId},
    //     url: backend.workflowService + '/api/bench/meetting/selectVoteMemByMeetting',
    //     callback: function (code, message, response) {
    //       if (response.code == '0') {
    //         user = response.data;
    //       } else {
    //         this.$message({
    //           message: '获取投票人失败!会议编号:' + meetId + '。报错:' + response.message,
    //           type: 'error'
    //         });
    //         return;
    //       }
    //     }
    //   });
    //   return user;
    // },
    // 修改会议状态 正在投票中
    updateMeettingSts (data) {
      var _this = this;
      data.mettingSts = 'R';
      yufp.service.request({
        async: false,
        method: 'POST',
        data: data,
        url: backend.workflowService + '/api/metting/updateMeet',
        callback: function (code, message, response) {
          if (response.data && response.data == 1) {
            _this.$message({
              message: _this.$t('wfmeetlist.msggxztcg'),
              type: 'success'
            });
          } else {
            _this.$message({
              message: _this.$t('wfmeetlist.msggxztsb') + "【" + data.meetId + '】@' + response.message,
              type: 'error'
            });
            return;
          }
        }
      });
    },
    // 原跳转会议详情页面
    oldMeettingDetail (data) {
      var _this = this;
      var routeId = 'router_meetedit_' + data.meetId;
      var path = '/workflow/instance/metting/meetedit';
      if (data.mettingSts === 'S') {
        var param = {};
        extend(param, data);
        param.mettingSts = 'R';
        yufp.service.request({
          method: 'POST',
          data: param,
          url: backend.workflowService + '/api/metting/updateMeet',
          callback: function (code, message, response) {
            if (response.data && response.data == data.length) {
              _this.$message({
                message: _this.$t('wfmeetlist.startsuccess'),
                type: 'success'
              });
            }
          }
        });
      }
      // 去除调转详情页面 刷新当前列表
      // _this.openMeetPage(data[0], routeId, path);
      _this.$refs.refTable.remoteData();
    },
    // 选择年
    getyear: function (val) {
      this.gatherModel.mettingYear = val;
    },
    // 取消完善信息
    cancel: function () {
      this.Members = [];
      this.selectMembers = [];
      this.gatherModel.userId = [];
      this.gatherModel.mettingNo = '';
      this.gatherModel.mettingSub = '';
      this.gatherModel.mettingYear = '';
      this.startdialogVisible = false;
      this.$refs.reform.resetFields();
    }
  }
};
</script>
