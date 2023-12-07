
<template>
  <!--
  @created by kongqf on 2019-12-17 13:54:46
  @updated by
  @description wfdemo
  -->
  <div class="yu-workflow" style="margin-left: -10px;margin-right: -10px;">
    <yu-workflow ref="refWorkflow" @init="initGraph" :lock="locked" :height="height" @scale="scaleFn" @addedge="addEdgeFn" :param="comments" @cellclick="cellclickFn">
      <yu-xdialog :title="$t('wfeditor.title1')" :visible.sync="dialogVisible" slot="dialog">
        <yu-row>
          <yu-col>
            <yu-input type="textarea" :rows="15" v-model="nodeScript">
            </yu-input>
          </yu-col>
        </yu-row>
        <div slot="footer">
          <yu-button @click="dialogClose">{{ $t('wfbutton.return') }}</yu-button>
        </div>
      </yu-xdialog>
      <template slot="toolbar">
        <div class="geToolbar jWorkflow">
          <yu-row>
            <yu-col v-for="(items,i) in toolbarItems" :key="'i' + i" :span="14 / toolbarItems.length" :class="i>0?'img-bck':''">
              <a v-for="item in items" class="geItem" :key="item.title" :title="item.title" @click="toolbarItemClickFn(item.action)">
                <img :src="'static/libs/mxgraph/images/'+item.img+'.png'">
                <span>{{ item.title }}</span>
              </a>
            </yu-col>
            <yu-col :span="10">
              <a class="geItem">
                <span class="demonstration">{{ $t('wfeditor.suofang') }}</span>
              </a>
              <a class="geItem">
                <yu-slider v-model="value2" @change="graphViewSliderChangeFn"></yu-slider>
              </a>
              <a class="geItem">
                <yu-select :placeholder="$t('wfeditor.plselect')" v-model="viewScale" class="custom-select" @change="graphViewSelectChangeFn" :clearable="false">
                  <yu-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </yu-option>
                </yu-select>
              </a>
              <a class="geItem abbrImg" :title="$t('wfeditor.lst')" style="background-color: #ffffff;padding: 2px 6px 0;margin: 3px 12px 0px 6px;border-radius: 3px;border: 1px solid #D3DCE6;" @click="toolbarItemClickFn('outline')">
                <img class="toolbar-icon" :src="'static/libs/mxgraph/images/outline.png'" style="margin: 4px;">
              </a>
              <a class="geItem no-right" @click="hideSidebarFn" style="background-color: #ffffff;padding: 2px 4px 0;margin-top: 3px;border-top-left-radius: 3px;border-bottom-left-radius: 3px;border: 1px solid #D3DCE6" v-if="!locked">
                <img :src="'static/libs/mxgraph/images/zuo.png'" style="margin: 4px;">
              </a>
              <a class="geItem no-left" @click="hideFormatbarFn" style="background-color: #ffffff;padding: 2px 4px 0;margin-top: 3px;border-top-right-radius: 3px;border-bottom-right-radius: 3px;border: 1px solid #D3DCE6;border-left: none" v-if="!locked">
                <img :src="'static/libs/mxgraph/images/you.png'" style="margin: 4px;">
              </a>
            </yu-col>
          </yu-row>
        </div>
      </template>
      <template slot="format">
        <yu-xform v-if="formatType === 'vertex'" ref="refFormvertex" label-width="80px" :show-message="false" :hidden-rule="true" v-model="formdatavertex">
          <yu-collapse v-model="activeName">
            <yu-collapse-item name="0">
              <template slot="title">
                <label>{{ $t('wfeditor.properties') }}</label>
              </template>
              <yu-xform-group :column="1">
                <yu-xform-item
                  v-for="item in baseList"
                  :key="item.key"
                  :label="item.name"
                  :ctype="getFormItemCtype(item.type)"
                  :filterable="item.filterable ? item.filterable : false"
                  :readonly="item.readOnly === true"
                  :disabled="item.readOnly === true"
                  :name="item.key"
                  :value="item.defaultValue || ''"
                  :options="item.value"
                  :required="item.required"
                  @select-fn="selectFn"
                  :hidden="item.hidden"
                  popper-class="selectPopper">
                </yu-xform-item>
              </yu-xform-group>
            </yu-collapse-item>
            <yu-collapse-item name="1" v-if="tmpCell && tmpCell.data.nodeType !='S' && tmpCell.data.nodeType !='E' && checkHiddenItem('selectable')">
              <template slot="title">
                <label>{{ $t('wfeditor.selective') }}</label>
              </template>
              <yu-xform-group :column="1">
                <yu-xform-item
                  v-for="item in formItems.selectable"
                  :key="item.key"
                  :label="item.name"
                  :ctype="getFormItemCtype(item.type)"
                  :filterable="item.filterable ? item.filterable : false"
                  :readonly="item.readOnly === true "
                  :value="item.defaultValue || ''"
                  :disabled="item.readOnly === true ? (item.key != 'nodeScriptTxt' && item.key != 'subFlowId'):false"
                  :hidden="item.hidden"
                  :name="item.key"
                  :options="item.value"
                  popper-class="selectPopper">
                </yu-xform-item>
              </yu-xform-group>
            </yu-collapse-item>
            <yu-collapse-item name="2" v-if="tmpCell && tmpCell.data.nodeType !='S' && tmpCell.data.nodeType !='E' && checkHiddenItem('oper')">
              <template slot="title">
                <label>{{ $t('wfeditor.action') }}</label>
              </template>
              <yu-xform-group :column="1">
                <yu-xform-item
                  v-for="item in formItems.oper"
                  :key="item.key"
                  :label="item.name"
                  :ctype="getFormItemCtype(item.type)"
                  :filterable="item.filterable ? item.filterable : false"
                  :readonly="item.readOnly === true"
                  :disabled="item.readOnly === true"
                  :name="item.key"
                  :value="item.defaultValue || ''"
                  :options="item.value"
                  :hidden="item.hidden"
                  popper-class="selectPopper">
                </yu-xform-item>
              </yu-xform-group>
            </yu-collapse-item>
          </yu-collapse>
        </yu-xform>
        <yu-xform v-if="formatType === 'edge'" ref="refFormedge" label-width="80px" v-model="formdataedge">
          <yu-collapse v-model="activeName">
            <yu-collapse-item name="0">
              <template slot="title">
                <label>{{ $t('wfeditor.properties') }}</label>
              </template>
              <yu-xform-group :column="1">
                <yu-xform-item
                  v-for="item in formItems.edge"
                  :key="item.key"
                  :label="item.name"
                  :ctype="getFormItemCtype(item.type)"
                  :readonly="item.readOnly === true"
                  :disabled="item.readOnly === true && item.key != 'routeScriptTxt'"
                  :name="item.key"
                  :filterable="item.filterable ? item.filterable : false"
                  @change="item.change && item.change(item.key, formdataedge[item.key])"
                  :value="item.defaultValue || ''"
                  :options="item.value"
                  @config="nodeScriptSelect"
                  :paramObject="paramObject"
                  :flowSign="flowSign"
                  popper-class="selectPopper"></yu-xform-item>
                <yu-xform-item v-if="formatType == 'edge'" :label="$t('wfeditor.diycolor')" ctype="custom" name="custom">
                  <div style="cursor: pointer;display: flex;align-items: center;">
                    <color-picker ref="colorPicker" default-color="#747B89" v-model="customColor" @change="colorChangeFn"></color-picker>
                    <span @click="openPanelFn" :style="{color: customColor, 'padding-left': '5px'}">{{ customColor }}</span>
                  </div>
                </yu-xform-item>
              </yu-xform-group>
            </yu-collapse-item>
          </yu-collapse>
        </yu-xform>
        <yu-xform v-if="formatType === 'workflow'" ref="refFormworkflow" label-width="80px" v-model="formdataworkflow">
          <yu-collapse v-model="activeName">
            <yu-collapse-item name="0">
              <template slot="title">
                <label>{{ $t('wfeditor.properties') }}</label>
              </template>
              <yu-xform-group :column="1">
                <yu-xform-item
                  v-for="item in formItems.wf"
                  :key="item.key"
                  :label="item.name"
                  :ctype="getFormItemCtype(item.type)"
                  :filterable="item.filterable ? item.filterable : false"
                  :readonly="item.readOnly === true"
                  :disabled="item.readOnly === true"
                  :name="item.key"
                  :value="item.defaultValue || ''"
                  :options="item.value"
                  popper-class="selectPopper"></yu-xform-item>
              </yu-xform-group>
            </yu-collapse-item>
          </yu-collapse>
        </yu-xform>
      </template>
    </yu-workflow>
  </div>
</template>
<script>
import {clone, extend, sessionStore} from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
import { VERTEX_PRO } from "./vertex"
import { EDGE_PRO } from "./edge"
import { WORKFLOW_PRO } from "./wf"
import { NODE_TYPE } from "./nodeType"
import vcolorpicker from 'vcolorpicker'

var size = sessionStore.get(VIEW_SIZE);
let data = {}
export default {
  name:'jWorkflow',
  components: {
    vcolorpicker
  },
  data: function () {
    return {
      customColor: '',
      // height: size.height - 102,
      height: size.height - 59,
      toolbarItems: [],
      value2: 100,
      viewScale: '100%',
      options: [{
        key: 10,
        value: '10%'
      }, {
        key: 20,
        value: '20%'
      }, {
        key: 30,
        value: '30%'
      }, {
        key: 40,
        value: '40%'
      }, {
        key: 50,
        value: '50%'
      }, {
        key: 60,
        value: '60%'
      }, {
        key: 70,
        value: '70%'
      }, {
        key: 80,
        value: '80%'
      }, {
        key: 90,
        value: '90%'
      }, {
        key: 100,
        value: '100%'
      }],
      activeName: ['0'],
      // 如果要展开，直接配置对应item的name值
      graphData: null,
      formItems: {},
      showSidebar: true,
      showFormatbar: true,
      workflowData: data,
      defaultNodeData: {},
      defaultLineData: {},
      defaultDict: {},
      formatType: '',
      tmpCell: null,
      locked: false,
      // 是否预览模式，会自动屏蔽界面上输入操作
      formdatavertex: {},
      formdataedge: {},
      formdataworkflow: {},
      rawValue: '',
      hasInit: false,
      comments: [],
      dialogVisible: false,
      nodeScript: '',
      paramObject: [],
      flowSign: null
    };
  },
  computed: {
    baseList() {
      return this.formItems.base.filter(item => {
        return ((this.tmpCell && (item.key == 'nid' || item.key == 'label')) ? true : (this.tmpCell.data.nodeType != 'S' && this.tmpCell.data.nodeType != 'E'))
      })
    }
  },
  watch: {
    formdatavertex: {
      handler: function (nVal, oldVal) {
        this.btnSaveCellData(this.hasInit);
      },
      deep: true
    },
    formdataedge: {
      handler: function (nVal, oldVal) {
        this.btnSaveCellData(this.hasInit);
      },
      deep: true
    },
    formdataworkflow: {
      handler: function (nVal, oldVal) {
        this.btnSaveCellData(this.hasInit);
      },
      deep: true
    }
  },
  mounted: function () {
    data = this.$route.params.queryData;
    if(!data) {
      const params = sessionStore.get('DYNAMIC_ROUTES_PARMS')
      data = params && params[this.$route.name]
    }
    this.workflowData = data;
    this.flowSign = data.flowSign;
    this.setToolbarItems();
  },
  methods: {
    openPanelFn() {
      this.$refs.colorPicker.openPanel();
    },
    colorChangeFn(v) {
      this.$refs.refWorkflow.updateCell(this.tmpCell.id, 'color', v, this.formatType);
    },
    // 初始化左侧示例图标
    initGraph: function () {
      if (this.locked) {
        this.hideSidebarFn();
        this.hideFormatbarFn();
      }

      this.getDict();
    },
    // 初始化绑定数据
    initData: function () {
      var _this = this; // 获取流程图
      this.$request({
        method: "POST",
        url: backend.workflowService + '/api/nwfflow/index',
        data: {flowId: data.flowId, flowSign: data.flowSign}
      }).then(({code, message, data}) => {
        _this.graphData = data.flowContent;
        _this.graphData && (_this.workflowData = _this.$refs.refWorkflow.loadXML(_this.graphData));
        _this.formatType = 'workflow';

        _this.$nextTick(function () {
          // 初始化图信息
          _this.cellclickFn();

          if (_this.$refs.refWorkflow.getGraphAllvertex().length) {
            _this.$refs.refWorkflow.graph.scrollCellToVisible(_this.$refs.refWorkflow.getGraphAllvertex()[parseInt(_this.$refs.refWorkflow.getGraphAllvertex().length / 2)], true);
          }
          var cells = this.$refs.refWorkflow.graph.getModel().cells;
          for (var key in cells) {
            if (!cells[key].vertex) {
              continue;
            }
            this.$refs.refWorkflow.setImageSize(cells[key]);
          }
        });
      })
    },
    getDict: function () {
      var _this = this;

      _this.$request({
        url: backend.workflowService + '/api/studio/dict',
        data: {},
        method: "POST"
      }).then(response => {
        _this.defaultDict = response;
        _this.dealNodeProperty();
        _this.setSidebarItems();
        _this.initData();
      })
    },
    // 合并表单数据,将数据从表单合并到对象
    extendFormData: function (fd, cd, exc) {
      for (var k in fd) {
        if (fd[k] !== undefined && (!exc || !exc.hasOwnProperty(k))) {
          cd[k] = fd[k];
        }
      }

      return cd;
    },
    // 处理数据，主要用于区分常规属性、可选属性、操作属性
    dealNodeProperty: function () {
      var hasAllBaseData = true;
      this.formItems = {
        base: [],
        oper: [],
        selectable: [],
        edge: [],
        wf: []
      };
      var tmp; // 节点属性

      if (VERTEX_PRO) {
        for (var k in VERTEX_PRO) {
          tmp = clone(VERTEX_PRO[k], {}); // 将select数据转换

          if (tmp.type === 'select') {
            tmp.value = this.changeData2Select(tmp.key, VERTEX_PRO[k].value);
          }

          tmp.required = tmp.required || false;

          if (tmp.dist === 'base' || tmp.dist === 'oper') {
            this.formItems[tmp.dist].push(tmp);
          } else {
            this.formItems['selectable'].push(tmp);
          }

          if (tmp.defaultValue !== undefined) {
            this.defaultNodeData[k] = tmp.defaultValue;
          } else if (['nodeType', 'label'].indexOf(k) === -1) {
            this.defaultNodeData[k] = null;
          }
        }

        this.addDefaultFormItems('base');
      } else {
        hasAllBaseData = false;
      } // 连线属性


      if (EDGE_PRO) {
        for (var k in EDGE_PRO) {
          tmp = clone(EDGE_PRO[k], {}); // 将select数据转换

          if (tmp.type === 'select') {
            tmp.value = this.changeData2Select(tmp.key, EDGE_PRO[k].value);
            tmp.change = (k, v) => {
              if (k === 'isContinueBeanId') {
                if (!this.customColor) {
                  this.customColor = this.formdataedge.customColor ? this.formdataedge.customColor : '#747B89';
                } else {
                  this.customColor = v == '0' || !v ? '#747B89' : '#e2534d';
                }
                this.colorChangeFn(this.customColor);
              }
            }
          }

          tmp.defaultValue !== undefined && (this.defaultLineData[k] = tmp.defaultValue);
          tmp.required = tmp.required || false;
          this.formItems['edge'].push(tmp);
        }

        this.addDefaultFormItems('edge');
      } else {
        hasAllBaseData = false;
      } // 图属性


      if (WORKFLOW_PRO) {
        for (var i in WORKFLOW_PRO) {
          tmp = clone(WORKFLOW_PRO[i], {}); // 将select数据转换

          if (tmp.type === 'select') {
            tmp.value = this.changeData2Select(tmp.key, WORKFLOW_PRO[i].value);
          }

          tmp.defaultValue !== undefined && this.workflowData[i] !== undefined && (this.workflowData[i] = tmp.defaultValue);
          tmp.required = tmp.required || false;
          this.formItems['wf'].push(tmp);
        }
      } else {
        hasAllBaseData = false;
      }

      if (!hasAllBaseData) {
        this.$message({
          message: this.$t('wfeditor.msgbaselost'),
          type: 'warning'
        });
      }
    },
    // 将数据转换成下拉框格式
    changeData2Select: function (key, data) {
      var options = [];

      if (this.defaultDict[key]) {
        options = [];

        for (var i = 0, l = this.defaultDict[key].length; i < l; i++) {
          options.push({
            key: this.defaultDict[key][i].key,
            value: this.defaultDict[key][i].desc
          });
        }
      } else if (data && Object.prototype.toString.call(data) === '[object Object]') {
        options = [];

        for (var k in data) {
          options.push({
            key: k,
            value: data[k]
          });
        }
      }

      return options;
    },
    // 增加表单默认项
    addDefaultFormItems: function (key) {
      if (key == 'edge') {
        this.formItems[key].unshift({
          name: this.$t('wfeditor.routeid'),
          key: 'nid',
          type: 'input',
          readOnly: true
        });
      } else if (key == 'base') {
        this.formItems[key].unshift({
          name: this.$t('wfeditor.nodeid'),
          key: 'nid',
          type: 'input',
          readOnly: true
        });
      }
    },
    // 获取表单输入项类型
    getFormItemCtype: function (type) {
      if (['text'].indexOf(type) > -1) {
        return 'input';
      }

      return type;
    },
    checkHiddenItem: function (type) {
      var has = false;
      this.formItems[type].forEach(function (item) {
        if (item.hidden === false) {
          has = true;
        }
      });
      return has;
    },
    // 根据节点类型切换表单字段是否显示
    changeNodeFieldHidden: function (cell) {
      if (this.formatType === 'vertex') {
        var fields = [];
        var exfields = [];

        for (var i = 0, l = NODE_TYPE.length; i < l; i++) {
          if (cell.data.nodeType === NODE_TYPE[i].nodeType) {
            exfields = NODE_TYPE[i].exfields || [];
            fields = NODE_TYPE[i].fields || [];
            break;
          }
        }

        var _this = this;

        ['base', 'oper', 'selectable'].forEach(function (t) {
          var item;

          for (var k = 0, l = _this.formItems[t].length; k < l; k++) {
            item = _this.formItems[t][k];

            if (exfields.length > 0) {
              if (exfields.indexOf(item.key) > -1) {
                _this.formItems[t][k].hidden = true;
              } else {
                _this.formItems[t][k].hidden = false;
              }
            } else if (fields.length === 0 || fields.indexOf(item.key) > -1 || item.key === 'nid') {
              _this.formItems[t][k].hidden = false;
            } else {
              _this.formItems[t][k].hidden = true;
            }
          }
        });
      }
    },
    // 节点单击事件
    cellclickFn: function (cell) {
      this.hasInit = false;

      if (!this.formatType) {
        this.$nextTick(function () {
          this.$refs['refForm' + this.formatType].resetFields(1);
        });
      } // 切换节点点击时，默认将属性面板展开


      if (this.activeName.indexOf('0') == -1) {
        this.activeName.push('0');
      }

      this.formatType = '';
      this.$nextTick(function () {
        if (cell === undefined) {
          // 选中的是图
          this.formatType = 'workflow';
          this.$nextTick(function () {
            extend(true, this.formdataworkflow, this.workflowData);
            this.hasInit = true;
          });
        } else if (cell.vertex) {
          this.formatType = 'vertex';
          this.tmpCell = cell;
          this.changeNodeFieldHidden(cell);
          ['copyUsers', 'nodeSign', 'subFlow', 'subFlowId', 'nodeScriptTxt'].forEach(item => {
            this.formdatavertex[item] = null;
          });
          this.$nextTick(function () {
            extend(true, this.formdatavertex, cell.data);
            this.hasInit = true;
          });
        } else if (cell.edge) {
          // 连线
          this.formatType = 'edge';
          this.tmpCell = cell;
          this.customColor = '';
          this.$nextTick(function () {
            if (!cell.data.routeScriptTxt) {
              this.formdataedge.routeScriptTxt = '';
            }
            if (cell.data.nodeScriptConfig) {
              this.paramObject = cell.data.nodeScriptConfig;
            } else {
              cell.data.nodeScriptConfig = [];
              this.paramObject = [];
            }
            extend(true, this.formdataedge, cell.data);
            this.hasInit = true;
          });
        }
      });
    },
    // 添加连线
    addEdgeFn: function (cell) {
      extend(true, cell.data, this.defaultLineData);
    },
    btnSaveCellData: function (hasInit) {
      if (hasInit) {
        var formatName = 'formdata' + this.formatType;

        if (this.formatType == 'vertex' || this.formatType == 'edge') {
          // 更新节点属性信息
          this.$refs.refWorkflow.updateCell(this.tmpCell.id, 'label', this[formatName].label, this.formatType);
          this.$refs.refWorkflow.updateCell(this.tmpCell.id, 'data', this.extendFormData(this[formatName], this.tmpCell.data), this.formatType);
        } else if (this.formatType == 'workflow') {
          // 保存图数据
          this.workflowData = this.extendFormData(this[formatName], this.workflowData);
        }
      }
    },
    // 顶部工具条按钮单击事件
    toolbarItemClickFn: function (fn) {
      if (typeof fn === 'string') {
        this.$refs.refWorkflow.doAction(fn);
      } else if (typeof fn === 'function') {
        fn();
      }
    },
    // 下拉框改变缩放大小设置
    graphViewSelectChangeFn: function (val) {
      if (val) {
        this.changeGraphViewScaleFn(parseInt(this.viewScale) / 100);
      }
    },
    // 滑块拖动缩放设置
    graphViewSliderChangeFn: function () {
      this.changeGraphViewScaleFn(parseInt(this.value2) / 100);
    },
    resetGraphViewScaleFn: function () {
      this.changeGraphViewScaleFn(1);
    },
    // 缩放graph图
    scaleFn: function (evt) {
      var scale = evt.getProperties('scale');

      if (this.viewScale !== scale.scale) {
        this.viewScale = parseInt(scale.scale * 100) + '%';
      }
    },
    changeGraphViewScaleFn: function (v) {
      // 同时更新界面上对应的缩放值
      this.value2 = parseInt(v * 100);
      this.viewScale = this.value2 + '%';
      this.$refs.refWorkflow.graphScale(v);
    },
    // 设置左侧示例图
    setSidebarItems: function () {
      var _this = this;

      var tmpData = {};
      var items = [];
      var types = [];
      NODE_TYPE.forEach(function (item) {
        tmpData = {
          nodeType: item.nodeType,
          label: item.label || item.title
        };
        types.push(item.nodeType);
        items.push({
          img: item.img,
          title: item.title,
          data: ['S', 'E'].indexOf(item.nodeType) > -1 ? tmpData : clone(_this.defaultNodeData, tmpData)
        });
      });
      this.$refs.refWorkflow.setNodeType(types);
      this.$refs.refWorkflow.setSidebar(items);
    },
    // 设置顶部工具条按钮
    setToolbarItems: function () {
      var items = [[{
        img: 'save',
        title: this.$t('wfeditor.fabu'), // 保存
        action: this.saveGraphXMl
      }, // { img: 'auto', title: 'XML', action: 'editDiagram'},
      {
        img: 'xml',
        title: 'XML',
        action: this.showGraphXMl
      }, {
        img: 'help',
        title: this.$t('wfeditor.help'),
        action: 'help'
      }] // [
      //   { img: 'select', title: '选择'},
      //   { img: 'edge', title: '连线'},
      //   { img: 'drag', title: '拖动'},
      //   { img: 'redo', title: '撤销', action: 'undo'},
      //   { img: 'back', title: '回退', action: 'redo'},
      //   { img: 'outline', title: '缩略图', action: 'outline'}
      // ]
      ];

      if (this.locked) {
        items = [[{
          img: 'help',
          title: this.$t('wfeditor.help'),
          action: 'help'
        }]];
      }

      this.toolbarItems = items;
    },
    // 隐藏左侧面板
    hideSidebarFn: function () {
      this.$refs.refWorkflow.hideSidebar(this.showSidebar = !this.showSidebar);
    },
    // 隐藏右侧面板
    hideFormatbarFn: function () {
      this.$refs.refWorkflow.hideFormatbar(this.showFormatbar = !this.showFormatbar);
    },
    showGraphXMl: function () {
      var flowContent = this.$refs.refWorkflow.getXML(this.workflowData);

      if (flowContent) {
        this.dialogVisible = true;
        this.nodeScript = flowContent;
      }
    },
    dialogClose: function () {
      this.dialogVisible = false;
    },
    // 保存流程图内容
    saveGraphXMl: function () {
      var _this = this;

      var flowContent = this.$refs.refWorkflow.exportXML(this.workflowData);

      if (flowContent) {
        var param = {
          'flowId': this.workflowData.flowId,
          'flowSign': this.workflowData.flowSign,
          'flowContent': flowContent
        };
        this.$request({
          method: 'POST',
          data: param,
          url: backend.workflowService + '/api/nwfflow/update'
        }).then(({code, message, data}) => {
          if (data == 1) {
            _this.$message(_this.$t('wfeditor.msglctfbcg'));
          }
        })
      }
    },
    selectFn(u, k, v) {
      this.$refs.refWorkflow.updateCell(this.tmpCell.id, 'data_convertLabel', v, this.formatType);
    },
    nodeScriptSelect: function(u) {
      this.tmpCell.data.nodeScriptConfig = u;
      this.paramObject = u;
      this.$refs.refWorkflow.updateCell(this.tmpCell.id, 'script_config', u, this.formatType);
    },
  }

}
</script>
<style lang="scss" scoped>
@import "./jobFlowGraph.css";
::v-deep .m-colorPicker .box{
  right: -120px;
}
</style>
