
<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t('wfmeetpage.title') }}</span>
      </div>
      <yu-xtable ref="gatherList" :data-url="urls.dataUrl" :pageable="false" :request-type="requestType" :base-params="dataParams" :default-load="false">
        <yu-xtable-column :label="$t('wfmeetpage.lcslh')" prop="instanceId" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetpage.meetsub')" prop="mettingSub" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetpage.meetyear')" prop="mettingYear" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetpage.meetno')" prop="mettingNo" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetpage.username')" prop="userName" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetpage.starttime')" prop="startTime" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetpage.endtime')" prop="endTime" :resizable="true" align="center"></yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetpage.meetstate')" prop="voteSts" :resizable="true" align="center">
          <template slot-scope="scope">                
            <span style="color:green;" v-if="scope.row.voteSts=='Y'">{{ $t('wfvotestate.votestatey') }}</span>
            <span style="color:red;" v-if="scope.row.voteSts=='N'">{{ $t('wfvotestate.votestaten') }}</span>
            <span style="color:orange;" v-if="scope.row.voteSts=='G'">{{ $t('wfvotestate.votestateg') }}</span>
            <span style="color:#20A0FF;" v-if="scope.row.voteSts==null">{{ $t('wfvotestate.votestatee') }}</span>
          </template>
        </yu-xtable-column>
        <yu-xtable-column :label="$t('wfmeetpage.meetcomm')" prop="mettingComment" :resizable="true" align="center"></yu-xtable-column>
      </yu-xtable>
    </el-card>
  </div>
</template>
<script>
const data = {}
export default {
  props: {
    bizPageData: {
      // 评论信息
      type: Object,
      default: function () {
        return null;
      },
    },
  },
  data: function () {
    return {
      urls: {
        dataUrl: backend.workflowService + '/api/metting/myOp'
      },
      requestType: 'POST',
      instanceId: null,
      dataParams: {},
    };
  },
  mounted() {
    const data = this.bizPageData === null ? this.$route.params : this.bizPageData;
    this.dataParams = {
      instanceId: data.instanceId,
    }
    this.instanceId = data.instanceId;
  },
  methods: {}

}
</script>
