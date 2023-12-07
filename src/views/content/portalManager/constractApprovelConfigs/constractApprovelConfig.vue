/** * Desc: 合同配置二级页面 * @author 陈祖英 * @date 2022/10/25 * @since 1.0.0
* @version 1.0 */
<template>
  <div class="cus-mgr-v2-sub-wrap">
    <yu-panel
      ref="panel"
      :title="$t('card.contractApproveConfig')"
      class="adjust-height"
    >
      <template slot="right">
        <yu-toolBar>
          <yu-button
            @click="toAddConfigContact"
          >
            新增
          </yu-button>
        </yu-toolBar>
      </template>
      <template slot="filter">
        <yu-xform ref="refFormDemo" label-width="120px" related-table-name="contractApproveConfig" v-model="searchFormData" form-type="search" @form-reset="tempBtnFn">
          <!-- <yu-xform
          ref="refFormDemo"
          label-width="120px"
          related-table-name="contractApproveConfig"
          v-model="searchFormData"
        > -->
          <yu-xform-group :column="4">
            <yu-xform-item
              label="审批要点类型"
              ctype="select"
              name="auditType"
              @change="selectChange"
              :options="typeOption"
              placeholder="请选择"
            ></yu-xform-item>

            <yu-xform-item
              label="审批要点描述"
              name="auditDesc"
              ctype="input"
              @blur="inputBlur"
              placeholder="请输入"
            ></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
        <!-- <yu-xform-group :column="4">
            <yu-button
              type="primary"
              @click="tempBtnFn"
            >
              查询
            </yu-button>
            <yu-button @click="reset">重置</yu-button>
          </yu-xform-group> -->
        <!-- </yu-xform> -->
      </template>
      <div class="cus-search">
      
        <xtableHeaderDrag
          ref="contractApproveConfig"
          :data-url="tableDataUrl"
          request-type="POST"
          border
          :headerFields="headerFields"
          :default-load="true"
          :buttons="buttons"
          row-height="35px"
        ></xtableHeaderDrag>
      </div>
      <!-- 详情 -->
      <yu-xdialog
        :title="viewTitle[viewType]"
        :visible.sync="dialogVisible"
        size="large"
        width="960px"
        @close="closeDialog"
      >
        <yu-xform
          ref="constractForm"
          v-model="formdata"
          label-width="160px"
          :form-type="formType"
          :rules="formRules"
        >
          <yu-xform-group :column="1">
            <yu-xform-item
              :hidden="viewType === 'ADD'"
              label="信息编号"
              name="infoId"
              ctype="input"
              :disabled="true"
            ></yu-xform-item
            >
            <yu-xform-item label="审核要点类型" ctype="custom" name="auditType">
              <div v-if="viewType !== 'DETAIL'">
                <yu-radio-group v-if="!isDeleteTag" v-model="formdata.auditType">
                  <yu-radio
                    v-for="(item, index) in options2"
                    :key="index + 'radio'"
                    :label="item.value"
                  ></yu-radio>
                </yu-radio-group>
                <div v-else>
                  <yu-tag
                    :key="index"
                    v-for="(tag, index) in tagArrayFn(options2)"
                    :closable="true"
                    :close-transition="false"
                    @close="handleClose(tag)"
                  >
                    {{ tag }}
                  </yu-tag>
                </div>
              </div>
              <div v-else>
                {{ formdata.auditType }}
              </div>
              <yu-button-group
                v-if="viewType !== 'DETAIL'"
                :class="isShow ? 'block-box' : 'adio-content-style'"
              >
                <el-input v-if="isShow" v-model="addType" clearable></el-input>
                <el-button
                  type="text"
                  v-norepeat.disabled="btnDisabled"
                  @click="addFn(addButtonTitle, addType)"
                  style="padding-right:10px;"
                >{{ addButtonTitle }}</el-button
                >
                <el-button type="text" @click="modifyFn(editButton)">{{
                  editButton
                }}</el-button>
              </yu-button-group>
            </yu-xform-item>
            <yu-xform-item
              label="审核要点描述"
              ctype="textarea"
              colspan="24"
              name="auditDesc"
              placeholder="限500个字符以内"
              maxlength="500"
              show-word-limit
              :rows="3"
              :show-overflow-tooltip="false"
            ></yu-xform-item>
            <!-- :options="options2" -->
            <yu-xform-item
              label="适用合同类型"
              ctype="select"
              data-code="CTRT_TYPE"
              name="contractType"
            ></yu-xform-item>
            <yu-xform-item
              label="登记人"
              ctype="input"
              :hidden="viewType === 'ADD'"
              :disabled="true"
              name="createUserName"
            ></yu-xform-item>
            <yu-xform-item
              label="登记机构"
              :hidden="viewType === 'ADD'"
              name="createOrgName"
              :disabled="true"
            ></yu-xform-item>
            <yu-xform-item
              label="登记日期"
              :disabled="true"
              :hidden="viewType === 'ADD'"
              name="createDate"
            ></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
        <div slot="footer" class="yu-grpButton">
          <yu-button type="primary" @click="saveData(viewType)" v-if="viewType !== 'DETAIL'"
          >保存</yu-button
          >
          <yu-button @click="cancelFn">{{
            $t("informationManager.qx")
          }}</yu-button>
        </div>
      </yu-xdialog>
    </yu-panel>
  </div>
</template>

<script>
import config from "@/config/index.js";
import { mapGetters } from "vuex";
import { clone, lookup } from "@/utils";
import xtableHeaderDrag from "@/views/portal/card/components/xtableHeaderDrag";
export default {
  name: "cusMgr",
  components: { xtableHeaderDrag },
  // mixins: [corpPsMixin],
  props: {},
  data: function() {
    return {
      isDeleteTag: false,
      tagArray: [],
      addType: "",
      addButtonTitle: "添加",
      editButton: "编辑",
      btnDisabled: false,
      isShow: false,
      deleteApproveData:[], //存储删除数据
      options2: [
        { key: "1", value: "合同完整性" },
        { key: "2", value: "合同合规性" },
        { key: "3", value: "合同准确性" },
        { key: "4", value: "合同合法性" }
      ],
      formRules: {
        auditType: [
          {
            required: true,
            message: "必填项",
            trigger: "blur"
          }
        ],
        auditDesc: [
          { required: true, message: "必填项" },
          { max: 500, message: "审核要点描述不能超过500个字符" }
        ],
        contractType: [
          {
            required: true,
            message: "必填项",
            trigger: ["blur", "change"]
          }
        ] // 规则类型
      },
      formType: "ADD",
      dialogVisible: false,
      viewType: "ADD", // 弹出框默认新增
      viewTitle: lookup.find("CRUD_TYPE", false), // 弹出框类型
      tempArray: "",
      baseParams: { page: 1, size: 10 },
      getDataTime: "2022-09-03 11:22:00",
      activeMode: "1",
      typeOption: [],
      modes: [
        { label: "3日本息未足额", value: "1" },
        { label: "当天到期未还", value: "2" },
        { label: "当天新增逾期", value: "3" },
        { label: "7日净新增逾期", value: "4" }
      ],
      buttons: [
        { label: "编辑", handleClick: this.editdata },
        { label: "删除", handleClick: this.deleteTableData }
      ],
      tableDataUrl: backend.portalService + "/api/xmhcontexamconf/list",
      headerFields: [
        {
          label: "序号",
          prop: "",
          show: true,
          width:55
        },
        {
          label: "信息编号",
          prop: "infoId",
          show: true,
          // 超链接
          handleClick: this.toDetail,
          minWidth: 100
        },
        {
          label: "审核要点类型",
          prop: "auditType",
          show: true,
          // 不允许在列信息过滤中进行修改
          minWidth: 100
        },
        {
          label: "审核要点描述",
          prop: "auditDesc",
          show: true,
          filter: true
        },
        {
          label: "适用合同类型",
          prop: "contractType",
          show: true,
          dataCode:'CTRT_TYPE',
          showOverflowTooltip: true
        },
        {
          label: "登记人",
          prop: "createUserName",
          show: true
        },
        {
          label: "登记机构",
          prop: "createOrgName",
          show: true
        },
        {
          label: "登记日期",
          prop: "createDate",
          show: true
        }
      ],
      formdata: {
        // auditDesc: "",
        // auditType: "",
        // contractType: "",
        // createDate: "",
        // createOrgName: "",
        // createUserName: "",
        // infoId: ""
      },
      searchFormData: {
        auditDesc: "",
        auditType: ""
      },
    };
  },
  computed: {
    // tableDataUrl() {
    //   return this.corpPsConfig[this.activeMode].tableDataUrl
    // },
    ...mapGetters(["selectedRoles"]),
    orgName() {
      if (this.selectedRoles) {
        return `${this.selectedRoles.orgName}`;
      }
      return "";
    }
  },
  watch: {
    activeMode: {
      handler: function(mode) {
        // 切换下边的列表选项
        // const cusSearch = this.corpPsConfig[mode].subPage.cusSearch;
      },
      immediate: true
    }
  },
  mounted() {
    this.getApproveType();
  },
  methods: {
    //获取审核类型
    getApproveType() {
      this.$request({
        url: `${this.$backend.portalService}/api/xmhaudit/keytype/list`
      }).then(res => {
        if (res && res.code === "0") {
          this.typeOption = res.data || [];
          this.options2 = res.data || [];
        }
      });
    },
    tagArrayFn(array) {
      return array.map(item => {
        return item.value;
      });
    },
    addFn(text, type) {
      //防止重复点击  防止文字重复
      if (text === "确定" && this.editButton === "编辑") {
        if (this.tagArrayFn(this.options2).every(item => item !== type)) {
          //防止文字重复
          this.options2.push({ key: type, value: type });
          this.$request({
            url: `${this.$backend.portalService}/api/xmhaudit/keytype/save`,
            data: {
              value: type
            }
          }).then(res => {
            if (res && res.code === "0") {
              this.addType = '';
              this.isShow = false;
              this.resetTypeButton();
              this.$message({
                message: "新增成功",
                type: "success"
              });
            }
          });
        } else {
          this.$message("添加的类型和当前已有的类型重复，请勿重复添加");
        }
      } else if (text === "确定" && this.editButton === "取消") {
        //调用接口确定删除相关类型
        var _this = this;
        // "是否删除该合同审核要点配置？"
        if(this.deleteApproveData.length) {
          _this
            .$confirm("是否删除合同审核要点类型", "确认", {
              confirmButtonText: "是",
              cancelButtonText: "否",
              type: "warning"
            })
            .then(function() {
              _this.$request({
                url: `${_this.$backend.portalService}/api/xmhaudit/keytype/delete`,
                data: _this.deleteApproveData.map(item => item.value)
              }).then(res => {
                if (res && res.code === "0") {
                  _this.getApproveType();
                  _this.isDeleteTag = false;
                  _this.resetTypeButton();
                  _this.$message({  
                    message: "删除成功",
                    type: "success"
                  });
                }else {
                  _this.deleteApproveData.forEach((item) => {
                    _this.options2.push({ key: item.key, value: item.value });
                  })
                  _this.deleteApproveData = []
                }
              }).catch(() => {
                _this.deleteApproveData.forEach((item) => {
                  _this.options2.push({ key: item.key, value: item.value });
                })
              });
              this.isShow = false
            })
            .catch(function() {});
        }else{
          _this.$message({
            message: "请先选择您需要删除的数据",
            type: "warning"
          });
        }
       
      } else {
        this.addButtonTitle = "确定";
        this.isShow = true
      }
  
    },
    modifyFn(text) {
      if (text === "编辑") {
        this.editButton = "取消";
        this.addButtonTitle = "确定";
        this.isDeleteTag = true;
      } else {
        this.editButton = "编辑";
        this.addButtonTitle = "添加";
        this.isDeleteTag = false;
      }
      this.isShow = false;
    },
    //删除图标
    handleClose(text) {
      this.options2.forEach((item, index, self) => {
        if (item.value === text) {
          self.splice(index, 1);
          this.deleteApproveData.push(item)
        }
      });
    },
    deleteTableData(row) {
      var _this = this;
      // "是否删除该合同审核要点配置？"
      _this
        .$confirm(`确定删除该审核要点 “${row.infoId}” 吗?`, "确认", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
        .then(function() {
          _this.$request({
            url: `${_this.$backend.portalService}/api/xmhcontexamconf/delete`,
            data: [row.infoId]
          }).then(res => {
            if (res && res.code === "0") {
              _this.$refs.contractApproveConfig.remoteData();
              _this.$message({
                message: "删除成功",
                type: "success"
              });
            }
          });
        })
        .catch(function() {});
    },
    //保存
    saveData() {
      var _this = this;
      var validate = false;
      this.isShow = false;
      _this.$refs.constractForm.validate(function(valid) {
        validate = valid;
      });
      if (!validate) {
        return;
      }
      if (this.viewType === "ADD") {
        this.$request({
          url: `${this.$backend.portalService}/api/xmhcontexamconf/save`,
          data: {
            ...this.formdata,
            page: 0,
            size: 0
          }
        }).then(res => {
          if (res && res.code === "0") {
            this.$refs.contractApproveConfig.remoteData();
            this.dialogVisible = false;
            this.$message({
              message: "新增成功",
              type: "success"
            });
          }
        });
      } else if (this.viewType === "EDIT") {
        this.$request({
          url: `${this.$backend.portalService}/api/xmhcontexamconf/update`,
          data: {
            ...this.formdata,
            page: 0,
            size: 0
          }
        }).then(res => {
          if (res && res.code === "0") {
            this.$refs.contractApproveConfig.remoteData();
            this.dialogVisible = false;
            this.$message({
              message: "保存成功",
              type: "success"
            });
          }
        });
      }
    },
    /**新增*/
    toAddConfigContact() {
      this.formType = "ADD";
      this.deleteApproveData = [];
      this.isShow = false;
      this.switchStatus("ADD", true);
      this.$nextTick(() => {
        this.$refs.constractForm.resetFields();
        this.$refs.constractForm.auditType = null;
        this.resetTypeButton();
      });
    },
    //resetbutton
    resetTypeButton() {
      this.editButton = "编辑"
      this.addButtonTitle = "添加"
    },
    /**
     * 控制保存按钮、xdialog、表单的状态
     * @param viewType 表单类型
     * @param editable 可编辑,默认false
     */
    switchStatus: function(viewType, editable) {
      this.viewType = viewType;
      this.dialogVisible = true;
      this.formType = viewType === "DETAIL" ? "details" : "edit";
      // this.formDisabled = !editable;
    },
    toDetail(row) {
      this.isShow = false;
      this.dialogVisible = true;
      this.formType = "DETAIL";
      const _this = this
      this.switchStatus("DETAIL", true);
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.constractForm.resetFields();
          this.formdata = clone(row, this.formdata)
          _this.$refs.constractForm.formdata = clone(row, _this.$refs.constractForm.formdata)
        }, 0)
      });

    },
    //取消
    cancelFn() {
      this.dialogVisible = false;
    },
    editdata(row) {
      this.dialogVisible = true;
      this.deleteApproveData = []
      this.formType = "EDIT";
      this.isShow = false;
      this.switchStatus("EDIT", true);
      this.addType = "";
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.constractForm.resetFields();
          this.formdata = clone(row, this.formdata)
          this.$refs.constractForm.formdata = clone(row, this.$refs.constractForm.formdata)
          this.resetTypeButton();
        })
      })
    },
    closeDialog() {
      this.dialogVisible = false;
      this.isDeleteTag = false;
    },
    selectChange(value) {
      this.typeOption.forEach(item => {
        if(item.key === value) {
          this.searchFormData.auditType = item.value
        }
      })
      // this.exportParam.createDate = this.searchFormdata.createDate;
      // this.exportParam.createOrg = this.searchFormdata.createOrg;
    },
    inputBlur() {
      // this.exportParam.policyName = this.searchFormdata.policyName;
      // this.exportParam.policyType = this.searchFormdata.policyType;
    },
    // 选择机构
    selectOrg(node) {
      this.searchFormData.orgId = node.orgId;
    },
    // 重置
    reset() {
      // this.resetTag();
      this.$refs.refFormDemo.resetFields();
      this.$refs.contractApproveConfig.remoteData();
    },
    //查询
    tempBtnFn() {
      const params = {
        ...this.searchFormData,
      }
      // const searchFormData = Object.keys(params).reduce((obj, k) => {
      //   if (params[k] && k) {
      //     obj[k] = k;
      //   }
      //   return obj;
      // }, {});
      this.$refs.contractApproveConfig.remoteData(params);
    }
  }
};
</script>

<style lang="scss" scoped>
/* .cus-search {
  margin-top: 16px;
  ::v-deep .el-form {
    margin-top: 16px;
    .el-form-item {
      margin-bottom: 8px;
    }
  }
} */
.el-radio{
  margin-bottom:2px;
}
.el-tag {
  margin-right: 10px;
}
.block-box {
  display: block;
  position: relative !important;
}
.radio-content-style {
  position: absolute;
  top: 0;
  right: 10px;
}
::v-deep {
  .el-table__header,
  .el-table__body {
    width: 100%;
  }
}
</style>
