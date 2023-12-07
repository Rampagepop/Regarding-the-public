<template>
  <div class="yu-workflow" style="border-bottom: 1px solid #dadce0">
    <slot name="dialog"></slot>
    <div :id="splashID" :style="splashStyle">
      <img src="static/libs/mxgraph/images/loading.gif" />
    </div>
    <el-row style="padding: 0; background-color: rgba(234, 234, 234, 1)">
      <el-col :span="24" style="margin-bottom: 1px">
        <div :id="toolbarID" class="workflow-toolbar">
          <slot name="toolbar"></slot>
        </div>
      </el-col>
      <el-col :span="24">
        <div :id="sidebarID" class="geSidebarContainer">
          <slot name="sidebar"></slot>
        </div>
        <div
          :id="containerID"
          class="yu-workflow-container"
          style="
            position: relative;
            background: url('static/libs/mxgraph/images/grid.gif');
          "
          :style="{ height: height + 'px' }"
        ></div>
        <div
          :id="formatbarID"
          class="workflow-format geSidebarContainer geFormatContainer"
        >
          <slot name="format"></slot>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
/* eslint no-undef:0 */
export default {
  name: "YuWorkflow",
  props: {
    height: {
      // 画布高度
      type: Number,
      default: 500,
    },
    toolbarClass: {
      // 工具条样式
      type: String,
      default: "",
    },
    sidebarItems: {
      type: Array,
      default: function () {
        return [];
      },
    },
    showSidebar: {
      // 工具条样式
      type: Boolean,
      default: true,
    },
    showToolbar: {
      // 左侧工具调
      type: Boolean,
      default: true,
    },
    lock: {
      // 是否锁定graph
      type: Boolean,
      default: false,
    },
    param: {
      // 评论信息
      type: Array,
      default: function () {
        return [];
      },
    },
    showPopupMenu: {
      // 是否显示popupmenu
      type: Boolean,
      default: true,
    }
  },
  data: function () {
    return {
      locked: this.viewType === "view" || this.lock,
      editorui: null,
      graph: null,
      editor: null,
      outline: null,
      toolbar: null,
      layoutAnimate: true,
      layoutCount: 0,
      size: null,
      edges: [],
      containerID: "",
      splashID: "",
      toolbarID: "",
      outlineID: "",
      sidebarID: "",
      formatbarID: "",
      container: null,
      template: "",
      isLayouting: false, // 是否正在自动布局
      isIniting: true, // 是否正在初始化
      outlineHiddenClick: false,
    };
  },
  computed: {
    splashStyle: function () {
      return {
        width: "100%",
        height: "100%",
        "line-height": this.height + "px",
        background: "white",
        position: "absolute",
        top: "0px",
        left: "0px",
        "z-index": 11,
        "text-align": "center",
        "vertical-align": "middle",
      };
    },
  },
  created: function () {
    this.containerID = "graph_" + new Date().getTime();
    this.splashID = "splash_" + new Date().getTime();
    this.toolbarID = "toolbar_" + new Date().getTime();
    this.outlineID = "outline_" + new Date().getTime();
    this.sidebarID = "sidebar_" + new Date().getTime();
    this.formatbarID = "formatbar_" + new Date().getTime();
  },
  mounted: function () {
    this.$nextTick(function () {
      var _this = this;
      var hideSplash = function () {
        // Fades-out the splash screen
        var splash = document.getElementById(_this.splashID);

        if (splash != null) {
          try {
            window.mxEvent.release(splash);
            window.mxEffects.fadeOut(splash, 100, true);
          } catch (e) {
            splash.parentNode.removeChild(splash);
          }
        }
      };
      try {
        if (!window.mxClient.isBrowserSupported()) {
          window.mxUtils.error("Browser is not supported!", 200, false);
        } else {
          this.initEditor();
          hideSplash();
        }
      } catch (e) {
        hideSplash();
        window.mxUtils.alert(this.$t('wfeditor.msginitflowerror') + e.message);
      }
    });
  },
  beforeDestroy: function () {
    this.editorui && this.editorui.actions && this.editorui.actions.outlineWindow &&
      this.editorui.actions.outlineWindow.destroy();
  },
  methods: {
    initEditor: function () {
      window.actionDelage = function () {};
      var _this = this;
      var container = document.getElementById(this.containerID);
      window.mxResources.loadDefaultBundle = false;
      var bundle =
        window.mxResources.getDefaultBundle(
          window.RESOURCE_BASE,
          window.mxLanguage
        ) ||
        window.mxResources.getSpecialBundle(
          window.RESOURCE_BASE,
          window.mxLanguage
        );

      mxPerimeter.CustomPerimeter = function (
        bounds,
        vertex,
        next,
        orthogonal
      ) {
        var cx = bounds.getCenterX();
        var cy = bounds.getCenterY();
        var dx = next.x - cx;
        var dy = next.y - cy;
        var alpha = Math.atan2(dy, dx);
        var p = new mxPoint(0, 0);
        var pi = Math.PI;
        var pi2 = Math.PI / 2;
        var beta = pi2 - alpha;
        var t = Math.atan2(bounds.height, bounds.width);
        var margin = 2; // 锚点边距
        if (alpha < -pi + t || alpha > pi - t) {
          // Left edge 左侧锚点
          p.x = bounds.x - margin;
          p.y = dy === 0 ? cy - (bounds.width * Math.tan(alpha)) / 2 : cy;
        } else if (alpha < -t) {
          // Top Edge 顶部锚点
          p.y = bounds.y - margin;
          p.x = dx === 0 ? cx - (bounds.height * Math.tan(beta)) / 2 : cx;
        } else if (alpha < t) {
          // Right Edge 右侧锚点
          p.x = bounds.x + bounds.width + margin;
          p.y = dy === 0 ? cy + (bounds.width * Math.tan(alpha)) / 2 : cy;
        } else {
          // Bottom Edge 底部锚点
          p.y = bounds.y + bounds.height + margin;
          p.x = dx === 0 ? cx + (bounds.height * Math.tan(beta)) / 2 : cx;
        }
        return p;
      };
      mxStyleRegistry.putValue("customPerimeter", mxPerimeter.CustomPerimeter);
      mxLog.show = function () {};
      mxLog.debug = function (e) {
        console.log(this.$t('wfeditor.msgoptionerror'), e);
      };
      mxObjectCodec.prototype.getNodeCustomType = function (nodeType, node) {
        return nodeType;
      };
      mxCodec.prototype.getElementByTagName = function (tagName) {
        var tmpElement = [];
        var htmlAllCollection = this.document.all;
        for (var k in htmlAllCollection) {
          if (
            htmlAllCollection[k].tagName &&
            htmlAllCollection[k].tagName.toLowerCase() === tagName.toLowerCase()
          ) {
            tmpElement.push(htmlAllCollection[k]);
          }
        }
        return tmpElement;
      };
      mxCodec.prototype.getAttributesByTagName = function (tagName) {
        var tmpElements = this.getElementByTagName(tagName);
        if (tmpElements && tmpElements.length > 0) {
          var tmpAttributes = {};
          var tmpEle = tmpElements[0];
          for (var i = 0, l = tmpEle.attributes.length; i < l; i++) {
            tmpAttributes[tmpEle.attributes[i].name] =
              tmpEle.attributes[i].value;
          }
          return tmpAttributes;
        }
        return null;
      };
      mxEvent.disableContextMenu(container);
      // Fixes possible asynchronous requests
      window.mxUtils.getAll(
        [bundle, window.STYLE_PATH + "default.xml"],
        function (xhr) {
          // Adds bundle text to resources
          window.mxResources.parse(xhr[0].getText());
          var themes = {};
          themes[
            window.Graph.prototype.defaultThemeName
          ] = xhr[1].getDocumentElement();
          _this.editorui = new window.EditorUi(
            new window.Editor(false, themes),
            container,
            undefined,
            {
              menuBar: false,
              toolbar: _this.toolbarID,
              sidebarFooter: false,
              formatbar: _this.formatbarID,
              sidebar: _this.showSidebar
                ? { items: _this.sidebarItems }
                : false,
            }
          );
          _this.graph = _this.editorui.editor.graph;
          _this.graph.setCellsResizable(false);
          _this.graph.centerZoom = true;
          _this.graph.keepEdgesInForeground = true;
          _this.graph.resetEdgesOnMove = false;
          _this.graph.cellsEditable = false; // 禁用编辑(连线的value)
          _this.editorui.sidebar.enableTooltips = false;
          _this.editorui.sidebar.isEnabled = false;
          // 自定义popupMenuToolbar构造方法
          if (!_this.showPopupMenu) {
            _this.graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {};
          }
          // 连接事件
          _this.graph.addListener(mxEvent.CELL_CONNECTED, function (
            sender,
            evt
          ) {
            var edge = evt.getProperty("edge");
            if (edge) {
              if (edge.target && edge.source) {
                edge.data = edge.data || {};
                edge.data.nid = edge.id;
                edge.data.source = edge.source.id;
                edge.data.target = edge.target.id;
                _this.setDefaultEdgeStyle(edge);
                setTimeout(function() {
                  // _this.graph.setCellStyles('exitX', null, [edge]);
                  // _this.graph.setCellStyles('entryX', null, [edge]);
                  // _this.graph.setCellStyles('exitY', null, [edge]);
                  // _this.graph.setCellStyles('entryY', null, [edge]);
                }, 10)
              } else {
                if (!_this.isLayouting && !_this.isIniting) { // 初始化添加连线和自动布局的时候不判断连线是否有target或source
                  setTimeout(function () {
                    if (!edge.source || !edge.target) { // 需要延迟判断，刚添加连线时edge.target或edge.source为null
                      _this.$message({message: _this.$t('wfeditor.msglxqdhjsbnwk'), type: 'warning'});
                      _this.editorui.undo();
                      _this.editorui.editor.undoManager.history.pop();
                    }
                  }, 10);
                }
              }
            }
          });
          // 节点移动事件
          _this.graph.addListener(mxEvent.CELLS_MOVED, function (sender, evt) {
            var cell = evt.properties.cells[0];
            if (cell && cell.edge) {
              if (!cell.target || !cell.source) {
                _this.$message({
                  message: _this.$t('wfeditor.msglxqdhjsbnwk'),
                  type: "warning",
                });
                setTimeout(function () {
                  _this.editorui.undo();
                  _this.editorui.editor.undoManager.history.pop(); // 删除历史记录中最后一条
                });
                return false;
              }
            } else if (cell && cell.vertex && cell.edges) {
              // 拖动了节点 则重置它的连线样式(重置连线连接的起始节点和目标节点的锚点)
              // _this.graph.setCellStyles("exitX", null, cell.edges);
              _this.graph.setCellStyles("entryX", null, cell.edges);
              // _this.graph.setCellStyles("exitY", null, cell.edges);
              _this.graph.setCellStyles("entryY", null, cell.edges);
            }
          });

          _this.$emit("init");
          // 图元新增事件
          _this.graph.addListener(mxEvent.CELLS_ADDED, function (sender, evt) {
            const cell = evt.properties.cells[0];
            // 如果是线，且没有结束或者开始节点，就直接删除
            if (cell && cell.edge) {
              if (!cell.target || !cell.source) {
                // CELL_CONNECTED 事件中已做处理，此处注释
                // _this.$message({
                //   message: _this.$t('wfeditor.msglxqdhjsbnwk'),
                //   type: "warning",
                // });
                // setTimeout(function () {
                //   _this.removeUndoManagerHistory();
                // 注意此处回滚操作
                //   _this.editorui.undo();
                //   // 删除历史记录中最后一条
                //   _this.editorui.editor.undoManager.history.splice(
                //     _this.editorui.editor.undoManager.history.length - 1
                //   );
                // });
                return;
              }
              if (
                cell.target &&
                cell.source &&
                cell.target.id === cell.source.id
              ) {
                _this.$message({
                  message: _this.$t('wfeditor.msglxkshjebnzxtygjd'),
                  type: "warning",
                });
                setTimeout(function () {
                  _this.removeUndoManagerHistory();
                  // 注意此处回滚操作
                  _this.editorui.undo();
                  // 删除历史记录中最后一条
                  _this.editorui.editor.undoManager.history.splice(
                    _this.editorui.editor.undoManager.history.length - 1
                  );
                });
                return;
              }
              if (!_this.checkEdgeOfCells(cell)) {
                cell.data = cell.data || {};
                cell.data.nid = cell.id;
                cell.data.label = ""; // '连线' + cell.id;
                cell.data.target = cell.target.id;
                cell.data.source = cell.source.id;
                _this.$emit("addedge", cell);
              } else {
                _this.$message({
                  message: _this.$t('wfeditor.msgjdjczxtlx'),
                  type: "warning",
                });
                setTimeout(function () {
                  _this.removeUndoManagerHistory();
                  // 注意此处回滚操作
                  _this.editorui.undo();
                  // 删除历史记录中最后一条
                  _this.editorui.editor.undoManager.history.splice(
                    _this.editorui.editor.undoManager.history.length - 1
                  );
                });
                return;
              }
            }
            for (var i in evt.getProperty("cells")) {
              const vertex = evt.properties.cells[i];
              if (vertex.vertex) {
                _this.setImageSize(vertex);
              }
            }
            if (cell.vertex) {
              // 更新节点样式
              _this.updateCellImage(evt.getProperty("cells")[0], 'static/');
              if (!cell.data.nodeLevel) {
                cell.data.nodeLevel = '';
              }
            }
            if (cell) {
              _this.checkCellsId();
            }
            return;
          });
          // 删除节点时，将相关联的连线也删除
          _this.graph.addListener(mxEvent.REMOVE_CELLS, function (sender, evt) {
            evt.properties.cells.forEach(function (cell) {
              // 删除节点时 遍历所有的连线，删除无起点或终点连线
              if (cell.vertex) {
                _this.deleteInvalidEdge();
              }
              // 节点删除后可能还存在于_this.graph.getModel().cells中, 需要手动删除一下
              var cells = _this.graph.getModel().cells;
              for (var k in cells) {
                if (cells[k].id === cell.id) {
                  delete _this.graph.getModel().cells[k];
                }
              }
            });
          });
          _this.graph.addListener(window.mxEvent.CLICK, function (sender, evt) {
            var cell = evt.getProperty("cell");
            _this.$emit("cellclick", cell);
          });
          _this.graph.view.addListener(mxEvent.SCALE, function graphScaleFns(
            sender,
            evt
          ) {
            _this.$emit("scale", evt);
          });
          // 设置节点提示框 #TODO 节点提示框信息
          _this.graph.setTooltips(true);
          _this.graph.getTooltipForCell = function (cell) {
            if (cell.vertex) {
              if (_this.param) {
                for (var k in _this.param) {
                  if (_this.param[k].nid == cell.data.nid) {
                    return _this.param[k].comment;
                  }
                }
              }
              return `<div class="node-tip-wrap"><span class="mx-tip-label">${_this.$t('wfeditor.nodeid')}: </span>${cell.data.nid}
                <span class="mx-tip-label">${_this.$t('wfeditor.name')}: </span>${cell.data.label}${!['E', 'S'].includes(cell.data.nodeType) ? `<br/><span class="mx-tip-label">${_this.$t('wfeditor.nodeuser')}: </span>${cell.data.convertLabel || cell.data.nodeUser}` : ''}
              </div>`;
            } else {
              return `<div class="node-tip-wrap"><span class="mx-tip-label">${_this.$t('wfeditor.routeid')}: </span>${cell.data.nid}</div>`;
            }
          };
          _this.locked && _this.lockGraph();
          _this.layout();
        },
        function () {
          container.innerHTML =
            '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
        }
      );
    },
    setImageSize(vertex) {
      var _this = this;
      _this.graph.getModel().beginUpdate();
      _this.updateCellStyle(vertex, 'shape', 'label');
      _this.updateCellStyle(vertex, 'imageAlign', 'center');
      _this.updateCellStyle(vertex, 'imageVerticalAlign', 'center');
      _this.updateCellStyle(vertex, 'strokeColor', 'transparent');
      _this.setCellGeometry(vertex, 46, 'static/');
      if (
        vertex.data &&
        (vertex.data.nodeType == "C" || vertex.data.nodeType == "4")
      ) {
        _this.updateCellStyle(vertex, 'imageWidth', 39);
        _this.updateCellStyle(vertex, 'imageHeight', 39);
      } else if (vertex.data && (vertex.data.nodeType == "0")) {
        _this.updateCellStyle(vertex, 'imageWidth', 35);
        _this.updateCellStyle(vertex, 'imageHeight', 35);
      } else if (vertex.data && vertex.data.nodeType == "3") {
        _this.updateCellStyle(vertex, 'imageWidth', 40);
        _this.updateCellStyle(vertex, 'imageHeight', 40);
      } else if (vertex.data && vertex.data.nodeType == "2") {
        _this.updateCellStyle(vertex, 'imageWidth', 40);
        _this.updateCellStyle(vertex, 'imageHeight', 36);
      } else if (vertex.data && vertex.data.nodeType == "1") {
        _this.updateCellStyle(vertex, 'imageWidth', 40);
        _this.updateCellStyle(vertex, 'imageHeight', 26);
      } else if (vertex.data && vertex.data.nodeType == "5") {
        _this.updateCellStyle(vertex, 'imageWidth', 35);
        _this.updateCellStyle(vertex, 'imageHeight', 30);
      } else {
        _this.updateCellStyle(vertex, 'imageWidth', 40);
        _this.updateCellStyle(vertex, 'imageHeight', 31);
      }
      _this.graph.getModel().endUpdate();
    },
    // 设置连线默认为直角线条
    setDefaultEdgeStyle: function (edge) {
      this.graph.setCellStyles("edgeStyle", "orthogonalEdgeStyle", [edge]);
      this.graph.setCellStyles("noEdgeStyle", "0", [edge]);
    },
    // 遍历所有的连线，删除无起点或终点连线
    deleteInvalidEdge() {
      var _this = this;
      var cells = _this.graph.getModel().cells;
      for (var c in cells) {
        if (cells[c].edge && (!cells[c].target || !cells[c].source)) {
          _this.graph.removeCells([cells[c]]);
          _this.deleteInvalidEdge();
        }
      }
    },
    setNodeType: function (type) {
      mxObjectCodec.prototype.nodeType = type;
      mxObjectCodec.prototype.getNodeCustomType = function (nodeType, node) {
        if (node.getAttribute("vertex") === "1") {
          return "Node";
        }
        if (node.getAttribute("edge") === "1") {
          return "Line";
        }
        return nodeType;
      };
    },
    doAction: function (fn) {
      this.editorui.actions.actions[fn].funct();
    },
    hideSidebar: function (h) {
      this.editorui.hsplitPosition = h ? 64 : 0;
      // 重新布局
      this.editorui.refresh();
    },
    hideFormatbar: function (h) {
      this.editorui.formatWidth = h ? 240 : 0;
      // 重新布局
      this.editorui.refresh();
    },
    // 更新节点信息
    updateCell: function (id, key, value, nodeType) {
      if (id) {
        var cell = this.getVertex(id, nodeType);
        if (cell) {
          switch (key) {
            case "label":
              this.updateCellLabel(cell, value);
              break;
            case "data":
              cell.data = yufp.clone(value, {});
              break;
            case "data_convertLabel":
              // 异步防止和case: data冲突
              setTimeout(() => {
                cell.data.convertLabel = value
              });
              break;
            case "script_config":
              // 异步防止和case: data冲突
              setTimeout(() => {
                cell.data.nodeScriptConfig = value;
              });
              break;
            case "color":
              cell.data.customColor = value;
              this.updateCellStyle(cell, 'strokeColor', value);
              break;
            default:
              key && (cell[key] = value);
              break;
          }
        }
      }
    },
    // 更新节点图标
    updateCellImage: function (cell, prefix) {
      if (cell) {
        this.graph.setCellStyles(
          "image",
          (prefix ? prefix : 'static/') + "libs/mxgraph/images/" + cell.data.nodeType + ".png",
          [cell]
        );
        // 如果是开始节点和结束节点，更新图标大小
        this.updateCellLabel(cell, cell.data.label);
        // 节点绑定数据集
        cell.data = cell.data || {};
        cell.data.nid = cell.id;
      }
    },
    // 更新节点标记
    updateCellLabel: function (cell, label) {
      this.graph.getModel().setValue(cell, label);
      // 移除undo中信息
      this.removeUndoManagerHistory();
    },
    // 移除部分不需要的历史记录
    removeUndoManagerHistory: function () {
      var history = this.editorui.editor.undoManager.history;
      var item;
      for (var len = history.length, i = len - 1; i >= 0; i--) {
        item = history[i];
        if (
          item.changes &&
          item.changes.length === 1 &&
          item.changes[0] instanceof mxValueChange
        ) {
          this.editorui.editor.undoManager.history.splice(
            this.editorui.editor.undoManager.history.length - 1
          );
          this.editorui.editor.undoManager.indexOfNextAdd = this.editorui.editor.undoManager.history.length;
        }
      }
      // console.log('操作历史信息', this.editorui.editor.undoManager.history);
    },
    graphScale: function (scale) {
      this.graph && this.graph.zoomTo(scale);
    },
    setSidebar: function (items) {
      this.editorui.sidebar.addItems(items);
    },
    addToolItems: function (items) {
      this.editorui.toolbar.addCustomItems(items);
    },
    // 锁定视图
    lockGraph: function () {
      var graph = this.graph;
      graph.getModel().beginUpdate();
      try {
        var cells = this.getGraphAllCells();
        graph.toggleCellStyles("locked", 0, cells);
        // graph.setEnabled(true);
      } finally {
        graph.getModel().endUpdate();
      }
    },
    // 获取所有节点数组
    getGraphAllCells: function () {
      var cells = [],
        cs = this.graph.getModel().cells;
      for (var k in cs) {
        cells.push(cs[k]);
      }
      return cells;
    },
    // 获取所有节点类型数组
    getGraphAllvertex: function () {
      var cells = [],
        cs = this.graph.getModel().cells;
      for (var k in cs) {
        if (cs[k].vertex) {
          cells.push(cs[k]);
        }
      }
      return cells;
    },
    // 更改cell样式
    updateCellStyle: function (cell, type, value) {
      if (cell && type) {
        this.graph.setCellStyles(type, value, [cell]);
      }
    },
    // 校验流程图是否合法
    checkEdgeOfCells: function (cell) {
      var hasEdge = false;
      var cells = this.graph.getModel().cells;
      for (var k in cells) {
        if (
          cells[k].edge &&
          cells[k].source &&
          cells[k].target &&
          cells[k].id !== cell.id
        ) {
          if (
            (cells[k].source.id === cell.source.id &&
              cells[k].target.id === cell.target.id) ||
            (cells[k].source.id === cell.target.id &&
              cells[k].target.id === cell.source.id)
          ) {
            hasEdge = true;
            break;
          }
        }
      }
      return hasEdge;
    },
    // 校验流程图是否合法
    checkValidate: function () {
      var result = {
        valid: true,
        messages: [],
      };
      var cells = this.graph.getModel().cells;
      var edges = [],
        vertexs = [],
        startCell = null,
        endCells = [];
      for (var k in cells) {
        if (cells[k].edge) {
          edges.push(cells[k]);
        } else if (cells[k].vertex) {
          if (cells[k].data.nodeType === "S") {
            if (startCell) {
              result.messages.push(this.$t('wfeditor.msgonlyoneks'));
              result.valid = false;
            }
            startCell = cells[k];
          } else if (cells[k].data.nodeType === "E") {
            // 可以有多个结束节点
            /* if (endCell) {
                result.messages.push('只能有一个结束节点');
                result.valid = false;
              }*/
            endCells.push(cells[k]);
          } else {
            vertexs.push(cells[k]);
          }
        }
      }
      if (!startCell) {
        result.messages.push(this.$t('wfeditor.msgbxyksjd'));
        result.valid = false;
      }
      // 校验开始节点是否有入线
      if (startCell && startCell.edges && startCell.edges.length > 0) {
        startCell.edges.forEach(function (edge) {
          if (edge.source.id != startCell.id) {
            result.messages.push(this.$t('wfeditor.msgksjdbnyrx'));
            result.valid = false;
          }
        });
      }
      if (endCells.length < 1) {
        result.messages.push(this.$t('wfeditor.msgbxyjsjd'));
        result.valid = false;
      }
      // 校验结束节点是否有出线
      for (var i = 0, length = endCells.length; i < length; i++) {
        if (endCells[i].edges && endCells[i].edges.length > 0) {
          endCells[i].edges.forEach(function (edge) {
            if (edge.target && edge.target.id != endCells[i].id) {
              result.messages.push(this.$t('wfeditor.msgjsjdbnycx'));
              result.valid = false;
            }
          });
        }
      }

      if (!vertexs || vertexs.length === 0) {
        result.messages.push(this.$t('wfeditor.msgtzbxhyywjd'));
        result.valid = false;
      }
      var hasC = false; // 是否有汇总节点
      var has2Or4 = false; // 是否有多选节点或条件多选节点
      var _this = this;
      // 校验孤立节点
      vertexs.forEach(function (v) {
        if (v.geometry) {
          if (!v.edges || v.edges.length < 2) {
            var str =
              _this.$t('wfeditor.node') + v.data.nid + "-" + v.data.label + _this.$t('wfeditor.msgbxylx');
            result.messages.push(str);
            result.valid = false;
          } else if (v.edges.length > 1) {
            // 校验任一非开始节点和结束节点，必须有进有出连线
            var hasIn = false,
              hasOut = false;
            for (var i = 0, l = v.edges.length, e; i < l; i++) {
              e = v.edges[i];
              if (e.target && e.source) {
                if (e.target.id == v.id) {
                  hasOut = true;
                }
                if (e.source.id == v.id) {
                  hasIn = true;
                }
                // 判断连线两端不能同时为汇总节点
                if (
                  (v.id !== e.target.id &&
                    v.data.nodeType === "C" &&
                    e.target.data.nodeType === "C") ||
                  (v.id !== e.source.id &&
                    v.data.nodeType === "C" &&
                    e.source.data.nodeType === "C")
                ) {
                  result.messages.push(_this.$t('wfeditor.msghzjdbnljhzjd'));
                  result.valid = false;
                  break;
                }
              }
            }
            !hasIn && !hasOut && (result.valid = false);
          }
        }
        // 如果存在多选节点或条件多选节点，必须有汇总节点存在
        if (v.data.nodeType === "2" || v.data.nodeType === "4") {
          has2Or4 = true;
        }
        if (v.data.nodeType === "C") {
          hasC = true;
        }
      });
      if (has2Or4 && !hasC) {
        result.messages.push(_this.$t('wfeditor.msgczdxjdbxyhzjd'));
        result.valid = false;
      }
      // 如果没有连线
      if (!edges || edges.length === 0) {
        result.messages.push(_this.$t('wfeditor.msglxqs'));
        result.valid = false;
      } else {
        edges.forEach(function (edge) {
          if (edge.target && edge.source) {
            for (var i = 0, length = endCells.length; i < length; i++) {
              if (
                edge.target.id === endCells[i].id &&
                edge.source.id === startCell.id
              ) {
                result.messages.push(_this.$t('wfeditor.msgksjdbnzjljjsjd'));
                result.valid = false;
              }
            }
            // 校验连线target和source必须是节点
            if (edge.target.edge || edge.source.edge) {
              result.messages.push(_this.$t('wfeditor.msglxbxljjd'));
              result.valid = false;
            }
          } else {
            result.messages.push(_this.$t('wfeditor.msglxbxljlgjd'));
            result.valid = false;
          }
        });
      }
      // 多个结束节点时,结束节点可能缺少入线
      var flag = true;
      for (var i = 0, length = endCells.length; i < length; i++) {
        if (!this.hasIn4End(edges, endCells[i])) {
          flag = false;
          break;
        }
      }
      if (!flag) {
        result.messages.push(this.$t('wfeditor.msgjsjdbxyrx'));
        result.valid = false;
      }

      // 校验普通、单选、多选、条件单选、条件多选节点是否配置了处理人员
      vertexs.forEach(function (v) {
        if (
          v.data.nodeType === "2" ||
          v.data.nodeType === "0" ||
          v.data.nodeType === "1" ||
          v.data.nodeType === "3" ||
          v.data.nodeType === "4"
        ) {
          if (
            v.data.nodeUser === undefined ||
            v.data.nodeUser === "" ||
            v.data.nodeUser === null
          ) {
            var str =
              _this.$t('wfeditor.node') + v.data.nid + "-" + v.data.label + _this.$t('wfeditor.msgnouser');
            result.messages.push(str);
            result.valid = false;
          }
        }
        if (v.data.nodeLevel) {
          var reg = /^\d+$/;
          if (!reg.test(v.data.nodeLevel)) {
            var str =
              _this.$t('wfeditor.nodelevel') +
              v.data.nid +
              "-" +
              v.data.label +
              _this.$t('wfeditor.msglevelisnum');
            result.messages.push(str);
            result.valid = false;
          }
        }
      });
      return result;
    },
    hasIn4End: function (edges, endCell) {
      var flag = false;
      for (var i = 0, length = edges.length; i < length; i++) {
        // 线可能是独立的线
        if (edges[i].target && edges[i].target.id === endCell.id) {
          flag = true;
        }
      }
      return flag;
    },
    createOverlay: function (
      image,
      tooltip,
      align,
      verticalAlign,
      point,
      type
    ) {
      var _this = this;
      var overlay = new mxCellOverlay(
        image,
        tooltip,
        align || mxConstants.ALIGN_RIGHT,
        verticalAlign || mxConstants.ALIGN_BOTTOM,
        point || new mxPoint(0, 0),
        "pointer"
      );
      overlay.addListener(mxEvent.CLICK, function (sender, evt) {
        _this.$emit("overlayclick", sender, evt.properties.cell);
      });
      overlay.type = type;
      return overlay;
    },
    layout: function () {
      if (!this.isLayouting) {
        var _this = this;
        this.isLayouting = true;
        var layout = new mxHierarchicalLayout(this.graph);
        layout.resizeParent = true;
        layout.moveParent = true;
        layout.execute(this.graph.getDefaultParent());
        this.graph.fit(); // 自适应
        this.graph.center(true, true, 0.5, 0.5); // 将画布放到容器中间
        var sc = this.graph.getView().getScale(); // 获取当前的缩放比例
        this.graph.zoomTo(Math.round(sc / 2)); // 在缩放一半，否则是满屏状态，不好看
        setTimeout(function () {
          _this.isLayouting = false;
        }, 500);
      }
    },
    // 清除节点运行图标
    clearCellOverLay: function () {
      var _this = this;
      var cells = this.graph.getModel().cells;
      var cell = null;
      for (var k in cells) {
        cell = cells[k];
        if (cell && cell.overlays) {
          var overlays = cell.overlays;
          for (var i = overlays.length - 1; i >= 0; i--) {
            _this.graph.removeCellOverlay(cell, overlays[i]);
          }
        }
      }
    },
    getVertex: function (id, nodeType) {
      var cells = this.graph.getModel().cells;
      for (var i in cells) {
        if (cells[i].id === id && cells[i][nodeType]) {
          return cells[i];
        }
      }
      // return this.graph.getModel().getCell(id);
    },
    // 加载xml文件,并返回workflow对象
    loadXML: function (xml) {
      var doc = mxUtils.parseXml(xml);
      var codec = new mxCodec(doc);
      codec.decode(doc.documentElement, this.graph.getModel());
      // this.graph.importGraphModel(doc.documentElement);
      // 加载完成后更新对应的数据信息
      var cells = this.graph.getModel().cells;
      var cell;
      for (var k in cells) {
        cell = cells[k];
        if (cell.vertex || cell.edge) {
          cell.id = cells[k].data.nid + "";
          // cells[k].data.nid = cell.id;
          this.traversalAttributes(cell.data, ["nid"]);
          cell.vertex && this.updateCellImage(cell, 'static/')
        }
        // 更新开始节点结束节点图标大小, 临时调整 #TODO
        // if (cell.vertex && cell.data && (cell.data.nodeType === 'S' || cell.data.nodeType === 'E')) {
        //   var tmpGeo = mxUtils.clone(cell.getGeometry());
        //   tmpGeo.width = 42;
        //   tmpGeo.height = 42;
        //   cell.setGeometry(tmpGeo);
        // }
      }
      this.isIniting = false;
      var codec = new mxCodec(doc);
      return codec.getAttributesByTagName("workflow");
    },
    // 对于将数字转换成字符串
    traversalAttributes: function (o, exc) {
      for (var k in o) {
        if (this.isInteger(o[k]) && exc.indexOf(k) === -1) {
          o[k] += "";
        }
      }
    },
    isInteger: function (v) {
      return Object.prototype.toString.call(v) === "[object Number]";
    },
    // 对图节点排序
    orderGraph: function () {
      var cells = this.graph.getModel().cells;
      var tmpCells = [];
      for (var k in cells) {
        tmpCells.push(cells[k]);
      }
      this.graph.orderCells(false, tmpCells);
    },
    // 保存前处理数据,主要处理连线
    processCellData: function () {
      var cells = this.graph.getModel().cells;
      for (var k in cells) {
        if (cells[k].edge) {
          cells[k].data.target = cells[k].target.id;
          cells[k].data.source = cells[k].source.id;
        }
      }
    },
    // 查看xml内容
    getXML: function (data) {
      this.orderGraph();
      this.processCellData();
      var encoder = new mxCodec();
      var node = encoder.encode(this.graph.getModel());
      // 增加图信息节点
      var wf = encoder.document.createElement("Workflow");
      this.ergodicAttr(wf, data);
      node.firstChild.insertBefore(wf, node.firstChild.firstChild);
      let xmlStr = mxUtils.getPrettyXml(node);
      // #TODO 临时处理兼容数据图片路径
      xmlStr = xmlStr.replace(/image=static/g, 'image=');
      return xmlStr
    },
    // 导出xml文件
    exportXML: function (data) {
      var result = this.checkValidate();
      var status = result.valid;
      this.checkCellsId();
      // var message = this.splitMessages(result.messages);
      if (typeof status == "boolean" && status === true) {
        this.orderGraph();
        this.processCellData();
        var encoder = new mxCodec();
        var node = encoder.encode(this.graph.getModel());
        // 增加图信息节点
        var wf = encoder.document.createElement("Workflow");
        this.ergodicAttr(wf, data);
        node.firstChild.insertBefore(wf, node.firstChild.firstChild);
        let xmlStr = mxUtils.getPrettyXml(node);
        // #TODO 临时处理兼容数据图片路径
        xmlStr = xmlStr.replace(/image=static\//g, 'image=');
        return xmlStr
      } else {
        var h = this.$createElement;
        var messages = this.messageFormat(result.messages);
        this.$msgbox({
          message: h("div", null, messages),
          type: "warning",
          lineBreak: true,
          showConfirmButton: true,
        });
      }
    },
    checkCellsId: function () {
      var cells = this.graph.getModel().cells;
      var cellsId = [];
      for (var k in cells) {
        while (cellsId.indexOf(cells[k].id + '') > -1) {
          // cells[k].id = cells[k].id + '000';
          // 重复id+1,避免造成节点id过长
          cells[k].id = parseInt(cells[k].id) + 1;
          if (cells[k].data) {
            cells[k].data.nid = cells[k].id;
          }
        }
        cellsId.push(cells[k].id + '');
      }
    },
    // 格式化
    messageFormat: function (messages) {
      var h = this.$createElement;
      for (var i = 0, len = messages.length; i < len; i++) {
        messages[i] = h("p", null, messages[i] + "\n");
      }
      return messages;
    },
    ergodicAttr: function (dom, data) {
      for (var k in data) {
        k !== "flowContent" && dom.setAttribute(k, data[k] || "");
      }
    },
    hiddenOutlineWindow: function (isReopen) {
      if (isReopen === false) {
        if (
          this.editorui.actions.outlineWindow &&
          this.editorui.actions.outlineWindow.window.isVisible() === true
        ) {
          this.editorui.actions.outlineWindow.window.setVisible(isReopen);
          this.outlineHiddenClick = true;
        }
      } else if (this.outlineHiddenClick) {
        if (
          this.editorui.actions.outlineWindow &&
          this.editorui.actions.outlineWindow.window.isVisible() === false
        ) {
          this.editorui.actions.get("outline").funct();
          this.outlineHiddenClick = false;
        }
      }
    },
    setCellGeometry: function (vertex, size, path = '') {
      var tmpGeo = mxUtils.clone(vertex.getGeometry());
      tmpGeo.width = size;
      tmpGeo.height = size;
      vertex.setGeometry(tmpGeo);
      this.updateCellImage(vertex, path);
    },
  },
};
</script>
