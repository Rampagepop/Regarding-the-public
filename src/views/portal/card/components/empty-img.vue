/**
* Desc:&emsp;&ensp;无数据时候，展示暂无数据icon
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/10/21
* @since   1.0.0
* @version 1.0
*/
<template>
  <div class="no-data-wrap" :class="size">
    <svg-icon class="no-data-img" icon-class="no-data"></svg-icon>
    <p v-if="text">{{ text }}</p>
  </div>
</template>

<script>

export default {
  name: "emptyImg",
  props: {
    text: String,
    size: {
      type: String,
      // small, middle, big 对应四种大小的卡片（大和超大一样）
      default: 'small'
    }
  },
  data: function () {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.no-data-wrap{
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  .no-data-img{
    flex: 0 1 auto;
    display: block;
    width: 110px;
    height: 126px;
    font-size: 110px;
    color: #c9c9c9;
  }
  p{
    flex: 0 1 auto;
    color: #666;
  }
}
.no-data-wrap.small{
  p{
    margin-top: 4px;
    line-height: 20px;
    font-size: 12px;
  }
}
.no-data-wrap.middle{
  p{
    margin-top: 6px;
    line-height: 25px;
    font-size: 13px;
  }
}
.no-data-wrap.big{
  p{
    margin-top: 8px;
    line-height: 30px;
    font-size: 14px;
  }
}
</style>
