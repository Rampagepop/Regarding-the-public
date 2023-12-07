<!--
  @created by liusy16@yusys.com.cn 2022-05-09
  @updated by
  @description 横幅管理
-->
<template>
  <div id="bannerManager">
    <yu-panel ref="panel" clearable :title="$t('bannerManager.hfgl')" class="adjust-height" show-search-input :placeholder="$t('bannerManager.gjz')" @search="fuzzyQuery">
      <!--横幅列表操作按钮-->
      <template slot="right">
        <yu-toolBar>
          <yu-button v-if="checkCtrl('add')" @click="addBannerFn" style="margin-right: 10px;">{{ $t('bannerManager.xz') }}</yu-button>
          <yu-radio-group class="btn-group" @change="searchTableFn" v-model="bannerStatusChoose" v-if="$refs.panel && $refs.panel.hide">
            <yu-radio-button label="0">{{ $t('bannerManager.qb') }}</yu-radio-button>
            <yu-radio-button label="3">{{ $t('bannerManager.sx') }}</yu-radio-button>
            <yu-radio-button label="2">{{ $t('bannerManager.xx') }}</yu-radio-button>
          </yu-radio-group>
        </yu-toolBar>
      </template>
      <!--横幅列表高级查询-->
      <template slot="filter">
        <yu-xform ref="searchForm" related-table-name="bannersTable" v-model="searchFormdata" form-type="search" @form-search="clearFuzzyFn" :custom-search-fn="customSearchFn" :custom-reset-fn="customResetFn">
          <yu-xform-group :column="4">
            <yu-xform-item :label="$t('bannerManager.hfzt')" name="bannerTitle" :placeholder="$t('bannerManager.qsr')"></yu-xform-item>
            <yu-xform-item :label="$t('bannerManager.sxsj')" name="issuDate" ctype="custom">
              <yu-date-picker v-model="searchFormdata.issuDate" time-arrow-control type="datetimerange" :placeholder="$t('bannerManager.xzsxsj')" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></yu-date-picker>
            </yu-xform-item>
            <!-- <yu-xform-item :label="$t('bannerManager.bz')" name="bannerRemark" :placeholder="$t('bannerManager.qsr')"></yu-xform-item> -->
            <yu-xform-item :label="$t('bannerManager.zt')" name="status" :placeholder="$t('bannerManager.qxz')" ctype="select" data-code="BANNER_STS"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <!--横幅列表-->
      <yu-xtable ref="bannersTable" row-number :data-url="tableUrl">
        <yu-xtable-column :label="$t('bannerManager.slt')" width="485">
          <template slot-scope="scope">
            <el-image class="image-size" :src="getDownloadImg(scope.row)"></el-image>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('bannerManager.hfzt')" prop="bannerTitle">
          <template slot-scope="scope">
            <a class="underline" @click="bannerDetailFn(scope.row)">{{ scope.row.bannerTitle }}</a>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('bannerManager.zt')" width="126">
          <template slot-scope="scope">
            <yu-tag v-if="scope.row.status=== 3" type="success">{{ status[scope.row.status] }}</yu-tag>
            <yu-tag v-if="scope.row.status=== 1" type="danger">{{ status[scope.row.status] }}</yu-tag>
            <yu-tag v-if="scope.row.status=== 2" type="gray">{{ status[scope.row.status] }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('bannerManager.sxsj')" width="218">
          <template slot-scope="scope" width="260">
            <span v-if="scope.row.issuDate!=null">{{ scope.row.issuDate }}</span>
            <span v-else> - </span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('bannerManager.bz')">
          <template slot-scope="scope" v-if="scope.row.bannerRemark">
            <span>{{ scope.row.bannerRemark }}</span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column fixed="right" :label="$t('component.operate')" width="160">
          <template slot-scope="scope">
            <yu-button-drop set-index="0" :show-length="3" type="text">
              <yu-button v-if="checkCtrl('edit')" :disabled="scope.row.status !== 2" :style="{color: scope.row.status !== 2 ? '#e4e8f1': ''}" @click="editFn(scope.row)" type="text">{{ $t('bannerManager.bj') }}</yu-button>
              <yu-button v-if="checkCtrl('release') && scope.row.status !== 3" v-norepeat.disabled @click="chgBannerStsFn(scope.row, 3)" type="text">{{ $t('bannerManager.sx') }}</yu-button>
              <yu-button v-if="checkCtrl('draft') && scope.row.status !== 2" v-norepeat.disabled @click="chgBannerStsFn(scope.row, 2)" type="text">{{ $t('bannerManager.xx') }}</yu-button>
              <yu-button v-if="checkCtrl('delete')" v-norepeat.disabled @click="chgBannerStsFn(scope.row, 1)" type="text">{{ $t('bannerManager.sc') }}</yu-button>
            </yu-button-drop>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <!--横幅 新增 修改 详情-->
    <yu-xdialog :title="viewTitle[viewType]" :visible.sync="dialogVisible" width="640px" @close="closeDialog">
      <yu-xform ref="bannerForm" v-model="formdata" :form-type="formType" label-width="100px" :rules="formRules">
        <yu-xform-group :column="1">
          <yu-xform-item :label="$t('bannerManager.hfzt')" name="bannerTitle" :placeholder="$t('bannerManager.qsr')"></yu-xform-item>
          <yu-xform-item class="display-range-item" :label="$t('bannerManager.zsfw')" name="showRange" ctype="custom">
            <!-- 选展示范围（机构) -->
            <yu-combo-tree v-if="viewType !== 'DETAIL'" v-model="showRangeArr" :multiple="true" :placeholder="$t('bannerManager.mrqb')" :data-url="treeUrl" data-id="orgId" data-label="orgName" data-pid="upOrgId" :clearable="true"></yu-combo-tree>
            <span v-if="viewType === 'DETAIL'" class="display-range" :title="formdata.showRangeName">{{ formdata.showRangeName }}</span><span v-if="viewType === 'DETAIL'" class="display-range-num">{{ formdata.showRangeNum }}</span>
          </yu-xform-item>
          <yu-xform-item :label="$t('bannerManager.nr')" name="imgUrl" ctype="custom">
            <!-- <yu-upload v-if="viewType !== 'DETAIL'" class="upload-c" :file-list="fileList" :action="uploadAction" :headers="uploadHeader" :on-success="handleImageSuccess" :before-upload="beforeImageUpload" :limit="1">
              <div class="upload-container">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">{{ $t('bannerManager.scyq') }}</div>
              </div>
            </yu-upload> -->

            <yu-upload v-if="viewType !== 'DETAIL'" class="upload-c" drag :action="uploadAction" :headers="uploadHeader"
                       :file-list="fileList"
                       :show-file-list="true" :on-success="handleImageSuccess" :before-upload="beforeImageUpload"
                       :on-remove="handleRemove">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">{{ $t('bannerManager.scyq') }}</div>
              <!--<div v-if="fileList.length > 0" class="el-upload__tip" slot="tip">{{ $t('cardManager.znscyztp') }}</div>-->
            </yu-upload>
            <img class="image-size-form" v-else :src="imgUrl" alt="">
          </yu-xform-item>
          <!-- <yu-xform-item :label="$t('bannerManager.tzlj')" name="url" :placeholder="$t('bannerManager.qsr')"></yu-xform-item>-->
          <yu-xform-item :label="$t('bannerManager.dssx')" name="issuDate" ctype="custom">
            <yu-date-picker v-if="viewType !== 'DETAIL'" :default-value="new Date()" v-model="formdata.issuDate" time-arrow-control type="datetime" :placeholder="$t('bannerManager.xzsxsj')" value-format="yyyy-MM-dd HH:mm:ss"></yu-date-picker>
            <span v-else> {{ formdata.issuDate }} </span>
          </yu-xform-item>
          <yu-xform-item :label="$t('bannerManager.bz')" ctype="textarea" name="bannerRemark" :placeholder="$t('bannerManager.qsr')"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" class="yu-grpButton">
        <yu-button v-if="checkCtrl('release')&& formType==='edit' && !issuDateFlag" type="primary" @click="saveBannerFn(1)">{{ $t('bannerManager.sx') }}</yu-button>
        <yu-button v-if="checkCtrl('edit')&& viewType === 'DETAIL'&& !issuDateFlag && formdata.status === 2" type="primary" @click="chgBannerStsFn(formdata, 3)">{{ $t('bannerManager.sx') }}</yu-button>
        <yu-button v-if="checkCtrl('tempsave')&& formType==='edit'" @click="saveBannerFn(2)">{{ $t('bannerManager.zc') }}</yu-button>
        <yu-button v-if="checkCtrl('edit')&& viewType === 'DETAIL' && formdata.status === 2" @click="switchStatus('EDIT', true)">{{ $t('bannerManager.bj') }}</yu-button>
        <yu-button v-if="checkCtrl('draft')&& viewType === 'DETAIL' && formdata.status === 3" @click="chgBannerStsFn(formdata, 2)">{{ $t('bannerManager.xx') }}</yu-button>
        <yu-button v-if="checkCtrl('delete')&& viewType === 'DETAIL' && formdata.status === 2" @click="chgBannerStsFn(formdata, 1)">{{ $t('bannerManager.sc') }}</yu-button>
        <!-- <yu-button v-if="formType === 'details'" @click="cancelFn">{{ $t('bannerManager.fh') }}</yu-button> -->
        <yu-button @click="cancelFn">{{ $t('bannerManager.qx') }}</yu-button>
      </div>
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

lookup.reg('BANNER_STS');
export default {
  components: { YufpSearchTree, YufpUserSelector },
  data() {
    return {
      formdata: {
        id: '',
      }, // 表单数据
      tableUrl: backend.portalService + '/api/xmhbanner/list', // 横幅列表查询地址
      dialogVisible: false, // 弹出框是否展示
      viewType: 'ADD', // 弹出框默认新增
      viewTitle: lookup.find('CRUD_TYPE', false), // 弹出框类型
      formDisabled: false, // 表单是否禁用
      treeUrl: backend.appOcaService + '/api/adminsmorg/treequeryauth', // 横幅列表机构树请求 url
      props: {label: 'orgName', children: 'children'},
      formType: 'details',
      formRules: {
        bannerTitle: [
          { required: true, message: this.$t('bannerManager.btx')},
          { max: 33, message: this.$t('bannerManager.srzdgc')}
        ], // 横幅标题校验
        imgUrl: {required: true, message: this.$t('bannerManager.btx')}, // 必填项校验
        bannerRemark: { max: 200, message: this.$t('bannerManager.srzdgc')},
        showRange: {required: true, message: this.$t('bannerManager.btx')}
      }, // 表单验证规则
      searchFormdata: {}, // 查询表单数据
      status: {},
      uploadAction: getUploadFileUrl(), // 内容上传地址
      fileList: [], // 上传图片列表
      uploadHeader: {Authorization: 'Bearer ' + getAccessToken()},
      imgUrl: '', //横幅内容
      showRangeArr: [], //展示范围机构id数组
      bannerStatusChoose: '0',
    };
  },
  computed: {
    ...mapGetters([
      "orgTreeData",
    ]),
    // 是否为定时
    issuDateFlag() {
      return Boolean(this.formdata.issuDate);
    }
  },
  watch: {

  },
  created () {
  },
  mounted() {
    this.status = lookup.find('BANNER_STS', false);
  },
  methods: {
    customSearchFn() {
      var params = clone(this.searchFormdata, {});
      params['startDate'] = params['issuDate'] ? params['issuDate'][0] : '';
      params['endDate'] = params['issuDate'] ? params['issuDate'][1] : '';
      delete params['issuDate'];
      this.$refs.bannersTable.remoteData(params);
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
      this.remoteTableData('panel', 'bannersTable', 'searchFormdata')
    },
    /**
     * 快速查询(横幅名称和备注)
     * @param e 模糊查询关键字
     */
    fuzzyQuery(e) {
      var param = {keyWord: e.value};
      this.$refs.bannersTable.remoteData(param);
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
      this.fileList = [];
    },
    /**
     * 控制保存按钮、xdialog、表单的状态
     * @param viewType 表单类型
     * @param editable 可编辑,默认false
     */
    switchStatus(viewType, editable) {
      // if (viewType !== 'DETAIL' && this.formdata.showRange) {
      //   this.showRangeArr = this.formdata.showRange.split(",");
      // }
      this.viewType = viewType;
      this.dialogVisible = true;
      this.formType = viewType === 'DETAIL' ? 'details' : 'edit';
      this.formDisabled = !editable;
    },
    /**
     * 编辑，处理formdata信息及fileList
     * @param row 当前横幅信息
     */
    updateBannerFormInfo(row) {
      this.$nextTick(function () {
        this.$refs.bannerForm.resetFields();
        clone(row, this.formdata);
        this.fileList = [];
        this.formdata.showRangeNum = this.getRangeNum(this.formdata.showRange)
        // 将机构id String转成数组展示
        this.showRangeArr = this.formdata.showRange.split(",");
        if (this.formdata.imgUrl) {
          this.imgUrl = addTokenInfo(backend.fileService + '/api/file/provider/download?fileId=' + this.formdata.imgUrl);
          var uploadUrl = addTokenInfo(
            backend.fileService + "/api/file/provider/fileUpload"
          );
          var _this = this;
          _this.$request({
            method: "POST",
            url: uploadUrl,
            data: {filePath: this.formdata.imgUrl},
          }).then((data) => {
            if (data.length > 0) {
              var obj = {name: data[0].fileName, url: _this.thumbnailRoute};
              _this.fileList.splice(0, 1, obj);
            }
          });
        } else {
          this.imgUrl = ''
        }
      });
    },
    /**
     * 修改横幅
     * @param row 当前横幅信息
     */
    editFn(row) {
      if (row.status !== 2) {
        this.$message({
          message: this.$t('bannerManager.znxzxxztdhf')
        });
        return;
      }
      this.switchStatus('EDIT', true);
      this.updateBannerFormInfo(row);
    },
    /**
     * 横幅详情
     * @param row 当前横幅信息
     */
    bannerDetailFn(row) {
      if (row.status === 1) {
        this.$message({
          message: this.$t('bannerManager.ghfysc')
        });
        return;
      }
      this.switchStatus('DETAIL', true);
      this.updateBannerFormInfo(row);
    },
    /**
     * 新增横幅
     */
    addBannerFn() {
      this.switchStatus('ADD', true);
      this.$nextTick(() => {
        this.showRangeArr = [];
        this.$refs.bannerForm.resetFields();
      });
    },
    /**
     * 保存横幅
     * @param type 1-发布，2-暂存
     */
    saveBannerFn(type) {
      const _this = this;
      let validate = false;
      this.formdata.showRange = this.showRangeArr.length === 0 ? '' : this.showRangeArr.toString();
      _this.$refs.bannerForm.validate(function (valid) {
        validate = valid;
      });
      if (!validate) {
        return;
      }
      const url = _this.formdata.id ? '/api/xmhbanner/update' : '/api/xmhbanner/save';
      // 将机构id数组转成string存储
      this.showRangeArr = [];
      this.formdata.status = type === 1 ? 3 : 2;
      _this.$request({
        method: 'POST',
        url: backend.portalService + url,
        data: _this.formdata
      }).then(({code, message, data, total}) => {
        if (code === '0') {
          _this.$message({
            message: _this.$t('bannerManager.sjzccg'),
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
    },
    /**
     * 更改横幅状态（上线、下线、删除）
     * @param row 当前横幅信息
     * @param status 未来状态
     */
    chgBannerStsFn(row, status) {
      if (status === 1 && row.status !== 2) {
        this.$message({
          message: this.$t('bannerManager.qxxxdqhfzjxsc'),
          type: 'warning'
        });
        return;
      } else if (status === 3 && row.status !== 2) {
        this.$message({
          message: this.$t('bannerManager.znxzxxztdhf')
        });
        return;
      } else if (status === 3 && row.status === 3) {
        this.$message({
          message: this.$t('bannerManager.ghfysc')
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
        ts = this.$t('bannerManager.scts1');
      } else if (status === 2) {
        chgStsForm.issuDate = row.issuDate;
        ts = this.$t('bannerManager.xxts1');
      } else if (status === 3) {
        ts = this.$t('bannerManager.sxts1');
      }
      this.$confirm(ts + row.bannerTitle + this.$t('bannerManager.ts2'), this.$t('bannerManager.ts'), {
        confirmButtonText: this.$t('bannerManager.qd'),
        cancelButtonText: this.$t('bannerManager.qx'),
        type: 'warning',
        callback(action) {
          if (action === 'confirm') {
            // 发起更改状态请求
            _this.$request({
              method: 'POST',
              url: backend.portalService + '/api/xmhbanner/update',
              data: chgStsForm
            }).then(({code, message, data, total}) => {
              if (code === '0') {
                _this.$message({
                  message: _this.$t('bannerManager.gxcg'),
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
    handleImageSuccess: function (res, file, fileList) {
      this.fileList = fileList;
      if(fileList.length > 1) {
        fileList.splice(0, 1);
        this.fileList = fileList;
      }
      this.formdata.imgUrl = res.data;
    },
    // 移除上传文件
    handleRemove() {
      this.fileList = [];
      if (!this.fileList.length) {
        this.formdata.imgUrl = ''
      }
    },
    /**
     * 文件上传之前获取上传校验
     */
    beforeImageUpload: function (file) {
      const _this = this;
      const type = file.type;
      const size = file.size / 1024 / 1024;
      const fileName = file.name;
      const typeErr = type !== 'image/jpeg' && type !== 'image/png' && type !== 'image/jpg';
      const fileNameTooLangFlag = fileName.length >= 100;
      const sizeErr = size > 50;
      if (typeErr) {
        this.$message.error(this.$t('bannerManager.schftpznsgs'));
        return false;
      }
      if (sizeErr) {
        this.$message.error(this.$t('bannerManager.schftpdxbncg'));
        return false;
      }
      if (fileNameTooLangFlag) {
        this.$message.error(this.$t('bannerManager.schftpmccdbncg'));
        return false;
      }
      return !typeErr && !sizeErr && !fileNameTooLangFlag;
    },
    /**
     * 按钮快捷查询
     * bannerStatusChoose 查询状态种类，0-全部，2-草稿，3-已发布
     */
    searchTableFn() {
      const type = this.bannerStatusChoose;
      let searchStatus = {};
      if (type !== "0") {
        searchStatus = {status: type}
      }
      this.$refs.bannersTable.remoteData(searchStatus);
    },
    /**
     * 下载图片内容
     * @param row 横幅信息
     * @returns {string} 返回图片下载地址
     */
    getDownloadImg(row) {
      return getFileUrl(row.imgUrl);
    },
    // 关闭弹窗
    closeDialog() {
      this.$refs.bannerForm.resetFields();
      this.fileList = [];
    },
    // 获取展示范围个数
    getRangeNum(showRange) {
      if(showRange === '1') return ''
      return `(${showRange.split(',').length})`
    }
  }
}
</script>
<style scoped>
.image-size {
  width: 460px;
  height: 48px;
}
.image-size-form {
  width: 100%;
  height: 80px;
}
.compact .dialog-btn{
  margin-bottom: 16px;
}
.yu-base-panel-right-content .el-button-group {
  margin-top: -10px;
}
/* .upload-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 80px;
  background-color: #f2f2f2;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 14px;
  color: #c5c5c5;
}
.upload-container i {
  font-size: 24px;
  color: #aaa;
} */
</style>
<style>
.upload-c .el-upload,
.upload-c .el-upload .el-upload-dragger {
  width: 100%;
}
</style>
