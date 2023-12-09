<template>
  <div class="ask-center-detail tinymceDetails">
    <!-- <el-card class="box-card"> -->
    <div class="new-content" v-if="newsDetail">
      <div class="ask-center">
        <!-- 标题和时间 -->
        <span class="ask-center-title">{{
          newsDetail.infTitle || "--"
        }}</span>
        <el-divider></el-divider>
        <span class="ask-center-time">
          <i :class="['ask-item-icon', 'icon-' + newsDetail.infType]"></i>
          <i class="is-import" v-if="newsDetail.important === 1">
            {{ $t("dashboard.import") }}
          </i>
          <i class="is-reminded" v-if="newsDetail.reminded === 1">
            {{ $t("dashboard.reminded") }}
          </i>
          <i>{{ newsDetail.releaseOrgName || newsDetail.createOrgName }}</i>
          <i>{{ newsDetail.releaseUserName }}</i>
          <i>{{ newsDetail.releaseDate }}</i>
        </span>
        <div class="news-detail">
          <div class="el-news-detail">
            <span
              v-if="newsDetail.infContent"
              v-html="newsDetail.infContent"
            ></span>
            <empty-msg v-else />
          </div>
          <!-- 附件 -->
          <template v-if="attachTabDTOS && attachTabDTOS.length > 0">
            <div class="download">
              <h3 class="filetitle">{{ $t("dashboard.download") }}</h3>
              <span
                v-for="(item, index) in attachTabDTOS"
                :key="index"
                class="filelist"
              >
                <svg-icon
                  :icon-class="getFileExtClass(item)"
                  class="pdf-icon"
                />
                <a @click="downloadFile(item)">{{ item.fileName }}</a>
              </span>
            </div>
          </template>
        </div>
      </div>
    </div>
    <empty-msg v-else :msg="$t('dashboard.askEmpty')" />
    <!-- </el-card> -->
  </div>
</template>

<script>
import htmlcode from "@/utils/htmlcode.js";
import {addViewTime, getAskDetail} from "@/api/portal/backstageAdmin.js";
import {addTokenInfo, download, getFileUrl} from "@/utils/util.js";
import EmptyMsg from "@/components/layout/emptyMsg/index.vue";

export default {
  name: "AskCenterDetail",
  components: {
    EmptyMsg,
  },
  props: {
    askId: {
      type: [String, Number],
      require: true,
    },
  },
  data() {
    return {
      newsDetail: null, // 资讯基础详情
      askcenterList: [], // 资讯列表
      attachTabDTOS: [], // 资讯附件列表
      infContent: "", // 资讯详情
      id: this.$route.params.id || this.$route.params.msgSrcId, // 资讯表主键
      loading: true,
    };
  },
  watch: {
    askId() {
      this.getInfo();
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    // 下载附件
    downloadFile(item) {
      download(getFileUrl(item.filePath)); // fixed: 文件下载报错
    },
    // 获取详情
    getInfo() {
      getAskDetail({ id: this.askId || this.id })
        .then((res) => {
          if (res.code === "0") {
            this.newsDetail = res.data;
            if (this.newsDetail.infContent) {
              this.infContent = htmlcode.decode(this.newsDetail.infContent);
            }
            var fileId = this.newsDetail.fileId;
            if (fileId) {
              // var uploadUrl = addTokenInfo(
              //   backend.fileService + "/api/file/provider/fileUpload"
              // );
              // this.$request({
              //   method: "POST",
              //   url: uploadUrl,
              //   data: { filePath: fileId },
              // }).then((data) => {
              //   if (data.length > 0) {
              //     this.attachTabDTOS = data;
              //   }
              // });
              this.$request({
                method: "POST",
                url: backen.portalService + "/api/xmhinformation/fileUploadInfo",
                data: fileId.split(','),
              }).then(({code, message, data}) => {
                if (data.length > 0) {
                  this.attachTabDTOS = data
                }
              })
            }
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          // 异常时说明信息不存在
          this.newsDetail = null
        });
    },
    // 用户阅读记录数
    addViewTime() {
      addViewTime({ id: this.id });
    },
    // 根据文件类型获取对应的图标
    getFileExtClass(item) {
      switch (item.extName.toLowerCase()) {
        case "png":
          return "png";
        case "jpg":
        case "jpeg":
          return "jpg";
        case "xlsx":
        case "xls":
          return "excel";
        case "doc":
        case "docx":
          return "doc";
        case "ppt":
        case "pptx":
          return "ppt";
        case "pdf":
          return "pdf";
        case "zip":
        case "7z":
        case "war":
          return "zip";
        default:
          return "documentation";
      }
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
  .breadcrumb-container {
    padding: 12px 24px;
    background-color: unset;
  }
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
