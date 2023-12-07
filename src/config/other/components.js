/**
 * @created by kongqf
 * @description 全局自定义组件导入
 */
import Vue from 'vue'
import YuToolbar from '@/components/base/YuToolbar'
import YuPanel from '@/components/base/YuPanel'
import YuFormButtons from '@/components/base/YuFormButtons'
import YuToolBar from '@/components/widgets/YuToolBar'
import YufpIndustrySelector from '@/components/widgets/YufpIndustrySelector'
import YuIndustryClassfy from '@/components/widgets/YuIndustryClassfy'
import YufpSelectUser from '@/components/widgets/YufpSelectUser'
import YufpFrameList from '@/components/widgets/YufpFrameList'
import YufpDropDownTable from '@/components/widgets/YufpDropDownTable'
import YufpProductSelector from '@/components/widgets/YufpProductSelector'
import YufpEditTable from '@/components/widgets/YufpEditTable'
import YufpDemoSelector from '@/components/widgets/YufpDemoSelector'
import YufpOrgTree from '@/components/widgets/YufpOrgTree'
import YufpUserSelector from '@/components/widgets/YufpUserSelector'
import YufpWordCloud from '@/components/widgets/YufpWordCloud'
import YufpSearchTree from "@/components/widgets/YufpSearchTree"
import YufpPasswordModify from "@/components/widgets/YufpPasswordModify"
// import YufpCalendar from "@/components/widgets/YufpCalendar"
// 工作流相关
import YufpNwfInit from "@/components/widgets/YufpNwfInit"
import YufpNwfSubmit from '@/components/widgets/YufpNwfSubmit'
import YuWorkflow from '@/components/features/YuWorkflow'
import YufpUserSelectDialog from '@/components/features/YufpUserSelectDialog'
import YufpCopyUserSelector from '@/components/features/YufpCopyUserSelector'
import YufpNodeScriptEditor from '@/components/features/YufpNodeScriptEditor'
import YufpSubIdSelector from '@/components/features/YufpSubIdSelector'
import StandardCascader from '@/components/widgets/StandardCascader'

//关于低码的都先注释  因为这里yuxp的文件都删除了所以这里引入都注释
// import PopupCustom from '@/views/yuxp/component/PopupCustom'
// import PopupPage from '@/views/yuxp/component/PopupPage'
// import TreeSelect from '@/views/yuxp/component/TreeSelect'
// import Tinymce from '@/views/yuxp/component/Tinymce/index'

// import TableFormatex from '@/views/yuxp/component/CustomFormat/table-formatex'
// import XpStep from '@/views/yuxp/component/Steps/index'
// import XpUpload from '@/views/yuxp/component/Upload/index'
// import Iframe from '@/views/yuxp/component/Iframe/index';
// import TemplateFactory from '@/views/yuxp/templatefactory/index'
// import Icon from '@/views/yuxp/component/icon/Icon.vue';

// import DropMoreMenu from '@/views/yuxp/designer/components/dropmoremenu';
import YuCustomerItem from '@/components/widgets/YuProtal/YuCustomerItem.vue';

// import YuwpBuiAce from 'yuwp-bui-ace'
Vue.component(StandardCascader.name, StandardCascader)
Vue.component(YuToolbar.name, YuToolbar);
Vue.component(YuPanel.name, YuPanel);
Vue.component(YuFormButtons.name, YuFormButtons);
Vue.component(YuToolBar.name, YuToolBar);
Vue.component(YufpIndustrySelector.name, YufpIndustrySelector);
Vue.component(YuIndustryClassfy.name, YuIndustryClassfy);
Vue.component(YufpSelectUser.name, YufpSelectUser);
Vue.component(YufpFrameList.name, YufpFrameList);
Vue.component(YufpDropDownTable.name, YufpDropDownTable);
Vue.component(YufpProductSelector.name, YufpProductSelector);
Vue.component(YufpEditTable.name, YufpEditTable);
Vue.component(YufpDemoSelector.name, YufpDemoSelector);
Vue.component(YufpOrgTree.name, YufpOrgTree);
Vue.component(YufpUserSelector.name, YufpUserSelector);
Vue.component(YufpWordCloud.name, YufpWordCloud);
Vue.component(YufpSearchTree.name, YufpSearchTree);
Vue.component(YufpPasswordModify.name, YufpPasswordModify);
// Vue.component(YufpCalendar.name, YufpCalendar);

Vue.component(YufpNwfInit.name, YufpNwfInit);
Vue.component(YufpNwfSubmit.name, YufpNwfSubmit);
Vue.component(YuWorkflow.name, YuWorkflow);
Vue.component(YufpUserSelectDialog.name, YufpUserSelectDialog);
Vue.component(YufpCopyUserSelector.name, YufpCopyUserSelector);
Vue.component(YufpNodeScriptEditor.name, YufpNodeScriptEditor);
Vue.component(YufpSubIdSelector.name, YufpSubIdSelector);

// Vue.component(PopupCustom.name, PopupCustom);
// Vue.component(PopupPage.name, PopupPage);
// Vue.component(TreeSelect.name, TreeSelect);
// Vue.component(Tinymce.name, Tinymce);
// Vue.component(XpStep.name, XpStep);
// Vue.component(XpUpload.name, XpUpload);
// Vue.component(Iframe.name, Iframe);
// Vue.component(Icon.name, Icon);
// Vue.component(TableFormatex.name, TableFormatex);
// Vue.component(DropMoreMenu.name, DropMoreMenu);
// Vue.component(TemplateFactory.name, TemplateFactory);
// 客户卡片下拉提示组件
Vue.component(YuCustomerItem.name, YuCustomerItem);

// 导入视频播放插件
import ViderPlayer from 'vue-video-player'// 引入视频播放插件
// window.videojs = ViderPlayer.videojs // 为添加多语言
import 'vue-video-player/src/custom-theme.css' //引入视频样式
import 'video.js/dist/video-js.css'
// import 'video.js/dist/lang/zh-CN.js' // 为添加多语言
Vue.use(ViderPlayer)

// 资讯部分走马灯
import scroll from 'vue-seamless-scroll'
Vue.use(scroll)
