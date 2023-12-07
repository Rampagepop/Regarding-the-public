<template>
  <div class="yu-slide-model" :style="{'pointer-events':!show?'none':'all'}">
    <transition name="el-fade-in">
      <div class="proper__model" v-if="show" @click="hideProper"></div>
    </transition>
    <transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div :class="['proper__content',`proper__${placement}`]" :style="getClient()" v-if="show">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
/**
 * 边界滑出层
 * @desc 在页面中弹出一个遮罩层，与一快内容区域
 * @param 见props
 * @example <slide-model v-model="showProper" placement="right" client="300">这里是content</slide-model>
 */
export default {
  name: 'SlideModel',
  props: {
    value: {
      // 是否显示
      type: Boolean,
      default: false
    },
    placement: {
      type: String, // content出现位置
      default: 'left' // {left,top,bottom,right}
    },
    client: {
      // 内容区域的高度或者宽度，左边或者右边表示宽度，上边或者下边表示高度
      type: [String, Number],
      default: 300
    }
  },
  data () {
    return {
      show: this.value
    }
  },
  watch: {
    value: function (val) {
      this.show = val
    }
  },
  methods: {
    /**
     * 获取定位确定固定高或宽样式
     * @return {Object} style 内容区域高或宽样式
     */
    getClient () {
      let style = {}
      if (this.placement === 'top' || this.placement === 'bottom') {
        style = {
          // height: this.client + 'px'
          height: '80%' // 调整菜单区域高度，底部不留空白
        }
      } else {
        style = {
          width: this.client + 'px'
        }
      }
      return style
    },
    /**
     * 隐藏弹窗
     */
    hideProper () {
      this.show = false
      this.$emit('input', this.show)
    },
    beforeEnter (el) {
      el.style.transition = 'all .5s ease-in'
      switch (this.placement) {
        case 'left':
          el.style.transform = `translateX(-${this.client}px)`
          break
        case 'right':
          el.style.transform = `translateX(${this.client}px)`
          break
        case 'top':
          el.style.transform = `translateY(-${this.client}px)`
          break
        case 'bottom':
          el.style.transform = `translateY(${this.client}px)`
          break
        default:
          break
      }
      el.style.opacity = 0
    },
    enter (el, done) {
      done()
      el.style.transition = 'all .5s ease-in'

      switch (this.placement) {
        case 'left':
          el.style.transform = `translateX(0px) translateY(0px)`
          break
        case 'right':
          el.style.transform = 'translateX(0px) translateY(0px)'
          break
        case 'top':
          el.style.transform = 'translateX(0px) translateY(0.0rem)'
          break
        case 'bottom':
          el.style.transform = 'translateX(0px) translateY(0px)'
          break
        default:
          break
      }
      el.style.opacity = 1
    },
    leave (el, done) {
      el.style.transition = 'all .2s ease-out'
      switch (this.placement) {
        case 'left':
          el.style.transform = `translateX(-${this.client}px)`
          break
        case 'right':
          el.style.transform = `translateX(${this.client}px)`
          break
        case 'top':
          el.style.transform = `translateY(-${this.client}px)`
          break
        case 'bottom':
          el.style.transform = `translateY(${this.client}px)`
          break
        default:
          break
      }
      el.style.opacity = 0
      setTimeout(_ => {
        done()
      }, 100)
    }
  }
}
</script>

<style scoped lang="less">
.yu-slide-model {
  position: absolute;
  top: 64px;
  width: 100%;
  height: 500px;
  overflow: hidden;
  z-index: 2000;
}
.proper__model {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0.333rem;
  left: 0;
  z-index: 1999;
  background-color: rgba(0, 0, 0, 0.3);
}
.proper__content {
  position: absolute;
  z-index: 2000;
  box-shadow: 0 0 3px #fff;
  background-color: #fff;
}
.proper__left {
  width: 224px !important;
  top: 0px;
  bottom: 0;
  left: 0;
  height: 100%;
  padding-top: 20px;
  box-shadow: 0 20px 0 rgba(0,0,0,.12), 0 0 20px 0 rgba(0,0,0,.04);
}
.proper__right {
  box-sizing: border-box;
  bottom: 0;
  right: 0;
  height: 100%;
  padding-top: 20px;
}
.proper__top {
  box-sizing: border-box;
  top: 0;
  left: 0;
  width: 100%;
  padding-top: 20px;
}
.proper__bottom {
  bottom: 0;
  left: 0;
  width: 100%;
  padding-top: 20px;
}
</style>
