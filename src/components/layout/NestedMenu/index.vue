<!--
  @created by helin3 2019-04-15
  @updated by
  @description 通用菜单嵌套路由，用于多级菜单嵌套路由Component配置
-->
<template>
  <div>
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'NestedMenu',
  data: function () {
    return {
      path: this.$route.fullPath
    }
  },
  computed: {
    cachedViews() {
      const cvs = ['App', 'AppMain', 'Layout', 'NestedMenu'];
      const views = this.$store.state.tagsView.cachedViews.filter(
        view => !!view && !!view.name
      )
      views.forEach(element => {
        cvs.push(element.name.replace('-', ''))
      })
      // uuid生成的name，如果以数字开头需要添加字母来满足组件命名要求
      return cvs.map(name => !isNaN(parseInt(name.slice(0, 1))) ? ("P" + name) : name)
    },
  },
  watch: {
    "$store.state.tagsView.cachedViews": function(val) {
      // 关闭页签后，手动destory当前组件，否则再次打开时会有缓存
      try {
        const cachedViews = val
        const findInCache = cachedViews.find(v => v.path === this.path)
        if (!findInCache) { // 说明是关闭了路由，不是切换
          if (this.$vnode.parent.tag.includes('keep-alive')) {
            // 从cache中销毁
            const {cache} = this.$vnode.parent.componentInstance;
            const cacheKeys = Object.keys(cache)
            const delKey = cacheKeys.find(key => key.includes(this.path))
            delKey && (cache[delKey] = null)
            Reflect.deleteProperty(cache, delKey)
            this.$destroy() // 调用组件的销毁
          }
        }
      } catch (error) {
      }
    }
  }
};
</script>
