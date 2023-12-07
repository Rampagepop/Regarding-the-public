<template>
  <div>
    <!-- 客户信息 -->
    <div class="search-list" v-if="showPanel('customer')">
      <ul>
        <div class="head">
          <span class="category">{{ $t("nav.customer") }}</span>
          <span class="result">
            <b>{{ $t("nav.total", { total: clientInfors.clientInforNum }) }}</b>
            <i @click="watchAll('customer')">{{ $t("nav.readAll") }}</i>
          </span>
        </div>
        <li
          v-for="(it, idx) in clientInfors.clientInforData"
          :key="idx"
          @click="detailFn('customer', it)"
        >
          <p v-html="keywordLight(it.customerName, keywords)" />
        </li>
      </ul>
    </div>
    <!-- 资讯要闻 -->
    <div class="search-list" v-if="showPanel('news')">
      <ul>
        <div class="head">
          <span class="category">{{ $t("nav.news") }}</span>
          <span class="result">
            <b>{{ $t("nav.total", { total: messages.messageNum }) }}</b>
            <i @click="watchAll('news')">{{ $t("nav.readAll") }}</i>
          </span>
        </div>
        <li
          @click="detailFn('news', it)"
          v-for="(it, idx) in messages.messageData"
          :key="idx"
        >
          <p v-html="keywordLight(it.infTitle, keywords)" />
        </li>
      </ul>
    </div>
    <!-- 查看更多 -->
    <!-- <div class="search-list">
      <div class="line"></div>
      <el-button
        type="text"
        @click="
          selectedListNum = 1;
          closeSomeResult();
        "
      >
        查看全部搜索结果
      </el-button>
    </div> -->
    <!-- <yu-search-more
      ref="moreList"
      :selectedListNum="selectedListNum"
    ></yu-search-more> -->
  </div>
</template>

<script>
import { extend } from "@/utils";
import { keywordLight } from "@/utils/util";
import { getSearchAskList } from "@/api/portal/backstageAdmin.js";
import { MAX_SEARCH_RESULT_COUNT } from "@/config/constant/app.data.common";
import { debounce } from "throttle-debounce";
export default {
  name: "YuSearchResult",
  props: {
    keywords: {
      type: String,
      default: "",
    },
    tab: {
      // 默认展示tab
      type: String,
      default: "all",
    },
  },
  data() {
    return {
      // 客户信息
      clientInfors: {
        clientInforNum: 0,
        clientInforData: []
      },
      // 消息数据
      messages: {
        messageNum: 0,
        messageData: [],
      },
      selectedListNum: 1,
      // 用于保存父组件中输入的关键字
      getkeywords: "",
      debounce: 300,
    };
  },
  watch: {
    keywords(val) {
      if (val) {
        this.getKeywordsResult(this.tab);
      }
    },
  },
  mounted() {
    this.debouncedGetCustomerList = debounce(
      this.debounce,
      this.getCustomerList
    );
    this.debouncedGetAskList = debounce(this.debounce, this.getAskList);
  },
  methods: {
    // 是否显示当前panel
    showPanel(type) {
      return this.tab === "all" || this.tab === type;
    },
    // 根据关键词查询结果, 根据不同类型调用对应接口
    getKeywordsResult(type) {
      switch (type) {
        case "customer":
          this.debouncedGetCustomerList();
          break;
        case "news":
          this.debouncedGetAskList();
          break;
        default:
          this.debouncedGetCustomerList();
          this.debouncedGetAskList();
          break;
      }
    },
    // 获取客户数据
    getCustomerList(params) {
      this.$request({
        url: `${this.$backend.mockService}/customer/list`,
        params: extend(
          {
            keyWord: this.keywords,
          },
          params || {}
        ),
      }).then((res) => {
        this.clientInfors = {
          clientInforNum: res.total,
          clientInforData: res.data.splice(0, MAX_SEARCH_RESULT_COUNT),
        };
      });
    },
    // 获取资讯数据
    getAskList(params) {
      getSearchAskList(
        extend(
          {
            keyWord: this.keywords,
            searchType: 2
          },
          params || {}
        )
      ).then((res) => {
        this.messages = {
          messageNum: res.data.infosNum,
          messageData: res.data.infoEntities ? res.data.infoEntities.splice(0, MAX_SEARCH_RESULT_COUNT) : [],
        };
      });
    },
    closeSomeResult() {
      this.$refs.moreList.open(this.keywords);
      // 置空父元素搜索关键字
      this.$parent.keywords = "";
    },
    // 引入的高亮函数
    keywordLight(val, keyword) {
      return keywordLight(val, keyword)
    },
    // 客户详情页跳转
    toClientMessage(id) {
      this.$router.push("/clientMessage/" + id);
      this.$parent.keywords = "";
    },
    // 拖拽卡片页跳转
    toCardDragable(id) {
      this.getkeywords = this.keywords;
      this.$router.push({
        name: "dragable",
        params: { id: id, search: this.getkeywords },
      });
      this.$parent.keywords = "";
    },
    // 消息详情页跳转
    toMessageCenter(id) {
      this.$router.push("/dashboard/askcenter/" + id);
      this.$parent.keywords = "";
    },
    // 查看全部，由父级页面弹窗展示
    watchAll(type) {
      this.$emit("show-more", type);
    },
    // 发射事件，查看具体详情,由父级页面弹窗展示
    detailFn(type, row) {
      this.$emit("show-detail", type, row);
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  // #todo 全局字体样式
  font-size: 13px;
  color: #000000;
}
.result-box {
  position: relative;
  padding: 16px 15px 0;

  .el-header {
    height: 44px !important;
    padding: 0;
    .result-title {
      display: inline-block;
      position: absolute;
      margin-top: 16px;
      height: 18px;
      line-height: 18px;
      opacity: 0.8;
    }
  }

  .el-main {
    padding: 0;
    .flex-box {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    .client-box {
      .client-content {
        width: 100%;
        height: 32px;
        line-height: 32px;
        cursor: pointer;
        .title {
          font-weight: 400;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .card-box {
      > :nth-child(2) {
        margin-left: 16px;
      }
      .card-content {
        cursor: pointer;
        .card-img {
          position: relative;
          width: 116px;
          height: 90px;
          background: #f8f8fa;
          border-radius: 4px;
          .islike {
            width: 27px;
            height: 27px;
            position: absolute;
            right: 0;
            top: 0;
            .svg-icon {
              position: absolute;
              left: 0;
              top: 0;
              width: 27px;
              height: 27px;
            }
          }
          .svg-icon {
            position: absolute;
            width: 81px;
            height: 49px;
            top: 21px;
            left: 18px;
          }
        }
        .card-name {
          margin-top: 4px;
          width: 116px;
          height: 16px;
          text-align: center;
          opacity: 0.6;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .invitation-box {
      .invitation-contents {
        width: 278px;
        height: 32px;
        line-height: 32px;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        .dot {
          width: 11px;
        }
        .invitation-content {
          width: 264px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .message-box {
      .message-contents {
        margin-left: 14px;
        width: 266px;
        height: 66px;
        cursor: pointer;
        .message-content {
          .title {
            height: 20px;
            margin-top: 15px;
            color: #222222;
            line-height: 20px;
            font-weight: 400;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .time {
            height: 16px;
            opacity: 0.2;
            font-size: 12px;
            line-height: 16px;
            font-weight: 400;
          }
        }
      }
    }
    .more-content {
      width: 100%;
      height: 32px;
      line-height: 30px;
      .el-link {
        font-size: 13px;
        color: #447aff;
        .el-link--inner {
          font-size: 13px;
          .num {
            color: #447aff;
          }
          .svg-place {
            display: inline-block;
            position: absolute;
            left: 80px;
          }
        }
      }
    }
  }
  .line {
    width: 310px;
    height: 1px;
    opacity: 0.1;
    background: #1a1f36;
    position: relative;
    left: -15px;
  }
  .el-button {
    width: 100%;
    height: 56px;
    border: 0;
    opacity: 0.7;
    font-size: 15px;
    color: #1956ed;
  }
}
</style>
