<template>
  <yu-tabs type="card" @tab-click="handleClick" v-model="activeName">
    <yu-tab-pane label="贷审会投票" name="dsh">
      <d1-billlist v-if="active === 'dsh'"></d1-billlist>
    </yu-tab-pane>
    <yu-tab-pane label="三人会商投票" name="srhs">
      <d2-billlist v-if="active === 'srhs'"></d2-billlist>
    </yu-tab-pane>
  </yu-tabs>
</template>
<script>
import d1Billlist from '@/views/workflow/bench/metting/dshvotepage.vue';
import d2Billlist from '@/views/workflow/bench/metting/srhsvotepage.vue';

export default {
  components: { d1Billlist, d2Billlist },
  props: {
  },
  data () {
    return {
      activeName: 'dsh',
      active: 'dsh'
    };
  },
  mounted () {
  },
  methods: {
    handleClick() {
      if(this.activeName === 'dsh') {
        this.active = 'dsh'
      } else {
        this.active = 'srhs'
      }
    }
  }
};
</script>
