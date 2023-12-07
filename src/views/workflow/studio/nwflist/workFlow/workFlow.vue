
<template>
  <!--
    @created by kongqf on 2019-12-17 13:54:46
    @updated by
    @description wfdemo
  -->
  <div class="yu-workflow">
    <yu-workflow ref="refWorkflow" @init="initGraph" :lock="locked" :height="height" @cellclick="cellclickFn">
    </yu-workflow>
  </div>

</template>
<script>
const data = {}
export default {
  name: 'workFlow',
  props: {
    flowId: String
  },
  data: function () {
    return {
      height: 390,
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
      // // 是否预览模式，会自动屏蔽界面上输入操作
      // returnBackFuncId: '',
      // returnBackRootId: ''
    };
  },
  // mounted: function () {
  //   this.returnBackFuncId = data.returnBackFuncId;
  //   this.returnBackRootId = data.returnBackRootId;
  // },
  methods: {
    // 初始化左侧示例图标
    initGraph: function () {
      if (this.locked) {
        this.hideSidebarFn();
        this.hideFormatbarFn();
      }

      this.initData();
    },
    // 初始化绑定数据
    initData: function () {
      var _this = this; // 获取流程图
      _this.$request({
        url: backend.workflowService + '/api/nwfflow/flow/',
        data: {
          flowId: _this.flowId
        }
      }).then(({code, message, data}) => {
        _this.graphData = data.flowContent;
        _this.graphData && (_this.workflowData = _this.$refs.refWorkflow.loadXML(_this.graphData));
        _this.$nextTick(function () {
          var vertexs = _this.$refs.refWorkflow.getGraphAllvertex();
          if (vertexs.length) {
            _this.$refs.refWorkflow.graph.scrollCellToVisible(vertexs[parseInt(vertexs.length / 2)], true);
          }
        });
      })
    },
    // 节点单击事件
    cellclickFn: function (cell) {},
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
<style lang="scss" scoped>
@import "~@/views/workflow/studio/nwflist/jWorkflow/jobFlowGraph.css";
.flow {
  stroke-dasharray: 4;
  animation: dash 1s linear;
  animation-iteration-count: infinite;
}
@keyframes dash {
  to {
  stroke-dashoffset: -16;
  }
}
</style>
