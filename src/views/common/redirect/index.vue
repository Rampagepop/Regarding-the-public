<!--
  @created by pan
  @updated by helin3 2010-04-06
  @description 通用跳转（重定向）路由
-->
<script>
export default {
  beforeRouteEnter(to, from, next) {
    // const { params, query } = this.$route
    // const { path } = params
    next(vm => {
      // const { name, params, query } = from
      // vm.$router.replace({ name, query, params})
      vm.$router.replace({path: from.path, query: from.query})
    })
  },
  render: function(h) {
    return h('div') // avoid warning message
  }
}
</script>
