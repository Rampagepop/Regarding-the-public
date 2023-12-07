<template>
  <yu-xdialog :title="title" :visible.sync="dialogVisible" width="700px" class="user-sele">
    <div class="user-sele-box" v-show="userSeleList.length>0">
      <yu-tag class="user-sele-item" :key="index" v-for="(tag, index) in userSeleList" type="success" :closable="true"
              :close-transition="false" @close="close(tag)">{{ tag.userName }}</yu-tag>
    </div>
    <yu-table ref="refTable" :data="userList" stripe style="width: 100%" selection-type="radio" @row-dblclick="handleRowClick" v-loading="loading">
      <yu-xtable-column label="序号" width="50px">
        <template slot-scope="scope">{{ (scope.$index+1)+((currentPage-1)*pageSize) }}</template>
      </yu-xtable-column>
      <yu-xtable-column label="用户ID" prop="userId"></yu-xtable-column>
      <yu-xtable-column label="姓名" prop="userName"></yu-xtable-column>
    </yu-table>
    <yu-pagination style="margin-bottom:10px" @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></yu-pagination>
    <div class="yu-grpButton">
      <yu-button @click="chooseFn">选取</yu-button>
    </div>
  </yu-xdialog>
</template>


<script>
export default {
  name: "CdpFlowUserSelect",
  props: {
    title: {
      type: String,
      default: "办理人员选择"
    }, // 弹框标题
    seleTypes: {
      type: String,
      default: ""
    }, // 审批人员选择类型
    dataUrl: {
      type: String,
      default: ""
    }, // 审批人员列表url
    methods: {
      type: String,
      default: "GET"
    },
    params: {
      type: Object,
      default: function() {
        return {};
      }
    } // 调用审批人员列表参数
  },
  data: function() {
    return {
      loading: false,
      types: "",
      total: 0, // 数据总数量
      currentPage: 1, // 默认当前表格为第一页
      pageSize: 10, // 当前页数
      dialogVisible: false, // 弹框dialog
      allList: [], // 所有人员列表
      userList: [],
      userSeleList: [] // 人员选择列表
    };
  },
  watch: {
    dataUrl: {
      immediate: true,
      handler: function(val) {
        if (val) {
          this.getList(val);
        }
      }
    }
  },
  methods: {
    // 父组件调用子组件弹框打开
    openDialog: function(type) {
      this.types = type;
      this.dialogVisible = true;
      this.userSeleList = [];
    },
    // 获取审批人员列表
    getList: function(dataUrl) {
      const _this = this;
      _this.loading = true;
      _this
        .$request({
          method: _this.methods,
          url: dataUrl,
          data: _this.params
        })
        .then(response => {
          _this.loading = false;
          if (response.code == 0) {
            _this.allList = yufp.extend([], response.data); // 将请求返回的用户赋值给书签列表
            _this.sizeChange(10); // 书签数据赋值成功后调用分页方法
          } else {
            _this.$message.error(response.message);
          }
        })
        .catch(response => {
          _this.$message.error(response.message);
        });
    },
    // 每页条数切换
    sizeChange: function(pageSize) {
      this.pageSize = pageSize; // 当前页数量为选择数量
      this.currentChange(this.currentPage); // 调用change事件
    },
    //页码切换
    currentChange: function(currentPage) {
      this.total = this.allList.length; // 设置总数为全部数量
      this.currentPage = currentPage; // 当前页为选择页
      this.currentChangePage(this.allList, currentPage); // 调用分页方法
    },
    //分页方法（重点）
    currentChangePage(list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      const to = currentPage * this.pageSize;
      this.userList = []; // 将当前表格数据清空
      for (; from < to; from++) {
        if (list[from]) {
          this.userList.push(list[from]); // 赋值跳转到对应页的数据
        }
      }
    },
    // 关闭tag
    close: function(val) {
      this.userSeleList.splice(this.userSeleList.indexOf(val), 1);
    },
    // 表格某行点击
    handleRowClick: function(rows) {
      let flag = false;
      // 当前点击行和已存在标签判断去重
      this.userSeleList.forEach(item => {
        if (item.userId == rows.userId) {
          flag = true;
        }
      });
      if (!flag) {
        this.userSeleList.push(rows);
      }
    },
    // 选取返回
    chooseFn: function() {
      this.$emit("choose", {
        list: this.userSeleList,
        types: this.types
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.user-sele {
  .user-sele-box {
    padding: 10px;
    margin-bottom: 10px;
    box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.1);
    .user-sele-item {
      margin-right: 6px;
    }
  }
  .yu-grpButton {
    margin: 20px;
    text-align: left;
  }
}
</style>
