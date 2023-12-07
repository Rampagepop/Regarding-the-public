<template>
  <div class="comp-box drag-view">
    <el-row>
      <el-col
        v-for="(item, index) in chartList"
        :key="item.cardId"
        :graph="item.cardId"
        :span="columns[item.cardSpecCode ? item.cardSpecCode : '40']"
        :class="{ hover: item.isHover, 'chart detail': true }"
        @mouseover="chartMouseover(index)"
        @mouseout="chartMouseout(index)"
      >
        <yu-lazy>
          <div v-if="item.app" :class="{ 'comp-content-box': true, 'drag-disable': false }">
            <div class="loader-wrapper-comp" v-if="!item.exist">
              <div class="loader"></div>
              <div class="load_title">{{ $t("card.zzjz") }}...</div>
            </div>
            <component
              v-else
              class="comp-col"
              :is="item.app.default"
              :ref="`sub${item.uuid}`"
              :edit-status="false"
              :card-name="item.cardName"
              :req-data="item"
              :data-id="item.cardId"
              :info="item"
              @getCardData="getCardDataFn"
              @callBackFn="initRoleShow"
            ></component>
          </div>
          <div class="comp-content-box" style="height: 320px; line-height: 320px; text-align: center" v-else>
            该卡片不存在
          </div>
        </yu-lazy>
      </el-col>
      <el-col :key="new Date().getTime()" v-show="chartList.length === 0" :span="24">
        <empty-msg msg="" :show-img="false">
          <p>{{ $t("card.nwtj") }}</p>
          <p>{{ $t("card.nktg") }}</p>
        </empty-msg>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import emptyMsg from "@/components/layout/emptyMsg/index.vue";
import { querySavedUserCard } from "@/api/portal/card";
import { mapGetters } from "vuex";
export default {
  components: {
    emptyMsg,
  },
  data() {
    return {
      columns: { // 列数切换
        4: 24,
        3: 18,
        2: 12,
        1: 6
      },
      showTooltip: false,
      linkTitleCard: [
        "customer-manage",
        "complete-task",
        "to-do-task",
        "supervise-task",
        "change-remind",
      ], // 点击标题可以跳转的卡片
      urlObj: {
        "customer-manage": "/customer",
        "complete-task": "/taskManage",
        "to-do-task": "/taskManage",
        "supervise-task": "/taskManage",
        "change-remind": "/changeRemind",
      },
      questionIcon: ["change-remind", "ftp", "customer-manage"], // 显示问号图标得卡片
      downloadIcon: ["change-remind", "flow-trace", "process-track"], // 显示下载图标得卡片
      selfTitleCard: [
        "three-library",
        "calendar",
        "process-track",
        "to-do-approval",
        "statistics-disburse",
      ], // 自定义卡片标题的卡片
      tabTitleCard: ["all-task"], // 标题是tab切换的卡片
      tabTitleObj: { "all-task": ["贷后任务完成情况", "待办任务", "督导任务"] },
      isActive: 1,
      dynamicTitle: "", // 动态标题,自组件传值过来
      // dynamicTitleCard: ['eva-branch'],
      dynamicTitleCard: [],
      dynamicNum: {
        "complete-task": 0,
        "to-do-task": 0,
        "supervise-task": 0,
        "eva-branch": "",
        "analysis-assets": "",
      },
      dynamicNumCard: [
        "complete-task",
        "to-do-task",
        "supervise-task",
        "eva-branch",
        "analysis-assets",
      ], // 标题后面有数字或者机构名的卡片
      unitCard: [
        "quality-assets",
        "structure-assets",
        "problem-assets",
        "loan-balance",
        "loan-scale",
        "analysis-assets",
        "credit-track",
        "customer-manage",
      ], // 卡片后面有单位
      chartList: [], // 工作台列表
      threeTitleCard: ["eva-branch"], // 卡片3个标题
      twoTitleCard: ["customer-manage"], // 卡片2个标题
      cardRouteTo: ["key-event", "beforeAudit"], // 点击标题跳转到外围系统的卡片
      cardNotRouteTo: ["riskKpiRank", "eva-total"], // 不能点击标题跳转到外围系统的卡片
    };
  },
  computed: {
    ...mapGetters(["theme", "roleCode", "zhfxDate", "doraemonDate", "roles"]),
    moreIcon() {
      return this.theme.id === "night" ? "more-night" : "more";
    },
  },
  created() {
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      // 获取首页卡片列表
      querySavedUserCard()
        .then((res) => {
          if (res.code === "0") {
            const charts = res.data || [];
            let chartLists = [];
            charts.forEach((item, i) => {
              try {
                item.app = require(`@/views/portal/card/routes/${item.intfurl}.vue`);
              } catch (error) {}
              item.exist = true;
              item.uuid = i;
              chartLists.push(item);
              this.$forceUpdate();
            });
            this.chartList = [...chartLists];
            chartLists = null;
          } else {
            this.$message({
              type: "warning",
              message: res.msg || this.$t("cardEdit.fwqyc"),
            });
          }
          // 处理请求成功的情况
        })
        .catch((err) => console.log(err, "eeeeeee"));
    },
    // 获取标题
    getTitle(item) {
      const isCluded = this.dynamicNumCard.includes(item.cardDTO.dataShwFormCd);
      const cardName = item.cardDTO.cardName;
      let title = "";
      if (isCluded) {
        title = cardName.replace(`(${this.$t("card.fh")})`, "");
      } else {
        title = (item.cardDTO && cardName) || `${this.$t("card.wmm")}`;
      }
      return [
        title,
        isCluded ? "(" + this.dynamicNum[item.cardDTO.dataShwFormCd] + ")" : "",
      ].join("");
    },
    // 点击更多
    toWorkFn() {
      this.$router.push("/dragable");
    },
    moreFn(item, idx) {
      const subRefs = this.$refs[`sub${item.uuid}`];
      try {
        subRefs && subRefs[0] && subRefs[0].toggleVisible();
      } catch (e) {}
    },
    handleFn(item) {
      this.$refs[`sub${item.uuid}`][0].downloadFn();
    },
    linkFn(item) {
      // 点击卡片标题可以跳转的卡片
      if (this.linkTitleCard.includes(item.cardDTO.dataShwFormCd)) {
        // this.$router.push(this.urlObj[item.cardDTO.dataShwFormCd]);
        // let query = {};
        switch (item.cardDTO.dataShwFormCd) {
          case "complete-task":
            this.$store.commit("oauth/SET_CURRENT_TASK_PAGE", 1);
            break;
          case "to-do-task":
            this.$store.commit("oauth/SET_CURRENT_TASK_PAGE", 1);
            break;
          case "supervise-task":
            this.$store.commit("oauth/SET_CURRENT_TASK_PAGE", 2);
            break;
          default:
            break;
        }
        // let query = {
        //   'complete-task': 0, 'to-do-task': 1, 'supervise-task': 2
        // }
        this.$router.replace({
          path: this.urlObj[item.cardDTO.dataShwFormCd],
          // query: {idx: query[item.cardDTO.dataShwFormCd]}
        });
      }
    },
    clickTitleFn(num, ref) {
      this.isActive = num;
      this.$nextTick((_) => {
        if (this.$refs[ref]) {
          this.$refs[ref][0].currentIdx = num;
        }
      });
    },
    getCardDataFn(datas) {
      this.dynamicNum[datas.cardName] = datas.totalNum;
    },
    initRoleShow() {
      // 任务总览可以展示的角色-客户，风险，团队长
      const allTaskShow = [
        "R0320211203152159641",
        "R0320210926000001001",
        "R0220211130000001033",
        "R0320210926000001004",
        "R0320210926000001003",
      ];
      // 督导任务不可以展示的角色-客户经理
      const supTaskShow = ["R0320211203152159641", "R0320210926000001001"];
      const sameEle = this.roles.filter((item) =>
        allTaskShow.includes(item.roleCode)
      );
      const diffEle = this.roles.filter((item) =>
        supTaskShow.includes(item.roleCode)
      );
      if (!sameEle.length > 0) {
        this.tabTitleObj["all-task"].splice(0, 1);
      }
      if (diffEle.length > 0) {
        this.tabTitleObj["all-task"].splice(2, 1);
      }
    },
    // 点击标题跳转外围系统
    routeTo(item) {
      if (!this.cardNotRouteTo.includes(item.cardDTO.dataShwFormCd)) {
        const subRefs = this.$refs[`sub${item.uuid}`];
        try {
          subRefs && subRefs[0] && subRefs[0].goUrl();
        } catch (e) {}
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./dragable.scss";
.comp-box {
  margin: 16px -16px -15px 0;
}
// .comp-content-box {
//   min-height: 280px;
.card-dropdown {
  float: right;
  margin-top: -46px;
  margin-right: 20px;
}
.card-dropdown-self {
  position: absolute;
  right: 16px;
  top: 20px;
  z-index: 999;
}
.self-body-box {
  height: 359px;
}
.data-clock {
  font-size: 14px !important;
  font-weight: 400 !important;
  margin-left: 8px;
  i {
    margin-right: 10px;
  }
}
[class*=" el-icon-yx-"],
[class^="el-icon-yx-"] {
  font-family: icomoon !important;
}
</style>
