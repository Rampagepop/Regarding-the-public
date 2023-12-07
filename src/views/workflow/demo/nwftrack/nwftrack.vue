
<template>
  <div>
    <el-card class="card-box" style="height:50px;">
      <el-label>{{ title }}</el-label>
    </el-card>
    <el-card class="card-box" style="height:500px;">
      <div id="myChart1" style="height: 280px;"></div>
    </el-card>
  </div>
</template>
<script>
import { sessionStore } from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
export default {
  data: function () {
    var _this = this;

    return {
      urls: {
        index: backend.workflowService + '/api/bench/todo'
      },
      baseParams: {
        condition: JSON.stringify()
      },
      node: [{
        name: '节点3',
        code: 'node3',
        infos: '',
        draggable: true,
        // 节点是否可拖拽，只在使用力引导布局的时候有用。
        symbolSize: 40,
        itemStyle: {
          // 节点颜色
          normal: {
            color: '#99CCFF'
          },
          emphasis: {
            // 高亮反应
            color: '#6699CC'
          }
        },
        category: '未办理过节点'
      }, {
        name: '节点1',
        code: 'node1',
        infos: '同意',
        draggable: true,
        // 节点是否可拖拽，只在使用力引导布局的时候有用。
        symbolSize: 40,
        itemStyle: {
          normal: {
            color: '#C0C0C0'
          },
          emphasis: {
            color: '#DDDDDD'
          }
        },
        category: '已办理过节点'
      }, {
        name: '节点2',
        // 节点名称
        code: 'node2',
        // 节点id
        infos: '审批中',
        // 节点tips信息
        draggable: true,
        // 节点是否可拖拽，只在使用力引导布局的时候有用。
        symbolSize: 50,
        // 节点大小
        itemStyle: {
          // 节点样式设置
          normal: {
            color: '#00FF00'
          },
          emphasis: {
            color: '#00FF01'
          }
        },
        category: '当前节点' // 节点类别

      }],
      link: [{
        source: '节点1',
        // 前一节点
        target: '节点2' // 指向节点

      }, {
        source: '节点2',
        // 前一节点
        target: '节点3' // 指向节点

      }],
      height: sessionStore.get(VIEW_SIZE).height - 103,
      title: '流程轨迹'
    };
  },
  mounted: function () {
    this.Initechart();
  },
  methods: {
    Initechart: function () {
      var _this = this;
      var echartsWarp = document.getElementById('myChart1'); // 获取dom

      var resizeWorldMapContainer = function () {
        // 用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
        echartsWarp.style.width = window.innerWidth * 3 / 4 + 'px';
        echartsWarp.style.height = window.innerheight / 3 + 'px';
      };

      resizeWorldMapContainer(); // 设置容器高宽*/

      var myChart = window.echarts.init(echartsWarp); // 基于准备好的dom，初始化echarts实例

      window.onresize = function () {
        // 用于使chart自适应高度和宽度
        resizeWorldMapContainer(); // 重置容器高宽

        myChart.resize();
      };

      var option = {
        tittle: {},
        // 标题
        tooltip: {
          // 提示信息
          formatter: function (param) {
            if (param.dataType === 'edge') {
              // 连线tips
              return param.data.source + '->' + param.data.target;
            } // 节点tips


            var str = '<ur style=\'text-align:left\'><li style=\'color: #99CCFF;font:bolder;\'>' + param.data.code + ': ' + param.data.name + '</li>';
            return str + param.data.infos + '</ul>';
          }
        },
        // 设置图例信息
        legend: {
          x: 'right',
          bottom: '5%',
          data: ['已办理过节点', '当前节点', '未办理过节点']
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [{
          type: 'graph',
          top: '10%',
          bottom: '20%',
          force: {
            repulsion: 1000,
            edgeLength: [50, 80]
          },
          layout: 'force',
          // 力引导布局
          symbol: 'circle',
          // 节点形状
          lineStyle: {
            // 关系边的公用线条样式。其中 lineStyle.color 支持设置为'source'或者'target'特殊值，此时边会自动取源节点或目标节点的颜色作为自己的颜色。
            normal: {
              color: '#000',
              // 线的颜色[ default: '#aaa' ]
              width: 2,
              // 线宽[ default: 1 ]
              type: 'solid',
              // 线的类型[ default: solid ]   'dashed'    'dotted'
              opacity: 0.7,
              // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。[ default: 0.5 ]
              curveness: 0 // 边的曲度，支持从 0 到 1 的值，值越大曲度越大。[ default: 0 ]

            }
          },
          label: {
            // 节点上的标签
            normal: {
              show: true,
              // 是否显示标签
              position: 'bottom',
              // 标签位置:'top''left''right''bottom''inside''insideLeft''insideRight''insideTop''insideBottom''insideTopLeft''insideBottomLeft''insideTopRight''insideBottomRight'
              textStyle: {
                // 文本样式
                fontSize: 14,
                color: '#000'
              }
            }
          },
          edgeSymbol: ['circle', 'arrow'],
          // 连线样式
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            normal: {
              textStyle: {
                fontSize: 15
              }
            }
          },
          roam: true,
          // 是否可缩放
          data: _this.node,
          // 节点数组
          links: _this.link,
          // 连线关系
          color: ['#99CCFF', '#00FF00', '#C0C0C0'],
          // 图例颜色设置
          categories: [{
            name: '未办理过节点'
          }, {
            name: '当前节点'
          }, {
            name: '已办理过节点'
          }] // 图例对应标签名

        }]
      }; // 使用刚指定的配置项和数据显示图表。

      myChart.setOption(option);
    }
  }

}
</script>
