<!--
  @Created by zhuly8@yusys.com.cn 2021-01-11
  @updated by
  @description 法人管理
-->
<template>
  <div id="instuManager">
    <yu-panel ref="panel" :title="$t('instuManager.frgl')" class="adjust-height" show-search-input :placeholder="$t('instuManager.gjz')" @search="fuzzyQuery" clearable>
      <!--法人列表操作按钮-->
      <template slot="right">
        <yu-toolBar>
          <yu-button v-if="checkCtrl('add')" @click="addUserFn">{{ $t('instuManager.xz') }}</yu-button>
          <yu-button v-if="checkCtrl('batchenable')" v-norepeat.disabled @click="useUserFn">{{ $t('instuManager.qy') }}</yu-button>
          <yu-button v-if="checkCtrl('batchdisable')" v-norepeat.disabled @click="stopUserFn">{{ $t('instuManager.ty') }}</yu-button>
          <yu-button v-if="checkCtrl('delete')" v-norepeat.disabled @click="deleteFn">{{ $t('instuManager.sc') }}</yu-button>
        </yu-toolBar>
      </template>
      <!--法人列表查询条件-->
      <template slot="filter">
        <yu-xform ref="searchForm" related-table-name="instusTable" v-model="searchFormdata" form-type="search" @form-reset="formResetFn">
          <yu-xform-group :column="4">
            <yu-xform-item :label="$t('instuManager.frmc')" name="instuName" :placeholder="$t('instuManager.qsr')"></yu-xform-item>
            <yu-xform-item :label="$t('instuManager.frdm')" name="instuCde" :placeholder="$t('instuManager.qsr')"></yu-xform-item>
            <yu-xform-item :label="$t('instuManager.zt')" name="instuSts" :placeholder="$t('instuManager.qxz')" ctype="select" data-code="DATA_STS"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <!--法人列表-->
      <yu-xtable ref="instusTable" row-number :data-url="tableUrl" selection-type="checkbox">
        <yu-xtable-column :label="$t('instuManager.frmc')" :width="$store.getters.language==='en'?'340px':'260px'"
        >
          <template slot-scope="scope">
            <a class="underline" @click="userDetailFn(scope.row)">{{ scope.row.instuName }}</a>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('instuManager.frdm')" prop="instuCde" width="300px"></yu-xtable-column>
        <yu-xtable-column :label="$t('instuManager.zt')" width="240px">
          <template slot-scope="scope">
            <yu-tag v-if="scope.row.instuSts=== 'A'" type="success">{{ instuSts[scope.row.instuSts] }}</yu-tag>
            <yu-tag v-if="scope.row.instuSts=== 'I'" type="danger">{{ instuSts[scope.row.instuSts] }}</yu-tag>
            <yu-tag v-if="scope.row.instuSts=== 'W'" type="warning">{{ instuSts[scope.row.instuSts] }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('instuManager.zxbg')">
          <template slot-scope="scope" v-if="scope.row.lastChgName">
            <span>{{ scope.row.lastChgName + '（' + scope.row.lastChgDt + '）' }}</span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column fixed="right" :label="$t('component.operate')" width="160">
          <template slot-scope="scope">
            <yu-button-drop set-index="0" :show-length="2" type="text">
              <yu-button v-if="checkCtrl('edit')" @click="editFn(scope.row)" type="text">{{ $t('instuManager.xg') }}</yu-button>
              <yu-button v-if="checkCtrl('batchenable') && scope.row.instuSts != 'A'" v-norepeat.disabled @click="useUserFn(scope.row)" type="text">{{ $t('instuManager.qy') }}</yu-button>
              <yu-button v-if="checkCtrl('batchdisable') && scope.row.instuSts != 'I'" v-norepeat.disabled @click="stopUserFn(scope.row)" type="text">{{ $t('instuManager.ty') }}</yu-button>
              <yu-button v-if="checkCtrl('delete')" v-norepeat.disabled @click="deleteFn(scope.row)" type="text">{{ $t('instuManager.sc') }}</yu-button>
            </yu-button-drop>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <!--法人 新增 修改 详情-->
    <yu-xdialog :title="viewTitle[viewType]" :visible.sync="dialogVisible" class="no-body-padding" :width="$store.getters.language==='en'?'1000px':'800px'">
      <yu-xform ref="instuForm" v-model="formdata" :form-type="formType" :label-width="$store.getters.language==='en'?'230px':'120px'" :rules="formRules">
        <yu-panel :title="$t('instuManager.gjxx')" panel-type="simple" is-collapse :collapse-title="collapseTitle">
          <yu-xform-group :column="2">
            <yu-xform-item :label="$t('instuManager.frmc')" name="instuName" :placeholder="$t('instuManager.qsr')"></yu-xform-item>
            <yu-xform-item :label="$t('instuManager.frdm')" name="instuCde" :placeholder="$t('instuManager.qsr')" :disabled="viewType != 'ADD'"></yu-xform-item>
            <yu-xform-item :label="$t('instuManager.zt')" name="instuSts" ctype="select" :placeholder="$t('instuManager.qsr')" data-code="DATA_STS"></yu-xform-item>
          </yu-xform-group>
        </yu-panel>
        <yu-panel :title="$t('instuManager.kzxx')" panel-type="simple" is-collapse :collapse-title="collapseTitle">
          <yu-xform-group :column="2">
            <yu-xform-item :label="$t('instuManager.jrrq')" name="joinDt" ctype="datepicker" :placeholder="$t('instuManager.qxz')" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"></yu-xform-item>
            <yu-xform-item :label="$t('instuManager.yb')" name="zipCde" :placeholder="$t('instuManager.qsr')"></yu-xform-item>
            <yu-xform-item :label="$t('instuManager.lxdh')" name="contTel" :placeholder="$t('instuManager.qsr')"></yu-xform-item>
            <yu-xform-item :label="$t('instuManager.lxr')" name="contUsr" :placeholder="$t('instuManager.qsr')"></yu-xform-item>
            <yu-xform-item :label="$t('instuManager.dz')" name="instuAddr" :placeholder="$t('instuManager.qsr')"></yu-xform-item>
          </yu-xform-group>
        </yu-panel>
      </yu-xform>
      <div slot="footer" class="yu-grpButton">
        <yu-button type="primary" v-if="formType==='edit'" key="edit" v-norepeat.disabled.noStopPropagation @click="saveInstu">{{ $t('instuManager.bc') }}</yu-button>
        <yu-button type="primary" v-if="viewType === 'DETAIL'" @click="switchStatus('EDIT', true)">{{ $t('instuManager.xg') }}</yu-button>
        <yu-button v-if="formType === 'details'" @click="cancelFn">{{ $t('instuManager.fh') }}</yu-button>
        <yu-button v-else @click="cancelFn">{{ $t('instuManager.qx') }}</yu-button>
      </div>
    </yu-xdialog>
  </div>
</template>
<script>
import {clone, lookup} from '@/utils';
import YufpSearchTree from '@/components/widgets/YufpSearchTree';
import {validator} from '@/utils/validate';
import {mapGetters} from 'vuex';

lookup.reg('DATA_STS,SEX_TYPE,IDENT_TYPE,HIGHEST_EDU');
export default {
  components: {YufpSearchTree},
  data: function () {
    return {
      formdata: {
        avator: '1',
        passwordShow: '******'
      }, // 表单数据
      tableUrl: backend.appOcaService + '/api/adminsminstu/page', // 法人列表查询地址
      dialogVisible: false, // 弹出框是否展示
      viewType: 'ADD', // 弹出框默认新增
      viewTitle: lookup.find('CRUD_TYPE', false), // 弹出框类型
      formDisabled: false, // 表单是否禁用
      formType: 'details',
      formRules: {
        instuName: [
          { required: true, message: this.$t('instuManager.btx')},
          { max: 33, message: this.$t('instuManager.srzgc')}
        ], // 法人名称校验
        instuCde: [
          {required: true, message: this.$t('instuManager.btx')},
          { max: 33, message: this.$t('instuManager.srzgc'), trigger: 'blur'}
        ], // 法人代码校验
        // 法人代码校验
        instuSts: {required: true, message: this.$t('instuManager.btx')}, // 必填项校验
        // contTel: {validator: validator.mobile},
        zipCde: {validator: validator.postcode}
      }, // 表单验证规则
      userDialogVisible: false, // 法人弹框是否显示
      instuFormdata: {}, // 法人查询表单数据
      userTableParams: {instuId: ''}, // 法人法人表查询参数
      searchFormdata: {}, // 查询表单数据
      instuSts: {}, // 法人状态
      relDialogVisible: false, // 法人关联信息弹出框
      pickerOptions: {
        disabledDate: function (time) {
          return time.getTime() < Date.now() - 8.64e7;
        } // 法人有效期禁用当前之前的日期
      },
      collapseTitle: [this.$t('instuManager.zk'), this.$t('instuManager.sq')]
    };
  },
  computed: {
    ...mapGetters(['orgTreeData'])
  },
  watch: {
  },
  mounted: function () {
    this.instuSts = lookup.find('DATA_STS', false);
    this.$store.dispatch('funData/orgTreeFn');
  },
  methods: {
    remoteTableData(panelRef, tableRef, searFormVmodel) {
      // panel隐藏的时候
      if (this.$refs[panelRef].hide) {
        this.$refs[tableRef].remoteData({keyWord: this.$refs.panel.inputVal})
      } else {
        this.$refs[tableRef].remoteData(this[searFormVmodel])
      }
    },
    remoteData() {
      this.remoteTableData('panel', 'instusTable', 'searchFormdata')
    },
    /**
    * 勾选表格
    * @param selection 当前勾选数据
    */
    selectFn: function (selection, disabledName) {
      if (selection.length > 0) {
        this[disabledName] = false;
        return;
      }
      this[disabledName] = true;
    },
    /**
    * 快速查询
    * @param e 模糊查询关键字
    */
    fuzzyQuery: function (e) {
      var param = {keyWord: e.value};
      this.$refs.instusTable.remoteData(param);
    },

    /**
    * 清空查询条件
    * @param immidately 是否立即执行查询，区分快速查询和精确查询
    */
    formResetFn: function () {
      this.$refs.searchForm.resetFields();
    },
    /**
    * 关闭弹出框
    */
    cancelFn: function () {
      this.dialogVisible = false;
    },
    /**
    * 控制保存按钮、xdialog、表单的状态
    * @param viewType 表单类型
    * @param editable 可编辑,默认false
    */
    switchStatus: function (viewType, editable) {
      if (this.formdata && this.formdata.instuSts === 'A' && viewType === 'EDIT') {
        this.$message({
          message: this.$t('instuManager.znxgtyhdqydjg'),
          type: 'warning'
        });
        return;
      }
      this.viewType = viewType;
      this.dialogVisible = true;
      this.formType = viewType === 'DETAIL' ? 'details' : 'edit';
      this.formDisabled = !editable;
    },
    editFn: function (row) {
      var _this = this;
      if (row.instuSts === 'A') {
        this.$message({
          message: _this.$t('instuManager.znxzsxhzdsxdsj'),
          type: 'warning'
        });
        return;
      }
      _this.$request({
        url: backend.appOcaService + '/api/adminsminstu/info/' + row.instuId
      }).then(({code, message, data}) => {
        if (code === '0') {
          _this.switchStatus('EDIT', true);
          _this.$nextTick(function () {
            this.$refs.instuForm.resetFields();
            clone(data, this.formdata);
          });
        } else {
          _this.$message({
            message: message
          });
          return {};
        }
      });
    },
    /**
    * 法人详情
    * @param row 当前法人信息
    */
    userDetailFn: function (row) {
      var _this = this;
      _this.$request({
        url: backend.appOcaService + '/api/adminsminstu/info/' + row.instuId
      }).then(({code, message, data}) => {
        if (code === '0') {
          _this.switchStatus('DETAIL', true);
          _this.$nextTick(function () {
            _this.$refs.instuForm.resetFields();
            clone(data, _this.formdata);
          });
        } else {
          _this.$message({
            message: message
          });
        }
      });
    },
    /**
    * 新增法人
    * @param row 当前法人信息
    */
    addUserFn: function () {
      this.switchStatus('ADD', true);
      this.$nextTick(function () {
        this.$refs.instuForm.resetFields();
        this.formdata.instuSts = 'W';
        this.instuId = '';
        this.$refs.instuForm.setFormData({instuSts: 'W'});
      });
    },


    /**
    * 保存法人
    */
    saveInstu: function () {
      var _this = this;
      var validate = false;
      _this.$refs.instuForm.validate(function (valid) {
        validate = valid;
      });

      if (!validate) {
        return;
      }

      var url = _this.formdata.instuId ? '/api/adminsminstu/update' : '/api/adminsminstu/add';
      _this.$request({
        method: 'POST',
        url: backend.appOcaService + url,
        data: _this.formdata
      }).then(({code, message, data}) => {
        if (code === '0') {
          _this.$message({
            message: _this.$t('instuManager.sjbccg'),
            type: 'success'
          });
          _this.remoteData();
          _this.dialogVisible = false;
        } else {
          _this.$message({
            message: message || _this.$t('instuManager.sjczsb'),
            type: 'error'
          });
        }
      });
    },


    /**
    * 启用法人
    */
    useUserFn: function (row) {
      var _this = this;
      var selections = row.instuId ? [row] : _this.$refs.instusTable.selections;
      if (selections.length < 1) {
        _this.$message({ message: _this.$t('instuManager.qxzytsj'), type: 'warning' });
        return;
      }
      var ids = [];
      for (var i = 0; i < selections.length; i++) {
        if (selections[i].instuSts === 'W' || selections[i].instuSts === 'I') {
          // 只能选择停用或待启用状态的法人
          ids.push(selections[i].instuId);
        } else {
          this.$message({
            message: this.$t('instuManager.znxzsxhzdsxdsj'),
            type: 'warning'
          });
          return;
        }
      }
      this.$confirm(this.$t('instuManager.cczjqygsjsfjx'), this.$t('instuManager.ts'), {
        confirmButtonText: this.$t('instuManager.qd'),
        cancelButtonText: this.$t('instuManager.qx'),
        type: 'warning',
        callback: function (action) {
          if (action === 'confirm') {
            // 发起启用用法人请求
            _this.$request({
              method: 'POST',
              url: backend.appOcaService + '/api/adminsminstu/batchenable',
              data: ids
            }).then(({code, message, data}) => {
              if (code === '0') {
                _this.$message({
                  // message: _this.$t('sjczcg.sjczcg'),
                  message: _this.$t('instuManager.sjczcg'),
                  type: 'success'
                });
                _this.remoteData();
              } else {
                _this.$message({
                  message: message || _this.$t('instuManager.sjczsb'),
                  type: 'error'
                });
              }
            });
          }
        }
      });
    },
    /**
    * 停用法人
    * @param row 当前法人信息
    */
    stopUserFn: function (row) {
      // 校验是否已选择数据
      var _this = this;
      var selections = row.instuId ? [row] : _this.$refs.instusTable.selections;
      if (selections.length < 1) {
        this.$message({ message: this.$t('instuManager.qxzytsj'), type: 'warning' });
        return;
      }
      var ids = [];
      for (var i = 0; i < selections.length; i++) {
        if (selections[i].instuSts === 'A') {
          // 只能停用生效的法人
          ids.push(selections[i].instuId);
        } else {
          this.$message({
            message: this.$t('instuManager.znxzysxdsj'),
            type: 'warning'
          });
          return;
        }
      }
      this.$confirm(this.$t('instuManager.cczjtygsjsfjx'), this.$t('instuManager.ts'), {
        confirmButtonText: this.$t('instuManager.qd'),
        cancelButtonText: this.$t('instuManager.qx'),
        type: 'warning',
        callback: function (action) {
          if (action === 'confirm') {
            // 发起停用法人请求
            _this.$request({
              method: 'POST',
              url: backend.appOcaService + '/api/adminsminstu/batchdisable',
              data: ids
            }).then(({code, message, data}) => {
              if (code === '0') {
                _this.$message({
                  // message: _this.$t('instuManager.sjczcg')
                  message: _this.$t('instuManager.sjczcg'),
                  type: 'success'
                });
                _this.remoteData();
              } else {
                _this.$message({
                  message: message || _this.$t('instuManager.sjczsb'),
                  type: 'error'
                });
              }
            });
          }
        }
      });
    },

    /**
    * 删除法人
    * @param row 当前行数据
    */
    deleteFn: function (row) {
      var _this = this;
      var selections = row.instuId ? [row] : this.$refs.instusTable.selections;
      if (selections.length < 1) {
        this.$message({
          message: this.$t('instuManager.qxxzyscdsj'),
          type: 'warning'
        });
        return;
      }
      var ids = [];
      for (var i = 0; i < selections.length; i++) {
        if (selections[i].instuSts === 'W' || selections[i].instuSts === 'I') {
          // 只能删除待生效停用状态的法人
          ids.push(selections[i].instuId);
        } else {
          this.$message({
            message: this.$t('instuManager.znsctydsj'),
            type: 'warning'
          });
          return;
        }
      }
      this.$confirm(this.$t('instuManager.cczjyjscgwjsfjx'), this.$t('instuManager.ts'), {
        confirmButtonText: this.$t('instuManager.qd'),
        cancelButtonText: this.$t('instuManager.qx'),
        type: 'warning',
        callback: function (action) {
          if (action === 'confirm') {
            // 发起停用法人请求
            _this.$request({
              method: 'POST',
              url: backend.appOcaService + '/api/adminsminstu/batchdelete',
              data: ids
            }).then(({code, message, data}) => {
              if (code === '0') {
                _this.$message({
                  message: _this.$t('instuManager.sjsccg'),
                  type: 'success'
                });
                _this.remoteData();
              } else {
                _this.$message({
                  message: message || _this.$t('instuManager.sjczsb'),
                  type: 'error'
                });
              }
            });
          }
        }
      });
    },
    /**
    * 获取表格选中数据 IDS
    * @param refname 表格ref名称
    *  @param key 表格数据唯一关键字
    */
    getSelectionsIds: function (refname, key) {
      var selections = this.$refs[refname].selections;
      var ids = [];
      for (var i = 0; i < selections.length; i++) {
        ids.push(selections[i][key]);
      }
      return ids;
    },
    cancelRelFn: function () {
      this.relDialogVisible = false;
    }
  }
};
</script>
<style>
.yu-user-pic-cust{
  padding-bottom: 20px;
}
.el-form-details .yu-user-pic-cust{
  padding-bottom: 12px;
}
/*
.compact .el-form-details .yu-user-pic-cust{
  padding-bottom: 21px;
}
.compact .yu-user-pic-cust{
  padding-bottom: 10px;
}
.compact .yu-user-pic-box{
  height: 120px;
  width: 130px;
}
.compact .yu-icon-user{
  font-size: 60px !important;
}*/
.el-form-details .yu-user-pic-cust{
  padding-bottom: 13px;

}
</style>

