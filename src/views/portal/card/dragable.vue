<template>
  <div>
    <div class="drag-edit-box">
      <div class="drag-source">
        <div class="dragable-title-box">
          <div class="dragable-title">全部卡片</div>
          <span class="dragable-sort-box">
            <svg-icon icon-class="drag-sort" class="drag-sort"></svg-icon>
            <span>排序</span>
            <div class="sort-list">
              <div
                class="sort-item"
                :class="item.itemno == sortKey ? 'sort-active' : ''"
                v-for="item in cardSort"
                :key="item.itemno"
                @click="changeSort(item)"
              >
                {{ item.itemname }}
              </div>
            </div>
          </span>
        </div>
        <div class="search-box">
          <!--编号/名称/类别/标签-->
          <yu-autocomplete
            class="inline-input"
            v-model="sourceKey"
            :fetch-suggestions="querySearch"
            :placeholder="$t('cardEdit.qsrnr')"
            icon="search"
            clearable
            @select="handleSelect"
          ></yu-autocomplete>
        </div>
        <yu-row class="size-btn-box">
          <yu-col :span="6" v-for="(item, index) in cardSizeOpt" :key="index">
            <yu-button
              @click="changeSeleSize(item.itemno)"
              class="size-btn"
              :class="cardSpecCode == item.itemno ? 'size-btn-active' : ''"
              size="mini"
              round
            >
              {{ item.itemname }}
            </yu-button>
          </yu-col>
        </yu-row>
        <el-tabs v-model="activeTab">
          <el-tab-pane
            v-for="(v, i) in cardTypeCdOpt"
            :key="i"
            :label="v.value"
            :name="v.key"
          >
            <el-row class="card-source">
              <!--资源库-->
              <draggable
                v-show="sourcelist.length > 0"
                class="tab-list infor-ul"
                element="div"
                v-model="sourcelist"
                :options="sourceOpt"
                handle=".mover"
                :move="moveFn"
                @start="titleDragStart"
              >
                <transition-group type="transition">
                  <div
                    :class="{
                      'drag-item': true,
                      mover: !item.exist,
                    }"
                    v-for="(item, index) in sourcelist"
                    :key="index + '_' + item.cardId"
                    :graph="item.cardId"
                  >
                    <cardImgPopover
                      @queryCard="queryCadr"
                      :itemData="item"
                      :exist="item.exist"
                      :cardSpecCodeOpt="cardSpecCodeOpt"
                    />
                  </div>
                </transition-group>
              </draggable>
              <empty-msg
                v-show="sourcelist.length === 0"
                :msg="$t('cardEdit.zwkpsj')"
              ></empty-msg>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!--编辑区域-->
      <div class="drag-content">
        <header class="drag-content-title">
          <div>
            <template v-if="isAdmin">
              <span>角色：</span>
              <yu-autocomplete
                class="role-search"
                popper-class="role-search-list"
                v-model="selectedRole"
                :fetch-suggestions="getRoles"
                placeholder="请选择，支持关键字搜索"
                :props="{ label: 'roleName', value: 'roleId' }"
                @select="handleSelectRole"
                clearable
                @clear="handleClearRole"
              ></yu-autocomplete>
              <template v-if="selectedRoleItem == null">
                <span class="clb">默认为当前用户</span>
              </template>
            </template>
            <span>从左侧拖拽卡片到右侧区域，可对位置进行调整</span>
          </div>
          <div>
            <el-button @click="save" type="primary">{{
              $t("cardEdit.bc")
            }}</el-button>
            <el-button @click="emptyCard">清空</el-button>
            <el-button @click="clearCard">清除失效卡片</el-button>
            <el-button v-if="!isAdmin || selectedRole == ''" @click="resetGraph">
              {{ $t('cardEdit.hfmrbj') }}
            </el-button>
            <el-button @click="cancel">{{ $t("cardEdit.qx") }}</el-button>
          </div>
        </header>
        <!--页面区域  -->
        <el-row class="drag-move" ref="dragMove">
          <draggable
            element="div"
            v-model="chartList"
            @add="titleDragEnd"
            :options="{
              group: { name: 'chartDrag', pull: false, put: true },
              sort: true,
              dragClass: 'drag-class',
              ghostClass: 'edit-ghost-class',
            }"
            @change="handleChangeFn"
          >
            <transition-group type="transition" class="comp-box" tag="div">
              <el-col
                :ref="item.uuid"
                :graph="item.id"
                :key="item.id"
                :span="columns[item.cardSpecCode]"
                v-for="(item, index) in chartList"
                :class="`chart chartDrag ${item.isHover ? 'hover' : ''}`"
                @mouseover="chartMouseover(index)"
                @mouseout="chartMouseout(index)"
              >
                <div
                  :class="{ 'comp-content-box': true, 'drag-disable': false }"
                >
                  <div class="toolbar">
                    <svg-icon
                      icon-class="delete2"
                      @click.stop="deleteChart(index, item)"
                      class-name="comp-remove"
                      alt="删除"
                    ></svg-icon>
                    <svg-icon
                      icon-class="card-move"
                      class-name="card-move"
                      alt="移动"
                    ></svg-icon>
                  </div>
                  <div class="comp-body-box">
                    <div
                      class="loader-wrapper-comp"
                      v-if="!item.exist || !item.app"
                    >
                      <div class="load_title">{{ item.cardName }}</div>
                      <div class="load_text">{{ $t("cardEdit.jckppz") }}</div>
                    </div>
                    <component
                      v-else
                      class="comp-col"
                      :ref="`sub${item.uuid}`"
                      :is="item.app.default"
                      :req-data="item.params"
                      :cardName="item.cardName"
                      :editNotShow="true"
                      :info="item"
                    ></component>
                  </div>
                </div>
              </el-col>
            </transition-group>
          </draggable>
          <empty-msg
            v-show="chartList.length === 0"
            :msg="$t('cardEdit.wbjkp')"
          ></empty-msg>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import emptyMsg from "@/components/layout/emptyMsg/index.vue";
import cardImgPopover from "./cardImgPopover.vue";
import draggable from "vuedraggable";
import {
  querySavedUserCard,
  saveUserWorkBench,
  findRolePrivCard,
  queryDefaultbench,
  deleteUserWorkBench,
} from "@/api/portal/card";
import { getRolesList } from "@/api/common/oauth";
import { getFileUrl, checkCtrl } from "@/utils/util";
import { clone } from "@/utils";

export default {
  name: "Dragable",
  components: {
    emptyMsg,
    draggable,
    cardImgPopover,
  },
  data() {
    return {
      roleList: [],
      timeout: null,
      selectedRole: "",
      sortKey: 1, // 默认上线时间倒序排序
      selectedRoleItem: null,
      activeIndex: 0, // 当前激活tab选项卡索引
      activeTab: "0",
      sourceIndex: 0, // 当前激活tab选项卡索引
      sourceOpt: {
        // 源drag项option设定
        group: {
          name: "chartDrag",
          pull: "clone",
          put: false,
          filter: ".exist",
        },
        sort: false,
        dragClass: "drag-class",
        ghostClass: "edit-ghost-class-source",
      },
      sourceKey: "", // 过滤器关键字
      sourcelist: [], // 当前tab列表数据
      souceData: [], // 原始数据
      chartList: [], // 编辑区域数据
      timer: null, // 定时器
      isFullscreen: false, // 是否全屏
      cardSpecCodeOpt: {
        1: "小",
        2: "中",
        3: "大",
        4: "超大",
      },
      cardTypeCdOpt: [
        // 卡片类型
        {
          key: "0",
          value: "全部",
        },
        {
          key: "1",
          value: "流程",
        },
        {
          key: "2",
          value: "统计",
        },
        {
          key: "3",
          value: "工具",
        },
        {
          key: "4",
          value: "功能",
        },
      ],
      columns: {
        // 列数切换
        4: 24,
        3: 18,
        2: 12,
        1: 6,
      },
      cardSpecCode: "",
      cardSizeOpt: [
        // 卡片规则
        {
          itemno: 1,
          itemname: "小",
        },
        {
          itemno: 2,
          itemname: "中",
        },
        {
          itemno: 3,
          itemname: "大",
        },
        {
          itemno: 4,
          itemname: "超大",
        },
      ],
      cardSort: [
        // 卡片排序 issuTime发布时间，collCnt收藏数，useCnt排序
        {
          itemno: 1,
          itemname: "发布时间",
        },
        {
          itemno: 2,
          itemname: "使用热度",
        },
        {
          itemno: 3,
          itemname: "喜爱热度",
        },
      ],
      showAdmin: false,
    };
  },
  computed: {
    ...mapGetters(["loginCode", "roleCode"]),
    isAdmin() {
      // 是否具有管理员分配角色
      // return isAdmin();
      // 控制点权限校验
      return !checkCtrl('cardRole', '/dragable')
    },
  },
  watch: {
    activeTab() {
      this.queryCadr();
    },
  },
  async mounted() {
    this.sourcelist = [];
    this.selectedRoleItem = null;
    this.selectedRole = "";
    // 获取卡片
    await this.reloadMyCharts();
    await this.queryCadr();
  },
  methods: {
    getRoles(keyWord, cb) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        getRolesList({ keyWord, size: 900 }).then((res) => {
          cb(res.data);
        });
      }, 2000 * Math.random());
    },
    // 切换角色
    async handleSelectRole(item = {}) {
      this.sourceKey = '';
      this.selectedRole = item.roleName || "";
      this.selectedRoleItem = item;
      await this.reloadMyCharts();
      await this.queryCadr();
    },
    async handleClearRole(e) {
      this.selectedRole = "";
      this.selectedRoleItem = null;
      await this.reloadMyCharts();
      await this.queryCadr();
    },
    // 卡片查询
    queryCadr() {
      const _this = this;
      const cardTypeCode = this.activeTab === "0" ? "" : this.activeTab; // 去除全部0传递空
      const cardSpecCode = this.cardSpecCode;
      const sortKey = this.sortKey;
      const params = {
        keyWord: this.sourceKey, //卡片名称
        cardTypeCode, //卡片类型
        cardSpecCode, //卡片大小
        sortKey, //卡片排序
      };
      if (this.selectedRoleItem) {
        params.roleId = this.selectedRoleItem.roleId;
      }
      for (const i in params) {
        if (!params[i]) delete params[i];
      }
      findRolePrivCard(params).then((res) => {
        const dragList = res.data || [];
        _this.souceData = [...dragList];
        _this.souceData[_this.activeTab] =
          this.activeTab === "0"
            ? [...dragList]
            : this.souceData.filter(
              (item) => item.cardTypeCode === Number(this.activeTab)
            );
        _this.sourcelist = [...dragList] || [];
        _this.chartList.forEach((item, i) => {
          _this.setDefaultExist(item, true);
        });
        // 处理请求成功的情况
      });
    },
    // 下拉选change
    changeSeleSize(size) {
      const cardSpecCode = this.cardSpecCode;
      this.cardSpecCode = cardSpecCode === size ? "" : size;
      this.queryCadr();
    },
    changeSort(item) {
      this.sortKey = item.itemno;
      this.queryCadr();
    },
    // 加载我的初始图表
    reloadMyCharts() {
      const params = {};
      if (this.selectedRoleItem) {
        params.roleId = this.selectedRoleItem.roleId;
      }
      querySavedUserCard(params)
        .then((res) => {
          this.userChartRequestCb(res);
          // 处理请求成功的情况
        })
        .catch((err) => console.log(err, "eeeeeee"));
    },
    // 生成唯一UUID
    generateUUID() {
      var d = new Date().getTime();
      if (window.performance && typeof window.performance.now === "function") {
        d += window.performance.now(); // use high-precision timer if available
      }
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    },
    // 获取require缓存内容
    getRequireCache(intfurl, idx) {
      const _this = this;
      _this.$set(
        _this.chartList[idx],
        "app",
        require(`@/views/portal/card/routes/${intfurl}.vue`)
      );
      _this.$set(_this.chartList[idx], "exist", true);
      _this.$set(_this.chartList[idx], "uuid", _this.generateUUID());
    },
    // 重置左侧列表选中状态
    resetSourceList() {
      const activeTab = this.activeTab
      this.sourcelist.forEach((item, i) => {
        this.$set(this.souceData[activeTab][i], 'exist', false);
        this.sourcelist = this.souceData[this.activeTab];
      })
    },
    // 设置默认选中
    setDefaultExist(item, flag) {
      const activeTab = this.activeTab;
      const curList = this.souceData[activeTab];
      if (curList) {
        for (let i = 0, len = curList.length; i < len; i++) {
          if (curList[i].cardId === item.cardId) {
            this.$set(this.souceData[activeTab][i], 'exist', flag);
            this.sourcelist = this.souceData[this.activeTab];
            break;
          }
        }
      }
      if (this.cardSpecCode) {
        const list = []
        this.souceData[this.activeTab].forEach(item => {
          if (item.cardSpecCode === this.cardSpecCode) {
            list.push(item);
          }
        });
        this.sourcelist = list;
      }
    },
    titleDragStart(e) {
      this.sourceOpt.ghostClass = "clas";
    },
    titleDragEnd(e) {
      const _this = this;
      const chart = { ...this.sourcelist[this.moveIndex] };
      _this.chartList.forEach((v, i) => {
        if (v.cardId === chart.cardId) {
          _this.getRequireCache(chart.intfurl, i);
          this.setDefaultExist(chart, true);
        }
      });
      this.sourceOpt.ghostClass = "clas";
      this.useDefaultReturn = false;
    },
    // 移动
    moveFn(e) {
      const _this = this;
      const chart = { ...this.sourcelist[e.draggedContext.index] };
      this.moveIndex = e.draggedContext.index;
      for (let i = 0, len = _this.chartList.length; i < len; i++) {
        if (_this.chartList[i].cardId === chart.cardId) {
          _this.sourceOpt.ghostClass = "clas";
          return false;
        }
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      try {
        this.timer = setTimeout(() => {
          const ghost = document.querySelector(".comp-box .drag-item");
          if (ghost) {
            let clas = ghost.getAttribute("class");
            const column = e.draggedContext.element.cardSpecCode;
            const extClas = ` el-col el-col-${_this.columns[column]}`;
            if (clas.indexOf(extClas) === -1) {
              clas += ` el-col el-col-${_this.columns[column]}`;
              ghost.setAttribute("class", clas);
            }
          }
        }, 30);
      } catch (ev) {}
      // }, 30);
      return true;
    },
    emptyCard() {
      const _this = this;
      _this.$confirm(_this.$t("cardEdit.qrqkgzt"), _this.$t("cardEdit.ts"), {
        confirmButtonText: _this.$t("cardEdit.qd"),
        cancelButtonText: _this.$t("cardEdit.qx"),
        type: 'warning',
        callback: function (action) {
          if (action === 'confirm') {
            _this.tmpCharList = _this.chartList
            _this.tmpSourceList = clone(_this.sourcelist, [], true)
            _this.resetSourceList();
            _this.chartList = []
          }
        }
      })
    },
    // 删除单元块
    deleteChart(index, item) {
      if (this.chartList[index]) {
        this.chartList.splice(index, 1);
        this.setDefaultExist(item, false);
        this.chartList.forEach((v, i) => {
          this.$set(this.chartList[i], "exist", true);
        });
      }
      this.useDefaultReturn = false;
    },
    chartMouseover(index) {
      this.$set(this.chartList[index], "isHover", true);
    },
    chartMouseout(index) {
      this.$set(this.chartList[index], "isHover", false);
    },
    // 校验是否存在错误卡片
    checkCardError() {
      let errorCount = 0;
      for (let i = 0, l = this.chartList.length; i < l; i++) {
        if (this.chartList[i].app === undefined) {
          errorCount++;
        }
      }
      return errorCount;
    },
    // 保存位置信息
    save() {
      // 先校验卡片是否均有效
      const errCount = this.checkCardError();
      if (errCount > 0) {
        this.$message.warning(this.$t("cardEdit.kpyc", { num: errCount }));
        return false;
      }
      this.useDefaultReturn = true;
      let xmhSaveBenchVo = []; // eslint-disable-line
      const _this = this;
      this.chartList.forEach((v, i) => {
        const obj = { ...v };
        delete obj.app;
        xmhSaveBenchVo.push({
          serialNo: i + 1,
          cardId: obj.cardId,
          cardRoleId: obj.cardRoleId,
        });
      });
      const data = { xmhSaveBenchVo };
      if (this.selectedRoleItem) {
        data.roleId = this.selectedRoleItem.roleId;
      }
      saveUserWorkBench(data).then((res) => {
        if (res.code === "0") {
          _this.$message({ message: "保存成功！", type: 'success' });
          setTimeout(() => {
            _this.$router.push({
              path: "/dashboard",
            });
          }, 1000);
        } else {
          this.$message({
            type: "warning",
            message: res.msg || this.$t("cardEdit.fwqyc"),
          });
        }
        // 处理请求成功的情况
      });
    },
    // 取消
    cancel() {
      const _this = this;
      this.useDefaultReturn = true;
      this.$confirm(_this.$t("cardEdit.gztybbjtcjbblccbj"), _this.$t('component.ts'), {
        confirmButtonText: _this.$t("cardEdit.bcbtc"),
        cancelButtonText: _this.$t("cardEdit.zjtc"),
        type: "warning"
      })
        .then(() => {
          _this.tmpCharList = null;
          _this.tmpSourceList = null;
          _this.save();
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: _this.$t("cardEdit.yqx"),
          });
          _this.chartList = _this.tmpCharList;
          _this.sourcelist = _this.tmpSourceList;
          setTimeout(function () {
            _this.$router.push("/dashboard");
          }, 1000);
        });
    },
    // 恢复初始状态
    resetGraph() {
      this.useDefaultReturn = true;
      const _this = this;
      _this.$confirm(_this.$t("cardEdit.gztybbjmjcz"), _this.$t("cardEdit.ts"), {
        confirmButtonText: _this.$t("cardEdit.qd"),
        cancelButtonText: _this.$t("cardEdit.qx"),
        type: 'warning',
        callback: function (action) {
          if (action === 'confirm') {
            _this.resetGraphReq();
          }
        }
      })
      // this.$confirm(_this.$t("cardEdit.gztybbjmjcz"), _this.$t('component.ts'), {
      //   confirmButtonText: _this.$t("cardEdit.qd"),
      //   cancelButtonText: _this.$t("cardEdit.qx"),
      //   type: "warning",
      //   center: true,
      // })
      //   .then(() => {
      //     _this.resetGraphReq();
      //   })
      //   .catch(() => {});
    },
    // 恢复初始状态请求
    resetGraphReq() {
      queryDefaultbench().then(res => {
        this.resetSourceList()
        this.userChartRequestCb(res)
      });
    },
    userChartRequestCb(res) {
      if (res.code === "0") {
        const charts = res.data || [];
        let chartLists = [];
        charts.forEach((item, i) => {
          try {
            item.app = require(`@/views/portal/card/routes/${item.intfurl}.vue`);
          } catch (error) {}
          item.exist = true;
          item.uuid = this.generateUUID();
          chartLists.push(item);
          this.setDefaultExist(item, true);
        });
        this.chartList = [...chartLists];
        chartLists = null;
      } else {
        this.$message({
          type: "warning",
          message: res.msg || this.$t("cardEdit.fwqyc"),
        });
      }
    },
    // 重置状态
    resetStatus() {
      Object.keys(this.souceData).forEach((v, i) => {
        this.souceData[v] &&
          this.souceData[v].forEach((m, j) => {
            this.setDefaultExist(m, false);
          });
      });
    },
    /**
     * 下载图片内容
     * @param row 卡片信息
     * @returns {string} 返回图片下载地址
     */
    getDownloadImg(row) {
      return getFileUrl(row.thumbnailroute);
    },
    //输入框查询
    querySearch(queryString, cb) {
      this.handleSelect(queryString);
      var restaurants = [...this.souceData[this.activeTab]];
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      results.forEach((v, i) => {
        if (isNaN(queryString) || !queryString) {
          this.$set(results[i], "value", v.cardName);
        } else {
          this.$set(results[i], "value", v.cardId);
        }
      });
      // 调用 callback 返回建议列表的数据
      this.sourcelist = results || [];
      cb(results);
    },
    // 查询条件
    createFilter(queryString) {
      return function (restaurant) {
        restaurant.value = restaurant.cardName;
        return restaurant.cardName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1;
      };
    },
    handleSelect(item) {
      if (item) {
        this.sourceKey = typeof item === "object" ? item.cardName : item;
      }
      if (this.souceData[this.activeTab]) {
        this.sourcelist = this.souceData[this.activeTab].filter((v) => {
          return v.cardName.indexOf(this.sourceKey) !== -1;
        });
      } else {
        this.queryCadr();
      }
    },
    handleChangeFn() {
      this.useDefaultReturn = false;
    },
    // 清除用户工作台
    clearCard() {
      const data = {};
      const _this = this;
      if (this.selectedRoleItem) {
        data.roleId = this.selectedRoleItem.roleId;
      }
      _this.$confirm(_this.$t("cardEdit.qcsxkp"), _this.$t("cardEdit.ts"), {
        confirmButtonText: _this.$t("cardEdit.qd"),
        cancelButtonText: _this.$t("cardEdit.qx"),
        type: 'warning',
        callback: function (action) {
          if (action === 'confirm') {
            deleteUserWorkBench(data).then((res) => {
              _this.userChartRequestCb(res);
            });
          }
        }
      })
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./dragable.scss";
::-webkit-scrollbar {
  width: 0;
}
.drag-breadcrumb {
  width: 240px;
}
::v-deep{
  .drag-edit-box .el-tabs__item{
    width:20%;
  }
}
.drag-move .empty-msg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.drag-move > div {
  height: 100%;
}

.padd-r-16 {
  padding-right: 16px;
}

.drag-content-title {
  .role-search {
    width: 220px;
  }
  .el-tag {
    margin: 0 20px;
  }

  .el-select {
    width: 220px;
    margin-left: 10px;
  }
}

.drag-source {
  .card-source {
    height: calc(100vh - 318px);
    overflow-y: auto;
    scrollbar-width: none
  }
}

.size-btn-box {
  .size-btn {
    display: flex;
    padding: 0 12px !important;
    align-items: center;
    height: 24px;
    font-size: 12px;
    border-radius: 12px;
    color: #333333;
    border: 0 none;
    background: #f5f5f5;
  }
  .size-btn-active {
    background: #2877ff;
    color: #ffffff !important;
  }
}
</style>
<style>
  .role-search-list .el-autocomplete-suggestion__wrap {
    border: 0 none
  }
</style>
