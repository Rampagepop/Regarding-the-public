<template>
  <div>
    <yu-tree style="overflow: scroll" class="shuffle-class-leaf-node-select" ref="leftTree" :data="treeData" :props="treeProps" :node-key="id" :data-pid="pid" @node-click="nodeClick" :render-content="renderContent" :remove-empty="true" :filter-node-method="filterNode"></yu-tree>
  </div>
</template>

<script>
export default {
  props: {
    value: Array,
    // 能选中节点的type，如[rule]
    enableCheckedNodesTypes: {
      type: Array,
      default: function () {
        return ['ruleSet', 'rule']
      }
    },
  },
  data: function () {
    return {
      treeData: [],
      treeProps: {
        label: 'text',
        children: 'children'
      }
    }
  },
  mounted: function () {
    this.loadData();
  },
  methods: { // 树节点过滤
    filterNode: function (opt, data, node) {
      return opt.filter ? opt.filter(data) : data[opt.field].indexOf(opt.value) !== -1
    },
    onCheckChange: function () {
      this.$emit('input', this.$refs.leftTree.getCheckedNodes(true));
    },
    nodeClick: function (a, b, c) {
      this.$emit("node-click", a);
    },
    pidName: function (pNodeId) {
      var pNode = this.$refs.leftTree.getNode(pNodeId);
      console.log('baskjdguasgd', pNode)
      return pNode;
    },
    loadData: function () {
      // 清空搜索
      var _this = this;
      _this.inputVal = '';
      yufp.service.request({
        method: 'GET',
        url: '/shuffle-web/api/shuffle/modelTree/current',
        callback: function (code, message, response) {
          if (response.code == 0) {
            _this.treeData = response.data;
            console.log(_this.treeData)
            console.log(_this.$refs)
            // 树节点过滤
            _this.$refs.leftTree.filter({
              filter: function (data) {
                return data.type != "rule"
              }
            });
          } else {
            _this.$message({message: "请求数据失败，请检查规则引擎服务是否启用！", type: "warning"})
          }
        }
      });
    },
    renderContent: function (h, obj) {
      var data = this.getNodeIconAndText(obj.data);
      var node = obj.node;
      var clazz = 'tree-node-icon';
      return h('span', {
        class: clazz
      }, [
        h('span', {
          class: node.level === 1 ? '' : data.icon,
          style: node.level === 1 ? {} : {
            'font-size': '12px',
            'margin-right': '5px',
            'color': '#949494'
          }
        }), data.text
      ]);
    },
    getNodeIconAndText: function (data) {
      var type = data.type;
      if (type == 'ruleLib') {
        return {
          icon: 'el-icon-shuffle-rule-base',
          text: data.name,
          title: data.sysId
        };
      } else if (type == 'ruleSets') {
        return {
          icon: 'el-icon-shuffle-rule-map',
          text: "规则集"
        };
      } else if (type == 'decisionFlows') {
        return {
          icon: 'el-icon-shuffle-decision-flow-type',
          text: "决策流"
        };
      } else if (type == 'ruleSetFolder') {
        return {
          icon: 'el-icon-shuffle-file',
          text: data.name
        };
      } else if (type == 'ruleSet') {
        return {
          icon: 'el-icon-shuffle-rule-def',
          text: data.name,
          title: data.ruleSetId
        };
      } else if (type == 'rule') {
        var ruleType = data.ruleType;
        if (ruleType == 'ruletree') {
          return {
            icon: 'el-icon-shuffle-decision-tree',
            text: data.name,
            title: data.ruleId
          };
        } else if (ruleType == 'ruletable') {
          return {
            icon: 'el-icon-shuffle-score-card',
            text: data.name,
            title: data.ruleId
          };
        } else if (ruleType == 'gradeScoreCard') {
          return {
            icon: 'CGB-Grade-icon-grade-score-card',
            text: data.name,
            title: data.ruleId
          };
        } else if (ruleType == 'adjusttable') {
          return {
            icon: 'CGB-Grade-icon-rule-limit-table',
            text: data.name,
            title: data.ruleId
          };
        } else if (ruleType == 'ruleflow') {
          return {
            icon: 'el-icon-shuffle-rule-flow',
            text: data.name,
            title: data.ruleId
          };
        } else if (ruleType == 'rulefree') {
          return {
            icon: 'el-icon-shuffle-freerule',
            text: data.name,
            title: data.ruleId
          };
        } else if (ruleType == 'rulesheet') {
          return {
            icon: 'el-icon-shuffle-decision-table',
            text: data.name,
            title: data.ruleId
          };
        } else if (ruleType == 'checkSheet') {
          return {
            icon: 'el-icon-shuffle-judge-decision-table',
            text: data.name,
            title: data.ruleId
          };
        } else if (ruleType == 'assignSheet') {
          return {
            icon: 'el-icon-shuffle-assign-decision-table',
            text: data.name,
            title: data.ruleId
          };
        } else if (ruleType == 'ruleFormula') {
          return {
            icon: 'el-icon-shuffle-ruleFormula',
            text: data.name,
            title: data.ruleId
          };
        }
      } else if (type == 'flowFolder' || type == 'pythonModelFolder' || type == 'rserveModelFolder') {
        return {
          icon: 'el-icon-shuffle-file',
          text: data.name
        };
      } else if (type == 'flow') {
        return {
          icon: 'el-icon-shuffle-decision-flow',
          text: data.name,
          title: data.flowId
        };
      } else if (type == 'pmmlModel') {
        return {
          icon: 'yu-icon-stack',
          text: "pmml模型",
          title: "pmmlModel"
        };
      } else if (type == 'pythonModel') {
        return {
          icon: 'yu-icon-setting1',
          text: "python模型",
          title: "pythonModel"
        };
      } else if (type == 'rserveModel') {
        return {
          icon: 'yu-icon-clculator',
          text: "R模型",
          title: "rserveModel"
        };
      } else if (type == 'pmmlModelFolder') {
        return {
          icon: 'el-icon-shuffle-file',
          text: data.name
        };
      } else if (type == 'neo4jModel') {
        return {
          icon: 'yu-icon-measure',
          text: "图谱规则"
        };
      }
      return {
        icon: 'el-icon-shuffle-list',
        text: data.name
      };
    },
    clearChecked: function () {
      // 取消勾选
      this.treeData.forEach(function (libData) {
        // setChecked(key/data, checked, deep) 接收三个参数，
        // 1. 勾选节点的 key 或者 data 2. boolean 类型，节点是否选中 3. boolean 类型，是否设置子节点 ，默认为 false
        this.$refs.leftTree.setChecked({
          id: libData.id
        }, false, true);
      }.bind(this))
    }
  }
}
</script>

<style>
</style>
