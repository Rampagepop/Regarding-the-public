
<template>
  <yu-panel :title="$t('wftaskpoollist.title')" panel-type="normal" class="adjust-height" no-padding-top>
    <template slot="filter">
      <yu-xform v-model="formdata" related-table-name="reftable" ref="searchForm" :custom-search-fn="searchFn" :custom-reset-fn="resetFn" form-type="search">
        <yu-xform-group :column="3">
          <yu-xform-item :label="$t('wftaskpoollist.poolid')" :placeholder="$t('wftaskpoollist.poolid')" ctype="input" name="poolId"></yu-xform-item>
          <yu-xform-item :label="$t('wftaskpoollist.poolname')" :placeholder="$t('wftaskpoollist.poolname')" ctype="input" name="poolName"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
    </template>
    <yu-xtable ref="reftable" :row-index="true" :base-params="baseParams" :data-url="urls.index" request-type="POST">
      <yu-xtable-column :label="$t('wftaskpoollist.poolname')" prop="poolName" :resizable="true"></yu-xtable-column>
      <yu-xtable-column :label="$t('wftaskpoollist.poolid')" prop="poolId" :resizable="true"></yu-xtable-column>
      <yu-xtable-column :label="$t('wftaskpoollist.todonum')" prop="num" :resizable="true"></yu-xtable-column>
      <yu-xtable-column :label="$t('wftaskpoollist.option')" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="customRowOp(scope,'edit')">{{ $t('wftaskpoollist.info') }}</el-button>
        </template>
      </yu-xtable-column>
    </yu-xtable>
  </yu-panel>
</template>
<script>
import { mapGetters } from "vuex"
import { sessionStore } from '@/utils'
import { VIEW_SIZE } from '@/config/constant/app.data.common'
export default {
  data: function () {
    var _this = this;

    return {
      formdata: {},
      urls: {
        index: backend.workflowService + '/api/wf/bench/userTaskPoolByModel'
      },
      baseParams: {},
      height: sessionStore.get(VIEW_SIZE).height - 103
    };
  },
  computed: {
    ...mapGetters([
      "userCode"
    ])
  },
  watch: {
    $route(val) {
      if (val.params.rollback) {
        this.searchFn();
      }
    },
  },
  created () {
    this.baseParams = {
      userId: this.userCode
    }
  },
  methods: {
    customRowOp: function (scope, op) {
      // 当前行号：scope.$index
      // 当前行数据：scope.row
      // 当前列对象：scope.column
      // this.$alert('你现在正在操作：' + op + '当前行ID值为：' + scope.row.flowId, '提示');
      if (op == 'edit') {
        var query = {
          routeid: Date.now(),
          poolName: scope.row.poolName,
          poolId: scope.row.poolId,
          returnBackFuncId: this.$route.name,
          returnBackRootId: this.$route.name
        };
        this.$router.replace({name: 'taskpoolinfo', query});
      }
    },
    searchFn: function () {
      var _this = this;
      _this.$refs.searchForm.validate(function(valid) {
        if (valid) {
          var model = _this.$refs.searchForm.formdata;
          var params = {
            userId: _this.userCode,
            poolName: model.poolName ? model.poolName : "",
            poolId: model.poolId ? model.poolId : ""
          };

          var param = {
            condition: JSON.stringify(params)
          };

          _this.$refs.reftable.remoteData(params);
        }
      })
    },
    // 自定义重置功能
    resetFn: function () {
      this.$refs.searchForm.resetFields();
      this.$refs.reftable.remoteData();
    },
    /**
     * 快速查询
     * @param e 模糊查询关键字
     */
    fuzzyQuery: function(e) {
      var params = {
        userId: this.userCode,
        poolId: e.value
      };
      var param = {
        condition: JSON.stringify(params)
      };
      this.$refs.reftable.remoteData(params);
      this.$refs.searchForm.resetFields(); // 清空精确查询查询参数
    }
  }

}
</script>
