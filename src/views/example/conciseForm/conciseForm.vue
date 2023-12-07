<template>
  <div class="concise-form">
    <yu-panel title="表单" is-collapse panel-type="simple">
      <yu-xform ref="refForm" label-width="120px" v-model="formdata" hover-show-message>
        <!-- <yu-xform-group> -->
        <yu-row>
          <yu-col :span="10">
            <yu-xform-item label="分类" ctype="select" placeholder="请选择" name="type" data-code="USER_CLASSIFY" :rules="rule[0]"></yu-xform-item>
            <yu-xform-item label="作者" ctype="input" placeholder="请输入作者" name="author" :rules="rule[0]"></yu-xform-item>
            <yu-xform-item label="标题" placeholder="50个字符以内" maxlength="50" :colspan="12" ctype="input" name="title" :rules="rule[0]"></yu-xform-item>
          </yu-col>
          <yu-col :span="24">
            <yu-xform-item label="正文内容" ctype="textarea" name="content" maxlength="2000" placeholder="2000个字符以内" :rows="8" :colspan="24" :rules="rule[0]"></yu-xform-item>
            <yu-xform-item label="附件" ctype="custom" name="custom">
              <yu-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleChange" :file-list="fileList3">
                <yu-button>添加</yu-button>
              </yu-upload>
            </yu-xform-item>
          </yu-col>
        </yu-row>
        <!-- </yu-xform-group> -->
      </yu-xform>
    </yu-panel>
    <yu-form-buttons :padding-left="124">
      <yu-button type="primary" @click="saveFn">提交</yu-button>
      <yu-button @click="resetFn">重置</yu-button>
    </yu-form-buttons>
  </div>
</template>
<script>
import { lookup, clone } from '@/utils';
import { validator } from "@/utils/validate";
lookup.reg(
  "USER_STATUS,USER_CLASSIFY,DEPARTMENT,GENDER,IDENT_TYPE,BRANCH,PWD_TYPE"
); // 注册该功能要用到的数据字典

export default {
  name: "conciseForm",
  data () {
    /**
     * 检验分数，数字必须为0~100
     */
    const checkAcco = function(rule, value, callback) {
      setTimeout(function() {
        const reg = /^[0-9a-zA-Z]+$/;
        if (!reg.test(value)) {
          callback(new Error("账号必须为数字或英文"));
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      // 用户状态
      userStatus: {},
      // 编辑表格表单
      formdata: {},
      // 校验规则
      rule: [
        { required: true, message: "必填项" },
        { validator: validator.number, message: "数字" }
      ],
      // 上传文件列表
      fileList3: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          status: "finished"
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          status: "finished"
        }
      ]
    };
  },
  created () {
    // 查找数据字典项，第二个参默认true，配置为false时，返回对象，key/value形式
    this.userStatus = lookup.find("USER_STATUS", false);
  },
  methods: {
    /**
     * 保存
     */
    saveFn (data) {
      const _this = this;
      const model = {};
      // 深拷贝
      clone(_this.formdata, model);
      let validate = false;
      // 执行表单校验
      _this.$refs.refForm.validate(function(valid) {
        // 表单校验成功
        validate = valid;
      });
      // 表单校验失败
      if (!validate) {
        return;
      }
      // 向后台发送保存请求
      this.$request({
        method: "POST",
        url: "/example/concise/save",
        data: model
      }).then((code, message, response) => {
        //处理请求成功的情况
        _this.$message("操作成功");
      })
    },
    /**
     * 上传改变时
     */
    handleChange () {},
    /**
     * 重置所有表单内容
     */
    resetFn (data) {
      this.$refs.refForm.resetFields();
    }
  }
};
</script>
