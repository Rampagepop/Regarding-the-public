<template>
  <div>
    <el-popover
      popper-class="cardImgPover"
      ref="imgPopover"
      placement="right-start"
      :visible-arrow="false"
      :close-delay="10"
      trigger="click"
      :disabled="!Boolean(imgPath)"
    >
      <div>
        <div class="card-img-info">
          <span :title="`规格：${cardSpecCodeOpt[itemData.cardSpecCode]}`">
            <svg-icon class="card-img-info-svg" icon-class="card-size" />
            <span>{{ cardSpecCodeOpt[itemData.cardSpecCode] }}</span>
          </span>
          <span :title="`${itemData.likeNum}人喜欢`">
            <svg-icon class="card-img-info-svg" icon-class="card-like" />
            <span>{{ itemData.likeNum }}</span>
          </span>
          <span :title="`${itemData.useNum}人使用`">
            <svg-icon class="card-img-info-svg" icon-class="card-user" />
            <span>{{ itemData.useNum }}</span>
          </span>
        </div>
        <el-image class="hover-img" :src="imgPath" />
      </div>
    </el-popover>
    <div v-popover:imgPopover :data="itemData" class="item-img">
      <div class="item-img-box" :class="exist? 'used' : ''" @click.stop="stopProp">
        <el-image :src="imgPath" />
        <svg-icon class="used-svg" v-if="exist" icon-class="card-used" />
      </div>
      <div class="item-hover-wrap" @click.stop="stopProp"></div>
      <span class="item-card-icon item-collect" :class="itemData.cardLiked ? 'item-collect-active' : ''" :title="itemData.cardLiked ? '取消喜欢' : '喜欢'" @click.stop="toggleCollect(itemData, index)">
        <svg-icon icon-class="card-like" class="item-card-icon-svg" />
      </span>
      <span class="item-card-icon item-show" title="预览">
        <svg-icon icon-class="card-show" class="item-card-icon-svg" />
      </span>
    </div>
    <div class="item-title" :title="itemData.cardName">{{ itemData.cardName }}</div>
  </div>
</template>
<script>
import {cardCollect} from '@/api/portal/card'
import backend from "@/config/constant/app.data.service";

export default {
  name: 'cardImgPopover',
  props: {
    itemData: {
      type: Object,
      default: () => {}
    },
    cardSpecCdOpt: {
      type: Object,
      default: () => {}
    },
    exist: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imgPath: '',
      cardSpecCodeOpt: {
        1: '小',
        2: '中',
        3: '大',
        4: '超大',
      },
    }
  },
  watch: {
    itemData: {
      immediate: true,
      deep: true,
      handler(val) {
        try {
          this.imgPath = this.getDownloadImg(val);
        } catch (e) {
          this.imgPath = '';
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    /**
     * 下载图片内容
     * @param row 卡片信息
     * @returns {string} 返回图片下载地址
     */
    getDownloadImg(row) {
      return yufp.util.addTokenInfo(backend.fileService + '/api/file/provider/download?fileId=' + row.thumbnailroute);
    },
    //收藏卡片
    toggleCollect(item) {
      const data = {
        cardId: item.cardId,
        cardRoleId: item.cardRoleId
      }
      cardCollect(data).then(res => {
        if (res.code === '0') {
          this.$message('操作成功')
        }
        this.$emit('queryCard')
      })
    },
    stopProp() {}
  }
}
</script>
<style lang="scss" scoped>
.el-tag{
  position: absolute;
  left: 0;
  top: 0;
}
.item-img {
  position: relative;
  height: 68px;
  border: 1px solid #EDEDED;
  border-radius: 4px;
  .item-img-box {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    border-radius: 4px;
    overflow: hidden;
    &.used:after {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      content: '';
      background: rgba(0,0,0,0.19);
      z-index: 1;
    }
    .used-svg {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -18px;
      margin-left: -18px;
      font-size: 36px;
      z-index: 2;
    }
  }
  .item-hover-wrap {
    display: none;
    position: absolute;
    box-sizing: border-box;
    padding: 8px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.05);
    z-index: 2;
    cursor: default;
  }
  &:hover {
    border-color: #2877FF;
    .item-hover-wrap {
      display: block;
    }
    .item-card-icon {
      display: flex;
    }
  }
  &:after {
    position: absolute;
    content: "";
    display: none;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(128, 69, 69, 0.3);
    z-index: 10;
  }
  img {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  .item-size {
    position: absolute;
    left: 4px;
    top: 1px;
    font-size: 12px;
    color: #222222;
    opacity: 0.5;
    transform: scale(0.8);
  }
  .item-card-icon {
    display: none;
    position: absolute;
    width: 16px;
    height: 16px;
    justify-content: center;
    align-items: center;
    right: 8px;
    top: 8px;
    border-radius: 2px;
    background: #AAAAAA;
    cursor: pointer;
    z-index: 10;
    .item-card-icon-svg {
      display: inline-block;
      font-size: 20px;
      color: #fff;
      transform: scale(0.85);
    }
    &:hover {
      display: flex;
      background: #1362ea;
    }
  }
  .item-show {
    right: 28px;
  }
  .item-collect-active {
    display: flex;
    background: #2877FF;
  }
}
i {
  font-size: 40px;
}
.item-title {
  margin-top: 4px;
  width: 100%;
  line-height: 22px;
  text-align: center;
  font-size: 14px;
  color: #666666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-img-info-svg {
  font-size: 16px;
  color: #2877FF;
}
</style>
<style lang="scss">
  .cardImgPover{
    margin-left: 16px;
    padding: 0 16px 16px!important;
    background: #FFFFFF;
    border: 0 none !important;
    box-shadow: 12px 12px 18px 0px rgba(0, 0, 0, 0.08) !important;
    max-width: 1032px;
    overflow-x: auto;
    & > div {
      font-size: 0;
    }
    .card-img-info {
      display: flex;
      height: 48px;
      align-items: center;
      font-size: 0;
      & > span > span {
        margin-left: 4px;
        margin-right: 16px;
        font-size: 14px;
        color: #333333;
      }
    }
    .el-image {
      box-sizing: border-box;
      height: 320px;
      border-radius: 4px;
      border: 1px solid #EDEDED;
      .el-image__inner {
        width: auto;
        height: 320px;
        object-fit: cover;
      }
    }
  }
  .item-img .item-img-box .el-image__inner {
    width: auto;
    height: 66px;
    object-fit: cover;
  }
</style>
