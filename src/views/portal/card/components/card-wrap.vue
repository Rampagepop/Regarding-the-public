<template>
  <div class="card-wrap">
    <div class="card-top-wrap">
      <div class="card-name">{{ cardName }}</div>
      <div class="card-enter-wrap">
        <slot name="topCenter"></slot>
      </div>
      <div class="card-dot yu-icon-more1" v-if="editNotShow && !noEdit">
        <div class="menu-list">
          <ul>
            <li @click="btnEditWorkend">{{ $t("card.settings") }}</li>
            <slot name="menus"></slot>
          </ul>
        </div>
      </div>
    </div>
    <div class="card-content-wrap" :style="{margin: noPadding?'0 -16px':'0'}">
      <slot></slot>
    </div>
    <div class="card-deleted" v-if="isDeleted">
      <svg-icon class="expire-svg" icon-class="card-expire" />
    </div>
  </div>
</template>

<script>
export default {
  name: "cardWrap",
  props: {
    cardName: {
      type: String,
      default: "",
    },
    cardInfo: {
      type: Object,
      default: () => {
      },
    },
    // 不展示默认编辑按钮
    noEdit: {
      type: Boolean,
      default: false,
    },
    // 没有内边距
    noPadding: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    isDeleted: function () {
      return this.$parent.$attrs.info && this.$parent.$attrs.info.deleted;
    },
    editNotShow: function () {
      return !this.$parent.$attrs.editNotShow;
    },
  },
  methods: {
    dotHook() {
      console.log("dot ---->");
    },
    btnEditWorkend() {
      // 点击跳转卡片设置界面
      this.$router.push("/dragable");
    },
  },
};
</script>

<style lang="scss" scoped>
.card-wrap {
  position: relative;
  padding: 0 16px;
  background: #ffffff;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.card-top-wrap {
  display: flex;
  box-sizing: border-box;
  align-items: center;
}

.card-enter-wrap {
  flex: 1;
}

.card-name {
  height: 48px;
  line-height: 48px;
  font-size: 16px;
  font-weight: bold;
  color: #333333;
}

.yu-icon-more1 {
  position: relative;
  margin-left: 16px;
  cursor: pointer;
  color: #999999;
  font-size: 16px;

  &:hover {
    &:before {
      color: #2877ff;
    }
  }
}

.card-content-wrap {
  height: 272px;
  overflow-y: auto;
  overflow-x: hidden;
}

.card-deleted {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.19);
  border-radius: 4px;

  .expire-svg {
    font-size: 118px;
  }
}
</style>
