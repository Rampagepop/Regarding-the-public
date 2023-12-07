/* eslint camelcase:0 */
import store from '@/store'
const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  data: function () {
    return {
      pageHeight: "420px", //顶级容器高度
      heightTable: 400, //table父容器高度
      hiddenfilter:false,
      pageFilterLableWidth:"130px",
    };
  },
  computed: {
    $_getPageHeight() { //此计算属性 赋值给 xtable 等 元素的 :max-height="$_getTableHeight" :height="$_getTableHeight"
      return this.pageHeight;
    },
    $_getTableHeight() { //此计算属性 赋值给 xtable 等 元素的 :max-height="$_getTableHeight" :height="$_getTableHeight"
      return this.heightTable;
    },
    $_getTableHeight2() { //此计算属性 赋值给 xtable 等 元素的 :max-height="$_getTableHeight" :height="$_getTableHeight"
      return (this.heightTable - 78);
       
    },
    $_getPanelHeight() { //此计算属性 赋值给 xtable 等 元素的 :max-height="$_getTableHeight" :height="$_getTableHeight"
      return this.heightTable + 10 + 'px';
    }
  },
  watch: {
    $route(to, from) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('app/closeSideBar', { withoutAnimation: false })
      } 
    }
  },
  beforeDestroy() {
    const isMobile = this.$_isMobile();
    if (!isMobile) {
      window.removeEventListener('resize', this.$_reSetinitClientHW)
    }
  },
  mounted() {
    const isMobile = this.$_isMobile();
    if (!isMobile) {
      window.addEventListener('resize', this.$_reSetinitClientHW);
      this.$nextTick(function () {
        this.hiddenfilter = false;
        this.$_reSetinitClientHW();
      });
    }
  },
  methods: {
    $_toggleFn(_booblen) {
      var _this = this;
      console.log(`/Users/xiapengxie/crdt_bank_web/src/components/layout/mixin:查询栏${_booblen ? "展开" : "收起"}`);
      console.log("line44:", this.hiddenfilter, _booblen);
      this.hiddenfilter = _booblen;
      // setTimeout(function() {
      // }, 100);
      this.$nextTick(function () {
        _this.$_reSetClientHW();
      });
    },
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    
    $_reSetinitClientHW: function () {
      //panelrootbox 包含 filterTbox 和 xtable 等 ；用于动态设置 xtable的高度；
      var _this = this, heightP = parseInt(
        window.getComputedStyle(_this.$refs.panelrootbox).height
      );
      this.pageHeight = heightP - 100 + "px";
      if (this.$refs.panelrootbox && this.$refs.filterTbox) {
        heightP = parseInt(
          window.getComputedStyle(_this.$refs.panelrootbox).height
        );
        
        var heightH = parseInt(window.getComputedStyle(_this.$refs.filterTbox).height) || 0;

        if(this.hiddenfilter) {
          console.log("line84", heightP, heightH)
          this.heightTable = parseInt(heightP - heightH - 145);
        } else {
          console.log("line87", heightP, heightH)
          this.heightTable = parseInt(heightP - heightH - 107); 
        }
      } else { 
        this.heightTable = 200; 
      }
      this.$nextTick(function () {
        //_this.$_reSetClientHW();
      });
    },
    $_reSetClientHW: function () {
      //panelrootbox 包含 filterTbox 和 xtable 等 ；用于动态设置 xtable的高度；
      var _this = this, heightP = parseInt(
        window.getComputedStyle(_this.$refs.panelrootbox).height
      );
      _this.pageHeight = heightP - 100 + "px";
      console.log(_this.pageHeight + "=====");

      if (this.$refs.panelrootbox && this.$refs.filterTbox) {
        heightP = parseInt(
          window.getComputedStyle(_this.$refs.panelrootbox).height
        ); 
        console.log(_this.pageHeight + "=====");
        var heightH = parseInt(window.getComputedStyle(_this.$refs.filterTbox).height) || 0;

        if(this.hiddenfilter) {
          console.log("line113", heightP, heightH)
          this.heightTable = parseInt(heightP - heightH - 107);
        } else {
          console.log("line116", heightP, heightH)
          this.heightTable = parseInt(heightP - 90); 
        }
      } else { 
        this.heightTable = 300; 
      }
      this.$nextTick(function () {
      });
    }
  }
}
