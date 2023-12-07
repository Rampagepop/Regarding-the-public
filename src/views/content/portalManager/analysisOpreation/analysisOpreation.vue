/** * Desc: 运营分析 
* @author 陈祖英 
* @date 2022/10/25 
* @since 1.0.0
* @version 1.0 
*/
<template>
  <div class="analysis-opreation">
    <div class="event-analysisy">
      <div class="event-analysisy-title">
        <span class="sliver"></span>事件分析
      </div>
      <div class="event-analysisy-content">
        <div style="width:49%">
          <div class="chart-title">
            点击事件分析（卡片&二级页面）
          </div>
          <div class="self-tag">
            <span
              v-for="(item, index) in clickAnalysisTag"
              @click="choseClickModel1(item.value,'1')"
              :key="index + 'clickAnaly'"
              :class="[currentValue === item.value? 'active' : '']"
            >
              {{ item.label }}
            </span>
          </div>
          <div class="chart" ref="chart2"></div>
        </div>
        <div style="width:49%">
          <div class="chart-title">
            曝光事件分析（二级页面）
          </div>
          <div class="self-tag">
            <span
              v-for="(item, index) in viewAnalysisTag"
              @click="choseClickModel2(item.value,'1')"
              :class="[currentValue1 === item.value? 'active' : '']"
              :key="index + 'clickAnaly'"
            >
              {{ item.label }}
            </span>
          </div>
          <div class="chart" ref="chart1"></div>
        </div>
      </div>
    </div>
    <div class="event-analysisy">
      <div class="event-analysisy-title">
        <span class="sliver"></span>配置分析
      </div>
      <div class="event-analysisy-content">
        <div style="width:49%">
          <div class="chart-title">
            分岗位卡片配置情况统计（功能类）
          </div>
          <!-- :data-url="$backend.mockService + '/approveConstract/list'" -->
          <xtableHeaderDrag
            v-on="$listeners" v-bind="$attrs"
            ref="approveConstractTable"
            request-type="post"
            :data-url="$backend.portalService + '/api/xmhsysanalysis/cardusestatistic'"
            :headerFields="headerFieldsFunc"
            no-page-sizes
            :data="funcData"
            :base-params="funcParams"
            :default-load="true"
            :page-size="5" :page-sizes="[5]"
            border
            @loaded="loadTable"
            style="width: 100%">
          </xtableHeaderDrag>
        </div>
        <div style="width:49%">
          <div class="chart-title">
            卡片配置趋势及排名（功能类）
          </div>
          <div class="flex-class">
            <div style="width:68%">
              <div class="self-tag">
                <span
                  v-for="(item, index) in configTag"
                  @click="choseClickModel2(item.value,)"
                  :key="index + 'clickAnaly'"
                >
                  {{ item.label }}
                </span>
              </div>
            </div>
            <div style="width:30%" class="reset-position">
              <div class="rang-title">卡片在用排名（Top5）</div>
              <div class="body" ref="calStyle">
                <div class="body-item" v-for="(item,index) in tempdata" :key="'grating'+index">
                  <div><span class="grade-range" :class="[index<3 ? 'active':'']">{{ index+1 }}</span>{{ item.tagname }}</div>
                  <div :class="[item.taffValue < 0?'red-arrow':'green-arrow']">{{ item.taffValue }}<i :class="[item.taffValue < 0?'yu-icon-up':'yu-icon-down']"></i></div>
                </div>
              </div>
            </div>
          </div>
         
        </div>
      </div>
      <div class="event-analysisy-content">
        <div style="width:49%">
          <div class="chart-title">
            分岗位卡片配置情况统计（统计类）
          </div>
          <!-- :data-url="$backend.mockService + '/approveConstract/list'" -->
          <!-- <xtableHeaderDrag
            v-on="$listeners" v-bind="$attrs"
            ref="approveConstractTable"
            :headerFields="headerFieldsCount"
            no-page-sizes
            :data="countData"
            :page-size="5" :page-sizes="[5]"
            border
            @loaded="loadTable"
            :default-load="true"
            style="width: 100%">
          </xtableHeaderDrag> -->
        </div>
        <div style="width:49%">
          <div class="chart-title">
            卡片配置趋势及排名（统计类）
          </div>
          <div class="flex-class">
            <div style="width:68%">
              <div class="self-tag">
                <span
                  v-for="(item, index) in configTag"
                  @click="choseClickModel1"
                  :key="index + 'clickAnaly'"
                >
                  {{ item.label }}
                </span>
              </div>
            </div>
            <div style="width:30%" class="reset-position">
              <div class="rang-title">卡片在用排名（Top5）</div>
              <div class="body" ref="calStyle">
                <div class="body-item" v-for="(item,index) in tempdata" :key="'grating'+index">
                  <div><span class="grade-range" :class="[index<3 ? 'active':'']">{{ index+1 }}</span>{{ item.tagname }}</div>
                  <div :class="[item.taffValue < 0?'red-arrow':'green-arrow']">{{ item.taffValue }}<i :class="[item.taffValue < 0?'yu-icon-up':'yu-icon-down']"></i></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="event-analysisy">
      <div class="event-analysisy-title">
        <span class="sliver"></span>异常监控分析
      </div>
      <div class="event-analysisy-content">
        <div style="width:49%">
          <div class="chart-title">
            30日平台报错次数
          </div>
          <div class="checke-line-chart-as">
            <checks-line-chart style="width:100%;height:300px;" :x-axis-data="overview.cusStus.xAxisData"
                               :series-data="overview.cusStus.seriesData"
                               :cover-options="overview.cusStus.coverOptions"
            ></checks-line-chart>
          </div>
        </div>
        <div style="width:49%">
          <div class="chart-title">
            30日平台报错涉及用户数
          </div>
          <div class="checke-line-chart-as">
            <checks-line-chart style="width:100%;height:300px;" :x-axis-data="overview1.cusStus.xAxisData"
                               :series-data="overview1.cusStus.seriesData"
                               :cover-options="overview1.cusStus.coverOptions"
            ></checks-line-chart>
          </div>
        </div>
      </div>
      <div class="event-analysisy-content">
        <div style="width:49%">
          <div class="chart-title">
            30日报错原因分布
          </div>
          <pie-charts
            style="height:300px;width:100%;"
            :title="cusTypeAlz.data.title"
            :data="cusTypeAlz.data.data" :left="40"
            :coverOptions="cusTypeAlz.options"
          ></pie-charts>
        </div>
        <div style="width:49%">
          <div class="chart-title">
            30日报错涉及功能分布
          </div>
          <pie-charts
            style="height:300px;width:100%;"
            :title="cusTypeAlz1.data.title"
            :data="cusTypeAlz1.data.data" :left="40"
            :coverOptions="cusTypeAlz1.options"
          ></pie-charts>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const data1 = {
  "code": "0",
  "total": 0,
  "level": "info",
  "data": [
    {
      "entry": [
        {
          "cardName": "CO_MANAGE_V2_L1",
          "cardNameCn": "出账管理V2卡片",
          "sumClick": 0,
          "pv": 0,
          "uv": 0,
          "viewTimeAvg": 0,
          "date": "2022-10"
        },
        {
          "cardName": "CO_MANAGE_V2_L1",
          "cardNameCn": "出账管理V2卡片",
          "sumClick": 0,
          "pv": 0,
          "uv": 0,
          "viewTimeAvg": 0,
          "date": "2022-09"
        }
      ],
      "cardName": "CO_MANAGE_V2_L1"
    },
    {
      "entry": [
        {
          "cardName": "CO_MANAGE_V2_L2",
          "cardNameCn": "出账管理V2卡片二级页面",
          "sumClick": 0,
          "pv": 0,
          "uv": 0,
          "viewTimeAvg": 0,
          "date": "2022-10"
        },
        {
          "cardName": "CO_MANAGE_V2_L2",
          "cardNameCn": "出账管理V2卡片二级页面",
          "sumClick": 0,
          "pv": 0,
          "uv": 0,
          "viewTimeAvg": 0,
          "date": "2022-09"
        }
      ],
      "cardName": "CO_MANAGE_V2_L2"
    },
    {
      "entry": [
        {
          "cardName": "CO_MANAGE_V1_L2",
          "cardNameCn": "出账管理V1卡片二级页面",
          "sumClick": 0,
          "pv": 1,
          "uv": 0,
          "viewTimeAvg": 0,
          "date": "2022-10"
        },
        {
          "cardName": "CO_MANAGE_V1_L2",
          "cardNameCn": "出账管理V1卡片二级页面",
          "sumClick": 3,
          "pv": 1,
          "uv": 0,
          "viewTimeAvg": 0,
          "date": "2022-09"
        }
      ],
      "cardName": "CO_MANAGE_V1_L2"
    },
    {
      "entry": [
        {
          "cardName": "CO_MANAGE_V1_L1",
          "cardNameCn": "出账管理V1卡片",
          "sumClick": 0,
          "pv": 3,
          "uv": 2,
          "viewTimeAvg": 0,
          "date": "2022-10"
        },
        {
          "cardName": "CO_MANAGE_V1_L1",
          "cardNameCn": "出账管理V1卡片",
          "sumClick": 4,
          "pv": 3,
          "uv": 2,
          "viewTimeAvg": 0,
          "date": "2022-09"
        }
      ],
      "cardName": "CO_MANAGE_V1_L1"
    }
  ]
}
const data2 =  
{
  "code": "0",
  "total": 0,
  "level": "info",
  "data": [
    {
      "entry": [
        {
          "cardName": "CO_MANAGE_V1_L2",
          "cardNameCn": "出账管理V1卡片二级页面",
          "sumClick": 0,
          "pv": 1,
          "uv": 0,
          "viewTimeAvg": 0,
          "date": "2022-10"
        },
        {
          "cardName": "CO_MANAGE_V1_L2",
          "cardNameCn": "出账管理V1卡片二级页面",
          "sumClick": 3,
          "pv": 1,
          "uv": 0,
          "viewTimeAvg": 0,
          "date": "2022-09"
        }
      ],
      "cardName": "CO_MANAGE_V1_L2"
    },
  ]
}
import { debounce } from "@/utils/debounce";
import PieCharts from "@/views/portal/card/components/charts/pieCharts";
import EmptyMsg from "@/components/layout/emptyMsg/index.vue"
import checksLineChart from "@/views/portal/card/components/charts/checksLineChart"
import xtableHeaderDrag from "@/views/portal/card/components/xtableHeaderDrag";
export default {
  name: "analysisOpreation",
  components: { xtableHeaderDrag, EmptyMsg, checksLineChart, PieCharts },
  props: {},
  data: function() {
    return {
      currentValue :'',
      currentValue1:'',
      //排名
      tempdata:[
        {
          tagname:'客户管理V1',
          taffValue:27,
        },
        {
          tagname:'当天到期未还',
          taffValue:27,
        },
        {
          tagname:'当天新增逾期',
          taffValue:27,
        },
        {
          tagname:'7日净新增逾期',
          taffValue:27,
        },
        {
          tagname:'7日净新增逾期',
          taffValue:27,
        }
      ],
      //饼图数据
      cusTypeAlz: {
        data: 
            {
              title: "报错原因分布",
              data: [
                {label: "文件格式错误", value: 20}, {label: "未输入金额", value: 15}, {label: "未上传文件", value: 15}]
            },
        options: {
          title: {
            left:'36%'
          },
          legend: {
            textStyle: {
              fontSize: '12',
              color: '#666666',
            }
          },
          series: {
            radius: [70, 86],
            center: ['36%', '50%']
          },
          tooltip: {
            formatter: (params) => {
              return `${params.marker}${params.name}<br/>&emsp;报错原因分布${params.value}<br/>&emsp;占比：${params.percent}%`
            }
          },
        }
      },
      cusTypeAlz1: {
        data: 
            {
              title: "报错功能分布",
              data: [
                {label: "工作台管理", value: 20}, {label: "工作台和广告", value: 15}, {label: "功能类卡片", value: 15}, {label: "流程类卡片", value: 15}, {label: "统计类卡片", value: 15}, {label: "工具类卡片", value: 15}]
            },
        options: {
          title: {
            left:'36%'
          },
          legend: {
            textStyle: {
              fontSize: '12',
              color: '#666666',
            }
          },
          series: {
            radius: [70, 86],
            center: ['36%', '50%']
          },
          tooltip: {
            formatter: (params) => {
              return `${params.marker}${params.name}<br/>&emsp;报错功能分布${params.value}<br/>&emsp;占比：${params.percent}%`
            }
          },
        }
      },
      overview: {
        // 按照客户状态分析
        cusStus: 
          {
            xAxisData: ['2022-1', '2022-2', '2022-3', '2022-4'],
            seriesData: [
              {
                label: "昨日报错（次）",
                check: true,
                enableCheck:true,
                value: "186",
                ratio: {label: "比上月", value: "2%", grow: true},
                data: [11, 22, 33, 44]
              },
              {
                label: "合计报错（次）",
                value: "186",
                check: false,
                enableCheck:true,
                ratio: {label: "近30日"},
                data: [11, 22, 33, 44]
              },
              {
                label: "日均报错（次）",
                value: "186",
                check: false,
                enableCheck:true,
                ratio: {label: "近30日"},
                data: [11, 22, 33, 44]
              }
            ],
            coverOptions: {
              xAxis: {
                axisLabel: {
                  fontSize: 12
                },
                interval:'auto'
              },
              legend: {
                top: 7
              },
              grid: {
                top: 38,
              },
            }
          },
      },
      //折线数据
      overview1: {
        // 按照客户状态分析
        cusStus: 
          {
            xAxisData: ['2022-1', '2022-2', '2022-3', '2022-4'],
            seriesData: [
              {
                label: "昨日报错涉及用户（人）",
                check: true,
                enableCheck:true,
                value: "186",
                ratio: {label: "比上月", value: "2%", grow: true},
                data: [11, 22, 33, 44]

              },
              {
                label: "合计报错涉及用户（人）",
                value: "186",
                check: false,
                enableCheck:true,
                ratio: {label: "近30日"},
                data: [11, 22, 33, 44]
              },
              {
                label: "日均报错涉及用户（人）",
                value: "186",
                check: false,
                enableCheck:true,
                ratio: {label: "近30日"},
                data: [11, 22, 33, 44]
              }
            ],
            coverOptions: {
              xAxis: {
                axisLabel: {
                  fontSize: 12
                },
                interval:'auto'
              },
              legend: {
                top: 7
              },
              grid: {
                top: 38,
              },
            }
          },
      },
      //功能类table
      headerFieldsFunc:[],
      //统计类table
      funcData:[],
      countData:[],
      funcParams:{
        "cardType": 4,
        "page": 1,
        "size": 10
      },
      headerFieldsCount:[],
      headerFields: [{
        label: '任务流水号',
        prop: 'businessNumber',
        show: true,
        showColFilter: true,
        handleClick: this.tempBtnFn,
      }, {
        label: "合同编号",
        prop: "constractId",
        show: true,
        showColFilter: true,
      }, {
        label: "合同类型",
        prop: "constractType",
        show: true,
        showOverflowTooltip: true
      }, {
        label: "客户编号",
        prop: "customerId",
        show: true,
      }, {
        label: "客户名称",
        prop: "customerName",
        handleClick: this.tempBtnFn,
        show: true,
      }, {
        label: '币种',
        prop: 'currency',
        show: true,
      }, {
        label: '金额',
        prop: 'momey',
        moneyFormatter: true,
        show: true,
      }, {
        label: '责任机构',
        prop: 'org',
        show: true,
      }, {
        label: '登记日期',
        prop: 'entryTime',
        show: true,
      }],
      clickAnalysisTag: [
        { value: 'CUS_MANAGE', label: "客户管理" },
        { value: 'CR_MANAGE', label: "授信管理" },
        { value: 'K_MANAGE', label: "合同管理" },
        { value: 'GUAR_MANAGE', label: "担保管理" },
        { value: 'CO_MANAGE', label: "出帐管理" }
      ],
      viewAnalysisTag: [
        { value: 'CUS_MANAGE_V1', label: "客户管理V1二级" },
        { value: 'CR_MANAGE_V2', label: "客户管理V2二级" },
        { value: 'K_MANAGE_V2', label: "授信管理V2二级" },
        { value: 'GUAR_MANAGE_V2', label: "合同管理V2二级" },
        { value: 'CO_MANAGE_V2', label: "担保管理V2二级" }
      ],
      configTag: [
        { value: 1, label: "客户管理V1" },
        { value: 2, label: "客户管理V2" },
        { value: 3, label: "授信管理V1" },
        { value: 4, label: "授信管理V2" },
        { value: 5, label: "合同管理V1" },
        { value: 6, label: "合同管理V2" },
        { value: 7, label: "出账管理V1" },
        { value: 8, label: "出账管理V2" },
        { value: 9, label: "担保管理V1" },
        { value: 10, label: "担保管理V2" }
      ],
      clickLegend: ["V1卡片点击事件", "V2卡片点击事件", "V3卡片点击事件"],
      autoResize: true,
      chart: null,
      options: {
        grid: {
          show: false,
          top: 44,
          left: 40,
          right: 40,
          bottom: 20,
        },
        title: {
          subtext: "频次数：万",
          top: 0,
          left: 0
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#949494FF"
            }
          },
          axisTick: { show: false },
          data: []
        },
        yAxis: {
          type: "value",
          axisTick: { show: false },
          axisLine: { show: true },
          axisLabel:{ color:'#949494' },
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          // 垂直布局
          orient: "horizontal",
          top: 6,
          left: "center",
          // 图例间距
          itemGap: 10,
          icon: "path://M0,0L100,0L100,10L0,10Z",
          textStyle: {
            fontSize: "14",
            color: "#666666"
          }
        },
        series: [
          {
            name: "V1卡片点击事件",
            data: [],
            type: "line",
            smooth: true,
            symbol: "none",
            lineStyle: {
              color: "#2877FF"
            }
          },
          {
            name: "V2卡片点击事件",
            data: [],
            type: "line",
            smooth: true,
            symbol: "none",
            lineStyle: {
              color: "#FFC371"
            }
          },
          {
            name: "V3卡片点击事件",
            data: [],
            type: "line",
            smooth: true,
            symbol: "none",
            lineStyle: {
              color: "#1ABE95"
            }
          }
        ]
      },
      options1: {
        grid: {
          show: false,
          top: 44,
          left: 40,
          right: 40,
          bottom: 20,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#949494FF"
            }
          },
          axisTick: { show: false },
          data: []
        },
        yAxis: [
          {
            name: 'PV/UV数量',
            type: 'value',
            nameTextStyle:{
              color:'#949494'
            },
            axisLabel:{
              color:'#949494'
            }
          },
          {
            name: '平均停留时间',
            nameLocation: 'start',
            alignTicks: true,
            nameTextStyle:{
              color:'#949494'
            },
            axisLabel:{
              color:'#949494'
            },
            type: 'value',
            inverse: true
          }
        ],
    
        // type: "value",
        // axisTick: { show: false },
        // axisLine: { show: true }
        // },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          // 垂直布局
          orient: "horizontal",
          top: 6,
          left: "center",
          // 图例间距
          itemGap: 10,
          icon: "path://M0,0L100,0L100,10L0,10Z",
          textStyle: {
            fontSize: "14",
            color: "#666666"
          }
        },
        series: [
          {
            name: "PV",
            data: [],
            type: "line",
            smooth: true,
            symbol: "none",
            lineStyle: {
              color: "#2877FF"
            }
          },
          {
            name: "UV",
            data: [],
            type: "line",
            smooth: true,
            symbol: "none",
            lineStyle: {
              color: "#FFC371"
            }
          },
          {
            name: "平均停留时间",
            data: [],
            type: "line",
            smooth: true,
            symbol: "none",
            lineStyle: {
              type: "dashed",
              color: "#1ABE95"
            }
          }
        ]
      },
      color: [
        "#2877FF",
        "#FFC371",
        "#1ABE95",
        "#FD706D",
        "#7585E6",
        "#88CA8B",
        "#FFA175 ",
        "#6AAAF7",
        "#FF8BC3"
      ]
    };
  },
  watch: {},
  mounted() {
    this.chart = window.echarts.init(this.$refs.chart2);
    this.chart1 = window.echarts.init(this.$refs.chart1);
    if (this.options) {
      this.chart.setOption(this.options, true);
      this.chart1.setOption(this.options1, true);
    }
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener("resize", this.__resizeHandler);
    }
    this.currentValue = this.clickAnalysisTag[0].value
    this.currentValue1 = this.viewAnalysisTag[0].value
    this.getLineData2(this.viewAnalysisTag[0].value);
    this.getLineData1(this.clickAnalysisTag[0].value);
    // this.getConfigInfo('sortType', 1, this.headerFieldsCount)
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHandler);
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    //获取配置信息 功能类
    getConfigInfo(filed, value, headF, gcTable) {
      this.$request({
        url: `${this.$backend.portalService}/api/xmhsysanalysis/cardusestatistic`,
        params: {
          filed: value,
          "page": 1,
          "size": 10
        }
      }).then(res => {
        if (res && res.code === "0") {
          res.data.list[0].items.forEach((ls) => {
            headF.push({prop:'useNum' + ls.cardName, label:ls.cardName})
          })
          res.data.list.forEach((ls, kl) => {
            gcTable.push({'roleId':ls.roleId})
            if(ls.items && ls.items.length) {
              ls.items.forEach((lt, index) => {
                gcTable[kl]['useNum' + lt.cardName] = lt.useNum
              })
            }
          })
        }
      });
    },
    //30日错误数据
    // getErrorCount(){
    //   /api/xmhsysanalysis/cardusestatistic
    // },
    getLineData2(value) {
      this.$request({
        url: `${this.$backend.portalService}/api/xmhsysanalysis/search`,
        data: {
          cardName:value
        }
      }).then(res => {
        if (res && res.code === "0") {
          this.options1.series[0].data = []
          res.data.forEach((item, index) => {
            if(item.entry && item.entry.length) {
              item.entry.forEach((lt, ls) => {
                this.options1.xAxis.data.push(lt.date)  
                this.options1.series[0].data.push(lt.pv) 
                this.options1.series[1].data.push(lt.uv) 
                this.options1.series[2].data.push(lt.viewTimeAvg) 
              })
            }
          })
          this.$nextTick(() => {
            this.chart1.setOption(this.options1, true);
          })
        }
      })   
    },
    resetArray(data, type) {
      let temp = []
      if(data.length) {
        this.options.xAxis.data = []
      }
      temp = data.reduce((nArr, item) => {
        const t = nArr.find(a => a.time == item.time);
        if (t) {
          t.value += item.value
        } else {
          nArr.push(item)
        }
        return nArr
      }, [])
      temp.forEach(lt => {
        this.options.xAxis.data.push(lt.time)
        this.options.series[type - 1].data.push(lt.value)
      })
    },
    //获取点击事件分析数据
    getLineData1(value) {
      const temp1 = [];
      const temp2 = [];
      const temp3 = [];
      this.$request({
        url: `${this.$backend.portalService}/api/xmhsysanalysis/search`,
        data: {
          cardName:value
        }
      }).then(res => {
        if (res && res.code === "0") {
          this.options.series[0].data = []
          res.data.forEach((item, index, self) => {
            this.options.xAxis.data.push()
            if(item.entry && item.entry.length) {
              item.entry.forEach((lt, ls) => {
                if(lt.cardName.includes('V1')) {
                  temp1.push({time:lt.date, value:lt.sumClick}) 
                }else if(lt.cardName.includes('V2')) {
                  //v2 一级  二级
                  temp2.push({time:lt.date, value:lt.sumClick})
                }else if(lt.cardName.includes('V3')) {
                  //v2 一级  二级
                  temp3.push({time:lt.date, value:lt.sumClick ? lt.sumClick : 0})
                } 
              })
            }
          })
          this.$nextTick(() => {
            this.resetArray(temp1, 1)
            this.resetArray(temp2, 2)
            // this.resetArray(temp3,3)
            this.chart.setOption(this.options, true);
          })
        }
      })
    },
    //点击切换tab获取不同的option
    choseClickModel1(value, type) {
      this.currentValue = value   
      this.getLineData1(value);
    },
    choseClickModel2(value, type) {
      this.currentValue1 = value
      this.getLineData2(value);
    },
    loadTable(data) {
      this.getConfigInfo('cardType', 4, this.headerFieldsFunc, this.funcData)
    }
  }
};
</script>

<style lang="scss" scoped>
.flex-class {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .range-title {
    color:#333333FF;
    font-size:14px;
    font-weight: 400;
  }
  .reset-position {
    position:relative;
    top:20px;
  }
}
.analysis-opreation {
  padding: 0 16px 16px;
  .chart {
    width: 100%;
    height: 220px;
  }
  .event-analysisy {
    padding-top:16px;
    &-title {
      height: 32px;
      line-height: 32px;
      background: #2877ff26;
      border-radius: 4px;
      color: #2877ffff;
      font-size: 16px;
      padding-left:17px;
    }
    &-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .sliver {
      display: inline-block;
      width: 4px;
      height: 16px;
      vertical-align: -3px;
      background: #2877ffff;
      border-radius: 2px;
      margin-right: 4px;
    }
    .body {
     margin-top:10px;
    }
    .body-item div {
     font-size:12px;
     line-height:1;
     /* width:70px; */
    }
    body-item div i {
    }
    .body-item div:first-child {
     /* width:60%; */
    }
    .body-item {
      padding:0 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height:32px;
      line-height:1; 
      vertical-align: middle;
      background:rgba(224, 224, 224, 0.2500);
      margin-bottom:10px;
      .grade-range {
        display:inline-block;
        width:16px;
        height:16px;
        margin-right:2px;
        color:#fff;
        font-size:12px;
        line-height:16px;
        text-align:center;
        background:#949494FF;
        border-radius: 4px;
      }
      .active {
        background:#2877FFFF;
      }
    }
    .red-arrow {
     color:#F52C36;
     vertical-align: middle;
     i {
       color:#11BD19;
       padding:0 3px;
       font-size:12px;
      }
    }
    .green-arrow {
     vertical-align: middle;
     
     i {
       color:#11BD19;
       padding:0 3px;
       font-size:12px;
      }
    }
  }
  .chart-title {
    /* margin-top: 26px; */
    margin:26px 0 15px 0 ;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    line-height: 16px;
  }
  .self-tag {
    margin-bottom:2px;
    span {
      display: inline-block;
      background: rgba(245, 44, 54, 0);
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 4px;
      margin: 0 10px 4px 0;
      font-size: 14px;
    }
    .active {
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #2877ff;
      background:rgba(40, 119, 255, 0.1000);
      border: 1px solid rgba(40, 119, 255, 0.2);
    }
  }
}
</style>
