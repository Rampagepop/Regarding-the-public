<template>
  <card-wrap :cardName="cardName">
    <div class="yu-grid">
      <yu-row :gutter="12">
        <yu-col :span="6" v-for="(item, index) of listData" :key="index">
          <div
            :class="['yu-grid-item', item.path && 'has-router']"
            @click="toolClickFn(item)"
          >
            <div class="yu-grid-item-icon">
              <img :src="item.imgSrc" :alt="item.text" />
            </div>
            <div class="yu-grid-item-text">{{ item.text }}</div>
          </div>
        </yu-col>
      </yu-row>
    </div>
  </card-wrap>
</template>

<script>
import cardWrap from "@/views/portal/card/components/card-wrap";
export default {
  name: "tool",
  components: {
    cardWrap,
  },
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t('card.tools')
      }
    }
  },
  data() {
    return {
      listData: [],
    };
  },
  created() {
    // 初始化请求数据 // 走mock数据
    this.$request({
      url: `${this.$backend.mockService}/tools/list`,
    }).then((res) => {
      if (res && res.code === "0") {
        const tmpList = [];
        res.data.forEach((d) => {
          tmpList.push({
            imgSrc: require(`@/assets/common/images/dragable/${d.imgSrc}`),
            text: d.text,
            path: d.path
          });
        });
        this.listData = [].concat(tmpList)
      }
    });
  },
  methods: {
    // 小工具点击跳转
    toolClickFn(item) {
      if (item.path) {
        this.$router.push(item.path);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.yu-grid {
  background: #ffffff;
  &-item {
    margin-top: 36px;
    text-align: center;
    &.has-router {
      cursor: pointer;
    }
    &:not(.has-router) {
      opacity: 0.3;
    }
    &-icon {
      img {
        float: none;
      }
    }
    &-text {
      color: #333333;
      margin-top: 2px;
      line-height: 34px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
