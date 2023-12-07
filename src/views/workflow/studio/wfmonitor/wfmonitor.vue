
<template>
  <div>
    <!-- 全局监控 -->
    <yu-panel :title="$t('wfmonitor.title1')" :collapse-hide="false">
      <div id="myChart" style="width:500px; height:300px;"></div>
    </yu-panel>
    <div class="panal_b"></div>
    <yu-panel :title="$t('wfmonitor.title2')" :collapse-hide="false">
      <yu-xtable ref="reftable" request-type="POST" :row-index="true" :base-params="baseParams" :data-url="urls.index" show-hidden-menu>
        <yu-xtable-column :label="$t('wfmonitor.username')" prop="userName" :resizable="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmonitor.userid')" prop="userId" :resizable="true" :hide-column="false"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmonitor.num')" prop="doNum" :resizable="true" :hide-column="false"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmonitor.sysid')" prop="systemId" :resizable="true" :hide-column="true"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmonitor.orgid')" prop="orgId" :resizable="true" :hide-column="true"></yu-xtable-column>
      </yu-xtable>
    </yu-panel>
  </div>
</template>
<script>
import { sessionStore } from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
export default {
  data: function () {
    return {
      urls: {
        index: backend.workflowService + '/api/monitor/getAllUserTodoNum',
        todo: backend.workflowService + '/api/monitor/getTodoNum',
        done: backend.workflowService + '/api/monitor/getDoneNum'
      },
      baseParams: {},
      date: [this.$t('wfmonitor.todonum'), this.$t('wfmonitor.hisnum')],
      datedata: [],
      height: sessionStore.get(VIEW_SIZE).height - 103
    };
  },
  created: function () {
    var _this = this;
    var param = {};
    _this.$request({
      method: 'POST',
      url: _this.urls.todo,
      data: param
    }).then(({code, message, data}) => {
      if (code == 0) {
        if (data != null) {
          _this.datedata[0] = data;

          _this.$request({
            method: 'POST',
            url: _this.urls.done,
            data: param
          }).then(({code, message, data}) => {
            if (code == 0) {
              if (data != null) {
                _this.datedata[1] = data;
                _this.$nextTick(() => {
                  _this.echart();
                });
              }
            } else {
              _this.$message({
                duration: 4000,
                message: this.$t('wfmonitor.msgerror') + message.substring(0, 100),
                type: 'error'
              });
            }
          })
        }
      } else {
        _this.$message({
          duration: 4000,
          message: this.$t('wfmonitor.msgerror') + message.substring(0, 100),
          type: 'error'
        });
      }
    })
  },
  methods: {
    echart: function () {
      var echartsWarp = document.getElementById('myChart'); // 获取dom

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
        color: ['#687aee'],
        toolbox: {
          show: true,
          feature: {// saveAsImage: {}
          }
        },
        tooltip: {
          // 提示信息
          trigger: 'axis'
        },
        xAxis: {
          // X项
          type: 'category',
          data: this.date,
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0'
            }
          }
        },
        series: [{
          markPoint: {
            data: [{
              type: 'max',
              name: this.$t('wfmonitor.max')
            }, {
              type: 'min',
              name: this.$t('wfmonitor.min')
            }]
          },
          markLine: {
            data: [{
              type: 'average',
              name: this.$t('wfmonitor.average')
            }]
          },
          data: this.datedata,
          // 没一X项的Y值数据
          type: 'bar',
          barWidth: 24 //柱形宽度设置
        }]
      };
      myChart.setOption(option);
    }
  }

}
</script>
<style scoped>
  .panal_b {
    height: 24px;
    background-color: #F2F2F2;
  }
</style>
