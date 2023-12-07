<template>
  <!-- <div class="errPage-container">
    <el-button icon="arrow-left" class="pan-back-btn" @click="back">
      返回
    </el-button>
    <img :src="errGif" alt="Girl has dropped her ice cream.">
    <h2>您没有权限去该页面</h2>
    <ul class="list-unstyled">
      <li class="link-type">
        <router-link to="/dashboard">
          回首页
        </router-link>
      </li>
    </ul>
  </div> -->
  <div class="yu-serverError">
    <div class="yu-serverErrorBox">
      <div class="yu-serverErrorPic"><span>500</span></div>
      <div class="yu-serverErrorText">
        <p>很抱歉,出错了!</p>
        <p>内部服务器错误，正在维修……</p>
        <p>暂时无法处理您的访问请求，请稍后再试</p>
      </div> 
      <div class="yu-backButton">
        <a href="#" onClick="javascript:history.back(-1);" class="yu-backPrevPage">返回上一页</a>
        <a href="./index.html" class="yu-backHome">返回首页</a>
      </div>
      <div class="yu-footerPic"></div>
    </div>  
  </div>
</template>

<script>

export default {
  name: 'Page401',
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.yu-serverError {min-height: 550px;background-color: #fff;width:100%;position:relative}
.yu-serverErrorBox {width:560px;height:480px;position:absolute;top:50%;left:50%;margin-left:-280px;margin-top:-240px;overflow:hidden}
.yu-serverErrorPic {width:421px;height:268px;margin-left:75px;background:url(../../../assets/common/images/500.png) center center no-repeat;position: relative}
.yu-serverErrorPic > span{color: #949494;font-size: 32px;position: absolute;left: 5px;top: 25px}
.yu-serverErrorText {font-size:16px;text-align:center;margin-top:10px;color:#949494;overflow:hidden}
.yu-serverErrorText p:first-child {color:#5557B9}
.yu-serverErrorText p {margin-top:10px}
.yu-backButton {margin-top:60px;text-align:center}
.yu-backButton a {width:160px;height:36px;line-height:36px;border-radius:2px;font-size:16px;display:inline-block}
.yu-backButton a:first-child:link,.yu-backButton a:first-child:visited {border:1px solid #5557b9;color:#5557b9;margin-right:20px;transition:.2s}
.yu-backButton a:first-child:hover {color:#4C4EAA;border:1px solid #4C4EAA}
.yu-backButton a:first-child:active {color:#444698;border:1px solid #444698}
.yu-backButton a:last-child:link,.yu-backButton a:last-child:visited {background:#5557B9;color:#fff;transition:.2s}
.yu-backButton a:last-child:hover {background:#4C4EAA}
.yu-backButton a:last-child:active {background:#444698}
.yu-footerPic {width:100px;height:100px;position:absolute;right:0;bottom:0;background:url(../../../assets/common/images/500_1.png) center center no-repeat}

body.blue .yu-serverErrorText p:first-child {color:#2877FF}
body.blue .yu-backButton a:first-child:link,body.blue .yu-backButton a:first-child:visited {border:1px solid #2877FF;color:#2877FF;}
body.blue .yu-backButton a:first-child:hover {color:#1362EA;border:1px solid #1362EA}
body.blue .yu-backButton a:first-child:active {color:#175FDB;border:1px solid #175FDB}
body.blue .yu-backButton a:last-child:link,body.blue .yu-backButton a:last-child:visited {background:#2877FF;color:#fff;}
body.blue .yu-backButton a:last-child:hover {background:#1362EA}
body.blue .yu-backButton a:last-child:active {background:#175FDB}

body.orange .yu-serverErrorText p:first-child {color:#FB8D12}
body.orange .yu-backButton a:first-child:link,body.orange .yu-backButton a:first-child:visited {border:1px solid #FB8D12;color:#FB8D12;}
body.orange .yu-backButton a:first-child:hover {color:#E27C0A;border:1px solid #E27C0A}
body.orange .yu-backButton a:first-child:active {color:#CD720D;border:1px solid #CD720D}
body.orange .yu-backButton a:last-child:link,body.orange .yu-backButton a:last-child:visited {background:#FB8D12;color:#fff;}
body.orange .yu-backButton a:last-child:hover {background:#E27C0A}
body.orange .yu-backButton a:last-child:active {background:#CD720D}
</style>
