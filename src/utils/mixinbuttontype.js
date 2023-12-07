//<yu-button> plain 线框模式下 type 统一规范控制；
import buttontypelib from '@/config/buttontypelib' //按钮 type 统一规范；

export default {
  data: function () {
    return {buttontypelib};
  },
  methods: {
    $matchButtonType(str) { 
      const _type = this.buttontypelib[str] ? this.buttontypelib[str] : "info"
      return _type;
    },
  }
};

// 使用方法，在具体的页面中增加：
// import mixinbuttontype from '@/utils/mixinbuttontype';
// export default {
//        mixins: [mixinbuttontype],
// }


// <yu-button icon="yx-bin" :type="$matchButtonType('删除')" plain @click="delFn">删除</yu-button> 
