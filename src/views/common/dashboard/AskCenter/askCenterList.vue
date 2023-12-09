/**
 * @created by pan
 * @updated by helin3 2019-04-06
 * @description 通知公告二级页面
 */
<template>
  <div class="askcenterlist">
    <yu-panel ref="panel" title="通知公告" panel-type="normal">
      <!-- <template slot="right">
        <yu-toolBar>
          <el-button class="btn-cls" size="small" @click="allRead" :disabled="btnDisabled">{{ btnText }}</el-button>
        </yu-toolBar>
      </template> -->
      <template slot="filter">
        <yu-xform ref="refSearchForm" v-model="formdata1" related-table-name="refTable" form-type="search" :remove-empty="true" :rules="otherRules">
          <yu-xform-group :column="3">
            <yu-xform-item label="关键词" placeholder="公共标题或公告内容" ctype="input" name="keyWord"></yu-xform-item>
            <yu-xform-item label="公共类型" placeholder="请选择公共类型" ctype="select" name="infType" data-code="CBT_INFO_MATION"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <yu-xtable request-type="POST" ref="refTable" row-number :data-url="dataUrl" :base-params="dataParams" @selection-change="rowSelectFn">
        <yu-xtable-column label="公告类型" prop="infType" width="100px">
          <template slot-scope="scope">
            <i :class="['ask-item-icon', 'icon-' + scope.row.infType]"></i>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="公告标题" prop="infTitle">
          <template slot-scope="scope">
            <a :class="getAskClass(scope.row)" @click="viewDetail(scope.row)">
              {{ scope.row.infTitle }}
            </a>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="发布日期" prop="releaseDate" width="160px"></yu-xtable-column>
        <yu-xtable-column label="是否置顶" prop="reminded" width="80px" data-code="CBT_IMPORTANT_TYPE"></yu-xtable-column>
        <yu-xtable-column label="是否重要" prop="important" width="80px" data-code="CBT_IMPORTANT_TYPE"></yu-xtable-column>
        <yu-xtable-column label="发布人" prop="releaseUserName" width="120px"></yu-xtable-column>
        <yu-xtable-column label="所属机构" prop="releaseOrgName" width="120px"></yu-xtable-column>
        <yu-xtable-column label="浏览次数" prop="readTotalNum" width="120px"></yu-xtable-column>
      </yu-xtable>
    </yu-panel>
  </div>
</template>

<script>
import { modifyStatus, getMessagesHasNoRead } from "@/api/portal/backstageAdmin.js";
import { clone, extend, lookup } from '@/utils'
import backend from '@/config/constant/app.data.service'
import { validator } from "@/utils/validate";

lookup.reg('CBT_INFO_MATION,CBT_IMPORTANT_TYPE')
export default {
  name: "AskCenterList",
  data() {
    return {
      dataUrl: `${backend.portalService}/api/xmhinformation/userinformationpage`,
      isLoading: false, // 是否在加载数据
      btnDisabled: false,
      btnShow: true,
      selectionLength: 0,
      formdata1: {},
      dataParams: { status: 3 },
      btnText: this.$t("dashboard.allRead"),
      otherRules: {
        keyWord: [
          { max: 32, message: '最多输入32个字符', trigger: 'blur'},
          { validator: validator.speChar, message: '输入信息包含特殊字符'}
        ]
      }
    };
  },
  computed: {
    // len() {
    //   if (this.$refs.refTable && this.$refs.refTable.selections) {
    //     console.log(this.$refs.refTable.selections.length)
    //     return this.$refs.refTable.selections.length;
    //   }
    //   return false;
    // },
    // btnText() {
    //   return this.selectionLength === 1 ? this.$t("dashboard.read") : this.$t("dashboard.allRead");
    // }
  },
  mounted() {
    this.isDisabled();
  },
  methods: {
    rowSelectFn(selection, row) {
      this.btnText = selection.length === 1 ? this.$t("dashboard.read") : this.$t("dashboard.allRead");
    },
    isDisabled() {
      // 调用接口查询是否有未读数据，存在则"全部未读"按钮有效
      getMessagesHasNoRead({
        msgType: 3, // 消息类型，1-待办提醒(待办)、2-业务消息（消息）、3-提示事件(提醒)、0-全部
        remindType: 2, // 消息提醒类型 1-风险预警、2-资讯、3-到期提醒、4-日历日程、0-全部
        readed: 0, // 是否已读，1-是，0-否
      }).then((res) => {
        if (res.code === "0") {
          this.btnDisabled = res.data.length === 0;
        }
      });
    },
    // 获取资讯要闻样式
    getAskClass(item) {
      const cls = ["underline", "ask-center-time"];
      item.readed === 0 && cls.push("un-read");
      item.important === 1 && cls.push("is-important");
      return cls.join(" ");
    },
    // 跳转到详情
    viewDetail(item) {
      const tarRoute = this.$router.match("/askcenter/" + item.id);
      this.$router.push({path: tarRoute.path});
    },
    // 全部已读设置
    allRead() {
      // if(!this.$refs.refTable.selections.length) {
      //   this.$message({
      //     type: 'warning',
      //     message: this.$t("card.askInfo.needSelectOne")
      //   })
      //   return;
      // }
      modifyStatus({ type: 0 }).then((res) => {
        if (res.code === "0") {
          this.$message.success(this.$t("card.askInfo.readedSuccess"));
          if (!this.isLoading) {
            // this.getList();
            this.$refs.refTable.remoteData(this.formdata1)
          }
          this.isDisabled();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/variables.scss";
.askcenterlist {
  .ask-center-time {
      display: inline-block;
      line-height: 14px;
      padding-right: 20px;
      color: #000;
      opacity: 0.5;
      text-align: left;
      width: 100%;
      &.un-read {
        font-weight: 700;
        opacity: 1;
      }

      &.is-important {
        color: $baseRed;
        margin-right: 8px;
      }
      &.is-import-unless {
        width: 32px;
        display: inline-block;
        margin-right: 4px;
      }
      .ask-item-icon {
        margin-right: 8px;
      }
    }
}
</style>
