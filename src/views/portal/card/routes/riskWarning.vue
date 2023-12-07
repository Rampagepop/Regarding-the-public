<template>
  <card-wrap :cardName="cardName">
    <template slot="menus">
      <li @click="toNextPage">{{ $t('card.cardmore') }}</li>
    </template>
    <yu-card-empty v-if="!listData" />
    <div class="risk-warning-wrap" v-else>
      <div class="yu-grid" v-for="(item, index) of listData" :key="index">
        <div class="yu-grid-left">
          <div :class="['yu-grid-left-icon', 'img' + item.statusRs]"></div>
          <div class="yu-grid-left-status">
            <div
              :class="[
                'status',
                item.statusRs === 3 ? 'status-released' : 'status-effect',
              ]"
            >
              {{ getPrefixStatusText(item.statusRs) }}
            </div>
          </div>
          <div class="yu-grid-left-company">[{{ item.customerName }}]</div>
          <div class="yu-grid-left-content" @click="riskWarningClickFn(item)">
            <warning-popover :popover-data="item"></warning-popover>
          </div>
        </div>
        <div class="yu-grid-right">
          <i>{{ item.update }}</i>
          <span>{{ getSuffixStatusLastText(item.statusRs) }}</span>
        </div>
      </div>
    </div>
  </card-wrap>
</template>

<script>
import cardWrap from "@/views/portal/card/components/card-wrap";
import warningPopover from "@/views/portal/card/routes/warningPopover";
import YuCardEmpty from "@/views/portal/card/components/empty.vue";
export default {
  name: "riskWarning",
  components: {
    cardWrap,
    warningPopover,
    YuCardEmpty,
  },
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t("card.riskWarning");
      },
    },
  },
  data() {
    return {
      listData: null,
    };
  },
  mounted() {
    this.getCustomerCount();
  },
  methods: {
    toNextPage() {
      this.$router.push({path:'/portal/card/processCenter/processCenter', query:{'activeMode':'riskWarning'}})
    },
    getCustomerCount() {
      this.$request({
        url: `${this.$backend.mockService}/riskwarning/list`,
        params: {
          page: 1,
          size: 6,
        },
      }).then((res) => {
        if (res && res.code === "0") {
          this.listData = res.data;
        }
      });
    },
    // 前置状态标记描述
    getPrefixStatusText(status) {
      return ["生效中", "生效中", "已解除"][status - 1];
    },
    // 后置状态标记描述
    getSuffixStatusLastText(status) {
      return ["生效", "生效", "解除"][status - 1];
    },
    // 风险预警信息点击操作
    riskWarningClickFn(item) {
      this.$message(`功能开发中，敬请期待。`)
    }
  },
};
</script>

<style lang="scss" scoped>
.risk-warning-wrap {
  padding-top: 12px;
}
.yu-grid {
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  box-shadow: inset 0px -1px 0px 0px #ededed;
  padding: 10px 16px 10px;
  &-left {
    display: flex;
    flex: 1;
    overflow: hidden;
    &-icon {
      width: 16px;
      background-repeat: no-repeat;
      img {
        float: none;
      }
      &.img1 {
        background-image: url(~~assets/common/images/dragable/alarm1.svg);
      }
      &.img2 {
        background-image: url(~~assets/common/images/dragable/alarm2.svg);
      }
      &.img3 {
        background-image: url(~~assets/common/images/dragable/alarm3.svg);
      }
    }
    &-status {
      margin-left: 17px;
      div {
        width: 56px;
        height: 20px;
        line-height: 20px;
        border-radius: 4px;
        font-size: 12px;
        color: #ffffff;
        text-align: center;
      }
      .status-effect {
        background: #2877ff;
      }
      .status-released {
        background: #cccccc;
      }
    }
    &-company {
      font-size: 14px;
      color: #2877ff;
      margin: 0 12px;
    }
    &-content {
      flex: 1;
      overflow: hidden;
      font-size: 14px;
      color: #333333;
      cursor: pointer;
      &:hover {
        color: #2877ff;
      }
    }
  }
  &-right {
    font-size: 14px;
    color: #999999;
  }
}
</style>
