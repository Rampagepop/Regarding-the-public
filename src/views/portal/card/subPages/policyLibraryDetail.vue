/* * @Author: chenzy13 * @Date: 2022-10-19 10:09:29 * @Last Modified
time:2022-10-19 10:09:29 */
<template>
  <div id="policy-library" style="width:100%">
    <yu-panel
      ref="panel"
      :title="$t('card.policyLibraryDetail')"
      class="adjust-height"
      @search="fuzzyQuery"
      clearable
      show-search-input
      :placeholder="$t('sysUserManager.gjz')"
    >
      <!--用户列表操作按钮-->
      <template slot="right">
        <yu-toolBar>
          <!-- 上传 -->
          <!-- <yu-button v-if="checkCtrl('upload')" v-norepeat.disabled @click="uploadFile">
            上传
          </yu-button> -->
        </yu-toolBar>
      </template>
      <!--用户列表查询条件-->
      <template slot="filter">
        <yu-xform
          ref="searchForm"
          related-table-name="policyLibrary"
          v-model="searchFormdata"
          form-type="search"
          @form-reset="formResetFn"
        >
          <yu-xform-group :column="4">
            <yu-xform-item
              label="制度名称"
              :placeholder="$t('sysUserManager.qsr')"
              @blur="inputBlur"
              name="policyName"
            >
            </yu-xform-item>
            <yu-xform-item
              label="制度类型"
              :placeholder="$t('sysUserManager.qxz')"
              @change="selectChange"
              ctype="select"
              :options="typeOption"
              name="policyType"
            ></yu-xform-item>
            <yu-xform-item
              label="上传时间"
              :placeholder="$t('sysUserManager.qsr')"
              @change="selectChange"
              ctype="datepicker"
              name="createDate"
            ></yu-xform-item>
            <yu-xform-item
              name="createOrg"
              :label="$t('sysUserManager.ssjg')"
              ctype="custom"
            >
              <yu-combo-tree
                ref="searchTree"
                v-model="searchOrgName"
                :placeholder="$t('sysUserManager.qxz')"
                :local-data="orgTreeData"
                data-id="orgId"
                data-label="orgName"
                data-pid="upOrgId"
                :clearable="true"
                @node-click="changeOrgIdFnSearch($event, false)"
                @clear="clearUpOrgIdFn(false)"
                @change="selectChangeSerch"
                :filter-node-method="filterNodeSearch"
                :all-node-value="true"
                :max-height="400"
              >
              </yu-combo-tree>
            </yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <!--用户列表-->
      <yu-xtable
        ref="policyLibrary"
        row-number
        :data-url="tableUrl"
        @loaded="renderOrg"
        :base-params="baseParams"
        json-data="data.list"
        json-total="data.total"
      >
        <yu-xtable-column label="制度名称">
          <template slot-scope="scope">
            <a class="underline" @click="policyLibraryDetailFn(scope.row)">{{
              scope.row.policyName
            }}</a>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="制度类型" prop="policyType">
          <template slot-scope="scope">
            <span v-for="(item, index) in typeOption" :key="'index' + index">
              <span v-if="scope.row.policyType === item.key">
                {{ item.value }}
              </span>
            </span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="上传时间" prop="createDate"></yu-xtable-column>
        <yu-xtable-column
          label="上传用户"
          prop="createUserName"
        ></yu-xtable-column>
        <yu-xtable-column label="所属机构" prop="createOrgName">
          <!-- <template slot-scope="scope">
            {{ getOrgName(scope.row, scope.row.createOrg) }}
          </template> -->
        </yu-xtable-column>
        <!-- <yu-xtable-column
          :all-node-value="true"
          :check-strictly="true"
          :clearable="true"
          :default-checked-keys="checkedOrg"
          :default-expand-all="true"
          :formatter="formatterOrgName"
          :key="treeKey"
          label="所属机构"
          :local-data="orgTreeData"
          :max-height="200"
          placeholder="所属机构"
          :show-checkbox="false"
          ctype="yu-combo-tree"
          data-id="orgId"
          data-label="orgName"
          data-pid="upOrgId"
          node-key="orgId"
          prop="createOrg"
        >
        </yu-xtable-column> -->
        <yu-xtable-column fixed="right" label="操作">
          <template slot-scope="scope">
            <!-- <yu-button v-if="checkCtrl('edit')" type="text" size="small" @click="editFile(scope.row)"
            >编辑</yu-button
            >
            <yu-button v-if="checkCtrl('delete')" type="text" size="small" @click="deleteData(scope.row)"
            >删除</yu-button
            > -->
            <yu-button
              @click="handleDownload(scope.row)"
              type="text"
              size="small"
            >下载</yu-button
            >
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <!-- 上传 -->
    <yu-xdialog
      :title="viewTitle[viewType]"
      :visible.sync="dialogVisible"
      size="large"
      width="960px"
      @close="closeDialog"
    >
      <yu-xform
        ref="infForm"
        v-model="formdata"
        label-width="100px"
        :form-type="formType"
        :rules="formRules"
      >
        <yu-xform-group :column="2">
          <!-- 制度名称 -->
          <yu-xform-item
            colspan="24"
            label="制度名称"
            name="policyName"
            :placeholder="$t('informationManager.qsr')"
          >
          </yu-xform-item>
          <!-- 制度类型 -->
          <yu-xform-item
            label="制度类型"
            name="policyType"
            ctype="select"
            :options="typeOption"
            :placeholder="$t('informationManager.qxz')"
          ></yu-xform-item>
          <yu-xform-item
            label="机构范围"
            name="applicableOrgs"
            class="display-range-item"
            ctype="custom"
          >
            <!-- 选展示范围（机构) -->
            <yu-combo-tree
              v-if="viewType !== 'DETAIL'"
              v-model="applicableOrgs"
              :multiple="true"
              :placeholder="$t('bannerManager.mrqb')"
              :data-url="treeUrl"
              data-id="orgId"
              data-label="orgName"
              data-pid="upOrgId"
              :clearable="true"
              @change="exportFiled($event, 'applicableOrgs')"
            ></yu-combo-tree>
            <!-- <yu-tooltip v-if="viewType === 'DETAIL'" placement="bottom" effect="light">
                <div v-html="getMessageTooltip(applicableOrgsName)" slot="content"></div>
                <div><span class="display-range">{{ applicableOrgsName }}</span><span class="display-range-num">({{ applicableOrgs.length }})</span></div>
                
              </yu-tooltip> -->
              
            <span
              v-if="viewType === 'DETAIL'"
              class="display-range"
              :title="applicableOrgsName"
            >{{ applicableOrgsName }}</span
            ><span v-if="viewType === 'DETAIL'" class="display-range-num">({{ applicableOrgs.length }})</span>
          </yu-xform-item>
          <yu-xform-item
            label="上传时间"
            name="createDate"
            ctype="select"
            v-if="viewType !== 'ADD'"
            :placeholder="$t('informationManager.qxz')"
          ></yu-xform-item>
          <yu-xform-item
            label="上传用户"
            colspan="12"
            name="createUserName"
            v-if="viewType !== 'ADD'"
            :placeholder="$t('informationManager.qxz')"
          ></yu-xform-item>

          <yu-xform-item
            label="所属机构"
            name="createOrgName"
            v-if="viewType !== 'ADD'"
            :placeholder="$t('informationManager.qxz')"
          >
            <!-- <yu-combo-tree
                ref="belongOrgTree"
                v-if="viewType !== 'DETAIL'"
                v-model="formdata.createOrg"
                :placeholder="$t('sysUserManager.qxz')"
                :local-data="orgTreeData"
                data-id="orgId"
                data-label="orgName"
                data-pid="upOrgId"
                :clearable="true"
                @node-click="changeOrgIdFn($event, false)"
                @change="selectChange"
                :filter-node-method="filterNode"
                :all-node-value="true"
                :max-height="400"
              >
              </yu-combo-tree>
              <span v-else>
                {{ getOrgnameByCId(orgTreeData, [formdata.createOrg]) }}
              </span> -->
          </yu-xform-item>
          <yu-xform-item
            label="角色范围"
            name="applicableRoles"
            class="display-range-item"
            colspan="10"
            ctype="custom"
          >
            <yu-xselect
              v-model="applicableRoles"
              placeholder="请选择"
              filterable
              remote
              multiple
              default-first-option
              collapse-tags
              :disabled="checkAllRole"
              :remote-method="remoteMethodFn"
              :options="roleOptions"
              :loading="loading"
              class="mul-chose-role"
              ref="roleResetSelect"
              @change="exportFiled($event, 'applicableRoles')"
              v-if="viewType !== 'DETAIL'"
            >
            </yu-xselect>
            <span v-if="viewType === 'DETAIL'" class="display-range" :title="applicableRolesName">{{ applicableRolesName }}</span><span v-if="viewType === 'DETAIL'" class="display-range-num">({{ applicableRoles.length }})</span>
            <!-- <yu-tooltip v-if="viewType === 'DETAIL'" placement="bottom" effect="light">
                <div v-html="getMessageTooltip(applicableRolesName)" slot="content"></div>
                <div><span class="display-range">{{ applicableRolesName }}</span><span class="display-range-num">({{ applicableRoles.length }})</span></div>
              </yu-tooltip> -->
          </yu-xform-item>
          <yu-xform-item style="margin-left:10px;" v-if="viewType !== 'DETAIL'" label="" ctype="custom" name="custom" colspan="2">
            <yu-checkbox v-model="checkAllRole" @change="choseAllRole" label="全部"></yu-checkbox>
          </yu-xform-item>
          <yu-xform-item
            colspan="24"
            label="制度文件"
            ctype="custom"
            name="fileIds"
          >
            <!-- :action="uploadAction" -->
            <yu-upload
              v-if="viewType !== 'DETAIL'"
              class="upload-c"
              drag
              :limit="30"
              action=""
              ref="uploadFileObj"
              :headers="uploadHeader"
              :file-list="fileList"
              muitiple
              :http-request="uploadFileHttp"
              :accept="accepttype"
              :show-file-list="true"
              :on-success="handleImageSuccess"
              :multiple="true"
              :before-upload="beforeImageUpload"
              :on-remove="handleRemove"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                上传每个附件不超过50M，每次最多支持30个附件
              </div>
              <!--<div v-if="fileList.length > 0" class="el-upload__tip" slot="tip">{{ $t('cardManager.znscyztp') }}</div>-->
            </yu-upload>
            <div v-if="viewType === 'DETAIL' && fileDtlInfos.length">
              <p
                :key="index + 'file'"
                style="color:#2877ff;cursor: pointer;"
                @click="handleDownload(item)"
                v-for="(item, index) in fileDtlInfos"
              >
                <svg-icon
                  :icon-class="getFileExtClass(item)"
                  class="pdf-icon"
                />
                <a style="color:#2877ff;">{{ item.fileOriginalName }}</a>
              </p>
            </div>
            <div v-if="viewType === 'EDIT' && !fileDtlInfos.length">无</div>
          </yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" class="yu-grpButton">
        <!-- <yu-button
          v-if="checkCtrl('delete') && viewType === 'DETAIL'"
          @click="chgInfStsFn(formdata, 1)"
        >{{ $t("informationManager.sc") }}</yu-button
        > -->
        <yu-button @click="saveData(viewType)" v-if="viewType !== 'DETAIL'"
        >保存</yu-button
        >
        <yu-button @click="cancelFn">{{
          $t("informationManager.qx")
        }}</yu-button>
      </div>
    </yu-xdialog>
    
  </div>
</template>
<script>
import { getRolesList } from "@/api/common/oauth";
import { mapGetters } from "vuex";
import { clone, extend, lookup } from "@/utils";
import { getAccessToken } from "@/utils/oauth";
import { validator } from "@/utils/validate";
import { checkBelongToChooseNode } from "@/utils/util";
export default {
  components: { },
  data: function() {
    return {
      tempEditData:{}, //用于暂存编辑数据，选择全部的角色还能返回回去
      checkAllRole:false,
      applicableOrgsName: "",
      applicableRolesName: "",
      applicableOrgs: [],
      applicableRoles: [],
      typeOption: [
        { value: "行内制度", key: 1 },
        { value: "监管制度", key: 2 },
        { value: "其他", key: 3 }
      ],
      formType: "ADD",
      // uploadAction: getUploadFileUrl(), // 内容上传地址
      uploadHeader: { Authorization: "Bearer " + getAccessToken() },
      fileListInfo: [],
      loadFileNum: 0, // 正在现在的文件数量
      fileList: [],
      fileIds: [], // 缩略图
      fileDtlInfos: [],
      roleOptions: [],
      loading: false,
      selectedRole: "",
      accepttype:".rtf,.txt,.docx,.pdf,.doc,.xlsx,.xls,.csv,.pptx,.ppt,.mp4,.wmv,.gif,.jpg,.png,.emf,.svg,.jpeg",
      showRangeArr: [], //展示范围机构id数组
      formdata: {
        applicableOrgs: [],
        policyName: "",
        policyType: "",
        fileIds: [],
        createDate: "",
        createUserName: "",
        //createOrg: "",
        createOrgName:"",
        applicableRoles: []
      }, // 表单数据
      tableUrl: backend.portalService + "/api/xmhpolicy/search", // 用户列表查询地址
      dialogVisible: false, // 弹出框是否展示
      viewType: "ADD", // 弹出框默认新增
      viewTitle: lookup.find("CRUD_TYPE", false), // 弹出框类型
      formDisabled: false, // 表单是否禁用
      treeUrl: backend.appOcaService + "/api/adminsmorg/treequeryauth", // 用户树请求 url
      props: { label: "orgName", children: "children" },
      orgName: "", // 机构树搜索关键字
      formRules: {
        policyName: [
          { required: true, message: this.$t("sysUserManager.btx") },
          { max: 50, message: "制度名称不能超过50个字符" }
        ], // 规则名称
        policyType: [
          {
            required: true,
            message: this.$t("sysUserManager.btx"),
            trigger: ["blur", "change"]
          }
        ], // 规则类型
        applicableOrgs: [
          {
            required: true,
            message: this.$t("sysUserManager.btx"),
            trigger: "blur"
          }
        ], // 用户代码校验
        applicableRoles: {
          required: true,
          message: this.$t("sysUserManager.btx"),
          trigger: '["blur", "change"]'
        },
        fileIds: { required: true, message: this.$t("sysUserManager.btx") }
      }, // 表单验证规则
      userDialogVisible: false, // 用户用户弹框是否显示
      userFormdata: {}, // 用户用户查询表单数据
      userTableParams: { userId: "" }, // 用户用户表查询参数
      treeParams: {
        dataId: "orgId",
        dataLabel: "orgName",
        dataPid: "updptId",
        dataUrl: backend.appOcaService + "/api/adminsmorg/treequeryauth",
        placeholder: this.$t("sysUserManager.qxz"),
        searchKey: "orgName", // 树过滤关键字
        dataParams: {
          orgSts: "A"
        } // 额外请求参数 默认查询生效的机构
      }, // 机构树选择
      selectValue: "", // 弹出框上级机构显示值
      detailsValue: "", // 搜索树详情字段
      searchOrgName: "", // 查询机构名称
      
      sysSelectOrgName: "", // 查询机构名称
      sysSelectOrgRoles: "", // 查询机构名称
      searchFormdata: {
        policyName: "",
        policyType: null,
        createDate: "",
        createOrg: '',
      }, // 查询表单数据
      baseParams:{
        applicableRoles: []
      },
      userSts: {}, // 用户状态
      dptTreeParams: {
        dataId: "dptId",
        dataLabel: "dptName",
        dataPid: "upDptId",
        // localData: [],
        dataUrl: backend.appOcaService + "/api/adminsmdpt/tree",
        dataParams: {},
        placeholder: this.$t("sysUserManager.qxz"),
        searchKey: "dptName" // 树过滤关键字
      },
      selectedDptId: "", // 选中的部门ID
      detailsDptValue: "", // 部门详情字段
      relDialogVisible: false, // 用户关联信息弹出框
      treeKey: "",
      activeName: "org", // 关联信息默认展示角色
      rolesTableUrl: backend.appOcaService + "/api/adminsmuser/queryuserrole", // 角色关联查询地址
      roleKeyWord: "", // 角色查询关键字
      currentUser: {}, // 查询关联信息的当前用户
      dutysTableUrl: backend.appOcaService + "/api/adminsmuser/queryuserduty", // 岗位关联查询地址
      dutyKeyWord: "", // 岗位查询关键字
      orgKeyWord: "", // 关联机构查询关键字
      orgTreeParams: { userId: "" },
      checkedOrg: [], // 已关联的机构数据
      dutySelect: false, // 岗位关联表是否勾选过
      roleSelect: false, // 角色关联表是否勾选过
      dutysTable: [], // 岗位关联表默认勾选数据
      rolesTable: [], // 角色关联表默认勾选数据
      // orgInfoMap: {}, // 机构数map数据
      roleInfoMap: {}, // 角色数map数据
      tagEditting: [], // 标签列表编辑状态
      smOrgUrl: "", // 显示用户的有权限机构的url
      smRelRoleUrl: "", // 用户已关联的角色列表的url
      userAvatar: "", // 用户头像
      uploadAction: yufp.util.addTokenInfo(
        backend.portalService + "/api/xmhpolicy/upload"
      ), // 头像上传地址
      excelExportUrl: backend.appOcaService + "/api/adminsmuser/excelexport", // Excel导出地址
      exportParam: {
        // 文件导出参数
        loginCode: "", // 日志类型
        userName: "", // 操作用户
        userCode: "", // 操作对象ID
        keyWord: "",
        orgId: "",
        userSts: null
      }, // 导出时的查询参数
      pickerOptions: {
        disabledDate: function(time) {
          return time.getTime() < Date.now() - 8.64e7;
        } // 用户有效期禁用当前之前的日期
      },
      collapseTitle: [
        this.$t("sysUserManager.zk"),
        this.$t("sysUserManager.sq")
      ],
      removeData:{
        policyId:null,
        fileIds:[]
      }, //用于存储删除的数据
      rowBackup: {
        orgId: "",
        roleID: ""
      }, // 标签列表编辑时的备份
    };
  },
  computed: {
    ...mapGetters(["orgTreeData", "rolesData", "selectedRoles"])
  },
  watch: {
    orgName: function(newVal, oldVal) {
      this.$refs.tree.filter(newVal);
    },
    searchOrgName: function(newVal, oldVal) {
      this.$refs.searchTree.filter(newVal);
    }
  },
  created() {
    this.baseParams.applicableRoles = [this.$store.getters.selectedRoles.roleId]
  },
  mounted: function() {},
  methods: {
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
    },
    //上传文件接口 让接口通过拦截器
    uploadFileHttp(data) {
      const _this = this;
      // eslint-disable-next-line no-undef
      const formData = new FormData();
      formData.append('file', data.file)
      this.$request({
        url: `${_this.$backend.portalService}/api/xmhpolicy/upload`,
        data: formData
      }).then(res => {
        if (res && res.code === "0") {
          // this.$refs.policyLibrary.remoteData();
          this.handleImageSuccess(data.file, res)
          // _this.$message.success("附件上传成功");
        }
      });  
    },
    //计算tooltip换行问题
    getMessageTooltip(str) {
      //40length换行，拼接数据
      let curstr = ''
      const num = 40;
      for(var i = 0;i < Math.ceil(str.length / num);i++) {
        curstr += (str.substring(i * num, (i + 1) * num) + ((Math.ceil(str.length / num) !== 1 && i < Math.ceil(str.length / num) && i !== Math.ceil(str.length / num)) ? `<br/>` : ""))
      }
      return curstr
    },
    //选择全部角色
    choseAllRole(event) {
      this.checkAllRole = event.target.checked;
      if(event.target.checked) {
        this.applicableRoles = []
        this.roleOptions.forEach(item => {
          this.applicableRoles.push(item.key)
        });
        this.applicableRolesName = this.roleOptions.map(item => {
          return item.value
        }).join(',')
        this.$refs.infForm.formdata.applicableRoles = this.applicableRoles
      }else{
        this.$refs.infForm.formdata.applicableRoles = []
        //[]this.tempEditData.applicableRoles
        this.applicableRoles = []
        //this.tempEditData.applicableRoles
      }  
    },
    //递归查找机构名通过id
    getOrgnameByCId(array, orgdata) {
      let name = "";
      if (array && array.length) {
        array.forEach(item => {
          orgdata.forEach(lt => {
            if (item.orgId === lt) {
              name = item.orgName;
              return name;
            }
          });
          if (item.children && item.children.length) {
            this.getOrgnameByCId(item.children, orgdata);
          }
        });
        return name;
      }
    },
    //table表格反显机构计算
    getOrgName(row, value) {
      const data = this.getOrgnameByCId(this.orgTreeData, [value]);
      return data;
    },
    renderOrg() {
      this.$nextTick(() => {
        this.$store.dispatch("funData/orgTreeFn");
        this.$store.dispatch("funData/rolesDataFn");
        this.getRoles(); //获取下拉角色数组
      });
    },
    //删除
    deleteData(data) {
      var _this = this;
      // "是否删除该合同审核要点配置？"
      _this
        .$confirm("是否删除该条政策制度", "确认", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
        .then(function() {
          _this.$request({
            url: `${_this.$backend.portalService}/api/xmhpolicy/delete`,
            data: {
              ...data
            }
          }).then(res => {
            if (res && res.code === "0") {
              _this.$refs.policyLibrary.remoteData();
              _this.$message.success("删除成功");
            }
          });
        }).catch(err => {
          console.log(err, 'err')
        }) 
    },
    //下载
    handleDownload(data) {
      //一个文件下载是文件多个是压缩包
      // download(yufp.util.addTokenInfo(`${this.$backend.portalService}/api/xmhpolicy/download`+ '?policyId=' + data.policyId));
      this.$request({
        url: `${this.$backend.portalService}/api/xmhpolicy/download`,
        responseType: "arraybuffer",
        // responseType: "blob",
        data: {
          ...data
        }
      }).then(res => {
        if (!res) {
          return;
        }
        const blob = new Blob([res.data]);
        const url = window.URL.createObjectURL(blob);
        // 重命名文件名称
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(new Blob([res.data]));
        link.target = "_blank";
        const filename = res.headers["content-disposition"] ? res.headers["content-disposition"].split("=")[1] : '';
        link.download = decodeURI(filename); // 下载的文件名称
        document.body.appendChild(link); // 添加创建的 a 标签 dom节点
        link.click(); // 下载
        document.body.removeChild(link); // 移除节点
      });
    },
    //保存附件
    saveData(type) {
      var _this = this;
      var validate = false;
      this.$delete(this.$refs.infForm.formdata, "fileList");
      this.$delete(this.$refs.infForm.formdata, "fileMap");
      _this.$refs.infForm.validate(function(valid) {
        validate = valid;
      });
      if (!validate) {
        return;
      }
      this.$request({
        url: `${this.$backend.portalService}/api/xmhpolicy/save`,
        data: {
          ...this.$refs.infForm.formdata,
          page: 0,
          size: 0
        }
      }).then(res => {
        if (res && res.code === "0") {
          this.dialogVisible = false;
          if (type === "ADD") {
            this.$message.success("新增成功");
          } else {
            this.$message.success("保存成功");
          }
          if(this.removeData.fileIds.length) {
            this.$request({
              url: `${this.$backend.portalService}/api/xmhpolicy/delfile`,
              data: this.removeData
            }).then(res => {
              if (res && res.code === "0") {
              // this.$message.success("删除成功");
              }
            });
          }
          
          this.$refs.policyLibrary.remoteData();
        }
      });
    },
    //重置数据
    resetData() {
      this.formdata = {
        applicableOrgs: [],
        policyName: "",
        policyType: "",
        fileIds: [],
        createDate: "",
        createUserName: "",
        createOrg: "",
        applicableRoles: []
      }; // 表单数据
    },
    // 移除上传文件
    handleRemove(file, fileList) {
      if(file.status === "success") {
        if (this.fileDtlInfos && this.fileDtlInfos.length) {
          this.fileDtlInfos.forEach((item, index) => {
            if (item.fileId === file.uid) {
              this.fileDtlInfos.splice(index, 1);
              this.fileList.splice(index, 1);
              this.removeData.policyId = this.$refs.infForm.formdata.policyId 
              this.removeData.fileIds.push(item.fileId)
            }
          });
        }
        this.$refs.infForm.formdata.fileIds = []
        if(file && file.status === "success") {
          if (fileList.length) {
            fileList.forEach(item => {
              this.$refs.infForm.formdata.fileIds.push(item.response ? item.response.data : item.uid + "|" + item.name)
            });
          } else {
            this.$refs.infForm.formdata.fileIds = [];
          }  
        }
      }
    },
    /**
     * 上传内容成功
     */
    handleImageSuccess: function(file, res) {
      if(!res) {
        this.$message.error("上传失败")
      }else{
        this.fileList = this.$refs.uploadFileObj.uploadFiles;
        // if (fileList.length > 30) {
        //   this.$message.error("附件个数不应该超过30个");
        // } 
        if(res.code === '0') {
          if (res.data) {
            this.$refs.infForm.formdata.fileIds.push(res.data && res.data);
            file.uid = res.data.split('|')[0];
            this.fileDtlInfos.push({"fileId":res.data.split('|')[0], "fileOriginalName":res.data.split('|')[1], "policyId":this.$refs.infForm.formdata.policyId })
          }
        }else{
          //避免上传不成功还能展示在list上面
          this.$refs.uploadFileObj.uploadFiles.forEach((item, index) => {
            if(item.response && item.response.code !== '0') {
              this.$refs.uploadFileObj.uploadFiles.splice(index, 1)
              this.$message.error(file.name + ":" + res.message);
            }
          })
        }
        // }
      }
    
    },
    /**
     * 文件上传之前获取上传校验
     */
    beforeImageUpload: function(file) {
      const fileName = file.name ? file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase() : ''
      const _this = this;
      const size = file.size / 1024 / 1024 < 50;
      let filesamename = false;
      if (this.accepttype.indexOf(fileName) === -1) {
        setTimeout(() => {
          this.$message({
            message:"只支持.rtf,.txt,.docx,.pdf,.doc,.xlsx,.xls,.csv,.pptx,\nppt,.mp4,.wmv,.gif,.jpg,.png,.emf,.svg,.jpeg类型的文件",
            lineBreak:true,
            duration:3000
          });
        }, 0)
        
      }
      if (!size) {
        this.$message.error("文件不能大于50M");
      }
      this.fileList.forEach(item => {
        if(item.name === file.name) {
          setTimeout(() => {
            this.$message.warning(file.name + ':同名同类的文件只能上传一次');
          }, 0)
          filesamename = true
        }
      })
      return !filesamename && size && (this.accepttype.indexOf(fileName) !== -1)
    },
    //角色远程搜索
    remoteMethodFn(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.roleOptions = this.rolesData.filter(item => {
            return (
              item.roleName.toLowerCase().indexOf(query.toLowerCase()) > -1
            );
          });
        }, 200);
      } else {
        this.roleOptions = [];
      }
    },
    exportFiled(event, type) {
      //赋值
      if (type === "applicableOrgs") {
        this.$refs.infForm.formdata[type] = event;
      } else {
        this.$refs.infForm.formdata.applicableRoles = event;
        const choseroles = [];
        event.forEach(item => {
          choseroles.push(item)
        })
        const allroles = this.roleOptions.map(item => {
          return item.key
        })
        if(allroles.sort().toString() === choseroles.sort().toString()) {
          this.checkAllRole = true 
        }
      }
    },
    //新增上传文件
    uploadFile() {
      this.switchStatus("ADD", true);
      this.checkAllRole = false;
      this.$nextTick(() => {
        this.$refs.infForm.resetFields();
        this.resetData();
        this.applicableOrgs = [];
        this.applicableRoles = [];
        this.fileDtlInfos = [];
        this.removeData.fileIds = [];
        this.fileList = [];
        this.$store.dispatch("funData/rolesDataFn");
        this.getRoles();
        this.dialogVisible = true;
        this.formType = "ADD";
      });
    },
    //编辑文件
    editFile(row) {
      const _this = this;
      this.formType = "EDIT";
      this.checkAllRole = false;
      this.switchStatus("EDIT", true);
      this.$nextTick(() => {
        this.$refs.infForm.resetFields();
        this.$refs.infForm.formdata.fileIds = [];
        this.$store.dispatch("funData/rolesDataFn");
        this.getRoles();
        _this.$refs.infForm.formdata = clone(row, _this.$refs.infForm.formdata);
        _this.formdata = clone(row, _this.formdata);
        this.removeData.fileIds = [];
        this.applicableOrgs = _this.formdata.applicableOrgs;
        this.applicableRoles = _this.formdata.applicableRoles;
        if (row.fileMap && row.fileMap.length) {
          this.fileDtlInfos = [...row.fileMap];
          this.fileList = row.fileMap.map(item => {
            return {
              name: item.fileOriginalName,
              uid: item.fileId
            };
          });
          row.fileMap.forEach(item => {
            _this.$refs.infForm.formdata.fileIds.push(
              item.fileId + "|" + item.fileOriginalName
            );
          });
        }
        this.dialogVisible = true;
      });
    },
    //获取角色
    getRoles(keyWord, cb) {
      this.roleOptions = this.rolesData.map(it => {
        return {
          value: it.roleName,
          key: it.roleId
        };
      });
    },
    /**
     * 快速查询
     * @param e 模糊查询关键字
     */
    fuzzyQuery: function(e) {
      var param = { policyName: e.value, applicableRoles:[] };
      this.$refs.policyLibrary.remoteData(param);
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    selectChangeSerch() {
      this.exportParam.createDate = this.searchFormdata.createDate;
      this.exportParam.applicableOrgs = [this.searchFormdata.createOrg];
    },
    selectChange() {},
    inputBlur() {
      this.exportParam.policyName = this.searchFormdata.policyName;
      this.exportParam.policyType = this.searchFormdata.policyType;
    },
    keyBlur: function(e) {
      this.exportParam = { keyWord: e.value, orgId: this.orgName };
    },
    // 根据文件类型获取对应的图标
    getFileExtClass(item) {
      const index = item.fileOriginalName.lastIndexOf(".");
      let type;
      if (index !== -1) {
        type = item.fileOriginalName.substr(index + 1);
      }
      switch (type.toLowerCase()) {
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
          return "word";
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
    changeOrgIdFnSearch:function(node, immidately) {
      if (immidately) {
        this.orgName = node.orgId;
        this.$refs.policyLibrary.remoteData({ createOrg: node.orgId });
        return;
      }
      this.searchFormdata.createOrg = node.orgId;
      this.searchOrgName = node.orgId;
    },
    /**
     * 通过所属机构查询
     * @param node 点击的节点信息
     * @param immidately 是否立即执行查询，区分快速查询和精确查询
     */
    changeOrgIdFn: function(node, immidately) {
      if (immidately) {
        this.orgName = node.orgId;
        this.$refs.policyLibrary.remoteData({ createOrg: node.orgId });
        return;
      }
      this.searchFormdata.createOrg = node.orgId;
      this.searchOrgName = node.orgId;
    },
    /**
     * 清空所属机构查询条件
     * @param immidately 是否立即执行查询，区分快速查询和精确查询
     */
    clearUpOrgIdFn: function(immidately) {
      if (immidately) {
        this.$refs.usersTable.remoteData({
          orgId: ""
        });
        return;
      }
      this.$delete(this.searchFormdata, 'createOrg')
      // this.searchFormdata.createOrg = [""];
      this.searchOrgName = "";
    },
    /**
     * 清空所属机构查询条件
     * @param immidately 是否立即执行查询，区分快速查询和精确查询
     */
    formResetFn: function() {
      this.$refs.searchForm.resetFields();
      this.searchFormdata.orgId = "";
      this.searchOrgName = "";
    },
    /**
     * 关闭弹出框
     */
    cancelFn: function() {
      this.dialogVisible = false;
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
      this.formDisabled = !editable;
    },
    //递归查找机构名通过id 所属范围
    getOrgnameById(array, orgdata) {
      if (array && array.length) {
        array.forEach(item => {
          orgdata.forEach(lt => {
            if (item.orgId === lt) {
              this.applicableOrgsName +=
                item.orgName + (orgdata.length > 1 ? "/" : "");
            }
          });
          if (item.children && item.children.length) {
            this.getOrgnameById(item.children, orgdata);
          }
        });
      }
    },
    /**
     * 用户详情
     * @param row 当前用户信息
     */
    policyLibraryDetailFn: function(row) {
      var _this = this;
      _this.switchStatus("DETAIL", true);
      _this.$nextTick(function() {
        this.formType = "DETAIL";
        this.switchStatus("DETAIL", true);
        this.applicableRolesName = "";
        this.applicableOrgsName = "--";
        this.$nextTick(() => {
          this.$store.dispatch("funData/rolesDataFn");
          this.getRoles();
          this.$refs.infForm.resetFields();
          clone(row, _this.$refs.infForm.formdata);
          this.applicableOrgs = _this.formdata.applicableOrgs;
          this.applicableRoles = _this.formdata.applicableRoles;
          // this.getOrgnameById(this.orgTreeData, this.applicableOrgs);
          this.getOrgInfoPage(orgInfoMap => {
            this.applicableOrgsName = this.applicableOrgs.map(orgId => orgInfoMap[orgId] ? orgInfoMap[orgId].orgName : "--").join('/')
          })
          this.roleOptions.forEach(item => {
            this.applicableRoles.forEach((lt, index, array) => {
              if (lt === item.key) {
                this.applicableRolesName +=
                  item.value + (array.length > 1 ? "," : "");
              }
            });
          });
          if (this.applicableRoles.length > 1) {
            this.applicableRolesName = this.applicableRolesName.substr(
              0,
              this.applicableRolesName.length - 1
            );
          }
          if (this.applicableOrgs.length > 1) {
            this.applicableOrgsName = this.applicableOrgsName.substr(
              0,
              this.applicableOrgsName.length - 1
            );
          }
          this.fileDtlInfos = row.fileMap;
          this.dialogVisible = true;
        });
      });
    },
    filterNode: function(value, nodeData, node) {
      if (!this.$refs.belongOrgTree.selectedLabel) {
        return true;
      }
      if (
        nodeData.orgName.indexOf(this.$refs.belongOrgTree.selectedLabel) !== -1
      ) {
        return true;
      }
      return checkBelongToChooseNode(
        this.$refs.belongOrgTree.selectedLabel,
        node,
        "orgName"
      );
    },
    /**
     * 精确机构树搜索
     * @param value 当前输入信息
     * @param nodeData 当前节点属性信息
     * @param node 当前节点信息
     */
    filterNodeSearch: function(value, nodeData, node) {
      if (!this.$refs.searchTree.selectedLabel) {
        return true;
      }
      if (
        nodeData.orgName.indexOf(this.$refs.searchTree.selectedLabel) !== -1
      ) {
        return true;
      }
      return checkBelongToChooseNode(
        this.$refs.searchTree.selectedLabel,
        node,
        "orgName"
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.yu-user-pic-cust {
  padding-bottom: 20px;
}
.el-upload-list {
  max-height: 120px;
  overflow: auto;
}
#policy-library .mul-chose-role .el-input .el-input__inner {
  height: auto !important;
}

.el-form-details .yu-user-pic-cust {
  padding-bottom: 12px;
}
.display-range{
  width:90%
}
::v-deep {
  .el-table__header,
  .el-table__body {
    width: 100%;
  }
}

.el-form-details .yu-user-pic-cust {
  padding-bottom: 13px;
}

.dialog-search-user .el-input {
  width: 100%;
}
::v-deep .compact .yu-xform .search-btn{
  height:52px;
}
.el-table .info-row {
  background: #c9e5f5;
}
</style>
