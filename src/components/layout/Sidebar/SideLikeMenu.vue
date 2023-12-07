<template>
  <div class="el-dialog__wrapper menu-drawer">
    <div class="el-drawer__container">
      <div class="el-drawer ltr">
        <section class="el-drawer__body">
          <div class="search-input">
            <el-input
              class="i-keyword"
              v-model="keyword"
              placeholder="输入关键字搜索菜单"
              clearable
              @keyup.enter.native="searchFn(keyword)"
            >
              <i
                slot="suffix"
                class="el-icon-search"
                @click="searchFn(keyword)"
              ></i>
            </el-input>
            <ul class="search-autocomplete" v-show="showResult">
              <template v-if="searchResult.length > 0">
                <li
                  @click="clickItem(item)"
                  v-for="(item, idx) in searchResult"
                  :key="idx"
                >
                  {{ item.value }}
                </li>
              </template>
              <div class="no-result" v-else>{{ $t("menu.noResult") }}</div>
            </ul>
            <template v-if="wordList.length > 0">
              <div class="search-container">
                <p>
                  {{ $t("menu.recentSearch") }}
                  <i
                    v-if="wordList.length > 0"
                    @click="cleanFn"
                    title="yu-icon-delete2"
                    class="keyword-del yu-icon-delete2"
                  />
                </p>
              </div>
              <div class="b-keyword">
                <el-tooltip
                  placement="top-start"
                  :disabled="item.length < 5"
                  :content="item"
                  v-for="(item, idx) in wordList"
                  :key="idx"
                >
                  <el-button @click="clickButtonFn(item)">{{ item }}</el-button>
                </el-tooltip>
              </div>
            </template>
          </div>
          <div
            :class="[
              wordList.length === 0
                ? 'menu-container menu-scroll-l'
                : 'menu-container menu-scroll-s',
            ]"
            v-if="resultData.length > 0"
          >
            <el-col :span="6" v-for="(item, idx) in resultData" :key="idx">
              <!-- 二级菜单-start -->
              <div
                :class="{
                  'sec-menu-item': true,
                  'is-active': isActive2(item),
                }"
                v-if="!item.children || item.children.length === 0"
              >
                <span
                  v-html="menuTitle2(idx, item)"
                  @click="linkFn(item)"
                ></span>
                <div class="bline"></div>
              </div>
            </el-col>
          </div>
          <div class="empty-data" v-else>
            <p>{{ $t("menu.noData") }}</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { generateRoutes } from "@/utils/oauth";
import { sessionStore, localStore } from "@/utils";
import {
  MENU_STOREOG_KEY,
  MICO_KYCR_SEARCH_KEYWORDS,
} from "@/config/constant/app.data.common";
import { countMenuClick } from "@/api/common/oauth";
// import md5 from 'js-md5'
export default {
  name: "SideLikeMenu",
  props: {
    sideDrawerData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      keyword: "",
      arrowDown: {},
      wordList: [],
      searchResult: [],
      resultData: [],
      showResult: false,
      likeMenuList: [],
      /* eslint vue/no-reserved-keys:0 */
      __LIKE_PATH__: "__LIKE_PATH__", // 记录查询关键字key值
    };
  },
  computed: {
    ...mapGetters(["currentMenuItem", "userCode"]),
  },
  watch: {
    sideDrawerData: {
      handler(val) {
        if (val) {
          this.showResult = false; // 当菜单切换时，关闭联想提示
          this.keyword = ""; // 当菜单切换时，清空查询关键字
          this.resultData = val.concat();
          const wordList = localStore.get(MICO_KYCR_SEARCH_KEYWORDS);
          if (wordList && wordList[this.userCode]) {
            this.wordList = wordList[this.userCode][this.__LIKE_PATH__] || [];
          }
        }
      },
      immediate: true,
      deep: true,
    },
    keyword(val) {
      if (val) {
        // 否则往下执行
        this.showResult = true;
        this.searchResult = [];
        // fixed: 菜单搜索能搜索出其他一级菜单下的结果，但不能操作问题
        this.getKeywordsMenu(this.resultData, this.keyword);
      } else {
        this.showResult = false;
        this.resultData = this.sideDrawerData.concat();
      }
    },
  },
  mounted() {
    // 添加鼠标点击菜单范围
    document.addEventListener("click", this.handleClickFn);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickFn);
  },
  methods: {
    // 二级菜单是否选中
    isActive2(item) {
      return (
        (item.name && item.name === this.currentMenuItem.name) || item.isSearch
      );
    },
    menuTitle2(idx, item) {
      return (idx + 1 < 10 ? "0" + (idx + 1) + " " : idx) + item.menuName;
    },
    /**
     * @description 从当前展示菜单中递归搜索关键词
     * @param {Array<Object>} menus 当前菜单
     * @param {String} keyword 关键词
     */
    getKeywordsMenu(menus = [], keyword) {
      if (keyword) {
        menus.forEach((item) => {
          if (item.menuName.indexOf(this.keyword) > -1) {
            this.searchResult.push({
              value: this.clearHighLight(item.menuName),
            });
          }
        });
      }
    },
    /**
     * @description 清除高亮字符串
     * @param {String} str 待清除字符串
     */
    clearHighLight(str = "") {
      return str.replace('<font color="#447AFF">', "").replace("</font>", "");
    },
    handleClickFn(e) {
      const iKeyword = document.querySelector(".i-keyword");
      const bKeyword = document.querySelector(".b-keyword");
      if (iKeyword && bKeyword) {
        if (!iKeyword.contains(e.target) && !bKeyword.contains(e.target)) {
          this.searchResult = [];
          this.showResult = false;
        }
      }
    },
    clickArrowFn(obj, key, idx, ii) {
      if (ii || ii === 0) {
        this.$set(obj[ii], "show", !obj[ii]["show"]);
        this.arrowDown[idx + "-" + key + "-" + ii] =
          !this.arrowDown[idx + "-" + key + "-" + ii];
      } else {
        this.$set(obj[key], "show", !obj[key]["show"]);
        this.arrowDown[idx + "-" + key] = !this.arrowDown[idx + "-" + key];
      }
    },
    linkFn(item) {
      // 菜单点击记录统计
      // 记录菜单点击，为常用菜单准备数据
      countMenuClick({
        menuId: item.id,
      });
      // this.$router.push(item.meta.routeUrl);
      this.$router.push(`/${item.funcUrl}`);
      this.closeFn();
    },
    closeFn() {
      this.$emit("closeDrawer");
    },
    clickItem(item) {
      this.keyword = item.value;
      this.searchFn(item.value);
    },
    searchFn(keyword) {
      if (!keyword) {
        return this.$message.warning(this.$t("menu.placeHolder"));
      }
      const menus = sessionStore.get(MENU_STOREOG_KEY);
      const originalMenus = [];
      let flag = false;
      menus.forEach((item) => {
        const myitem = Object.assign({}, item);
        if (myitem.menuName.indexOf(keyword) > -1) {
          myitem.menuName = myitem.menuName.replace(
            keyword,
            '<font color="#447AFF">' + keyword + "</font>"
          );
          flag = true;
        }
        if (flag) {
          // 添加到最近搜索里
          this.addSearchListFn();
        }
        myitem.show = true;
        originalMenus.push(myitem);
      });
      const routes = generateRoutes(originalMenus);
      routes.forEach((item) => {
        if (item.path === this.sideDrawerData.path) {
          this.resultData = item.children.concat();
        }
      });
    },
    setChildFn(ele, array) {
      array.forEach((item) => {
        if (item.path === ele.menuId) {
          item.isSearch = true;
        }
        this.setChildFn(ele, item.children);
      });
    },
    // 寻找顶级菜单(在这里顶级是二级菜单)
    getUpMenu(ele, array = []) {
      let result;
      for (let i = 0; i < this.sideDrawerData.children.length; i++) {
        if (ele.menuId === this.sideDrawerData.children[i].name) {
          return ele;
        }
      }
      for (let i = 0; i < array.length; i++) {
        if (array[i].upMenuId !== "0") {
          if (array[i].menuId === ele.upMenuId) {
            result = this.getUpMenu(array[i], array);
            if (result) {
              return result;
            }
          }
        }
      }
    },
    addSearchListFn() {
      // 添加到最近搜索里
      if (this.wordList.indexOf(this.keyword) === -1) {
        this.wordList.unshift(this.keyword);
        if (this.wordList.length > 5) {
          this.wordList.pop();
        }
        const wordList = localStore.get(MICO_KYCR_SEARCH_KEYWORDS) || {};
        if (!wordList[this.userCode]) {
          wordList[this.userCode] = {};
        }
        wordList[this.userCode][this.__LIKE_PATH__] = this.wordList;
        localStore.set(MICO_KYCR_SEARCH_KEYWORDS, wordList);
      }
    },
    cleanFn() {
      this.wordList = [];
      const wordList = localStore.get(MICO_KYCR_SEARCH_KEYWORDS) || {};
      if (!wordList[this.userCode]) {
        wordList[this.userCode] = {};
      }
      delete wordList[this.userCode][this.__LIKE_PATH__];
      localStore.set(MICO_KYCR_SEARCH_KEYWORDS, wordList);
      this.keyword = ''
    },
    clickButtonFn(item) {
      if (item === this.keyword) {
        return;
      }
      this.searchResult = [];
      this.keyword = item;
      this.searchFn(this.keyword);
    },
  },
};
</script>
<style lang="scss" scoped>
.menu-drawer {
  left: 200px;
  top: 0 !important;
  z-index: 2001;
  width: calc(100% - 200px);
  background: #fff;
  .el-drawer {
    .el-drawer__body {
      overflow: auto;
      .search-autocomplete {
        position: absolute;
        width: calc(100% - 40px) !important;
        box-shadow: 0 6px 14px 0 #dfe0ef;
        max-height: 180px;
        z-index: 1000;
        background: #fff;
        overflow: auto;
        .no-result {
          height: 50px;
          text-align: center;
          line-height: 50px;
        }
        li {
          line-height: normal;
          padding: 7px;
        }
        li:hover {
          cursor: pointer;
          background: #fbfbfb;
        }
        .active {
          background: #fbfbfb;
        }
      }
      .empty-data {
        margin: 0 auto;
        width: 71px;
        text-align: center;
        margin-top: 50%;
        p {
          line-height: 30px;
        }
      }
    }
    .el-button.el-button--default {
      font-size: 13px;
      width: 118px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .search-container {
      margin: 20px 0;
      font-size: 14px;
      .clean-svg {
        float: right;
        margin-top: -18px;
        cursor: pointer;
      }
      & + div {
        display: flex;
      }
    }
    .el-icon-search {
      font-size: 16px;
      line-height: 36px;
      cursor: pointer;
    }
    .menu-container {
      margin-top: 20px;
      height: 400px;
      overflow-x: hidden;
      // box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
      .el-col-8 {
        padding: 0 20px;
      }
      .el-col-8:nth-child(3n + 1) {
        clear: both;
      }
      .el-col-6 {
        padding: 0 20px;
      }
      .el-col-6:nth-child(4n + 1) {
        clear: both;
      }
    }
  }
}
.sec-menu-item {
  line-height: 32px;
  padding-top: 10px;
  padding-right: 10px;
  white-space: nowrap;
  font-size: 16px;
  color: #447aff;
  font-weight: 600;
  cursor: pointer;
  .bline {
    width: 150px;
    // margin-left: 20px;
    margin-top: 8px;
    border-bottom: 0.006rem solid #d8d9de;
  }
  &.is-item-hover {
    padding-left: 20px;
    .bline {
      margin-left: 0px;
    }
  }
  .thr-menu-item {
    box-sizing: border-box;
    margin-top: 8px;
    padding-left: 18px;
    color: #000000;
    font-size: 14px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    & > .arrow-item {
      margin-left: -18px;
    }
    & > .for-menu-item.is-item-hover {
      height: 40px;
      line-height: 40px;
      transition: background-color 0.3s;
      &:hover {
        background-color: rgba(248, 250, 251, 0.5) !important;
      }
    }
    & > .for-menu-item > .arrow-item,
    & > .for-menu-item > .five-menu-item.is-item-hover {
      height: 40px;
      line-height: 40px;
      width: calc(100% + 0.104167rem) !important;
      &:hover {
        color: #447aff;
        background-color: rgba(248, 250, 251, 0.5) !important;
      }
    }
    .item-circle:before {
      background: #777777;
      width: 4px;
      height: 4px;
    }
    .icon-arrow-down,
    .icon-arrow--up {
      width: 10px;
      height: 10px;
      cursor: pointer;
      margin: 0.015rem;
    }
    .for-menu-item {
      font-weight: 400;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-left: 15px;
      box-sizing: border-box;
      .arrow-item {
        padding-left: 20px;
        margin-left: -18px;
      }
      &.is-item-hover {
        padding-left: 20px;
        box-sizing: border-box;
        & > .item-circle {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .item-circle:before {
        // background: rgba(50, 50, 50, 0.5);
        width: 3px;
        height: 3px;
      }
      .five-menu-item {
        margin-top: 2px;
        color: rgba(50, 50, 50, 0.6);
        overflow: hidden;
        text-overflow: ellipsis;
        &.is-item-hover {
          width: 100%;
          padding-left: 0.21rem;
          margin-left: -20px;
          box-sizing: border-box;
        }
        & > .item-circle {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .arrow-width {
        width: 0.05rem;
        margin-right: 5px;
      }
      &:last-child {
        border-radius: 0 0 0.02rem 0.02rem;
      }
    }
  }
}

.arrow-item {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  svg,
  span {
    cursor: pointer;
  }
  & > span {
    width: calc(100% - 10px) !important;
    display: contents;
  }
  &:hover {
    color: #447aff !important;
  }
}
.margin-span {
  margin-left: 20px;
}
.margin-label {
  // margin-left: 2px;
  cursor: pointer;
}
.is-item-hover span:hover,
.is-active {
  cursor: pointer;
  color: #447aff !important;
}
.el-drawer.ltr {
  box-sizing: border-box;
  width: 100%;
  padding: 0 12px;
  animation: none !important;
}
.el-drawer__body {
  padding: 0 !important;
  overflow: hidden !important;
  .search-input {
    display: block !important;
    width: calc(100% - 40px) !important;
    margin: 30px 20px 0 20px !important;
    ::v-deep .el-input {
      font-size: 14px !important;
      max-width: 62%;
      width: 280px;
      .el-icon-search {
        cursor: pointer;
      }
    }
    & > .i-keyword {
      width: 63%;
    }
  }
}
.el-drawer__container ::-webkit-scrollbar {
  display: block;
}
</style>
