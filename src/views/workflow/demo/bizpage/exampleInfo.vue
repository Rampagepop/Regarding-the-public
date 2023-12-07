
<template>
  <!-- 必须全局拥有唯一的id -->
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t('wfexample.khsqxx') }}</span>
      </div>
      <el-collapse v-model="collapseValue" accordion>
        <el-collapse-item :title="$t('wfexample.flowinfo')" name="1">
          <el-form ref="form" :model="form" label-width="120px">
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item :label="$t('wfexample.ywlsh')">
                  <el-input v-model="form.bizId" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('wfexample.lcslh')">
                  <el-input v-model="form.instanceId" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item :label="$t('wfexample.node')" v-if="form.nodeName != null">
                  <el-input v-model="form.nodeName" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('wfexample.nodeuser')"
                  v-if="form.currentUserId != null"
                >
                  <el-input v-model="form.currentUserId" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item :label="$t('wfexample.biztype')">
                  <el-input v-model="form.bizType" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('wfexample.flowname')">
                  <el-input v-model="form.flowName" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item :title="$t('wfexample.bizinfo')" name="2">
          <el-form ref="bizform" label-width="120px">
            <el-form-item v-for="it in flowParam" :label="it.key" :key="it.key">
              <el-input v-model="it.value"></el-input>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>
<script>
/* eslint vue/html-indent: 0 */
/* eslint no-tabs: 0 */

export default {
  name: "",
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
      form: {},
      flowParam: {},
      item: [],
      collapseValue: "1",
    };
  },
  mounted() {
    const data = this.bizPageData == null ? this.$route.params : this.bizPageData;
    this.form = data.instanceInfo;
    this.flowParam = data.flowParam;
  },
  methods: {
    saveFn: function () {
      //把业务参数传回主详情页面用于提交
    },
  },
};
</script>
