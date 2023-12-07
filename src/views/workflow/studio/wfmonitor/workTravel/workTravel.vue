
<template>
  <!--
    @created by kongqf on 2019-12-17 13:54:46
    @updated by
    @description wfdemo
  -->
  <div class="yu-workflow">
    <yu-workflow :show-popup-menu="false" @toolbar-change="toolbarFn" :show-sidebar="showSidebar" ref="refWorkflow" @init="initGraph" :lock="locked" :height="height" @cellclick="cellclickFn" :param="comments">
    </yu-workflow>
  </div>
</template>
<script>
import YuWorkflow from '@/components/features/YuWorkflow'
import "../../nwflist/jWorkflow/jobFlowGraph.css"
let data = {}

export default {
  name: 'WorkTravel',
  components: [YuWorkflow],
  props: {
    workTravelData: {
      // 评论信息
      type: Array,
      default: function () {
        return null;
      }
    }
  },
  data: function () {
    return {
      height: 440,
      value2: 100,
      viewScale: '100%',
      graphData: null,
      formItems: {},
      showSidebar: true,
      showFormatbar: true,
      workflowData: data,
      formatType: '',
      tmpCell: null,
      locked: true,
      // 是否预览模式，会自动屏蔽界面上输入操作
      returnBackFuncId: '',
      returnBackRootId: '',
      nodeInfo: [],
      comments: [],
      doneNodes: []
    };
  },
  mounted: function () {
    data = this.workTravelData || this.$route.params;
    this.returnBackFuncId = data.returnBackFuncId;
    this.returnBackRootId = data.returnBackRootId;

    if (data.nodeInfo != null) {
      this.nodeInfo = data.nodeInfo;
    }

    data.instanceId && this.initComment(data);
  },
  methods: {

    // 初始化左侧示例图标
    initGraph: function () {
      if (this.locked) {
        this.hideSidebarFn();
        this.hideFormatbarFn();
      }

      this.initData();
    },
    initComment: function (d) {
      var _this = this;

      var param = {
        mainInstanceId: ''
      };

      if (d.instanceId === d.mainInstanceId) {
        param.mainInstanceId = d.mainInstanceId;
      } else {
        param.mainInstanceId = d.instanceId;
      }
      _this.$request({
        url: backend.workflowService + '/api/core/getAllComments',
        method: "POST",
        data: param,
        callback: function (code, msg, response) {
        }
      }).then(({code, message, data}) => {
        if (data != null) {
          var Comments = data;
          // 倒序排列审批记录
          Comments.reverse();
          var nowNode = [];
          // 当前节点提示信息
          for (var i = 0; i < _this.nodeInfo.length; i++) {
            var nids = _this.nodeInfo[i].nodeId.split('_');
            var str = '<div class="node-tip-wrap"><span class="mx-tip-label">' + _this.$t('wftravel.currentnode') +
              ' </span>' + _this.nodeInfo[i].nodeId + '&nbsp<br/><span class="mx-tip-label">' + _this.$t('wftravel.nodename') +
              '</span>' + _this.nodeInfo[i].nodeName + '&nbsp<br/><span class="mx-tip-label">' + _this.$t('wftravel.currentuser') +
              '</span>' + _this.nodeInfo[i].userNames + '&nbsp<br/><span class="mx-tip-label">' + _this.$t('wftravel.starttime1') +
              '</span>' + _this.nodeInfo[i].startTime + '</div>';
            var comment = {
              comment: str,
              nid: nids[1] + ''
            }
            nowNode.push(_this.nodeInfo[i].nodeId);
            _this.comments.push(comment);
          }
          // 已审批节点提示信息
          for (var k in Comments) {
            var comment = Comments[k];
            if (nowNode.indexOf(comment.nodeId) > -1) {
              continue;
            }
            
            var nids = comment.nodeId.split('_');
            if (_this.doneNodes.indexOf(nids[1] + '') > -1) {
              // 同一个节点只展示最近的一次记录
              continue;
            }
            var commentSign = yufp.lookup.convertKey('OP_TYPE', comment.commentSign);
            commentSign = commentSign || _this.$t('wftravel.defcomment');
            var str = '<div class="node-tip-wrap"><span class="mx-tip-label">' + _this.$t('wftravel.lcslh') +
              ' </span>' + comment.instanceId + '&nbsp<br/><span class="mx-tip-label">' + _this.$t('wftravel.flowid') +
              '</span>' + nids[0] + '&nbsp<br/><span class="mx-tip-label">' + _this.$t('wftravel.nodeid') +
              '</span>' + nids[1] + '&nbsp<br/><span class="mx-tip-label">' + _this.$t('wftravel.nodename') +
              ' </span>' + comment.nodeName + '&nbsp<br/><span class="mx-tip-label">' + _this.$t('wftravel.username') +
              '</span>' + comment.userName + '&nbsp<br/><span class="mx-tip-label">' + _this.$t('wftravel.result') +
              ' </span>' + commentSign + '&nbsp<br/><span class="mx-tip-label">' + _this.$t('wftravel.starttime2') +
              '</span>' + comment.startTime + '&nbsp<br/><div class="mx-tip-comment"><span class="mx-tip-label mx-tip-comment-label">' + _this.$t('wftravel.comment') +
              '</span>' + comment.userComment + '</div></div>';
            comment = {
              comment: str,
              nid: nids[1] + ''
            };
            _this.doneNodes.push(nids[1] + '');
            _this.comments.push(comment);
          }
        }
      })
    },
    // 初始化绑定数据
    initData: function () {
      var _this = this; // 获取流程图
      _this.$request({
        url: backend.workflowService + '/api/nwfflow/flow/',
        method: "POST",
        data: {
          flowId: data.flowId
        }
      }).then(({code, message, data}) => {
        _this.graphData = data.flowContent;
        _this.graphData && (_this.workflowData = _this.$refs.refWorkflow.loadXML(_this.graphData));
        _this.$nextTick(function () {
          var cells = _this.$refs.refWorkflow.graph.getModel().cells;
          var centerCell = null;
          for (var c in cells) {
            if (!cells[c].vertex) {
              continue;
            }
            _this.$refs.refWorkflow.setImageSize(cells[c]);
            if (_this.doneNodes.indexOf(cells[c].data.nid + '') > -1) {
              // 已办节点，设置filter
              _this.$refs.refWorkflow.updateCellStyle(cells[c], 'shape', 'label');
              _this.$refs.refWorkflow.updateCellStyle(cells[c], 'strokeWidth', 2);
              _this.$refs.refWorkflow.updateCellStyle(cells[c], 'strokeColor', '#11CF66');
            }
            for (var i = 0; i < _this.nodeInfo.length; i++) {
              if (cells[c].data.nid == _this.nodeInfo[i].nodeId.split('_')[1]) {
                // 待办节点处理
                _this.customCellStyle(cells[c], 2, '#11CF66', 'flow');
                centerCell = cells[c];
              }
            }
          }
          _this.$refs.refWorkflow.graph.scrollCellToVisible(centerCell ? centerCell : cells[parseInt(Object.keys(cells).length)], true);
          _this.setHighLight(cells);
        });
      })
    },
    // 自定义设置节点样式
    customCellStyle: function (cell, size, color, type) {
      var _this = this;
      _this.$refs.refWorkflow.updateCellStyle(cell, 'shape', 'label');
      _this.$refs.refWorkflow.updateCellStyle(cell, 'strokeWidth', size);
      _this.$refs.refWorkflow.updateCellStyle(cell, 'imageAlign', 'center');
      _this.$refs.refWorkflow.updateCellStyle(cell, 'imageVerticalAlign', 'center');
      // 已办节点  颜色
      _this.$refs.refWorkflow.updateCellStyle(cell, 'strokeColor', color);
      // 设置节点尺寸
      _this.$refs.refWorkflow.setCellGeometry(cell, 46, 'static/');
      var state = _this.$refs.refWorkflow.graph.view.getState(cell);
      // 图标周围标注是线性还是流动
      state.shape.node.getElementsByTagName('rect')[0].setAttribute('class', type);
    },
    setHighLight: function (cells) {
      var _this = this;
      if (!data.instanceId) {
        return;
      }
      var routeIds = [];
      yufp.service.request({
        url: backend.workflowService + '/api/monitor/getDoneRoutes',
        method: "POST",
        data: { instanceId: data.instanceId },
        callback: function (code, msg, response) {
          if (response.code == 0 && response.data != null) {
            routeIds = response.data;
            var graph = _this.$refs.refWorkflow.graph;
            for (var c in cells) {
              var cell = cells[c];
              if (cell.edge && cell.data && routeIds.indexOf(cell.data.nid + '') > -1) {
                // 添加上级节点相关高亮配置
                _this.$refs.refWorkflow.updateCellStyle(cell, 'strokeColor', '#11CF66');
                // var highlightEdge = new window.mxCellHighlight(graph, '#11CF66', 4);
                // highlightEdge.highlight(graph.view.getState(cell));
              }
            }
          }
        }
      });
    },
    // 节点单击事件
    cellclickFn: function (cell) {
      this.$emit("cellClickFn", cell);
    },
    // 隐藏左侧面板
    hideSidebarFn: function () {
      this.$refs.refWorkflow.hideSidebar(this.showSidebar = !this.showSidebar);
    },
    // 隐藏右侧面板
    hideFormatbarFn: function () {
      this.$refs.refWorkflow.hideFormatbar(this.showFormatbar = !this.showFormatbar);
    }
  }

}
</script>
<style>
.flow {
  stroke-dasharray: 6 3;
  animation: strokedash .5s linear;
  animation-iteration-count: infinite;
}
@keyframes strokedash {
  to {
  stroke-dashoffset: -9;
  }
}
.filter {
  filter: drop-shadow(0px 0px 5px #0de031);
}
</style>
