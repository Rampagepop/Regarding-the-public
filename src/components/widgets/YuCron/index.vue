<style lang="less" scoped>
#changeContab {
  .language {
    position: absolute;
    right: 25px;
    z-index: 1;
  }

  .el-tabs {
    box-shadow: none;
  }

  .tabBody {
    .el-row {
      margin: 10px 0;

      .el-input-number {
        width: 110px;
      }
    }
  }

  .bottom {
    width: 100%;
    text-align: center;
    margin-top: 5px;
    position: relative;

    .value {
      font-size: 18px;
      vertical-align: middle;
    }
  }
}
.result {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
}
.bottom {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
<template>
  <div id="changeContab">
    <el-button class="language" type="text" @click="i18n=(i18n==='en'?'cn':'en')">{{ i18n }}</el-button>
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> {{ text.Seconds.name }}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="second.cronEvery" label="1">{{ text.Seconds.every }}</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="second.cronEvery" label="2">{{ text.Seconds.interval[0] }}
            </el-radio>
            <yu-input-number size="small" v-model="second.incrementIncrement" :min="1" :max="60"></yu-input-number>
            {{ text.Seconds.interval[1] || '' }}
            <yu-input-number size="small" v-model="second.incrementStart" :min="0" :max="59"></yu-input-number>
            {{ text.Seconds.interval[2] || '' }}
          </el-row>
          <el-row>
            <el-radio v-model="second.cronEvery" label="3">{{ text.Seconds.specific }}
            </el-radio>
            <el-select style="width: 350px;" size="small" multiple clearable v-model="second.specificSpecific">
              <el-option v-for="(val,index) in 60" :key="index" :value="val-1">{{ val - 1 }}</el-option>
            </el-select>
          </el-row>
          <el-row>
            <el-radio v-model="second.cronEvery" label="4">{{ text.Seconds.cycle[0] }}
            </el-radio>
            <yu-input-number size="small" v-model="second.rangeStart" :min="1" :max="60"></yu-input-number>
            {{ text.Seconds.cycle[1] || '' }}
            <yu-input-number size="small" v-model="second.rangeEnd" :min="0" :max="59"></yu-input-number>
            {{ text.Seconds.cycle[2] || '' }}
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> {{ text.Minutes.name }}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="minute.cronEvery" label="1">{{ text.Minutes.every }}</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="minute.cronEvery" label="2">{{ text.Minutes.interval[0] }}
            </el-radio>
            <el-input-number size="small" v-model="minute.incrementIncrement" :min="1" :max="60"></el-input-number>
            {{ text.Minutes.interval[1] }}
            <el-input-number size="small" v-model="minute.incrementStart" :min="0" :max="59"></el-input-number>
            {{ text.Minutes.interval[2] || '' }}
          </el-row>
          <el-row>
            <el-radio class="long" v-model="minute.cronEvery" label="3">{{ text.Minutes.specific }}
            </el-radio>
            <el-select style="width: 350px;" size="small" multiple clearable v-model="minute.specificSpecific">
              <el-option v-for="(val,index) in 60" :key="index" :value="val-1">{{ val - 1 }}</el-option>
            </el-select>
          </el-row>
          <el-row>
            <el-radio v-model="minute.cronEvery" label="4">{{ text.Minutes.cycle[0] }}
            </el-radio>
            <el-input-number size="small" v-model="minute.rangeStart" :min="1" :max="60"></el-input-number>
            {{ text.Minutes.cycle[1] }}
            <el-input-number size="small" v-model="minute.rangeEnd" :min="0" :max="59"></el-input-number>
            {{ text.Minutes.cycle[2] }}
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> {{ text.Hours.name }}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="hour.cronEvery" label="1">{{ text.Hours.every }}</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="hour.cronEvery" label="2">{{ text.Hours.interval[0] }}
            </el-radio>
            <el-input-number size="small" v-model="hour.incrementIncrement" :min="0" :max="23"></el-input-number>
            {{ text.Hours.interval[1] }}
            <el-input-number size="small" v-model="hour.incrementStart" :min="0" :max="23"></el-input-number>
            {{ text.Hours.interval[2] }}
          </el-row>
          <el-row>
            <el-radio class="long" v-model="hour.cronEvery" label="3">{{ text.Hours.specific }}
            </el-radio>
            <el-select style="width: 350px;" size="small" multiple clearable v-model="hour.specificSpecific">
              <el-option v-for="(val,index) in 24" :key="index" :value="val-1">{{ val - 1 }}</el-option>
            </el-select>
          </el-row>
          <el-row>
            <el-radio v-model="hour.cronEvery" label="4">{{ text.Hours.cycle[0] }}
            </el-radio>
            <el-input-number size="small" v-model="hour.rangeStart" :min="0" :max="23"></el-input-number>
            {{ text.Hours.cycle[1] }}
            <el-input-number size="small" v-model="hour.rangeEnd" :min="0" :max="23"></el-input-number>
            {{ text.Hours.cycle[2] }}
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> {{ text.Day.name }}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="day.cronEvery" label="1">{{ text.Day.every }}</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="2">{{ text.Day.intervalWeek[0] }}
            </el-radio>
            <el-input-number size="small" v-model="week.incrementIncrement" :min="1" :max="7"></el-input-number>
            {{ text.Day.intervalWeek[1] }}
            <el-select style="width: 350px;" size="small" v-model="week.incrementStart">
              <el-option v-for="(val,index) in 7" :key="index" :label="text.Week[val-1]" :value="val"></el-option>
            </el-select>
            {{ text.Day.intervalWeek[2] }}
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="3">{{ text.Day.intervalDay[0] }}
            </el-radio>
            <el-input-number size="small" v-model="day.incrementIncrement" :min="1" :max="31"></el-input-number>
            {{ text.Day.intervalDay[1] }}
            <el-input-number size="small" v-model="day.incrementStart" :min="1" :max="31"></el-input-number>
            {{ text.Day.intervalDay[2] }}
          </el-row>
          <el-row>
            <el-radio class="long" v-model="day.cronEvery" label="4">{{ text.Day.specificWeek }}
            </el-radio>
            <el-select style="width: 350px;" size="small" multiple clearable v-model="week.specificSpecific">
              <el-option v-for="(val,index) in 7"
                         :key="index"
                         :label="text.Week[val-1]"
                         :value="['SUN','MON','TUE','WED','THU','FRI','SAT'][val-1]"
              ></el-option>
            </el-select>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="day.cronEvery" label="5">{{ text.Day.specificDay }}
            </el-radio>
            <el-select style="width: 350px;" size="small" multiple clearable v-model="day.specificSpecific">
              <el-option v-for="(val,index) in 31" :key="index" :value="val">{{ val }}</el-option>
            </el-select>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="6">{{ text.Day.lastDay }}</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="7">{{ text.Day.lastWeekday }}</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="8">{{ text.Day.lastWeek[0] }}
            </el-radio>
            <el-select style="width: 350px;" size="small" v-model="day.cronLastSpecificDomDay">
              <el-option v-for="(val,index) in 7" :key="index" :label="text.Week[val-1]" :value="val"></el-option>
            </el-select>
            {{ text.Day.lastWeek[1] || '' }}
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="9">
              {{ text.Day.beforeEndMonth[0] }}
            </el-radio>
            <el-input-number size="small" v-model="day.cronDaysBeforeEomMinus" :min="1" :max="31"></el-input-number>
            {{ text.Day.beforeEndMonth[1] }}
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="10">{{ text.Day.nearestWeekday[0] }}
            </el-radio>
            <el-input-number size="small" v-model="day.cronDaysNearestWeekday" :min="1" :max="31"></el-input-number>
            {{ text.Day.nearestWeekday[1] }}
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="11">{{ text.Day.someWeekday[0] }}
            </el-radio>
            <el-input-number size="small" v-model="week.cronNthDayNth" :min="1" :max="5"></el-input-number>
            {{ text.Day.someWeekday[1] }}
            <el-select style="width: 350px;" size="small" v-model="week.cronNthDayDay">
              <el-option v-for="(val,index) in 7" :key="index" :label="text.Week[val-1]" :value="val"></el-option>
            </el-select>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> {{ text.Month.name }}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="month.cronEvery" label="1">{{ text.Month.every }}</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="month.cronEvery" label="2">{{ text.Month.interval[0] }}
            </el-radio>
            <el-input-number size="small" v-model="month.incrementIncrement" :min="0" :max="12"></el-input-number>
            {{ text.Month.interval[1] }}
            <el-input-number size="small" v-model="month.incrementStart" :min="0" :max="12"></el-input-number>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="month.cronEvery" label="3">{{ text.Month.specific }}
            </el-radio>
            <el-select style="width: 350px;" size="small" multiple clearable v-model="month.specificSpecific">
              <el-option v-for="(val,index) in 12" :key="index" :label="val" :value="val"></el-option>
            </el-select>
          </el-row>
          <el-row>
            <el-radio v-model="month.cronEvery" label="4">{{ text.Month.cycle[0] }}
            </el-radio>
            <el-input-number size="small" v-model="month.rangeStart" :min="1" :max="12"></el-input-number>
            {{ text.Month.cycle[1] }}
            <el-input-number size="small" v-model="month.rangeEnd" :min="1" :max="12"></el-input-number>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="result">
      {{ cron }}
    </div>
    <div class="bottom">
      <yu-button type="primary" @click="change">{{ text.Save }}</yu-button>
      <yu-button @click="close">{{ text.Close }}</yu-button>
    </div>
  </div>
</template>

<script>
import Language from './lang'

export default {
  name: 'YuCron',
  componentName: "YuCron",
  // eslint-disable-next-line vue/require-prop-types
  props: ['data', 'i18n'],
  data() {
    return {
      second: {
        cronEvery: '',
        incrementStart: '3',
        incrementIncrement: '5',
        rangeStart: '',
        rangeEnd: '',
        specificSpecific: [],
      },
      minute: {
        cronEvery: '',
        incrementStart: '3',
        incrementIncrement: '5',
        rangeStart: '',
        rangeEnd: '',
        specificSpecific: [],
      },
      hour: {
        cronEvery: '',
        incrementStart: '3',
        incrementIncrement: '5',
        rangeStart: '',
        rangeEnd: '',
        specificSpecific: [],
      },
      day: {
        cronEvery: '',
        incrementStart: '1',
        incrementIncrement: '1',
        rangeStart: '',
        rangeEnd: '',
        specificSpecific: [],
        cronLastSpecificDomDay: 1,
        cronDaysBeforeEomMinus: '',
        cronDaysNearestWeekday: '',
      },
      week: {
        cronEvery: '',
        incrementStart: '1',
        incrementIncrement: '1',
        specificSpecific: [],
        cronNthDayDay: 1,
        cronNthDayNth: '1',
      },
      month: {
        cronEvery: '',
        incrementStart: '3',
        incrementIncrement: '5',
        rangeStart: '',
        rangeEnd: '',
        specificSpecific: [],
      },
      year: {
        cronEvery: '',
        incrementStart: '2017',
        incrementIncrement: '1',
        rangeStart: '',
        rangeEnd: '',
        specificSpecific: [],
      },
      output: {
        second: '',
        minute: '',
        hour: '',
        day: '',
        month: '',
        Week: '',
        year: '',
      }
    }
  },
  watch: {
    data() {
      this.rest(this.$data);
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    text() {
      return Language[this.i18n || 'cn']
    },
    secondsText() {
      let seconds = '';
      // eslint-disable-next-line prefer-const
      let cronEvery = this.second.cronEvery;
      // eslint-disable-next-line default-case
      switch (cronEvery) {
        case '1':
          seconds = '*';
          break;
        case '2':
          seconds = this.second.incrementStart + '/' + this.second.incrementIncrement;
          break;
        case '3':
          this.second.specificSpecific.map(val => {
            seconds += val + ','
          });
          seconds = seconds.slice(0, -1);
          break;
        case '4':
          seconds = this.second.rangeStart + '-' + this.second.rangeEnd;
          break;
      }
      return seconds;
    },
    minutesText() {
      let minutes = '';
      // eslint-disable-next-line prefer-const
      let cronEvery = this.minute.cronEvery;
      // eslint-disable-next-line default-case
      switch (cronEvery) {
        case '1':
          minutes = '*';
          break;
        case '2':
          minutes = this.minute.incrementStart + '/' + this.minute.incrementIncrement;
          break;
        case '3':
          this.minute.specificSpecific.map(val => {
            minutes += val + ','
          });
          minutes = minutes.slice(0, -1);
          break;
        case '4':
          minutes = this.minute.rangeStart + '-' + this.minute.rangeEnd;
          break;
      }
      return minutes;
    },
    hoursText() {
      let hours = '';
      // eslint-disable-next-line prefer-const
      let cronEvery = this.hour.cronEvery;
      // eslint-disable-next-line default-case
      switch (cronEvery) {
        case '1':
          hours = '*';
          break;
        case '2':
          hours = this.hour.incrementStart + '/' + this.hour.incrementIncrement;
          break;
        case '3':
          this.hour.specificSpecific.map(val => {
            hours += val + ','
          });
          hours = hours.slice(0, -1);
          break;
        case '4':
          hours = this.hour.rangeStart + '-' + this.hour.rangeEnd;
          break;
      }
      return hours;
    },
    daysText() {
      let days = '';
      // eslint-disable-next-line prefer-const
      let cronEvery = this.day.cronEvery;
      // eslint-disable-next-line default-case
      switch (cronEvery) {
        case '1':
          break;
        case '2':
        case '4':
        case '11':
          days = '?';
          break;
        case '3':
          days = this.day.incrementStart + '/' + this.day.incrementIncrement;
          break;
        case '5':
          this.day.specificSpecific.map(val => {
            days += val + ','
          });
          days = days.slice(0, -1);
          break;
        case '6':
          days = "L";
          break;
        case '7':
          days = "LW";
          break;
        case '8':
          days = this.day.cronLastSpecificDomDay + 'L';
          break;
        case '9':
          days = 'L-' + this.day.cronDaysBeforeEomMinus;
          break;
        case '10':
          days = this.day.cronDaysNearestWeekday + "W";
          break
      }
      return days;
    },
    weeksText() {
      let weeks = '';
      // eslint-disable-next-line prefer-const
      let cronEvery = this.day.cronEvery;
      // eslint-disable-next-line default-case
      switch (cronEvery) {
        case '1':
        case '3':
        case '5':
          weeks = '?';
          break;
        case '2':
          weeks = this.week.incrementStart + '/' + this.week.incrementIncrement;
          break;
        case '4':
          this.week.specificSpecific.map(val => {
            weeks += val + ','
          });
          weeks = weeks.slice(0, -1);
          break;
        case '6':
        case '7':
        case '8':
        case '9':
        case '10':
          weeks = "?";
          break;
        case '11':
          weeks = this.week.cronNthDayDay + "#" + this.week.cronNthDayNth;
          break;
      }
      return weeks;
    },
    monthsText() {
      let months = '';
      // eslint-disable-next-line prefer-const
      let cronEvery = this.month.cronEvery;
      // eslint-disable-next-line default-case
      switch (cronEvery) {
        case '1':
          months = '*';
          break;
        case '2':
          months = this.month.incrementStart + '/' + this.month.incrementIncrement;
          break;
        case '3':
          this.month.specificSpecific.map(val => {
            months += val + ','
          });
          months = months.slice(0, -1);
          break;
        case '4':
          months = this.month.rangeStart + '-' + this.month.rangeEnd;
          break;
      }
      return months;
    },
    yearsText() {
      let years = '';
      // eslint-disable-next-line prefer-const
      let cronEvery = this.year.cronEvery;
      // eslint-disable-next-line default-case
      switch (cronEvery) {
        case '1':
          years = '*';
          break;
        case '2':
          years = this.year.incrementStart + '/' + this.year.incrementIncrement;
          break;
        case '3':
          this.year.specificSpecific.map(val => {
            years += val + ','
          });
          years = years.slice(0, -1);
          break;
        case '4':
          years = this.year.rangeStart + '-' + this.year.rangeEnd;
          break;
      }
      return years;
    },
    /*cron() {
      return `${this.secondsText || '*'} ${this.minutesText || '*'} ${this.hoursText || '*'} ${this.daysText || '*'} ${this.monthsText || '*'} ${this.weeksText || '?'} ${this.yearsText || '*'}`
    },*/
    cron() {
      return `${this.secondsText || '*'} ${this.minutesText || '*'} ${this.hoursText || '*'} ${this.daysText || '*'} ${this.monthsText || '*'} ${this.weeksText || '?'}`
    },
  },
  methods: {
    getValue() {
      return this.cron;
    },
    change() {
      this.$emit('change', this.cron);
      this.close();
    },
    close() {
      this.$emit('close')
    },
    rest(data) {
      // eslint-disable-next-line prefer-const
      for (let i in data) {
        if (data[i] instanceof Object) {
          this.rest(data[i])
        } else {
          // eslint-disable-next-line default-case
          switch (typeof data[i]) {
            case 'object':
              data[i] = [];
              break;
            case 'string':
              data[i] = '';
              break;
          }
        }
      }
    }
  }
}</script>
