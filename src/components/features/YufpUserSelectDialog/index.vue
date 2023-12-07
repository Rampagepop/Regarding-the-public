<template>
  <div>
    <el-input
      v-model="selectedVal"
      readonly
      :placeholder="placeholder"
      :disabled="disabled"
      :size="size"
      :name="name"
      :icon="icon"
      :on-icon-click="onIconClickFn"
      @click.native="clickFn"
    >
    </el-input>
    <el-dialog-x
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      @open="dialogOpen"
      @close="afterClose"
    >
      <el-card class="box-card" v-show="true">
        <el-tag
          v-for="tag in selectedOpts"
          :key="tag.key"
          type="success"
          closable
          @close="TagClose(tag)"
        >
          {{ tag.value }}
        </el-tag>
      </el-card>
      <el-tabs type="border-card" v-model="paneValue" @tab-click="TabClick">
        <el-tab-pane
          v-for="item in selectInfos"
          :key="item.key"
          :label="item.label"
          :name="item.key"
        >
          <yu-form :inline="true" :model="queryFields">
            <yu-form-item>
              <yu-input
                v-model="queryFields.id"
                :placeholder="$t('wfuserselect.no')"
                v-if="item.key != 'nodeUser'"
              ></yu-input>
              <yu-input
                v-model="queryFields.id"
                :placeholder="$t('wfuserselect.method')"
                v-if="item.key == 'nodeUser'"
              ></yu-input>
            </yu-form-item>
            <yu-form-item>
              <yu-input
                v-model="queryFields.name"
                :placeholder="$t('wfuserselect.name')"
                v-if="item.key != 'nodeUser'"
              ></yu-input>
              <yu-input
                v-model="queryFields.name"
                :placeholder="$t('wfuserselect.ext')"
                v-if="item.key == 'nodeUser'"
              ></yu-input>
            </yu-form-item>
            <yu-form-item>
              <yu-button type="primary" @click="doQuery">{{ $t('wfuserselect.search') }}</yu-button>
            </yu-form-item>
            <yu-form-item>
              <yu-button @click="reset">{{ $t('wfuserselect.reset') }}</yu-button>
            </yu-form-item>
          </yu-form>
          <el-table
            ref="reftable"
            :data="item.selectOptions"
            @row-dblclick="RowDbClick"
            v-if="item.key != 'nodeUser'"
          >
            <el-table-column prop="key" :label="$t('wfuserselect.no')" align="center">
            </el-table-column>
            <el-table-column prop="value" :label="$t('wfuserselect.method')" align="center">
            </el-table-column>
          </el-table>
          <el-table
            ref="reftable"
            :data="item.selectOptions"
            @row-dblclick="RowDbClickExt"
            v-if="item.key == 'nodeUser'"
          >
            <el-table-column prop="key" :label="$t('wfuserselect.name')" align="center">
            </el-table-column>
            <el-table-column prop="value" :label="$t('wfuserselect.ext')" align="center">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"

          :page-sizes="[5, 10, 15, 20]"
          :page-size="pagesize"
          :current-page="currentPage"
          :total="total"
          @current-change="CurrentChange"
          @size-change="SizeChange"
          v-if="tabName !== 'relation'"
        >
        </el-pagination>
        <el-tab-pane key="relation" :label="$t('wfuserselect.relation')" name="relation">
          <yu-form :model="queryFields" align="center" label-width="100px">
            <yu-form-item :label="$t('wfuserselect.selectable')">
              <yu-xselect v-model="relation" value-type="string" :options="relations" @change="relactionChange" filterable :clearable="false"></yu-xselect>
            </yu-form-item>
          </yu-form>
        </el-tab-pane>
      </el-tabs>
      <div align="center" style="margin-top: 20px" class="dialog-footer">
        <el-button type="primary" @click="dialogClose">{{ $t('wfuserselect.selectreturn') }}</el-button>
      </div>
    </el-dialog-x>
  </div>
</template>
<script>
/**
 * yufp-user-select-dialog
 * 办理人员选择弹窗自定义组件
 * 注：自定义组件规范：
 * 1、对外默认提供v-model配置,raw-value
 * 2、对外提供readonly、disabled、size属性
 * 3、对外接口事件：select-fn,具体参数请自定义
 * Created by zhouqh on 2019/12/31.
 */
/* eslint vue/require-prop-types:0 */
import { mapGetters } from 'vuex'
export default {
  name: "YufpUserSelectDialog",
  props: {
    // 下述字段为el-input组件中部分属性，配置文档参见element-ui
    name: {
      type: String,
    },
    value: {
      required: true,
    },
    rawValue: String,
    size: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "search",
    },
    params: Object,
  },
  data: function () {
    return {
      url: {
        getuserinfo: backend.workflowService + "/api/org/info",
      },
      selectedVal: "",
      dialogVisible: false,
      dialogTitle: this.$t('wfuserselect.title'),
      selectInfos: [],
      selectedOpts: [],
      urls: [
        {
          label: this.$t('wfuserselect.user'),
          key: "user",
          value: backend.workflowService + "/api/org/users",
        },
        {
          label: this.$t('wfuserselect.dept'),
          key: "dept",
          value: backend.workflowService + "/api/org/depts",
        },
        {
          label: this.$t('wfuserselect.role'),
          key: "role",
          value: backend.workflowService + "/api/org/roles",
        },
        {
          label: this.$t('wfuserselect.duty'),
          key: "duty",
          value: backend.workflowService + "/api/org/dutys",
        },
        {
          label: this.$t('wfuserselect.org'),
          key: "org",
          value: backend.workflowService + "/api/org/orgs",
        },
        {
          label: this.$t('wfuserselect.taskpool'),
          key: "pool",
          value: backend.workflowService + "/api/taskpool/query",
        },
        {
          label: this.$t('wfuserselect.diy'),
          key: "nodeUser",
          value: backend.workflowService + "/api/studio/method",
        },
      ],
      queryFields: {
        id: "",
        name: "",
      },
      index: 0,
      pagesize: 5,
      currentPage: 1,
      tabName: "user",
      total: 0,
      customize: "",
      paneValue: "user",
      relations: [],
      relation: "A.00",
      relationConvert: {
        'A.00': this.$t('wfuserselect.A00'),
        'A.01': this.$t('wfuserselect.A01'),
        'A.02': this.$t('wfuserselect.A02'),
        'A.03': this.$t('wfuserselect.A03'),
        'A.04': this.$t('wfuserselect.A04'),
        'A.05': this.$t('wfuserselect.A05'),
        'A.06': this.$t('wfuserselect.A06'),
        'A.07': this.$t('wfuserselect.A07'),
        'A.12': this.$t('wfuserselect.A12'),
        'A.13': this.$t('wfuserselect.A13'),
        'A.14': this.$t('wfuserselect.A14'),
        'A.15': this.$t('wfuserselect.A15'),
        'A.16': this.$t('wfuserselect.A16'),
        'A.17': this.$t('wfuserselect.A17')
      }
    };
  },
  computed: {
    ...mapGetters(['org'])
  },
  watch: {
    value: function (val) {
      // 将key转换为对应的value值
      if (!val) {
        this.selectedVal = "";
        return;
      }
      this.selectedVal = this.selectedVal ? this.selectedVal : val;
    },
    rawValue: function (val) {
      this.selectedVal = val;
    },
  },
  mounted: function () {
    this.selectedVal = this.rawValue ? this.rawValue : this.value;
    this.initData();
    this.getUserInfo("user");
    this.relations = [
      {key: 'A.00', value: this.$t('wfuserselect.A00')},
      {key: 'A.01', value: this.$t('wfuserselect.A01')},
      {key: 'A.02', value: this.$t('wfuserselect.A02')},
      {key: 'A.03', value: this.$t('wfuserselect.A03')},
      {key: 'A.04', value: this.$t('wfuserselect.A04')},
      {key: 'A.05', value: this.$t('wfuserselect.A05')},
      {key: 'A.06', value: this.$t('wfuserselect.A06')},
      {key: 'A.07', value: this.$t('wfuserselect.A07')},
      {key: 'A.12', value: this.$t('wfuserselect.A12')},
      {key: 'A.13', value: this.$t('wfuserselect.A13')},
      {key: 'A.14', value: this.$t('wfuserselect.A14')},
      {key: 'A.15', value: this.$t('wfuserselect.A15')},
      {key: 'A.16', value: this.$t('wfuserselect.A16')},
      {key: 'A.17', value: this.$t('wfuserselect.A17')},
    ]
  },
  methods: {
    // 查询按钮
    doQuery: function () {
      this.getUserInfo(this.tabName);
    },
    // 重置按钮
    reset: function () {
      this.queryFields.id = "";
      this.queryFields.name = "";
    },
    clickFn: function () {
      this.$emit("click-fn", this);
    },
    onIconClickFn: function (val) {
      if (this.disabled) {
        return;
      }
      this.dialogVisible = true;
    },
    // tab页点击事件
    TabClick: function (tab, event) {
      this.tabName = tab.name;
      if(tab.name !== 'relation') {
        this.reset();
        this.getUserInfo(tab.name);
      } else if(this.relation === "A.00" && this.selectedVal) {
        var strs = this.selectedVal.split(";");
        for(var i in strs) {
          if("A" === strs[i].substring(0, 1)) {
            this.relation = strs[i];
          }
        }
      }
    },
    // 初始化表格数据信息
    initData: function () {
      for (var i = 0; i < this.urls.length; i++) {
        var url = this.urls[i];
        var option = {
          key: url.key,
          label: url.label,
          selectOptions: [],
          total: 0,
        };
        this.selectInfos.push(option);
      }
    },
    // 获取人员与部门等信息
    getUserInfo: function (val) {
      var conditions = {
        page: this.currentPage,
        size: this.pagesize,
        // orgId: this.org.code,
      };
      // 添加查询条件
      switch (val) {
        case "user":
          if (this.queryFields.id != null && this.queryFields.id != "") {
            conditions.userId = this.queryFields.id;
          }
          if (this.queryFields.name != null && this.queryFields.name != "") {
            conditions.userName = "%" + this.queryFields.name + "%";
          }
          break;
        case "dept":
          if (this.queryFields.id != null && this.queryFields.id != "") {
            conditions.deptId = this.queryFields.id;
          }
          if (this.queryFields.name != null && this.queryFields.name != "") {
            conditions.deptName = "%" + this.queryFields.name + "%";
          }
          break;
        case "role":
          if (this.queryFields.id != null && this.queryFields.id != "") {
            conditions.roleId = this.queryFields.id;
          }
          if (this.queryFields.name != null && this.queryFields.name != "") {
            conditions.roleName = "%" + this.queryFields.name + "%";
          }
          break;
        case "duty":
          if (this.queryFields.id != null && this.queryFields.id != "") {
            conditions.dutyId = this.queryFields.id;
          }
          if (this.queryFields.name != null && this.queryFields.name != "") {
            conditions.dutyName = "%" + this.queryFields.name + "%";
          }
          break;
        case "org":
          if (this.queryFields.id != null && this.queryFields.id != "") {
            conditions.orgCode = this.queryFields.id;
          }
          if (this.queryFields.name != null && this.queryFields.name != "") {
            conditions.orgName = "%" + this.queryFields.name + "%";
          }
          break;
        case "pool":
          if (this.queryFields.id != null && this.queryFields.id != "") {
            conditions.poolId = this.queryFields.id;
          }
          if (this.queryFields.name != null && this.queryFields.name != "") {
            conditions.poolName = "%" + this.queryFields.name + "%";
          }
          break;
        case "nodeUser":
          if (this.queryFields.id != null && this.queryFields.id != "") {
            conditions.name = this.queryFields.id;
          }
          if (this.queryFields.name != null && this.queryFields.name != "") {
            conditions.desc = this.queryFields.name;
          }
          break;
        default:
          break;
      }
      var _this = this;
      for (var i = 0; i < _this.urls.length; i++) {
        var url = _this.urls[i];
        if (url.key === val && val != "nodeUser") {
          yufp.service.request({
            method: "POST",
            data: conditions,
            url: url.value,
            callback: function (code, message, response) {
              if (response.code == 0) {
                // 转化为key-value形式便于选择
                if (response.data != null) {
                  var data = response.data;
                  _this.total = response.total;
                  for (var k = 0; k < _this.selectInfos.length; k++) {
                    if (val == _this.selectInfos[k].key) {
                      _this.selectInfos[k].total = _this.total;
                      _this.selectInfos[k].selectOptions = _this.coventUser(
                        val,
                        data
                      );
                    }
                  }
                }
              }
            },
          });
        } else if (url.key === val && val == "nodeUser") {
          yufp.service.request({
            method: "POST",
            data: conditions,
            url: url.value,
            callback: function (code, message, response) {
              if (response !== null) {
                // 转化为key-value形式便于选择
                var data = response;
                _this.total = data.length;
                for (var k = 0; k < _this.selectInfos.length; k++) {
                  if (val == _this.selectInfos[k].key) {
                    _this.selectInfos[k].total = _this.total;
                    _this.selectInfos[k].selectOptions = _this.coventUser(
                      val,
                      data
                    );
                  }
                }
              }
            },
          });
        }
      }
    },
    // 将获取到的数据转换为key-value的形式保存
    coventUser: function (type, data) {
      var options = [];
      var option = {};
      var j = 0;
      if (type == "user") {
        for (j = 0; j < data.length; j++) {
          option = {
            key: data[j].userId,
            value: data[j].userName,
            type: type,
          };
          options.push(option);
        }
      } else if (type == "dept") {
        for (j = 0; j < data.length; j++) {
          option = {
            key: data[j].deptId,
            value: data[j].deptName,
            type: type,
          };
          options.push(option);
        }
      } else if (type == "role") {
        for (j = 0; j < data.length; j++) {
          option = {
            key: data[j].roleId,
            value: data[j].roleName,
            type: type,
          };
          options.push(option);
        }
      } else if (type == "duty") {
        for (j = 0; j < data.length; j++) {
          option = {
            key: data[j].dutyId,
            value: data[j].dutyName,
            type: type,
          };
          options.push(option);
        }
      } else if (type == "org") {
        for (j = 0; j < data.length; j++) {
          option = {
            key: data[j].orgId,
            value: data[j].orgName,
            type: type,
          };
          options.push(option);
        }
      } else if (type == "pool") {
        for (j = 0; j < data.length; j++) {
          option = {
            key: data[j].poolId,
            value: data[j].poolName,
            type: type,
          };
          options.push(option);
        }
      } else if (type == "nodeUser") {
        for (j = 0; j < data.length; j++) {
          option = {
            key: data[j].key,
            value: data[j].desc,
            type: type,
          };
          options.push(option);
        }
      }
      return options;
    },
    // 翻译初始的ID
    dialogOpen: function () {
      var _this = this;
      _this.getUserInfo(_this.tabName);
      if (_this.selectedVal) {
        var param = {
          systemId: "cmis",
          codes: _this.selectedVal,
        };
        yufp.service.request({
          url: _this.url.getuserinfo,
          method: "POST",
          data: param,
          callback: function (code, message, response) {
            if (response.code == '0') {
              if (response.data != null) {
                var data = response.data;
                for (var i = 0; i < data.length; i++) {
                  var n = {
                    key: data[i].code,
                    value: data[i].name,
                  };
                  _this.selectedOpts.push(n);
                }
              }
            }
          },
        });
      }
    },
    afterClose: function () {
      this.selectedOpts = [];
      this.reset();
      this.relation = "A.00";
      this.paneValue = "user";
    },
    RowDbClick: function (row, event) {
      // 列表双击事件
      var user = {
        key: "",
        value: row.value,
        type: row.type,
      };
      if (row.type == "user") {
        user.key = "U." + row.key;
      } else if (row.type == "dept") {
        user.key = "D." + row.key;
      } else if (row.type == "role") {
        user.key = "R." + row.key;
      } else if (row.type == "duty") {
        user.key = "G." + row.key;
      } else if (row.type == "org") {
        user.key = "O." + row.key;
      } else if (row.type == "pool") {
        user.key = "T." + row.key;
      } else if (row.type == "nodeUser") {
        user.key = "E." + row.key;
      }
      if (this.selectedOpts == undefined) {
        this.$set(this, "selectedOpts", []);
      }
      var userInfosT = this.selectedOpts;
      var poolCount = 0;
      for (var i = 0; i < userInfosT.length; i++) {
        // 去重
        var item = userInfosT[i].key.split(".");
        if (item[0] == "T") {
          poolCount++;
        }
        if (userInfosT[i].key == user.key) {
          return;
        }
      }
      if (this.userCheck(userInfosT, poolCount, row.type)) {
        userInfosT.push(user);
      }
    },
    userCheck: function (userInfosT, poolCount, type) {
      // 检测办理人员中项目池的配置情况(规则:项目池只能配置一个且和其他类型办理人员不能同时配置)
      if (poolCount > 0) {
        this.$message({
          message: this.$t('wfuserselect.msg1'),
          type: "warning",
          duration: 6000,
        });
        return false;
      } else if (userInfosT.length > 0) {
        if (type == "pool") {
          this.$message({
            message: this.$t('wfuserselect.msg2'),
            type: "warning",
            duration: 6000,
          });
          return false;
        }
      }
      return true;
    },
    RowDbClickExt: function (row, event) {
      // 列表双击事件-自定义处理
      var user = {
        key: "E." + row.key,
        value: row.value,
        type: row.type,
      };
      if (this.selectedOpts == undefined) {
        this.$set(this, "selectedOpts", []);
      }
      var userInfosT = this.selectedOpts;
      for (var i = 0; i < userInfosT.length; i++) {
        // 去重
        if (userInfosT[i].key == user.key) {
          return;
        }
      }
      userInfosT.push(user);
    },
    TagClose: function (tag) {
      // tag页签关闭事件
      if (this.selectedOpts == undefined) {
        this.$set(this, "selectedOpts", []);
      }
      var userInfosT = this.selectedOpts;
      userInfosT.splice(userInfosT.indexOf(tag), 1);
    },
    dialogClose: function () {
      if (this.selectedOpts.length < 1 && "A.00" === this.relation) {
        this.$message(this.$t('wfuserselect.msgselectone'));
        return;
      }
      var selectedId = "";
      var selectLabel = "";
      var poolCount = 0;
      var userInfosT = this.selectedOpts;
      for (var i = 0; i < userInfosT.length; i++) {
        selectedId += userInfosT[i].key + ";";
        selectLabel += userInfosT[i].value + ";";
        var item = userInfosT[i].key.split(".");
        if (item[0] == "T") {
          poolCount++;
        }
      }
      if (poolCount > 1) {
        this.$message({
          message: this.$t('wfuserselect.msg3'),
          type: "warning",
          duration: 6000,
        });
        return false;
      } else if (poolCount == 1) {
        if (userInfosT.length > 1) {
          this.$message({
            message: this.$t('wfuserselect.msg2'),
            type: "warning",
            duration: 6000,
          });
          return false;
        }
      }
      if ("A.00" !== this.relation) {
        // 选了关系
        selectedId += this.relation + ";" ;
        selectLabel += this.relationConvert[this.relation] + ";";
      }
      this.selectedVal = selectedId;
      this.$emit("input", selectedId);
      this.$emit("select-fn", "user", selectedId, selectLabel);
      this.dialogVisible = false;
    },
    // 对外提供选择器显示值
    getRawValue: function () {
      return this.selectedVal;
    },
    convertKey: function (val) {
      // 将key转换为对应的value值
      return val;
    },
    CurrentChange: function (cpage) {
      this.currentPage = cpage;
      this.getUserInfo(this.tabName);
    },
    SizeChange: function (psize) {
      this.pagesize = psize;
      this.getUserInfo(this.tabName);
    },
    relactionChange: function(val) {
      console.log(val);
    }
  },
};
</script>
<style scoped>
  .box-card {
    margin-bottom: 20px;
  }
</style>
