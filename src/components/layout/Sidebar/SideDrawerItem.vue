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
            <template v-if="wordList.length > 0">
              <div class="search-container">
                <div class="b-keyword">
                  <el-tooltip
                    placement="top-start"
                    :content="item"
                    v-for="(item, idx) in wordList"
                    :disabled="item && item.length < 8"
                    :key="idx"
                  >
                    <yu-button type="info" class="key-word-btn" @click="clickButtonFn(item)">{{ item }}</yu-button>
                  </el-tooltip>
                </div>
                <i
                  v-if="wordList.length > 0"
                  @click="cleanFn"
                  title="yu-icon-delete2"
                  class="keyword-del yu-icon-delete2"
                />
              </div>
            </template>
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
          </div>
          <div
            :class="[
              wordList.length === 0
                ? 'menu-container menu-scroll-l'
                : 'menu-container menu-scroll-s',
              {
                'sec-menu-item-liked-wrap': isLikedSide
              }
            ]"
            v-if="resultData.length > 0"
          >
            <el-col :span="4" v-for="(item, idx) in resultData" :key="idx">
              <!-- 二级菜单-start -->
              <div
                :class="{
                  'sec-menu-item': true,
                  'sec-menu-item-no-child': true,
                  'sec-menu-item-liked': isLikedSide,
                  'is-active': isActive2(item),
                }"
                v-if="!item.children || item.children.length === 0"
              >
                <span
                  v-html="menuTitle2(item)"
                  @click="linkFn(item)"
                ></span>
                <span class="icon-start-wrap" @click.stop="likeClickFn(item, isLike(item))">
                  <svg-icon v-if="isLike(item)" class="icon-start" alt="取消收藏" title="取消收藏" icon-class="menu-star-full" />
                  <svg-icon v-else class="icon-start icon-start-empty" alt="收藏" title="收藏" icon-class="menu-star-empty" />
                </span>
              </div>
              <!-- 二级菜单-end -->
              <div
                :class="{ 'sec-menu-item': true, 'is-active': item.isSearch }"
                v-else
              >
                <span
                  class="item-circle"
                  :class="{'cursor-default': !isLikedSide,}"
                  :title="item.meta.title.replace(/<.*?>/g, '')"
                  v-html="item.meta.title"
                ></span>
                <!-- 三级菜单-start -->
                <div
                  :class="{
                    'thr-menu-item': true,
                    'is-item-hover': !ele.children || ele.children.length === 0,
                    'is-active': isActive3(ele),
                  }"
                  v-for="(ele, key) in item.children"
                  :key="key"
                >
                  <span
                    style="cursor: pointer"
                    v-if="!ele.children || ele.children.length === 0"
                    :class="{ 'item-circle': true }"
                  >
                    <label @click="linkFn(ele)" :title="ele.meta.title.replace(/<.*?>/g, '')" v-html="ele.meta.title"></label>
                    <span class="icon-start-wrap" @click.stop="likeClickFn(ele, isLike(ele))">
                      <svg-icon v-if="isLike(ele)" class="icon-start" alt="取消收藏" title="取消收藏" icon-class="menu-star-full" />
                      <svg-icon v-else class="icon-start icon-start-empty" alt="收藏" title="收藏" icon-class="menu-star-empty" />
                    </span>
                  </span>
                  <div
                    v-else
                    :class="{ 'is-active': ele.isSearch, 'cursor-default': !isLikedSide, 'arrow-item': true }"
                    @click.stop="clickArrowFn(item.children, key, idx)"
                  >
                    <i
                      class="icon-arrow-down"
                      :class="arrowDown[idx + '-' + key] ? 'el-icon-arrow-right' : 'el-icon-arrow-down'"
                    ></i>
                    <span
                      :title="ele.meta.title.replace(/<.*?>/g, '')"
                      v-html="ele.meta.title"
                    ></span>
                  </div>
                  <!-- 四级菜单-start -->
                  <template v-if="!ele.show && ele.children">
                    <div
                      :class="{
                        'for-menu-item': true,
                        'is-item-hover':
                          !dom.children || dom.children.length === 0,
                        'is-active': isActive4(dom),
                      }"
                      :title="dom.meta.title.replace(/<.*?>/g, '')"
                      v-for="(dom, ii) in ele.children"
                      :key="ii"
                    >
                      <span
                        v-if="!dom.children || dom.children.length === 0"
                        class="item-circle"
                        @click="linkFn(dom)"
                      >
                        <label v-html="dom.meta.title" class="margin-label"></label>
                        <span class="icon-start-wrap" @click.stop="likeClickFn(dom, isLike(dom))">
                          <svg-icon v-if="isLike(dom)" class="icon-start" alt="取消收藏" title="取消收藏" icon-class="menu-star-full" />
                          <svg-icon v-else class="icon-start icon-start-empty" alt="收藏" title="收藏" icon-class="menu-star-empty" />
                        </span>
                      </span>
                      <div
                        v-else
                        :class="{
                          'is-active': dom.isSearch,
                          'arrow-item': true,
                          'cursor-default': !isLikedSide,
                        }"
                        @click.stop="clickArrowFn(ele.children, key, idx, ii)"
                      >
                        <i
                          class="icon-arrow-down arrow-width"
                          :class="
                            arrowDown[idx + '-' + key + '-' + ii]
                              ? 'el-icon-arrow-right'
                              : 'el-icon-arrow-down'
                          "
                        />
                        <span
                          :title="dom.meta.title.replace(/<.*?>/g, '')"
                          v-html="dom.meta.title"
                        ></span>
                      </div>
                      <!-- 五级菜单-start -->
                      <template v-if="dom.show && dom.children">
                        <div
                          :class="{
                            'five-menu-item': true,
                            'is-item-hover': true,
                            'is-active': isActive5(sto),
                          }"
                          :title="sto.meta.title.replace(/<.*?>/g, '')"
                          v-for="(sto, kk) in dom.children"
                          :key="kk"
                          @click="linkFn(sto)"
                        >
                          <span class="item-circle">
                            <label
                              v-html="sto.meta.title"
                              class="margin-label"
                            ></label>
                          </span>
                        </div>
                      </template>
                      <!-- 五级菜单-end -->
                    </div>
                  </template>
                  <!-- 四级菜单-end -->
                </div>
              </div>
            </el-col>
          </div>
          <div class="empty-data" v-else>
            <!-- <img src="@/assets/common/images/logo/empty.png" /> -->
            <p>{{ $t("menu.noData") }}</p>
          </div>
          <i class="close-icon el-icon-close" @click="closeFn" title="关闭"></i>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { generateRoutes } from "@/utils/oauth";
import { clone, sessionStore, localStore } from "@/utils";

import {
  MENU_STOREOG_KEY,
  MENU_STORE_KEY,
  MICO_KYCR_SEARCH_KEYWORDS,
  MAX_LIKE_MENU_COUNT,
  MENU_LIKE,
} from "@/config/constant/app.data.common";
import {
  countMenuClick,
  likeMenuClick,
  likeMenuList,
} from "@/api/common/oauth";
export default {
  name: "SideDrawerItem",
  props: {
    sideDrawerData: {
      type: [Array, Object],
    },
    allMenu: {
      type: [Array],
    },
    isLikedSide: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      keyword: "",
      arrowDown: {},
      wordList: [],
      searchMenuList: [],
      searchResult: [],
      resultData: [],
      showResult: false,
      likeMenuList: [],
    };
  },
  computed: {
    ...mapGetters(["currentMenuItem", "userCode"]),
    wordPath() {
      return this.isLikedSide ? '__LIKE_PATH__' : this.sideDrawerData.path
    },
    // 判断该菜单是否在收藏菜单中
    isLike() {
      return function (item) {
        if (this.isLikedSide) { // 当前为收藏菜单直接返回
          return true
        }
        if (this.likeMenuList) {
          let isLike = false;
          this.likeMenuList.forEach((menu) => {
            if (item.meta.id === menu.menuId) {
              isLike = true;
            }
          });
          return isLike;
        }
        return false;
      }
    },
  },
  watch: {
    allMenu: {
      handler(val) {
      },
      immediate: true,
      deep: true,
    },
    sideDrawerData: {
      handler(val) {
        if (val) {
          this.showResult = false; // 当菜单切换时，关闭联想提示
          this.keyword = ""; // 当菜单切换时，清空查询关键字
          this.resultData = this.isLikedSide ? val.concat() : val.children.concat();
          this.getSearchMenuList();
          const wordList = localStore.get(MICO_KYCR_SEARCH_KEYWORDS);
          if (wordList && wordList[this.userCode]) {
            this.wordList = wordList[this.userCode][this.wordPath] || [];
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
        this.getKeywordsMenu(this.allMenu, this.keyword);
      } else {
        this.showResult = false;
        this.resultData = this.isLikedSide ? this.sideDrawerData.concat() : this.sideDrawerData.children.concat();
      }
    }
  },
  async mounted() {
    // 添加鼠标点击菜单范围
    document.addEventListener("click", this.handleClickFn);
    // 缓存中获取收藏菜单，不存在就从接口中获取
    const likes = sessionStore.get(MENU_LIKE);
    if (!likes) {
      await this.getLikeMenuList();
    } else {
      this.likeMenuList = likes;
    }
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickFn);
  },
  methods: {
    getCanClickMenu(list = []) {
      const _this = this;
      const menus = [];
      function filterSubMenu(arr = []) {
        arr.forEach(item => {
          // 收藏菜单 || 其他菜单数据
          if (_this.isLikedSide || (item.children && item.children.length === 0)) {
            menus.push(item)
          } else {
            filterSubMenu(item.children)
          }
        })
      }
      filterSubMenu(list)
      return menus
    },
    getSearchMenuList() {
      this.searchMenuList = this.getCanClickMenu(this.resultData);
    },
    getLikeMenuList() {
      likeMenuList().then((res) => {
        sessionStore.set(MENU_LIKE, res.data)
        this.likeMenuList = res.data;
        this.$emit('refreshLikeMenuList')
      });
    },
    // 二级菜单是否选中
    isActive2(item) {
      return (
        (item.name && item.name === this.currentMenuItem.name) || item.isSearch
      );
    },
    // 三级菜单是否选中
    isActive3(ele) {
      return (
        (ele.isSearch && ele.children && ele.children.length === 0) ||
        (ele.name && ele.name === this.currentMenuItem.name)
      );
    },
    // 四级菜单是否选中
    isActive4(dom) {
      return dom.name === this.currentMenuItem.name || dom.isSearch;
    },
    // 五级菜单是否选中
    isActive5(sto) {
      return sto.name === this.currentMenuItem.name || sto.isSearch;
    },
    menuTitle2(item) {
      return this.isLikedSide ? item.menuName : item.meta.title;
    },
    // 收藏按钮点击
    likeClickFn(item, islike = true) {
      // 判断当前菜单是否在搜藏菜单列表中，如果在，则不调用接口
      // 如果不在，且搜藏菜单未超过8个，则调用接口，否则提示错误
      // if (!islike && this.likeMenuList.length >= MAX_LIKE_MENU_COUNT) {
      //   this.$message.warning(`收藏菜单最多只能 ${MAX_LIKE_MENU_COUNT} 个!`);
      //   return;
      // }
      const menuId = this.isLikedSide ? item.menuId : item.meta.id
      likeMenuClick({
        menuId,
        keepStatus: !islike,
      }).then((res) => {
        this.getLikeMenuList();
      });
    },
    /**
     * @description 从当前展示菜单中递归搜索关键词
     * @param {Array<Object>} menus 当前菜单
     * @param {String} keyword 关键词
     */
    getKeywordsMenu(menus = [], keyword) {
      if (keyword) {
        menus = this.getCanClickMenu(menus)
        menus.forEach((item) => {
          if (!this.isLikedSide) {
            if (item.meta.title && item.meta.title.indexOf(this.keyword) > -1) {
              this.searchResult.push({
                value: this.clearHighLight(item.meta.title),
              });
            }
          } else {
            if (item.menuName && item.menuName.indexOf(this.keyword) > -1) {
              this.searchResult.push({
                value: this.clearHighLight(item.menuName),
              });
            }
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
      const menuId = this.isLikedSide ? item.id : item.meta.id;
      const path = this.isLikedSide ? item.funcUrl : item.path;
      countMenuClick({
        menuId,
      });
      this.$router.push(path);
      this.closeFn();
    },
    closeFn() {
      this.$emit("closeDrawer");
    },
    clickItem(item) {
      this.keyword = item.value;
      this.searchFn(item.value, true);
    },
    searchFn(keyword, goPage) {
      if (!keyword) {
        return this.$message.warning(this.$t("menu.placeHolder"));
      }
      const menus = this.allMenu
      //全部菜单拿过来然后递归
      this.forAllgetMenu(menus, keyword, goPage)
    },
    //递归获取到和关键字选中相匹配的数据
    forAllgetMenu(menus, keyword, goPage) {
      const originalMenus = [];
      const filterMenus = [];
      const isLikedSide = this.isLikedSide;
      menus.forEach(item => {
        if(item.children && item.children.length) {
          this.forAllgetMenu(item.children, keyword, goPage) 
          item.children.forEach(temp => {
            let flag = false;
            const myitem = clone(temp, {}, true);
            let ititle = isLikedSide ? myitem.menuName : myitem.meta.title;
            if (ititle && ititle.indexOf(keyword) > -1) {
              ititle = ititle.replace(
                keyword,
                '<font color="#447AFF">' + keyword + "</font>"
              );
              if (isLikedSide) {
                myitem.menuName = ititle
              } else {
                myitem.meta.title = ititle
              }
              flag = true;
            }
            if (flag) {
              filterMenus.push(temp);
            }
            myitem.show = true;
            originalMenus.push(myitem);
            if (filterMenus.length > 0) {
              if(goPage || filterMenus.length === 1) {
                const currentMenu = filterMenus[0]
                const path = isLikedSide ? `/${currentMenu.funcUrl}` : currentMenu.path;
                const title = isLikedSide ? currentMenu.menuName : currentMenu.meta.title
                // 添加到最近搜索里
                this.addSearchListFn(title);
                setTimeout(() => {
                  this.$router.push(path)
                }, 30)
              }
            }
            // if(temp.children && temp.children.length) {
            //   // console.log('进入循环=====')
            //   this.forAllgetMenu(temp.children, keyword, goPage) 
            // }
          })
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
    addSearchListFn(menuName) {
      // 添加到最近搜索里
      if (this.wordList.indexOf(menuName) === -1 && menuName !== '') {
        this.wordList.unshift(menuName);
        if (this.wordList.length > 8) {
          this.wordList.pop();
        }
        const wordList = localStore.get(MICO_KYCR_SEARCH_KEYWORDS) || {};
        if (!wordList[this.userCode]) {
          wordList[this.userCode] = {};
        }
        wordList[this.userCode][this.wordPath] = this.wordList;
        localStore.set(MICO_KYCR_SEARCH_KEYWORDS, wordList);
      }
    },
    cleanFn() {
      this.wordList = [];
      const wordList = localStore.get(MICO_KYCR_SEARCH_KEYWORDS) || {};
      if (!wordList[this.userCode]) {
        wordList[this.userCode] = {};
      }
      delete wordList[this.userCode][this.wordPath];
      localStore.set(MICO_KYCR_SEARCH_KEYWORDS, wordList);
    },
    clickButtonFn(item) {
      // if (item === this.keyword) {
      //   return;
      // }
      // this.searchResult = [];
      // this.keyword = item;
      this.searchFn(item, true);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
.cursor-default {
  cursor: default;
}

.menu-drawer {
  left: 200px;
  top: 0 !important;
  z-index: 2001;
  width: calc(100% - 200px);
  background: #fff;
  border-left: 1px solid #E0E0E0;
  .el-drawer {
    .el-drawer__body {
      position: relative;
      overflow: auto;
      .search-autocomplete {
        position: absolute;
        width: calc(100% - 40px) !important;
        box-shadow: 0 6px 14px 0 #dfe0ef;
        max-height: 180px;
        font-size: 12px;
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
      .close-icon {
        position: absolute;
        top: 30px;
        right: 24px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        cursor: pointer;
        font-size: 17px;
        color: #999999;
      }
    }
    .el-button.el-button--default {
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .search-container {
      display: inline-block;
      font-size: 0;
      .b-keyword{
        display: inline-block;
        margin-left: 12px;
      }
      .key-word-btn {
        padding: 0 12px;
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        color: #333333;
        background: #F5F5F5;
        border-radius: 2px;
        box-shadow: none;
      }
      & + div {
        display: flex;
      }
    }
    .el-icon-search {
      line-height: $inputHeight;
      cursor: pointer;
    }
    .menu-container {
      padding-right: 36px;
      height: 400px;
      overflow-x: hidden;
    }
  }
}
.keyword-del{
  margin-left: 12px;
  cursor: pointer;
}
.sec-menu-item {
  position: relative;
  margin-top: 24px;
  line-height: 38px;
  font-size: 14px;
  color: #2877FF;
  cursor: pointer;
  white-space: nowrap;
  & > span {
    font-weight: bold;
  }
  &.is-item-hover {
    padding-left: 20px;
  }
  .thr-menu-item {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    line-height: 38px;
    color: #333333;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    .icon-arrow-down,
    .icon-arrow--up {
      margin-right: 5px;
      width: 16px;
      height: 16px;
      cursor: pointer;
      font-size: 6px;
      color: #666666;
    }
    .for-menu-item {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      padding-left: 20px;
      padding-right: 40px;
      color: #666666;
      overflow: hidden;
      text-overflow: ellipsis;
      .arrow-item {
        padding-left: 20px;
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
      }
      .arrow-width {
        margin-right: 5px;
      }
    }
  }
}

.arrow-item {
  width: 100%;
  font-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  i,
  span {
    font-size: 14px;
  }
  i {
    cursor: pointer;
  }
  &:hover {
    color: #2877FF !important;
  }
}
.margin-span {
  margin-left: 20px;
}
.margin-label {
  cursor: pointer;
}
.is-item-hover:hover, .is-active {
  cursor: pointer;
  color: #2877FF !important;
  .icon-start {
    color: #1363ea
  }
  .icon-start-empty {
    color: #666;
  }
}
.is-item-hover:hover, .arrow-item:hover, .sec-menu-item-no-child:hover {
  .icon-start-empty {
    display: block;
    color: #666;
  }
}
.sec-menu-item-liked-wrap {
  padding-top: 24px;
  box-sizing: border-box;
  .sec-menu-item-liked {
    margin-top: 0 !important;
    color: #666666;
    span {
      font-weight: normal;
    }
    .icon-start {
      display: none;
    }
    &:hover {
      color: #2877FF;
      .icon-start {
        color: #2877FF;
        display: block;
      }
    }
  }
}

.el-drawer.ltr {
  box-sizing: border-box;
  width: 100%;
  padding: 0 0 0 36px;
}
.el-drawer__body {
  padding: 0 !important;
  overflow: hidden !important;
  .search-input {
    margin: 24px 20px 0 0;
    font-size: 0;
    ::v-deep .el-input {
      font-size: 14px;
      max-width: 62%;
      width: 280px;
      .el-icon-search {
        cursor: pointer;
      }
    }
    & > .i-keyword {
      width: 280px;
    }
  }
}
.el-drawer__container ::-webkit-scrollbar {
  display: block;
}
.icon-start {
  position: absolute;
  margin-top: -8px;
  top: 50%;
  right: 24px;
  font-size: 16px;
  z-index: 10;
  color: #666666;
}
.icon-start-empty {
  display: none;
  &:hover {
    color: #2877FF !important;
  }
}
.item-circle label {
  cursor: pointer;
}
</style>
