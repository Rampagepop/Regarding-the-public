/**
* Desc:&emsp;&ensp;左边table，右边图表，3/4卡片组件，左下角可点击“更多统计信息”
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/9/15
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-wrap :cardName="cardName">
    <template v-if="isConfigWrapMenu" slot="menus">
      <li @click="toProgressCenter('allPrepare','undeal')">{{ $t('card.cardmore') }}</li>
    </template>
    <div class="top-center" slot="topCenter">
      <div class="search">
        <yu-input class="search-item search-input" :placeholder="searchPlaceHolder"
                  suffix-icon="el-icon-search" v-model.trim="searchFormData.searchVal"
                  @change="searchChangeHandler()" clearable>
        </yu-input>
        <yu-select v-if="searchDimOpts && searchDimOpts.length" class="search-item search-select"
                   v-model="searchFormData.searchDim" @change="changeSearchDim">
          <yu-option
            v-for="item in searchDimOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </yu-option>
        </yu-select>
        <yu-select v-if="searchDimOpts && searchDimOpts.length" class="search-item search-select"
                   v-model="searchFormData.searchDimValue">
          <yu-option
            v-for="item in curtSearchDimSubOpts"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </yu-option>
        </yu-select>
      </div>
      <div v-if="modes && modes.length" class="tab-title">
        <div class="tab-title-right">
          <span v-for="(mode,i) in modes" :key="i"
                :class="['mode'].concat(activeMode === mode.value?['active','c1','bc1','bdc1']:[])"
                @click="$emit('update:active-mode',mode.value)">{{ mode.label }}</span>
        </div>
      </div>
    </div>
    <div class="cb-table-chart-wrap">
      <div class="cb-table-chart-wrap--table">
        <xtableHeaderDrag ref="refTable" v-on="$listeners" v-bind="$attrs" no-page-sizes
                          :page-size="5" :page-sizes="[5]" @sort="sortChange"></xtableHeaderDrag>
        <yu-button v-if="moreInfoClickFn!=null"
                   class="cb-table-chart-wrap--more-info"
                   type="text" @click="moreInfoClickFn">
          {{ $t('card.searchChartBtx.moreStatisticInfo') }}
        </yu-button>
      </div>
      <div class="cb-table-chart-wrap--chart">
        <slot name="chart"></slot>
      </div>
    </div>
  </card-wrap>
</template>

<script>
import cardWrap from "@/views/portal/card/components/card-wrap";
import xtableHeaderDrag from "@/views/portal/card/components/xtableHeaderDrag";
import YuCardEmpty from "@/views/portal/card/components/empty.vue";
import config from "@/config";
import {lookup} from "@/utils";
export default {
  name: "card-tableChart",
  components: {
    cardWrap,
    YuCardEmpty,
    xtableHeaderDrag
  },
  props: {
    cardName: {
      type: String,
      default: "Demo",
    },
    searchPlaceHolder: {
      type: String,
      default: "",
    },
    // 查询维度，每个维度可以传入其对应的options
    // 传入null或者空数组则不显示
    searchDimOpts: {
      type: Array,
      default: null,
    },
    activeMode: String,
    modes: {
      type: Array,
      default: () => [],
    },
    // 更多信息点击事件，默认不显示
    moreInfoClickFn: {
      type: Function,
      default: null
    },
    //右上角更多跳转下拉按钮
    isConfigWrapMenu:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultDimOpts: [{key: "_ALL", value: "全部"}],
      searchFormData: {
        searchVal: "",
        searchDim: "",
        searchDimValue: "_ALL",
      },
      curtSearchDimSubOpts: [],
    };
  },
  computed: {},
  watch: {
    // 搜索表单变动
    'searchFormData.searchDim': {
      handler: function (_n, o) {
        // 第一次不加载  切换mode引起的dim变化也不加载
        if (o == undefined || o == "" || !this.searchDimOpts.some(d => d.value == o)) {
          return;
        }
        this.searchChangeHandler()
      }
    },
    'searchFormData.searchDimValue': {
      handler: function (n, o) {
        this.searchChangeHandler()
      }
    },
    activeMode(newValue) {
    // 解决切换tab后搜索框参数未变不能触发change查询事件的问题
      if(newValue) {
        this.searchFormData.searchVal = ''
        // this.searchChangeHandler()
      }
    },
    // 变动重置搜索维度
    searchDimOpts: {
      handler: function (n, _o) {
        //默认客户状态
        if(n) {
          const currentTemp = n.filter(item => item.label === '客户状态');
          this.searchFormData.searchDim = currentTemp && currentTemp.length ? currentTemp[0].value : ""
        }
      },
      deep: true,
      immediate: true
    },
  },
  mounted() {
    if (config.isdebug) {
      setTimeout(() => {
        window.debugV2Table = this;
      }, 100)
    }
  },
  beforeDestroy() {
  },
  methods: {
    toProgressCenter(activeMode, mode, item) {
      const tarRoute = this.$router.match("/portal/card/processCenter/processCenter");
      if (tarRoute) {
        this.$router.push({
          path: '/portal/card/processCenter/processCenter',
          query: Object.assign({activeMode: activeMode, mode: mode}, item ? {type: item.bizType} : {})
        })
      } else {
        this.$message.warning(this.$t('card.complTrans.noAccessOfPrcCenter'))
      }
    },
    remoteData(params) {
      this.$refs.refTable.remoteData(params);
    },
    // 切换搜索维度
    changeSearchDim() {
      // 处理字典
      const dim = this.searchDimOpts.find(item => item.value == this.searchFormData.searchDim);
      if (dim && dim.dataCode) {
        // 字典注册是异步的，
        this.$lookup.bind(dim.dataCode, () => {
          this.$set(this, "curtSearchDimSubOpts", this.defaultDimOpts.concat(lookup.lookupMgr[dim.dataCode]));
          // 切换后默认展示all
          this.searchFormData.searchDimValue = '_ALL';
        })
      } else {
        this.$set(this, "curtSearchDimSubOpts", this.defaultDimOpts);
        this.searchFormData.searchDimValue = '_ALL';
      }
    },
    // 搜索
    searchChangeHandler() {
      this.$emit('search-change', this.searchFormData, (params) => {
        Object.assign(params, this.sortObj || {});
        // 处理空值，v-model.trim不起作用，这里手动trim
        Object.keys(params).forEach(k => {
          if (params[k] == null || (typeof params[k] == 'string' && params[k].replace(/\s+/g, '') == "")) {
            delete params[k]
          }
        })
        this.$refs.refTable.remoteData(params);
      }, this.sortObj)
    },
    // 触发排序，使用单列排序模式，排序和搜索叠加
    sortChange(sort) {
      this.sortObj = sort != null ? {sort: sort.prop + " " + sort.sort} : null;
      this.searchChangeHandler()
    }
  },
};
</script>

<style lang="scss" scoped>
/*卡片总高度*/
$cardHeight: 320px;
/*header高度*/
$cardHeaderHeight: 48px;
/*下边的padding*/
$cardPaddingBottom: 16px;

$cardBodyHeight: $cardHeight - $cardHeaderHeight - $cardPaddingBottom;

.top-center {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;

  .tab-title {
    flex: none;

    &-left {
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }

    &-right {
      .mode {
        box-sizing: border-box;
        display: inline-block;
        margin-left: 16px;
        line-height: 30px;
        font-size: 14px;
        cursor: pointer;
        background: none;

        &:first-of-type {
          margin-left: 0;
        }

        &:not(.active) {
          color: #666666;
        }

        // 颜色跟随主题，用['c1','bc1','bdc1']控制
        &.active {
          border-bottom-width: 1px;
          border-bottom-style: solid;
        }
      }

    }
  }

  .search {
    margin-left: 24px;

    .search-item {
      margin-left: 10px;

      &:first-of-type {
        margin-left: 0;
      }
    }

    .search-input {
      width: 240px
    }

    .search-select {
      width: 128px
    }
  }
}

.cb-table-chart-wrap {
  display: flex;
  width: 100%;
  position: relative;
  padding: 0;
  flex-flow: row nowrap;
  justify-content: space-between;
  /* 内容高度=卡片总高度，减去header高度，减去最下边的padding */
  height: $cardBodyHeight;

  .cb-table-chart-wrap--table {
    flex: none;
    width: 75%;
    position: relative;
    height: 100%;
  }

  .cb-table-chart-wrap--more-info {
    position: absolute;
    left: 0px;
    bottom: 5px;
    padding: 0;
  }

  .cb-table-chart-wrap--chart {
    flex: 1 1 auto;
    padding: 0px 0 0px 14px;
    box-sizing: border-box;
    height: 100%;
  }
}


</style>

