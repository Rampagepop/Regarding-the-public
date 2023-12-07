/**
 * @description 多语言切换同时在首页、登录页均存在，特将语言切换部分能力单独提取出来，通过mixin方式注入到 navbar 和 login页面
 * 防止在登录页面出现过多 navbar中才会出现的功能及接口调用
 * @created kongqf 2022.06.01
 */
import { clone } from 'xy-utils';
import { sessionStore } from '@/utils'
import { LANGUAGE } from '@/config/constant/app.data.common'
import frameConfig from "@/config/frame";
const bfOpts = frameConfig.baseFrameOptions; // frame中基础配置项

export default {
  data() {
    return {
      // 语言
      languageList: clone(bfOpts.languageList, []),
      // 已选中的语言
      currentLanguage: {},
    }
  },
  mounted() {
    // 将文档标题也修改一下
    window.document.title = bfOpts.logoTitle
  },
  methods: {
    /**
     * 语言切换
     * @param id 切换语言
     * @param flag 不触发保存配置
     */
    switchLanguage: function (id, flag) {
      const oldLanguage = clone({}, this.currentLanguage);
      // 设置checked 属性
      for (let i = 0; i < this.languageList.length; i++) {
        const element = this.languageList[i];
        if (element.id === id) {
          this.$set(element, "checked", true);
          // this.$i18n.locale = id;
          sessionStore.set(LANGUAGE, id)
          // 刷新页面
          setTimeout(() => {
            this.$message({
              message: this.$t("i18nSwitch.success"),
              type: "success",
            });
            window.location.reload()
          });
        } else {
          this.$set(element, "checked", false);
        }
      }
    },
  }
}