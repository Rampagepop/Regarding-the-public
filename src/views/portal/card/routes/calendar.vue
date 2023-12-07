<!-- eslint-disable comma-spacing -->
<template>
  <div class="calender2">
    <cardWrap :cardName="cardName">
      <template slot="topCenter">
        <div class="date-headers">
          <div class="date-header">
            <div>
              <i class="icon-arrow el-icon-d-arrow-left" @click="handlePrevYear"></i>
              <i class="icon-arrow el-icon-arrow-left" @click="handlePrev"></i>
            </div>
            <div class="date-title">{{ year }}年 {{ month }}月</div>
            <div>
              <i class="icon-arrow el-icon-arrow-right" @click="handleNext"></i>
              <i class="icon-arrow el-icon-d-arrow-right" @click="handleNextYear"></i>
            </div>
          </div>
          <i class="icon-arrow el-icon-plus" @click="addEvent"></i>
        </div>
      </template>
      <div class="h100">
        <div class="date-content">
          <div class="week-header">
            <div v-for="item in ['日','一','二','三','四','五','六']" :key="item">{{ item }}
            </div>
          </div>
          <div class="week-day">
            <div class="every-day" v-for="(item,index) in dayList" :key="index">
              <div v-if="index+1 - beginDay > 0 && index+1 - beginDay <= curDays">
                <dayPopover
                  :item="item"
                  :day="index + 1 - beginDay"
                  :clickedDay="(index+1 - beginDay) === clickedDay"
                  :flag="item.flag"
                  :year="year"
                  :month="month"
                  @dayClick="handleClickDay"
                  @deleteEvent="deleteEvent"
                  @addEvent="addEvent"
                  @showEventDetail="showEventDetail"
                  @freshList="scheduleListNet"
                  :nowDay="year === currentYear && month === currentMonth && currentDay === (index + 1 - beginDay)"></dayPopover>
              </div>
              <div class="other-day" :class="item.flag===true ? 'schedule-flag':''" v-else-if="index+1 - beginDay <= 0">
                {{ index + 1 - beginDay + prevDays }}
              </div>
              <div class="other-day" :class="item.flag===true ? 'schedule-flag':''" v-else>{{
                index + 1 - beginDay - curDays
              }}
              </div>
            </div>
          </div>
        </div>
        <div class="event-group">
          <template v-if="clickDayEvent && clickDayEvent.startDate">
            <span class="event-dot"></span>
            <span class="event-time">{{ updateTimeWithoutS(clickDayEvent.startDate) }}</span>
            <span class="event-name">{{ clickDayEvent.eventName }}</span>
          </template>
          <!--          <div v-for="(item, index) in clickDayEvent" :key="index">{{ item.startDate }} {{ item.eventName }}</div>-->
        </div>
      </div>
    </cardWrap>
    <!-- 添加备忘录 -->
    <yu-xdialog :title="titleMap[type]" custom-class="calendar-edit-dialog" :visible.sync="addMemorandumBook" @close="dialogClose">
      <yu-xform ref="refForm" :rules="rules" :form-type="formType" label-width="120px" v-model="formData">
        <yu-xform-group :column="1">
          <yu-xform-item v-if="editTypeShow" label="编辑模式" ctype="radio" :options="editTypeOption" name="editType" @change="checkEditType"></yu-xform-item>
          <yu-xform-item label="事件名称" ctype="input" name="eventName" placeholder="请输入要添加的事件名称" :disabled="editTypeShow && isEdit"></yu-xform-item>
          <yu-xform-item label="开始时间" ctype="datepicker" time-arrow-control type="datetime" placeholder="请选择开始时间" :picker-options="pickerOptions" name="startDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" :default-time="newTimedate" :disabled="editTypeShow && isEdit"></yu-xform-item>
          <yu-xform-item label="结束时间" ctype="yu-date-picker" name="endDate" time-arrow-control type="datetime" placeholder="请选择结束时间" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" default-time="23:59:00" :disabled="editTypeShow && isEdit"></yu-xform-item>
          <yu-xform-item label="提醒" ctype="radio" :options="options" name="remindTime" :disabled="editTypeShow && isEdit"></yu-xform-item>
          <!-- :hidden="isEditType === false && isAddEditType === 1"  :notice="tipText" 下面字段使用v-show因为不回重新渲染组件，若重新渲染会造成refs渲染问题和参数有值但是赋值不上去的问题-->
          <!-- <yu-xform-item label="重复" ctype="radio" :options="options1" name="repeated" @change.native="repeatChange" :disabled="editTypeShow && isEdit"></yu-xform-item>
          <yu-xform-item label="间隔" ref="setNotice" :key="new Date().getTime()" ctype="select" :notice="tipText" :options="options3" name="timeInterval" @change="changetips" placeholder="请选择" :hidden="formData.repeated === 1 && isEditType === false" :disabled="editTypeShow && isEdit"></yu-xform-item>  
          <yu-xform-item ref="resetCFiled" label="直到" :key="new Date().getTime()" ctype="datepicker" time-arrow-control type="datetime" placeholder="请选择直到时间" :picker-options="pickerOptions" name="untilDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" :hidden="formData.repeated === 1 && isEditType === false" :disabled="editTypeShow && isEdit"></yu-xform-item> -->
          <!-- <yu-xform-item label=" " ctype="custom" class="tipItem" :hidden="isNoRepeat || (!formData.timeInterval && (isNoRepeat===false))" name="tip">
            <div>{{ tipText }}</div>
          </yu-xform-item> -->
          <yu-xform-item label="重要" ctype="radio" :options="options2" name="important" :disabled="editTypeShow && isEdit"></yu-xform-item>
          <yu-xform-item label="事件描述" :rows="3" ctype="textarea" name="eventDesc" placeholder="请输入事件描述" :disabled="editTypeShow && isEdit"></yu-xform-item>
          <yu-xform-item class="task-info-czy" label="任务信息" @click.native.stop="showprovemessage" ctype="custom" name="relatedEventInfo" v-if="titleMap[type]==='事件详情' && formData.relatedEventType===1">
            <div>{{ formData.relatedEventInfo }}</div>
          </yu-xform-item>
          <yu-xform-item label="任务信息" ctype="textarea" name="relatedEventInfo" v-if="formData.relatedEventType===1 && titleMap[type]==='编辑事件'" :disabled="editTypeShow && isEdit"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <span slot="footer" class="dialog-footer">
        <template v-if="formType === 'edit'">
          <yu-button @click="saveInfo" type="primary">保存</yu-button>
          <yu-button @click="resetFormByRepeat">重置</yu-button>
        </template>
        <template v-else>
          <yu-button @click="editInfo" type="primary">编辑</yu-button>
          <yu-button @click="deleteHook">删除</yu-button>
        </template>
      </span>
    </yu-xdialog>
  </div>
</template>
<script>
import {getCalendarEvent, saveCalendarEvent, getCalendarEventDetail, deleteCalendarEvent} from '@/api/portal/calendar'
import cardWrap from '@/views/portal/card/components/card-wrap'
import dayPopover from './day-popover'
import {clone, parseTime} from '@/utils'
export default {
  name: "calendar",
  componentName: "calendar",
  components: {dayPopover, cardWrap},
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t('card.calendar')
      }
    }
  },
  data() {
    return {
      dayList: [],
      clickDayEvent: {},
      selectedCurrentMonth: [],
      addMemorandumBook: false,
      year: null,
      month: null,
      day: null,
      currentDay: null,
      currentMonth: null,
      currentYear: null,
      currentYearMonthTimes: null, //当前年的月的天数
      monthOneDay: null, //一个月中的某一天
      curDate: null,
      prevDays: null, //上一月天数
      tableData: [],
      clickedDay: '',
      formType: 'edit',
      type: 'add',
      titleMap: {
        'add': '新增事件',
        'details': '事件详情',
        'edit': '编辑事件'
      },
      pickerOptions: {
        disabledDate: function (time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      formData: {
        eventDesc: '',
        eventName: '',
        important: 0,
        remindTime: 5,
        repeated: 1,
        // timeInterval: 1,
        untilDate: '',
        startDate: '',
        endDate: '',
        editType: ''
      },
      rules: {
        editType: {required: true, message: this.$t('sysUserManager.btx') },
        eventName: [
          {required: true, message: this.$t('sysUserManager.btx')}
        ],
        startDate: [
          {required: true, message: this.$t('sysUserManager.btx')},
          {validator: this.validateTime}
        ],
        endDate: [
          {required: true, message: this.$t('sysUserManager.btx')},
          {validator: this.validateTime}
        ],
        important: {required: true, message: this.$t('sysUserManager.btx') },
        repeated: {required: true, message: this.$t('sysUserManager.btx') },
        remindTime: {required: true, message: this.$t('sysUserManager.btx') },
        timeInterval: {required: true, message: this.$t('sysUserManager.btx') },
        untilDate:{required: true, message: this.$t('sysUserManager.btx'), trigger:'change'}
      },
      options: [
        {key: -1, value: '无'},
        {key: 0, value: '实时'},
        {key: 5, value: '5分钟前'},
        {key: 15, value: '15分钟前'},
        {key: 30, value: '30分钟前'},
        {key: 60, value: '1小时前'},
        {key: 1440, value: '1天前'},
        {key: 10080, value: '1周前'}
      ],
      options1: [
        {key: 1, value: '不重复'},
        {key: 2, value: '每天'},
        {key: 3, value: '每周'},
        {key: 4, value: '每月'},
        {key: 5, value: '每年'}
      ],
      options2: [
        {key: 1, value: '是'},
        {key: 0, value: '否'}
      ],
      options3: [
        {key: 1, value: '1'},
        {key: 2, value: '2'},
        {key: 3, value: '3'},
        {key: 4, value: '4'},
        {key: 5, value: '5'},
        {key: 6, value: '6'},
        {key: 7, value: '7'},
        {key: 8, value: '8'},
        {key: 9, value: '9'},
        {key: 10, value: '10'}
      ],
      editTypeOption: [
        {key: 1, value: '仅此事件'},
        {key: 2, value: '系列中的所有事件'}
      ],
      // 代办提醒定时器
      eventNoticeTimer: null,
      // 定时器开始时间戳
      startTime: 0,
      // 执行次数
      count: 0,
      // 定时器时间偏移量
      timerOffset: 0,
      nextTime: 0,
      isNoRepeat: true, // 是否不重复
      tipText: '请先选择间隔时间', // 提示语
      isEdit: true, // 是否选择编辑模式
      isEditType: true, // 编辑模式是否为系列中所有
      isAddEditType: 1, // 新增时显示重复选项 默认1-不显示，2-显示
      newTimedate: '',
      clickDay:null, //点击时间临时存储
    }
  },
  computed: {
    curDays() {
      return new Date(this.year, this.month, 0).getDate();
    },
    // 设置该月日期起始值（找到一号是在哪里）
    beginDay() {
      return new Date(this.year, this.month - 1, 1).getDay();
    },
    editTypeShow() {
      return this.formData.id && this.type == 'edit' && this.formType === 'edit' && this.editData.repeated != 1
    }
    
  },
  created() {
    this.getInitDate();
    this.currentYearMonthTimes = this.mGetDate(this.year, this.month); //本月天数
    this.prevDays = this.mGetDate(this.year, this.month - 1);
    this.curDate = `${this.year}-${this.month}-${this.day}`
    this.scheduleListNet()
    this.newTimedate = parseTime(new Date(), "{h}:{i}:{s}")
  },
  destroyed() {
    clearTimeout(this.eventNoticeTimer)
  },
  methods: {
    //去掉时间的秒
    updateTimeWithoutS(params) {
      return params.substr(0, 5)
    },
    //     编辑页面【重置】按钮的控制逻辑：
    //编辑页面【重置】按钮的控制逻辑：点击重置，恢复当前编辑页未修改前的状态。
    resetFormByRepeat() {
      if(this.type === 'edit') {
        this.resetEditData(this.editData);
        //要恢复成不能编辑的情况
        // this.editTypeShow = true;
        this.isEditType = false;
        this.isEdit = true;
        if(this.editData.repeated) {
          this.isAddEditType = 2;
        }
      }else{
        this.addEvent(this.currentDay)
      }
      
    },
    //点击任务信息显示功能正在开发中
    showprovemessage() {
      this.$message(`功能开发中，敬请期待。`)
    },
    validateTime(rule, value, callback) {
      var curTime = new Date();
      var str = curTime.toLocaleDateString().replace(/\//g, '-') + ' ' + curTime.toLocaleTimeString()
      if (value && ((new Date(value).getTime() - new Date(value).getSeconds() * 1000) < (new Date(str).getTime() - new Date(str).getSeconds() * 1000))) {
        callback(new Error('不能小于系统当前时间'));
      }
      if (this.formData.startDate && this.formData.endDate && (new Date(this.formData.startDate).getTime() - new Date(this.formData.startDate).getSeconds() * 1000) > (new Date(this.formData.endDate).getTime() - new Date(this.formData.endDate).getSeconds() * 1000)) {
        callback(new Error('开始时间不能大于结束时间'));
      } else {
        callback();
      }
    },
    handleClickDay({day, item}) { //点击这一天，绑定点击事件
      this.day = day
      this.clickedDay = day
      // this.clickDayEvent = item.eventName || []
      if (this.day > this.currentYearMonthTimes) {
        this.$message.warning('不能选择超出本月的日期');
      }
      const eventNames = item.eventName || []
      const now = +new Date();
      this.clickDayEvent = eventNames.filter(v => {
        return +new Date(v.day) > now
      })[0] || {}
      console.log(day)
    },
    computedDay() {
      const allDay = new Date(this.year, this.month, 0).getDate();
      if (this.day > allDay) {
        this.day = allDay;
      }
    },
    //设置页头显示的年月日
    getInitDate() {
      const date = new Date();
      this.year = date.getFullYear();
      this.month = date.getUTCMonth() + 1;
      this.day = date.getDate();
      this.currentDay = date.getDate()
      this.currentMonth = date.getMonth() + 1
      this.currentYear = date.getFullYear()
    },
    // 如果要获取当前月份天数:
    mGetDate() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var d = new Date(year, month, 0);
      return d.getDate();
    },
    handlePrev() {
      if (this.month == 1) {
        this.month = 12
        this.year--
      } else {
        this.month--
      }
      this.timeChangeCb()
    },
    handlePrevYear() {
      this.year--
      this.timeChangeCb()
    },
    handleNext() {
      if (this.month == 12) {
        this.month = 1
        this.year++
      } else {
        this.month++
      }
      this.timeChangeCb()
    },
    handleNextYear() {
      this.year++
      this.timeChangeCb()
    },
    timeChangeCb() {
      this.computedDay()
      this.$nextTick(() => {
        this.scheduleListNet()
      })
    },
    everyMonthSelect(year, month) {
      var selectedDay = [], tableDataList = [];
      tableDataList = this.tableData.map(item => {
        item.children = [item];
        return item
      })
      // 去重，相同日期的日程放到一组
      for (let i = 0; i < tableDataList.length; i++) {
        for (let j = i + 1; j < tableDataList.length; j++) {
          if (tableDataList[i].sysDate === tableDataList[j].sysDate) {
            tableDataList[i].children.push(tableDataList[j])
            tableDataList.splice(j, 1)
            j--
          }
        }
      }
      // console.log('tableDataList------------', tableDataList)
      tableDataList.forEach((item, index) => {
        var dayAyy = item.sysDate.split('-')
        if (Number(dayAyy[0]) === year && Number(dayAyy[1]) === month) {
          selectedDay.push({
            date: Number(dayAyy[2]),
            ...item
          })
        }
      })
      // console.log('selectedDay------------', selectedDay)
      return selectedDay;
    },
    // 选中日程对应日期高亮
    selectDayHigh() {
      this.dayList = []
      for (let i = 0; i < 42; i++) {
        this.dayList.push({
          flag: false,
          eventName: [],
          hasImportantEvent: false,
          festival: false
        })
      }
      this.dayList.forEach((item, index) => {
        // 当月
        if (index + 1 - this.beginDay > 0 && index + 1 - this.beginDay <= this.curDays) {
          this.everyMonthSelect(this.year, this.month).forEach(itm => {
            if (index + 1 - this.beginDay === itm.date) {
              const eventName = [];
              const eventType = [];
              itm.children.forEach(child => {
                delete child.children
                if(child.eventName) {
                  eventName.push(child)
                }
                eventType.push(child.eventType)
              })
              this.dayList[index].eventName = eventName;
              this.dayList[index].flag = eventName.length > 0;
              this.dayList[index].children = itm.children;
              this.dayList[index].hasImportantEvent = eventType.includes('11');
              this.dayList[index].festival = eventType.includes('1');
              this.dayList[index].weekWork = eventType.includes('2');
            }
          })
          // })
        } else if (index + 1 - this.beginDay <= 0) {
          // 上个月
          this.everyMonthSelect(this.year, this.month - 1).forEach(itm => {
            if (index + 1 - this.beginDay + this.prevDays === itm.date) {
              this.dayList[index].flag = true
              // this.dayList[index].eventName = itm.eventName
            }
          })
        } else {
          // 下个月
          this.everyMonthSelect(this.year, this.month + 1).forEach(itm => {
            if (index + 1 - this.beginDay - this.curDays === itm.date) {
              this.dayList[index].flag = true
              // this.dayList[index].eventName = itm.eventName
            }
          })
        }
      })
    },
    resetData() {
      this.formData = {
        eventDesc: '',
        eventName: '',
        important: 0,
        remindTime: 5,
        repeated: 1,
        // timeInterval:1,
        untilDate: '',
        startDate: '',
        endDate: '',
        // editType: ''
      } 
    },
    addEvent(day) {    
      this.formType = 'edit';
      this.type = 'add';
      this.addMemorandumBook = true;
      this.isAddEditType = 2;
      this.isEditType = false;
      this.resetData();
      this.$nextTick(() => {
        this.resetForm();
        day = typeof day === 'number' ? day : this.currentDay;
        const year = this.year;
        const month = this.month;
        const time = `${year}-${month}-${day}`
        const endDate = `${parseTime(new Date(time), "{y}-{m}-{d}")} 23:59:00`
        const hour = new Date().getHours(); 
        const minute = new Date().getMinutes();
        const seconds = new Date().getSeconds();
        const startDate = `${parseTime(new Date(time), "{y}-{m}-{d}")} ${parseTime(new Date(), "{h}:{i}:{s}")}`
        setTimeout(() => {
          this.$refs.refForm.formdata.startDate = startDate;
          this.$refs.refForm.formdata.endDate = endDate;
          this.$refs.refForm.formdata.repeated = 1;
          this.formData.repeated = 1;
          this.formData.startDate = startDate;
          this.formData.endDate = endDate;
          this.formData.important = 0;
          this.$refs.refForm.formdata.important = 0;
        })
      })
    },
    showEventDetail(id, sysDate) {
      getCalendarEventDetail({id}).then(res => {
        if(res.code === '0') {
          this.formType = 'details';
          this.type = 'details';
          this.editData = res.data;
          this.editData.sysDate = sysDate;
          this.resetEditData(res.data)
        }
      })
    },
    resetEditData(obj) {
      // this.formData = res.data;
      this.isEditType = false
      obj.important = +obj.important; // boolean转number
      this.addMemorandumBook = true;
      this.$nextTick(() => {
        this.$refs.refForm.resetFields();
        //解决初始第一次的时候relatedEventType没有定义，clone的时候没有赋值的问题
        this.$set(this.$refs.refForm.formdata, 'relatedEventType', this.editData.relatedEventType)
        clone(obj, this.$refs.refForm.formdata)

      })
      if(!obj.important) {
        this.$nextTick(() => {
          this.$set(this.formData, 'important', 0)
        })
      }
    },
    saveInfo() {
      const _this = this;
      let validate = false;
      this.$refs.refForm.validate(function(valid) {
        validate = valid;
      });
      if (!validate) {
        return;
      }
      this.addMemorandumBook = false
      if(this.formData.id && this.formType === 'edit') {
        const {year, month, day} = this;
        this.formData.editDate = `${year}-${this.calcDayNum(month)}-${this.calcDayNum(day)}`
      }
      saveCalendarEvent(this.$refs.refForm.formdata).then(res => {
        if (res.code === '0') {
          if(this.type === 'add') {
            _this.$message({
              message: '恭喜您成功新增一条备忘录！',
              type: 'success'
            })
          }else{
            _this.$message({
              message: '恭喜您成功修改当前备忘录！',
              type: 'success'
            })
          }
          _this.scheduleListNet()
        }
      })
    },
    scheduleListNet() {
      const {year, month, day} = this;
      const eventDate = `${year}-${this.calcDayNum(month)}-${this.calcDayNum(day)}`
      getCalendarEvent({
        eventDate
      }).then(res => {
        if (res.code === '0') {
          this.tableData = res.data.map(item => {
            item.sysDate = item.day.slice(0, 10);
            item.sysRemindDate = item.remindDate && item.remindDate.slice(0, 10);
            return item
          })
          this.selectDayHigh()
          const item = this.dayList[this.day + this.beginDay - 1]
          this.startTime = new Date().getTime()
          this.eventNotice(item)
          const day = this.day;
          this.handleClickDay({day, item})
        }
      });
    },
    eventNotice(currentDay) {
      const interval = 1000
      this.count++
      // console.log(this.nextTime)
      this.eventNoticeTimer = setTimeout(() => {
        clearTimeout(this.eventNoticeTimer)
        // 当前时间戳
        const currentTime = Date.parse(new Date())
        // 定时器执行时间偏移量
        this.timerOffset = new Date().getTime() - (this.startTime + this.count * interval)
        // 下次执行时间间隔
        this.nextTime = interval - this.timerOffset
        currentDay.eventName.forEach(item => {
          if(currentTime === Date.parse(item.remindDate)) {
            yufp.globalEventBus.$emit("eventNotice", item)
          }
        })
        if(this.nextTime < 0) { this.nextTime = 0 }
        this.eventNotice(currentDay)
      }, this.nextTime)
    },
    resetForm() {
      this.$refs.refForm.resetFields();
    },
    deleteHook() {
      this.deleteEvent(this.editData);
    },
    deleteEvent(item) {
      const _this = this
      const {repeated = 1, id} = item;
      const deleteDate = item.sysDate || item.deleteDates;
      let deleteType = 1;
      if (repeated !== 1) {
        _this.$customConfirm('是否删除', '提示', {
          buttons:[{text:'删除今日日程', type:"primary", key: 'today'}, {text:'删除全部日程', type:"primary", key:'all'}],
          callback:function(action) {
            // action为按钮对象设置的key值，没有key值时，为按钮的index索引
            if(action === 'today') {
              deleteType = 1;
            } else if (action === 'all') {
              deleteType = 2;
            } else {
              return
            }
            _this.deleteCb(id, deleteType, deleteDate, _this)
          }
        });
      } else {
        _this.$confirm('是否删除', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function (action) {
          if (action === 'confirm') {
            _this.deleteCb(id, deleteType, deleteDate, _this)
          }
        })
      }
    },
    // eslint-disable-next-line consistent-this
    deleteCb(id, deleteType, deleteDate, _this) {
      deleteCalendarEvent({id, deleteType, deleteDate}).then(res => {
        if(res.code === '0') {
          _this.$message({
            message: '删除成功！',
            type: 'success'
          })
          _this.addMemorandumBook = false
          _this.scheduleListNet()
        }
      })
    },
    editInfo() {
      this.formType = 'edit';
      this.type = 'edit';
      this.isEditType = false;
      if(this.editData.repeated) {
        this.isAddEditType = 2;
      }
      this.$set(this.formData, 'editType', '')
    },
    calcDayNum(item) {
      return item > 9 ? item : `0${item}`
    },
    //切换间隔的时候改变提示信息
    changetips(value) {
      this.formData.timeInterval = value
      this.repeatChange(this.formData.repeated)
    },
    // 重复值选择改变
    repeatChange(param) {
      let val;
      if(typeof param === "number") {
        val = param
      }else{
        val = param ? param.target['_value'] : ''
      }
      if(!this.formData.timeInterval) {
        this.tipText = "请先选择间隔时间"
        if(val !== 1) {
          this.$refs.refForm.formdata.timeInterval = this.formData.timeInterval = 1
        }
      }
      if(val == 1) {
        this.isNoRepeat = true;
        // this.isEditType = true;
        // this.formData.untilDate = undefined;
        // this.formData.timeInterval = undefined;
        // this.tipText = ''
      } else if(val == 2) {     
        this.isNoRepeat = false;
        this.$nextTick(() => {
          this.$refs.refForm.formdata.untilDate = this.formData.untilDate = this.getUntilDate(this.formData.startDate, 90);
          this.tipText = `每隔${this.formData.timeInterval}天提醒一次`;
        })

      } else if(val == 3) {
        this.isNoRepeat = false;
        this.$nextTick(() => {
          this.$refs.refForm.formdata.untilDate = this.formData.untilDate = this.getUntilDate(this.formData.startDate, 180);
          this.tipText = `每隔${this.formData.timeInterval}周提醒一次`;
        })
      } else if(val == 4) {
        this.isNoRepeat = false;
        this.$nextTick(() => {
          this.$refs.refForm.formdata.untilDate = this.formData.untilDate = this.getUntilDate(this.formData.startDate, 360);
          this.tipText = `每隔${this.formData.timeInterval}月提醒一次`;
        })
      } else if(val == 5) {
        this.isNoRepeat = false;
        this.$nextTick(() => {
          this.$refs.refForm.formdata.untilDate = this.formData.untilDate = this.getUntilDate(this.formData.startDate, 365 * 100);
          this.tipText = `每隔${this.formData.timeInterval}年提醒一次`;
        })
      }
      // this.$nextTick(() => {
      //   console.log(this, this.$refs.setNotice, 'setNotice')
      //   if(this.$refs.setNotice) {
      //     this.$refs.setNotice.notice = this.tipText
      //   }
      // })
      // if(this.type !== 'add') {
      //   this.$refs.refForm.formdata.untilDate = this.editData.untilDate
      // }
      this.formData.repeated = val;
    },
    // day天后的日期
    getUntilDate(timeS, day) {
      //编辑的时候才赋值 新增的时候不用
      var newDate = ""
      // if(this.type !== "add") {
      const nowDate = new Date(timeS).getTime() + (day * 24 * 60 * 60 * 1000);
      newDate = parseTime(nowDate, "{y}-{m}-{d} {h}:{i}:{s}")
      // }  
      return newDate;
    },
    // 编辑模式选择
    checkEditType(type) {
      if(type) {
        this.isEdit = false;
        this.isEditType = false;
        this.isAddEditType = 1;
        this.repeatChange(1);
        if(this.type === 'edit' && type === 1) {
          //编辑并且操作仅此事件  重复事件设置为不重复，并且间隔和直到字段设置为空
          this.formData.repeated = 1
          this.formData.timeInterval = this.editData.timeInterval ? this.editData.timeInterval : null
        }
   
        if(type == 2) {
          this.isEditType = true;
          this.isAddEditType = 2;
          if(this.type === 'edit') {
            //等于后端返回的值
            this.formData.repeated = this.editData.repeated
          }
          this.repeatChange(this.formData.repeated)
          // if(this.formData.repeated)
        }
      }
    },
    // 弹窗关闭
    dialogClose() {
      this.isEdit = true;
      this.isNoRepeat = true;
      this.isEditType = true;
      this.isAddEditType = 1;
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/ .yu-xform.yu-form-message .el-form-item__content, /deep/ .yu-xform.yu-form-notice .el-form-item__content, /deep/ .yu-xform.yu-form-utrace .el-form-item__content{
     padding-right:0;
  }
  /deep/ .yu-xform  .notice-container {
    right:-16px;
  }
  .h100 {
    height: 100%;
  }
  /deep/ .el-form-details .task-info-czy .el-form-item__content{
    cursor: pointer;
    /* width:100%; */
    color:#2877FF;
  }
  /deep/ .calendar-edit-dialog .el-icon-information.xform-tooltip-icon.el-popover__reference{
    right:-16px!important;
  }
  .date-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    & > div {
      font-size: 0;
    }
  }
  .date-headers {
    align-items: center;
    .icon-arrow {
      color: #999999;
      font-size: 10px;
      cursor: pointer;
      &:last-of-type {
        margin-left: 10px;
      }
      &:hover {
        color: #2877ff;
      }
    }
  }

  .date-header .date-title {
    font-size: 14px;
    color: #333;
    font-weight: bold;
  }

  .date-headers {
    display: flex;
    width: 100%;
  }

  .pre-month {
    position: absolute;
    display: inline-block;
    height: 0px;
    width: 0px;
    border: 15px solid;
    border-color: transparent rgb(35, 137, 206) transparent transparent;
  }

  .next-month {
    position: absolute;
    display: inline-block;
    height: 0px;
    width: 0px;
    border: 15px solid;
    border-color: transparent transparent transparent rgb(35, 137, 206);
  }

  .show-date {
    margin-left: 40px;
    margin-top: 0px;
    display: inline-block;
    line-height: 20px;
    text-align: center;
    width: 310px;
    color: rgb(35, 137, 206);
  }

  .week-header {
    color: #666666;
    font-size: 14px;
    text-align: center;
    line-height: 30px;
    background: #F3F6FA;
  }

  .week-header div {
    display: inline-block;
    margin: 0;
    padding: 0;
    height: 20px;
    width: 14%;
    text-align: center;
  }

  .date-content {
    width: 100%;
    height: calc(100% - 41px);
  }

  .week-day {
    box-sizing: border-box;
    padding-top: 3px;
    padding-bottom: 10px;
    width: 100%;
    height: 100%
  }

  .every-day {
    display: inline-block;
    margin-bottom: 3px;
    height: 28px;
    line-height: 28px;
    width: 13.0%;
    margin-left: 1%;
    text-align: center;
    cursor: pointer;
    color: #333;
  }

  /deep/ .every-day:nth-of-type(7n) .por-day, /deep/ .every-day:nth-child(7n+1) .por-day {
    color: #666666;
  }
  .every-day:nth-child(7n+1) {
    margin-left: 2%;
  }

  .every-day div {
    position: relative;
  }

  .other-day {
    color: #ccc;
  }

  /deep/ .nowDay {
    background: rgba(40, 119, 255, 0.12);
    border-radius: 2px;
  }

  /deep/ .clickedDay {
    color: #2877FF;
  }

  .event-group {
    display: flex;
    height: 40px;
    align-items: center;
    font-size: 0;
    border-top: 1px solid #EDEDED;
    .event-dot {
      display: inline-block;
      margin-right: 8px;
      width: 8px;
      height: 8px;
      background: #2877FF;
      border-radius: 4px;
    }
    .event-time,.event-name {
      font-size: 14px;
      color: #333;
      line-height: 20px;
    }
    .event-time {
      margin-right: 12px;
    }
    .event-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  /deep/ .el-dialog-x__footer {
    border: none;
  }

  /deep/ .el-table--fit {
    border-left: 0;
  }

  /deep/ .el-table {
    border: none;
  }

  .pagenation-style {
    height: 30px;
    line-height: 30px;
    margin-top: 30px;
    text-align: center;
    color: #999999;
    font-size: 12px;
    padding-bottom: 30px;

    .pre-page {
      height: 30px;
      line-height: 30px;
      display: inline-block;
      margin-right: 20px;
    }

    .next-page {
      display: inline-block;
    }

    .yu-icon-arrs-left {
      height: 30px;
      line-height: 30px;
      display: inline-block;
      padding-right: 5px;
    }

    .yu-icon-arrs-right {
      display: inline-block;
      padding-left: 5px;
    }

    span {
      display: inline-block;
      height: 30px;
      line-height: 30px;
    }
  }

</style>
<style lang="scss">
  .calendar-edit-dialog {
    box-sizing: border-box;
    width: 800px!important;
    /* max-height: 500px;
    overflow-y: auto; */
    /* .el-dialog-x__header {
      padding: 16px 0 0;
    } */
    /* .el-dialog-x__body {
      padding: 15px 0 0;
    } */
    /* .el-form-item__label {
      padding: 0;
    } */
    .el-radio {
      margin-right: 10px;
    }
    .el-dialog-x__footer {
      position: relative;
      padding: 16px 0;
      &:after {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 1px;
        content: '';
        background: #EDEDED;
      }
      .el-button {
        padding: 9px 16px;
      }
    }
  }
  .tipItem {
    .el-form-item__label {
      display: none;
    }
  }
</style>
