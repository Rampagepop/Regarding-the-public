<template>
  <div class="authorize-manage clear">
    <!-- 左侧角色或用户选择 -->
    <yu-auth-list
      :noUserAuth="true"
      @chooseAuthObjId="getAuthObjId"
    ></yu-auth-list>
    <!-- 右侧权限树选择 -->
    <div class="tree-box">
      <div class="tree-header" v-if="showTree">
        <div class="handle-btn">
          <yu-button
            type="primary"
            v-norepeat.disabled="saveDisabled"
            @click="saveFn"
          >
            {{ $t("roleDataPowerManager.bc") }}
          </yu-button>
          <yu-input
            v-model="tableKeyword"
            :placeholder="$t('roleDataPowerManager.gjz')"
            suffix-icon="yu-icon-search1"
            class="search-input"
            @suffix-click="tableSearchFn"
            @keyup.enter.native="tableSearchFn"
            maxlength="32"
            @clear="tableSearchFn"
            clearable
          ></yu-input>
        </div>
      </div>
      <div class="tree-content" v-if="showTree">
        <yu-xform
          ref="searchForm"
          related-table-name="cardsTable"
          v-model="searchFormdata"
          form-type="search"
          :custom-reset-fn="formResetFn"
        >
          <yu-xform-group :column="3">
            <yu-xform-item
              :label="$t('card.role.type')"
              :placeholder="$t('card.role.typePlaceholder')"
              name="cardTypeCode"
              ctype="select"
              data-code="CARD_TYPE"
            ></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
        <yu-xtable
          v-if="isRoleTab"
          ref="cardsTable"
          @loaded="loaded"
          row-number
          :data-url="pasteRoleUrl"
          :base-params="pasteRoleParam"
          :pageable="false"
          selection-type="checkbox"
          :default-load="false"
          key="cardsTable"
          @select="customSelectionFn"
          @select-all="customSelectAllFn"
        >
          <yu-xtable-column
            prop="cardName"
            :label="$t('card.name')"
          ></yu-xtable-column>
          <yu-xtable-column
            prop="cardCode"
            :label="$t('card.id')"
          ></yu-xtable-column>
          <yu-xtable-column
            prop="cardTypeCode"
            data-code="CARD_TYPE"
            :label="$t('card.cardtype')"
          ></yu-xtable-column>
          <yu-xtable-column
            prop="cardDesc"
            :label="$t('card.description')"
          ></yu-xtable-column>
        </yu-xtable>
      </div>
      <div class="no-choose" v-if="!showTree">
        <img src="@/assets/common/images/no-data.svg" />
        <p>{{ $t("roleDataPowerManager.nochoosetext") }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { clone } from "@/utils";
import YuAuthList from "@/components/widgets/YuAuthList";
import { findRolePrivCard } from "@/api/portal/card";
export default {
  components: { YuAuthList },
  data: function () {
    return {
      activeName: "R", // 当前被激活的页签
      chooseRoleId: "", // 已选择的角色/用户id
      isRoleTab: true, // 当前页签是否是角色授权
      isIndeterminate: false, // 全选/半选状态
      checkAll: false, // 是否全选
      reqRoleCardList: [], // 权限初始化选中的数组
      showTree: false, // 是否显示树
      pasteRoleUrl: backend.portalService + "/api/xmhcard/list",
      pasteRoleParam: { useStatus: 1, page: 1, size: 900 },
      expectedRoleId: "",
      expectedUserId: "",
      tableKeyword: "", // 粘贴弹框关键字
      saveDisabled: { show: false }, // 保存按钮防重复提交
      searchFormdata: {}, // 查询表单数据
      tableArray: [] //缓存选中数据
    };
  },
  computed: {
    ...mapGetters(["roles"]),
  },
  methods: {
    /**
     * 全选按钮触发事件
     */
    customSelectAllFn: function(selection) {
      const _this = this;
      if (selection.length > 0) {
        _this.reqRoleCardList = selection.map((item) => {
          return item.id
        });
        _this.reqRoleCardList = _this.unlink(_this.reqRoleCardList); // 数组去重
      } else {
        _this.reqRoleCardList = []//全部未选中时赋值为空数组，上送后台才不会报错
      }
    },
    /**
     * 选中或取消数据时缓存数据，解决授权卡片不能增量添加问题
     */
    customSelectionFn: function(selection, row) {
      const _this = this;
      if(selection.includes(row)) { //选中状态
        //判断是否在缓存数组中存在,存在不添加，不存在则添加进缓存数组
        if (!_this.reqRoleCardList.includes(row.id)) { //不存在
          _this.reqRoleCardList.push(row.id);
        }
      } else { //取消状态
        //判断是否存在缓存数组中，存在-删除缓存中数据，不存在则不做任何操作
        if (_this.reqRoleCardList.includes(row.id)) { //存在
          _this.reqRoleCardList.splice(_this.reqRoleCardList.indexOf(row.id), 1);
        }
      }
      if(_this.reqRoleCardList.length > 0) {
        _this.reqRoleCardList = _this.unlink(_this.reqRoleCardList); // 数组去重
      } else {
        _this.reqRoleCardList = []
      }
      
    },
    /**
     * 清空所属机构查询条件
     * @param immidately 是否立即执行查询，区分快速查询和精确查询
     */
    formResetFn: function () {
      const _this = this;
      _this.reqRoleCardList = [];
      _this.reqRoleCardList = _this.tableArray;
      _this.$refs.searchForm.resetFields();
      _this.$refs.cardsTable.remoteData(_this.searchFormdata);
    },
    /**
     * 保存授权
     */
    saveFn: function () {
      var _this = this;
      // const selections = _this.$refs.cardsTable.selections || [];
      const cardIds = _this.reqRoleCardList;
      // if (!cardIds.length) {
      //   _this.$message({
      //     message: _this.$t("roleDataPowerManager.sjwgg"),
      //     type: "warning",
      //   });
      //   return;
      // }
      _this.saveDisabled.show = true;
      _this.saveDisabled = clone(_this.saveDisabled, {});
      _this.$request({
        method: "POST",
        url: backend.portalService + "/api/xmhcardrole/saverolecard",
        data: {
          cardIds,
          roleId: _this.chooseRoleId,
        },
      }).then(({ code, message, data }) => {
        _this.saveDisabled.show = false;
        _this.saveDisabled = clone(_this.saveDisabled, {});
        if (code === "0") {
          _this.$message({ type: "success", message: _this.$t("card.bccg") });
          _this.queryRoleCard()
        } else {
          _this.$message({ message: message, type: "error" });
        }
      });
    },
    /**
     * 数组去重
     * @params ary 目标数组
     */
    unlink: function(arr) {
      if(arr.length <= 0) return;
      for (var i = 0; i < arr.length; i++) { //首次遍历数组
        for (var j = i + 1; j < arr.length; j++) { //再次便利数组
          if (arr[i] == arr[j]) { // 判断两个值是否相等
            arr.splice(j, 1); //相等删除后者
            j--;
          }
        }
      }
      return arr;
    },
    /**
     * 搜索粘贴授权表格
     */
    tableSearchFn: function () {
      this.$refs.cardsTable.remoteData({ keyWord: this.tableKeyword });
    },
    loaded(data) {
      this.dataTable = data;
      this.toggleRowSelection();
    },
    toggleRowSelection() {
      const _this = this;
      // const reqRoleCards = this.reqRoleCardList.map((item) => {
      //   return item.cardId;
      // });
      _this.dataTable.forEach((item) => {
        if (_this.reqRoleCardList.includes(item.id)) {
          _this.$refs.cardsTable.toggleRowSelection(item, true);
        }
      });
    },
    /**
     * 用户/角色id选择项发生变化时改变结构树
     * @param param1-当前用户/角色id
     * @param param2-当前页签是否是角色授权
     * @param param3-当前被激活的页签
     */
    getAuthObjId(param1, param2, param3) {
      this.chooseRoleId = param1;
      this.isRoleTab = param2;
      this.activeName = param3;
      this.expectedRoleId = this.chooseRoleId;
      this.expectedUserId = "";
      this.showTree = true;
      this.$nextTick(function () {
        this.queryRoleCard();
      });
    },
    queryRoleCard() {
      const _this = this;
      const roleId = _this.expectedRoleId;
      findRolePrivCard({ roleId }).then((res) => {
        if (res.code === "0") {
          _this.reqRoleCardList = res.data.map((item) => {
            return item.cardId
          });
          _this.tableArray = res.data.map((item) => { //用于重置时反填历史缓存数据
            return item.cardId
          });
          _this.$refs.cardsTable.remoteData();
        }
      });
    },
  },
};
</script>
<style>
.yu-frame-tab-box > div > div.authorize-manage {
  -webkit-box-shadow: none;
  box-shadow: none;
  background: #f2f2f2;
}

.tree-box {
  background: #ffffff !important;
  float: right;
  width: calc(100% - 424px);
  min-height: calc(100vh - 156px);
  position: relative;
}

.compact .tree-box {
  width: calc(100% - 416px);
  min-height: calc(100vh - 115px);
}

/* 右侧css */

.handle-btn {
  float: right;
}

.handle-btn .search-input {
  width: 200px;
  margin-left: 12px;
}

.handle-btn .el-input__suffix-inner {
  line-height: 36px;
}
.compact .handle-btn .el-input__suffix-inner {
  line-height: 36px;
}

.authorize-manage .el-button--primary:focus,
.el-button--primary:hover {
  color: #ffffff !important;
}

.tree-box .tree-header {
  height: 56px;
  border-bottom: 1px solid #ededed;
  line-height: 56px;
  padding: 0 24px 0 60px;
}

.tree-header .el-checkbox__label {
  padding-left: 8px;
  vertical-align: middle;
}

.authorize-manage .tree-content {
  padding: 24px;
  height: calc(100% - 102px);
}

.tree-content .el-tree-x {
  border: none;
  height: 100%;
}

.custom-tree-label span {
  vertical-align: middle;
}

.tree-content .el-tree-node__content > .el-tree-node__expand-icon {
  padding: 0 12px;
}

.authorize-manage .el-tree-node__content > .el-checkbox {
  margin-right: 12px;
  vertical-align: middle;
}

.auth-btn {
  color: #2877ff;
  cursor: pointer;
  display: none;
}

.auth-btn:hover {
  text-decoration: underline;
}

.authorize-manage .el-tree-node__content:hover .auth-btn {
  display: inline-block;
}
</style>
