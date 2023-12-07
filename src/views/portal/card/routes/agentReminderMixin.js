import cardWrap from "@/views/portal/card/components/card-wrap";
import YuAgentReminderEdit from "@/views/portal/card/routes/agentReminder-edit.vue";
import emptyMsg from "@/components/layout/emptyMsg/index.vue";
export default {
  components: {
    cardWrap,
    YuAgentReminderEdit,
    emptyMsg
  },
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t("card.agentReminder");
      },
    },
    dataId: {
      type: Number,
      require,
    },
  },
  data() {
    return {
      listData: [],
      treeData: [],
      dataMap: {},
      dialogVisible: false, // 是否显示快捷入口编辑窗口,
      max: 5,
    };
  },
  mounted() {
    this.dataId && this.getTaskTypeList();
  },
  methods: {
    getTaskTypeList() {
      this.$request({
        url: `${backend.portalService}/api/xmhtasktypelog/list/${this.type}`,
      }).then((res) => {
        if (res && res.code === "0") {
          const list = [];
          res.data.forEach((item) => {
            if (item.pId) {
              item.pText = this.getTaskTypeText(item.pId, res.data);
              list.push({
                id: item.id,
                label: `${item.label}`,
                icon: item.icon,
              });
            }
          });
          this.treeData = list;
          this.getReminderList();
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
    getReminderList() {
      this.$request({
        url: `${backend.portalService}/api/xmhprocess/biztotal`,
      }).then((res) => {
        if (res && res.code === "0") {
          let sum = 0;
          const dataMap = res.data.reduce((o, item) => {
            o[item.bizType] = item.num;
            sum += item.num
            return o
          }, {})
          this.$set(this, "dataMap", dataMap);
          const dealData = this.treeData.filter(item => dataMap[item.label] != null).slice(0, this.max + 1)
            .map(item => {
              if (dataMap[item.label] != null) {
                // sum为最终其他类别中的数量
                sum -= dataMap[item.label];
              }
              return {
                bizType: item.label,
                num: dataMap[item.label],
                icon: item.icon
              }
            })
          // max个以上归为其他
          if (sum > 0) {
            dealData.splice(this.max, 1, {
              bizType: this.$t('card.agentReminder.other'),
              num: sum + dealData[this.max].num,
              icon: 'yu-icon-task'
            })
          }
          this.listData.splice(0, this.listData.length, ...dealData)
        }
      });
    },
    toProgressCenter(activeMode, mode, item) {
      const tarRoute = this.$router.match("/portal/card/processCenter/processCenter");
      if (tarRoute) {
        this.$router.push({
          path: tarRoute.path,
          query: Object.assign({activeMode: activeMode, mode: mode}, item ? {type: item.bizType} : {})
        })
      } else {
        this.$message.warning(this.$t('card.complTrans.noAccessOfPrcCenter'))
      }
    },
    btnEditReminderFn() {
      this.dialogVisible = true;
    },
    // 关闭编辑窗口时，重新拉取数据
    quickEntranceEditSaveFn() {
      this.getTaskTypeList();
    },
  },
};
