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
    <empty-msg class="side-menu" msg="您还未添加快捷入口，点击右上角编辑进行添加" v-if="listData.length === 0"></empty-msg>
    <template slot="menus">
      <li @click="btnEditEntryFn">{{ $t('card.quickEntranceEdit') }}</li>
    </template>
    <yu-quick-entrance-edit
      :visibled="dialogVisible"
      @close="quickEntranceEditCloseFn"
    />
  </card-wrap>
</template>

<script>
import cardWrap from "@/views/portal/card/components/card-wrap";
import YuQuickEntranceEdit from "@/views/portal/card/routes/quickEntrance-edit.vue";
import emptyMsg from "@/components/layout/emptyMsg/index.vue";
export default {
  name: "quickEntrance",
  components: {
    cardWrap,
    YuQuickEntranceEdit,
    emptyMsg
  },
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t('card.quickEntrance')
      }
    }
  },
  data() {
    return {
      listData: [],
      dialogVisible: false, // 是否显示快捷入口编辑窗口
    };
  },
  created() {
    // 初始化请求数据 // 走mock数据
    this.getEntranceList();
  },
  methods: {
    getEntranceList() {
      this.$request({
        url: backend.portalService + '/api/xmhquickentrance/list',
      }).then((res) => {
        if (res.code === "0") {
          const tmpList = [];
          res.data.forEach((d) => {
            tmpList.push({
              imgSrc: yufp.util.addTokenInfo(
                backend.fileService + "/api/file/provider/download?fileId=" + d.qeIcon
              ),
              text: d.qeName,
              path: d.qeAddress,
            });
          });
          this.listData = [].concat(tmpList);
        }
      });
    },
    // 编辑快捷入口
    btnEditEntryFn() {
      this.dialogVisible = true;
    },
    // 小工具点击跳转
    toolClickFn(item) {
      if (item.path && (item.path.indexOf("http://") > -1 || item.path.indexOf("https://") > -1)) {
        window.open(item.path);
      }
    },
    // 关闭编辑窗口时，重新拉取数据
    quickEntranceEditCloseFn() {
      this.dialogVisible = false;
      this.getEntranceList();
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
    &-icon {
      img {
        float: none;
        width: 40px;
        height: 40px;
        object-fit: contain;
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
