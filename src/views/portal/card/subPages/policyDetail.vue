/**
* Desc:&emsp;&ensp;政策解读详情页
* @author  柳鸣威&emsp;liyuan7@yusys.com.cn
* @date    2023/12/9
* @since   1.0.0
* @version 1.0
*/
<template>
  <div class="ask-center-detail tinymceDetails">
    <div class="new-content" v-if="formdata">
      <div class="ask-center">
        <!-- 标题和时间 -->
        <span class="ask-center-title">{{ formdata.lawstitle || "--"}}</span>
        <el-divider></el-divider>
        <span class="ask-center-time">
          <i>{{ formdata.publishdate }}</i>
        </span>
        <div class="news-detail">
          <div class="el-news-detail">
            <span v-if="text" v-html="text"></span>
            <empty-msg v-else />
          </div>
        </div>
      </div>
    </div>
    <empty-msg v-else :msg="$t('dashboard.askEmpty')" />
    <!-- </el-card> -->
  </div>
</template>

<script>
import EmptyMsg from "@/components/layout/emptyMsg/index.vue";

export default {
  name: "policyDetail",
  components: {
    EmptyMsg,
  },
  data() {
    return {
      formdata: {
        publicdate: ''
      },
      text: ""
    };
  },
  created() {
    this.formdata = this.$route.query
    this.getInfo();
  },
  methods: {
    // 获取详情
    getInfo() {
        this.$request({
            url: backen.portalService + "/api/xmhinformation/fileUploadInfo",
            data: { page: 1, size: 8},
            }).then(res => {
            if (res &&res.code === '0') {
                res.data.map(item => {
                    if (this.formdata.id === item.id) {
                      this.formdata.lawstitle = item.lawstitle
                      this.formdata.publicdate = item.publicdate
                      let formtext = item.text
                      this.text = formtext ? formtext.replace(/\\n/g, "<br/>") : ''
                    }
                })
            }
        })
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/variables.scss";
.ask-center-detail {
  // max-width: 1200px;
  margin: 0 auto;
  padding: 16px 0;
  .new-content {
    // padding: 18px;
    // padding-top: 0;
    .ask-center {
      overflow: hidden;
      &-title {
        font-size: 24px;
        text-align: center;
        display: inline-block;
        width: 100%;
      }
      &-time {
        display: inline-block;
        line-height: 14px;
        padding-right: 20px;
        text-align: center;
        width: 100%;
        margin-bottom: 35px;
        .is-import {
          color: red;
        }
      }
      & > p {
        font-size: 15px;
        text-align: justify;
        line-height: 24px;
        letter-spacing: 2px;
        margin-bottom: 20px;
      }
      &-img {
        height: 240px;
        line-height: 240px;
        text-align: center;
      }
      .download {
        a {
          cursor: pointer;
        }
        .filetitle {
          margin-bottom: 10px;
          font-weight: normal;
          font-size: 14px;
        }
        .filelist {
          margin-right: 24px;
          line-height: 32px;
          white-space: nowrap;
          color: $aColorHover;
          &:hover {
            text-decoration: underline;
          }
          > a {
            color: $aColorHover;
          }
          .pdf-icon {
            font-size: 14px;
          }
        }
      }
    }
  }
}
.news-detail {
  max-height: 600px;
  padding: 0 8px;
  overflow: auto;
  .el-news-detail {
    word-break: break-all;
    p {
      font-size: 15px;
      text-align: justify;
      line-height: 24px;
      font-weight: 400;
      margin-bottom: 30px;
    }
    img {
      object-fit: contain;
      max-width: 100%;
      float: none;
    }
  }
}
</style>

<style>
.ask-center-detail .ask-center .el-divider--horizontal {
  margin: 19px auto 16px auto;
  background-color: #ededed;
}
.ask-center-detail p {
  line-height: 2;
}
.ask-detail .ask-center-detail .new-content {
  padding-top: 0;
}
</style>
