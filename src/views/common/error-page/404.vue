<template>
  <!-- <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/common/images/404.png" alt="404">
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">
          OOPS!
        </div>
        <div class="bullshit__info">
          版权所有
          <a class="link-type" href="http://www.yusys.com.cn/" target="_blank" rel="noopener noreferrer">宇信科技</a>
        </div>
        <router-link to="/" class="bullshit__return-home">
          返回首页
        </router-link>
      </div>
    </div>
  </div> -->
  <div class="yu-error">
    <div class="yu-errorBox">
      <div class="yu-errorPic"></div>
      <div class="yu-errorText">
        <p>呵呵, 您访问的页面出错了啦!</p>
        <p><span>{{ num }}</span> 秒后返回至上一页 </p>
      </div> 
      <div class="yu-backHome">
        <a href="./index.html">返回工作台</a>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Page404',
  data () {
    return {
      num: 6
    }
  },
  mounted: function () {
    this.countdown(this.num);
  },
  methods: {
    countdown: function (count) {
      var _this = this;
      var timer;
      if (count == 0) {
        clearTimeout(timer);
        // window.history.back(); // 回到首页
        window.location.href = './index.html';
      } else {
        count -= 1;
        _this.num = count;
        timer = setTimeout(function () {
          _this.countdown(count);
        }, 1000);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.yu-error {min-height: 550px; background-color: #fff;width:100%;position:relative;}
.yu-errorBox {width:360px;height:400px;position:absolute;top:50%;left:50%;margin-left:-180px;margin-top:-200px;overflow:hidden}
.yu-errorPic {width:349px;height:197px;background:url(../../../assets/common/images/404.png) left center no-repeat}
.yu-errorText {margin-top:30px;font-size:16px;color:#949494;line-height:22px;overflow:hidden;text-align:center}
.yu-errorText p:last-child {color:#666666;margin-top:10px}
.yu-errorText span {color:#5557b9}
.yu-backHome a:link,.yu-backHome a:visited {display:block;width:200px;height:36px;line-height:36px;background:#5557B9;border-radius:2px;font-size:16px;color:#ffffff;margin-top:60px;text-align:center;margin-left:90px}
.yu-backHome a:hover {background:#4C4EAA}
.yu-backHome a:active {background:#444698}

body.blue .yu-errorText span {color:#2877FF}
body.blue .yu-backHome a:link,body.blue .yu-backHome a:visited {background:#2877FF;}
body.blue .yu-backHome a:hover {background:#1362EA}
body.blue .yu-backHome a:active {background:#175FDB}

body.orange .yu-errorText span {color:#FB8D12}
body.orange .yu-backHome a:link,body.orange .yu-backHome a:visited {background:#FB8D12;}
body.orange .yu-backHome a:hover {background:#E27C0A}
body.orange .yu-backHome a:active {background:#CD720D}
</style>
  