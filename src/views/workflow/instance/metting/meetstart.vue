<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t('wfmeetstart.title') }}</span>
      </div>
      <el-form :model="meetForm" :rules="rules" ref="refForm" label-width="100px" align="center">
        <el-form-item prop="meetType" align="center">
          <el-col :span="5">
            <span align="center">{{ $t('wfmeetstart.label1') }}</span>
          </el-col>
          <el-col :span="14">
            <el-select v-model="meetForm.meetType" clearable>
              <el-option v-for="item in meetTypes" :key="item.key" :value="item.key" :label="item.value"></el-option>
            </el-select></el-col>
        </el-form-item>
        <el-form-item prop="meetUser" align="center">
          <el-col :span="5">
            <span align="center">{{ $t('wfmeetstart.label2') }}</span>
          </el-col>
          <el-col :span="14">
            <el-table :data="meetForm.meetUser" style="width: 100%" border>
              <el-table-column :label="$t('wfmeetstart.num')" type="index" width="50px"></el-table-column>
              <el-table-column align="center" v-for="(item,index,key) in editColumns" :item="item" :key="key" :index="index" :label="item.label">
                <template slot-scope="scope">
                  <yu-input icon="search" v-model="scope.row[item.prop]" @click="selectUser(scope.$index,scope.row)" v-if="item.type ==='input'">
                  </yu-input>
                  <span v-if="item.type ==='text'">{{ scope.row[item.prop] }}</span>
                  <el-select v-model="scope.row[item.prop]" clearable v-if="item.type ==='select'">
                    <el-option v-for="item1 in isCheckBizs" :key="item1.key" :value="item1.key" :label="item1.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('wfmeetstart.option')" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="removeUser(scope.$index, scope.row)" v-if="meetForm.meetUser.length > 1">{{ $t('wfmeetstart.butdelete') }}</el-button>
                  <el-button size="mini" type="text" @click="addUser(scope.$index, scope.row)" v-if="scope.$index === meetForm.meetUser.length-1">{{ $t('wfmeetstart.butadd') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>
        <el-form-item label="" align="center">
          <el-button type="primary" @click="deleteFn">{{ $t('wfmeetstart.butcancel') }}</el-button>
          <el-button type="primary" @click="sureStart">{{ $t('wfmeetstart.butsubmit') }}</el-button>
          <el-button type="primary" @click="reBack">{{ $t('wfmeetstart.butback') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t('wfmeetstart.titlehis') }}</span>
      </div>
      <el-table :data="nodeHistory" border style="width: 100%">
        <el-table-column :label="$t('wfmeetstart.num')" type="index" width="50px"></el-table-column>
        <el-table-column prop="nodeName" :label="$t('wfmeetstart.nodename')"> </el-table-column>
        <el-table-column prop="userName" :label="$t('wfmeetstart.applyusername')"> </el-table-column>
        <el-table-column prop="startTime" :label="$t('wfmeetstart.starttime')"> </el-table-column>
        <el-table-column prop="userId" :label="$t('wfmeetstart.applyuser')"> </el-table-column>
        <el-table-column prop="nodeId" :label="$t('wfmeetstart.nodeid')"> </el-table-column>
        <el-table-column prop="userComment" :label="$t('wfmeetstart.usercomment')"> </el-table-column>
        <el-table-column prop="ext" :label="$t('wfmeetstart.extcomment')"> </el-table-column>
        <el-table-column prop="commentSign" :label="$t('wfmeetstart.commentsign')"> </el-table-column>
      </el-table>
    </el-card>
    <el-dialog-x :title="$t('wfmeetstart.titleuser')" :visible.sync="userSelectDialog">
      <!--yu-xform v-model="formdata" related-table-name="reftable" form-type="search">
        <yu-xform-group :column="3">selectFn
          <yu-xform-item :label="$t('wfmeetstart.userid')" :placeholder="$t('wfmeetstart.userid')" ctype="input" name="userId"></yu-xform-item>
          <yu-xform-item :label="$t('wfmeetstart.username')" :placeholder="$t('wfmeetstart.username')" ctype="input" name="userName"></yu-xform-item>
        </yu-xform-group>
      </yu-xform-->
      <yu-xtable ref="reftable" :data="Users" border>
        <yu-xtable-column prop="userId" :label="$t('wfmeetstart.userid')"></yu-xtable-column>
        <yu-xtable-column prop="userName" :label="$t('wfmeetstart.username')"></yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="selectFn">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="userSelectDialog = false">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog-x>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { validator } from '@/utils/validate';
export default {
  props: {
    bizPageData: {
      // 评论信息
      type: Array,
      default: function () {
        return null;
      }
    }
  },
  data: function () {
    return {
      pickerOptions: {
        disabledDate: function (time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      urls: {
        userUrl: backend.workflowService + '/api/metting/user',
        start: backend.workflowService + '/api/metting/run',
        update: backend.workflowService + '/api/metting/updateMeet',
        getComments: backend.workflowService + '/api/core/getAllComments/',
        dataUrl: backend.workflowService + '/api/metting/voteAll',
        delete: backend.workflowService + '/api/metting/deleteMeet',
      },
      editColumns: [
        // 表头信息
        {
          type: 'input',
          prop: 'userId',
          label: this.$t('wfmeetstart.userid'),
          width: '300'
        },
        {
          type: 'text',
          prop: 'userName',
          label: this.$t('wfmeetstart.userid'),
          width: '150'
        },
        {
          type: 'select',
          prop: 'isCheckBiz',
          label: this.$t('wfmeetstart.userid'),
          width: '150'
        }
      ],
      rules: {
        meetType: [
          { required: true, message: this.$t('wfmeetstart.msgqxztype'), trigger: 'blur' }
        ]
      },
      meetForm: {
        instanceId: '',
        meetId: '',
        meetType: '',
        meetUser: [
          {
            userId: '',
            userName: '',
            isCheckBiz: '1'
          }
        ]
      },
      gatherModel: {
        mettingSub: '',
        mettingYear: '',
        mettingNo: '',
        totalCount: 0
      },
      meetTypes: [
        {
          key: '05',
          value: this.$t('wfmeetlist.typadsh')
        },
        {
          key: '06',
          value: this.$t('wfmeetlist.typetsh')
        }
      ],
      isCheckBizs: [
        {
          key: '0',
          value: this.$t('wfmeetstart.no')
        },
        {
          key: '1',
          value: this.$t('wfmeetstart.yes')
        }
      ],
      currentOrgId: '',
      currentUserId: '',
      number: [],
      meetInfo: {},
      nodeHistory: [],
      formdata: {
        userId: '',
        userName: ''
      },
      meetId: '',
      instanceId: '',
      baseParams: {
        meetId: '',
        orgId: ''
      },
      tableIndex: 0,
      cancelHidden: true,
      userSelectDialog: false,
      startdialogVisible: false,
      returnBackFuncId: '',
      instanceInfo: null,
      pageData: {
        flowParam: {},
        optypeOptions: {}
      },
      Users: [],
      type: 'new',
      bizType: ''
    };
  },
  computed: {
    ...mapGetters(['userCode', 'org'])
  },
  created () {
    this.currentOrgId = this.org.code;
    this.currentUserId = this.userCode;
    this.baseParams.orgId = this.org.code;

    const params =
      this.bizPageData == null ? this.$route.params : this.bizPageData;
    this.meetId = params.meetId;
    this.meetForm.meetId = params.meetId;
    this.meetForm.instanceId = params.instanceId;
    this.meetInfo = params;
    this.instanceId = params.instanceId;
    this.bizType = params.instanceInfo.bizType;
    if (params.meetType) {
      this.meetForm.meetType = params.meetType;
    }
    if (params.returnBackFuncId) {
      this.returnBackFuncId = params.returnBackFuncId;
    }
    if (params.instanceInfo) {
      this.instanceInfo = params.instanceInfo;
      this.pageData.instanceInfo = params.instanceInfo;
    }

    this.baseParams.meetId = params.meetId;
    this.getComment(params.instanceId);
    this.initData(params);
  },
  mounted: function () {
    for (var i = 1; i < 101; i++) {
      var no = {
        key: i,
        value: i
      };
      this.number.push(no);
    }
  },
  methods: {
    initData: function (data) {
      var _this = this;
      var param = {
        instanceId: data.instanceId,
        meetId: data.meetId
      };
      yufp.service.request({
        method: 'POST',
        data: param,
        url: _this.urls.dataUrl,
        callback: function (code, message, response) {
          if (response.data && response.data.length > 0) {
            _this.meetForm.meetUser = response.data;
            _this.type = 'edit';
            yufp.extend(_this.gatherModel, response.data[0]);
          }
        }
      });
    },
    getComment: function (val) {
      var _this = this;
      yufp.service.request({
        method: 'POST',
        url: _this.urls.getComments,
        data: { mainInstanceId: val },
        callback: function (code, message, response) {
          if (response.code == 0) {
            if (response.data != null ? response.data.length > 0 : false) {
              var nodeHistory = response.data;
              // commentSign翻译
              for (var i = 0, length = nodeHistory.length; i < length; i++) {
                nodeHistory[i].commentSign = yufp.lookup.convertKey(
                  'OP_TYPE',
                  nodeHistory[i].commentSign
                );
              }
              _this.nodeHistory = nodeHistory;
            }
          }
        }
      });
    },
    selectUser: function (index, row) {
      var _this = this;
      _this.tableIndex = index;
      yufp.service.request({
        method: 'POST',
        data: _this.baseParams,
        url: _this.urls.userUrl,
        callback: function (code, message, response) {
          if (response.data && response.data.length > 0) {
            _this.Users = response.data;
            _this.userSelectDialog = true;
          }
        }
      });
    },
    addUser: function (index, row) {
      // if (this.meetForm.meetType === '04' && !this.checkUserNum('add')) {
      //   return false;
      // }
      var form = {
        userId: '',
        userName: '',
        isCheckBiz: '1'
      };
      this.meetForm.meetUser.push(form);
    },
    removeUser: function (index, row) {
      this.meetForm.meetUser.splice(index, 1);
    },
    onSubmit: function () {
      var _this = this;
      _this.$refs.refForm.validate(function (vaild) {
        if (!vaild) {
          return;
        }
      });
      // if (_this.meetForm.meetType === '04' && !_this.checkUserNum('submit')) {
      //   return false;
      // }
      if (_this.type === 'edit') {
        _this.nwfstartFn();
        return;
      }
      // _this.startdialogVisible = true;
    },
    selectFn: function () {
      var row = this.$refs.reftable.selections;
      if (row.length !== 1) {
        this.$message({ message: this.$t('wfmeetstart.qxxzytjl'), type: 'warning' });
        return;
      }
      if (row[0].userId == '' || row[0].userId == null || row[0].userName == '' || row[0].userName == null) {
        this.$message({ message: this.$t('wfmeetstart.msguserexit'), type: 'warning' });
        return;
      }
      for (var i = 0; i < this.meetForm.meetUser.length; i++) {
        if (this.meetForm.meetUser[i].userId === row[0].userId) {
          this.$message({ message: this.$t('wfmeetstart.msgyjxz'), type: 'warning' });
          return;
        }
      }
      this.meetForm.meetUser[this.tableIndex].userId = row[0].userId;
      this.meetForm.meetUser[this.tableIndex].userName = row[0].userName;
      this.userSelectDialog = false;
    },
    sureStart: function () {
      var _this = this;
      if (!this.meetForm.meetType) {
        _this.$message({ message: _this.$t('wfmeetstart.msgqxztype'), type: 'warning' });
        return;
      }
      for (let i = 0; i < this.meetForm.meetUser.length; i++) {
        if (!this.meetForm.meetUser[i].userName) {
          _this.$message({ message: _this.$t('wfmeetstart.msgqxzryhtj'), type: 'warning' });
          return;
        }
      }
      if (_this.meetForm.meetUser.length < 3) {
        _this.$message({ message: _this.$t('wfmeetstart.msgmin3user'), type: 'warning' });
        return;
      }
      _this.nwfstartFn();
    },
    nwfstartFn: function () {
      var _this = this;
      var params = _this.meetForm;
      var list = [];
      list.push(_this.meetId);
      params.user = _this.meetForm.meetUser;
      yufp.extend(params, _this.gatherModel);
      params.meetId = list;
      var list1 = [];
      list1.push(_this.instanceId);
      params.instanceId = list1;
      params.orgId = this.currentOrgId;
      yufp.service.request({
        method: 'POST',
        data: params,
        url: _this.urls.start,
        callback: function (code, message, response) {
          if (response.data) {
            _this.$message({
              message: _this.$t('wfmeetstart.msgstartsuccess'),
              type: 'success'
            });
            _this.type = 'edit';
            _this.startdialogVisible = false;
            _this.reBack();
          }
        }
      });
    },
    deleteFn: function() {
      var _this = this;
      var meetId = this.meetForm.meetId;
      _this
        .$confirm(_this.$t('wfmeetstart.msgsuredelete') + "【" + meetId + "】？", _this.$t('wfmeetstart.tip'), {
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
              _this.$emit("cancel-fn");
              _this.$message({ message: _this.$t('wfmeetstart.msgsccg'), type: "success" });
            } else {
              _this.$message({ message: _this.$t('wfmeetstart.msgdeleteerror') + message, type: "error"});
            }
          })
        })
        .catch(function () {});
    },
    checkUserNum: function (type) {
      var user = this.meetForm.meetUser;
      if (user != null && user.length == 3 && type == 'add') {
        this.$message({
          message: '三人会商模式只允许三人参会',
          type: 'warning'
        });
        return false;
      }
      if ((user == null || user.length < 3) && type == 'submit') {
        this.$message({ message: '三人会商模式需要三人参会', type: 'warning' });
        return false;
      }
      return true;
    },
    cancel: function () {
      this.Members = [];
      // this.number = [];
      this.selectMembers = [];
      this.gatherModel.userId = [];
      this.gatherModel.mettingNo = '';
      this.gatherModel.mettingSub = '';
      this.gatherModel.mettingYear = '';
      this.startdialogVisible = false;
      this.$refs.reform.resetFields();
    },
    reBack: function () {
      if (this.returnBackFuncId) {
        // this.update();
        // this.$router.replace({ name: this.returnBackFuncId });
      } else {
        yufp.router.removeTab(this.$route.path);
      }
    },
    update: function () {
      var _this = this;
      var params = {
        meetId: _this.meetForm.meetId,
        meetType: _this.meetForm.meetType
      };
      yufp.service.request({
        method: 'POST',
        data: params,
        url: _this.urls.update,
        callback: function (code, message, response) {
          // if (response.data) {
          //   _this.$message({
          //     message: "会议开启成功!",
          //     type: "success"
          //   });
          //   _this.type = 'edit';
          //   _this.startdialogVisible = false;
          // }
        }
      });
    },
    getyear: function (val) {
      this.gatherModel.mettingYear = val;
    },
    getNo: function (val) {
      this.gatherModel.mettingNo = val;
    }
  }

};
</script>
