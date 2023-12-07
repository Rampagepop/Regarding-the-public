<template>
  <div>
    <!-- 快捷入口设置弹窗 -->
    <yu-xdialog
      :title="$t('card.quickEntranceEditTitle')"
      :visible.sync="dialogVisible"
      width="712px"
      @open="openDialogFn"
      @close="closeDialogFn"
    >
      <div class="selected-grid">
        <div class="selected-grid-title">
          {{ $t('card.quickEntry.gztkpxs') }}
          <span class="selected-grid-title-notice">
            <img src="@/assets/common/images/dragable/info.svg" alt="">
            {{ $t('card.quickEntry.tip1') }}
          </span>
        </div>
        <div class="selected-grid-btn">
          <yu-button size="small" @click="clearSelect">{{ $t('card.quickEntry.clear') }}</yu-button>
        </div>
      </div>
      <div class="ul-selected">
        <div class="no-data" v-if="listSelected.length === 0">
          <div><svg-icon class="no-data-icon" icon-class="calendar-no-data" /></div>
          <div class="no-data-text">{{ $t('card.quickEntry.tip2') }}</div>
        </div>
        <div v-if="listSelected.length !== 0">
          <draggable element="div" v-model="listSelected" :options="dragOptions" :move="onMove">
            <transition-group type="transition" tag="div" class="yu-grid">
              <div class="yu-grid-item" v-for="item of listSelected" :key="item.id">
                <div class="yu-grid-item-icon">
                  <img :src="item.iconSrc" alt="" />
                </div>
                <div class="yu-grid-item-text">{{ item.qeName }}</div>
                <div class="yu-grid-item-handdle">
                  <span class="iconBox" @click="unSelectedFn(item)"><svg-icon icon-class="jian" /></span>
                </div>
              </div>
            </transition-group>
          </draggable>
        </div>
      </div>
      <div class="selected-grid">
        <div class="selected-grid-title">
          {{ $t('card.quickEntry.qbkjrk') }}
          <span class="selected-grid-title-notice">
            <img src="@/assets/common/images/dragable/info.svg" alt="">
            {{ $t('card.quickEntry.tip3') }}
          </span>
        </div>
        <div class="selected-grid-btn">
          <yu-button size="small" @click="addFn">{{ $t('card.quickEntry.add') }}</yu-button>
        </div>
      </div>
      <div class="yu-grid ul-all">
        <div class="yu-grid-item" v-for="item of listAll" :key="item.id">
          <div class="yu-grid-item-icon">
            <img :src="item.iconSrc" alt="" />
          </div>
          <div class="yu-grid-item-text">{{ item.qeName }}</div>
          <div class="yu-grid-item-handdle">
            <span class="iconBox" @click="selectedFn(item)"><svg-icon icon-class="jia" /></span>
            <span class="iconBox" v-if="item.qeDefault === 0" @click="editIcon(item)"><svg-icon icon-class="edit2" /></span>
            <span class="iconBox" v-if="item.qeDefault === 0" @click="delIcon(item)"><svg-icon icon-class="delete2" /></span>
          </div>
          <div class="yu-grid-item-fixedText" v-if="item.qeDefault === 1">{{ $t('card.quickEntry.builtin') }}</div>
        </div>
        <div class="yu-grid-item icon-plus">
          <div class="yu-grid-item-icon" @click="addFn">
            <img src="@/assets/common/images/dragable/icon-plus5.svg" alt="" />
          </div>
        </div>
      </div>
      <div slot="footer" class="yu-grpButton">
        <yu-button v-norepeat.disabled type="primary" @click="saveEditQuickEntrance">{{ $t('card.quickEntry.save') }}</yu-button>
        <yu-button @click="closeDialogFn">{{ $t('card.quickEntry.qx') }}</yu-button>
      </div>
    </yu-xdialog>
    <!-- 快捷入口新增、编辑弹窗 -->
    <yu-xdialog :title="viewTitle" :visible.sync="addOrEditVisible" width="480px" @close="dialogClose">
      <yu-xform ref="entranceForm" v-model="entranceForm" :rules="formRules" label-width="120px">
        <yu-xform-item :label="$t('card.quickEntry.kjrkmc')" name="qeName" :placeholder="$t('dutyManager.qsr')"></yu-xform-item>
        <yu-xform-item :label="$t('card.quickEntry.address')" name="qeAddress" :placeholder="$t('dutyManager.qsr')"></yu-xform-item>
        <yu-xform-item :label="$t('card.quickEntry.tb')" name="qeIcon" ctype="custom">
          <div>{{ $t('card.quickEntry.tip4') }}</div>
          <div class="custom-box">
            <div class="custom-box-left">
              <div class="custom-icon">
                <div class="custom-icon-text" v-if="!uploadIcon">{{ $t('card.quickEntry.zdy') }}</div>
                <img :src="uploadIcon" alt="" v-if="uploadIcon">
              </div>
              <yu-upload
                :action="uploadAction"
                :show-file-list="false"
                :headers="uploadHeader"
                :on-success="handleAvatarSuccess">
                <yu-button size="small">{{ $t('card.quickEntry.select') }}</yu-button>
              </yu-upload>
            </div>
            <div class="custom-box-right yu-grid">
              <div class="yu-grid-item" v-for="(item, index) in defaultList" :key="item.id" @click="checkIcon(item, index)">
                <div class="yu-grid-item-icon">
                  <img :src="item.iconSrc" alt="" />
                </div>
                <div class="yu-grid-item-check" v-if="item && item.checked">
                  <img src="@/assets/common/images/dragable/checked2.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </yu-xform-item>
      </yu-xform>
      <div slot="footer" class="yu-grpButton">
        <yu-button v-norepeat.disabled type="primary" @click="saveQuickEntrance">{{ $t('card.quickEntry.save') }}</yu-button>
        <yu-button @click="resetQuickEntrance">{{ $t('card.quickEntry.reset') }}</yu-button>
      </div>
    </yu-xdialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { getAccessToken } from "@/utils/oauth";
import { getUploadFileUrl } from "@/utils/util";
import { clone } from "@/utils";
/**
 * @description 快捷入口卡片编辑
 */
export default {
  name: "YuQuickEntranceEdit",
  components: {
    draggable
  },
  props: {
    visibled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      listSelected: [],
      listAll: [],
      defaultList: [],
      dialogVisible: this.visibled,
      viewTitle: this.$t('card.quickEntry.xzkjrk'),
      viewType: 'ADD',
      addOrEditVisible: false,
      entranceForm: {},
      entranceEditForm: {},
      formRules: {
        qeName: [{ required: true, message: this.$t('card.quickEntry.btx') }],
        qeAddress: [{ required: true, message: this.$t('card.quickEntry.btx') }],
        qeIcon: [{ required: true, message: this.$t('card.quickEntry.btx') }]
      },
      uploadAction: yufp.util.addTokenInfo(
        backend.fileService + "/api/file/provider/uploadfile"
      ),
      uploadHeader: { Authorization: "Bearer " + getAccessToken() },
      uploadIcon: '',
      uploadIconId: ''
    };
  },
  computed: {
    // 拖拽项
    dragOptions () {
      return {
        group: {
          name: "yu-grid-item",
          pull: false,
          put: false
        }
      };
    },
  },
  watch: {
    visibled(val) {
      this.dialogVisible = val;
    },
  },
  methods: {
    /**
     * 移动时触发
     * @param evt 事件句柄
     */
    onMove (evt) {
      // 拖动的元素
      /* const draggedContext = evt.draggedContext;

      let index = draggedContext.index;
      const futureIndex = draggedContext.futureIndex;
      let element = draggedContext.element;
      console.info("拖动的元素原先的序列号", index);
      console.info("拖动的元素当前的序列号", futureIndex);
      console.info(
        "拖动的元素当前的试图模型(初始化数组中的对象)", JSON.stringify(element)
      );
      console.info("====================");
      // 被交换的元素
      const relatedContext = evt.relatedContext;

      const list = relatedContext.list;
      index = relatedContext.index;
      element = relatedContext.element;
      const component = relatedContext.component;
      console.info("被拖动的元素原先的序列号", index);
      console.info("原始的初始化数据数组", JSON.stringify(list));
      console.info(
        "拖动的元素当前的试图模型(初始化数组中的对象)", JSON.stringify(element)
      );
      console.info("vue组件对象", component); */
    },
    // 过滤数据
    filterList() {
      // 对全量数据进行过滤
      if (
        this.listAll &&
        this.listAll.length > 0 &&
        this.listSelected &&
        this.listSelected.length > 0
      ) {
        for (let i = 0, l = this.listSelected.length; i < l; i++) {
          for (let j = 0, k = this.listAll.length; j < k; j++) {
            if (this.listSelected[i].id === this.listAll[j].id) {
              this.listAll.splice(j, i);
              break;
            }
          }
        }
      }
    },
    // 获取选中快捷入口
    getEntranceList() {
      this.$request({
        url: backend.portalService + '/api/xmhquickentrance/listeditup',
      }).then(({code, message, data}) => {
        if (code === "0") {
          this.listSelected = data;
          this.listSelected.map(i => {
            i.iconSrc = yufp.util.addTokenInfo(
              backend.fileService + "/api/file/provider/download?fileId=" + i.qeIcon
            )
          });
        }
      });
    },
    // 获取所有快捷入口数据
    getEntranceAllList() {
      this.$request({
        url: backend.portalService + '/api/xmhquickentrance/listeditdown',
      }).then(({code, message, data}) => {
        if (code === "0") {
          this.listAll = data;
          this.listAll.map(i => {
            i.checked = false;
            i.iconSrc = yufp.util.addTokenInfo(
              backend.fileService + "/api/file/provider/download?fileId=" + i.qeIcon
            )
          });
          this.defaultList = JSON.parse(JSON.stringify(this.listAll)).splice(0, 9);
        }
      });
    },
    // 将选中的快捷入口移除到非选中窗台
    unSelectedFn(item) {
      for (let i = 0, l = this.listSelected.length; i < l; i++) {
        if (this.listSelected[i].id === item.id) {
          this.listSelected.splice(i, 1);
          break;
        }
      }
    },
    // 将非选中的快捷入口移除到选中窗台
    selectedFn(item) {
      this.listSelected.forEach((i, idx) => {
        if(item.id === i.id) {
          this.listSelected.splice(idx, 1);
        }
      });
      if(this.listSelected.length === 8) {
        this.$message(this.$t('card.quickEntry.tip5'));
      } else {
        this.listSelected.push(item);
      }
    },
    // 清空已选卡片
    clearSelect() {
      this.listSelected = [];
    },
    // 删除所选图标
    delIcon(val) {
      var _this = this;
      _this.$confirm(_this.$t('card.quickEntry.sfjx'), _this.$t('card.quickEntry.ts'), {
        confirmButtonText: _this.$t('card.quickEntry.qd'),
        cancelButtonText: _this.$t('card.quickEntry.qx'),
        type: "warning",
        callback: function(action) {
          if (action === "confirm") {
            _this.$request({
              method: "POST",
              url: backend.portalService + '/api/xmhquickentrance/delete?id=' + val.id,
            }).then(({code, message, response}) => {
              if(code === '0') {
                _this.getEntranceAllList();
                _this.$message(_this.$t('card.quickEntry.sccg'));
                _this.addOrEditVisible = false;
              }
            });
          }
        }
      });
    },
    // 打开弹窗
    openDialogFn() {
      this.getEntranceList();
      this.getEntranceAllList();
    },
    // 关闭弹窗
    closeDialogFn() {
      this.$emit("close");
    },
    // 保存快捷入口
    saveEditQuickEntrance() {
      if(this.listSelected.length !== 0) {
        this.listSelected.forEach((item, index) => {
          item.serialNo = index + 1;
        })
      }
      this.$request({
        method: "POST",
        url: backend.portalService + '/api/xmhquickentrance/savequickentrance',
        data: this.listSelected
      }).then(({code, message, response}) => {
        if(code === '0') {
          this.$message(this.$t('card.quickEntry.czcg'));
          this.$emit("close");
        }
      });
    },
    // 新增快捷入口
    addFn() {
      this.addOrEditVisible = true;
      this.viewType = 'ADD';
      this.viewTitle = this.$t('card.quickEntry.xzkjrk');
      this.uploadIcon = '';
      this.uploadIconId = '';
      this.$nextTick(() => {
        this.$refs.entranceForm.resetFields();
      })
    },
    // 编辑图标
    editIcon(val) {
      this.addOrEditVisible = true;
      this.viewType = 'Edit';
      this.viewTitle = this.$t('card.quickEntry.bjkjrk');
      this.$nextTick(() => {
        clone(val, this.entranceForm);
      });
      this.uploadIcon = yufp.util.addTokenInfo(
        backend.fileService + "/api/file/provider/download?fileId=" + val.qeIcon
      );
    },
    // 新增/编辑保存
    saveQuickEntrance() {
      var _this = this;
      var formData = {};
      clone(_this.entranceForm, formData);
      var validate = false;
      if (_this.uploadIconId) {
        formData.qeIcon = _this.uploadIconId;
      }
      _this.$refs.entranceForm.validate((valid) => {
        validate = valid;
      });
      // formData.qeDefault = 1; // 暂时新增预置的
      if (!validate || !_this.uploadIconId) {
        return;
      } // 向后台发送保存请求
      var url = _this.viewType === 'ADD' ? '/api/xmhquickentrance/save' : '/api/xmhquickentrance/update';
      _this.$request({
        method: "POST",
        url: backend.portalService + url,
        data: formData
      }).then(({code, message, response}) => {
        if(code === '0') {
          _this.$message(this.$t('card.quickEntry.czcg'));
          _this.getEntranceAllList();
          _this.addOrEditVisible = false;
        }
      });
    },
    // 重置快捷入口
    resetQuickEntrance() {
      this.uploadIcon = '';
      this.uploadIconId = '';
      this.defaultList.forEach(i => {
        this.$set(i, 'checked', false);
      });
      this.$refs.entranceForm.resetFields();
    },
    /**
     * 上传图标成功
     */
    handleAvatarSuccess(res, file) {
      this.uploadIconId = res.data;
      this.entranceForm.qeIcon = res.data;
      this.uploadIcon = yufp.util.addTokenInfo(
        backend.fileService + "/api/file/provider/download?fileId=" + res.data
      );
    },
    // 选择图标
    checkIcon(val) {
      this.uploadIconId = val.qeIcon;
      this.defaultList.forEach((i, index) => {
        if(i.id === val.id) {
          i.checked = !i.checked
          this.$set(this.defaultList, index, i);
          if(i.checked) {
            this.entranceForm.qeIcon = val.qeIcon;
          } else {
            this.entranceForm.qeIcon = '';
          }
        } else {
          i.checked = false;
        }
      });
    },
    // 关闭新增/编辑弹窗
    dialogClose() {
      this.addOrEditVisible = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.selected-grid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #EDEDED;
  &-title {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #333333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &-notice {
      margin-left: 19px;
      font-weight: 400;
      color: #999999;
      vertical-align: middle;
      img {
        float: none;
        margin-right: 2px;
        vertical-align: middle;
      }
    }
  }
}
.ul-selected {
  min-height: 290px;
  .no-data {
    text-align: center;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #999999;
    padding-top: 16px;
    .no-data-icon {
      color: #cccccc;
      width: 110px;
      height: 125px;
    }
  }
}
.yu-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
  &-item {
    text-align: center;
    padding: 20px 0;
    margin: 0 5px 5px;
    width: 18%;
    position: relative;
    &.has-router {
      cursor: pointer;
    }
    &:hover {
      background-color: #F0F0F0;
      cursor: pointer;
      .yu-grid-item-handdle {
        visibility: visible;
      }
    }
    &-icon {
      img {
        float: none;
        width: 40px;
      }
    }
    &-text {
      color: #333333;
      margin-top: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-handdle {
      visibility: hidden;
      position: absolute;
      top: 4px;
      right: 4px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .iconBox {
        background: #FFFFFF;
        border-radius: 4px;
        padding: 1px;
        margin-bottom: 4px;
      }
      img {
        float: none;
      }
      .svg-icon:hover {
        color: #2877FF;
      }
    }
    &-fixedText {
      position: absolute;
      top: 4px;
      left: 4px;
      background: rgba(40, 119, 255, 0.2);
      border-radius: 9px;
      color: #2877FF;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      padding: 2px;
    }
  }
  .icon-plus {
    background-color: #F0F0F0;
    cursor: pointer;
    .yu-grid-item-icon {
      transform: translateY(10px);
    }
  }
}
.custom-box {
  display: flex;
  &-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 10px;
  }
  .custom-icon {
    display: flex;
    &-text {
      width: 60px;
      height: 60px;
      border: 1px solid #E0E0E0;
      border-radius: 4px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #C5C5C5;
      text-align: center;
      line-height: 60px;
    }
    img {
      width: 60px;
      height: 60px;
      float: none;
    }
  }
  &-right {
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    padding: 8px 8px 0;
    .yu-grid-item {
      margin: 0 0 8px;
      text-align: center;
      width: 20%;
      padding: 0;
      position: relative;
      line-height: 0;
    }
    .yu-grid-item-check {
      position: absolute;
      top: 4px;
      right: 6px;
      img {
        float: none;
      }
    }
  }
}
</style>
