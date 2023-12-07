
<template>
  <!-- 必须全局拥有唯一的id -->
  <div id="WfTaskpoolList">
    <yu-panel :title="$t('wftaskpool.title1')" class="adjust-height" show-search-input :placeholder="$t('wftaskpool.poolid')" @search="fuzzyQuery" no-padding-top>
      <template slot="right">
        <yu-toolBar>
          <el-button @click="openCreateFn">{{ $t('wfbutton.add') }}</el-button>
          <el-button @click="deleteFn()">{{ $t('wfbutton.delete') }}</el-button>
        </yu-toolBar>
      </template>
      <template slot="filter">
        <yu-xform v-model="formdata" related-table-name="WfTaskPoolList" ref="searchForm" label-width="110px" :custom-search-fn="searchFn" :custom-reset-fn="resetFn" form-type="search">
          <yu-xform-group :column="4">
            <yu-xform-item :label="$t('wftaskpool.poolid')" :placeholder="$t('wftaskpool.poolid')" ctype="input" name="poolId"></yu-xform-item>
            <yu-xform-item :label="$t('wftaskpool.poolname')" :placeholder="$t('wftaskpool.poolname')" ctype="input" name="poolName"></yu-xform-item>>
          </yu-xform-group>
        </yu-xform>
      </template>
      <yu-xtable selection-type="checkbox" request-type="POST" :data-url="urls.dataUrl" row-number ref="WfTaskPoolList">
        <yu-xtable-column prop="poolId" :label="$t('wftaskpool.poolid')"></yu-xtable-column>
        <yu-xtable-column prop="poolName" :label="$t('wftaskpool.poolname')"></yu-xtable-column>
        <yu-xtable-column prop="poolDesc" :label="$t('wftaskpool.desc')"></yu-xtable-column>
        <yu-xtable-column prop="orgId" :label="$t('wftaskpool.orgid')"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftaskpool.option')" fixed="right" width="170px">
          <template slot-scope="scope">
            <yu-button-drop :show-length="2" type="text">
              <el-button @click="openDutyFn(scope.row)" type="text">{{ $t('wftaskpool.setduty') }}</el-button>
              <yu-button @click="openEditFn(scope.row)" type="text">{{ $t('wfbutton.edit') }}</yu-button>
              <yu-button @click="deleteFn(scope.row)" type="text">{{ $t('wfbutton.delete') }}</yu-button>
            </yu-button-drop>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>
    <el-dialog-x :title="$t('wftaskpool.title3')" :visible.sync="dialogFormVisible" width="480px">
      <yu-xform ref="WfTaskPoolForm" label-width="110px" v-model="WfTaskPoolFormData" :disabled="formDisabled">
        <yu-xform-group v-for="(item, index) in NewFields" :key="index" :column="item.columnCount">
          <yu-xform-item v-for="field in item.fields" :key="field.field" :label="field.label" :rows="field.rows" :ctype="field.type" :name="field.field" :rules="field.rules" :hidden="field.hidden || false" :disabled="field.disabled || false"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <!-- <el-form-x ref="WfTaskPoolForm" :group-fields="NewFields" :disabled="formDisabled" label-width="110px"></el-form-x> -->
      <div slot="footer" align="center">
        <el-button type="primary" @click="saveCreateFn()">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="dialogFormVisible = false">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog-x>

    <el-dialog-x :title="$t('wftaskpool.title2')" :visible.sync="modifydialogFormVisible" width="480px">
      <yu-xform ref="reform" label-width="110px" v-model="reformData" :disabled="formDisabled">
        <yu-xform-group v-for="(item, index) in updateFields" :key="index" :column="item.columnCount">
          <yu-xform-item v-for="field in item.fields" :key="field.field" :label="field.label" :rows="field.rows" :ctype="field.type" :name="field.field" :rules="field.rules" :hidden="field.hidden || false" :disabled="field.disabled || false"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <!-- <el-form-x ref="reform" :group-fields="updateFields" label-width="110px"></el-form-x> -->
      <div slot="footer" align="center">
        <el-button type="primary" v-norepeat.disabled @click="saveEditFn()">{{ $t('wfbutton.sure') }}</el-button>
        <el-button type="primary" @click="modifydialogFormVisible = false">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog-x>
    <!--关联岗位设置-->
    <el-dialog-x :title="$t('wftaskpool.title4')" :visible.sync="dialogVisibleDuty" width="750px" @close="beforeCloseDuty">
      <!--      <el-card class="box-card">
        <el-tag v-for="tag in checkDutyList" :key="tag.dutyId" type="success" closable @close="TagClose(tag)">
          {{ tag.dutyName }}
        </el-tag>
      </el-card>-->
      <yu-xform ref="dutyForm" v-model="dutyFormdata" related-table-name="dutyTable" class="el-form-search" style="margin-top: 5px;">
        <yu-xform-group :column="4" style="margin-top: 18px">
          <yu-xform-item v-for="(item, index) in dutyFields" :key="index" :placeholder="item.placeholder" :ctype="item.type" :name="item.field"></yu-xform-item>
          <div slot="custom" class="btn-group" style="font-size: 0">
            <yu-button type="primary" @click="dutySearchFn">{{ $t('wfbutton.search') }}</yu-button>
            <yu-button @click="dutyResetFn">{{ $t('wfbutton.reset') }}</yu-button>
          </div>
        </yu-xform-group>
      </yu-xform>
      <!-- <el-form-q ref="dutyForm" :field-data="dutyFields" search-table="dutyTable" :buttons="dutyButtons" style="margin-top: 5px;"></el-form-q> -->
      <yu-xtable ref="dutyTable" request-type="POST" :data-url="urls.DutyUrl" reserve-selection selection-type="checkbox" row-key="dutyId" @select="dutySelect" @select-all="selectAll" @loaded="dataLoad" style="width: 100%">
        <yu-xtable-column :label="$t('wftaskpool.dutycde')" prop="dutyId"></yu-xtable-column>
        <yu-xtable-column :label="$t('wftaskpool.dutyname')" prop="dutyName" sortable></yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="saveDuty">{{ $t('wfbutton.sure') }}</el-button>
        <el-button @click="beforeCloseDuty">{{ $t('wfbutton.cancel') }}</el-button>
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
        dataUrl: backend.workflowService + "/api/taskpool/query",
        show: backend.workflowService + "/api/taskpool/index",
        createSaveUrl: backend.workflowService + "/api/taskpool/create",
        updateSaveUrl: backend.workflowService + "/api/taskpool/update",
        delete: backend.workflowService + "/api/taskpool/delete",
        batchdelete: backend.workflowService + "/api/taskpool/batchdelete",
        DutyUrl: backend.workflowService + "/api/org/dutys/",
        index: backend.workflowService + "/api/taskpool/config/create",
        configAll: backend.workflowService + "/api/taskpool/config/all"
      },
      NewFields: [
        {
          columnCount: 1,
          fields: [
            {
              field: "poolId",
              label: this.$t('wftaskpool.poolid'),
              type: "input",
              rules: [
                {
                  required: true,
                  message: this.$t('wftaskpool.msgbtx'),
                  trigger: "blur"
                }, {
                  max: 30,
                  message: this.$t('wftaskpool.msgcdxz30'),
                }
              ]
            },
            {
              field: "poolName",
              label: this.$t('wftaskpool.poolname'),
              type: "input",
              rules: [
                {
                  required: true,
                  message: this.$t('wftaskpool.msgbtx'),
                  trigger: "blur"
                }, {
                  max: 30,
                  message: this.$t('wftaskpool.msgcdxz30'),
                }
              ]
            },
            {
              field: "systemId",
              label: this.$t('wftaskpool.sysid'),
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
              label: this.$t('wftaskpool.desc'),
              type: "textarea",
              rows: 2,
              rules: [
                {
                  max: 30,
                  message: this.$t('wftaskpool.msgcdxz30'),
                },
                { validator: validator.speChar }
              ]
            }
          ]
        }
      ],
      updateFields: [
        {
          columnCount: 1,
          fields: [
            {
              field: "poolId",
              label: this.$t('wftaskpool.poolid'),
              type: "input",
              disabled: true,
              rules: [
                {
                  required: true,
                  message: this.$t('wftaskpool.msgbtx'),
                  trigger: "blur"
                }, {
                  max: 30,
                  message: this.$t('wftaskpool.msgcdxz30'),
                }
              ]
            },
            {
              field: "poolName",
              label: this.$t('wftaskpool.poolname'),
              type: "input",
              disabled: true,
              rules: [
                {
                  required: true,
                  message: this.$t('wftaskpool.msgbtx'),
                  trigger: "blur"
                }, {
                  max: 30,
                  message: this.$t('wftaskpool.msgcdxz30'),
                }
              ]
            },
            {
              field: "systemId",
              label: this.$t('wftaskpool.sysid'),
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
              label: this.$t('wftaskpool.desc'),
              type: "textarea",
              rows: 1,
              rules: [
                {
                  max: 30,
                  message: this.$t('wftaskpool.msgcdxz30'),
                },
                { validator: validator.speChar }
              ]
            }
          ]
        }
      ],
      dutyFields: [
        {
          placeholder: _this.$t('wftaskpool.dutycde'),
          field: "dutyId",
          type: "input"
        },
        {
          placeholder: _this.$t('wftaskpool.dutyname'),
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
          if (_this.dutyFormdata.dutyName) {
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
    openDutyFn: function(row) {
      // 打开关联岗位页面
      var _this = this;
      _this.dutyMembers = [];
      _this.checkDutyList = [];
      _this.dialogVisibleDuty = true;
      _this.$refs.WfTaskPoolList.toggleRowSelection(row, true);
      _this.checkDutyLists(row.poolId);
    },
    checkDutyLists: function(poolId) {
      var _this = this;
      _this.$nextTick(function() {
        var param = {
          // condition: JSON.stringify({
          //   poolId: poolId
          // })
          poolId: poolId
        };
        _this.$request({
          method: "POST",
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
              _this.$refs.dutyTable.tabledata.forEach(function(item) {
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
      this.checkDutyList = [];
      _this.$refs.dutyTable.tabledata.forEach(function(item) {
        if (exitDuty.indexOf(item.dutyId) > -1) {
          _this.$refs.dutyTable.toggleRowSelection(item, true);
        } else {
          _this.$refs.dutyTable.toggleRowSelection(item, false);
        }
      });
    },
    dutySelect: function(selection, row) {
      // 选择项改变事件
      const find = this.checkDutyList.find(item => item.dutyId === row.dutyId);
      if (!find) {
        this.checkDutyList.push(row);
        this.dutyMembers.push(row.dutyId);
      } else {
        this.checkDutyList.splice(this.checkDutyList.findIndex(item => item.dutyId === row.dutyId), 1);
        this.dutyMembers.splice(this.dutyMembers.findIndex(item => item === row.dutyId), 1);
      }
    },
    selectAll: function(selection) {
      if (selection[0]) {
        this.checkDutyList = selection;
        this.dutyMembers = [];
        for (var i = 0; i < selection.length; i++) {
          this.dutyMembers.push(selection[i].dutyId);
        }
      } else {
        this.checkDutyList = [];
        this.dutyMembers = [];
      }
    },
    TagClose: function(tag) {
      // tag标签关闭事件-在tag标签里加上 closable @close="TagClose(tag)"
      this.$refs.dutyTable.toggleRowSelection(tag, false);
      // this.checkDutyList.splice(this.checkDutyList.indexOf(tag), 1);
      // var tableData = this.$refs.dutyTable.tabledata;

      // if (tableData != null) {
      //   for (var i = 0; i < tableData.length; i++) {
      //     if (tableData[i].dutyId == tag.dutyId) {
      //       this.$refs.dutyTable.toggleRowSelection(tableData[i], false);
      //     }
      //   }
      // }
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
          message: _this.$t('wftaskpool.msgselectone'),
          type: "warning"
        });

        return false;
      }

      var list = _this.checkDutyList;
      var commit = [];
      var taskpool = _this.$refs.WfTaskPoolList.selections[0];
      var param = {
        poolId: taskpool.poolId,
        poolType: "G"
      };
      for (var i = 0; i < list.length; i++) {
        commit.push(list[i].dutyId);
      }
      param.code = commit;
      _this.$request({
        method: "POST",
        url: _this.urls.index,
        data: param
      }).then(({code, message, data}) => {
        if (code === "0" && data !== null) {
          _this.$message({
            duration: 4000,
            message: data.tip,
            type: data.code === "1" ? "error" : "success"
          });
          _this.dialogVisibleDuty = false
        } else {
          _this.$message({
            duration: 4000,
            message: message,
            type: "error"
          });
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
              message: _this.$t('wftaskpool.msgillegal'),
              type: "warning"
            });

            return;
          }

          var comitData = {};
          extend(comitData, _this.WfTaskPoolFormData);
          _this.$request({
            // 检测项目池编号唯一性
            url: _this.urls.show,
            method: "POST",
            data: {poolId: _this.WfTaskPoolFormData.poolId}
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
                      message: _this.$t('wftaskpool.msgsddsuccess'),
                      type: "success"
                    });

                    _this.$refs.WfTaskPoolList.remoteData();
                  } else {
                    _this.$message({
                      duration: 4000,
                      message: message ? message : _this.$t('wftaskpool.msgadderror'),
                      type: "error"
                    });
                  }
                })
              } else {
                var Message = _this.$t('wftaskpool.msgidmuilt');

                _this.$message({
                  duration: 4000,
                  message: Message,
                  type: "warning"
                });
              }
            } else {
              _this.$message({
                duration: 4000,
                message: message,
                type: "error"
              });
            }
          })
        } else {
          _this.$message({
            duration: 4000,
            message: _this.$t('wftaskpool.msginputillegal'),
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
            url: _this.urls.show,
            data: {poolId: _this.reformData.poolId},
            method: "POST"
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
                      message: _this.$t('wftaskpool.msgeditsuccess'),
                      type: "success"
                    });

                    _this.$refs.WfTaskPoolList.remoteData();
                  } else {
                    _this.$message({
                      duration: 4000,
                      message: message ? message : _this.$t('wftaskpool.msgediterror'),
                      type: "error"
                    });
                  }
                })
              } else {
                _this.$message({
                  duration: 4000,
                  message: _this.$t('wftaskpool.msgdatanotexit'),
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
            message: _this.$t('wftaskpool.msginputillegal'),
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
      const selections = row ? [row] : this.$refs.WfTaskPoolList.selections
      if (!selections.length) {
        _this.$message({
          duration: 4000,
          message: _this.$t('wftaskpool.msgselectone'),
          type: "warning"
        });
        return false;
      }
      const ids = []
      selections.forEach(item => {
        ids.push(item.poolId)
      })
      var req = {
        method: "POST",
        url: _this.urls.delete,
        data: {poolId: ids[0]}
      }
      if (ids.length > 1) {
        var idss = "";
        for(var i in ids) {
          idss += ids[i] + ",";
        }
        req = {
          method: "POST",
          url: _this.urls.batchdelete,
          data: {poolIds: idss.substring(0, idss.length - 1)}
        }
        // req.data = idss.substring(0, idss.length - 1);
      }

      this.$confirm(_this.$t('wftaskpool.msgsuredelete'), _this.$t('wftaskpool.tip'), {
        confirmButtonText: _this.$t('wfbutton.sure'),
        cancelButtonText: _this.$t('wfbutton.cancel'),
        type: "warning",
        center: true
      }).then(function() {
        _this.$request(req).then(({code, message, data}) => {
          if (code == 0) {
            _this.$message({
              duration: 4000,
              message: _this.$t('wftaskpool.msgdelsucess'),
              type: "success"
            });

            _this.$refs.WfTaskPoolList.remoteData();
          } else {
            _this.$message({
              duration: 4000,
              message: message ? message : _this.$t('wftaskpool.msgdelerror'),
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
    },
    /**
     * 快速查询
     * @param e 模糊查询关键字
     */
    fuzzyQuery: function(e) {
      var params = {
        poolId: e.value
      };
      this.$refs.WfTaskPoolList.remoteData(params);
      this.$refs.searchForm.resetFields(); // 清空精确查询查询参数
    }
  }
};
</script>

<style lang="scss" scoped>
  ::v-deep .el-form-search .el-form-item {
    padding-right: 10px;
  }
</style>
