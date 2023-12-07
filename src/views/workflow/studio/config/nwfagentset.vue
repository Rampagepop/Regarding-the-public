
<template>
  <div>
    <yu-panel :title="$t('wfentrust.title1')" panel-type="normal" no-padding-top>
      <template slot="right">
        <yu-toolBar>
          <el-button @click="addFn">{{ $t('wfbutton.add') }}</el-button>
        </yu-toolBar>
      </template>
      <template slot="filter">
        <yu-xform v-model="formdata" related-table-name="reftable" ref="searchForm" label-width="120px">
          <yu-xform-group :column="4">
            <yu-xform-item :label="$t('wfentrust.otheruserid')" :placeholder="$t('wfentrust.otheruserid')" ctype="input" name="otherUserId"></yu-xform-item>
            <yu-xform-item :label="$t('wfentrust.otherusername')" :placeholder="$t('wfentrust.otherusername')" ctype="input" name="otherUserName"></yu-xform-item>
            <yu-xform-item :label="$t('wfentrust.biztype')" :placeholder="$t('wfentrust.biztype')" ctype="input" name="bizType"></yu-xform-item>
            <div slot="custom" class="btn-group" style="text-align: right;padding-right: 20px">
              <yu-button type="primary" @click="searchFn">查询</yu-button>
              <yu-button @click="resetFn">重置</yu-button>
            </div>
          </yu-xform-group>
        </yu-xform>
      </template>
      <yu-xtable :data-url="urls.index" row-number ref="reftable" request-type="POST">
        <yu-xtable-column prop="bizType" :label="$t('wfentrust.biztype')">
          <template slot-scope="scope">
            <span>{{ scope.row.bizType === 'all_$type' ? $t('wfentrust.alltype') : scope.row.bizType }}</span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column prop="userId" :label="$t('wfentrust.userid')"></yu-xtable-column>
        <yu-xtable-column prop="userName" :label="$t('wfentrust.username')"></yu-xtable-column>
        <yu-xtable-column prop="otherUserId" :label="$t('wfentrust.otheruserid')"></yu-xtable-column>
        <yu-xtable-column prop="otherUserName" :label="$t('wfentrust.otherusername')"></yu-xtable-column>
        <yu-xtable-column prop="startTime" :label="$t('wfentrust.starttime')"></yu-xtable-column>
        <yu-xtable-column prop="endTime" :label="$t('wfentrust.endtime')"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfentrust.option')" fixed="right" width="140px">
          <template slot-scope="scope">
            <yu-button-drop :show-length="2" type="text">
              <yu-button @click="modifyFn(scope.row)" type="text">{{ $t('wfbutton.edit') }}</yu-button>
              <yu-button @click="deleteFn(scope.row)" type="text">{{ $t('wfbutton.delete') }}</yu-button>
            </yu-button-drop>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>

    <el-dialog-x :title="$t('wfentrust.title2')" :visible.sync="addDialogVisible" width="750px">
      <yu-xform ref="reform" label-width="124px" v-model="reformData" :rules="addRules">
        <yu-xform-group :column="2">
          <yu-xform-item name="userId" :label="$t('wfentrust.userid')" :placeholder="$t('wfentrust.msgicon1')" ctype="input" @click="vicarSelect('USER')" icon="search" :readonly="true" ref="userIdReadOnly"></yu-xform-item>
          <yu-xform-item name="userName" :label="$t('wfentrust.username')" ctype="input" disabled></yu-xform-item>
          <yu-xform-item name="otherUserId" :label="$t('wfentrust.otheruserid')" :placeholder="$t('wfentrust.msgicon2')" ctype="input" @click="vicarSelect('OTHER')" icon="search" :readonly="true" ref="otherUserIdReadOnly"></yu-xform-item>
          <yu-xform-item name="otherUserName" :label="$t('wfentrust.otherusername')" ctype="input" disabled></yu-xform-item>
          <yu-xform-item name="startTime" :label="$t('wfentrust.starttime')" ctype="custom">
            <yu-date-picker :default-value="new Date()" v-model="reformData.startTime" :editable="false" time-arrow-control value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="$t('wfentrust.msgtime1')"> </yu-date-picker>
          </yu-xform-item>
          <yu-xform-item name="endTime" :label="$t('wfentrust.endtime')" ctype="custom">
            <yu-date-picker :default-value="new Date()" v-model="reformData.endTime" :editable="false" time-arrow-control value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="$t('wfentrust.msgtime2')"> </yu-date-picker>
          </yu-xform-item>
          <yu-xform-item name="bizRange" :label="$t('wfentrust.bizrange')" ctype="select" :clearable="false" @change="rangeChangeFn" :options="bizRanges"></yu-xform-item>
          <yu-xform-item name="bizType" :label="$t('wfentrust.biztype')" :placeholder="$t('wfentrust.msgicon3')" ctype="input" @click="bizSelect" icon="search" :hidden="bizTypeHidden" :readonly="true"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="beforeAddFn">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="addDialogVisible = false">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog-x>
    <el-dialog-x :title="$t('wfentrust.title3')" :visible.sync="updatedialogVisible" width="750px">
      <yu-xform ref="editform" label-width="120px" v-model="editformData" :rules="editRules">
        <yu-xform-group :column="2">
          <yu-xform-item name="userId" :label="$t('wfentrust.userid')" :placeholder="$t('wfentrust.msgicon1')" ctype="input" disabled></yu-xform-item>
          <yu-xform-item name="userName" :label="$t('wfentrust.username')" ctype="input" disabled></yu-xform-item>
          <yu-xform-item name="otherUserId" :label="$t('wfentrust.otheruserid')" :placeholder="$t('wfentrust.msgicon2')" ctype="input" @click="vicarSelect('OTHER')" icon="search" disabled></yu-xform-item>
          <yu-xform-item name="otherUserName" :label="$t('wfentrust.otherusername')" ctype="input" disabled></yu-xform-item>
          <yu-xform-item name="startTime" :label="$t('wfentrust.starttime')" ctype="custom">
            <yu-date-picker :default-value="new Date(editformData.startTime)" v-model="editformData.startTime" :editable="false" time-arrow-control value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="$t('wfentrust.msgtime1')"> </yu-date-picker>
          </yu-xform-item>
          <yu-xform-item name="endTime" :label="$t('wfentrust.endtime')" ctype="custom">
            <yu-date-picker :default-value="new Date()" v-model="editformData.endTime" :editable="false" time-arrow-control value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="$t('wfentrust.msgtime2')"> </yu-date-picker>
          </yu-xform-item>
          <yu-xform-item name="bizRange" :label="$t('wfentrust.bizrange')" ctype="select" :clearable="false" :options="bizRanges" disabled></yu-xform-item>
          <yu-xform-item name="bizType" :label="$t('wfentrust.biztype')" ctype="input" :hidden="editformData.bizRange === '1'" disabled></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="saveEditFn()">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="updatedialogVisible = false">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog-x>
    <!--被委托人选取列表框-->
    <el-dialog-x :title="viewTitle[title]" :visible.sync="dialogVisibleVicar" width="750px" @open="dialogOpen">
      <yu-xform ref="formq" v-model="formqData" related-table-name="vicarList" class="el-form-search">
        <yu-xform-group :column="4">
          <yu-xform-item v-for="(item, index) in queryVicarFileds" :key="index" :placeholder="item.placeholder" :ctype="item.type" :name="item.field"></yu-xform-item>
          <div slot="custom" class="btn-group">
            <yu-button-group>
              <yu-button type="primary" icon="search" @click="formqSearchFn('formq')">{{ $t('wfbutton.search') }}</yu-button>
              <yu-button type="primary" icon="edit" @click="formqResetFn('formq')">{{ $t('wfbutton.reset') }}</yu-button>
            </yu-button-group>
          </div>
        </yu-xform-group>
      </yu-xform>
      <!-- <el-form-q ref="formq" form="queryVicar" :field-data="queryVicarFileds" search-table="vicarList" :buttons="vicarButtons"></el-form-q> -->
      <yu-xtable ref="vicarList" :data-url="urls.vicarUrl" :base-params="vicarParams" selection-type="radio" request-type="POST">
        <yu-xtable-column :label="$t('wfentrust.logincode')" prop="userId" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfentrust.name')" prop="userName" :resizable="true" align="center"></yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="returnVicar" v-if="title == 'OTHER'">{{ $t('wfbutton.xqfh') }}</el-button>
        <el-button type="primary" @click="returnUser" v-if="title == 'USER'">{{ $t('wfbutton.xqfh') }}</el-button>
      </div>
    </el-dialog-x>
    <el-dialog-x :title="$t('wfentrust.title4')" :visible.sync="dialogVisibleBiz" height="360px" width="750px" @open="bizdialogOpen">
      <yu-xform ref="refFormq" v-model="refFormQData" related-table-name="refTable" class="el-form-search">
        <yu-xform-group :column="4">
          <yu-xform-item v-for="(item, index) in bizqueryFields" :key="index" :placeholder="item.placeholder" :ctype="item.type" :name="item.field"></yu-xform-item>
          <div slot="custom" class="btn-group">
            <yu-button-group>
              <yu-button type="primary" icon="search" @click="formqSearchFn('refFormq')">{{ $t('wfbutton.search') }}</yu-button>
              <yu-button type="primary" icon="edit" @click="formqResetFn('refFormq')">{{ $t('wfbutton.reset') }}</yu-button>
            </yu-button-group>
          </div>
        </yu-xform-group>
      </yu-xform>
      <yu-xtable ref="refTable" :data-url="urls.bizType" selection-type="checkbox" reserve-selection row-key="bizType" request-type="POST">
        <yu-xtable-column :label="$t('wfentrust.biztype')" prop="bizType" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfentrust.ext')" prop="ext" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfentrust.flowid')" prop="flowId" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfentrust.flowname')" prop="flowName" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfentrust.pageurl')" prop="pageUrl" :resizable="true" align="center"></yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="selectFn">{{ $t('wfbutton.xqfh') }}</el-button>
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
    return {
      reformData: {},
      editformData: {},
      formqData: {},
      refFormQData: {},
      formdata: {},
      urls: {
        index: backend.workflowService + '/api/nwfentrust/query',
        vicarUrl: backend.workflowService + '/api/org/users',
        create: backend.workflowService + '/api/nwfentrust/create',
        update: backend.workflowService + '/api/nwfentrust/update',
        delete: backend.workflowService + '/api/nwfentrust/delete',
        bizType: backend.workflowService + '/api/biz/query'
      },
      bizTypeHidden: false,
      addRules: {
        userId: [{ required: true, message: _this.$t('wfentrust.msgbtx'), trigger: 'blur' }],
        otherUserId: [{ required: true, message: _this.$t('wfentrust.msgbtx'), trigger: 'blur' }],
        startTime: [{ required: true, validator: this.validateBeginTime, trigger: 'change' }],
        endTime: [{ required: true, validator: this.validateEndTime, trigger: 'change' }],
        bizType: [{ required: true, message: _this.$t('wfentrust.msgselectbiz'), trigger: 'blur' }]
      },
      editRules:{
        otherUserId: [{ required: true, message: _this.$t('wfentrust.msgbtx'), trigger: 'blur' }],
        startTime: [{ required: true, validator: this.validateBeginTimeE, trigger: 'change' }],
        endTime: [{ required: true, validator: this.validateEndTimeE, trigger: 'change' }],
      },
      updateFields: [],
      queryVicarFileds: [{
        placeholder: this.$t('wfentrust.logincode'),
        field: 'userId',
        type: 'input'
      }, {
        placeholder: this.$t('wfentrust.name'),
        field: 'userName',
        type: 'input'
      }],
      baseParams: {},
      vicarParams: {},
      vicarButtons: [{
        label: this.$t('wfbutton.search'),
        op: 'submit',
        type: 'primary',
        show: true,
        click: function (model, valid) {
          if (valid) {
            var params = {};
            params.userId = model.userId;

            if (model.userName != '') {
              params.userName = '%' + model.userName + '%';
            }

            var param = {
              condition: JSON.stringify(params)
            };

            _this.$refs.vicarList.remoteData(params);
          }
        }
      }, {
        label: this.$t('wfbutton.reset'),
        op: 'reset',
        show: this.resetButton
      }],
      bizqueryFields: [{
        placeholder: this.$t('wfentrust.biztype'),
        field: 'bizType',
        type: 'input'
      }, {
        placeholder: this.$t('wfentrust.ext'),
        field: 'ext',
        type: 'input'
      }],
      height: sessionStore.get(VIEW_SIZE).height - 103,
      dialogVisibleVicar: false,
      addDialogVisible: false,
      updatedialogVisible: false,
      viewType: 'ADD',
      viewTitle: {
        USER: this.$t('wfentrust.title5'),
        OTHER: this.$t('wfentrust.title6')
      },
      title: 'USER',
      dialogVisibleBiz: false,
      allBizType: "all_$type",
      bizRanges: [
        {key: "1", value: this.$t('wfentrust.alltype')},
        {key: "2", value: this.$t('wfentrust.singletype')}
      ],
      selectBizType: [],
    };
  },
  computed: {
    ...mapGetters(['org'])
  },
  created() {
    const _this = this;
    this.reformData.bizRange = "1";
    // 开始时间校验规则
    const validateBeginTime = function (rule, value, callback) {
      if (!value) {
        callback(new Error(_this.$t('wfentrust.msgtime1')));
      } else {
        var myDate = new Date();
        var endtime = _this.reformData.endTime;
        var endTime = new Date(endtime);
        if (value + 20 < myDate) {
          callback(new Error(_this.$t('wfentrust.msgtime3')));
        } else if (value > endTime && endTime != '') {
          callback(new Error(_this.$t('wfentrust.msgtime4')));
        } else {
          callback();
        }
      }
    };
    // 结束时间校验规则
    const validateEndTime = function (rule, value, callback) {
      if (!value) {
        callback(new Error(_this.$t('wfentrust.msgtime2')));
      } else {
        var starttime = _this.reformData.startTime;
        var endtime = _this.reformData.endTime;
        if (starttime != null && endtime != null) {
          var startTime = new Date(starttime);
          var endTime = new Date(endtime);
          if (endTime > startTime) {
            callback();
          } else {
            callback(new Error(_this.$t('wfentrust.msgtime5')));
          }
        }
      }
    };
    const validateBeginTimeE = function (rule, value, callback) {
      if (value === '') {
        callback(new Error(_this.$t('wfentrust.msgtime1')));
      } else {
        var myDate = new Date();
        var endtime = _this.editformData.endTime;
        var endTime = new Date(endtime);
        if (value + 20 < myDate) {
          callback(new Error(_this.$t('wfentrust.msgtime3')));
        } else if (value > endTime && endTime != '') {
          callback(new Error(_this.$t('wfentrust.msgtime4')));
        } else {
          callback();
        }
      }
    };
    // 结束时间校验规则
    const validateEndTimeE = function (rule, value, callback) {
      if (value === '') {
        callback(new Error(_this.$t('wfentrust.msgtime2')));
      } else {
        var starttime = _this.editformData.startTime;
        var endtime = _this.editformData.endTime;
        if (starttime != null && endtime != null) {
          var startTime = new Date(starttime);
          var endTime = new Date(endtime);
          if (endTime > startTime) {
            callback();
          } else {
            callback(new Error(_this.$t('wfentrust.msgtime5')));
          }
        }
      }
    };
  },
  methods: {
    formqSearchFn(name) {
      var _this = this;
      var model = name === 'formq' ? _this.formqData : _this.refFormQData;
      _this.$refs[name].validate(function(valid) {
        if (valid) {
          var params = {};
          if (name === 'formq') {
            params.userId = model.userId;
            if (model.userName) {
              params.userName = '%' + model.userName + '%';
            }
            var param = {
              condition: JSON.stringify(params)
            };
            _this.$refs.vicarList.remoteData(params);
            return;
          }
          params.bizType = model.bizType;
          if (model.ext) {
            params.ext = '%' + model.ext + '%';
          }
          var param = {
            condition: JSON.stringify(params)
          };
          _this.$refs.refTable.remoteData(params);
        } else {
          return;
        }
      });
    },
    formqResetFn(name) {
      this.$refs[name].resetFields();
      this.$refs[name === 'refFormq' ? 'refTable' : 'vicarList'].remoteData();
    },
    addFn: function () {
      // 打开新增面板
      var _this = this;
      _this.viewType = 'ADD';
      _this.addDialogVisible = true;
      _this.$nextTick(function () {
        _this.$refs.reform.resetFields();

        _this.reformData.systemId = 'cmis';
        _this.reformData.bizRange = "1";
        _this.reformData.bizType = "";
      });
    },
    vicarSelect: function(type) {
      var _this = this;
      _this.title = type;
      if(type === "USER") {
        _this.$refs.userIdReadOnly.$refs.userIdReadOnly.focus();
      } else if(type === "OTHER") {
        _this.$refs.otherUserIdReadOnly.$refs.otherUserIdReadOnly.focus();
      }
      _this.dialogVisibleVicar = true;
      _this.$nextTick(function () {
        _this.$refs.formq.resetFields();
        _this.$refs.vicarList.remoteData({});
      });
    },
    rangeChangeFn: function (val) {
      if(val === "1") {
        // 全部业务类型
        this.bizTypeHidden = true;
      } else{
        // 指定业务
        this.bizTypeHidden = false;
      }
    },
    bizSelect: function() {
      var _this = this;
      _this.dialogVisibleBiz = true;
      _this.$nextTick(function () {
        _this.$refs.refFormq.resetFields();
        _this.$refs.refTable.remoteData({});
      });
    },
    selectFn: function () {
      var selections = this.$refs.refTable.selections;

      if (selections.length < 1) {
        this.$message({
          message: this.$t('wfentrust.msgselectone'),
          type: 'warning'
        });
        return;
      }
      var str = "";
      this.selectBizType = [];
      selections.forEach(item => {
        str += item.bizType + ";";
        this.selectBizType.push(item.bizType);
      });
      this.$nextTick(function () {
        this.reformData.bizType = str;
      });
      this.dialogVisibleBiz = false;
    },
    modifyFn (row) {
      // 修改
      this.viewType = 'EDIT';
      this.updatedialogVisible = true;
      this.$nextTick(function () {
        extend(this.editformData, row);
        this.editformData.bizRange = "2";
        if(row.bizType === this.allBizType) {
          this.editformData.bizRange = "1";
        }
      });
    },
    beforeAddFn: function () {
      // 保存新增
      if(this.reformData.bizRange === "1") {
        // 全部业务类型
        this.reformData.bizType = this.allBizType;
        this.selectBizType = [];
        this.selectBizType.push(this.allBizType);
      }
      if(!this.selectBizType || this.selectBizType.length < 1) {
        this.$message({message: this.$t('wfentrust.msgselectone'), type: "warning"});
        return;
      }
      var _this = this;

      var reform = _this.$refs.reform;
      reform.validate(function (valid) {
        if (!valid) {
          _this.$message({ message: _this.$t('wfentrust.msginputillegal'), type: 'warning' });
          return;
        }
        var startTime = reform.formdata.startTime;
        var endTime = reform.formdata.endTime;
        if(_this.getDate(startTime) > _this.getDate(endTime)) {
          _this.$message({ message: _this.$t('wfentrust.msgtime4'), type: 'warning' });
          return;
        }
        _this.selectBizType.forEach(bizType => {
          _this.saveAddFn(bizType);
        });
      });
    },
    saveAddFn: function (bizType) {
      // 保存新增
      var comitData = {};
      extend(comitData, this.reformData);
      comitData.bizType = bizType;
      comitData.orgId = this.org.id;
      this.$request({
        url: this.urls.create,
        data: comitData,
        method: 'POST'
      }).then(({code, message, data}) => {
        if (code == "0" && data) {
          if (data === 1) {
            var Message = this.$t('wfentrust.msgsddsuccess');
            this.$message({ message: this.$t('wfentrust.msgsddsuccess'), type: 'success' });
            this.$refs.reform.resetFields();

            this.addDialogVisible = false;

            this.$refs.reftable.remoteData();
          } else {
            this.$message({ message: this.$t('wfentrust.msgczcdwtqx'), type: 'warning' });
          }
        } else {
          this.$message({
            duration: 6000,
            message: message ? message : this.$t('wfentrust.msgadderror'),
            type: 'error'
          });

        }
      });
    },
    // 保存修改
    saveEditFn: function () {
      var _this = this;

      var reform = _this.$refs.editform;
      reform.validate(function (valid) {
        if (!valid) {
          _this.$message({ message: _this.$t('wfentrust.msginputillegal'), type: 'warning' });
          return;
        }
        var startTime = reform.formdata.startTime;
        var endTime = reform.formdata.endTime;
        if(_this.getDate(startTime) > _this.getDate(endTime)) {
          _this.$message({ message: _this.$t('wfentrust.msgtime4'), type: 'warning' });
          return;
        }
        var comitData = {};
        extend(comitData, _this.editformData);
        // comitData.orgId = this.org.id;
        _this.$request({
          url: _this.urls.update,
          data: comitData,
          method: 'POST'
        }).then(({code, message, data}) => {
          if (code == 0) {
            if (data != null) {
              _this.$message({ message: _this.$t('wfentrust.msgeditsuccess'), type: 'success' });

              _this.$refs.editform.resetFields();

              _this.updatedialogVisible = false;
              _this.searchFn();
            }
          } else {
            _this.$message({
              duration: 6000,
              message: message ? message : _this.$t('wfentrust.msgediterror'),
              type: 'error'
            });
          }
        })
      });
    },
    deleteFn (row) {
      // 删除
      var _this = this;

      _this.$confirm(_this.$t('wfentrust.msgsuredelete'), _this.$t('wfentrust.tip'), {
        confirmButtonText: _this.$t('wfbutton.sure'),
        cancelButtonText: _this.$t('wfbutton.cancel'),
        type: 'warning',
        center: true
      }).then(function () {
        _this.$request({
          method: 'POST',
          url: _this.urls.delete,
          data: {bizType: row.bizType, userId: row.userId}
        }).then(({code, message, data}) => {
          if (code == 0) {

            _this.$message({
              duration: 6000,
              message: _this.$t('wfentrust.msgdelsucess'),
              type: 'success'
            });
            _this.searchFn();
          } else {
            _this.$message({
              duration: 6000,
              message: message ? message : _this.$t('wfentrust.msgdelerror'),
              type: 'error'
            });
          }
        })
      }).catch(e => {});
    },
    getdate: function (nowTime) {
      var d = new Date(nowTime);
      var year = d.getFullYear();
      var month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
      var date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
      var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
      var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
      var seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
      var myWant = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds;
      return myWant;
    },
    getDate: function (strDate) {
      // 日期时间格式化
      var a = strDate.split(' ');
      var b = a[0].split('-');
      var c = a[1].split(':');
      var date = new Date(b[0], b[1] - 1, b[2], c[0], c[1], c[2]);
      return date;
    },
    returnVicar: function () {
      // 选取被委托人返回,新增和修改均可选择被委托人
      if (this.$refs.vicarList.selections.length !== 1) {
        this.$message({
          duration: 4000,
          message: this.$t('wfentrust.msgselectone'),
          type: 'warning'
        });
        return false;
      }
      this.$refs.otherUserIdReadOnly.$refs.otherUserIdReadOnly.focus();
      var row = this.$refs.vicarList.selections[0];
      var formModel;
      if (this.viewType == 'EDIT') {
        formModel = this.editformData;
      } else {
        formModel = this.reformData;
      }

      this.$nextTick(function () {
        if (formModel.userId == row.userId) {
          this.$message({
            duration: 4000,
            message: this.$t('wfentrust.msgsameuser'),
            type: 'warning'
          });
          this.$refs.vicarList.remoteData({});
        } else {
          formModel.otherUserId = row.userId;
          formModel.otherUserName = row.userName;
          this.$refs.formq.resetFields();
          this.$refs.vicarList.remoteData({});
          this.dialogVisibleVicar = false;
        }
      });
    },
    returnUser: function () {
      // 选取委托人返回,只有新增可以选择委托人
      if (this.$refs.vicarList.selections.length !== 1) {
        this.$message({
          duration: 4000,
          message: this.$t('wfentrust.msgselectone'),
          type: 'warning'
        });
        return false;
      }
      this.$refs.userIdReadOnly.$refs.userIdReadOnly.focus();
      var row = this.$refs.vicarList.selections[0];
      this.$nextTick(function () {
        if (this.reformData.otherUserId == row.userId) {
          this.$message({
            duration: 4000,
            message: this.$t('wfentrust.msgsameuser'),
            type: 'warning'
          });
          this.$refs.vicarList.remoteData();
        } else {
          this.reformData.userId = row.userId;
          this.reformData.userName = row.userName;
          this.$refs.formq.resetFields();
          this.$refs.vicarList.remoteData();
          this.dialogVisibleVicar = false;
        }
      });
    },
    dialogOpen: function () {
      this.$nextTick(function () {
        this.$refs.vicarList.remoteData();
      });
    },
    bizdialogOpen: function () {
      this.$nextTick(function () {
        this.$refs.refTable.remoteData();
      });
    },
    searchFn: function () {
      var _this = this;
      _this.$refs.searchForm.validate(function(valid) {
        if (valid) {
          var model = _this.$refs.searchForm.formdata;
          var params = {
            bizType: model.bizType ? '%' + model.bizType + '%' : "",
            otherUserName: model.otherUserName ? '%' + model.otherUserName + '%' : "",
            otherUserId: model.otherUserId ? model.otherUserId : ""
          };
          _this.$refs.reftable.remoteData(params);
        }
      })
    },
    // 自定义重置功能
    resetFn: function () {
      this.$refs.searchForm.resetFields();
      this.$refs.reftable.remoteData();
    }
  }

}
</script>
<style lang="scss" scoped>
  ::v-deep .el-form-search .el-form-item {
    padding-right: 10px;
  }
</style>
