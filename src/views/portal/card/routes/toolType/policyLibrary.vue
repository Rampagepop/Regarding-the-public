/* * @Author: chenzy13 * @Date: 2022-10-18 16:34:22 * @Last Modified by: jerry *
@Last Modified time: 2022-10-18 17:23:24 */
<template>
  <card-wrap :cardName="cardName">
    <template slot="menus">
      <li @click="toNextPage">{{ $t("card.policyLibrary.more") }}</li>
    </template>
    <div class="search-no-data" style="width:100%" v-if="!listData || listData.length === 0">
      <empty-msg></empty-msg>
    </div>
    <!-- <yu-card-empty v-if="!listData || listData.length === 0" /> -->
    <div class="risk-warning-wrap" v-else>
      <div class="yu-grid" v-for="(item, index) of listData" :key="index">
        <div class="yu-grid-left">
          <div class="yu-grid-left-status">
            <div
              :class="['status', getClassByNum(item.policyType)]"
              class="reset-background"
            >
              {{ "[" + getPrefixStatusText(item.policyType) + "]" }}
            </div>
          </div>
          <div class="yu-grid-left-content" @click="handleDownload(item)">
            <yu-popover
              :content="item.policyName"
              placement="right"
              width="100"
              trigger="hover"
            >
              <div slot="reference" class="content">
                {{ item.policyName }}
              </div>
            </yu-popover>
          </div>
        </div>
        <div class="yu-grid-right">
          <i>{{ item.createDate ? item.createDate.substring(5, 10) : "" }}</i>
        </div>
      </div>
    </div>
  </card-wrap>
</template>

<script>
import { getPolicyLibrary } from "@/api/portal/other";
import cardWrap from "@/views/portal/card/components/card-wrap";
import YuCardEmpty from "@/views/portal/card/components/empty.vue";
import EmptyMsg from "@/components/layout/emptyMsg/index.vue"
import { mapGetters } from "vuex";
export default {
  name: "policyLibrary",
  components: {
    cardWrap,
    EmptyMsg
  },
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t("card.policyLibrary");
      }
    }
  },
  data() {
    return {
      listData: []
    };
  },
  computed: {
    ...mapGetters([
      "selectedRoles",
    ]),
    orgName() {
      if (this.selectedRoles) {
        return `${this.selectedRoles.orgName}`;
      }
      return "";
    },
  },
  mounted() {
    this.getCustomerCount();
  },
  methods: {
    //下载
    handleDownload(data) {
      //一个文件下载是文件多个是压缩包
      this.$request({
        url: `${this.$backend.portalService}/api/xmhpolicy/download`,
        responseType: "arraybuffer",
        data: {
          ...data
        }
      }).then(res => {
        if (!res) {
          return;
        }
        const blob = new Blob([res.data]);
        const url = window.URL.createObjectURL(blob);
        // 重命名文件名称
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(new Blob([res.data]));
        link.target = "_blank";
        const filename = res.headers["content-disposition"] ? res.headers["content-disposition"].split("=")[1] : '';
        link.download = decodeURI(filename); // 下载的文件名称
        document.body.appendChild(link); // 添加创建的 a 标签 dom节点
        link.click(); // 下载
        document.body.removeChild(link); // 移除节点
      });
    },
    moreInfoClickFn() {
      const route = '/portal/card/subPages/policyLibraryDetail';
      this.$router.addRoute(route, this.$t("card.policyLibrary.title"));
      this.$router.push(route);
    },
    getClassByNum(num) {
      if (num === 2) {
        return "status-released";
      } else if (num === 1) {
        return "status-effect";
      } else {
        return "status-other";
      }
    },
    getCustomerCount() {
      this.$request({
        url: `${this.$backend.portalService}/api/xmhpolicy/search`,
        data: {
          page: 1,
          size: 8,
          applicableRoles:[this.selectedRoles.roleId]
        }
      }).then(res => {
        if (res && res.code === "0") {
          this.listData = res.data.list;
        }
      });
    },
    // 前置状态标记描述
    getPrefixStatusText(status) {
      return ["行内制度", "监管制度", "其他"][status - 1];
    },
    toNextPage() {
      this.moreInfoClickFn();
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  /* padding-top:2px; */
}
.search-no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.yu-grid {
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  line-height:32px;
  height:32px;
  /* padding: 6px 0px 6px; */
  &-left {
    display: flex;
    flex: 1;
    overflow: hidden;
    &-status {
      padding-right: 10px;
      div {
        /* width: 56px; */
        /* height: 20px;
        line-height: 20px; */
        border-radius: 4px;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
      }
      .status-effect {
        color: #2877ff;
      }
      .status-released {
        color: #fb8d12;
      }
      .status-other {
        color: #31d1be;
      }
    }
    &-content {
      flex: 1;
      overflow: hidden;
      font-size: 14px;
      color: #333333;
      cursor: pointer;
      &:hover {
        color: #2877ff;
      }
    }
  }
  &-right {
    font-size: 14px;
    color: #999999;
  }
}
</style>
