
<template>
  <div>
    <yu-panel :title="$t('wfmeetlist.title')" :collapse-hide="false">
      <yu-xform ref="searchForm" v-model="formdata" related-table-name="reftable" label-width="120px">
        <yu-xform-group :column="4">
          <yu-xform-item :label="$t('wfmeetlist.lcslh')" :placeholder="$t('wfmeetlist.lcslh')" ctype="input" name="instanceId"></yu-xform-item>
          <yu-xform-item :label="$t('wfmeetlist.ywlsh')" :placeholder="$t('wfmeetlist.ywlsh')" ctype="input" name="bizId"></yu-xform-item>
          <yu-xform-item :label="$t('wfmeetlist.meetstate')" :placeholder="$t('wfmeetlist.meetstate')" ctype="select" name="mettingSts" :options="mettingStsOptions"></yu-xform-item>
          <div slot="custom" class="btn-group">
            <yu-button type="primary" @click="searchFn">查询</yu-button>
            <yu-button @click="resetFn">重置</yu-button>
          </div>
        </yu-xform-group>
      </yu-xform>
      <yu-xtable ref="reftable" :row-index="true" :base-params="baseParams" :data-url="urls.index" show-hidden-menu>
        <yu-xtable-column :label="$t('wfmeetlist.lcslh')" prop="instanceId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.ywlsh')" prop="bizId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.flowname')" prop="flowName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.userid')" prop="userId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.bizpage')" prop="bizPage" :resizable="true" :hide-column="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.meetstate')" prop="mettingSts" :resizable="true">
          <template slot-scope="scope">
            <yu-tag type="gary" v-if="scope.row.mettingSts=='S'">{{ $t('wfmeetstate.meetstates') }}</yu-tag>
            <yu-tag type="success" v-if="scope.row.mettingSts=='R'">{{ $t('wfmeetstate.meetstater') }}</yu-tag>
            <yu-tag type="danger" v-if="scope.row.mettingSts=='E'">{{ $t('wfmeetstate.meetstatee') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.starttime')" prop="startTime" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.option')" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.mettingSts=='S'" @click="customRowOp(scope,'start')">{{ $t('wfbutton.startmeet') }}</el-button>
            <el-button type="text" v-if="scope.row.mettingSts=='R'" @click="customRowOp(scope,'start')">{{ $t('wfbutton.restartmeet') }}</el-button>
            <el-button type="text" @click="customRowOp(scope,'detail')">{{ $t('wfbutton.voteinfo') }}</el-button>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <el-dialog-x :title="viewTitle[viewType]" :visible.sync="startdialogVisible" width="650px" @close="cancel">
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
          <el-form-item :label="$t('wfmeetlist.meetuser')" prop="userId">
            <el-select v-model="gatherModel.userId" :multiple="true" lock-height="true" @change="memberChange" :disabled="false" @remove-tag="removeTag">
              <el-option v-for="item in Members" :key="item.userId" :label="item.userName" :value="item.userId">
                <span style="float: left">{{ item.userName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.key }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" align="center">
        <el-button @click="cancel">{{ $t('wfbutton.cancel') }}</el-button>
        <el-button type="primary" v-if="cancelHidden == true" @click="nwfstartFn">{{ $t('wfbutton.startmeet') }}</el-button>
        <el-button type="primary" v-if="cancelHidden == false" @click="nwfrerunFn">{{ $t('wfbutton.restartmeet') }}</el-button>
      </div>
    </el-dialog-x>
    <el-dialog-x :title="viewTitle[viewType]" :visible.sync="detaildialogVisible" width="900px">
      <yu-xtable ref="gathertable" :data-url="urls.dataUrl" :pageable="false" :base-params="detailParams">
        <yu-xtable-column :label="$t('wfmeetlist.lcslh')" prop="instanceId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.meetsub')" prop="mettingSub" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.meetyear')" prop="mettingYear" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.meetno')" prop="mettingNo" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.meetuser1')" prop="userId" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.meetuser1')" prop="userName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.starttime')" prop="startTime" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.endtime')" prop="endTime" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.votestate')" prop="mettingSts" :resizable="true">
          <template slot-scope="scope">
            <yu-tag type="success" v-if="scope.row.mettingSts=='Y'">{{ $t('wfvotestate.votestatey') }}</yu-tag>
            <yu-tag type="danger" v-if="scope.row.mettingSts=='N'">{{ $t('wfvotestate.votestaten') }}</yu-tag>
            <yu-tag type="warning" v-if="scope.row.mettingSts=='G'">{{ $t('wfvotestate.votestateg') }}</yu-tag>
            <yu-tag type="gray" v-if="scope.row.mettingSts==null">{{ $t('wfvotestate.votestatee') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetlist.meetcomment')" prop="mettingComment" :resizable="true"></yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="detaildialogVisible = false">{{ $t('wfbutton.sure') }}</el-button>
      </div>
    </el-dialog-x>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { sessionStore, extend } from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
export default {
  data: function () {
    var _this = this;
    var validateSub = function(rule, value, callback) {
      var patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/gim;
      if (!value) {
        callback(new Error(_this.$t('wfmeetlist.msgbtx')));
      } else if (value.length > 50) {
        callback(new Error(_this.$t('wfmeetlist.msgcdxz')));
      } else if (patrn.test(value)) {
        callback(new Error(_this.$t('wfmeetlist.msgtszf')));
      } else {
        callback();
      }
    };
    return {
      pickerOptions: {
        disabledDate: function (time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      urls: {
        index: backend.workflowService + '/api/metting/myStart',
        users: backend.workflowService + '/api/metting/user',
        start: backend.workflowService + '/api/metting/run',
        rerun: backend.workflowService + '/api/metting/rerun',
        dataUrl: backend.workflowService + '/api/metting/myOp'
      },
      mettingStsOptions: [{
        key: 'S',
        value: this.$t('wfmeetstate.meetstates')
      }, {
        key: 'E',
        value: this.$t('wfmeetstate.meetstatee')
      }, {
        key: 'R',
        value: this.$t('wfmeetstate.meetstater')
      }],
      formdata: {},
      baseParams: {},
      queryButtons: [{
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
      }, {
        label: this.$t('wfbutton.find'),
        op: 'reset'
      }],
      rules: {
        mettingYear: [{
          required: true,
          message: this.$t('wfmeetlist.msgbtx'),
          trigger: 'blur'
        }],
        mettingSub: [{
          validator: validateSub,
          trigger: 'blur'
        }],
        mettingNo: [{
          required: true,
          message: this.$t('wfmeetlist.msgbtx'),
          trigger: 'blur'
        }],
        userId: [{
          required: true,
          message: this.$t('wfmeetlist.msgbtx'),
          trigger: 'blur'
        }]
      },
      detailParams: {},
      height: sessionStore.get(VIEW_SIZE).height - 103,
      viewType: 'START',
      viewTitle: {
        START: this.$t('wfmeetlist.titlemeetstart'),
        EDIT: this.$t('wfmeetlist.titlemeetedit'),
        DETAIL: this.$t('wfmeetlist.titlevoteinfo')
      },
      startdialogVisible: false,
      detaildialogVisible: false,
      gatherModel: {
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
    ...mapGetters([
      "userCode",
      "org"
    ])
  },
  created () {
    this.baseParams = {
      // condition: {
      //   userId: this.userCode
      // }
      userId: this.userCode
    }
  },
  methods: {
    searchFn: function () {
      var params = {
        userId: this.userCode,
        instanceId: this.formdata.instanceId,
        bizId: this.formdata.bizId,
        mettingSts: this.formdata.mettingSts
      }
      this.$refs.reftable.remoteData(params)
    },
    resetFn: function () {
      this.$refs.searchForm.resetFields();
      this.$refs.reftable.remoteData({userId: this.userCode});
    },
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
          //   instanceId: scope.row.instanceId
          // })
          instanceId: scope.row.instanceId
        };

        _this.$nextTick(function () {
          _this.detaildialogVisible = true;
        });
      } else if (op == 'start') {
        _this.startFn(scope.row);
      }
    },
    startFn: function (row) {
      var _this = this;

      _this.number = [];
      var params = {
        instanceId: '',
        orgId: _this.org.code,
        dutyId: 'D001'
      };
      _this.viewType = 'START'; // 期数选择项

      for (var i = 1; i < this.$refs.reftable.data.length + 50; i++) {
        var no = {
          key: i,
          value: i
        };

        _this.number.push(no);
      }

      var list = new Array();

      if (row != null) {
        // 选择了一条数据
        if (row.mettingSts === 'E') {
          _this.$message({
            message: _this.$t('wfmeetlist.meetendcantedit'),
            type: 'warning'
          });

          return false;
        }

        if (row.mettingSts === 'S') {
          _this.cancelHidden = true;
        } else {
          _this.viewType = 'EDIT';
          _this.cancelHidden = false;
        }

        params.instanceId = row.instanceId;
        list.push(row.instanceId);
      } else {
        this.$message({
          message: _this.$t('wfmeetlist.selectone'),
          type: 'warning'
        });
        return false;
      }
      /* else if(obj.length>1){
      for(var i=0;i<obj.length;i++){
      var row = obj[i];
      if(row.mettingSts !== 'E'){
      if(row.mettingSts !== obj[0].mettingSts){
      _this.$message({message: '部分会议已经发起，不能进行批量发起操作!', type: 'warning'});
      return false;
      }
      if(row.mettingSts === 'S'){
      _this.cancelHidden = true;
      }else{
      _this.viewType = 'EDIT';
      _this.cancelHidden = false;
      }
      list.push(row.instanceId);
      }else{
      _this.$message({message: '部分会议已经结束，不能进行批量发起操作!', type: 'warning'});
      return false;
      }
      params.instanceId = row.instanceId;
      }
      }*/


      _this.gatherModel.instanceId = list;
      _this.$request({
        method: 'GET',
        data: params,
        url: _this.urls.users
      }).then(({code, message, data}) => {
        if (data != null) {
          var members = data;

          for (var i = 0; i < members.length; i++) {
            var option = {};
            option.userId = members[i].userId;
            option.userName = members[i].userName;

            _this.Members.push(option);
          }
        }
      });
      _this.startdialogVisible = true;
    },
    nwfstartFn: function () {
      var _this = this;

      var params = {};

      _this.$refs.reform.validate(function (valid) {
        if (valid) {
          if (_this.gatherModel.userId.length == 0) {
            _this.$message({
              message: _this.$t('wfmeetlist.selectmeetuser'),
              type: 'warning'
            });

            return false;
          }

          if (!_this.gatherModel.mettingNo) {
            _this.$message({
              message: _this.$t('wfmeetlist.selectmeetno'),
              type: 'warning'
            });

            return false;
          }

          extend(params, _this.gatherModel);
          var list = [];

          for (var i = 0; i < _this.selectMembers.length; i++) {
            list.push(_this.selectMembers[i]);
          }

          params.user = list;
          _this.$request({
            method: 'POST',
            data: params,
            url: _this.urls.start
          }).then(({code, message, data}) => {
            if (data) {
              _this.$message({
                message: _this.$t('wfmeetlist.startsuccess'),
                type: 'success'
              });
              _this.$refs.reform.resetFields();
              _this.startdialogVisible = false;
              _this.$refs.reftable.remoteData();
            }
          });
        } else {
          _this.$message({
            message: _this.$t('wfmeetlist.inputillegal'),
            type: 'warning'
          });
        }
      });
    },
    nwfrerunFn: function () {
      var _this = this;

      var params = {};

      _this.$refs.reform.validate(function (valid) {
        if (valid) {
          if (_this.gatherModel.userId.length == 0) {
            _this.$message({
              message: _this.$t('wfmeetlist.selectmeetuser'),
              type: 'warning'
            });

            return false;
          }

          if (!_this.gatherModel.mettingNo) {
            _this.$message({
              message: _this.$t('wfmeetlist.selectmeetno'),
              type: 'warning'
            });

            return false;
          }

          extend(params, _this.gatherModel);
          var list = [];

          for (var i = 0; i < _this.selectMembers.length; i++) {
            list.push(_this.selectMembers[i]);
          }

          params.user = list;
          _this.$request({
            method: 'POST',
            data: params,
            url: _this.urls.rerun
          }).then(({code, message, data}) => {
            if (data) {
              _this.$message({
                message: _this.$t('wfmeetlist.meetrestart'),
                type: 'success'
              });
              _this.$refs.reform.resetFields();
              _this.startdialogVisible = false;
              _this.$refs.reftable.remoteData();
            }
          });
        } else {
          _this.$message({
            message: _this.$t('wfmeetlist.inputillegal'),
            type: 'warning'
          });
        }
      });
    },
    cancel: function () {
      this.Members = [];
      this.number = [];
      this.selectMembers = [];
      this.gatherModel.userId = [];
      this.gatherModel.mettingNo = '';
      this.gatherModel.mettingSub = '';
      this.gatherModel.mettingYear = '';
      this.startdialogVisible = false;
      this.$refs.reform.resetFields();
    },
    memberChange: function (val) {
      var _this = this;

      if (val) {
        _this.gatherModel.totalCount = val.length;
        _this.removeTag();
      } else {
        _this.gatherModel.totalCount = '0';
      }
    },
    removeTag: function () {
      var _this = this;
      _this.selectMembers = [];

      if (_this.gatherModel.userId) {
        var value = _this.gatherModel.userId;

        if (value) {
          _this.gatherModel.totalCount = value.length;

          for (var i = 0; i < value.length; i++) {
            var item = value[i];

            for (var k = 0; k < _this.Members.length; k++) {
              var option = {};
              option.userId = item;

              if (_this.Members[k].userId == item) {
                option.userName = _this.Members[k].userName;
                _this.selectMembers.push(option);
              }
            }
          }
        }
      } else {
        _this.gatherModel.totalCount = '0';
      }
    },
    getyear: function (val) {
      this.gatherModel.mettingYear = val;
    },
    getNo: function (val) {
      this.gatherModel.mettingNo = val;
    }
  }

}
</script>
