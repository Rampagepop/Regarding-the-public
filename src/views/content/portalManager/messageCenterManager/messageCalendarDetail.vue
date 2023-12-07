<!--
  @Created by liuyw6@yusys.com.cn 2021-05-26
  @updated by
  @description 消息中心
-->
<template>
  <yu-xdialog
    :title="$t('messageCenterManager.sjtx')"
    :visible.sync="eventDialogVisible"
  >
    <yu-xform
      ref="cardForm"
      v-model="calendarFormData"
      form-type="details"
      label-width="100px"
    >
      <yu-xform-group :column="1">
        <yu-xform-item
          :label="$t('messageCenterManager.sjmc')"
          name="eventName"
        ></yu-xform-item>
        <yu-xform-item
          :label="$t('messageCenterManager.kssj')"
          name="startDate"
        ></yu-xform-item>
        <yu-xform-item
          :label="$t('messageCenterManager.jssj')"
          name="endDate"
        ></yu-xform-item>
        <yu-xform-item
          :label="$t('messageCenterManager.ts')"
          name="remindTime"
          ctype="radio"
          data-code="REMIND_TIME"
        ></yu-xform-item>
        <yu-xform-item
          :label="$t('messageCenterManager.cf')"
          name="repeated"
          ctype="radio"
          data-code="REPEATED_TYPE"
        ></yu-xform-item>
        <yu-xform-item
          :label="$t('messageCenterManager.zy')"
          name="important"
          ctype="radio"
          data-code="IMPORTANT_TYPE"
        ></yu-xform-item>
        <yu-xform-item
          :label="$t('messageCenterManager.sjms')"
          name="eventDesc"
        ></yu-xform-item>
        <yu-xform-item class="task-info-czy" :label="$t('messageCenterManager.rwxx')" ctype="textarea" @click.native.stop="showprovemessage" name="relatedEventInfo"></yu-xform-item>
      </yu-xform-group>
    </yu-xform>
  </yu-xdialog>
</template>
<script>
import { clone } from "@/utils";
export default {
  name: "YuCalendarDetail",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: [String, Number],
      require,
    },
  },
  data() {
    return {
      // eventDialogVisible: this.visible,
      calendarFormData: {},
    };
  },
  computed: {
    eventDialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },
  watch: {
    relatedId(val) {
      this.loadCalendarData();
    },
  },
  methods: {
    //点击任务信息显示功能正在开发中
    showprovemessage() {
      this.$message(`功能开发中，敬请期待。`)
    },
    loadCalendarData() {
      // 加载日历事件
      this.$request({
        url: backend.portalService + "/api/xmhcalender/info/" + this.relatedId,
      }).then(({ code, message, data, total }) => {
        if (code === "0") {
          clone(data, this.calendarFormData);
          this.eventDialogVisible = true;
        } else {
          this.$message({
            message: message,
            type: "error",
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-date-table td.today {
  color: #2877ff;
}
.blue .el-date-table td.today {
  color: #fff;
}
/deep/ .el-form-details .task-info-czy .el-form-item__content{
  cursor: pointer;
  /* width:100%; */
  color:#2877FF;
}
</style>
