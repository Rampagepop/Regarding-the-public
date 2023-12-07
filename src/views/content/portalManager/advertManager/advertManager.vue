<!--
  @created by liusy16@yusys.com.cn 2022-05-13
  @updated by
  @description 宣传管理
-->
<template>
  <div id="advertManager">
    <yu-panel ref="panel" clearable :title="$t('advertManager.xcgl')" class="adjust-height" show-search-input :placeholder="$t('advertManager.gjz')" @search="fuzzyQuery">
      <!--宣传列表操作按钮-->
      <template slot="right">
        <yu-toolBar>
          <yu-button v-if="checkCtrl('add')" @click="addAdvertFn" style="margin-right: 10px;">{{ $t('advertManager.xz') }}</yu-button>
          <yu-radio-group @change="searchTableFn" v-model="adStatusChoose" v-if="$refs.panel && $refs.panel.hide">
            <yu-radio-button label="0">{{ $t('advertManager.qb') }}</yu-radio-button>
            <yu-radio-button label="3">{{ $t('advertManager.sx') }}</yu-radio-button>
            <yu-radio-button label="2">{{ $t('advertManager.xx') }}</yu-radio-button>
          </yu-radio-group>
        </yu-toolBar>
      </template>
      <!--宣传列表高级查询-->
      <template slot="filter">
        <yu-xform ref="searchForm" related-table-name="advertsTable" v-model="searchFormdata" form-type="search" @form-search="clearFuzzyFn" :custom-search-fn="customSearchFn" :custom-reset-fn="customResetFn">
          <yu-xform-group :column="4">
            <yu-xform-item :label="$t('advertManager.xczt')" name="adTitle" :placeholder="$t('advertManager.qsr')"></yu-xform-item>
            <yu-xform-item :label="$t('advertManager.sxsj')" name="effectDate" ctype="custom">
              <yu-date-picker v-model="searchFormdata.effectDate" :default-time="['00:00:00', '23:59:59']" time-arrow-control type="datetimerange" :placeholder="$t('advertManager.xzkssxsj')" value-format="yyyy-MM-dd HH:mm:ss"></yu-date-picker>
            </yu-xform-item>
            <!-- <yu-xform-item :label="$t('advertManager.jssj')" name="invalidDate" ctype="custom">
              <yu-date-picker v-model="searchFormdata.invalidDate" time-arrow-control type="datetime" :placeholder="$t('advertManager.xzjssxsj')" value-format="yyyy-MM-dd HH:mm:ss"></yu-date-picker>
            </yu-xform-item> -->
            <!-- <yu-xform-item :label="$t('advertManager.bz')" name="adRemark" :placeholder="$t('advertManager.qsr')"></yu-xform-item> -->
            <!-- <yu-xform-item :label="$t('advertManager.zspc')" name="showFrequency" :placeholder="$t('advertManager.qxz')" ctype="select" data-code="ADVERT_SHOW_FREQUENCY_STS"></yu-xform-item> -->
            <yu-xform-item :label="$t('advertManager.zt')" name="status" :placeholder="$t('advertManager.qxz')" ctype="select" data-code="ADVERTISEMENT_STS"></yu-xform-item>
            <!-- <yu-xform-item :label="$t('advertManager.nrlx')" name="contentType" :placeholder="$t('advertManager.qxz')" ctype="select" data-code="ADVERT_CONTENT_TYPE"></yu-xform-item> -->
          </yu-xform-group>
        </yu-xform>
      </template>
      <!--宣传列表-->
      <yu-xtable ref="advertsTable" row-number :data-url="tableUrl">
        <yu-xtable-column :label="$t('advertManager.xczt')" prop="adTitle">
          <template slot-scope="scope">
            <a class="underline" @click="advertDetailFn(scope.row)">{{ scope.row.adTitle }}</a>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('advertManager.slt')">
          <template slot-scope="scope">
            <el-image v-if="scope.row.contentType === 1" :src="getDownloadFile(scope.row)"></el-image>
            <video v-else :src="getDownloadFile(scope.row)" controls class="video" width="100%"></video>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('advertManager.nrlx')" prop="contentType">
          <template slot-scope="scope">
            <span>{{ contentType[scope.row.contentType] }}</span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('advertManager.sxsj')">
          <template slot-scope="scope" width="260">
            <span>{{ scope.row.effectDate }} - {{ scope.row.invalidDate }}</span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('advertManager.zt')">
          <template slot-scope="scope">
            <yu-tag v-if="scope.row.status=== 3" type="success">{{ status[scope.row.status] }}</yu-tag>
            <yu-tag v-if="scope.row.status=== 1" type="danger">{{ status[scope.row.status] }}</yu-tag>
            <yu-tag v-if="scope.row.status=== 2" type="gray">{{ status[scope.row.status] }}</yu-tag>
          </template>
        </yu-xtable-column>
        <!--        <yu-xtable-column :label="$t('advertManager.bz')">-->
        <!--          <template slot-scope="scope" v-if="scope.row.adRemark">-->
        <!--            <span>{{ scope.row.adRemark }}</span>-->
        <!--          </template>-->
        <!--        </yu-xtable-column>-->
        <yu-xtable-column fixed="right" :label="$t('component.operate')" width="160">
          <template slot-scope="scope">
            <yu-button-drop set-index="0" :show-length="3" type="text">
              <yu-button v-if="checkCtrl('edit')" :disabled="scope.row.status !== 2" :style="{color: scope.row.status !== 2 ? '#e4e8f1': ''}" @click="editFn(scope.row)" type="text">{{ $t('advertManager.bj') }}</yu-button>
              <yu-button v-if="checkCtrl('preview')" @click="preview(scope.row)" ref="preview" type="text">{{ $t('advertManager.yl') }}</yu-button>
              <yu-button v-if="checkCtrl('release') && scope.row.status !== 3" v-norepeat.disabled @click="doOnline(1, scope.row)" type="text">{{ $t('advertManager.sx') }}</yu-button>
              <yu-button v-if="checkCtrl('draft') && scope.row.status !== 2" v-norepeat.disabled @click="chgAdvertStsFn(scope.row, 2)" type="text">{{ $t('advertManager.xx') }}</yu-button>
              <yu-button v-if="checkCtrl('delete')" v-norepeat.disabled @click="chgAdvertStsFn(scope.row, 1)" type="text">{{ $t('advertManager.sc') }}</yu-button>
            </yu-button-drop>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <!--宣传 新增 修改 详情-->
    <yu-xdialog :title="viewTitle[viewType]" :visible.sync="dialogVisible" size="small" width="640px" @close="closeDialog">
      <yu-xform ref="advertForm" v-model="formdata" :form-type="formType" label-width="100px" :rules="formRules">
        <yu-xform-group :column="2">
          <!-- 宣传主题 -->
          <yu-xform-item :label="$t('advertManager.xczt')" name="adTitle" :placeholder="$t('advertManager.qsr')" colspan="24"></yu-xform-item>
          <!-- 内容类型 -->
          <yu-xform-item :label="$t('advertManager.nrlx')" name="contentType" ctype="radio" :placeholder="$t('advertManager.qxz')" data-code="ADVERT_CONTENT_TYPE"></yu-xform-item>
          <!-- 展示尺寸大小 -->
          <yu-xform-item :label="$t('advertManager.zscc')" name="adSize" ctype="select" :placeholder="$t('advertManager.qxz')" data-code="ADVERT_CONTENT_SIZE"></yu-xform-item>
          <!-- 选展示范围（机构) -->
          <yu-xform-item class="display-range-item" :label="$t('advertManager.zsfw')" name="showRange" ctype="custom" colspan="24">
            <yu-combo-tree v-if="viewType !== 'DETAIL'" v-model="showRangeArr" :multiple="true" :placeholder="$t('advertManager.mrqb')" :data-url="treeUrl" data-id="orgId" data-label="orgName" data-pid="upOrgId" :clearable="true"></yu-combo-tree>
            <span v-if="viewType === 'DETAIL'" class="display-range" :title="showRangeName">{{ showRangeName }}</span>
            <span v-if="viewType === 'DETAIL'" class="display-range-num">{{ formdata.showRangeNum }}</span>
          </yu-xform-item>
          <!-- 超链接 -->
          <!--<yu-xform-item :label="$t('advertManager.clj')" name="overLink" :placeholder="$t('advertManager.qsr')"></yu-xform-item>-->
          <!-- 展示时间 -->
          <!-- <yu-xform-item :label="$t('advertManager.kssj')" name="effectDate" ctype="custom">
            <yu-date-picker v-if="viewType !== 'DETAIL'" :default-value="new Date()" v-model="formdata.effectDate" time-arrow-control type="datetime" :placeholder="$t('advertManager.xzkssxsj')" value-format="yyyy-MM-dd HH:mm:ss"></yu-date-picker>
            <span v-else> {{ formdata.effectDate }} </span>
          </yu-xform-item> -->
          <!-- <yu-xform-item :label="$t('advertManager.jssj')" name="invalidDate" ctype="custom">
            <yu-date-picker v-if="viewType !== 'DETAIL'" :default-value="new Date()" v-model="formdata.invalidDate" time-arrow-control type="datetime" :placeholder="$t('advertManager.xzjssxsj')" value-format="yyyy-MM-dd HH:mm:ss"></yu-date-picker>
            <span v-else> {{ formdata.invalidDate }} </span>
          </yu-xform-item> -->
          <yu-xform-item :colspan="24" :label="$t('advertManager.sxsj')" :default-time="['00:00:00', '23:59:59']" :default-value="new Date()" name="dateArea" ctype="datepicker" time-arrow-control type="datetimerange" :placeholder="$t('advertManager.xzjssxsj')" value-format="yyyy-MM-dd HH:mm:ss" :details="viewType === 'DETAIL'" :picker-options="pickerOptions">
          </yu-xform-item>
          <!-- 展示频次 -->
          <yu-xform-item :label="$t('advertManager.zspc')" name="showFrequency" ctype="radio" :placeholder="$t('advertManager.qxz')" data-code="ADVERT_SHOW_FREQUENCY_STS" colspan="24"></yu-xform-item>
          <!-- 媒体 -->
          <yu-xform-item :label="$t('advertManager.nr')" name="fileAddr" ctype="custom" :colspan="24">
            <yu-upload class="upload-c" v-if="viewType !== 'DETAIL'" :file-list="fileList" ref="upload" drag :action="uploadAction" :headers="uploadHeader"
                       :show-file-list="true" :on-success="handleFileSuccess" :before-upload="beforeFileUpload" :on-remove="handleRemove">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">{{ $t('advertManager.scyq') }}</div>
            </yu-upload>
            <el-image v-else-if="formdata.contentType === 1" :src="getDownloadFile(formdata)"></el-image>
            <video v-else :src="getDownloadFile(formdata)" controls class="video" width="100%"></video>
          </yu-xform-item>
          <!-- 备注 -->
          <yu-xform-item :label="$t('advertManager.bz')" name="adRemark" ctype="textarea" :placeholder="$t('advertManager.qsr')" colspan="24"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" class="yu-grpButton">
        <yu-button v-if="checkCtrl('release') && formType === 'edit' && !formdata.dateArea" type="primary" @click="saveAdvertFn(1)">{{ $t('advertManager.sx') }}</yu-button>
        <yu-button v-if="checkCtrl('edit')&& viewType === 'DETAIL' && formdata.status === 2" type="primary" @click="chgAdvertStsFn(formdata, 3)">{{ $t('bannerManager.sx') }}</yu-button>
        <yu-button v-if="checkCtrl('tempsave')&& formType==='edit'" @click="saveAdvertFn(2)">{{ $t('advertManager.zc') }}</yu-button>
        <yu-button v-if="checkCtrl('edit')&& viewType === 'DETAIL' && formdata.status === 2" @click="switchStatus('EDIT', true)">{{ $t('advertManager.bj') }}</yu-button>
        <yu-button v-if="checkCtrl('draft')&& viewType === 'DETAIL' && formdata.status === 3" type="primary" @click="chgAdvertStsFn(formdata, 2)">{{ $t('advertManager.xx') }}</yu-button>
        <yu-button v-if="checkCtrl('delete')&& viewType === 'DETAIL' && formdata.status == 2" @click="chgAdvertStsFn(formdata, 1)">{{ $t('advertManager.sc') }}</yu-button>
        <!-- <yu-button v-if="formType === 'details'" @click="cancelFn">{{ $t('advertManager.fh') }}</yu-button> -->
        <yu-button @click="cancelFn">{{ $t('advertManager.qx') }}</yu-button>
      </div>
    </yu-xdialog>
    <!-- 查看宣传媒体 -->
    <yu-xdialog :title="$t('advertManager.xcnr')" v-if="mediaDialogVisible" :visible.sync="mediaDialogVisible" custom-class="dialog-advertisement" top="50%" :middle="false" :size="mediaDialogSize" @close="closeMediaDialog">
      <el-image v-if="mediaContentType === 1" :src="fileAddr" width="100%"></el-image>
      <video v-else :src="fileAddr" controls autoplay class="video" width="100%"></video>
    </yu-xdialog>
  </div>
</template>
<script>
import {clone, lookup} from '@/utils'
import YufpSearchTree from "@/components/widgets/YufpSearchTree";
import YufpUserSelector from "@/components/widgets/YufpUserSelector";
import {mapGetters} from "vuex"
// import Divider from "@/views/yuxp/page/designPage/components/containers/divider";
import {getAccessToken} from "@/utils/oauth";
import {getFileUrl, getUploadFileUrl, addTokenInfo} from "@/utils/util";

lookup.reg('ADVERTISEMENT_STS,ADVERT_SHOW_FREQUENCY_STS,ADVERT_CONTENT_TYPE,ADVERT_CONTENT_SIZE');
export default {
  components: { YufpSearchTree, YufpUserSelector },
  data() {
    return {
      formdata: {
        id: '',
      }, // 表单数据
      tableUrl: backend.portalService + '/api/xmhadvertisement/list', // 宣传列表查询地址
      dialogVisible: false, // 弹出框是否展示
      mediaDialogVisible: false, // 媒体弹框是否显示
      viewType: 'ADD', // 弹出框默认新增
      viewTitle: lookup.find('CRUD_TYPE', false), // 弹出框类型
      formDisabled: false, // 表单是否禁用
      treeUrl: backend.appOcaService + '/api/adminsmorg/treequeryauth', // 宣传列表机构树请求 url
      props: {label: 'orgName', children: 'children'},
      formType: 'details',
      adStatusChoose: '0',
      formRules: {
        adTitle: [
          { required: true, message: this.$t('advertManager.btx')},
          { max: 33, message: this.$t('advertManager.srzdgc')}
        ], // 标题校验
        fileAddr: [
          {required: true, message: this.$t('advertManager.btx')},
        ], // 展示内容校验
        contentType: {required: true, message: this.$t('advertManager.btx')}, // 必填项校验
        adSize: {required: true, message: this.$t('advertManager.btx')}, // 必填项校验
        showFrequency: {required: true, message: this.$t('advertManager.btx')}, // 必填项校验
        adRemark: { max: 200, message: this.$t('advertManager.srzdgc')},
        showRange: {required: true, message: this.$t('bannerManager.btx')}
        // dateArea: { validator: this.validateStartTime }
      }, // 表单验证规则
      searchFormdata: {}, // 查询表单数据
      uploadAction: getUploadFileUrl(), // 内容上传地址
      uploadHeader: {Authorization: 'Bearer ' + getAccessToken()},
      fileAddr: '', //宣传内容
      mediaContentType: 0,
      showRangeArr: [], //展示范围机构id数组
      showRangeName: "", //展示范围机构的名字
      status: {},
      showFrequency: {},
      contentType: {},
      adSize: {},
      mediaDialogSize: "",
      fileList: [],
      pickerOptions: {
        disabledDate: function (time) {
          return time.getTime() < Date.now();
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "orgTreeData",
    ])
  },
  watch: {
  },
  created () {
  },
  mounted() {
    this.status = lookup.find('ADVERTISEMENT_STS', false);
    this.showFrequency = lookup.find('ADVERT_SHOW_FREQUENCY_STS', false);
    this.contentType = lookup.find('ADVERT_CONTENT_TYPE', false);
    this.adSize = lookup.find('ADVERT_CONTENT_SIZE', false);
    this.getOrgInfoPage();
  },
  methods: {
    // validateStartTime(rule, value, callback) {
    //   var curTime = new Date();
    //   if (value && new Date(value[0]).getTime() < curTime.getTime()) {
    //     callback(new Error('开始时间不能小于系统当前时间'));
    //   } else {
    //     callback();
    //   }
    // },
    customSearchFn() {
      var params = clone(this.searchFormdata, {});
      params['startDate'] = params['effectDate'] ? params['effectDate'][0] : '';
      params['endDate'] = params['effectDate'] ? params['effectDate'][1] : '';
      delete params['effectDate'];
      this.$refs.advertsTable.remoteData(params);
    },
    customResetFn() {
      this.$refs.searchForm.resetFields();
    },
    remoteTableData(panelRef, tableRef, searFormVmodel) {
      // panel隐藏的时候
      if (this.$refs[panelRef].hide) {
        this.$refs[tableRef].remoteData({keyWord: this.$refs.panel.inputVal})
      } else {
        this.$refs[tableRef].remoteData(this[searFormVmodel])
      }
    },
    remoteData() {
      this.remoteTableData('panel', 'advertsTable', 'searchFormdata')
    },
    /**
     * 快速查询(宣传名称和备注)
     * @param e 模糊查询关键字
     */
    fuzzyQuery(e) {
      var param = {keyWord: e.value};
      this.$refs.advertsTable.remoteData(param);
      this.resetFn(); // 清空精确查询条件
    },
    /**
     * 清空快速查询区域查询条件
     */
    clearFuzzyFn() {
      this.$refs.panel.inputVal = '';
    },
    /**
     * 清空查询条件
     */
    resetFn() {
      this.$refs.searchForm.resetFields();
    },
    /**
     * 关闭弹出框
     */
    cancelFn() {
      this.dialogVisible = false;
      this.showRangeArr = [];
    },
    /**
     * 控制保存按钮、xdialog、表单的状态
     * @param viewType 表单类型
     * @param editable 可编辑,默认false
     */
    switchStatus(viewType, editable) {
      // if (viewType !== 'DETAIL' && this.formdata.showRange) {
      //   this.showRangeArr = this.formdata && this.formdata.showRange.split(",");
      // }
      this.viewType = viewType;
      this.dialogVisible = true;
      this.formType = viewType === 'DETAIL' ? 'details' : 'edit';
      this.formDisabled = !editable;
    },
    /**
     * 更新formData数据信息
     * @param row 当前宣传信息
     * @param isDtl 是否详情
     */
    updateFormDataInfo(row, isDtl) {
      this.$nextTick(() => {
        this.$refs.advertForm.resetFields();
        clone(row, this.formdata);
        this.formdata.showRangeNum = this.getRangeNum(this.formdata.showRange)
        // 将机构id String转成数组展示
        this.showRangeArr = this.formdata.showRange.split(",");
        if (row.effectDate) {
          this.formdata.dateArea = [row.effectDate].concat([row.invalidDate]);
        }
        // 将机构id转换为名称显示
        this.showRangeName = "--"
        this.getOrgInfoPage(orgInfoMap => {
          this.showRangeName = this.showRangeArr.map(orgId => orgInfoMap[orgId] ? orgInfoMap[orgId].orgName : "--").join('/')
        })
        if (this.formdata.fileAddr) {
          this.fileAddr = addTokenInfo(backend.fileService + '/api/file/provider/download?fileId=' + this.formdata.fileAddr);
          var uploadUrl = addTokenInfo(
            backend.fileService + "/api/file/provider/fileUpload"
          );
          var _this = this;
          _this.$request({
            method: "POST",
            url: uploadUrl,
            data: {filePath: this.formdata.fileAddr},
          }).then((data) => {
            if (data.length > 0) {
              var obj = {name: data[0].fileName, url: _this.thumbnailRoute};
              _this.fileList.splice(0, 1, obj);
            }
          });
        } else {
          this.fileAddr = ''
        }
      });
    },
    /**
     * 修改宣传
     * @param row 当前宣传信息
     */
    editFn(row) {
      if (row.status !== 2) {
        this.$message({
          message: this.$t('advertManager.znxzxxztdxc')
        });
        return;
      }
      this.switchStatus('EDIT', true);
      this.updateFormDataInfo(row, false);
    },
    /**
     * 宣传详情
     * @param row 当前宣传信息
     */
    advertDetailFn(row) {
      if (row.status === 1) {
        this.$message({
          message: this.$t('advertManager.gxcysc')
        });
        return;
      }
      this.switchStatus('DETAIL', true);
      this.updateFormDataInfo(row, true);
    },
    /**
     * 新增宣传
     */
    addAdvertFn() {
      this.switchStatus('ADD', true);
      this.$nextTick(() => {
        this.showRangeArr = [];
        this.$refs.advertForm.resetFields();
        this.fileList = []
      });
    },
    /**
     * 保存宣传
     * @param type 1-发布，2-暂存
     */
    saveAdvertFn(type) {
      const _this = this;
      let validate = false;
      // 将机构id数组转成string存储
      this.formdata.showRange = this.showRangeArr.length === 0 ? '' : this.showRangeArr.toString();
      _this.$refs.advertForm.validate(function (valid) {
        validate = valid;
      });
      if (!validate) {
        return;
      }
      this.showRangeArr = [];
      var params = clone(this.formdata, {});
      params['effectDate'] = params['dateArea'] ? params['dateArea'][0] : '';
      params['invalidDate'] = params['dateArea'] ? params['dateArea'][1] : '';
      delete params['dateArea'];
      params.status = type === 1 ? 3 : 2;
      this.saveAdvertRequest(params);
    },
    // 点击列表上线
    doOnline(type, row) {
      var params = clone(row, {});
      params.status = type === 1 ? 3 : 2;
      this.saveAdvertRequest(params);
    },
    saveAdvertRequest(params) {
      const _this = this;
      const url = params.id ? '/api/xmhadvertisement/update' : '/api/xmhadvertisement/save';
      const repeatedUrl = '/api/xmhadvertisement/isrepeated';
      _this.$request({
        method: 'POST',
        url: backend.portalService + repeatedUrl,
        data: params
      }).then(({code, message, data, total}) => {
        _this.noticeMsg = message;
        if (code === '0') {
          _this.$message({
            message: _this.$t('advertManager.sjbccg'),
            type: 'success'
          });
          _this.dialogVisible = false;
          _this.remoteData();
        } else {
          _this.$confirm(message, _this.$t('advertManager.ts'), {
            confirmButtonText: _this.$t('advertManager.qd'),
            cancelButtonText: _this.$t('advertManager.qx'),
            type: 'warning',
            callback(action) {
              if (action === 'confirm') {
                // 发起更改状态请求
                _this.$request({
                  method: 'POST',
                  url: backend.portalService + url,
                  data: params
                }).then(({code, message, data, total}) => {
                  if (code === '0') {
                    _this.$message({
                      message: _this.$t('advertManager.sjbccg'),
                      type: 'success'
                    });
                    _this.dialogVisible = false;
                    _this.remoteData();
                  } else {
                    _this.$message({
                      message: message,
                      type: 'error'
                    });
                  }
                });
              }
            }
          });
        }
      })
    },
    /**
     * 更改宣传状态（发布、下架、删除）
     * @param row 当前宣传信息
     * @param status 未来状态
     */
    chgAdvertStsFn(row, status) {
      if (status === 1 && row.status !== 2) {
        this.$message({
          message: this.$t('advertManager.qxxxdqxczjxsc'),
          type: 'warning'
        });
        return;
      } else if (status === 3 && row.status !== 2) {
        this.$message({
          message: this.$t('advertManager.znxzxxztdxc')
        });
        return;
      } else if (status === 3 && row.status === 3) {
        this.$message({
          message: this.$t('advertManager.gxcysc')
        });
        return;
      }
      var _this = this;
      var chgStsForm = {
        id: row.id,
        status: status
      }
      let ts = '';
      if (status === 1) {
        ts = this.$t('advertManager.scts1');
      } else if (status === 2) {
        chgStsForm.effectDate = row.effectDate;
        chgStsForm.invalidDate = row.invalidDate;
        ts = this.$t('advertManager.xxts1');
      } else if (status === 3) {
        ts = this.$t('advertManager.sxts1');
      }
      this.$confirm(ts + row.adTitle + this.$t('advertManager.ts2'), this.$t('advertManager.ts'), {
        confirmButtonText: this.$t('advertManager.qd'),
        cancelButtonText: this.$t('advertManager.qx'),
        type: 'warning',
        callback(action) {
          if (action === 'confirm') {
            // 发起更改状态请求
            _this.$request({
              method: 'POST',
              url: backend.portalService + '/api/xmhadvertisement/update',
              data: chgStsForm
            }).then(({code, message, data, total}) => {
              if (code === '0') {
                _this.$message({
                  message: _this.$t('advertManager.gxcg'),
                  type: 'success'
                });
                _this.dialogVisible = false;
                _this.remoteData();
              } else {
                _this.$message({
                  message: message,
                  type: 'error'
                });
              }
            });
          }
        }
      });
    },
    /**
     * 上传内容成功
     */
    handleFileSuccess: function (res, file) {
      if (this.$refs.upload.uploadFiles.length > 1) {
        this.$refs.upload.uploadFiles.splice(0, 1);
      }
      this.formdata.fileAddr = res.data;
    },
    // 移除上传文件
    handleRemove() {
      this.fileList = [];
      if (!this.fileList.length) {
        this.formdata.fileAddr = '';
      }
    },
    /**
     * 文件上传之前获取上传校验
     */
    beforeFileUpload: function (file) {
      const _this = this;
      const type = file.type;
      const size = file.size / 1024 / 1024;
      if (type !== 'image/jpeg' && type !== 'image/png' && type !== 'image/jpg' && type !== 'video/mp4') {
        this.$message.error(this.$t('advertManager.nrgsyq'));
        return false;
      }
      if (this.formdata.contentType === 1 && type === 'video/mp4') {
        this.$message.error(this.$t('advertManager.nrbpp'));
        return false;
      }
      if (this.formdata.contentType === 2 && type !== 'video/mp4') {
        this.$message.error(this.$t('advertManager.nrbpp'));
        return false;
      }
      if (size > 50) {
        this.$message.error(this.$t('advertManager.nrdxyq'));
        return false;
      }
    },
    /**
     * 按钮快捷查询
     * adStatusChoose 查询状态种类，0-全部，2-草稿，3-已发布
     */
    searchTableFn() {
      const type = this.adStatusChoose;
      let searchStatus = {};
      if (type !== "0") {
        searchStatus = {status: type}
      }
      this.$refs.advertsTable.remoteData(searchStatus);
    },
    /**
     * 下载文件内容
     * @param row 宣传信息
     * @returns {string} 返回文件下载地址
     */
    getDownloadFile(row) {
      return getFileUrl(row.fileAddr);
    },
    /**
     * 打开宣传媒体预览
     * @param row 宣传信息
     */
    preview(row) {
      if (row.status === 1) {
        this.$message({
          message: this.$t('advertManager.gxcysc')
        });
        return;
      }
      this.mediaContentType = row.contentType;
      this.fileAddr = this.getDownloadFile(row);
      this.mediaDialogSize = ['tiny', 'small', 'large', 'full'][row.adSize - 1]
      this.$nextTick(() => {
        this.mediaDialogVisible = true;
      })
    },
    /**
     * 清空数据 关闭视频播放
     */
    closeMediaDialog() {
      this.mediaContentType = 0;
      this.fileAddr = "";
    },
    // 关闭弹窗
    closeDialog() {
      this.$refs.advertForm.resetFields();
      // this.fileList = [];
    },
    // 获取展示范围个数
    getRangeNum(showRange) {
      if(showRange === '1') return ''
      return `(${showRange.split(',').length})`
    },
    // 获取所有的机构信息，存储成map
    getOrgInfoPage(cb) {
      console.log(cb, '所属机构问题')
      if (this.orgInfoMap && cb) {
        cb(this.orgInfoMap);
        return;
      }
      this.$request({
        url: this.$backend.appOcaService + "/api/adminsmorg/querypage",
        data: {
          "page": 1,
          "size": 9999
        }
      }).then(({code, message, data}) => {
        if (code === "0") {
          this.orgInfoMap = data.reduce((o, item) => {
            o[item.orgId] = item;
            return o
          }, {})
          if(cb) {
            cb(this.orgInfoMap);
          }
        } else {
          this.$message.error(message)
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.compact .dialog-btn{
  margin-bottom: 16px;
}
.yu-base-panel-right-content .el-button-group {
  margin-top: -10px;
}
.dialog-advertisement .el-image {
  width: 100%;
  padding-bottom: 10px;
}
::v-deep .el-dialog-x--full {
  transform: translate(0, 0);
}
</style>

<style>
.display-range-item .el-form-item__content > div {
  display: flex;
}
.display-range {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.display-range-num {
  color: #2877FF;
}
</style>
