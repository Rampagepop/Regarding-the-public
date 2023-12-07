<!--
 * @FileDescription: 选择输入框标签展示值
 * @Author: 
 * @Date: 2022/09/15
 * @LastEditors:
 * 选项说明 
 -->
<template>
  <!-- 父盒子 -->
  <div class="father_box" @click="onclick">
    <div v-for="(item, index) in TagsAll" :key="index" class="spanbox">
      <span class="tagspan">{{ item.userName }}</span>
      <i class="span_close" @click="removeTag(index, item.userId)"></i>
    </div>
    <i slot="suffix" class="el-input__icon el-icon yu-icon-search1 is-clickable iconStyle" @click="openSelector" v-if="iconShow"></i>
    <input
      :placeholder="inputPlaceholder"
      v-model="rawValue"
      class="inputTag"
      ref="inputTag"
      type="text"
      readonly
      :disabled="inputDisabled"
      :on-icon-click="openSelector"
    />
  </div>
</template>
<script>
import { clone } from '@/utils'
export default {
  name: 'YufpSelectUserForWf',
  componentName: 'YufpSelectUserForWf',
  props: {
    placeholder: String,
    disabled: Boolean,
    iconShow: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
  },
  data: function() {
    return {
      inputDisabled: this.disabled,
      rawValue: '',
      inputPlaceholder: this.placeholder,
      TagsAll: [],
    };
  },
  watch: {
    value: function (newVal, oldVal) {
      this.checkTags(newVal);
    },
    rawValue: function (newVal, oldVal) {
      this.$emit('input', newVal);
    },
    disabled: function (newVal, oldVal) {
      this.inputDisabled = newVal;
    },
    placeholder: function (newVal, oldVal) {
      this.inputPlaceholder = newVal;
    }
  },
  created: function () {
    this.rawValue = this.rawValue ? this.rawValue : this.value;
    if(this.value) {
      this.checkTags(this.value);
    }
  },
  methods: {
    //计算属性：计算出动态输入框宽度
    // inputStyle() {
    //   let style = {};
    //   style.width = `${this.inputLength}px`;
    //   return style;
    // },
    checkTags: function(newVal) {
      this.TagsAll = [];
      if(newVal) {
        this.TagsAll = newVal;
      }
    },
    // 用于打开选择框
    openSelector: function () {
      this.$emit("click-icon");
    },
    //点击叉叉删除tag
    removeTag(index, item) {
      this.TagsAll.splice(index, 1);
      this.$emit('tag-close', this.TagsAll);
    },
    //点击父盒子输入框获取焦点
    onclick() {
      this.$nextTick(() => {
        this.$refs.inputTag.focus();
      });
    }
  }
}
</script>
<style lang="scss" scoped>
/* 外层div */
.father_box {
  box-sizing: border-box;
  background-color: white;
  border: 1px solid #409EFF;
  border-radius: 4px;
  font-size: 12px;
  text-align: left;
  padding-left: 5px;
  margin-right: 3px;
  word-wrap: break-word;
  overflow: hidden;
}
/* 标签 */
.spanbox {
  height: 30px;
  display: inline-block;
  font-size: 14px;
  margin: 3px 4px 3px 0;
  background-color: #ecf5ff;
  border: 1px solid #e8eaec;
  border-radius: 3px;
  // box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  box-shadow: none

}
/* 标签文字 */
.tagspan {
  height: 24px;
  line-height: 22px;
  max-width: 99%;
  position: relative;
  display: inline-block;
  padding-left: 8px;
  // color: #409EFF;
  font-size: 14px;
  opacity: 1;
  vertical-align: middle;
  overflow: hidden;
  transition: 0.25s linear;
}
/* tag的叉叉 */
.span_close {
  padding: 0 6px 0 4px;
  opacity: 1;
  -webkit-filter: none;
  filter: none;
  color: #409EFF;
  /* font-weight: 600; */
  cursor:pointer;
}
/* 鼠标经过叉叉 */
.span_close:hover{
  background-color: #409EFF;
  border-radius: 50%;
  color: #fff;
}
.span_close:after {
  content: "\00D7";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* line-height: 27px; */
  transition: 0.3s, color 0s;
}
/* input */
.inputTag {
  font-size: 16px;
  border: none;
  box-shadow: none;
  outline: none;
  background-color: transparent;
  padding: 0;
  width: 0px;
  min-width: 0px;
  vertical-align: top;
  height: 32px;
  color: #495060;
  line-height: 32px;
}
/* 输入框提示文字大小 */
input:placeholder-shown {
font-size: 0.6rem;
}
.iconStyle {
    right: 40px !important;
}
</style>