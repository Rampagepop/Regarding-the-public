
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
      <el-tabs type="border-card" value="user" @tab-click="TabClick">
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
                :placeholder="$t('wfcopyuserselect.no')"
                v-if="item.key != 'nodeUser'"
              ></yu-input>
              <yu-input
                v-model="queryFields.id"
                :placeholder="$t('wfcopyuserselect.method')"
                v-if="item.key == 'nodeUser'"
              ></yu-input>
            </yu-form-item>
            <yu-form-item>
              <yu-input
                v-model="queryFields.name"
                :placeholder="$t('wfcopyuserselect.name')"
                v-if="item.key != 'nodeUser'"
              ></yu-input>
              <yu-input
                v-model="queryFields.name"
                :placeholder="$t('wfcopyuserselect.ext')"
                v-if="item.key == 'nodeUser'"
              ></yu-input>
            </yu-form-item>
            <yu-form-item>
              <yu-button type="primary" @click="doQuery">{{ $t('wfcopyuserselect.search') }}</yu-button>
            </yu-form-item>
            <yu-form-item>
              <yu-button @click="reset">{{ $t('wfcopyuserselect.reset') }}</yu-button>
            </yu-form-item>
          </yu-form>
          <el-table
            ref="reftable"
            :data="item.selectOptions"
            @row-dblclick="RowDbClick"
            v-if="item.key != 'nodeUser'"
          >
            <el-table-column prop="key" :label="$t('wfcopyuserselect.no')" align="center">
            </el-table-column>
            <el-table-column prop="value" :label="$t('wfcopyuserselect.method')" align="center">
            </el-table-column>
          </el-table>
          <el-table
            ref="reftable"
            :data="item.selectOptions"
            @row-dblclick="RowDbClickExt"
            v-if="item.key == 'nodeUser'"
          >
            <el-table-column prop="key" :label="$t('wfcopyuserselect.name')" align="center">
            </el-table-column>
            <el-table-column prop="value" :label="$t('wfcopyuserselect.ext')" align="center">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-pagination
          v-if="tabName != 'nodeUser'"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pagesize"
          :current-page="currentPage"
          :total="total"
          @current-change="CurrentChange"
          @size-change="SizeChange"
        >
        </el-pagination>
      </el-tabs>
      <div align="center" style="margin-top: 20px" class="dialog-footer">
        <el-button type="primary" @click="dialogClose">{{ $t('wfcopyuserselect.selectreturn') }}</el-button>
      </div>
    </el-dialog-x>
  </div>
</template>
<script>
/**
 * yufp-copyuser-selector
 * 办理人员选择弹窗自定义组件
 * 注：自定义组件规范：
 * 1、对外默认提供v-model配置,raw-value
 * 2、对外提供readonly、disabled、size属性
 * 3、对外接口事件：select-fn,具体参数请自定义
 * Created by zhouqh on 2020/1/15.
 */
/* eslint vue/require-prop-types:0 */
import { mapGetters } from 'vuex'
export default {
  name: "YufpCopyuserSelector",
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
      dialogTitle: this.$t('wfcopyuserselect.title'),
      selectInfos: [],
      selectedOpts: [],
      urls: [
        {
          label: this.$t('wfcopyuserselect.user'),
          key: "user",
          value: backend.workflowService + "/api/org/users",
        },
        {
          label: this.$t('wfcopyuserselect.dept'),
          key: "dept",
          value: backend.workflowService + "/api/org/depts",
        },
        {
          label: this.$t('wfcopyuserselect.role'),
          key: "role",
          value: backend.workflowService + "/api/org/roles",
        },
        {
          label: this.$t('wfcopyuserselect.duty'),
          key: "duty",
          value: backend.workflowService + "/api/org/dutys",
        },
        {
          label: this.$t('wfcopyuserselect.org'),
          key: "org",
          value: backend.workflowService + "/api/org/orgs",
        },
        {
          label: this.$t('wfcopyuserselect.diy'),
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
    //tab页点击事件
    TabClick: function (tab, event) {
      this.tabName = tab.name;
      this.reset();
      this.getUserInfo(tab.name);
    },
    //初始化表格数据信息
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
    //获取人员与部门等信息
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
                var data = response.nodeUser;
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
    //将获取到的数据转换为key-value的形式保存
    coventUser: function (type, data) {
      var options = [];
      if (type == "user") {
        for (var j = 0; j < data.length; j++) {
          var option = {
            key: data[j].userId,
            value: data[j].userName,
            type: type,
          };
          options.push(option);
        }
      } else if (type == "dept") {
        for (var j = 0; j < data.length; j++) {
          var option = {
            key: data[j].deptId,
            value: data[j].deptName,
            type: type,
          };
          options.push(option);
        }
      } else if (type == "role") {
        for (var j = 0; j < data.length; j++) {
          var option = {
            key: data[j].roleId,
            value: data[j].roleName,
            type: type,
          };
          options.push(option);
        }
      } else if (type == "duty") {
        for (var j = 0; j < data.length; j++) {
          var option = {
            key: data[j].dutyId,
            value: data[j].dutyName,
            type: type,
          };
          options.push(option);
        }
      } else if (type == "org") {
        for (var j = 0; j < data.length; j++) {
          var option = {
            key: data[j].orgId,
            value: data[j].orgName,
            type: type,
          };
          options.push(option);
        }
      } else if (type == "nodeUser") {
        for (var j = 0; j < data.length; j++) {
          var option = {
            key: data[j].key,
            value: data[j].desc,
            type: type,
          };
          options.push(option);
        }
      }
      return options;
    },
    //翻译初始的ID
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
    },
    RowDbClick: function (row, event) {
      //列表双击事件
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
      } else if (row.type == "nodeUser") {
        user.key = "E." + row.key;
      }
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
    RowDbClickExt: function (row, event) {
      //列表双击事件-自定义处理
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
      //tag页签关闭事件
      if (this.selectedOpts == undefined) {
        this.$set(this, "selectedOpts", []);
      }
      var userInfosT = this.selectedOpts;
      userInfosT.splice(userInfosT.indexOf(tag), 1);
    },
    dialogClose: function () {
      if (this.selectedOpts.length < 1) {
        this.selectedVal = "";
        this.$emit("input", "");
        this.dialogVisible = false;
        this.$message(this.$t('wfcopyuserselect.msgselectone'));
        return;
      }
      var selectedId = "";
      var selectedName = "";
      for (var i = 0; i < this.selectedOpts.length; i++) {
        selectedId += this.selectedOpts[i].key + ";";
        selectedName += this.selectedOpts[i].value + ";";
      }
      this.selectedVal = selectedId;
      this.$emit("input", selectedId);
      this.$emit("select-fn", this.selectedOpts, selectedId, selectedName);
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
  },
};
</script>
