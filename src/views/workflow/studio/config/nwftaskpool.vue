
<template>
  <!-- 必须全局拥有唯一的id -->
  <div id="WfTaskpoolList">
    <yu-panel title="项目池配置" panel-type="normal" no-padding-top>
      <template slot="right">
        <yu-toolBar>
          <el-button @click="openCreateFn">新增</el-button>
          <el-button @click="openDutyFn">关联岗位设置</el-button>
        </yu-toolBar>
      </template>
      <template slot="filter">
        <yu-xform v-model="formdata" related-table-name="WfTaskPoolList" ref="searchForm" label-width="110px" :custom-search-fn="searchFn" :custom-reset-fn="resetFn" form-type="search">
          <yu-xform-group :column="4">
            <yu-xform-item label="项目池编号" placeholder="项目池编号" ctype="input" name="poolId"></yu-xform-item>
            <yu-xform-item label="项目池名称" placeholder="项目池名称" ctype="input" name="poolName"></yu-xform-item>>
          </yu-xform-group>
        </yu-xform>
      </template>
      <yu-xtable :data-url="urls.dataUrl" :base-params="dataParams" row-number ref="WfTaskPoolList">
        <yu-xtable-column prop="poolId" label="项目池编号"></yu-xtable-column>
        <yu-xtable-column prop="poolName" label="项目池名称"></yu-xtable-column>
        <yu-xtable-column prop="poolDesc" label="描述"></yu-xtable-column>
        <yu-xtable-column prop="orgId" label="机构ID"></yu-xtable-column>
        <yu-xtable-column label="操作" fixed="right" width="120px">
          <template slot-scope="scope">
            <yu-button-drop :show-length="2" type="text">
              <yu-button @click="openEditFn(scope.row)" type="text">修改</yu-button>
              <yu-button @click="deleteFn(scope.row)" type="text">删除</yu-button>
            </yu-button-drop>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <el-dialog-x :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="480px">
      <yu-xform ref="WfTaskPoolForm" label-width="110px" v-model="WfTaskPoolFormData" :disabled="formDisabled">
        <yu-xform-group :column="2">
          <yu-xform-item label="业务类型" placeholder="业务类型" ctype="input" name="bizType"></yu-xform-item>
          <yu-xform-item label="流程标识" placeholder="流程标识" ctype="num" name="flowSign"></yu-xform-item>
          <yu-xform-item label="流程名称" placeholder="流程名称" ctype="input" name="flowName"></yu-xform-item>
        </yu-xform-group>
        <yu-xform-group v-for="(item, index) in NewFields" :key="index" :column="item.columnCount">
          <yu-xform-item v-for="field in item.fields" :key="field.field" :label="field.label" :rows="field.rows" :ctype="field.type" :name="field.field" :rules="field.rules" :hidden="field.hidden || false" :disabled="field.disabled || false"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <!-- <el-form-x ref="WfTaskPoolForm" :group-fields="NewFields" :disabled="formDisabled" label-width="110px"></el-form-x> -->
      <div slot="footer" align="center">
        <el-button type="primary" @click="saveCreateFn()">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog-x>

    <el-dialog-x :title="textMap[dialogStatus]" :visible.sync="modifydialogFormVisible" width="750px">
      <yu-xform ref="reform" label-width="110px" v-model="reformData" :disabled="formDisabled">
        <yu-xform-group v-for="(item, index) in updateFields" :key="index" :column="item.columnCount">
          <yu-xform-item v-for="field in item.fields" :key="field.field" :label="field.label" :rows="field.rows" :ctype="field.type" :name="field.field" :rules="field.rules" :hidden="field.hidden || false" :disabled="field.disabled || false"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <!-- <el-form-x ref="reform" :group-fields="updateFields" label-width="110px"></el-form-x> -->
      <div slot="footer" align="center">
        <el-button type="primary" @click="saveEditFn()">确 定</el-button>
        <el-button type="primary" @click="modifydialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog-x>
    <!--关联岗位设置-->
    <el-dialog-x :title="DutyTitle" :visible.sync="dialogVisibleDuty" width="750px" @close="beforeCloseDuty">
      <el-card class="box-card">
        <el-tag v-for="tag in checkDutyList" :key="tag.dutyId" type="success" closable @close="TagClose(tag)">
          {{ tag.dutyName }}
        </el-tag>
      </el-card>
      <yu-xform ref="dutyForm" v-model="dutyFormdata" related-table-name="dutyTable" class="el-form-search" style="margin-top: 5px;">
        <yu-xform-group :column="4">
          <yu-xform-item v-for="(item, index) in dutyFields" :key="index" :placeholder="item.placeholder" :ctype="item.type" :name="item.field"></yu-xform-item>
          <div slot="custom" class="btn-group">
            <yu-button-group>
              <yu-button type="primary" icon="search" @click="dutySearchFn">{{ $t('wfbutton.search') }}</yu-button>
              <yu-button type="primary" icon="edit" @click="dutyResetFn">{{ $t('wfbutton.reset') }}</yu-button>
            </yu-button-group>
          </div>
        </yu-xform-group>
      </yu-xform>
      <!-- <el-form-q ref="dutyForm" :field-data="dutyFields" search-table="dutyTable" :buttons="dutyButtons" style="margin-top: 5px;"></el-form-q> -->
      <yu-xtable ref="dutyTable" :data-url="urls.DutyUrl" reserve-selection selection-type="checkbox" row-key="dutyId" @select="dutySelect" @select-all="selectAll" @loaded="dataLoad" style="width: 100%">
        <yu-xtable-column label="岗位码" prop="dutyId"></yu-xtable-column>
        <yu-xtable-column label="岗位名称" prop="dutyName" sortable></yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="saveDuty">确 定</el-button>
        <el-button type="primary" @click="beforeCloseDuty">取 消</el-button>
      </div>
    </el-dialog-x>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { validator } from '@/utils/validate'
import { sessionStore, extend } from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
export default {
  data: function() {
    var _this = this;
    return {
      reformData: {},
      WfTaskPoolFormData: {},
      dutyFormdata: {},
      formdata: {},
      urls: {
        dataUrl: backend.workflowService + "/api/taskpool/",
        show: backend.workflowService + "/api/taskpool/",
        createSaveUrl: backend.workflowService + "/api/taskpool/",
        updateSaveUrl: backend.workflowService + "/api/taskpool/update/",
        batchdelete: backend.workflowService + "/api/taskpool/delete/",
        DutyUrl: backend.workflowService + "/api/org/dutys/",
        index: backend.workflowService + "/api/taskpool/config/",
        configAll: backend.workflowService + "/api/taskpool/config/all"
      },
      NewFields: [
        {
          columnCount: 1,
          fields: [
            {
              field: "poolId",
              label: "项目池编号",
              type: "input",
              rules: [
                {
                  required: true,
                  message: "必填项",
                  trigger: "blur"
                }, {
                  max: 30,
                  message: '长度不能超过30个字符',
                }
              ]
            },
            {
              field: "poolName",
              label: "项目池名称",
              type: "input",
              rules: [
                {
                  required: true,
                  message: "必填项",
                  trigger: "blur"
                }, {
                  max: 30,
                  message: '长度不能超过30个字符',
                }
              ]
            },
            {
              field: "systemId",
              label: "系统ID",
              type: "input",
              hidden: true
            }
          ]
        },
        {
          columnCount: 1,
          fields: [
            {
              field: "poolDesc",
              label: "描述",
              type: "textarea",
              rows: 2,
              rules: [
                {
                  max: 30,
                  message: '长度不能超过30个字符',
                },
                { validator: validator.speChar }
              ]
            }
          ]
        }
      ],
      updateFields: [
        {
          columnCount: 2,
          fields: [
            {
              field: "poolId",
              label: "项目池编号",
              type: "input",
              disabled: true,
              rules: [
                {
                  required: true,
                  message: "必填项",
                  trigger: "blur"
                }, {
                  max: 30,
                  message: '长度不能超过30个字符',
                }
              ]
            },
            {
              field: "poolName",
              label: "项目池名称",
              type: "input",
              disabled: true,
              rules: [
                {
                  required: true,
                  message: "必填项",
                  trigger: "blur"
                }, {
                  max: 30,
                  message: '长度不能超过30个字符',
                }
              ]
            },
            {
              field: "systemId",
              label: "系统ID",
              type: "input",
              hidden: true
            }
          ]
        },
        {
          columnCount: 1,
          fields: [
            {
              field: "poolDesc",
              label: "描述",
              type: "textarea",
              rows: 1,
              rules: [
                {
                  max: 30,
                  message: '长度不能超过30个字符',
                },
                { validator: validator.speChar }
              ]
            }
          ]
        }
      ],
      dutyFields: [
        {
          placeholder: "岗位码",
          field: "dutyId",
          type: "input"
        },
        {
          placeholder: "岗位名称",
          field: "dutyName",
          type: "input"
        }
      ],
      dutyButtons: [
        {
          label: this.$t('wfbutton.search'),
          op: "submit",
          type: "primary",
          show: true,
          click: function(model, valid) {
            if (valid) {
              var params = {};
              params.dutyId = model.dutyId;

              if (model.dutyName != "") {
                params.dutyName = "%" + model.dutyName + "%";
              }

              var param = {
                condition: JSON.stringify(params)
              };

              _this.$refs.dutyTable.remoteData(params);
            }
          }
        },
        {
          label: this.$t('wfbutton.reset'),
          op: "reset",
          show: this.resetButton
        }
      ],
      mainGrid: {
        query: {
          poolId: "",
          poolName: ""
        }
      },
      dataParams: {},
      poolId: "",
      checkbox: true,
      DutyParams: {systemId: "cmis"},
      height: sessionStore.get(VIEW_SIZE).height - 100,
      dialogFormVisible: false,
      modifydialogFormVisible: false,
      dialogVisibleDuty: false,
      dialogStatus: "",
      formDisabled: false,
      textMap: {
        update: "修改",
        creat: "新增"
      },
      DutyTitle: "关联岗位",
      checkDutyList: [],
      checkList: "",
      checkDutyForm: {},
      dutyMembers: []
    };
  },
  computed: {
    ...mapGetters([
      'org'
    ])
  },
  methods: {
    dutySearchFn() {
      var _this = this;
      _this.$refs.dutyForm.validate(function(valid) {
        if (valid) {
          var params = {};
          params.dutyId = _this.dutyFormdata.dutyId;
          if (_this.dutyFormdata.dutyName != "") {
            params.dutyName = "%" + _this.dutyFormdata.dutyName + "%";
          }
          var param = {
            condition: JSON.stringify(params)
          };
          _this.$refs.dutyTable.remoteData(params);
        } else {
          return;
        }
      });
    },
    dutyResetFn() {
      this.$refs.dutyForm.resetFields();
      this.$refs.dutyTable.remoteData();
    },
    openDutyFn: function() {
      // 打开关联岗位页面
      var _this = this;

      if (_this.$refs.WfTaskPoolList.selections.length !== 1) {
        _this.$message({
          duration: 4000,
          message: "请选择一条记录！",
          type: "warning"
        });
        return false;
      }
      var row = _this.$refs.WfTaskPoolList.selections[0];
      if (row.poolId !== _this.poolId) {
        _this.poolId = row.poolId;
      }
      _this.dutyMembers = [];
      _this.checkDutyList = [];
      _this.dialogVisibleDuty = true;
      _this.checkDutyLists(row.poolId);
    },
    checkDutyLists: function(poolId) {
      var _this = this;
      _this.$nextTick(function() {
        var param = {
          poolId: poolId
        };
        _this.$request({
          method: "GET",
          url: _this.urls.configAll,
          data: param
        }).then(({code, message, data}) => {
          // 已配置岗位
          if (code != 0) {
            _this.$message({
              duration: 4000,
              message: "error:" + message,
              type: "error"
            });
          } else {
            var users = data;
            for (var i = 0; i < users.length; i++) {
              _this.dutyMembers.push(users[i].dutyId);
              _this.checkDutyList.push(users[i]);
              _this.$refs.dutyTable.tabledata.filter(function(item) {
                if (item.dutyId === users[i].dutyId) {
                  _this.$refs.dutyTable.toggleRowSelection(item, true);
                }
              });
            }
          }
        })
      });
    },
    dataLoad: function(data, total, response) {
      var _this = this;
      var exitDuty = _this.dutyMembers;
      _this.$refs.dutyTable.tabledata.filter(function(item) {
        if (exitDuty.indexOf(item.dutyId) > -1) {
          _this.$refs.dutyTable.toggleRowSelection(item, true);
        } else {
          _this.$refs.dutyTable.toggleRowSelection(item, false);
        }
      });
    },
    dutySelect: function(selection, row) {
      // 选择项改变事件
      if (selection[0]) {
        this.checkDutyList = selection;
        this.dutyMembers = [];
        for (var i = 0; i < selection.length; i++) {
          this.dutyMembers.push(selection[i].dutyId);
        }
      }
    },
    selectAll: function(selection) {
      if (selection[0]) {
        this.checkDutyList = selection;
        this.dutyMembers = [];
        for (var i = 0; i < selection.length; i++) {
          this.dutyMembers.push(selection[i].dutyId);
        }
      }
    },
    TagClose: function(tag) {
      // tag标签关闭事件-在tag标签里加上 closable @close="TagClose(tag)"
      this.checkDutyList.splice(this.checkDutyList.indexOf(tag), 1);
      var tableData = this.$refs.dutyTable.tabledata;

      if (tableData != null) {
        for (var i = 0; i < tableData.length; i++) {
          if (tableData[i].dutyId == tag.dutyId) {
            this.$refs.dutyTable.toggleRowSelection(tableData[i], false);
          }
        }
      }
    },
    rowClick: function(row) {
      // 表格单击事件
      this.$refs.dutyTable.toggleRowSelection(row);
    },
    // 项目池关联岗位
    saveDuty: function() {
      var _this = this;

      if (_this.checkDutyList.length < 1) {
        _this.$message({
          duration: 4000,
          message: "请至少选择一条数据!",
          type: "warning"
        });

        return false;
      }

      var list = _this.checkDutyList;
      var commit = [];
      var taskpool = _this.$refs.WfTaskPoolList.selections[0];

      for (var i = 0; i < list.length; i++) {
        var data = {
          poolId: taskpool.poolId,
          code: list[i].dutyId,
          poolType: "G"
        };
        commit.push(data);
      }

      _this.$request({
        method: "POST",
        url:
          backend.workflowService +
          "/api/taskpool/config/batchdelete/" +
          taskpool.poolId
      }).then(({code, message, data}) => {
        if (code == 0) {
          for (var i = 0; i < commit.length; i++) {
            var param = commit[i];
            _this.$request({
              method: "POST",
              url: _this.urls.index,
              data: param
            }).then(({code, message, data}) => {
              if (data != null) {
                _this.$message({
                  duration: 4000,
                  message: "岗位关联完成",
                  type: "success"
                });
                _this.dialogVisibleDuty = false
              } else {
                _this.$message({
                  duration: 4000,
                  message: "岗位" + param.code + "关联失败",
                  type: "error"
                });
              }
            })
          }

          // _this.checkDutyLists(taskpool.poolId);
        } else {
          _this.$message({
            duration: 4000,
            message: "error:" + message,
            type: "error"
          });
        }
      })
    },
    relateDutyFn(param) {
      const _this = this;
      yufp.service.request({
        method: "POST",
        url: _this.urls.index,
        data: param,
        callback: function(code, message, response) {
          if (response.data != null) {
            _this.$message({
              duration: 4000,
              message: "岗位关联完成",
              type: "success"
            });
            _this.dialogVisibleDuty = false
          } else {
            _this.$message({
              duration: 4000,
              message: "岗位" + param.code + "关联失败",
              type: "error"
            });
          }
        }
      });
    },
    beforeCloseDuty: function() {
      var _this = this;
      _this.dialogVisibleDuty = false;
      _this.checkDutyList = [];
      _this.dutyMembers = [];
      _this.$refs.WfTaskPoolList.remoteData();
      _this.$refs.dutyTable.remoteData();
    },
    openCreateFn: function() {
      // 打开新增页面
      this.opType("creat", false);
      this.$nextTick(function() {
        this.$refs.WfTaskPoolForm.resetFields();
      });
    },
    openEditFn(row) {
      // 打开修改页面
      this.poolId = row.poolId;
      this.opType("update", false);
      this.$nextTick(function() {
        this.$refs.reform.resetFields();
        extend(this.reformData, row);
      });
    },
    opType: function(type, disabled) {
      // 切换弹框状态
      if (type == "creat") {
        this.dialogFormVisible = true;
      } else if (type == "update") {
        this.modifydialogFormVisible = true;
      }

      this.dialogStatus = type;
      this.formDisabled = disabled;
    },
    saveCreateFn: function() {
      // 新增保存
      var _this = this;

      var myform = _this.$refs.WfTaskPoolForm;
      _this.WfTaskPoolFormData.systemId = "cmis";
      _this.WfTaskPoolFormData.orgId = _this.org.code;
      myform.validate(function(valid) {
        if (valid) {
          // 特殊字符校验
          var reg = new RegExp(
            "[`~!@#%$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）|{}【】‘；：”“'。，、？]"
          );

          if (
            reg.test(_this.WfTaskPoolFormData.poolId) ||
            reg.test(_this.WfTaskPoolFormData.poolName)
          ) {
            _this.$message({
              message: "包含特殊字符",
              type: "warning"
            });

            return;
          }

          var comitData = {};
          extend(comitData, _this.WfTaskPoolFormData);
          _this.$request({
            // 检测项目池编号唯一性
            url: _this.urls.show + _this.WfTaskPoolFormData.poolId,
            method: "GET"
          }).then(({code, message, data}) => {
            if (code == 0) {
              if (data == null) {
                _this.$request({
                  url: _this.urls.createSaveUrl,
                  data: comitData,
                  method: "POST"
                }).then(({code, message, data}) => {
                  if (code == 0) {
                    _this.dialogFormVisible = false;

                    _this.$message({
                      duration: 4000,
                      message: "新增成功",
                      type: "success"
                    });

                    _this.$refs.WfTaskPoolList.remoteData();
                  } else {
                    _this.$message({
                      duration: 4000,
                      message: "新增异常:" + message,
                      type: "error"
                    });
                  }
                })
              } else {
                var Message = "项目池编号不能重复，请重新输入！";

                _this.$message({
                  duration: 4000,
                  message: Message,
                  type: "warning"
                });
              }
            } else {
              _this.$message({
                duration: 4000,
                message: "异常:" + message,
                type: "error"
              });
            }
          })
        } else {
          _this.$message({
            duration: 4000,
            message: "请检查输入项是否合法",
            type: "warning"
          });

          return false;
        }
      });
    },
    saveEditFn: function() {
      // 修改保存
      var _this = this;

      var myform = _this.$refs.reform;
      _this.reformData.systemId = "cmis";
      _this.reformData.orgId = _this.org.code;
      myform.validate(function(valid) {
        if (valid) {
          var comitData = {};
          extend(comitData, _this.reformData);
          _this.$request({
            url: _this.urls.show + _this.reformData.poolId,
            method: "GET"
          }).then(({code, message, data}) => {
            if (code == 0) {
              if (data != null) {
                _this.$request({
                  url: _this.urls.updateSaveUrl,
                  data: comitData,
                  method: "POST"
                }).then(({code, message, data}) => {
                  if (code == 0) {
                    _this.modifydialogFormVisible = false;

                    _this.$message({
                      duration: 4000,
                      message: "修改成功",
                      type: "success"
                    });

                    _this.$refs.WfTaskPoolList.remoteData();
                  } else {
                    _this.$message({
                      duration: 4000,
                      message: "修改异常:" + message,
                      type: "error"
                    });
                  }
                })
              } else {
                _this.$message({
                  duration: 4000,
                  message: "该项目池编号的数据不存在!",
                  type: "warning"
                });
              }
            } else {
              _this.$message({
                duration: 4000,
                message: "error:" + message,
                type: "error"
              });
            }
          })
        } else {
          _this.$message({
            duration: 4000,
            message: "请检查输入项是否合法",
            type: "warning"
          });

          return false;
        }
      });
    },
    // 删除项目池信息
    deleteFn(row) {
      // 删除
      var _this = this;

      this.$confirm("您确定需要删除该条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(function() {
        _this.$request({
          method: "POST",
          url: _this.urls.batchdelete + row.poolId
        }).then(({code, message, data}) => {
          if (code == 0) {
            _this.$message({
              duration: 4000,
              message: "删除成功",
              type: "success"
            });

            _this.$refs.WfTaskPoolList.remoteData();
          } else {
            _this.$message({
              duration: 4000,
              message: "删除异常:" + message,
              type: "error"
            });
          }
        })
      });
    },
    searchFn: function () {
      var model = this.formdata;
      var params = {
        poolName: model.poolName ? '%' + model.poolName + '%' : "",
        poolId: model.poolId ? model.poolId : ""
      };

      var param = {
        condition: JSON.stringify(params)
      };

      this.$refs.WfTaskPoolList.remoteData(params);
    
    },
    // 自定义重置功能
    resetFn: function () {
      this.$refs.searchForm.resetFields();
      this.$refs.WfTaskPoolList.remoteData();
    }
  }
};
</script>

<style lang="scss" scoped>
  ::v-deep .el-form-search .el-form-item {
    padding-right: 10px;
  }
</style>