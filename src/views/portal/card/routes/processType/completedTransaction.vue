/**
* Desc:&emsp;&ensp;完成事项
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/10/26
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-wrap :cardName="$t('card.complTrans.title')" no-padding>
    <div class="trans-wrap" v-if="transList.length">
      <div class="trans-item" v-for="(item,i) in transList" :key="i" @click="jumpProcessCenter(item)">
        <div class="value">{{ item.value }}</div>
        <div class="label">{{ item.label }}</div>
      </div>
    </div>
    <empty-img v-else></empty-img>
    <template slot="menus">
      <li @click="dialogVisible=true">
        {{ $t("card.complTrans.edit") }}
      </li>
      <li @click="jumpProcessCenter()">
        {{ $t("card.complTrans.more") }}
      </li>
    </template>
    <yu-agent-reminder-edit v-if="dataId"
                            :title="$t('card.complTrans.editTitle')"
                            :visibled.sync="dialogVisible"
                            :card-id="type"
                            :data-map="dataMap"
                            @save="load"></yu-agent-reminder-edit>
  </card-wrap>
</template>

<script>
import cardWrap from "@/views/portal/card/components/card-wrap";
import emptyImg from "@/views/portal/card/components/empty-img";
import YuAgentReminderEdit from "@/views/portal/card/routes/agentReminder-edit";

export default {
  name: "completedTransaction",
  components: {cardWrap, emptyImg, YuAgentReminderEdit},
  mixins: [],
  props: {
    dataId: {
      type: Number,
      require,
    }
  },
  data: function () {
    return {
      type: 1,
      transList: [],
      dataMap: {},
      dialogVisible: false
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.load()
  },
  methods: {
    // 加载数据
    load() {
      this.getTaskTypeList(this.getCompletedData)
    },
    // 获取任务列表 完成事项 1 待办提醒-大 2 待办提醒 3  待办提醒-中 4
    getTaskTypeList(cb) {
      this.$request({
        url: `${backend.portalService}/api/xmhtasktypelog/list/1`,
      }).then((res) => {
        if (res && res.code === "0") {
          cb && cb(res.data)
        }
      });
    },
    // 获取完成事项的数据
    getCompletedData(taskCfg) {
      this.$request({
        url: this.$backend.portalService + "/api/xmhprocess/biztotalByCurUser",
        method: 'POST'
      }).then(({code, message, data}) => {
        if (code === "0") {
          let sum = 0;
          const dataMap = data.reduce((o, item) => {
            o[item.bizType] = item.num;
            sum += item.num
            return o
          }, {})
          this.$set(this, "dataMap", dataMap);
          const dealData = taskCfg.filter(item => dataMap[item.label] != null).slice(0, 6).map(item => {
            if (dataMap[item.label] != null) {
              // sum为最终其他类别中的数量
              sum -= dataMap[item.label];
            }
            return {
              label: item.label,
              value: dataMap[item.label] != null ? dataMap[item.label] : 0
            }
          })
          // 6个以上归为其他
          if (sum > 0) {
            dealData.splice(5, 1, {label: this.$t('card.complTrans.other'), value: sum + dealData[5].value})
          }
          this.transList.splice(0, this.transList.length, ...dealData)
        } else {
          this.$message.error(message)
        }
      })
    },
    // 跳转到进度中心
    jumpProcessCenter(item) {
      const tarRoute = this.$router.match("/portal/card/processCenter/processCenter");
      if (tarRoute) {
        this.$router.push({
          path: tarRoute.path,
          query: Object.assign({activeMode: "allPrepare", mode: 'done'}, item ? {type: item.label} : {})
        })
      } else {
        this.$message.warning(this.$t('card.complTrans.noAccessOfPrcCenter'))
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.trans-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;

  .trans-item {
    flex: none;
    width: 33.3%;
    height: 50%;
    cursor: pointer;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;

    > div {
      flex: none;
      text-align: center;
    }

    .value {
      margin-top: 40px;
      font-size: 24px;
      font-weight: 400;
      color: #1ABE95;
      line-height: 24px;
    }

    .label {
      flex: none;
      display: inline-block;
      margin-top: 10px;
      padding: 0 12px;
      height: 28px;
      background: #F5F5F5;
      border-radius: 4px;
      line-height: 28px;
      font-size: 14px;
      color: #333333;
    }
  }

  // 第二行上边距少一些
  .trans-item:nth-of-type(n+4) {
    .value {
      margin-top: 20px;
    }
  }
}
</style>
