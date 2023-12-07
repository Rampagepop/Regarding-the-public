
<template>
  <!-- 必须全局拥有唯一的id -->
  <div>
    <yu-timeline class="todo-process" v-if="timelineItems.length">
      <yu-timeline-item v-for="(item, index) in timelineItems" :key="index" :timeline-items="timelineItems">
        <div slot="title">
          {{ item.nodeName }}
          <span class="processTag" :class="'processTag' + item.processType">{{ item.commentSign }}</span>
        </div>
        <div slot="date">{{ item.startTime }}</div>
        <div slot="description">
          <ul>
            <li>
              <span>审批人：{{ item.userName }}&emsp;工号：{{ item.userId }}</span>
            </li>
            <li>
              <span v-if="item.commentSign !== '唤醒'">审批时长：{{ item.time }}({{ item.timeType }})</span>
              <span v-if="item.commentSign === '唤醒'">审批时长：{{ item.time }}({{ item.timeType }})</span>
            </li>
            <li style="word-break: break-all">
              <span>审批说明：{{ item.userComment }}</span>
            </li>
          </ul>
        </div>
      </yu-timeline-item>
    </yu-timeline>
  </div>
</template>
<script>
/* eslint vue/html-indent: 0 */
/* eslint no-tabs: 0 */

export default {
  name: '',
  props: {
    bizPageData: {
      // 评论信息
      type: Array,
      default: function () {
        return null;
      },
    },
  },
  data: function () {
    return {
      timelineItems: [],
      instanceId: null,
    };
  },
  mounted() {
    const data = this.bizPageData == null ? this.$route.params : this.bizPageData;
    this.instanceId = data.instanceId;
    this.initData();
  },
  methods: {
    initData: function () {
      //
      this.$request({
        url: backend.workflowService + '/api/core/allComments',
        method: 'GET',
        data: { instanceId: this.instanceId },
      }).then((response) => {
        if (response && response.data) {
          this.convertTimeItems(response.data);
        }
      });
    },
    convertTimeItems: function (items) {
      items.forEach((item) => {
        this.trans(item);
        item.commentSign = item.commentSign ? yufp.lookup.convertKey('OP_TYPE', item.commentSign) : '未审批';
      });
    },
    trans: function (item) {
      var day = 86400,
        hour = 3600,
        d = 3;
      item.processType = item.commentSign;
      if (item.approvalTime) {
        var time = parseInt(item.approvalTime);
        if (time > day) {
          var a = time / day;
          item.time = a.toFixed(d);
          item.timeType = '天';
        } else {
          var a = time / hour;
          item.time = a.toFixed(d);
          item.timeType = '小时';
        }
      } else {
        item.time = 0.0;
        item.timeType = '小时';
      }
    },
  },
};
</script>

