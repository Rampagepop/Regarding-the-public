<template>
  <card-wrap :cardName="cardName">
    <template slot="menus">
      <li @click="toProcessCenter">{{ $t('card.cardmore') }}</li>
    </template>
    <div :class="['yu-grid', {'last-grid': index === listData.length - 1}]" v-for="(item, index) of listData" :key="index"
         style="cursor: pointer" @click="toProcessCenter(item)">
      <div class="yu-grid-left-icon">
        <svg-icon
          :icon-class="item.iconSrc"
          class-name="yu-grid-left-icon-svg"
        ></svg-icon>
      </div>
      <div class="yu-grid-left">
        <div class="yu-grid-left-content">
          <div class="yu-grid-left-content-type">{{ item.type }}</div>
          <div class="yu-grid-left-content-num">
            <span class="num">{{ item.household }}</span>{{ $t('card.expirationPrompt.household') }}
          </div>
        </div>
      </div>
      <div class="yu-grid-right">
        <span class="num">{{ item.stroke }}</span>{{ $t('card.expirationPrompt.stroke') }}
      </div>
    </div>
  </card-wrap>
</template>

<script>
import cardWrap from '@/views/portal/card/components/card-wrap';
export default {
  name: 'expirationPrompt',
  components: {
    cardWrap
  },
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t('card.expirationPrompt')
      }
    }
  },
  data() {
    return {
      listData: []
    }
  },
  mounted() {
    this.getExpirationStatic()
  },
  methods: {
    //点击配置到二级页面
    toProcessCenter(item) {
      this.$router.push({
        path: '/portal/card/processCenter/processCenter',
        query: {'activeMode': 'endNotice', type: item ? item.type : null}
      })
    },
    getExpirationStatic() {
      this.$request({
        url: `${backend.mockService}/expiration/static`,
      }).then((res) => {
        if (res && res.code === "0") {
          const tmpList = [];
          res.data.forEach((d) => {
            tmpList.push({
              iconSrc: d.iconSrc,
              type: d.type,
              household: d.household,
              stroke: d.stroke
            });
          });
          this.listData = [].concat(tmpList);
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.yu-grid {
  display: flex;
  margin-bottom: 6px;
  padding: 8px 0 14px;
  align-items: flex-end;
  border-bottom: 1px dashed #EDEDED;
  background: #FFFFFF;
  &:last-of-type {
    margin-bottom: 0;
    border-bottom: 0 none;
  }
  &-left-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    width: 60px;
    height: 60px;
    background: rgba(24, 71, 153, 0.05);
    border-radius: 4px;
    &-svg {
      font-size: 31px;
    }
  }
  &-left {
    display: flex;
    align-items: center;
    flex: 1;
    &-content {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #666666;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &-num {
        margin-top: 7px;
      }
    }
  }
  &-right {
    flex: 1;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #666666;
  }
  .num {
    font-size: 24px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
    margin-right: 8px;
    cursor: pointer;
  }
}
.last-grid {
  border-bottom: none;
}
</style>
