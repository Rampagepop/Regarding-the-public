<!--
  @created by liuyw6@yusys.com.cn 2022-05-19
  @updated by
  @description 卡片管理
-->
<template>
  <div id="cardManager">
    <yu-panel ref="panel" :title="$t('cardManager.kpgl')" class="adjust-height" show-search-input clearable :placeholder="$t('cardManager.qsrkpbhhkpmc')" @search="fuzzyQuery">
      <!--卡片列表操作按钮-->
      <template slot="right">
        <yu-toolBar>
          <yu-button v-if="checkCtrl('add')" @click="addCardFn" style="margin-right: 10px">{{ $t("cardManager.xz") }}</yu-button>
          <yu-radio-group class="btn-group" @change="searchTableFn" v-model="useStatusChoose">
            <yu-radio-button label="-1">{{ $t("cardManager.qb")}}</yu-radio-button>
            <yu-radio-button label="1">{{ $t("cardManager.qy") }}</yu-radio-button>
            <yu-radio-button label="0">{{ $t("cardManager.ty")}}</yu-radio-button>
          </yu-radio-group>
        </yu-toolBar>
      </template>
      <template slot="search">
        <yu-xselect ref="xselect" v-model="selectCard" value-type="string" data-code="CBT_CARD_TYPE" placeholder="请选择分类" filterable default-first-option @change="relactionChange" collapse-tags></yu-xselect>
      </template>
      <!--卡片列表-->
      <yu-xtable request-type="POST" ref="cardsTable" row-number :data-url="tableUrl" @sort-change="sortChange">
        <yu-xtable-column label="卡片编号">
          <template slot-scope="scope">
            <a class="underline" @click="cardDetailFn(scope.row)">{{
              scope.row.cardCode
            }}</a>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('cardManager.mc')" prop="cardName"></yu-xtable-column>
        <yu-xtable-column :label="$t('cardManager.fl')" prop="cardTypeCode" data-code="CBT_CARD_TYPE"></yu-xtable-column>
        <yu-xtable-column :label="$t('cardManager.gg')" prop="cardSpecCode" data-code="CBT_CARD_SIZE"></yu-xtable-column>
        <yu-xtable-column :label="$t('cardManager.zt')">
          <template slot-scope="scope">
            <yu-tag v-if="scope.row.useStatus" type="success">{{$t("cardManager.qy")}}</yu-tag>
            <yu-tag v-else type="gray">{{ $t("cardManager.ty") }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('cardManager.syyhs')" prop="useNum" sortable="custom"></yu-xtable-column>
        <yu-xtable-column :label="$t('cardManager.lj')" prop="intfUrl"></yu-xtable-column>
        <yu-xtable-column :label="$t('cardManager.ms')" prop="cardDesc"></yu-xtable-column>
        <yu-xtable-column
          fixed="right"
          :label="$t('component.operate')"
          width="160"
        >
          <template slot-scope="scope">
            <yu-button-drop set-index="0" :show-length="2" type="text">
              <yu-button v-if="checkCtrl('edit')" @click="editFn(scope.row)" type="text">
                {{ $t("cardManager.bj") }}
              </yu-button>
              <yu-button v-if="checkCtrl('delete')" v-norepeat.disabled @click="chgCardStsFn(scope.row, 1)" type="text">
                {{ $t("cardManager.sc") }}
              </yu-button>
            </yu-button-drop>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <!--卡片 新增 修改 详情-->
    <yu-xdialog :title="viewTitle[viewType]" :visible.sync="dialogVisible" width="480px" :min-height="250" @close="cancelFn">
      <yu-xform ref="cardForm" v-model="formdata" :form-type="formType" label-width="100px" :rules="formRules">
        <yu-xform-group :column="1">
          <yu-xform-item :label="$t('cardManager.mc')" name="cardName" :placeholder="$t('cardManager.qsr')"></yu-xform-item>
          <yu-xform-item :label="$t('cardManager.fl')" ctype="select" name="cardTypeCode" data-code="CBT_CARD_TYPE"></yu-xform-item>
          <yu-xform-item :label="$t('cardManager.gg')" ctype="radio" name="cardSpecCode" data-code="CBT_CARD_SIZE"></yu-xform-item>
          <yu-xform-item :label="$t('cardManager.slt')" name="thumbnailRoute" ctype="custom">
            <yu-upload class="upload-c" v-if="viewType !== 'DETAIL'" drag :action="uploadAction" :headers="uploadHeader"
                       :file-list="fileList"
                       :show-file-list="true" :on-success="handleImageSuccess" :before-upload="beforeImageUpload"
                       :on-remove="handleRemove">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">{{ $t('cardManager.scyq') }}</div>
              <!--<div v-if="fileList.length > 0" class="el-upload__tip" slot="tip">{{ $t('cardManager.znscyztp') }}</div>-->
            </yu-upload>
            <img class="upload-detail-img" v-else :src="thumbnailRoute" />
          </yu-xform-item>
          <yu-xform-item :label="$t('cardManager.zt')" ctype="radio" name="useStatus" data-code="CBT_CARD_USE_STATUS"></yu-xform-item>
          <yu-xform-item :label="$t('cardManager.lj')" name="intfUrl" :placeholder="$t('cardManager.qsr')"></yu-xform-item>
          <yu-xform-item :label="$t('cardManager.ms')" ctype="textarea" name="cardDesc" :placeholder="$t('cardManager.qsr')"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" class="yu-grpButton">
        <yu-button type="primary" key="edit" v-if="formType === 'edit'" v-norepeat.disabled @click="saveCardFn">{{ $t("cardManager.bc") }}</yu-button>
        <yu-button type="primary" v-if="checkCtrl('edit') && viewType === 'DETAIL'" @click="switchStatus('EDIT', true)">{{ $t("cardManager.bj") }}</yu-button>
        <!-- <yu-button v-if="formType === 'details'" @click="cancelFn">{{
          $t("cardManager.fh")
        }}
        </yu-button> -->
        <yu-button @click="cancelFn">{{$t("cardManager.qx")}}</yu-button>
      </div>
    </yu-xdialog>
  </div>
</template>
<script>
import {getFileUrl, getUploadFileUrl, addTokenInfo} from "@/utils/util";
import {clone, lookup} from "@/utils";
import {getAccessToken} from "@/utils/oauth";
import {validator} from '@/utils/validate';

lookup.reg("CBT_CARD_TYPE,CBT_CARD_SIZE,CBT_CARD_USE_STATUS");
export default {
  components: {},
  data() {
    return {
      formdata: {
        id: "",
      }, // 表单数据
      tableUrl: backend.portalService + "/api/xmhcard/list", // 卡片列表查询地址
      dialogVisible: false, // 弹出框是否展示
      viewType: "ADD", // 弹出框默认新增
      viewTitle: lookup.find("CRUD_TYPE", false), // 弹出框类型
      formDisabled: false, // 表单是否禁用
      props: {label: "orgName", children: "children"},
      formType: "details",
      formRules: {
        cardName: [
          {required: true, message: this.$t("cardManager.btx")},
          {max: 20, message: this.$t("cardManager.srzdgc")},
          {validator: validator.speChar, message: this.$t('cardManager.srxxbhtszf')}
        ],
        cardTypeCode: {required: true, message: this.$t("cardManager.btx")}, // 必填项校验
        cardSpecCode: {required: true, message: this.$t("cardManager.btx")}, // 必填项校验
        thumbnailRoute: {required: true, message: this.$t("cardManager.btx")}, // 必填项校验
        useStatus: {required: true, message: this.$t("cardManager.btx")}, // 必填项校验
        intfUrl: [
          {required: true, message: this.$t("cardManager.btx")},
          {max: 50, message: this.$t("cardManager.srzdgc")}, // 必填项校验
        ], // 必填项校验
        cardDesc: {max: 100, message: this.$t("cardManager.srzdgc")},
      }, // 表单验证规则
      searchFormdata: {}, // 查询表单数据
      status: {},
      cardTypeCode: {},
      cardSpecCode: {},
      useStatus: {},
      useStatusChoose: "-1",
      uploadAction: getUploadFileUrl(), // 内容上传地址
      uploadHeader: {Authorization: "Bearer " + getAccessToken()},
      thumbnailRoute: "", //缩略图
      fileList: [],
      selectCard: ''
    };
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.cardTypeCode = lookup.find("CARD_TYPE", false);
    this.cardSpecCode = lookup.find("CARD_SIZE", false);
    this.useStatus = lookup.find("CARD_USE_STATUS", false);
  },
  methods: {
    remoteTableData(panelRef, tableRef, searFormVmodel) {
      // panel隐藏的时候
      if (this.$refs[panelRef].hide) {
        this.$refs[tableRef].remoteData({keyWord: this.$refs.panel.inputVal});
      } else {
        this.$refs[tableRef].remoteData(this[searFormVmodel]);
      }
    },
    remoteData() {
      this.remoteTableData("panel", "cardsTable", "searchFormdata");
    },
    // 移除上传文件
    handleRemove: function (file, fileList) {
      this.fileList = fileList;
      this.formdata.thumbnailRoute = "";
    },
    /**
       * 按照使用用户数排序
       * @param e 模糊查询关键字
       */
    sortChange(column) {
      if (this.useStatusChoose == "-1") {
        this.useStatusChoose = "";
      }
      var param = {
        keyWord: this.$refs.panel.inputVal,
        useState: this.useStatusChoose,
        sort: column.prop + "," + column.order,
      };
      this.$refs.cardsTable.remoteData(param);
      this.resetFn(); // 清空精确查询条件
    },
    /**
       * 快速查询(卡片名称和编号)
       * @param e 模糊查询关键字
       */
    fuzzyQuery(e) {
      var param = {keyWord: e.value, cardTypeCode: this.selectCard};
      this.$refs.cardsTable.remoteData(param);
      this.resetFn(); // 清空精确查询条件
    },
    relactionChange (val) {
      var param = {keyWord: this.$refs.panel.inputVal, cardTypeCode: val};
      this.$refs.cardsTable.remoteData(param);
      this.resetFn(); // 清空精确查询条件
    },
    /**
       * 清空快速查询区域查询条件
       */
    clearFuzzyFn() {
      this.$refs.panel.inputVal = "";
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
      // var _this = this;
      this.dialogVisible = false;
      this.fileList = [];
    },
    /**
       * 控制保存按钮、xdialog、表单的状态
       * @param viewType 表单类型
       * @param editable 可编辑,默认false
       */
    switchStatus(viewType, editable) {
      this.viewType = viewType;
      this.dialogVisible = true;
      this.formType = viewType === "DETAIL" ? "details" : "edit";
      this.formDisabled = !editable;
    },
    /**
       * 修改卡片
       * @param row 当前卡片信息
       */
    editFn(row) {
      this.switchStatus("EDIT", true);
      this.$nextTick(function () {
        this.fileList = [];
        this.$refs.cardForm.resetFields();
        clone(row, this.formdata);
        this.thumbnailRoute = getFileUrl(this.formdata.thumbnailRoute);
        var uploadUrl = addTokenInfo(backend.fileService + "/api/file/provider/fileUpload");
        var _this = this;
        _this
          .$request({
            method: "POST",
            url: uploadUrl,
            data: {filePath: this.formdata.thumbnailRoute},
          })
          .then((data) => {
            if (data.length > 0) {
              var obj = {name: data[0].fileName, url: _this.thumbnailRoute};
              _this.fileList.splice(0, 1, obj);
            }
          });
      });
    },
    /**
       * 卡片详情
       * @param row 当前卡片信息
       */
    cardDetailFn(row) {
      this.switchStatus("DETAIL", true);
      this.$nextTick(() => {
        this.$refs.cardForm.resetFields();
        clone(row, this.formdata);
        if (this.formdata.thumbnailRoute) {

          this.thumbnailRoute = addTokenInfo(backend.fileService + '/api/file/provider/download?fileId=' + this.formdata.thumbnailRoute);
          var uploadUrl = addTokenInfo(
            backend.fileService + "/api/file/provider/fileUpload"
          );
          var _this = this;
          _this
            .$request({
              method: "POST",
              url: uploadUrl,
              data: {filePath: this.formdata.thumbnailRoute},
            })
            .then((data) => {
              if (data.length > 0) {
                var obj = {name: data[0].fileName, url: _this.thumbnailRoute};
                _this.fileList.splice(0, 1, obj);
              }
            });
        } else {
          this.thumbnailRoute = "";
        }
      });
    },
    /**
       * 新增卡片
       */
    addCardFn() {
      this.switchStatus("ADD", true);
      this.$nextTick(function () {
        this.$refs.cardForm.resetFields();
      });
    },
    /**
       * 保存卡片
       */
    saveCardFn() {
      var _this = this;
      var validate = false;
      _this.$refs.cardForm.validate(function (valid) {
        validate = valid;
      });
      if (!validate) {
        return;
      }
      var url = _this.formdata.id ? "/api/xmhcard/update" : "/api/xmhcard/save";
      _this
        .$request({
          method: "POST",
          url: backend.portalService + url,
          data: _this.formdata,
        })
        .then(({code, message, data, total}) => {
          if (code === "0") {
            _this.$message({
              message: _this.$t("cardManager.bccg"),
              type: "success",
            });
            _this.dialogVisible = false;
            _this.remoteData();
          } else {
            _this.$message({
              message: message,
              type: "error",
            });
          }
        });
    },
    /**
       * 更改卡片状态（删除）
       * @param row 当前卡片信息
       * @param deleted 删除状态
       */
    chgCardStsFn(row, deleted) {
      if (row.useStatus == 1) {
        this.$message.error(this.$t("cardManager.yqydkpbnsc"));
        return;
      }
      var _this = this;
      var chgStsForm = {
        id: row.id,
        deleted: deleted,
      };
      this.$confirm(
        this.$t("cardManager.qdyscxzdjl"),
        this.$t("cardManager.ts"),
        {
          confirmButtonText: this.$t("cardManager.qd"),
          cancelButtonText: this.$t("cardManager.qx"),
          type: "warning",
          callback(action) {
            if (action === "confirm") {
              // 发起更改状态请求
              _this
                .$request({
                  method: "POST",
                  url: backend.portalService + "/api/xmhcard/update",
                  data: chgStsForm,
                })
                .then(({code, message, data, total}) => {
                  if (code === "0") {
                    _this.$message({
                      message: _this.$t("cardManager.sccg"),
                      type: "success",
                    });
                    _this.remoteData();
                  } else {
                    _this.$message({
                      message: message,
                      type: "error",
                    });
                  }
                });
            }
          },
        }
      );
    },
    /**
    * 上传内容成功
    */
    handleImageSuccess: function (res, file, fileList) {
      if(res.code === "0") {
        this.formdata.thumbnailRoute = res.data;
        this.fileList = fileList;
        if (fileList.length > 1) {
          fileList.splice(0, 1);
          this.fileList = fileList;
        }
      }else{
        this.fileList = [];
        this.$message({
          message:"上传失败:" + res.message,
          type: "error",
        });
      }
     
    },
    /**
       * 文件上传之前获取上传校验
       */
    beforeImageUpload: function (file) {
      const _this = this;
      const type =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          type === "image/jpg";
      const size = file.size / 1024 / 1024 < 10;
      if (!type) {
        this.$message.error(this.$t("cardManager.sctpznsgs"));
      }
      if (!size) {
        this.$message.error(this.$t("cardManager.sctpdxbncg"));
      }
      return type && size;
    },
    /**
       * 按钮快捷查询
       * @param type 查询卡片状态，1-启用，0-停用，-1-全部
       */
    searchTableFn(type) {
      let searchStatus = {};
      if (type !== "-1") {
        searchStatus = {useStatus: type};
      }
      this.$refs.cardsTable.remoteData(searchStatus);
    },
    /**
       * 下载图片内容
       * @param row 卡片信息
       * @returns {string} 返回图片下载地址
       */
    getDownloadImg(row) {
      return getFileUrl(row.thumbnailRoute);
    },
  },
};
</script>
<style lang='scss' scoped>
@import "@/assets/styles/variables.scss";
  .compact .dialog-btn {
    margin-bottom: 16px;
  }
.el-upload__tip{
  color: $baseRed;
}
.yu-base-panel-right-content .el-button-group {
  margin-top: -10px;
}
.upload-detail-img {
  width: 100%;
}
</style>
