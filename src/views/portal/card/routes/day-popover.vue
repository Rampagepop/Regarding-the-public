<template>
  <div>
    <el-popover
      popper-class="calendar-day-Pover"
      ref="dayPopover"
      placement="left-start"
      :visible-arrow="false"
      :offset="0"
      :open-delay="200"
      :close-delay="10"
      trigger="hover"
    >
      <div class="day-popover-content" v-if="flag">
        <div>
          <div class="popover-time">{{ year }}-{{ month > 9 ? month : `0${month}` }}-{{ day > 9 ? day : `0${day}` }}</div>
          <div class="event-item-wrap">
            <div class="event-item" v-for="(v,i) in item.eventName" :key="i">
              <div class="event-name">
                <div @click.stop="showEventDetail(v.id, v.sysDate)">{{ v.eventName }}</div>
                <span class="important" v-if="v.eventType && v.eventType == '11'">重要</span>
                <span class="level" v-if="v.repeated && v.repeated != '1'">{{ repeatMap[v.repeated] }}</span>
              </div>
              <div class="event-date">{{ v.eventDate?v.eventDate.substr(0,v.eventDate.length-3):'' }} - {{ v.endDate?v.endDate.substr(0,v.endDate.length-3):'' }}</div>
              <div class="delete-box" title="删除" @click.stop="deleteEvent(v)">
                <svg-icon icon-class="delete2"></svg-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="add-event">
          <yu-button @click.stop="addEvent">新增事件</yu-button>
        </div>
      </div>
      <div class="day-no-content" v-else>
        <div class="popover-time">{{ year }}-{{ month > 9 ? month : `0${month}` }}-{{ day > 9 ? day : `0${day}` }}</div>
        <svg-icon class="day-no-img" icon-class="no-data"></svg-icon>
        <div class="day-no-text">
          <span>当日无事件</span>
          <span class="day-no-add" @click.stop="addEvent">新增事件</span>
        </div>
      </div>
    </el-popover>
    <div v-popover:dayPopover :data="item" class="item-img">
      <div @click="handleClickDay"
           class="por-day"
           :class="[nowDay ? 'nowDay':'', clickedDay ? 'clickedDay':'']">
        {{ day }}
        <span class="schedule-flag" :class="[item.hasImportantEvent ? 'schedule-flag-red': '']" v-if="flag">
          <span>{{ item.eventName.length > 99 ? '99' : item.eventName.length }}</span>
        </span>
        <span class="festival" v-if="item.festival"></span>
        <span class="week-work" v-if="item.weekWork"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "day-popover",
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    day: {
      type: Number,
      default: 1
    },
    year: {
      type: Number,
      default: 1
    },
    month: {
      type: Number,
      default: 1
    },
    clickedDay: {
      type: Boolean,
      default: false
    },
    flag: {
      type: Boolean,
      default: false
    },
    nowDay: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      repeatMap: {
        1: '不重复',
        2: '每天',
        3: '每周',
        4: '每月',
        5: '每年'
      }
    }
  },
  mounted() {},
  methods: {
    handleClickDay() {
      this.$emit('dayClick', {
        day: this.day,
        item: this.item
      })
    },
    addEvent() {
      this.$emit('addEvent', this.day)
    },
    showEventDetail(id, sysDate) {
      this.$emit('showEventDetail', id, sysDate)
    },
    deleteEvent(item) {
      this.$emit('deleteEvent', item)
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-dialog-x__body{
    overflow-x: hidden;
  }
.por-day {
  position: relative;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;
  border: 2px solid transparent;
  border-radius: 2px;

  &:hover {
    color: #2877FF;
    border-color: #2877FF;
  }
  .schedule-flag {
    position: absolute;
    top: 0;
    right: 0;
    width: 14px;
    height: 14px;
    text-align: center;
    line-height: 14px;
    font-size: 0;
    color: #fff;
    background: #2877FF;
    border-radius: 7px;
    span {
      display: inline-block;
      font-size: 12px;
      -webkit-transform: scale(0.83333);
    }
  }
  .schedule-flag-red {
    background: #FF3B30;
  }
  .festival,.week-work {
    position: absolute;
    bottom: 1px;
    left: 50%;
    margin-left: -2px;
    width: 4px;
    height: 4px;
    border-radius: 2px;
  }
  .festival {
    background: #D8D8D8;
  }
  .week-work {
    background: #FF3B30;
  }
}
.popover-time {
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  line-height: 32px;
}
.day-popover-content {
  box-sizing: border-box;
  width: 480px;
  padding: 10px 0 16px 16px;
  box-shadow: 0px 0px 8px 0px rgba(38, 38, 38, 0.3);
  border-radius: 4px;
}
.event-item-wrap {
  padding-right: 16px;
  max-height: 252px;
  overflow-y: auto;
}
.event-item {
  position: relative;
  padding-bottom: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  border-bottom: 1px solid #EDEDED;
  &:last-of-type {
    border: 0 none;
  }
  .event-name {
    color: #333;
    cursor: pointer;
    & > div {
      display: inline-block;
      vertical-align: middle;
      line-height: 28px;
      max-width: 280px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    span {
      display: inline-block;
      vertical-align: middle;
      margin-left: 8px;
      padding: 0 6px;
      height: 18px;
      line-height: 18px;
      font-size: 12px;
      color: #fff;
      border-radius: 2px;
    }
    .important {
      background: #FF3B30;
    }
    .level {
      background: #11BD19;
    }
  }
  .event-date {
    line-height: 28px;
    color: #666;
  }
  .edit-box {
    display: none;
  }
  .delete-box {
    display: none;
    position: absolute;
    right: 0;
    top: 18px;
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 16px;
    color: #666666;
    border: 1px solid #E0E0E0;
    box-shadow: 0px 2px 2px 0px rgba(1, 1, 1, 0.06);
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      color: #2877FF;
    }
  }
  &:hover {
    .event-name {
      color: #2877FF;
    }
    .edit-box {
      display: block;
    }
    .delete-box {
      display: block;
    }
  }
}
.add-event {
  position: relative;
  padding-top: 16px;
  text-align: center;
  &:after {
    position: absolute;
    content: '';
    left: -16px;
    right: -16px;
    top: 0;
    height: 1px;
    background: #EDEDED;
  }
}
.day-no-content {
  box-sizing: border-box;
  padding: 10px 16px 16px;
  width: 304px;
  height: 200px;
  box-shadow: 0px 0px 8px 0px rgba(38, 38, 38, 0.3);
  border-radius: 4px;
  .day-no-img {
    float: none;
    display: block;
    margin: 9px auto 0;
    font-size: 82px;
  }
  .day-no-text{
    margin-top: 2px;
    text-align: center;
    span {
      display: inline-block;
      line-height: 40px;
      font-size: 14px;
      color: #666666;
    }
    .day-no-add {
      color: #2877FF;
      cursor: pointer;
    }
  }
}

</style>
<style lang="scss">
  .calendar-day-Pover {
    margin: 0 !important;
    padding: 0 !important;
    border: 0 none !important;
  }
</style>
