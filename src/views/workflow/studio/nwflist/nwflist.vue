<template>
  <div>
    <yu-panel :title="$t('wflist.title')" no-padding-top class="adjust-height" show-search-input :placeholder="$t('wflist.flowid')" @search="fuzzyQuery">
      <template slot="right">
        <yu-toolBar>
          <el-button @click="addFn">{{ $t('wfbutton.add') }}</el-button>
          <el-button>
            <el-upload class="xml-upload" ref="refBtnUpload" :action="urls.importFlow" :headers="uploadHeader" :on-success="handleUploadSuccess" :show-file-list="false" :on-change="handleChange">
              {{ $t('wfbutton.import') }}
            </el-upload>
          </el-button>
        </yu-toolBar>
      </template>
      <template slot="filter">
        <yu-xform v-model="formdata1" related-table-name="reftable" ref="searchForm" label-width="130px" form-type="search" :custom-search-fn="searchFn" @form-reset="formResetFn">
          <yu-xform-group :column="4">
            <yu-xform-item :label="$t('wflist.flowname')" :placeholder="$t('wflist.flowname')" ctype="input" name="flowName"></yu-xform-item>
            <yu-xform-item :label="$t('wflist.flowid')" :placeholder="$t('wflist.flowid')" ctype="num" name="flowId"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <yu-xtable ref="reftable" :data-url="urls.index" request-type="POST">
        <yu-xtable-column :label="$t('wflist.flowname')">
          <template slot-scope="scope">
            <a class="underline" @click="infoFn(scope.row)">{{ scope.row.flowName }}</a>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wflist.flowsign')" prop="flowSign"></yu-xtable-column>
        <yu-xtable-column :label="$t('wflist.flowid')" prop="flowId"></yu-xtable-column>
        <yu-xtable-column :label="$t('wflist.flowadmin')" prop="flowAdmin"></yu-xtable-column>
        <yu-xtable-column :label="$t('wflist.updatetime')" prop="updateTime" width="180">
          <template slot-scope="scope">
            <span v-if="!scope.row.updateTime">{{ scope.row.startTime }}</span>
            <span v-if="scope.row.updateTime">{{ scope.row.updateTime }}</span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wflist.flowstate')">
          <template slot-scope="scope">
            <yu-tag type="success" v-if="scope.row.flowState == 'R'">{{ $t('wflist.on') }}</yu-tag>
            <yu-tag type="warning" v-if="scope.row.flowState == 'B'">{{ $t('wflist.edit') }}</yu-tag>
            <yu-tag type="danger" v-if="scope.row.flowState == 'E'">{{ $t('wflist.off') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wflist.flowver')" prop="flowVersion"></yu-xtable-column>
        <yu-xtable-column fixed="right" :label="$t('wflist.option')" width="240">
          <template slot-scope="scope">
            <yu-button-drop set-index="0" :show-length="3" type="text">
              <yu-button v-norepeat.disabled @click="customRowOp(scope, 'edit')" type="text">{{ $t('wflist.flow') }}</yu-button>
              <yu-button v-norepeat.disabled @click="customRowOp(scope, 'start')" type="text" v-if="scope.row.flowState=='E'||scope.row.flowState == 'B'">{{ $t('wflist.on') }}</yu-button>
              <yu-button v-norepeat.disabled @click="customRowOp(scope, 'stop')" type="text" v-if="scope.row.flowState=='R'">{{ $t('wflist.off') }}</yu-button>
              <yu-button v-norepeat.disabled @click="saveAsNew(scope.row)" type="text">{{ $t('wflist.newversion') }}</yu-button>
              <yu-button v-norepeat.disabled @click="historyFn(scope.row)" type="text">{{ $t('wflist.hisversion') }}</yu-button>
              <yu-button v-norepeat.disabled @click="modifyFn(scope.row)">{{ $t('wflist.editname') }}</yu-button>
              <yu-button v-norepeat.disabled @click="exportFn(scope.row)">{{ $t('wfbutton.export') }}</yu-button>
              <yu-button v-norepeat.disabled @click="deleteAllFn(scope.row)" type="text">{{ $t('wfbutton.delete') }}</yu-button>
            </yu-button-drop>
          </template>
        </yu-xtable-column>
      </yu-xtable>
    </yu-panel>

    <el-dialog-x :title="viewTitle[viewType]" :visible.sync="updatedialogVisible" width="480px" @close="cancelModify">
      <yu-xform ref="reform" label-width="110px" v-model="reformData">
        <yu-xform-item :label="$t('wflist.flowname')" :placeholder="$t('wflist.flowname')" ctype="input" name="flowName" :rules="flowNameRule"></yu-xform-item>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="sureModify">{{ $t('wfbutton.save') }}</el-button>
        <el-button @click="cancelModify">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
      <!-- <el-form-x ref="reform" :group-fields="updateFields" :buttons="updateButtons" :disabled="formDisabled" label-width="110px"></el-form-x> -->
    </el-dialog-x>
    <el-dialog-x :title="viewTitle[viewType]" :visible.sync="newdialogVisible" width="480px" @close="cancel">
      <yu-form :model="editForm" ref="newform" label-width="110px">
        <yu-form-item :label="$t('wflist.flowname')" prop="newflowName" :rules="flowNameRule">
          <yu-input v-model="editForm.newflowName"></yu-input>
        </yu-form-item>
      </yu-form>
      <div slot="footer" align="center">
        <el-button type="primary" @click="sureAdd">{{ $t('wfbutton.save') }}</el-button>
        <el-button @click="cancel">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog-x>
    <yu-xdialog :title="$t('wflist.flowinfo')" :visible.sync="trackDialogVisible" @close="trackClose" v-if="trackDialogVisible" height="460px" width="70%">
      <div id="nwfTrackPage">
        <workflow :flow-id="flowId"></workflow>
      </div>
    </yu-xdialog>
    <!--历史版本弹窗-->
    <yu-xdialog :title="$t('wflist.hisversion')" :visible.sync="historyTableVisiable" @close="historyClose" width="70%">
      <template slot="filter">
        <yu-xform v-model="formdata1" related-table-name="historyTable" ref="hisSearchForm" label-width="110px" form-type="search" :custom-search-fn="searchFn">
          <yu-xform-group :column="4">
            <yu-xform-item :label="$t('wflist.flowname')" :placeholder="$t('wflist.flowname')" ctype="input" name="flowName"></yu-xform-item>
            <yu-xform-item :label="$t('wflist.flowid')" :placeholder="$t('wflist.flowid')" ctype="input" name="flowId"></yu-xform-item>
            <yu-xform-item :label="$t('wflist.flowver')" :placeholder="$t('wflist.flowver')" ctype="input" name="flowVersion"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <yu-xtable ref="historyTable" :data-url="urls.history" :base-params="historyTableParams" request-type="POST">
        <yu-xtable-column :label="$t('wflist.flowname')">
          <template slot-scope="scope">
            <a class="underline" @click="infoFn(scope.row)">{{ scope.row.flowName }}</a>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wflist.flowsign')" prop="flowSign"></yu-xtable-column>
        <yu-xtable-column :label="$t('wflist.flowid')" prop="flowId"></yu-xtable-column>
        <yu-xtable-column :label="$t('wflist.flowver')" prop="flowVersion"></yu-xtable-column>
        <yu-xtable-column :label="$t('wflist.flowadmin')" prop="flowAdmin"></yu-xtable-column>
        <yu-xtable-column :label="$t('wflist.inittime')" prop="initialTime"></yu-xtable-column>
        <yu-xtable-column :label="$t('wflist.flowstate')">
          <template slot-scope="scope">
            <yu-tag type="success" v-if="scope.row.flowState == 'R'">{{ $t('wflist.on') }}</yu-tag>
            <yu-tag type="warning" v-if="scope.row.flowState == 'B'">{{ $t('wflist.edit') }}</yu-tag>
            <yu-tag type="danger" v-if="scope.row.flowState == 'E'">{{ $t('wflist.off') }}</yu-tag>
          </template>
        </yu-xtable-column>
        <yu-xtable-column fixed="right" :label="$t('wflist.option')" width="240">
          <template slot-scope="scope">
            <yu-button-drop set-index="0" :show-length="3" type="text">
              <yu-button v-norepeat.disabled @click="changeStateHis(scope.row, 'R')" type="text" v-if="scope.row.flowState=='E'||scope.row.flowState == 'B'">{{ $t('wflist.on') }}</yu-button>
              <yu-button v-norepeat.disabled @click="changeStateHis(scope.row, 'E')" type="text" v-if="scope.row.flowState=='R'">{{ $t('wflist.off') }}</yu-button>
              <yu-button v-norepeat.disabled @click="changeVer(scope.row)" type="text">{{ $t('wflist.returnver') }}</yu-button>
              <yu-button v-norepeat.disabled @click="exportFn(scope.row)" type="text">{{ $t('wfbutton.export') }}</yu-button>
              <yu-button v-norepeat.disabled @click="deleteFn(scope.row)" type="text">{{ $t('wfbutton.delete') }}</yu-button>
            </yu-button-drop>
          </template>
        </yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="refreshHistoryTable">{{ $t('wfbutton.refresh') }}</el-button>
        <el-button @click="historyTableVisiable = false">{{ $t('wfbutton.return') }}</el-button>
      </div>
    </yu-xdialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import './nwflist.css';
import './jWorkflow/jobFlowGraph.css';
import workflow from './workFlow/workFlow'
import { getUrl, download } from '@/utils/util'
import { getAccessToken} from '@/utils/oauth'
import { sessionStore, extend } from '@/utils'
import { getLanguage } from '@/utils/i18n'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
export default {
  name: 'nwflist',
  components: { workflow },
  data: function() {
    var _this = this;

    return {
      uploadHeader: {Authorization: 'Bearer ' + getAccessToken(), 'Accept-Language': getLanguage() === 'zh_CN' ? 'zh-CN' : 'en-US'},
      flowNameRule: [
        {required: true, message: _this.$t('wflist.msgbtx'), trigger: 'blur'},
        {max: 64, message: _this.$t('wflist.msgcdxz64')}
      ],
      formdata1: {},
      urls: {
        index: backend.workflowService + "/api/nwfflow/query",
        show: backend.workflowService + "/api/nwfflow/flow/",
        create: backend.workflowService + "/api/nwfflow/create",
        update: backend.workflowService + "/api/nwfflow/update/",
        batchdelete: backend.workflowService + "/api/nwfflow/delete/all",
        delete: backend.workflowService + "/api/nwfflow/delete",
        state: backend.workflowService + "/api/nwfflow/state/",
        exportFlow: backend.workflowService + "/api/nwfflow/exportFlow/",
        importFlow: getUrl({
          url: backend.workflowService + "/api/nwfflow/importFlow/"
        }),
        history: backend.workflowService + "/api/nwfflowhis/query",
      },
      commonparams: {},
      params: {},
      baseParams: {
        // condition: JSON.stringify({
        //   systemId: "cmis"
        // })
        systemId: "cmis"
      },
      editForm: {
        newflowId: "",
        newflowName: ""
      },
      reformData: {},
      historyTableParams: {},
      height: sessionStore.get(VIEW_SIZE).height - 103,
      newdialogVisible: false,
      updatedialogVisible: false,
      historyTableVisiable: false,
      formDisabled: false,
      viewType: "ADD",
      startTime: "",
      Switch: [],
      trackDialogVisible: false,
      nwfTrackPage: "nwfTrackPage",
      routerTo: {},
      viewTitle: this.$lookup.find("CRUD_TYPE", false),
      flowId: ''
    };
  },
  computed: {
    ...mapGetters([
      'userCode', 'logicSys', 'org'
    ])
  },
  created () {
    this.commonparams = {
      systemId: this.logicSys.id,
      CurrentuserId: this.userCode
    }
  },
  methods: {
    switchStatus: function(viewType) {
      var _this = this;
      _this.viewType = viewType;
      if (viewType == "EDIT") {
        _this.updatedialogVisible = true;
      } else if (viewType == "ADD") {
        _this.newdialogVisible = true;
      }
    },
    addFn: function() {
      // 新增
      var _this = this;
      _this.switchStatus("ADD"); // 切换面板状态
    },
    modifyFn: function(row) {
      // 修改
      this.switchStatus("EDIT");
      this.$nextTick(function() {
        extend(this.reformData, row);
      });
    },
    customRowOp: function(scope, op) {
      // 当前行号：scope.$index
      // 当前行数据：scope.row
      // 当前列对象：scope.column
      // this.$alert('你现在正在操作：' + op + '当前行ID值为：' + scope.row.flowId, '提示');
      var _this = this;
      var state = "";
      if (op == "edit") {
        // 启用状态无法编辑
        if (scope.row.flowState == "R") {
          _this.$message({
            duration: 4000,
            message: _this.$t('wflist.msgqyztwfbj'),
            type: "warning"
          });
          return;
        }
        _this.viewType = "EDIT"; // 切换面板状态
        _this.$nextTick(function() {
          // 打开工作流编辑
          state = "B";
          _this.changeState(scope.row, state, false);
          _this.openWorkFlow(scope.row);
        });
      } else if (op == "stop") {
        // 停用
        state = "E";
        _this.changeState(scope.row, state);
      } else if (op == "start") {
        // 启用
        state = "R";
        _this.changeState(scope.row, state);
      } else if (op == "info") {
        // 查看
        _this.infoFn(scope.row);
      }
    },
    infoFn: function(row) {
      var _this = this;
      var params = {
        flowId: row.flowId
      };
      _this.$request({
        method: "POST",
        url: _this.urls.show,
        data: params
      }).then(({code, message, data}) => {
        if (code == 0) {
          if (data != null) {
            if (data.flowContent == null) {
              _this.$message({
                duration: 4000,
                message: _this.$t('wflist.msgflowisnull'),
                type: "warning"
              });
              return;
            }

            _this.flowId = row.flowId + "";
            _this.trackDialogVisible = true;
          } else {
            _this.$message({
              duration: 4000,
              message: _this.$t('wflist.msgflownotexit'),
              type: "warning"
            });
          }
        } else {
          _this.$message({
            duration: 4000,
            message: _this.$t('wflist.msgerror') + message.substring(0, 100),
            type: "error"
          });
        }
      })
    },
    openWorkFlow: function(data) {
      // 重新打开节点页面
      var routeId = "router_flow_" + data.flowId;
      var path = '/workflow/studio/nwflist/jWorkflow/jWorkflow'

      // var r = yufp.router.getRoute(path);
      // var r = this.$router.match(path);
      // if(r && r.fullPath === '/404') {
      //   console.log('r: ', r);
      //   this.$router.addRoute(path, routeId, {});
      // }

      delete data.flowContent;
      data.title = data.flowName + this.$t('wflist.titletu')

      // yufp.frame.addTab({
      //   id: path,
      //   title: data.title,
      //   name: data.title,
      //   key: data.title,
      //   // 页签名称
      //   data: data // 传递的业务数据，可选配置
      // });

      const queryData = {
        flowId: data.flowId,
        flowSign: data.flowSign,
        title: data.title,
        flowName: data.flowName,
        flowAdmin: data.flowAdmin,
        startTime: data.startTime,
        updateTime: data.updateTime,
        flowVersion: data.flowVersion,
        orgId: data.orgId,
        systemId: data.systemId
      };
      this.$router.addRoute(path, data.title, {noCache: true}, '/workflow/studio/nwflist/jWorkflow/jWorkflow'); // 第三个参数meta详情见VUE官方的router参数
      // 缓存路由数据
      const name = '/workflow/studio/nwflist/jWorkflow/jWorkflow'
      const params = sessionStore.get('DYNAMIC_ROUTES_PARMS')
      if(params) {
        params[name] = queryData
        sessionStore.set('DYNAMIC_ROUTES_PARMS', params)
      } else {
        sessionStore.set('DYNAMIC_ROUTES_PARMS', {[name]: queryData})
      }
      this.$router.push({
        name: name,
        params: {queryData}
      }); // query 可传递新页面初始化加载的参数
      // this.$router.addRoute(path, data.title, {}, '/workflow/studio/nwflist/jWorkflow/jWorkflow'); // 第三个参数meta详情见VUE官方的router参数
      // this.$router.push({ path: '/workflow/studio/nwflist/jWorkflow/jWorkflow', query: queryData }); // query 可传递新页面初始化加载的参数
    },
    // 切换流程图状态
    changeState: function(row, state, flag = true) {
      var _this = this;
      var param = {
        flowId: row.flowId,
        flowState: state,
        flowSign: row.flowSign,
        startTime: row.startTime
      };
      _this.$request({
        method: "POST",
        url: _this.urls.state,
        data: param
      }).then(({code, message, data}) => {
        if (data) {
          if (state == "R") {
            _this.$message(_this.$t('wflist.msgflowon'));
          } else if (state == "E") {
            _this.$message(_this.$t('wflist.msgflowoff'));
          }
          if (flag) {
            _this.searchFn();
          }
        } else {
          _this.$message({
            duration: 4000,
            message: _this.$t('wflist.msglctczyc') + ":" + message,
            type: "error"
          });
        }
      })
    },
    // 切换流程图状态
    changeStateHis: function(row, state) {
      var _this = this;
      var param = {
        flowId: row.flowId,
        flowState: state,
        flowSign: row.flowSign,
        startTime: row.startTime
      };
      _this.$request({
        method: "POST",
        url: backend.workflowService + "/api/nwfflowhis/stateHis",
        data: param
      }).then(({code, message, data}) => {
        if (data && data.code === "0") {
          if (state == "R") {
            _this.$message(_this.$t('wflist.msgflowon'));
            _this.$refs.historyTable.remoteData();
          } else if (state == "E") {
            _this.$message(_this.$t('wflist.msgflowoff'));
            _this.$refs.historyTable.remoteData();
          }
        } else {
          _this.$message({
            duration: 4000,
            message: _this.$t('wflist.msglctczyc') + ":" + message,
            type: "error"
          });
        }
      })
    },
    handleChange: function(file, fileList) {
      // console.info('操作成功');
    },
    // 上传成功
    handleUploadSuccess: function(response, file, fileList) {
      var _this = this;
      if (response.data == "1") {
        _this.$message({
          duration: 4000,
          message: _this.$t('wflist.msglcbhyjcz'),
          type: "warning"
        });
      } else if (response.code == "500") {
        this.$message({
          duration: 4000,
          message: response.message ? response.message : _this.$t('wflist.msgerrorfiletype'),
          type: "warning"
        });
      }
      _this.searchFn();
    },
    // 导出
    exportFn: function(row) {
      var _this = this;
      if(!row.flowContent) {
        _this.$message({message: _this.$t('wflist.msglctnrwkbyxdc'), type: "warning"});
        return;
      }
      var exportUrl = _this.urls.exportFlow + row.flowId + "/" + row.flowSign;
      download(exportUrl);
    },
    // 删除所有
    deleteAllFn: function(row) {
      var _this = this;
      var selections = _this.$refs.reftable.selections;
      if (!row) {
        _this.$message({message: _this.$t('wflist.msgselectone'), type: "warning"});
        return;
      }
      if (row.flowState == "R") {
        _this.$message({message: _this.$t('wflist.msgqydlcjzsc'), type: "warning"});
        return;
      }
      _this
        .$confirm(_this.$t('wflist.msgsuredelete') + row.flowName + "】？", _this.$t('wflist.tip'), {
          confirmButtonText: _this.$t('wfbutton.sure'),
          cancelButtonText: _this.$t('wfbutton.cancel'),
          type: "warning",
          center: true
        })
        .then(function() {
          _this.$request({
            method: "POST",
            url: _this.urls.batchdelete,
            data: {flowSign: row.flowSign}
          }).then(({code, message, data}) => {
            if (code === "0") {
              _this.searchFn();
              _this.$message({
                duration: 4000,
                message: _this.$t('wflist.msgsccg'),
                type: "success"
              });
            } else {
              _this.$message({
                duration: 4000,
                message: _this.$t('wflist.msgdeleteerror') + message,
                type: "error"
              });
            }
          })
        })
        .catch(function () {});
    },
    deleteFn: function(row) {
      var _this = this;
      if (!row) {
        _this.$message({message: _this.$t('wflist.msgselectone'), type: "warning"});
        return;
      }
      if (row.flowState == "R") {
        _this.$message({message: _this.$t('wflist.msgqydlcjzsc'), type: "warning"});
        return;
      }
      _this
        .$confirm(_this.$t('wflist.msgsuredelete') + row.flowName + "】？", _this.$t('wflist.tip'), {
          confirmButtonText: _this.$t('wfbutton.sure'),
          cancelButtonText: _this.$t('wfbutton.cancel'),
          type: "warning",
          center: true
        })
        .then(function() {
          _this.$request({
            method: "POST",
            url: _this.urls.delete,
            data: {flowId: row.flowId, flowSign: row.flowSign}
          }).then(({code, message, data}) => {
            if (code == 0) {
              // _this.$refs.reftable.remoteData();
              _this.$refs.historyTable.remoteData();
              if (data == 0) {
                _this.$message({
                  duration: 4000,
                  message: _this.$t('wflist.msgydbbjdlcbyxsc'),
                  type: "warning"
                });
              } else {
                _this.$message({
                  duration: 4000,
                  message: _this.$t('wflist.msgsccg'),
                  type: "success"
                });
                // _this.historyTableVisiable = false;
              }
            } else {
              _this.$message({
                duration: 4000,
                message: _this.$t('wflist.msgdeleteerror') + message,
                type: "error"
              });
            }
          })
        })
        .catch(function () {});
    },
    // 新增流程图
    sureAdd: function() {
      var _this = this;
      var validate = false;
      _this.$refs.newform.validate(function(valid) {
        validate = valid;
      });
      if (!validate) {
        _this.$message({message: _this.$t('wflist.msgiuputname'), type: "warning"});
        return;
      }
      _this.getdate();
      var param = {
        flowName: _this.editForm.newflowName,
        flowAdmin: _this.commonparams.CurrentuserId,
        orgId: _this.org.code,
        systemId: "cmis",
        startTime: _this.startTime
      };
      // 特殊字符校验
      var reg = new RegExp(
        "[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）|{}【】‘；：”“'。，、？]"
      );
      if (param.flowName && reg.test(param.flowName)) {
        _this.$message({
          message: _this.$t('wflist.msginputillegal'),
          type: "warning"
        });
        return;
      }
      _this.$request({
        method: "POST",
        url: _this.urls.create,
        data: param
      }).then(({code, message, data}) => {
        if (code === '0') {
          _this.searchFn();
          _this.$message(_this.$t('wflist.msgflowadd'));
          _this.newdialogVisible = false;
        } else {
          _this.$message({
            duration: 4000,
            message: _this.$t('wflist.msgadderror') + message,
            type: "error"
          });
        }
      })
    },
    cancel: function() {
      var _this = this;
      _this.newdialogVisible = false;
      _this.$nextTick(function() {
        // _this.editForm.newflowName = '';
        _this.$refs.newform.resetFields();
      });
    },
    cancelModify: function() {
      var _this = this;
      _this.updatedialogVisible = false;
      _this.$nextTick(function() {
        _this.$refs.reform.resetFields();
      });
    },
    sureModify: function() {
      var _this = this;
      var validate = false;
      var model = _this.reformData;
      _this.$refs.reform.validate(function(valid) {
        validate = valid;
      });
      if (!validate) {
        _this.$message({message: _this.$t('wflist.msgqsrxghdmc'), type: "warning"});
        return;
      }
      // 特殊字符校验
      var reg = new RegExp(
        "[`~!@#%$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）|{}【】‘；：”“'。，、？]"
      );
      if (model.flowName && reg.test(model.flowName)) {
        _this.$message({
          message: _this.$t('wflist.msginputillegal'),
          type: "warning"
        });
        return;
      }
      model.updateId = _this.userCode;
      _this.$request({
        method: "POST",
        url: _this.urls.update,
        data: model
      }).then(({code, message, data}) => {
        if (code == 0) {
          _this.searchFn();
          _this.$message({message: _this.$t('wflist.msgeditsuccess'), type: "success"});
          _this.updatedialogVisible = false;
          _this.$nextTick(function() {
            _this.$refs.reform.resetFields();
          });
        }
      })
    },
    getdate: function() {
      var d = new Date();
      var year = d.getFullYear();
      var month =
        d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
      var date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
      var hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
      var minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      var seconds = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
      var myWant =
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        seconds;
      this.startTime = myWant;
    },
    trackClose: function() {
      this.trackDialogVisible = false;
    },
    saveAsNew: function(row) {
      // 保存为新版本
      var _this = this;
      _this
        .$confirm(
          _this.$t('wflist.msgqdyjlc') + row.flowName + _this.$t('wflist.msgklwxdlc'),
          _this.$t('wflist.tip'),
          {
            confirmButtonText: _this.$t('wfbutton.sure'),
            cancelButtonText: _this.$t('wfbutton.cancel'),
            type: "warning",
            center: true
          }
        )
        .then(function() {
          _this.$request({
            method: "POST",
            data: {
              flowId: row.flowId,
              flowSign: row.flowSign,
              userId: _this.CurrentuserId
            },
            url: backend.workflowService + "/api/nwfflow/saveNew"
          }).then(({code, message, data}) => {
            if (code === "500") {
              _this.$message({
                duration: 4000,
                message: _this.$t('wflist.msgsavenewfail'),
                type: "warning"
              });
            }
            if (data) {
              if (data.code === "0") {
                _this.$message(_this.$t('wflist.msgsavenewver'));
                _this.searchFn();
              } else {
                _this.$message({message: data.tip, type: "error"});
              }
            }
          })
        })
        .catch(function () {});
    },
    searchFn: function () {
      var model = this.formdata1;
      var params = {
        flowName: model.flowName ? '%' + model.flowName + '%' : "",
        flowId: model.flowId ? model.flowId : "",
        flowSign: model.flowSign ? model.flowSign : ""
      };
      var param = {
        condition: JSON.stringify(params)
      };
      this.$refs.reftable.remoteData(params);
    },
    formResetFn: function() {
      this.$refs.searchForm.resetFields();
      this.$refs.reftable.remoteData();
    },
    // 查看历史版本，打开弹窗
    historyFn: function(row) {
      this.historyTableVisiable = true;
      this.historyTableParams = {
        // condition: JSON.stringify({
        //   flowSign: row.flowSign
        // })
        flowSign: row.flowSign
      }
      // this.refreshHistoryTable();
    },
    // 刷新历史记录列表
    refreshHistoryTable: function() {
      this.$refs.historyTable.remoteData(this.historyTableParams);
    },
    // 关闭历史纪录弹窗
    historyClose: function() {
      this.historyTableParams = {};
    },
    // 切换版本
    changeVer: function(row) {
      var param = {
        flowId: row.flowId,
        flowSign: row.flowSign,
        flowVersion: row.flowVersion,
        userId: this.CurrentuserId
      }
      this.$request({
        url: backend.workflowService + "/api/nwfflowhis/returnVer",
        data: param,
        method: "POST"
      }).then(response => {
        if(response && response.code === "0") {
          this.$message(this.$t('wflist.msgreturnsuccess'));
          this.searchFn();
          this.historyTableVisiable = false;
        }
      })
    },
    /**
     * 快速查询
     * @param e 模糊查询关键字
     */
    fuzzyQuery: function(e) {
      if(null === e.value || e.value === "") {
        this.$refs.reftable.remoteData();
        return;
      }
      var reg = new RegExp(/^(([1-9]{1}\d*)|(0{1}))((.\d{0,2})?)$/);
      if(!reg.test(e.value)) {
        this.$message({message: this.$t('wflist.msgonlynum')});
        return;
      }
      var params = {
        flowId: e.value
      };
      var param = {
        condition: JSON.stringify(params)
      };
      this.$refs.reftable.remoteData(params);
      this.$refs.searchForm.resetFields(); // 清空精确查询查询参数
    },
  }
};
</script>
<style lang="scss" scoped>
@import './nwflist.css';
@import "~@/views/workflow/studio/nwflist/jWorkflow/jobFlowGraph.css";
.yu-edit-dialog .el-form-x-footer {
  text-align: center;
}
</style>

