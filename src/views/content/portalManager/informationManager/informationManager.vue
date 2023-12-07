<!--
  @created by liusy16@yusys.com.cn 2022-05-26
  @updated by
  @description 资讯管理
-->
<template>
  <div id="informationManager">
    <yu-panel ref="panel" clearable :title="$t('informationManager.zxgl')" class="adjust-height" show-search-input
              :placeholder="$t('informationManager.gjz')" @search="fuzzyQuery">
      <!--资讯列表操作按钮-->
      <template slot="right">
        <yu-toolBar>
          <yu-button v-if="checkCtrl('add')" @click="addInfoFn" style="margin-right: 10px;">{{
            $t('informationManager.xz') }}</yu-button>
          <yu-radio-group @change="searchTableFn" v-model="infoStatusChoose" v-if="$refs.panel && $refs.panel.hide">
            <yu-radio-button label="0">{{ $t('informationManager.qb') }}</yu-radio-button>
            <yu-radio-button label="3">{{ $t('informationManager.sx') }}</yu-radio-button>
            <yu-radio-button label="2">{{ $t('informationManager.xx') }}</yu-radio-button>
          </yu-radio-group>
        </yu-toolBar>
      </template>
      <!--资讯列表高级查询-->
      <template slot="filter">
        <yu-xform ref="searchForm" related-table-name="infosTable" v-model="searchFormdata" form-type="search"
                  @form-search="clearFuzzyFn" :custom-search-fn="customSearchFn">
          <yu-xform-group :column="4">
            <yu-xform-item :label="$t('informationManager.zxbt')" name="infTitle"
                           :placeholder="$t('informationManager.qsr')"></yu-xform-item>
            <yu-xform-item :label="$t('informationManager.zt')" name="status"
                           :placeholder="$t('informationManager.qxz')" ctype="select" data-code="INFORMATION_STS"></yu-xform-item>
            <yu-xform-item :label="$t('informationManager.lx')" name="infType"
                           :placeholder="$t('informationManager.qxz')" ctype="select" data-code="INFORMATION_TYPE"></yu-xform-item>
            <yu-xform-item :label="$t('informationManager.sxsj')" name="releaseDate" ctype="custom">
              <yu-date-picker v-model="searchFormdata.releaseDate" time-arrow-control type="datetimerange"
                              :default-time="['00:00:00', '23:59:59']" :placeholder="$t('informationManager.xzsxsj')"
                              value-format="yyyy-MM-dd HH:mm:ss"></yu-date-picker>
            </yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <!--资讯列表-->
      <yu-xtable ref="infosTable" :data-url="tableUrl">
        <yu-xtable-column :label="$t('informationManager.xh')" type="index" width="60px"></yu-xtable-column>
        <yu-xtable-column :label="$t('informationManager.zd')" width="60px">
          <template slot-scope="scope">
            <yu-tag v-if="scope.row.remindedNow === 1" type="warning">{{ $t('informationManager.zd') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('informationManager.zxbt')" prop="infTitle">
          <template slot-scope="scope">
            <a class="underline" @click="infDetailFn(scope.row)">{{ scope.row.infTitle }}</a>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('informationManager.lx')" width="80px">
          <template slot-scope="scope">
            <span>{{ infType[scope.row.infType] }}</span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('informationManager.sxsj')" width="180px">
          <template slot-scope="scope">
            <span v-if="scope.row.releaseDate == null"> -- </span>
            <span v-else>{{ scope.row.releaseDate }}</span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('informationManager.zdqz')" width="180px">
          <template slot-scope="scope">
            <span v-if="scope.row.remindEndDate!=null">{{ scope.row.remindEndDate }}</span>
            <span v-else> -- </span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('informationManager.zt')" width="80px">
          <template slot-scope="scope">
            <yu-tag v-if="scope.row.status=== 3" type="success">{{ status[scope.row.status] }}</yu-tag>
            <yu-tag v-if="scope.row.status=== 1" type="danger">{{ status[scope.row.status] }}</yu-tag>
            <yu-tag v-if="scope.row.status=== 2" type="gray">{{ status[scope.row.status] }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('informationManager.zy')" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.important === 1" style="color: red;">{{ $t('informationManager.s') }}</span>
            <span v-else>{{ $t('informationManager.f') }}</span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('informationManager.llcs')" width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.readTotalNum }}</span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column fixed="right" :label="$t('component.operate')" width="180px">
          <template slot-scope="scope">
            <yu-button-drop set-index="0" :show-length="3" type="text">
              <yu-button v-if="checkCtrl('edit')" :disabled="scope.row.status !== 2"
                         :style="{color: scope.row.status !== 2 ? '#e4e8f1': ''}" @click="editFn(scope.row)" type="text">{{
                           $t('informationManager.bj') }}</yu-button>
              <yu-button v-if="checkCtrl('release') && scope.row.status !== 3" v-norepeat.disabled
                         @click="chgInfStsFn(scope.row, 3)" type="text">{{ $t('informationManager.sx') }}</yu-button>
              <yu-button v-if="checkCtrl('draft') && scope.row.status !== 2" v-norepeat.disabled
                         @click="chgInfStsFn(scope.row, 2)" type="text">{{ $t('informationManager.xx') }}</yu-button>
              <yu-button v-if="checkCtrl('delete')" v-norepeat.disabled @click="chgInfStsFn(scope.row, 1)" type="text">
                {{ $t('informationManager.sc') }}</yu-button>
            </yu-button-drop>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <!-- 资讯 新增 修改 详情 -->
    <yu-xdialog :title="viewTitle[viewType]" :visible.sync="dialogVisible" size="large" width="960px"
                @close="closeDialog">
      <yu-xform ref="infForm" v-model="formdata" :form-type="formType" label-width="100px" :rules="formRules">
        <yu-xform-group :column="2">
          <!-- 类型 -->
          <yu-xform-item :label="$t('informationManager.lx')" name="infType" ctype="select"
                         :placeholder="$t('informationManager.qxz')" data-code="INFORMATION_TYPE"></yu-xform-item>
          <!-- 重要 -->
          <yu-xform-item :label="$t('informationManager.zy')" name="important" ctype="custom">
            <yu-switch v-if="viewType !== 'DETAIL'" :on-value="1" :off-value="0" v-model="formdata.important"
                       :on-text="$t('informationManager.s')" :off-text="$t('informationManager.f')" text-inside></yu-switch>
            <span v-else>{{ formdata.important === 1 ? '是' : '否' }}</span>
          </yu-xform-item>
          <!-- 选展示范围（机构) -->
          <yu-xform-item class="display-range-item" :label="$t('informationManager.zsfw')" name="visibleRange"
                         ctype="custom">
            <yu-combo-tree v-if="viewType !== 'DETAIL'" v-model="visibleRangeArr" :multiple="true"
                           :placeholder="$t('informationManager.mrqb')" :data-url="treeUrl" data-id="orgId" data-label="orgName"
                           data-pid="upOrgId" :clearable="true"></yu-combo-tree>
            <span v-if="viewType === 'DETAIL'" class="display-range" :title="visibleRangeName">{{
              visibleRangeName }}</span><span v-if="viewType === 'DETAIL'" class="display-range-num">{{
              formdata.showRangeNum }}</span>
          </yu-xform-item>
          <!-- 置顶 -->
          <yu-xform-item colspan="4" :label="$t('informationManager.zd')" name="reminded" ctype="custom">
            <yu-switch v-if="viewType !== 'DETAIL'" :on-value="1" :off-value="0" v-model="formdata.reminded"
                       :on-text="$t('informationManager.s')" :off-text="$t('informationManager.f')" text-inside></yu-switch>
            <span v-else>{{ formdata.reminded === 1 ? '是' : '否' }}</span>
          </yu-xform-item>
          <yu-xform-item class="remindEndDate" :label="viewType === 'DETAIL' ? $t('informationManager.zdqz') : ''"
                         colspan="8" name="remindEndDate" ctype="custom" :hidden="formdata.reminded !== 1">
            <yu-date-picker :details="viewType === 'DETAIL'" v-if="formdata.reminded === 1" :default-value="new Date()"
                            v-model="formdata.remindEndDate" time-arrow-control type="datetime"
                            :placeholder="$t('informationManager.zdqz')" value-format="yyyy-MM-dd HH:mm:ss"></yu-date-picker>
          </yu-xform-item>
          <!-- 标题 -->
          <yu-xform-item colspan="24"
                         :label="formdata.infType === 2 ? $t('informationManager.zxbt') : $t('informationManager.ggbt')"
                         name="infTitle" :placeholder="$t('informationManager.qsr')"></yu-xform-item>
          <!-- 富文本 -->
          <yu-xform-item colspan="24"
                         :label="formdata.infType === 2 ? $t('informationManager.zxnr') : $t('informationManager.ggnr')"
                         name="infContent" ctype="custom">
            <yu-tinymce :height="400" v-show="viewType !== 'DETAIL'" ref="tinymce" v-model="formdata.infContent"
                        :id="tinymceId" :min-length="tinymceMin" :max-length="tinymceMax" @count-valid="countValid"
                        menubar="format"></yu-tinymce>
            <span class="tinymceDetails" v-show="viewType === 'DETAIL'" v-html="formdata.infContent"></span>
          </yu-xform-item>
          <yu-xform-item colspan="24" :label="$t('notice.fj')" ctype="custom" name="fileId">
            <yu-upload class="upload-c" v-if="viewType !== 'DETAIL'" drag :action="uploadAction" :headers="uploadHeader"
                       :file-list="fileList" muitiple :show-file-list="true"
                       :on-success="handleImageSuccess"
                       :before-upload="beforeImageUpload" :on-remove="handleRemove">
              <em class="el-icon-upload"></em>
              <div class="el-upload__text">{{ $t('informationManager.wjyq') }}</div>
            </yu-upload>
            <div v-if="viewType === 'DETAIL' && fileDtlInfos.length">
              <p :key="index" style="color:#2877ff;" v-for="(item, index) in fileDtlInfos">
                <svg-icon :icon-class="getFileExtClass(item)" class="pdf-icon" />
                <a @click="downloadFile(item)" style="color:#2877ff;">{{ item.fileName }}</a>
              </p>
            </div>
            <div v-if="viewType === 'DETAIL' && !fileDtlInfos.length">无</div>
          </yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" class="yu-grpButton">
        <yu-button v-if="checkCtrl('release')&& formType==='edit'" type="primary" @click="saveInfFn(1)">{{
          $t('informationManager.sx') }}</yu-button>
        <yu-button v-if="checkCtrl('release')&& viewType === 'DETAIL' && formdata.status === 2" type="primary"
                   @click="saveInfFn(1)">{{ $t('informationManager.sx') }}</yu-button>
        <yu-button v-if="checkCtrl('tempsave')&& formType==='edit'" @click="saveInfFn(2)">{{ $t('informationManager.zc')
        }}</yu-button>
        <yu-button v-if="checkCtrl('edit')&& viewType === 'DETAIL' && formdata.status === 2"
                   @click="editFn(curtRow)">{{ $t('informationManager.bj') }}</yu-button>
        <yu-button v-if="checkCtrl('draft')&& viewType === 'DETAIL' && formdata.status === 3" type="primary"
                   @click="chgInfStsFn(formdata, 2)">{{ $t('informationManager.xx') }}</yu-button>
        <yu-button v-if="checkCtrl('delete')&& viewType === 'DETAIL'&& formdata.status === 2"
                   @click="chgInfStsFn(formdata, 1)">{{ $t('informationManager.sc') }}</yu-button>
        <yu-button @click="cancelFn">{{ $t('informationManager.qx') }}</yu-button>
      </div>
    </yu-xdialog>
  </div>
</template>
<script>
import { clone, extend, lookup } from '@/utils'
import YufpSearchTree from "@/components/widgets/YufpSearchTree";
import YufpUserSelector from "@/components/widgets/YufpUserSelector";
import { mapGetters } from "vuex"
import YuTinymce from '@/components/widgets/YuTinymce';
import YuSingleUpload from "@/components/widgets/YuSingleUpload";
import { download, getFileUrl, getUploadFileUrl } from "@/utils/util";
import { getAccessToken } from "@/utils/oauth";
// 注：详情时，需要复用富文本的样式
import 'static/tinymce/skins/ui/oxide/content.min.css'

lookup.reg('INFORMATION_STS,INFORMATION_TYPE');
export default {
  components: { YufpSearchTree, YufpUserSelector, YuTinymce, YuSingleUpload },
  data() {
    return {
      formdata: {
        id: '',
        important: 0,
        reminded: 0,
        fileId:''
      }, // 表单数据
      tableUrl: backend.portalService + '/api/xmhinformation/list', // 资讯列表查询地址
      dialogVisible: false, // 弹出框是否展示
      viewType: 'ADD', // 弹出框默认新增
      viewTitle: lookup.find('CRUD_TYPE', false), // 弹出框类型
      formDisabled: false, // 表单是否禁用
      treeUrl: backend.appOcaService + '/api/adminsmorg/treequeryauth', // 资讯列表机构树请求 url
      props: { label: 'orgName', children: 'children' },
      formType: 'details',
      curtRow: null,
      infoStatusChoose: '0',
      formRules: {
        infTitle: [
          { required: true, message: this.$t('informationManager.btx') },
          { max: 50, message: this.$t('informationManager.srzdgc') }
        ], // 标题校验
        infType: { required: true, message: this.$t('informationManager.btx') }, // 必填项校验
        infContent: [
          { required: true, message: this.$t('informationManager.btx') },
          {
            validator: (_rule, value, callback) => {
              // 正则去掉富文本信息，和Tinymce保持一致
              if (value && 5000 < value.replace(/<[^>]*>|<\/[^>]*>/gm, "").replace(/(?:&nbsp;)|[ ]|[\r\n]/g, " ").length) {
                callback(new Error(this.$t('informationManager.srzdgc')));
              } else {
                callback();
              }
            }
          }
        ], // 必填项校验
        remindEndDate: { required: true, message: this.$t('informationManager.btx') },
        visibleRange: { required: true, message: this.$t('bannerManager.btx') }
      }, // 表单验证规则
      searchFormdata: {}, // 查询表单数据
      visibleRangeArr: [], //展示范围机构id数组
      visibleRangeName: "", //展示范围机构id得到的名称
      status: {},
      infType: {},
      tinymceId: 'Tinymce_' + Date.now(),
      tinymceMax: 5000, // 富文本限制的最大字符串
      tinymceMin: 10, // 富文本限制的最小字符串
      // infContentStr: "",
      uploadAction: getUploadFileUrl(), // 内容上传地址
      uploadHeader: { Authorization: "Bearer " + getAccessToken() },
      fileListInfo: [],
      loadFileNum: 0, // 正在现在的文件数量
      fileList: [],
      fileId: '', // 缩略图
      fileDtlInfos: []
    };
  },
  computed: {
    ...mapGetters([
      "orgTreeData",
    ])
  },
  watch: {
  },
  mounted() {
    this.status = lookup.find('INFORMATION_STS', false);
    this.infType = lookup.find('INFORMATION_TYPE', false);
    this.fileListInfo = [];
  },
  methods: {
    // 下载附件
    downloadFile(item) {
      download(getFileUrl(item.filePath)); // fixed: 文件下载报错
    },
    // 根据文件类型获取对应的图标
    getFileExtClass(item) {
      switch ((item && item.length && item[0].extName) ? item[0].extName.toLowerCase() : '') {
        case "png":
          return "png";
        case "jpg":
        case "jpeg":
          return "jpg";
        case "xlsx":
        case "xls":
          return "excel";
        case "doc":
        case "docx":
          return "doc";
        case "ppt":
        case "pptx":
          return "ppt";
        case "pdf":
          return "pdf";
        case "zip":
        case "7z":
        case "war":
          return "zip";
        default:
          return "documentation";
      }
    },
    customSearchFn() {
      var params = clone(this.searchFormdata, {});
      params['startDate'] = params['releaseDate'] ? params['releaseDate'][0] : '';
      params['endDate'] = params['releaseDate'] ? params['releaseDate'][1] : '';
      delete params['releaseDate'];
      this.$refs.infosTable.remoteData(params);
    },
    remoteTableData(panelRef, tableRef, searFormVmodel) {
      // panel隐藏的时候
      if (this.$refs[panelRef].hide) {
        this.$refs[tableRef].remoteData({ keyWord: this.$refs.panel.inputVal })
      } else {
        this.$refs[tableRef].remoteData(this[searFormVmodel])
      }
    },
    remoteData() {
      this.remoteTableData('panel', 'infosTable', 'searchFormdata')
    },
    /**
       * 快速查询(资讯名称和备注)
       * @param e 模糊查询关键字
       */
    fuzzyQuery(e) {
      var param = { keyWord: e.value };
      this.$refs.infosTable.remoteData(param);
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
    },
    /**
       * 控制保存按钮、xdialog、表单的状态
       * @param viewType 表单类型
       * @param editable 可编辑,默认false
     */
    switchStatus(viewType, editable, cb) {
      this.viewType = viewType;
      this.formType = viewType === 'DETAIL' ? 'details' : 'edit';
      this.formDisabled = !editable;
      if (this.dialogVisible) {
        // 关闭重打开，重新计算对话框位置
        this.dialogVisible = false;
        this.$nextTick(() => {
          this.dialogVisible = true;
          cb && cb();
        })
      } else {
        this.dialogVisible = true;
        cb && cb();
      }
    },
    /**
       * 更新formData信息
       * @param row 当前资讯信息
       * @param isDtl 是否详情
       * @param hasTinymce 是否存在编辑器
       */
    updateFormDataInfo(row, _isDtl, hasTinymce) {
      this.$nextTick(() => {
        if (hasTinymce) {
          this.$refs.tinymce.init()
        }
        this.$refs.infForm.resetFields();
        clone(row, this.formdata);
        this.fileDtlInfos.splice(0, this.fileDtlInfos.length);
        this.formdata.showRangeNum = this.getRangeNum(this.formdata.visibleRange)
        // 将机构id String转成数组展示
        this.visibleRangeArr = this.formdata.visibleRange.split(",");
        // 将机构id转换为名称显示
        this.visibleRangeName = "--"
        this.getOrgInfoPage(orgInfoMap => {
          this.visibleRangeName = this.visibleRangeArr.map(orgId => orgInfoMap[orgId] ? orgInfoMap[orgId].orgName : "--").join('/')
        })
        // 渲染文件列表
        if (this.formdata.fileId && this.formdata.fileId.length) {
          // 目前field存储的是fieldPth
          const fileIds = this.formdata.fileId.split(",");
          this.$request({
            method: "POST",
            url: backend.portalService + "/api/xmhinformation/fileUploadInfo",
            data: JSON.stringify(fileIds),
          }).then(({code, message, data}) => {
            if (code === "0") {
              this.fileDtlInfos.push(...data)
              const filesMap = data.reduce((o, f) => {
                o[f.filePath] = f;
                return o
              }, {})
              this.fileList.splice(0, this.fileList.length,
                ...fileIds.reduce((arr, f) => {
                  if (filesMap[f] != null) {
                    arr.push({name: filesMap[f].fileName, url: this.fileId, filePath: filesMap[f].filePath})
                  }
                  return arr;
                }, []));
            } else {
              this.$message.error(message)
            }
          });
        }
      });
    },
    /**
       * 修改资讯
       * @param row 当前资讯信息
       */
    editFn(row) {
      if (row.status !== 2) {
        this.$message({
          message: this.$t('informationManager.znxzxxztdzx')
        });
        return;
      }
      this.switchStatus('EDIT', true, () => {
        this.updateFormDataInfo(row, false, true);
      });
    },
    /**
       * 资讯详情
       * @param row 当前资讯信息
       */
    infDetailFn(row) {
      if (row.status === 1) {
        this.$message({
          message: this.$t('informationManager.qxxxdqzxzjxsc')
        });
        return;
      }
      this.curtRow = row;
      this.switchStatus('DETAIL', true);
      this.updateFormDataInfo(row, true, false);
    },
    /**
       * 新增资讯
       */
    addInfoFn() {
      this.switchStatus('ADD', true);
      this.$nextTick(() => {
        this.$refs.tinymce.init()
        this.$refs.infForm.resetFields();
        this.visibleRangeArr = [];
      });
    },
    /**
       * 保存资讯
       * @param type 1-发布，2-暂存
       */
    saveInfFn(type) {
      const _this = this;
      let validate = false;
      let url = '';
      this.formdata.visibleRange = this.visibleRangeArr.length === 0 ? '' : this.visibleRangeArr.toString();
      _this.$refs.infForm.validate(function (valid) {
        validate = valid;
      });
      if (!validate) {
        return;
      }
      // 将机构id数组转成string存储
      if (type === 1) {
        url = '/api/xmhinformation/release';
      } else {
        url = this.formdata.status === 3 ? '/api/xmhinformation/draft' : '/api/xmhinformation/save';
      }
      this.showRangeArr = [];
      this.formdata.status = type === 1 ? 3 : 2;
      // 不置顶，去除置顶时间
      if (this.formdata.reminded !== 1) {
        this.formdata.remindEndDate = ''
      }
      // 将富文本转为byte[]
      // this.formdata.infContent = this.stringToByte(this.infContentStr);
      // this.infContentStr = "";
      _this.$request({
        method: 'POST',
        url: backend.portalService + url,
        data: _this.formdata
      }).then(({ code, message, _data, _total }) => {
        if (code === '0') {
          _this.$message({
            message: _this.$t('informationManager.sjzccg'),
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
       * 更改资讯状态（发布、下架、删除）
       * @param row 当前资讯信息
       * @param status 未来状态
       */
    chgInfStsFn(row, status) {
      if (status === 1 && row.status !== 2) {
        this.$message({
          message: this.$t('informationManager.qxxxdqzxzjxsc'),
          type: 'warning'
        });
        return;
      } else if (status === 3 && row.status !== 2) {
        this.$message({
          message: this.$t('informationManager.znxzxxztdzx')
        });
        return;
      } else if (status === 3 && row.status === 3) {
        this.$message({
          message: this.$t('informationManager.gzxysc')
        });
        return;
      }
      const _this = this;
      const chgStsForm = {};
      clone(row, chgStsForm);
      chgStsForm.status = status;
      let url = '';
      if (status === 3) {
        url = '/api/xmhinformation/release';
      } else if (status === 2) {
        url = row.status === 3 ? '/api/xmhinformation/draft' : '/api/xmhinformation/update';
      } else {
        url = '/api/xmhinformation/update';
      }

      let ts = '';
      if (status === 1) {
        ts = this.$t('informationManager.scts1');
      } else if (status === 2) {
        ts = this.$t('informationManager.xxts1');
      } else if (status === 3) {
        ts = this.$t('informationManager.sxts1');
      }
      this.$confirm(ts + row.infTitle + this.$t('informationManager.ts2'), this.$t('informationManager.ts'), {
        confirmButtonText: this.$t('informationManager.qd'),
        cancelButtonText: this.$t('informationManager.qx'),
        type: 'warning',
        callback(action) {
          if (action === 'confirm') {
            // 发起更改状态请求
            _this.$request({
              method: 'POST',
              url: backend.portalService + url,
              data: chgStsForm
            }).then(({ code, message, _data, _total }) => {
              if (code === '0') {
                _this.$message({
                  message: _this.$t('informationManager.gxcg'),
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
       * 按钮快捷查询
       * infoStatusChoose 查询状态种类，0-全部，2-草稿，3-已发布
       */
    searchTableFn() {
      const type = this.infoStatusChoose;
      let searchStatus = {};
      if (type !== "0") {
        searchStatus = { status: type }
      }
      this.$refs.infosTable.remoteData(searchStatus);
    },
    countValid(val) {
      this.tinyWordNumber = val;
      this.$refs.infForm.validateField('infContent');
    },
    checkTiny(_rule, _value, callback) {
      let errorMessage
      if (!this.tinyWordNumber) {
        callback(new Error(`${this.$t('informationManager.qsrggnr')}`));
      } else if (this.tinyWordNumber < this.tinymceMin) {
        errorMessage = this.$store.state.app.language === 'en' ? `${this.$t('informationManager.zssr')} ${this.tinymceMin} ${this.$t('informationManager.zfc')}` :
          `${this.$t('informationManager.zssr')}${this.tinymceMin}${this.$t('informationManager.zfc')}`;
        callback(new Error(errorMessage));
      } else if (this.tinyWordNumber > this.tinymceMax) {
        errorMessage = this.$store.state.app.language === 'en' ? `${this.$t('informationManager.zdsr')} ${this.tinymceMax} ${this.$t('informationManager.zfc')}` :
          `${this.$t('informationManager.zdsr')}${this.tinymceMax}${this.$t('informationManager.zfc')}`;
        callback(new Error(errorMessage));
      } else {
        callback();
      }
    },
    stringToByte(str) {
      var bytes = [];
      var len, c;
      len = str.length;
      for (var i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
          bytes.push(((c >> 18) & 0x07) | 0xF0);
          bytes.push(((c >> 12) & 0x3F) | 0x80);
          bytes.push(((c >> 6) & 0x3F) | 0x80);
          bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
          bytes.push(((c >> 12) & 0x0F) | 0xE0);
          bytes.push(((c >> 6) & 0x3F) | 0x80);
          bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
          bytes.push(((c >> 6) & 0x1F) | 0xC0);
          bytes.push((c & 0x3F) | 0x80);
        } else {
          bytes.push(c & 0xFF);
        }
      }
      return bytes;
    },
    byteToString(arr) {
      if (typeof arr === 'string') {
        return arr;
      }
      var str = '',
        _arr = arr;
      for (var i = 0; i < _arr.length;) {
        var one = _arr[i].toString(2),
          v = one.match(/^1+?(?=0)/);
        if (v && one.length === 8) {
          var bytesLength = v[0].length;
          var store = _arr[i].toString(2).slice(7 - bytesLength);
          for (var st = 1; st < bytesLength; st++) {
            store += _arr[st + i].toString(2).slice(2);
          }
          str += String.fromCharCode(parseInt(store, 2));
          i += bytesLength - 1;
        } else {
          str += String.fromCharCode(_arr[i]);
        }
        i++
      }
      return str;
    },
    getNotice() {
      var _this = this;
      this.$request({
        url: backend.appOcaService + `/api/adminsmnotice/info/${_this.noticeId}`,
        data: {}
      }).then(({ code, message, data }) => {
        if (code === '0') {
          _this.$refs.refForm.resetFields();
          clone(data, _this.formdata);
          _this.selectOrgMap = _this.formdata.reciveOrgMap;
          _this.selectRoleMap = _this.formdata.reciveRoleMap;
          _this.fileList = _this.formdata.fileInfoFormList;
          _this.fileListInfo = extend([], _this.formdata.fileInfoFormList);
          _this.formdata.reciveRoleIdNames = _this.selectRoleNames.join(',');
        } else {
          _this.$message({
            message: message || this.$t('notice.bcsb'),
            type: 'error'
          });
        }
      });
    },
    uploadedFn(fileItem, _num) {
      fileItem.icon && delete fileItem.icon;
      this.fileList.push(fileItem);
    },
    deleteFileFn(file) {
      this.fileList.forEach((item, index) => {
        if (item.filePath === file.filePath) {
          this.fileList.splice(index, 1);
        }
      });
    },
    loadNumberFn(val) {
      this.loadFileNum = val;
    },
    // 移除上传文件
    handleRemove(file) {
      if (this.fileList && this.fileList.length) {
        this.fileList.forEach((item, index) => {
          if (item.uid === file.uid) {
            this.fileList.splice(index, 1)
          }
        })
      }
      if(this.formdata.fileId) {
        var tempArray = this.formdata.fileId.split(',');
        tempArray.forEach((temp, index) => {
          if(temp === file.filePath) {
            tempArray.splice(index, 1);
            this.formdata.fileId = tempArray && tempArray.length > 0 ? tempArray.join(',') : ''
          }
        })
      }
    },
    /**
      * 上传内容成功
      */
    handleImageSuccess: function (_res, file, fileList) {
      if(file.response.data) {
        if(this.formdata.fileId === 'undefined') {
          this.formdata.fileId = ''
        }
        this.formdata.fileId += (this.formdata.fileId ? ',' + file.response.data : file.response.data)
      }
      this.fileList = fileList
    },
    /**
         * 文件上传之前获取上传校验
         */
    beforeImageUpload: function (file) {
      const size = file.size / 1024 / 1024 <= 10;
      if (!size) {
        this.$message.error(this.$t("informationManager.wjyq10M"));
        return false
      }
      // 已经有20个，不允许上传了
      if (this.fileList.length === 20) {
        this.$message.error(this.$t("informationManager.wjyq20"));
        return false
      }
    },
    // 关闭弹窗
    closeDialog() {
      this.$refs.infForm.resetFields();
      this.fileList = [];
      this.fileListInfo = [];
      this.$refs.tinymce && this.$refs.tinymce.destroy()
    },
    /**
        * 下载图片内容
        * @param row 卡片信息
        * @returns {string} 返回图片下载地址
      */
    getDownloadImg(row) {
      return getFileUrl(row.fileId);
    },
    // 获取展示范围个数
    getRangeNum(showRange) {
      if (showRange === '1') return ''
      return `(${showRange.split(',').length})`
    },
    // 获取所有的机构信息，存储成map
    getOrgInfoPage(cb) {
      if (this.orgInfoMap) {
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
          cb(this.orgInfoMap);
        } else {
          this.$message.error(message)
        }
      })
    }

  },
}
</script>
<style lang="scss">
  .compact .dialog-btn {
    margin-bottom: 16px;
  }

  .cell .el-button.el-button--text.is-disabled {
    color: rgba(208, 208, 208, 1);
  }

  .tinymceDetails ul,
  .tinymceDetails ol {
    position: relative;
    left: 12px;
  }

  .tinymceDetails ul li {
    list-style-type: disc;
  }

  .tinymceDetails ol li {
    list-style-type: decimal;
  }

  .el-form-details .el-form-item.remindEndDate.is-required>.el-form-item__label>span:before {
    display: none;
  }
  .remindEndDate {
    padding-left: 5px;
  }
</style>
