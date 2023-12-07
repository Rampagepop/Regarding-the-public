<template>
  <div>
    <WorkTravel :workTravelData="workTravelData" v-if="visible"></WorkTravel>
  </div>
</template>
<script>
import WorkTravel from '@/views/workflow/studio/wfmonitor/workTravel/workTravel.vue';

export default {
  name: 'CdpFlowTrail',
  components: { WorkTravel },
  data: function () {
    return {
      workTravelData: {},
      visible: false,
      showNotice: false,
      // getInstanceByBiz: backend.workflowService + "/api/core/getInstanceByBiz",
      // getInstanceByBiz: backend.workflowService + '/api/wfext/q/instinfo'
      todo: backend.workflowService + '/api/bench/todo',
      his: backend.workflowService + '/api/bench/his'
    };
  },
  methods: {
    /**
     * 通过bizId找到对应的流程实例信息，用于传递过去加载流程轨迹，
     * 由于后端没有提供一个bizId查询实例信息，只能通过查询待办和已办两个接口去处理
     */
    getInstanceInfo(bizId) {
      return new Promise((resove, reject) => {
        this.$request({
          method: 'GET',
          url:  this.todo,
          data: {
            condition: JSON.stringify({bizId: bizId})
          }
        }).then((res) => {
          if (res && res.data && res.data.length > 0) {
            resove(res.data[0])
          } else {
            this.$request({
              method: 'GET',
              url:  this.his,
              data: {
                condition: JSON.stringify({bizId: bizId})
              }
            }).then((res) => {
              if (res && res.data && res.data.length > 0) {
                resove(res.data[0])
              } else {
                reject(false)
              }
            })
          }
        })
      })
    },
    /**
     * this.$refs.flowTrail.openTrail({
        bizId: '1660037963704'
      })
     */
    openTrail(data) {
      this.getInstanceInfo(data.bizId).then((data) => {
        this.visible = true;
        this.workTravelData = data;
      }).catch(() => {
        this.showNotice = true;
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.el-alert--warning{
  background-color:#fff !important;
}
::v-deep .el-alert__icon {
  color:#f7ba2a !important;
  .is-big{
    color:#f7ba2a !important;
  }
}
.el-alert{
  color:black !important;
 
}
::v-deep .el-alert .el-alert__description{
    color:black !important;
   }
</style>