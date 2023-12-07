<script>
import frameConfig from "@/config/frame";

export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    level: {
      type: Number,
      default: -1
    },
    titleclass: {
      type: String,
      default: ""
    }
  },
  render(h, context) {
    const {icon, title, titleclass} = context.props;
    const vnodes = [];
    if (icon) {
      if (frameConfig.baseMenuOptions.showMenuIcon === false) {
        if (context.props.level === 1) {
          icon.indexOf("yu-") > -1 || icon.indexOf("el-") > -1
            ? vnodes.push(<i class={icon}/>)
            : vnodes.push(<svg-icon icon-class={icon}/>);
        }
      } else {
        icon.indexOf("yu-") > -1 || icon.indexOf("el-") > -1
          ? vnodes.push(<i class={icon}/>)
          : vnodes.push(<svg-icon icon-class={icon}/>);
        vnodes.push(<i class={icon}/>)
      }
    } else {
      vnodes.push(<i class="yu-icon-box1" style="visibility: hidden;"/>)
    }

    if (title) {
      vnodes.push(<span class={titleclass}>{title}</span>);
    }
    return vnodes;
  }
};
</script>
<style lang="scss">
  .empty-icon {
    width: 16px;
    height: 21px;
  }

  i {
    font-style: normal;
  }
</style>
