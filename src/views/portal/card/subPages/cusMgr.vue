/**
* Desc:&emsp;&ensp;客户管理二级页面
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/9/26
* @since   1.0.0
* @version 1.0
*/
<template>
  <div class="cus-mgr-v2-sub-wrap">
    <yu-tabs v-model="activeMode">
      <yu-tab-pane v-for="(tab,i) in modes" :key="i" :label="'    '+tab.label+'    '" :name="tab.value"></yu-tab-pane>
    </yu-tabs>
    <div v-loading="loading" class="body">
      <div class="overview">
        <div class="title">
          <span class="h1">{{ $t('card.cusMgr.overview') }}</span>
          <span class="h2">{{ $t('card.cusMgr.dataDate') }}：{{ overview.dataDate }}</span>
        </div>
        <div class="overview-chart">
          <div class="overview-chart-item">
            <div class="search-no-data" v-if="overview.cusStus.xAxisData && overview.cusStus.xAxisData.length === 0">
              <empty-msg></empty-msg>
            </div>
            <checks-line-chart v-else :x-axis-data="overview.cusStus.xAxisData"
                               :series-data="overview.cusStus.seriesData"
                               :cover-options="overview.cusStus.coverOptions"
            ></checks-line-chart>
          </div>
          <div class="overview-chart-item pie-chart-wrap">
            <div class="search-no-data" v-if="overview.cusTypeAlz.data && overview.cusTypeAlz.data.length === 0">
              <empty-msg></empty-msg>
            </div>
            <div v-else class="pie-chart" v-for="(item,i) in overview.cusTypeAlz.data" :key="i">
              <pie-charts
                :title="item.title" :data="item.data" :left="40"
                :coverOptions="overview.cusTypeAlz.options"
              ></pie-charts>
            </div>
          </div>
        </div>
      </div>
      <div class="cus-search">
        <div class="title">
          <span class="h1">{{ $t('card.cusMgr.cusSearch') }}</span>
        </div>
        <div class="tag-select-wrap">
          <yu-xform ref="refFormDemo" label-width="120px" v-model="cusSearch.formData">
            <yu-xform-item v-for="(item,i) in cusSearch.checkList" :key="i"
                           :label="item.label" ctype="custom" name="tagSelect" colspan="10">
              <yu-tag-option v-for="(opt,ii) in cusSearch.allCheck.concat(item.options)" :key="ii" :label="opt.key"
                             v-model="cusSearch.checkForm[item.prop][opt.key]"
                             @change="tagSelectChange(item,opt,$event)">{{ opt.value }}
              </yu-tag-option>
            </yu-xform-item>
            <yu-xform-group :column="6">
              <yu-xform-item label="客户编号" ctype="input" name="cusId" :placeholder="$t('card.qsr')"
                             @keyup.enter.native="search"></yu-xform-item>
              <yu-xform-item label="客户名称" ctype="input" name="cusName" :placeholder="$t('card.qsr')"
                             @keyup.enter.native="search"></yu-xform-item>
              <yu-xform-item label="证件号码" ctype="input" name="idNo" :placeholder="$t('card.qsr')"
                             @keyup.enter.native="search"></yu-xform-item>
              <div slot="custom" style="font-size:0px">
                <yu-button style="margin-left:10px" type="primary" @click="search">
                  {{ $t('card.cusMgr.query') }}
                </yu-button>
                <yu-button @click="reset">{{ $t('card.cusMgr.reset') }}</yu-button>
              </div>
            </yu-xform-group>
          </yu-xform>
          <xtableHeaderDrag ref="xtableHeaderDrag" style="margin-bottom: 10px"
                            :data-url="tableDataUrl" request-type="POST" :base-Params="baseParams"
                            border :tableId="tableId" :headerFields="headerFields"
                            :default-load="defaultLoadFlag" height="398" :multiSort="multiSort"
                            row-height="35px" :buttons="buttons" @sort="sortChange"></xtableHeaderDrag>
          <div class="disabled-cus">
            {{
              $t('card.cusMgr.disabledCusSearch').substring(0, $t('card.cusMgr.disabledCusSearch').indexOf("$"))
            }}
            <span v-if="activeMode === 'ps'" class="c1" @click="getBtnFn1('psUnLogOut')">{{ $t('card.cusMgr.here') }} </span>
            <span v-else>
              <span class="c1" @click="getBtnFn1('corpUnLogOut')">{{ $t('card.cusMgr.corporate') }} </span>/
              <span class="c1" @click="getBtnFn1('corpUnRegLogOut')">{{ $t('card.cusMgr.Peer') }} </span>
            </span>
            {{
              $t('card.cusMgr.disabledCusSearch').substring($t('card.cusMgr.disabledCusSearch').indexOf("$") + 1)
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config/index.js";
import EmptyMsg from "@/components/layout/emptyMsg/index.vue"
import checksLineChart from "@/views/portal/card/components/charts/checksLineChart"
import PieCharts from "@/views/portal/card/components/charts/pieCharts";
import xtableHeaderDrag from "@/views/portal/card/components/xtableHeaderDrag";
import corpPsMixin from "@/views/portal/card/routes/config/corpPsMixin";
import {getOptsByDataCodes} from "@/views/portal/card/routes/config/cardUtil";
import multiSystemCfg from "@/config/multisystem"
export default {
  name: "cusMgr",
  components: {PieCharts, checksLineChart, xtableHeaderDrag, EmptyMsg},
  mixins: [corpPsMixin],
  props: {},
  data: function () {
    const endDate = new Date();
    const dataDate = this.$moment(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)).format('YYYY-MM-DD') //获取当天的上一天
    return {
      loading: false,
      tableId: null,
      sortObj: {},
      baseParams: {
        cusId : ''
      },
      defaultLoadFlag: true, //默认加载
      multiSort: false, // 单个排序 false  多个排序true, 默认单个
      // 概况分析
      overview: {
        dataDate: dataDate, 
        // 按照客户状态分析
        cusStus: {
          // 近12个月的月末
          xAxisData: new Array(12).fill(0).map((_, i) => {
            if(i != 0 || new Date().getDate() == 1) {
              endDate.setDate(0);
            }
            return i == 0 ? dataDate : this.$moment(endDate).format('YYYY-MM-DD')
          }).reverse(),
          seriesData: [],
          coverOptions: {}
        },
        // 按照客户类别分析
        cusTypeAlz: {
          data: [],
          options: {
            tooltip: {
              formatter: (params) => {
                return `${params.marker}${params.name}<br/>&emsp;${this.$t('card.cusMgr.cusNum')}：${params.value}<br/>&emsp;${this.$t('card.cusMgr.population')}：${params.percent.toFixed(1)}%`
              }
            },
          },
        }
      },
      cusSearch: {
        allCheck: [{key: "_ALL", value: this.$t('card.cusMgr.all')}],
        // checkList和checkForm根据activeMode进行重新计算
        // [{prop:xxx,label:xxx,value:字典,options:[]}]
        checkList: [],
        // 双向绑定
        checkForm: {},
        // 用于后端查询使用
        checkFormParams: {},
        formData: {},
      },
    }
  },
  computed: {},
  watch: {
    activeMode: {
      handler: function () {
        this.loading = true;
        this.clearPage();
        // 处理字典，有缓存取缓存
        this.dealLookUp(() => {
          // 处理下方tag
          this.dealTagsData();
          // 获取统计数据
          this.getStatData(data => {
            try {
              // 处理数据（容易有问题）
              if(data) {
                this.dealLineChartData(data);
                this.dealPieChartData(data);
              }
            } catch (e) {
              console.error(e);
            } finally {
              this.loading = false;
            }
          });
        });
      },
      immediate: true
    }
  },
  created() {
    if (this.$route.query && this.$route.query.custID) {
      this.defaultLoadFlag = false; // 表格初始化不加载
    }
    if (this.$route.query && this.$route.query.mode) {
      this.activeMode = this.$route.query.mode
    }
  },
  mounted() {
    if (config.isdebug) {
      setTimeout(() => {
        window.debugCusMgr = this;
      }, 100)
    }
    // 客户管理V1卡片。跳转页面后蒋客户信息反填页面
    if (this.$route.query && this.$route.query.custID) {
      this.baseParams.cusId = this.$route.query.custID;
      this.$refs.xtableHeaderDrag.remoteData(this.baseParams)
    }
  },
  methods: {
    /**
     * 排序事件，点击列表中排序按钮排序
     * sort.prop 列ID
     * sort.sort 排序规则
     */
    sortChange(sort) {
      const _this = this;
      if(_this.multiSort) { //多个
        var sortStr = '';
        for (var i = 0; i < sort.length; i++) {
          if(i === sort.length - 1) {
            sortStr += sort[i].prop + " " + sort[i].sort
          }else {
            sortStr += sort[i].prop + " " + sort[i].sort + ","
          }
        }
        _this.sortObj = {sort: sortStr}
      }else { //单个
        _this.sortObj = sort != null ? {sort: sort.prop + " " + sort.sort} : null;
      }
      
      const params = _this.getSearchFormData();
      Object.assign(params, _this.sortObj || {});
      Object.assign(params, _this.cusSearch.checkFormParams);
      _this.$refs.xtableHeaderDrag.remoteData(params)
    },
    /**
     * 列表下方点击此处跳转反注销页面
     * @params name
     * psUnLogOut 个人
     * corpUnLogOut 对公
     * corpUnRegLogOut 同业
     */
    getBtnFn1(name) {
      multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", name, null)
    },
    clearPage() {
      this.$refs.refFormDemo && this.$refs.refFormDemo.resetFields();
    },
    /** 数据获取 START */
    // 处理字典
    dealLookUp(cb) {
      // 概览-右侧饼图
      const overview = this.pageConfig.subPage.overview;
      // 下方搜索区域
      const cusSearch = this.pageConfig.subPage.cusSearch;

      if (overview.cachedOptions != undefined) {
        // 回调
        cb();
        return;
      }
      // 去重后的字典
      const fieldsMap = this.pageConfig.fieldsMap;
      const codes = Array.from(new Set(overview.cusTypeAlzProps.concat(cusSearch.checkOptProps))).map(prop => fieldsMap[prop].value)
      getOptsByDataCodes(codes, obj => {
        // 缓存一下
        overview.cachedOptions = overview.cusTypeAlzProps.map(key => ({
          ...fieldsMap[key],
          options: obj[fieldsMap[key].value]
        }))
        cusSearch.cachedOptions = cusSearch.checkOptProps.map(key => ({
          ...fieldsMap[key],
          options: obj[fieldsMap[key].value]
        }))
        // 回调
        cb()
      })
    },
    // 统计数据
    getStatData(cb) {
      // 缓存
      // if (this.pageConfig.detStatData) {
      //   cb(this.pageConfig.detStatData)
      //   return;
      // }
      // 概览的统计数据都在这一个接口
      this.$request({
        url: this.detStatUrl,
        method: "POST"
      }).then(({code, message, data}) => {
        if (code === "0") {
          this.pageConfig.detStatData = data;
          cb(this.pageConfig.detStatData)
        } else {
          this.$message.error(message);
        }
      }).catch(() => {
        this.loading = false;
      })
    },
    // 处理折现数据
    dealLineChartData(data) {
      const seriesData = [
        {
          label: this.$t('card.cusMgr.cusTot'),
          check: true,
          enableCheck: true,
          ratio: {label: this.$t('card.cusMgr.cmpLastMonth'), value: "", grow: true},
        }, {
          label: this.$t('card.cusMgr.hvCrCus'),
          check: true,
          enableCheck: true,
          ratio: {label: this.$t('card.cusMgr.cmpLastMonth'), value: "", grow: false},
        }, {
          label: this.$t('card.cusMgr.hvLoanCus'),
          check: false,
          enableCheck: true,
          ratio: {label: this.$t('card.cusMgr.cmpLastMonth'), value: "", grow: true},
        }, {
          label: this.$t('card.cusMgr.frmlCus'),
          check: false,
          enableCheck: true,
          ratio: {label: this.$t('card.cusMgr.cmpLastMonth'), value: "", grow: false},
        }
      ];
      if(data) {
        // 客户总计,有授信客户,有贷客户,正式客户
        ["cus", "hvCrCus", "hvLoanCus", "frmlCus"].forEach((field, i) => {
          const item = seriesData[i];
          const ratio = parseFloat(data ? data[field + 'GrthPct'] : 0);
          item.ratio.value = ratio == -1 ? "--" : ((ratio * 100).toFixed(0) + "%");
          item.ratio.grow = ratio == -1 || ratio >= 0;
          item.value = data ? data[field + (i == 0 ? 'TotNum' : 'Num')] : 0;
          item.data = data ? data[field + 'MothDtl'].concat([]) : [];
          item.data.reverse();
        })
        this.overview.cusStus.seriesData.splice(0, 4, ...seriesData)
      }
    },
    // 饼图数据
    dealPieChartData(statData) {
      // {
      //   title: "客户分类",
      //   data: [{label: "企业", value: 20}, {label: "政府机关", value: 15}, {label: "事业单位", value: 15},
      //     {label: ""}, //换行用
      //     {label: "社会团体", value: 18}, {label: "个体工商", value: 20}, {label: "其他组织机构", value: 22}]
      // },
      const resData = this.pageConfig.subPage.overview.cachedOptions.map(item => {
        // item格式参考{prop: "cusTyp", label: "客户类型", value: "INDIV_CUS_TYP", options:[{key:"01",value:"XXX"}]}
        const itemStatData = statData[item.statDetField || item.prop];
        if (itemStatData == null) {
          return null
        }
        const data = this.formatPieData(item.options.reduce((arr, opt) => {
          // itemStatData是个对象，只会包含有数据的字典项数据
          if (itemStatData[opt.key]) {
            arr.push({label: opt.value, value: itemStatData[opt.key]})
          }
          return arr;
        }, []))
        return {
          title: item.label,
          // 没数据就加一条
          data: data.length ? data : [{label: this.$t('card.cusMgr.noData'), value: 0}]
        }
      }).filter(item => item != null)
      this.overview.cusTypeAlz.data.splice(0, this.overview.cusTypeAlz.data.length, ...resData)
    },
    // 饼图的数据标签处理：排序，超过6个进行合并，添加用于legend的换行标志
    formatPieData(arr) {
      // 降序排列，value正常是数字, 在转换一下以防万一
      arr.sort((a, b) => parseInt(b.value) - parseInt(a.value))
      // 超过6个合并
      if (arr.length > 6) {
        // 从第5项开始求和，展示为其他
        const sum = arr.reduce((acc, item, i) => acc + (i >= 5 ? item.value : 0), 0);
        arr.splice(5, arr.length - 5, {label: this.$t('card.cusMgr.other'), value: sum})
      }
      // 添加换行
      if (arr.length == 4) {
        arr.splice(2, 0, {label: ""})
      } else if (arr.length > 4) {
        arr.splice(3, 0, {label: ""})
      }
      return arr

    },
    // 处理tag选择
    dealTagsData() {
      const cusSearch = this.pageConfig.subPage.cusSearch;
      this.$set(this.cusSearch, "checkList", cusSearch.cachedOptions);
      this.$set(this.cusSearch, "checkForm", cusSearch.cachedOptions.reduce((obj, item) => {
        // 默认只勾选 ‘所有’
        obj[item.prop] = item.options.reduce((o, opt) => {
          o[opt.key] = false;
          return o
        }, {_ALL: true})
        return obj
      }, {}));
    },
    /** 数据获取 END */
    /** 表格交互部分 START */
    // tag选择切换
    tagSelectChange(item, opt, value) {
      const checkForm = this.cusSearch.checkForm[item.prop];
      const checkFormParams = this.cusSearch.checkFormParams;
      if (value) {
        if (opt.key === "_ALL") {
          // 其他tag取消选中，只保留”所有“
          Object.keys(checkForm).forEach(k => {
            checkForm[k] = k === "_ALL"
          })
        } else {
          // 取消选中"所有"
          checkForm._ALL = false;
          // 两个可选tag则表现为单选
          if (item.options.length <= 2) {
            Object.keys(checkForm).forEach(k => {
              k !== opt.key && (checkForm[k] = false)
            })
          }
        }
      } else {
        //如果这次取消选中后，所有tag均为未选中状态，则标记”所有“tag为选中
        if (!Object.keys(checkForm).some(k => checkForm[k])) {
          checkForm._ALL = true;
        }
      }
      if (checkForm._ALL) {
        // 删除查询参数
        delete checkFormParams[item.prop]
      } else {
        checkFormParams[item.prop] = Object.keys(checkForm).filter(k => k !== "_ALL" && checkForm[k]).join(",")
      }
      // 延迟查询
      if (this.remoteDataTimer == null) {
        this.remoteDataTimer = setTimeout(() => {
          this.remoteDataTimer = null;
          const params = this.getSearchFormData();
          Object.assign(params, this.cusSearch.checkFormParams);
          this.$refs.xtableHeaderDrag.remoteData(params)
        }, 100)
      }
    },
    // 获取添加了%的搜索条件
    getSearchFormData() {
      const formData = this.cusSearch.formData;
      return Object.keys(formData).reduce((obj, k) => {
        if (formData[k] && k !== "tagSelect") {
          obj[k] = k === 'orgId' ? formData[k] : ('%' + formData[k] + '%')
        }
        return obj
      }, {})
    },
    // 查询，先重置tag
    search() {
      this.resetTagAndSearch();
    },
    // 重置
    reset() {
      this.$refs.refFormDemo.resetFields();
      this.resetTagAndSearch();
    },
    // 筛选tag重置为全部并重新新查询
    resetTagAndSearch() {
      this.cusSearch.checkList.forEach(item => this.tagSelectChange(item, {key: "_ALL", value: true}, true));
    },
    /** 表格交互部分 END */
  },
}
</script>

<style lang="scss" scoped>
.cus-mgr-v2-sub-wrap {
  height: calc(100% - 20px);
  width: 100%;
  overflow-y: scroll;
}

::v-deep .el-tabs {
  height: 48px;

  .el-tabs__header {
    margin: 0;

    .el-tabs__item {
      height: 48px;
      line-height: 48px;
      font-size: 16px;
      white-space: pre;
      padding: 0;
    }
  }

  .el-tabs__content {
    display: none;
  }
}


.body {
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;

  & > div {
    width: 100%;
  }
}

.title {
  width: 100%;
  height: 46px;
  border-bottom: 2px solid #EDEDED;
  line-height: 48px;

  .h1 {
    margin-left: 16px;
    font-size: 16px;
    font-weight: bold;
    color: #222222;
  }

  .h2 {
    margin-left: 9px;
    color: #666666;
  }
}

.overview-chart {
  width: 100%;
  height: 320px;
  margin-top: 16px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  
  .overview-chart-item {
    flex: auto;
    width: 50%;
    height: 100%;
    margin-left: 16px;

    &:first-of-type {
      margin-left: 0;
    }

    &.pie-chart-wrap {
      display: flex;
      flex-flow: row wrap;

      .pie-chart {
        flex: none;
        width: 50%;
        height: 50%;
      }
    }
  }
}

.cus-search {
  margin-top: 16px;

  ::v-deep .el-form {
    margin-top: 16px;

    .el-form-item {
      margin-bottom: 8px;
    }
  }

  .tag-select-wrap {
    position: relative;
    // tag样式
    ::v-deep .el-tag-option {
      height: 24px;
      background: #ffffff;
      border: 1px solid #E0E0E0;
      border-radius: 4px;
      color: #333333;
      //减去边框2px
      line-height: 22px;
      padding: 0 8px;

      &.is-checked {
        color: #2877FF;
        background: rgba(40, 119, 255, 0.1);
        border: 1px solid rgba(40, 119, 255, 0.2);
      }
    }

    .disabled-cus {
      position: absolute;
      left: 0px;
      bottom: 5px;
      padding: 0;

      > span {
        cursor: pointer;
      }
    }

  }
}
</style>
