<template>
  <div style="width: 0;height: 0">
    <yu-xdialog
      v-if="loaded"
      :visible.sync="dialogVisible"
      width="460px"
      class="reminder-edit"
      @close="closeDialogFn"
      @open="dialogOpen"
    >
      <div class="title" slot="title">
        <span class="con">{{ title }}</span>&ensp;
        <span class="tip yu-icon-warning1">&thinsp;{{ $t('card.agentReminder.tip') }}</span>
      </div>
      <yu-tree
        ref="treeDataRef"
        :data="treeData"
        default-expand-all
        draggable
        @node-drag-end="handleDragEnd"
        :allow-drop="allowDrop"
      >
      </yu-tree>
      <div slot="footer" class="dialog-footer">
        <yu-button type="primary" @click="btnSaveTaskListFn">
          {{ $t("card.agentReminder.qd") }}
        </yu-button>
        <yu-button @click="closeDialogFn">
          {{ $t("card.agentReminder.qx") }}
        </yu-button>
      </div>
    </yu-xdialog>
  </div>
</template>

<script>
export default {
  name: "YuAgentReminderEdit",
  props: {
    title: {
      type: String,
      default: function () {
        return this.$t('card.agentReminder.editTitle')
      },
    },
    visibled: {
      type: Boolean,
      default: false,
    },
    cardId: {
      type: Number,
      require,
    },
    dataMap: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loaded: false,
      treeData: [],
      dialogVisible: this.visibled,
    };
  },
  watch: {
    visibled(val) {
      if (val) {
        this.loaded = true;
      }
      this.dialogVisible = val;
    },
    dataMap: {
      handler: function (val, oldVal) {
        if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
          this.treeData.forEach(item => {
            item.label = `${item.label} ${this.dataMap[item.label] || "0"}`
          })
        }
      },
      deep: true
    }
  },
  created() {
    this.getTaskTypeList();
  },
  methods: {
    // 打开弹窗
    dialogOpen() {
      this.getTaskTypeList();
    },
    getTaskTypeList() {
      this.$request({
        url: `${backend.portalService}/api/xmhtasktypelog/list/${this.cardId}`,
      }).then((res) => {
        if (res && res.code === "0") {
          const list = [];
          res.data.forEach((item) => {
            if (item.pId) {
              item.pText = this.getTaskTypeText(item.pId, res.data);
              list.push({
                id: item.id,
                label: `${item.label} ${this.dataMap[item.label] || "0"}`,
                icon: item.icon,
                lId: item.lId ? item.lId : ''
              });
            }
          });
          this.treeData = list;
        }
      });
    },
    // 获取节点文本
    getTaskTypeText(id, data = []) {
      for (let i = 0, l = data.length; i < l; i++) {
        if (data[i].id === id) {
          return data[i].label;
        }
      }
    },
    // 获取节点在数组中位置
    getTreeNodeIndex(node) {
      for (let i = 0, l = this.treeData.length; i < l; i++) {
        if (this.treeData[i].id === node.id) {
          return i;
        }
      }
    },
    handleDragEnd: function (draggingNode, dropNode, dropType, _ev) {
      const tIdx = this.getTreeNodeIndex(dropNode.data);
      const sIdx = this.getTreeNodeIndex(draggingNode.data);
      // 调整数组顺序
      if (dropType === "after") {
        // draggingNode 调整到 dropNode 后面
        this.treeData.splice(tIdx + 1, 0, this.treeData.splice(sIdx, 1)[0]);
      }
      if (dropType === "before") {
        // draggingNode 调整到 dropNode 前面
        this.treeData.splice(tIdx - 1, 0, this.treeData.splice(sIdx, 1)[0]);
      }
    },
    allowDrop: function (_draggingNode, _dropNode, type) {
      return type !== "inner";
    },
    btnSaveTaskListFn() {
      const data = [];
      this.treeData.children.forEach((d, i) => {
        if (d.lId) {
          data.push({
            serialNo: i,
            id: d.id,
            lId: d.lId
          });
        } else {
          data.push({
            serialNo: i,
            id: d.id,
          });
        }
      });
      // 调用接口保存数据并返回
      this.$request({
        url: `${backend.portalService}/api/xmhtasktypelog/save`,
        method: "post",
        data: {
          cardId: this.cardId,
          vo: data
        },
      }).then((res) => {
        if (res.code === "0") {
          this.$message.success(this.$t("card.agentReminder.success"));
          this.closeDialogFn();
          this.$emit("save");
        }
      });
    },
    // 关闭弹窗
    closeDialogFn() {
      this.$emit("update:visibled", false)
    },
  },
};
</script>

<style lang="scss">
.reminder-edit {
  .title {
    display: inline-block;

    .con {
      font-size: 16px;
      font-weight: bold;
      color: #444444;
    }

    .tip {
      font-size: 14px;
      color: #999999;
    }
  }

  .el-tree {
    .el-tree-node__content {
      display: flex;
      align-items: center;
      color: #444;

      &:hover {
        background-color: rgba($color: #2877FF, $alpha: 0.12) !important;
        border-radius: 4px;
        color: #2877FF;
      }

      .el-tree-node__label {
        margin-left: 12px;
      }
    }
  }
}
</style>
