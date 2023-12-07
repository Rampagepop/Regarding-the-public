<template>
  <yu-xdialog
    :visible="visible"
    :show-close="false"
    :resizeable="false"
    :append-to-body="false"
    :size="dialogSize"
    destroy-on-close
    custom-class="dialog-advertisement dialog-advertisement-dashboard"
    top="50%"
    :middle="false"
  >
    <div :class="`advertisement ${windowSpecCd[adsInfo.windowSpecCd || 20]}`">
      <div class="advertSbj" @click="linkFn">{{ adsInfo.advertSbj }}</div>
      <div @click="closeAds" class="close">
        <div>
          <!-- <span>X</span> -->
          <span v-if="adsInfo.playBackDuration">{{
            adsInfo.playBackDuration + "s"
          }}</span>
          <!-- <span v-else>{{ $t("dashboard.addsClose") }}</span> -->
          <i class="iconfont yu-icon-close" v-else></i>
        </div>
      </div>
      <div
        class="adv-content"
        @mouseenter="mouseenterFn"
        @mouseleave="mouseleaveFn"
      >
        <img :src="adsInfo.sourceUrl" alt="" v-if="isPicture && visible" />
        <video-player
          ref="videoRef"
          v-else-if="adsInfo.sourceUrl && visible"
          :options="playerOptions"
          @play="playFn"
          @ended="endPlay"
          @pause="pauseFn($event)"
          @ready="setPlayerReady"
          @timeupdate="onPlayerTimeUpdate($event)"
        >
        </video-player>
      </div>
    </div>
  </yu-xdialog>
</template>
<script>
export default {
  name: "YuAdvertisement",
  props: {
    adsInfo: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogSize: '',
      currentTime: 0,
      timer: "",
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: true, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", // 类型
            src: "", // url地址
          },
        ],
        poster: "", // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controls: true,
        controlBar: {
          volumePanel: { inline: false },
          // volumeControl: true,
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
      isPicture: false, // 图片or视频
      isEnded: false, //视频是否播放结束
      windowSpecCd: {
        10: "source-width-b",
        20: "source-width-m",
        30: "source-width-s",
      },
      // :class="windowSpecCd[adsInfo.windowSpecCd]"
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.isPicture = this.adsInfo.contentType === 1
        if (!this.isPicture) {
          this.playerOptions.sources[0].src = this.adsInfo.sourceUrl;
        }
        if (this.adsInfo.playBackDuration) {
          this.timeOut();
        }
      }
    },
    'adsInfo.adSize': {
      handler(val) {
        const sizeType = ['tiny', 'small', 'large', 'full']
        this.dialogSize = sizeType[val - 1]
      }
    }
  },
  destroyed() {
    // if(this.timer) {
    //   // this.closeAdds()
    // }
    clearInterval(this.timer);
  },
  methods: {
    mouseenterFn() {
      if (document.querySelector(".vjs-control-bar")) {
        document.querySelector(".vjs-control-bar").style.display = "flex";
      }
    },
    mouseleaveFn() {
      if (document.querySelector(".vjs-control-bar")) {
        document.querySelector(".vjs-control-bar").style.display = "none";
      }
    },
    closeAds() {
      //advCloseFlag=Y允许提前关闭
      if (this.adsInfo.advCloseFlag === "N") {
        if (this.isPicture) {
          if (this.adsInfo.playBackDuration > 0) {
            this.$message.warning(this.$t("dashboard.adsTip0"));
          } else {
            this.destroyedAdv();
          }
        } else {
          if (this.isEnded) {
            this.destroyedAdv();
          } else {
            this.$message.warning(this.$t("dashboard.adsTip1"));
          }
        }
      } else {
        this.destroyedAdv();
      }
    },
    // 开启倒计时
    timeOut() {
      this.timer = setInterval(() => {
        this.adsInfo.playBackDuration--;
        if (this.adsInfo.playBackDuration === 0) {
          this.forcePlay = true;
          clearInterval(this.timer);
        }
      }, 1000);
    },
    playFn() {
      if (document.querySelector(".vjs-control-bar")) {
        document.querySelector(".vjs-control-bar").style.display = "none";
      }
    },
    // 设置视频开始的进度
    setPlayerReady(player) {
      // console.log(this.$refs.videoRef);
      // console.log(player);
      // debugger
      // this.$refs.videoRef.currentTime(30);
      player.currentTime(this.currentTime);
    },
    // 获取视频播放进度
    onPlayerTimeUpdate(player) {
      // debugger
      this.currentTime = player.cache_.currentTime;
    },
    // 视频暂停
    pauseFn(player) {
      // this.currentTime = player.cache_.currentTime;
      player.currentTime(this.currentTime);
    },
    // 视频结束
    endPlay() {
      this.forcePlay = false;
      this.isEnded = true;
    },
    linkFn() {
      const url = this.adsInfo.overLink;
      if (this.adsInfo.overLink) {
        if (this.adsInfo.overLink.indexOf("http") != -1) {
          window.open(url);
        } else {
          url &&
            this.$router.push({
              path: url,
            });
        }
      }
    },
    // 是否将状态存储到缓存中
    destroyedAdv() {
      this.$emit("closeDialog");
      this.$store.commit("settings/SET_ADVERTISE", this.adsInfo.showFrequency);
      // localStorage.setItem("adsFlag", true);
      this.timer && clearInterval(this.timer);
    },
  },
};
</script>
<style lang="scss" scoped>
// ::v-deep .el-dialog-x__wrapper {
//   display: flex;
//   justify-content: space-around;
//   align-items: center;
// }
// ::v-deep .el-dialog-x {
//   display: flex;
//   align-items: center;
//   justify-content: space-around;
//   // transform: translate(0, -50%);
//   border-radius: 5px;
// }
::v-deep .el-dialog-x--full {
  transform: translate(0, 0);
}
// .el-dialog-x__wrapper {
//   z-index: 999999 !important;
// }
::v-deep .el-dialog-x__header {
  width: 0;
  height: 0;
  display: none;
}
::v-deep .el-dialog-x__body {
  padding: 0;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.advertisement {
  max-height: 100vh;
  cursor: pointer;
  width: 100%;
  // height: 100%;
  // width:1244px;
  // min-height: 300px;
  // height:482px;
  // position: relative;
  img,
  video {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
  .advertSbj {
    position: absolute;
    left: 20px;
    top: 14px;
    color: #ffffff;
    z-index: 999;
  }
  .close {
    display: flex;
    position: absolute;
    justify-content: space-around;
    align-items: center;
    right: 16px;
    top: 16px;
    color: rgba(255, 255, 255, 0.25);
    font-size: 14px;
    z-index: 99;
    width: 40px;
    height: 40px;
    background: rgb(0, 0, 0, 0.4);
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      background: rgb(0, 0, 0, 0.5);
      color: rgba(255, 255, 255, 0.75);
    }
    span:nth-of-type(1) {
      display: inline-block;
    }
    span:nth-of-type(2) {
      display: inline-block;
      min-width: 40px;
      text-align: center;
    }
  }
}
.source-width-s {
  width: 560px;
}
.source-width-m {
  // width: 880px;
}
.source-width-b {
  width: 1200px;
}
</style>
<style>
.vjs-slider-vertical .vjs-volume-level:before {
  left: -4px !important;
}
.dialog-advertisement {
  position: absolute;
  /* visibility: visible !important; */
  transform: translateY(-50%);
  max-height: 100%;
  overflow: auto;
}
.el-dialog-x--full.dialog-advertisement {
  transform: translateY(0);
}
.compact .dialog-advertisement-dashboard .el-dialog-x__body {
  padding: 0;
}
</style>
