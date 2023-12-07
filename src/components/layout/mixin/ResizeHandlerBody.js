/* eslint camelcase:0 */
import store from '@/store'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  data: function () {
    return {
      heightTable: 400
    };
  },
  computed: {
    $_getTableHeight() { //此计算属性 赋值给 xtable 等 元素的 :max-height="$_getTableHeight" :height="$_getTableHeight"
      return this.heightTable;
    }
  },
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('app/closeSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeDestroy() {
    const isMobile = this.$_isMobile();
    if (!isMobile) {
      window.removeEventListener('resize', this.$_reSetClientHW)
    }
  },
  mounted() {
    const isMobile = this.$_isMobile();
    if (!isMobile) {
      window.addEventListener('resize', this.$_reSetClientHW)
      this.$nextTick(function() {
        this.$_reSetClientHW();
      }); 
    }
  },
  methods: {
    $_toggleFn() {},
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('app/closeSideBar', { withoutAnimation: true })
        } 
      }
    },
    $_reSetClientHW: function () {
      //panelrootbox 包含 filterTbox 和 xtable 等 ；用于动态设置 xtable的高度；
      var _this = this;
      if (this.$refs.panelrootbox && this.$refs.filterTbox) {
        var heightP = parseInt(
          window.getComputedStyle(_this.$refs.panelrootbox).height
        );
        var heightH = parseInt(
          window.getComputedStyle(_this.$refs.filterTbox).height
        );
        this.heightTable = parseInt(heightP - heightH - 60);
      } else {
        this.heightTable = 500;
      }
    }
  }
}
