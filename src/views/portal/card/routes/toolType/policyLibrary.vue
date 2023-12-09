/**
* Desc:&emsp;&ensp;政策解读卡片
* @author  柳鸣威&emsp;liyuan7@yusys.com.cn
* @date    2023/12/9
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-wrap :cardName="cardName">
    <template slot="menus">
      <li @click="moreInfoClickFn">{{ $t("card.policyLibrary.more") }}</li>
    </template>
    <empty-msg v-if="!listData || listData.length === 0"></empty-msg>
    <!-- <yu-card-empty v-if="!listData || listData.length === 0" /> -->
    <div class="risk-warning-wrap" v-else>
      <div class="yu-grid" v-for="(item, index) of listData" :key="index">
        <div class="yu-grid-left">
          <div class="yu-grid-left-status">
            <div
              :class="['status', getClassByNum(item.typecode)]"
              class="reset-background"
            >
              {{ "[" + getPrefixStatusText(item.typecode) + "]" }}
            </div>
          </div>
          <div class="yu-grid-left-content" @click="handleDownload(item)">
              <div slot="reference" class="content">
                {{ item.lawstitle }}
              </div>
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
import { lookup } from '@/utils'
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
  filter: {
    timetype: function(time) {
      if (time) {
        const result2 = time.substring(4,6);
        const result3 = time.substring(6,8);
        return result2 + '-' + result3
      } else {
        return '00-00'
      }
    }
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
    ...mapGetters(["selectedRoles"]),
  },
  mounted() {
    this.getCustomerCount();
  },
  methods: {
    //  跳转政策解读详情页面
    handleDownload(data) {
      this.$router.push({ path: "/Policyinterpretation/" + data.id, query: { id: data.id }});
    },
    moreInfoClickFn() {
      const route = '/portal/card/subPages/policyLibraryDetail';
      this.$router.addRoute(route, this.$t("card.policyLibrary.title"));
      this.$router.push(route);
    },
    getClassByNum(num) {
      if (num === '2') {
        return "status-released";
      } else if (num === '4') {
        return "status-effect";
      } else {
        return "status-other";
      }
    },
    // 获取政策解读数据
    getCustomerCount() {
      this.$request({
        url: `${this.$backend.portalService}/api/tqlawsinfo/selectlaws`,
        data: {
          page: 1,
          size: 8,
        }
      }).then(res => {
        if (res && res.code === "0") {
          this.listData = res.data;
        }
      });
    },
    // 前置状态标记描述
    getPrefixStatusText(status) {
      return ["国家法律", "行规法规", "部门规章", "规范性文件", "发文通知", "其他", "司法解释", "立法解释", "地方性法规", "地方政府规章", "地方规范文件", "地方司法文件"][status - 1];
    },
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
