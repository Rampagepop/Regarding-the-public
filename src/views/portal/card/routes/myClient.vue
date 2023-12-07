<template>
  <card-wrap :cardName="cardName">
    <yu-card-empty v-if="!staticData" />
    <div class="my-client-wrap" v-else>
      <yu-autocomplete
        icon="search"
        v-model="searchVal"
        :fetch-suggestions="searchContent"
        :placeholder="$t('card.customer.placeholder')"
        :trigger-on-focus="false"
        custom-item="yu-customer-item"
        :popper-append-to-body="false"
        class="autocomplete-reset"
        clearable
        @select="handleSelect"
      ></yu-autocomplete>
      <div class="yu-grid">
        <yu-row :gutter="16">
          <yu-col :span="8" v-for="item of Object.keys(staticText)" :key="item">
            <div class="yu-grid-item">
              <div :class="['yu-grid-item-num']">
                {{ staticData[item] }}
              </div>
              <div>
                <span class="yu-grid-item-text" :title="staticText[item]">{{ staticText[item] }}</span>
              </div>
            </div>
          </yu-col>
        </yu-row>
        <div class="yu-grid-client-wrap">
          <div class="yu-grid-client" @click="btnMgrFn">
            <span class="client-icon">
              <img class="manage" src="@/assets/common/images/dragable/icon-manage.png" />
            </span>
            <span class="client-text" :title="$t('card.customer.mgr')">{{ $t("card.customer.mgr") }}</span>
          </div>
          <div class="yu-grid-client" @click="btnAddFn">
            <span class="client-icon">
              <svg-icon
                icon-class="icon-plus"
                class-name="client-icon-svg"
              ></svg-icon>
            </span>
            <span class="client-text" :title="$t('card.customer.add')">{{ $t("card.customer.add") }}</span>
          </div>
        </div>
      </div>
    </div>
  </card-wrap>
</template>

<script>
// 需要全局注入组件YuCustomerItem
import { extend } from "@/utils";
import cardWrap from "@/views/portal/card/components/card-wrap";
import YuCardEmpty from "@/views/portal/card/components/empty.vue";
import { debounce } from "throttle-debounce";
export default {
  name: "myClient",
  components: {
    cardWrap,
    YuCardEmpty
  },
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t("card.myClient");
      },
    },
  },
  data() {
    return {
      staticData: null,
      staticText: {
        total: this.$t("card.customer.total"),
        stock: this.$t("card.customer.stock"),
        temp: this.$t("card.customer.temp"),
      },
      searchVal: "",
      debounce: 100,
    };
  },
  mounted() {
    this.getCustomerCount();
    this.debouncedGetCustomerList = debounce(
      this.debounce,
      this.getCustomerList
    );
  },
  methods: {
    handleSelect() {},
    searchContent(queryString, cb) {
      // 只取第一条数据
      this.debouncedGetCustomerList({
        page: 1,
        size: 1,
      }, cb);
    },
    getCustomerCount() {
      this.$request({
        url: `${this.$backend.mockService}/customer/static`,
      }).then((res) => {
        if (res && res.code === "0") {
          this.staticData = res.data;
        }
      });
    },
    // 获取客户数据
    getCustomerList(params, cb) {
      this.$request({
        url: `${this.$backend.mockService}/customer/list`,
        params: extend(
          {
            keyword: this.searchVal,
          },
          params || {}
        ),
      }).then((res) => {
        if (res.code === "0") {
          cb(res.data || []);
        }
      });
    },
    btnMgrFn() {
      this.$message("功能开发中，敬请期待。");
    },
    btnAddFn() {
      this.$message("功能开发中，敬请期待。");
    },
  },
};
</script>

<style lang="scss" scoped>
.autocomplete-reset{width: 100%;}
.my-client-wrap {
  padding-top: 12px;
}
.yu-grid {
  background: #ffffff;
  padding: 30px 0 0;
  &-item {
    margin-bottom: 46px;
    text-align: center;
    &-num {
      line-height: 56px;
      font-size: 24px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
    }
    .blueStyle {
      color: #2877ff;
    }
    &-text {
      display: block;
      padding: 0 12px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border-radius: 4px;
      font-size: 14px;
      background: #f5f5f5;
      font-family: MicrosoftYaHei;
      color: #666666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &-client-wrap {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  &-client {
    display: flex;
    align-items: center;
    font-size: 0;
    overflow: hidden;
    .client-icon {
      position: relative;
      display: flex;
      box-sizing: border-box;
      width: 40px;
      height: 40px;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      cursor: pointer;
      img {
        float: none;
        &.manage {
          width: 24px;
          height: 24px;
        }
      }
      &-svg {
        font-size: 16px;
      }
    }
    .client-text {
      flex: 1;
      color: #333333;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
