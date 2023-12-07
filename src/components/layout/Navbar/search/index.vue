<template>
  <div class="search-tab-container">
    <yu-tabs :value="curType" @tab-click="handleTabClick">
      <yu-tab-pane
        v-for="p in searchPanes"
        :key="p"
        :label="searchTitle[p]"
        :name="p"
      >
      </yu-tab-pane>
    </yu-tabs>
    <!-- 内容区域 -->
    <div>
      <el-input
        suffix-icon="yu-icon-search1"
        :placeholder="$t('nav.gjcLabel')"
        @suffix-click="searchContent"
        v-model.trim="keyword"
        clearable
        @focus="getFocus"
        @keypress.enter.native="searchContent"
      ></el-input>
      <div class="parimaryKeys" v-if="records.length > 0">
        <span
          class="record"
          v-for="(re, i) in historyWords"
          :key="i"
          @click="checkRecord(re.keywords)"
        >
          {{ re.keywords }}
        </span>
      </div>
      <div class="search-no-data" v-show="!keyword">
        <empty-msg></empty-msg>
      </div>
      <div class="searchNotice" v-show="keyword">
        <span v-html="$t('nav.search', { keyword: `<b>${keyword}</b>` })">
        </span>
      </div>
      <!-- 结果预显示 -->
      <yu-search-result
        ref="refSearchResult"
        v-if="keyword"
        :tab="curType"
        :keywords="keyword"
        @show-more="showMoreFn"
        @show-detail="showDetailFn"
      ></yu-search-result>
    </div>
    <yu-xdialog
      :title="resultDialogTitle"
      :visible.sync="dialogTableVisible"
      width="70%"
    >
      <yu-xform
        v-model="formdata"
        form-type="search"
        related-table-name="yuxtable"
      >
        <yu-xform-group :column="2">
          <yu-xform-item
            :label="$t('nav.gjcLabel')"
            ctype="input"
            name="keyWord"
            :placeholder="$t('nav.gjcPlaceholder')"
          ></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <yu-xtable
        v-if="type === 'news'"
        :data-url="$backend.mockService + '/api/xmhinformation/userinformationpage'"
        row-number
        ref="yuxtable"
      >
        <yu-table-column property="infTitle" :label="$t('nav.bt')" width="250">
          <template slot-scope="scope">
            <a class="underline" @click="detailFn(scope.row)">{{
              scope.row.infTitle
            }}</a>
          </template>
        </yu-table-column>
        <yu-table-column property="infType" :label="$t('nav.lx')">
          <template slot-scope="scope">
            <span>{{ scope.row.infType | infTypeFilter }}</span>
          </template>
        </yu-table-column>
        <yu-table-column
          property="releaseDate"
          :label="$t('nav.sxsj')"
        ></yu-table-column>
      </yu-xtable>
      <yu-xtable
        v-if="type === 'customer'"
        :data-url="$backend.mockService + '/customer/list'"
        row-number
        ref="yuxtable"
      >
        <yu-table-column
          property="customerName"
          :label="$t('nav.khmc')"
          width="250"
        >
          <template slot-scope="scope">
            <a class="underline" @click="detailFn(scope.row)">{{
              scope.row.customerName
            }}</a>
          </template>
        </yu-table-column>
        <yu-table-column
          property="customerType"
          data-code="CUSTOMER_TYPE"
          :label="$t('nav.khlx')"
        ></yu-table-column>
        <yu-table-column
          property="certType"
          :label="$t('nav.zjlx')"
          data-code="CERT_TYPE"
        ></yu-table-column>
        <yu-table-column
          property="certNo"
          :label="$t('nav.zjhm')"
        ></yu-table-column>
      </yu-xtable>
    </yu-xdialog>
    <yu-xdialog
      :visible.sync="askDialogVisible"
      :title="$t('dashboard.askdetailtitle')"
      width="75%"
      height="75%"
    >
      <askCenterDetail :ask-id="askID" />
    </yu-xdialog>
  </div>
</template>

<script>
import YuSearchResult from "@/components/layout/Navbar/search/searchResult.vue";
import askCenterDetail from "@/views/common/dashboard/AskCenter/askCenterDetail.vue";
import EmptyMsg from "@/components/layout/emptyMsg/index.vue"
import {
  SEARCH_KEYWORDS,
  MAX_SEARCH_KEYWORDS_COUNT,
} from "@/config/constant/app.data.common";
import { clone, localStore } from "@/utils";
import frameConfig from "@/config/frame";
const bfOpts = frameConfig.baseFrameOptions; // frame中基础配置项
export default {
  name: "YuSearch",
  components: {
    YuSearchResult,
    askCenterDetail,
    EmptyMsg
  },
  filters: {
    infTypeFilter: function (value) {
      var map = { 1: "公告", 2: "资讯" };
      return map[value];
    },
  },
  data() {
    return {
      keyword: "", // 输入内容
      isFocus: false, // 输入框获取焦点  用于历史记录的展开
      records: [], // 历史记录内容
      dialogTableVisible: false,
      resultDialogTitle: this.getResultAllDialogTitle(), // 查看全部弹窗标题
      someResult: false,
      curType: "all",
      searchPanes: Object.keys(bfOpts.searchTitle),
      searchTitle: bfOpts.searchTitle,
      dataUrl: "/api/xmhsearch/query",
      customerData: [],
      customerDataTotal: 0,
      customerDataUrl: "/customer/query",
      allDataUrl: "/customer/query",
      type: "customer",
      key: 0,
      formdata: {},
      newsData: [],
      newsDataTotal: 0,
      newsDetails: "",
      askDialogVisible: false, // 是否显示资讯详情
      askID: "", // 资讯ID
    };
  },
  computed: {
    historyWords() {
      return this.records.slice(0, MAX_SEARCH_KEYWORDS_COUNT);
    },
  },
  mounted() {
    this.getHistoryRecords();
  },
  methods: {
    getResultAllDialogTitle(type) {
      return this.$t("nav.resultDialogTitle", {
        type: this.$t("nav." + type || this.curType),
      });
    },
    showMoreFn(type) {
      this.type = type;
      this.resultDialogTitle = this.getResultAllDialogTitle(type);
      this.dialogTableVisible = true;
    },
    handleTabClick(tab) {
      this.curType = tab.name;
      // 执行查询操作
      this.checkRecord(this.keyword)
    },
    //请求历史记录数据
    getHistoryRecords() {
      this.records = localStore.get(SEARCH_KEYWORDS) || [];
    },
    // 删除历史记录
    deleteHistoryRecords() {
      this.records = [];
      localStore.remove(SEARCH_KEYWORDS);
    },
    // 添加历史记录
    addHistoryRecords(params) {
      let keywords = localStore.get(SEARCH_KEYWORDS) || [];
      // 倒叙插入数组，并只保留前10关键词
      keywords.unshift(params);
      const removeDuplicateObj = (arr) => {
        const obj = {};
        arr = arr.reduce((newArr, next) => {
          obj[next.keywords]
            ? ""
            : (obj[next.keywords] = true && newArr.push(next));
          return newArr;
        }, []);
        return arr;
      };
      // 查询关键词去重
      keywords = removeDuplicateObj(keywords);
      localStore.set(
        SEARCH_KEYWORDS,
        keywords.splice(0, MAX_SEARCH_KEYWORDS_COUNT)
      );
    },
    // 输入框获取焦点事件
    getFocus: function () {
      this.getHistoryRecords();
      this.someResult = true;
      this.isFocus = true;
    },

    // 清空历史记录
    historyClean: function () {
      this.records = [];
      this.deleteHistoryRecords();
    },
    // 点击搜索图标和回车搜索
    searchContent: function () {
      if (this.keyword) {
        this.addHistoryRecords({ keywords: this.keyword });
        this.getHistoryRecords();
      }
    },

    detailFn(row) {
      this.showDetailFn(this.type, row);
    },
    showDetailFn(type, row) {
      switch (type) {
        case "customer":
          this.$message(`查看客户 "${row.customerName}" 详情，功能开发中，敬请期待。`);
          break;
        case "news":
          // 弹窗展示资讯详情
          this.askDialogVisible = true;
          this.askID = row.id;
          break;
        default:
          this.$message(`功能开发中 ${JSON.stringify(row)}~~~`);
          break;
      }
    },
    // 点击历史记录内容添加到输入框中
    checkRecord: function (keyword) {
      this.keyword = keyword;
      this.$nextTick(() => {
        // 立即查询数据
        this.$refs['refSearchResult'] && this.$refs['refSearchResult'].getKeywordsResult(this.curType);
      });
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.search-tab-container {
  /*height: 100%;*/
}
.search-tab-container .empty-msg {
  width: 100%;
  padding: 0;
}
.search-bar {
  width: 368px;
  height: 64px;
}

.search-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-left: 22px;
  margin-top: 29px;
}
.search-icon .svg-icon {
  width: 20px;
  height: 20px;
  margin: 2px;
}

.search-input {
  position: absolute;
  width: 176px;
  height: 20px;
  line-height: 20px;
  margin-top: 31px;
  margin-left: 11px;
  border: 0;
  outline: 0;
  background-color: rgba(255, 255, 255, 0.3);
  font-size: 16px;
  color: #222222;
  letter-spacing: 0;
}

.search-no-data {
  position: absolute;
  top: calc(50% + 64px);
  left: 50%;
  transform: translate(-50%, -50%);
}

.history {
  position: absolute;
  top: 88px;
  width: 312px;
  max-height: 186px;
  z-index: 999;
  background: #ffffff;
  border: 1px solid #ffffff;
  box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0 0 8px 8px;
  border-radius: 0px 0px 8px 8px;
  font-size: 13px;
  color: #000000;
  padding: 16px;
}
.history-name {
  position: relative;
  margin-top: 8px;
  height: 18px;
  line-height: 18px;
}
.history-name .name {
  width: 52px;
  height: 18px;
  opacity: 0.8;
}
.history-name .history-icon {
  position: absolute;
  width: 16px;
  height: 16px;
  right: 4px;
  top: 2px;
  border: 0;
  outline: 0;
  background-color: #fff;
}
.history-name .history-icon .svg-icon {
  margin-left: 1px;
  margin-top: 1px;
  width: 13px;
  height: 13px;
}
.history .record-box {
  width: 280px;
  max-height: 112px;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.history .record-box .record {
  width: 136px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(60, 67, 88, 0.2);
  border-radius: 4px;
  line-height: 32px;
  margin-top: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
}
.history .record-box .record:hover {
  border-color: #447aff;
  color: #447aff;
}
.history .record-box .record-name {
  display: inline-block;
  width: 70px;
  height: 100%;
  line-height: 30px;
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.empty-history {
  position: absolute;
  top: 88px;
  width: 312px;
  height: 210px;
  z-index: 999;
  background: #ffffff;
  border: 1px solid #ffffff;
  box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0 0 8px 8px;
  border-radius: 0px 0px 8px 8px;
  font-size: 13px;
  color: #000000;
  padding: 16px;
}
.empty-history .empty-record {
  margin-left: 77px;
  margin-top: 53px;
}
.empty-history .empty-record .empty {
  opacity: 0.3;
  font-size: 14px;
  color: #3f4454;
}

.some-result {
  position: absolute;
  width: 312px;
  /* height: 784px; */
  top: 88px;
  z-index: 999;
  background: #ffffff;
  border: 1px solid #ffffff;
  box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0 0 8px 8px;
}
</style>
<style>
.search-tab-container > .el-tabs > .el-tabs__content {
  height: 100%;
}
</style>
