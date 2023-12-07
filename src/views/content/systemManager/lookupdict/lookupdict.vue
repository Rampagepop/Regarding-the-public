<!--
  @created by tuxw@yusys.com.cn on 2020-12-22
  @description 菜单配置
  @updated by
-->
<template>
  <div class="yu-dict-config clear">
    <div class="left-content frame-height-dict">
      <div class="content-title">
        <span>{{ $t('lookupdict.sjzdpz') }}</span>
        <!--          <yu-button v-if="checkCtrl('add')" @click="refreshCache">{{ $t('lookupdict.xzfl') }}</yu-button>-->
        <yu-button v-if="checkCtrl('refresh')" v-norepeat.disabled @click="refreshCache">{{ $t('lookupdict.hcsx') }}</yu-button>
      </div>
      <div class="content-box">
        <yu-toolBar>
          <div class="clear">
            <yu-input class="filter-text" v-model="filterText" :placeholder="$t('lookupdict.gjz')" size="small"
                      icon="search"></yu-input>
            <div class="handle-box">
              <yu-button v-if="checkCtrl('add')" plain icon="yu-icon-plus5" :title="$t('lookupdict.xz')"
                         @click="addLookup()"></yu-button>
              <yu-button v-if="checkCtrl('edit') && isManaging" v-norepeat.disabled plain icon="yu-icon-edit"
                         :title="$t('lookupdict.xg')" @click="modifyDict()"></yu-button>
              <yu-button v-if="checkCtrl('delete') && isManaging" v-norepeat.disabled plain icon="yu-icon-delete2"
                         :title="$t('lookupdict.sc')" @click="deleteDict(false)"></yu-button>
              <yu-button v-if="isManaging" v-norepeat.disabled plain icon="yu-icon-cancel" :title="$t('lookupdict.qx')"
                         @click="cancelManage"></yu-button>
              <yu-button v-if="checkCtrl('delete') && !isManaging" v-norepeat.disabled plain icon="yu-icon-setting3"
                         :title="$t('lookupdict.gl')" @click="manageMenu"></yu-button>
            </div>
          </div>
        </yu-toolBar>
        <yu-xtree ref="menuTree"
                  class="dict-tree"
                  :local-data="menuTreeData"
                  data-id="lookupCode"
                  data-pid="lookupName"
                  icon="menuIcon"
                  :props="dictTreeProps"
                  node-key="lookupItemId"
                  :current-node-key="currentCheckedNodeId"
                  :default-expanded-keys="expandedKeys"
                  :show-checkbox="isShowTreeCheckbox"
                  @node-click="dictTreeNodeClick"
                  :filter-node-method="filterMenuTreeNode"
                  :draggable="isTreeDraggable"></yu-xtree>
      </div>
    </div>
    <div class="right-content frame-height-dict">
      <div v-if="!buttonShow" class="no-data" :style="{'height': menuTreeHeight + 'px'}">
        <div class="no-choose">
          <img src="@/assets/common/images/no-data.svg" />
          <p class="text">{{ $t('lookupdict.noSelectText') }}</p>
        </div>
      </div>
      <div v-if="buttonShow">
        <div class="content-title">
          <span>{{ rightContentTitle }}</span>
          <yu-button v-if="buttonShow" size="mini" @click="deleteLookup()" v-norepeat.disabled>{{
            $t('dataFilter.sc')
          }}
          </yu-button>
          <yu-button v-if="buttonShow" size="mini" @click="modifyLookup()">{{ $t('dataFilter.xz') }}</yu-button>
        </div>
        <div class="content-box">
          <!--字典搜索 -->
          <yu-xform v-model="searchFormData" related-table-name="lookupTable" ref="searchForm">
            <yu-xform-group>
              <yu-xform-item :label="$t('lookupdict.gjz')" :placeholder="$t('lookupdict.qsr')" ctype="input"
                             name="keyword"></yu-xform-item>
              <div slot="custom" class="search-btn-group">
                <yu-button type="primary" @click="searchFn" style="margin-left: 10px;">{{ $t('wfbutton.find') }}</yu-button>
                <yu-button @click="resetFn">{{ $t('wfbutton.reset') }}</yu-button>
              </div>
            </yu-xform-group>
          </yu-xform>
          <!--字典详情表格-->
          <yu-xtable ref="lookupTable" class="lookup-table" selection-type="checkbox" :data="dictFormData" row-number>
            <yu-xtable-column :label="$t('lookupdict.zdmc')" prop="lookupItemName"></yu-xtable-column>
            <yu-xtable-column :label="$t('lookupdict.zddm')" prop="lookupItemCode"></yu-xtable-column>
            <yu-xtable-column :label="$t('lookupdict.sjzddm')" prop="upLookupItemCode"></yu-xtable-column>
            <yu-xtable-column class="handle-box" :label="$t('lookupdict.cz')" width="160px">
              <template slot-scope="scope">
                <yu-button-drop set-index="0" :show-length="2" type="text">
                  <yu-button @click="openEditLookupItemsDialog(scope.row)" type="text" v-if="checkCtrl('addItem')">
                    {{ $t('lookupdict.bjzdx') }}
                  </yu-button>
                  <yu-button @click="deleteLookup(scope.row)" type="text" v-if="checkCtrl('delete')" v-norepeat.disabled>
                    {{ $t('lookupdict.sc') }}
                  </yu-button>
                </yu-button-drop>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </div>
      </div>
    </div>
    <!--新增数据字典类别    -->
    <yu-xdialog :center="true" :title="viewType === 'ADD' ? $t('lookupdict.xz') : $t('lookupdict.xg')"
                :visible.sync="isShowEditLookupDictDialog" class="edit-lookup-dict-dialog" ref="editLookupDictDialog"
                size="small">
      <yu-xform :rules="editLookupFormRules" label-width="160px" ref="editLookupDictForm" v-model="editLookupFormData">
        <yu-xform-group :column="1">
          <yu-xform-item :label="$t('lookupdict.zdmc')" :disabled="viewType === 'INSERT'" :placeholder="$t('lookupdict.lrxb')"
                         name="lookupName"></yu-xform-item>
        </yu-xform-group>
        <yu-xform-group :column="2">
          <yu-xform-item :disabled="viewType === 'UPDATE' ||viewType === 'INSERT'" :label="$t('lookupdict.zddm')"
                         :placeholder="$t('lookupdict.lrsexType')"
                         name="lookupCode"></yu-xform-item>
          <yu-xform-item :label="$t('lookupdict.zdfl')" :disabled="viewType === 'INSERT'" :options="lookupTypeOptions"
                         :placeholder="$t('lookupdict.qxz ')" :props="{key: 'lookupItemId', value: 'lookupItemName'}"
                         @change="lookupTypeIdChange" ctype="select"
                         name="lookupTypeId"></yu-xform-item>
        </yu-xform-group>
        <yu-xform-group :column="2">
          <yu-xform-item name="refreshType" :label="$t('lookupdict.sxfs')" ctype="radio" :options="refreshTypeOptions" @change="changeRefreshTyp"></yu-xform-item>
          <yu-xform-item name="refreshTime" ref="refreshTimeItem" :label="$t('lookupdict.sxsj')" v-show="refreshTypeHidden" ctype="datepicker"
                         type="datetime" value-format="yyyy-MM-dd HH:mm:ss" class="refreshTimeItem"></yu-xform-item>
          <yu-xform-item name="cronExpression" :label="$t('lookupdict.bds')" v-show="!refreshTypeHidden"
                         suffix-icon="el-icon-setting" @suffix-click="cronPopover=true" :placeholder="$t('lookupdict.qsr')"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" class="yu-grpButton">
        <yu-button type="primary" v-norepeat.disabled @click="saveLookupDict">{{ $t('lookupdict.bc') }}</yu-button>
        <yu-button @click="closeEditLookupDialog">{{ $t('lookupdict.qx') }}</yu-button>
      </div>
    </yu-xdialog>
    <!-- cron 表达式选择弹出框 -->
    <yu-xdialog :title="$t('lookupdict.bdsbt')" :visible.sync="cronPopover">
      <YuCron @change="changeCron" @close="cronPopover=false" i18n="cn"></YuCron>
    </yu-xdialog>
    <!-- 编辑(新增/修改)数据字典 -->
    <yu-xdialog :center="true" :title="$t('lookupdict.xz')"
                :visible.sync="isShowEditLookupDialog" class="edit-lookup-dialog" ref="editLookupDialog" size="small">
      <yu-xform :rules="editLookupFormRules" label-width="160px" ref="editLookupForm" v-model="editLookupFormData">
        <yu-xform-group :column="1">
          <yu-xform-item :label="$t('lookupdict.zdmc')" :disabled="viewType === 'INSERT'" :placeholder="$t('lookupdict.lrxb')"
                         name="lookupName"></yu-xform-item>
        </yu-xform-group>
        <yu-xform-group :column="2">
          <yu-xform-item :disabled="viewType === 'UPDATE' ||viewType === 'INSERT'" :label="$t('lookupdict.zddm')"
                         :placeholder="$t('lookupdict.lrsexType')"
                         name="lookupCode"></yu-xform-item>
          <yu-xform-item :label="$t('lookupdict.zdfl')" :disabled="viewType === 'INSERT'" :options="lookupTypeOptions"
                         :placeholder="$t('lookupdict.qxz ')" :props="{key: 'lookupItemId', value: 'lookupItemName'}"
                         @change="lookupTypeIdChange" ctype="select"
                         name="lookupTypeId"></yu-xform-item>
          <yu-xform-item name="pid" :label="$t('lookupdict.sjzdmc')" ctype="yu-combo-tree"
                         :disabled="viewType === 'ADD'||viewType === 'UPDATE'" ref="tree"
                         :local-data="dictTreeData" :select-value="selectValue"
                         data-label="value" data-id="id" data-pid="pid" :clearable="true" :all-node-value="true"
                         @clear="clearUpOrgFn" @node-click="changeUpOrgFn">
          </yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <yu-tool-bar>
        <yu-button @click="pushLookupItem">{{ $t('lookupdict.tjzdx') }}</yu-button>
      </yu-tool-bar>
      <yu-xtable ref="editLookupItemTable" row-number :data="currentLookupItems" :pageable="false" :rules="lookupItemRule">
        <yu-xtable-column prop="lookupItemCode" ctype="input" label="key" :placeholder="$t('lookupdict.qsr')"></yu-xtable-column>
        <yu-xtable-column prop="lookupItemName" ctype="input" label="value"
                          :placeholder="$t('lookupdict.qsr')"></yu-xtable-column>
        <yu-xtable-column class="handle-box" :label="$t('lookupdict.cz')" width="180px">
          <template slot-scope="scope">
            <yu-button type="text" @click="deleteLookupItem(scope)" :disabled="currentLookupItems.length === 1">
              {{ $t('lookupdict.sc') }}
            </yu-button>
            <yu-button type="text" v-if="scope.$index != 0" @click="moveUp(scope.$index)">{{ $t('lookupdict.sy') }}</yu-button>
            <yu-button type="text" v-if="scope.$index < currentLookupItems.length - 1" @click="moveDown(scope.$index)">
              {{ $t('lookupdict.xy') }}
            </yu-button>
          </template>
        </yu-xtable-column>
      </yu-xtable>
      <div slot="footer" class="yu-grpButton">
        <yu-button type="primary" v-norepeat.disabled @click="saveLookup">{{ $t('lookupdict.bc') }}</yu-button>
        <yu-button @click="closeEditLookupDialog">{{ $t('lookupdict.qx') }}</yu-button>
      </div>
    </yu-xdialog>
    <!--     编辑/新增字典项-->
    <yu-xdialog :center="true"
                :title="$t('lookupdict.bjzdx') + '（' + editLookupFormData.lookupName + '/' + editLookupFormData.lookupCode +'）'"
                :visible.sync="isShowEditLookupItemsDialog" class="edit-lookup-items-dialog" ref="editLookupItemsDialog"
                size="small">
      <!--      <yu-tool-bar>-->
      <!--        <yu-button @click="pushLookupItem">{{ $t('lookupdict.tjzdx') }}</yu-button>-->
      <!--      </yu-tool-bar>-->
      <yu-xtable :data="currentLookupItems" :pageable="false" :rules="lookupItemRule" ref="editLookupItemTable"
                 row-number>
        <yu-xtable-column :placeholder="$t('lookupdict.qsr')" ctype="input" label="key"
                          prop="lookupItemCode"></yu-xtable-column>
        <yu-xtable-column :placeholder="$t('lookupdict.qsr')" ctype="input" label="value"
                          prop="lookupItemName"></yu-xtable-column>
        <yu-xtable-column class="handle-box" :label="$t('lookupdict.cz')" width="180px" v-if="currentLookupItems.length !== 1">
          <template slot-scope="scope">
            <yu-button :disabled="currentLookupItems.length === 1" @click="deleteLookupItem(scope)" type="text">
              {{ $t('lookupdict.sc') }}
            </yu-button>
            <yu-button @click="moveUp(scope.$index)" type="text" v-if="scope.$index != 0">{{ $t('lookupdict.sy') }}
            </yu-button>
            <yu-button type="text" v-if="scope.$index < currentLookupItems.length - 1" @click="moveDown(scope.$index)">
              {{ $t('lookupdict.xy') }}
            </yu-button>
          </template>
        </yu-xtable-column>
      </yu-xtable>
      <div slot="footer" class="yu-grpButton">
        <yu-button type="primary" v-norepeat.disabled @click="addLookupItems">{{ $t('lookupdict.bc') }}</yu-button>
        <yu-button @click="closeEditLookupItemsDialog">{{ $t('lookupdict.qx') }}</yu-button>
      </div>
    </yu-xdialog>
  </div>
</template>

<script>
import {mapGetters} from "vuex"
import {clone, sessionStore} from '@/utils'
import {validator} from "@/utils/validate"
import {icons} from "@/config/constant/app.data.icon"
import YuCron from "@/components/widgets/YuCron";

var frameSize = sessionStore.get('VIEW-SIZE');
export default {
  name: 'LookupDict',
  components: {YuCron},
  data: function () {
    return {
      insertUrl: backend.appOcaService + '/api/adminsmlookupdict/insertdictbatch',
      addUrl: backend.appOcaService + '/api/adminsmlookupdict/save',
      // typetableUrl: backend.appOcaService + '/api/adminsmlookupdict/list', // 数据字典表格url
      createCheck: this.checkCtrl('add'), // 新增按钮控制 (this.checkCtrl检查是否有控制点权限，有权限返回false，无权限返回true)
      menuTreeHeight: frameSize.height - 138,
      isManaging: false, // 是否正在管理
      isShowTreeCheckbox: false, // 是否显示menuTree的复选框
      isShowEditLookupDialog: false,
      isShowEditLookupDictDialog: false,
      isShowEditLookupItemsDialog: false,
      editLookupFormData: {lookupItemsString: ''}, // 编辑(新增/修改)数据字典表单的数据
      // isTreeDraggable: this.checkCtrl('order'), // 弹窗树是否可以拖拽排序
      isTreeDraggable: false,
      rightContentTitle: this.$t('lookupdict.wxz'), // 右侧内容的title
      currentCheckedNodeId: '', // 当前选中的节点id
      expandedKeys: [], // 默认展开的节点
      icons: icons,
      isSelectMenuIcon: true,
      filterText: '',
      menuTreeData: [],
      dictTreeData: [],
      oldMenuTreeData: [],
      lookupTypeOptions: [],
      editLookupFormRules: {
        lookupCode: [
          {required: true, message: this.$t('lookupdict.btx')},
          {max: 50, message: this.$t('lookupdict.zdcdbcggywzf')}
        ],
        lookupName: [
          {required: true, message: this.$t('lookupdict.btx')},
          {max: 100, message: this.$t('lookupdict.zdcdbcggzwzf')}
        ],
        lookupTypeId: [
          {required: true, message: this.$t('lookupdict.btx')},
        ]
      },
      dictTreeProps: {
        children: 'adminSmLookupDictEntityList',
        label: 'label'
      },
      currentLookupItems: [{lookupItemCode: '', lookupItemName: ''}],
      lookupItemRule: {
        lookupItemCode: [
          {required: true, message: this.$t('lookupdict.btx')},
          {validator: this.codeKeyValid, trigger: 'blur'},
          {max: 100, message: this.$t('lookupdict.zdxzdcdts')}
        ],
        lookupItemName: [
          {required: true, message: this.$t('lookupdict.btx')},
          {max: 100, message: this.$t('lookupdict.zdxzdcdts')}
        ]
      },
      dictFormData: [],
      dictNodeData: {
        lookupName: '',
        lookupCode: '',
        lookupItemName: '',
        lookupItemCode: '',
        lookupType: '',
        lookupItemId: ''
      },
      oldDictFormData: {},
      viewType: 'UPDATE',
      menuFormType: 'details',
      directoryTreeData: [], // 菜单目录树数据
      selectValue: '', // 弹出框显示值
      detailsValue: '', // 搜索树详情字段
      isAddchild: false,
      buttonShow: false,
      searchFormData: {
        keyword: '',
        lookupCode: ''
      },
      cronPopover: false,
      refreshTypeOptions: [
        {key: '01', value: '指定时间'},
        {key: '02', value: '固定周期'}
      ],
      refreshTypeHidden: true // 刷新类型
    };
  },
  computed: {
    ...mapGetters([
      "logicSys",
      'language'
    ])
  },
  watch: {
    filterText: function (val) {
      this.$refs.menuTree.filter(val);
    },
  },
  mounted: function () {
    this.getDictTreeData();
    this.getLookupTypeOptions();
  },
  methods: {
    changeCron(val) {
      if (val && val !== '') {
        this.editLookupFormData.cronExpression = val
      }
    },
    changeRefreshTyp: function () {
      if (this.editLookupFormData.refreshType === '02' || this.editLookupFormData.refreshType === '') {
        this.refreshTypeHidden = false;
      } else {
        document.querySelector(".refreshTimeItem .el-input").style.display = 'block';
        this.refreshTypeHidden = true;
      }
    },
    closeEditLookupDialog() {
      this.isShowEditLookupDialog = false;
      this.isShowEditLookupDictDialog = false;
    },
    closeEditLookupItemsDialog() {
      this.isShowEditLookupItemsDialog = false;
    },

    //搜索数据字典列表
    searchFn: function () {
      var _this = this;
      _this.$refs.searchForm.validate(function (valid) {
        if (valid) {
          var model = _this.searchFormData;
          var params = {
            lookupCode: _this.dictNodeData.lookupCode,
            keyword: _this.$refs.searchForm.formdata.keyword
          };
          _this.searchByCode(params);
        }
      })
    },
    searchByCode: function (param) {
      var _this = this;
      _this.$request({
        method: 'POST',
        url: backend.appOcaService + '/api/adminsmlookupdict/searchbycode',
        data: {
          lookupCode: param.lookupCode,
          keyWord: param.keyword
        }
      }).then(({code, message, data}) => {
        if (code === '0' && data) {
          var dictFormData = [];
          for (var i in data) {
            dictFormData.push(data[i]);
          }
          _this.dictFormData = dictFormData;
        }
      });
    },
    // 自定义重置功能
    resetFn: function () {
      var _this = this;
      var lookupCode = _this.dictNodeData.lookupCode;
      this.$refs.searchForm.resetFields();
      this.getdictFormData(lookupCode);
    },
    /**
     * 请求字典树接口
     */
    getDictTreeData: function () {
      var _this = this;
      _this.$request({
        method: 'post',
        url: backend.appOcaService + '/api/adminsmlookupdict/selectleftlookupdict',
        // data: { sysId: _this.logicSys.id, upMenuId: -1, treeDeep: -1 },
      }).then(({code, message, data}) => {
        if (code === '0') {
          _this.menuTreeData = data;
          for (var key in _this.menuTreeData) {
            _this.menuTreeData[key].label = _this.menuTreeData[key].lookupName + "(" + _this.menuTreeData[key].lookupCode + ")"
            for (var value in _this.menuTreeData[key].adminSmLookupDictEntityList) {
              _this.menuTreeData[key].adminSmLookupDictEntityList[value].label = _this.menuTreeData[key].adminSmLookupDictEntityList[value].lookupName
                + "(" + _this.menuTreeData[key].adminSmLookupDictEntityList[value].lookupCode + ")"
            }
          }
          _this.oldMenuTreeData = JSON.parse(JSON.stringify(data));
          _this.directoryTreeData = _this.getDirectoryTreeData(JSON.parse(JSON.stringify(data)));
          // 触发过滤
          if (this.filterText) {
            var tmp = this.filterText;
            this.filterText = '';
            setTimeout(() => {
              this.filterText = tmp;
            }, 500)
          }
        }
      });
    },

    getDirectoryTreeData: function (array) {
      var _this = this, newArray = [];
      array.forEach(function (item) {
        if (item.lookupCode === 'COMMON_PARAM') {
          newArray.push(item);
          if (item.adminSmLookupDictEntityList && Array.isArray(item.adminSmLookupDictEntityList) && item.adminSmLookupDictEntityList.length > 0) {
            item.children = _this.getDirectoryTreeData(item.adminSmLookupDictEntityList);
            delete item.adminSmLookupDictEntityList;
          }
        }
      });
      return newArray;
    },

    filterMenuTreeNode: function (value, data) {
      if (!value) {
        return true;
      }
      return data.label.indexOf(value) !== -1;
    },

    // dictFormData 是否已经改变
    isDictFormDataChanged: function () {
      var _this = this;
      var isChanged = false;
      for (var key in _this.dictFormData) {
        if (_this.dictFormData[key] !== _this.oldDictFormData[key]) {
          isChanged = true;
        }
      }
      return isChanged;
    },

    addLookup() {
      this.isShowEditLookupDictDialog = true;
      this.viewType = 'ADD';
      this.currentLookupItems = [];
      this.refreshTypeHidden = true;
      this.$nextTick(function () {
        this.$refs.editLookupDictForm.setFormData({lookupName: '', lookupCode: '', lookupTypeId: ''});
      });
    },

    pushLookupItem() {
      var isLookupItemValidateOk = false;
      this.$refs.editLookupItemTable.validate(function (fields) {
        if (!fields) { // 如果校验通过, fields为null
          isLookupItemValidateOk = true;
        }
      });
      if (isLookupItemValidateOk) {
        var row = {lookupItemCode: '', lookupItemName: ''};
        this.currentLookupItems.push(row);
        this.$refs.editLookupItemTable.setCurrentRow(row);
      }
    },

    getLookupTypeOptions() {
      var _this = this;
      _this.$request({
        url: backend.appOcaService + '/api/adminsmlookupdict/queryinitdict',
        data: {}
      }).then(({code, message, data}) => {
        //处理请求成功的情况
        if (code === '0') {
          _this.lookupTypeOptions = data;
        }
      })
    },

    lookupTypeIdChange(val) {
      var _this = this;
      this.lookupTypeOptions.forEach(function (item) {
        if (item.lookupItemId === _this.editLookupFormData.lookupTypeId) {
          _this.editLookupFormData.lookupTypeName = item.lookupItemName;
        }
      });
    },

    deleteLookupItem(scope) {
      if (this.currentLookupItems.length > 1) {
        this.currentLookupItems.splice(scope.$index, 1);
      }
    },

    moveUp(index) {
      if (index > 0) {
        const update = this.currentLookupItems[index - 1];
        this.currentLookupItems.splice(index - 1, 1);
        this.currentLookupItems.splice(index, 0, update);
      } else {
        this.$message({message: this.$t('lookupdict.bksy'), type: 'error'});
      }
    },

    moveDown(index) {
      if (this.currentLookupItems.length > index + 1) {
        const downDate = this.currentLookupItems[index + 1];
        this.currentLookupItems.splice(index + 1, 1);
        this.currentLookupItems.splice(index, 0, downDate);
      } else {
        this.$message({message: this.$t('lookupdict.bkxy'), type: 'error'});
      }
    },

    checkLookupItems() {
      var array = [];
      this.currentLookupItems.map(item => {
        if (item.lookupItemCode) {
          array.push(item.lookupItemCode);
        }
      });
      const valuesAlreadySeen = [];
      for (var i = 0; i < array.length; i++) {
        if (valuesAlreadySeen.indexOf(array[i]) !== -1) {
          return true
        }
        valuesAlreadySeen.push(array[i])
      }
      return false
    },

    // 保存数据字典
    saveLookup() {
      var formValidate = true, isLookupItemValidateOk = false;
      this.$refs.editLookupForm.validate(function (valid) {
        formValidate = valid;
      });
      this.$refs.editLookupItemTable.validate(function (fields) {
        if (!fields) { // 如果校验通过, fields为null
          isLookupItemValidateOk = true;
        }
      });
      if (!formValidate || !isLookupItemValidateOk) {
        return;
      }
      if (this.checkLookupItems()) {
        this.$message({message: this.$t('lookupdict.kzbncf'), type: 'warning'});
        return;
      }
      this.editLookupFormData.lookupItemBos = this.currentLookupItems;
      this.createdLookup("item");
      // this.$refs.lookupTable.remoteData();
      // this.isShowEditLookupDialog = false;
    },

    openEditLookupItemsDialog(row) {
      var _this = this;
      this.isShowEditLookupItemsDialog = true;
      this.viewType = "UPDATE";
      // var newLookupItems = function (row) {
      //   return { key: row.lookupItemCode, value: row.lookupItemName };
      // };
      //this.editLookupFormData = [{ key: row.lookupItemCode, value: row.lookupItemName }];
      clone(row, this.editLookupFormData);
      this.getLookupItems(row, true);
      this.currentLookupItems = [];
      this.$nextTick(function () {
        this.$refs.editLookupItemTable.clearValidateMessage();
        this.pushLookupItem();
      });
    },
    getLookupItems(row, isEditLookupFormData) {
      var _this = this;
      _this.$request({
        url: backend.appOcaService + '/api/adminsmlookupdict/info/' + row.lookupItemId,
        method: 'post',
        data: {}
      }).then(({code, message, data}) => {
        //处理请求成功的情况
        if (code === '0' && data && Array.isArray(data)) {
          if (isEditLookupFormData) {
            _this.currentLookupItems = data;
            _this.$refs.editLookupItemTable && _this.$refs.editLookupItemTable.clearValidateMessage();
          }
          var newLookupItems = data.map(function (item) {
            return {key: item.lookupItemCode, value: item.lookupItemName};
          });
          row.lookupItemsString = JSON.stringify(newLookupItems);
        }
      })
    },
    // 新增数据字典类别
    saveLookupDict() {
      var formValidate = true;
      this.$refs.editLookupDictForm.validate(function (valid) {
        formValidate = valid;
      });
      if (!formValidate) {
        return;
      }
      if (this.viewType === 'ADD') {
        this.createdLookup();
      } else if (this.viewType === 'EDIT') {
        this.updateLookup();
      }
    },
    // 新增数据字典子项
    createdLookup(val) {
      var _this = this;
      _this.$request({
        url: this.viewType === 'INSERT' ? this.insertUrl : this.addUrl,
        method: 'post',
        data: this.editLookupFormData
      }).then(({code, message, data}) => {
        //处理请求成功的情况
        if (code === '0') {
          _this.$message({message: _this.$t('lookupdict.bccg'), type: 'success'});
          if (val === 'item') {
            // 如果是右侧表格增加 item 则之刷新右侧表格
            _this.getdictFormData(this.editLookupFormData.lookupCode)
          } else {
            // 反之刷新左侧的树并且右侧不可见, 必须重新选择
            this.remoteData();
            _this.buttonShow = false;
          }
          _this.isShowEditLookupDialog = false;
          _this.isShowEditLookupDictDialog = false;
        } else if (code === '20100002') {
          _this.$message({message: message, type: 'warning'});
        } else {
          _this.$message({message: message, type: 'error'});
        }
      })
    },

    // 更新数据字典
    updateLookup() {
      var _this = this;
      _this.$request({
        url: backend.appOcaService + '/api/adminsmlookupdict/update',
        method: 'post',
        data: this.editLookupFormData
      }).then(({code, message, data}) => {
        //处理请求成功的情况
        if (code === '0') {
          _this.$message({message: _this.$t('lookupdict.bccg'), type: 'success'});
          // _this.getdictFormData(this.editLookupFormData.lookupCode)
          _this.isShowEditLookupDictDialog = false;
          this.remoteData();
          _this.buttonShow = false;
        } else {
          _this.$message({message: message, type: 'error'});
        }
      })
    },

    //新增数据字典
    modifyLookup() {
      var _this = this;
      this.viewType = 'INSERT';
      this.isShowEditLookupDialog = true;
      this.currentLookupItems = [];
      this.$nextTick(function () {
        this.$refs.editLookupForm.setFormData(this.dictNodeData);
        this.getTree();
        //this.getLookupItems(this.editLookupFormData, true);
        this.$refs.editLookupItemTable.clearValidateMessage();
      });
    },

    //修改
    modifyDict() { // isDeletedictFormData为true 表示删除menuForm展示的数据的菜单, 否则是批量删除checkbox选中的菜单
      var _this = this;
      var checkedNodes = this.$refs.menuTree.getCheckedNodes();

      if (checkedNodes.length !== 1) {
        this.$message({message: this.$t('lookupdict.qxzytsj '), type: 'warning'});
        return;
      }
      this.viewType = 'EDIT';
      this.isShowEditLookupDictDialog = true;
      this.currentLookupItems = [];
      this.$nextTick(function () {
        var checkedNode = checkedNodes[0];
        _this.$request({
          url: backend.appOcaService + '/api/adminsmlookupdict/refresh/strategy',
          method: 'post',
          data: {'lookupCode': checkedNode.lookupCode}
        }).then(({code, message, data}) => {
          //处理请求成功的情况
          if (code === '0') {
            checkedNode.refreshType = data.refreshType;
            if (data.refreshType === '01') {
              checkedNode.refreshTime = data.refreshTime;
              checkedNode.cronExpression = '';
            } else if(data.refreshType === '02') {
              checkedNode.refreshTime = '';
              checkedNode.cronExpression = data.cronExpression;
            } else {
              checkedNode.refreshTime = '';
              checkedNode.cronExpression = '';
            }
          } else {
            _this.$message({message: '字典刷新策略查询失败', type: 'warning'});
          }
          _this.$refs.editLookupDictForm.setFormData(checkedNode);
        })
      });
    },


    remoteData() {
      this.getDictTreeData();
    },

    // 删除数据字典
    deleteLookup(row) {
      var selections = row ? [row] : this.$refs.lookupTable.selections;
      if (selections.length < 1) {
        this.$message({message: this.$t('lookupdict.qxxzyscdsj'), type: 'warning'});
        return;
      }
      this.confirmDeleteLookup(selections);
    },

    // 确定删除数据字典
    confirmDeleteLookup(selections) {
      var _this = this;
      var lookupItemIds = selections.map(function (item) {
        return item.lookupItemId;
      });
      this.$confirm(this.$t('lookupdict.qrscgsjm'), this.$t('lookupdict.ts'), {
        type: 'warning',
        confirmButtonText: this.$t('lookupdict.qr'),
        cancelButtonText: this.$t('lookupdict.qx')
      }).then(function () {
        _this.$request({
          url: backend.appOcaService + '/api/adminsmlookupdict/delete',
          method: 'post',
          data: lookupItemIds
        }).then(({code, message, data}) => {
          //处理请求成功的情况
          if (code === '0') {
            _this.$message({message: _this.$t('lookupdict.sccg'), type: 'success'});
            // _this.remoteData();
            _this.getdictFormData(selections[0].lookupCode)
          } else {
            _this.$message({message: message, type: 'error'});
          }
        })
      });
    },

    addLookupItems() {
      var _this = this, isLookupItemValidateOk = false;
      this.$refs.editLookupItemTable.validate(function (fields) {
        if (!fields) { // 如果校验通过, fields为null
          isLookupItemValidateOk = true;
        }
      });
      if (isLookupItemValidateOk) {
        var params = {
          lookupItemId: this.currentLookupItems[0].lookupItemId,
          lookupCode: this.editLookupFormData.lookupCode,
          lookupName: this.editLookupFormData.lookupName,
          lookupTypeId: this.editLookupFormData.lookupTypeId,
          lookupItemCode: this.currentLookupItems[0].lookupItemCode,
          lookupItemName: this.currentLookupItems[0].lookupItemName
        };
        _this.$request({
          url: backend.appOcaService + '/api/adminsmlookupdict/update',
          method: 'post',
          data: params
        }).then(({code, message, data}) => {
          //处理请求成功的情况
          if (code === '0') {
            _this.$message({message: _this.$t('lookupdict.bccg'), type: 'success'});
            // _this.remoteData();
            _this.getdictFormData(this.editLookupFormData.lookupCode)
            _this.isShowEditLookupItemsDialog = false;
          } else {
            _this.$message({message: message, type: 'error'});
          }
        })
      }
    },

    dictTreeNodeClick: function (nodeData, node, self) {
      var _this = this;
      // 如果当前表单为编辑模式 且 已改动过部分字段数据
      if (this.menuFormType === 'edit' && this.isDictFormDataChanged()) {
        this.$confirm(this.$t('lookupdict.confirmText1'), this.$t('lookupdict.ts'), {
          type: 'warning',
          callback: function (action) {
            if (action === 'confirm') {
              _this.showNodeData(nodeData);
            }
          }
        });
      } else {
        _this.showNodeData(nodeData);
      }
    },

    showNodeData: function (nodeData) { // 显示节点菜单数据
      // var childrenLength = nodeData.childrenList ? nodeData.childrenList.length : 0;
      this.currentCheckedNodeId = nodeData.lookupItemId;
      //nodeData.menuId && (this.expandedKeys = [nodeData.menuId]);
      this.rightContentTitle = this.$t('lookupdict.xq');
      this.menuFormType = 'details';
      this.dictNodeData = nodeData;
      this.getdictFormData(nodeData.lookupCode);
      this.searchFormData = {};
      this.$refs.menuForm && this.$refs.menuForm.clearValidate();
    },

    getdictFormData: function (lookupCode) {
      var _this = this;
      _this.$request({
        method: 'POST',
        data: {keyWord: lookupCode},
        url: backend.appOcaService + '/api/adminsmlookupdict/selectrightlookupdict',
      }).then(({code, message, data}) => {
        if (code === '0' && data) {
          var dictFormData = [];
          for (var i in data) {
            dictFormData.push(data[i]);
          }
          _this.dictFormData = dictFormData;
          this.buttonShow = true;
          // data.childrenLength = childrenLength;
          // // clone(data, _this.dictFormData);
          // _this.$refs.menuForm.setFormData(data);
          // _this.oldDictFormData = clone(_this.dictFormData, {});
        }
      });
    },

    manageMenu: function () {
      this.isManaging = true;
      this.isShowTreeCheckbox = true;
    },

    cancelManage: function () {
      this.isManaging = false;
      this.isShowTreeCheckbox = false;
    },

    deleteDict(isDeletedictFormData) { // isDeletedictFormData为true 表示删除menuForm展示的数据的菜单, 否则是批量删除checkbox选中的菜单
      var _this = this;
      if (isDeletedictFormData) {
        this.$refs.menuTree.setChecked(this.dictFormData, true, true);
      }
      // var checkedNodes = isDeletedictFormData ? [this.dictFormData] : this.$refs.menuTree.getCheckedNodes();
      var checkedNodes = this.$refs.menuTree.getCheckedNodes();

      if (checkedNodes.length < 1) {
        this.$message({message: this.$t('lookupdict.qxxzyscdsj '), type: 'warning'});
        return;
      }
      var dictIds = checkedNodes.map(function (item) {
        return item.lookupItemId;
      });
      this.$confirm(this.$t('lookupdict.confirmText2'), this.$t('lookupdict.ts'), {
        type: 'warning',
        confirmButtonText: _this.$t('lookupdict.qr'),
        cancelButtonText: _this.$t('lookupdict.qx'),
        callback: function (action) {
          if (action === 'confirm') {
            _this.$request({
              method: 'POST',
              url: backend.appOcaService + '/api/adminsmlookupdict/delete',
              data: dictIds,
            }).then(({code, message, data}) => {
              if (code === '0') {
                _this.$message({message: _this.$t('lookupdict.sccg'), type: 'success'});
                _this.remoteData();
                _this.buttonShow = false;
                _this.currentCheckedNodeId = '';
                _this.$store.dispatch('oauth/getAccessInfo')
              } else {
                _this.$message({message: message, type: 'error'});
              }
            });
          }
        }
      });
    },
    // 刷新缓存
    refreshCache() {
      var _this = this;
      _this.$confirm(this.$t('lookupdict.refreshcachesm'), this.$t('lookupdict.ts'), {
        type: 'warning',
        confirmButtonText: this.$t('lookupdict.qr'),
        cancelButtonText: this.$t('lookupdict.qx')
      }).then(function () {
        _this.$request({
          method: 'post',
          url: backend.appOcaService + '/api/adminsmlookupdict/refreshdict'
        }).then(({code, message, data}) => {
          //处理请求成功的情况
          if (code === '0') {
            _this.$message({message: _this.$t('lookupdict.sjzdhcgxcg'), type: 'success'});
          } else {
            _this.$message({message: message, type: 'error'});
          }
        })

      });
    },
    getTree() {
      var _this = this
      var treeData;
      _this.$request({
        method: 'post',
        url: backend.appOcaService + '/api/adminsmlookupdict/dictcodetreebyupid/' + this.dictNodeData.lookupItemId,
      }).then(({code, message, data}) => {
        if (code === '0') {
          var dictTreeData = [];
          dictTreeData[0] = data;
          _this.dictTreeData = dictTreeData;
          this.editLookupFormData.pid = data.id;
        } else {
          _this.$message({message: message, type: 'error'});
        }
      })
    },
    clearUpOrgFn() {
      this.selectValue = '';
    },
    changeUpOrgFn(node) {
      this.editLookupFormData.pid = node.id;
      this.selectValue = node.id;
    }
  }
}
</script>
<style>
.frame-height-dict {
  height: calc(100vh - 164px);
}

.compact .frame-height-dict {
  height: calc(100vh - 139px);
}

.yu-dict-config {
  height: 100%;
  font-size: 14px;
  box-shadow: none !important;
  background: #f2f2f2 !important;
}

.yu-dict-config .no-choose {
  text-align: center;
  font-size: 14px;
  width: 100%;
  position: absolute;
  top: 36%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.yu-dict-config .no-choose > img {
  float: none;
  width: 25%;
  margin-bottom: 16px;
}

.yu-dict-config .left-content {
  float: left;
  width: 400px;
  margin-right: 24px;
  background: #fff;
  overflow: hidden;
}

.yu-dict-config .right-content {
  float: left;
  width: calc(100% - 424px);
  background: #fff;
}

.yu-dict-config .content-box {
  padding-top: 24px;
}

.yu-dict-config .left-content .content-box {
  height: calc(100% - 66px);
}

.yu-dict-config .right-content .content-box {
  padding-right: 24px;
}

/* 紧凑模式start */
.compact .yu-dict-config .left-content {
  margin-right: 16px;
}

.compact .yu-dict-config .right-content {
  width: calc(100% - 416px);
}

.compact .yu-dict-config .content-box {
  padding-top: 16px;
}

.compact .yu-dict-config .left-content .content-box {
  height: calc(100% - 52px);
}

.compact .yu-dict-config .right-content .content-box {
  padding-right: 16px;
}

/* 紧凑模式end */
.yu-dict-config .filter-text {
  float: left;
  width: 200px;
}

.yu-dict-config .handle-box {
  float: left;
  margin-left: 10px;
}

.yu-dict-config .content-title {
  height: 42px;
  line-height: 42px;
  padding: 0 20px;
  font-weight: bold;
  font-size: 16px;
  color: #444;
  box-sizing: border-box;
  border-bottom: 1px solid #ededed;
}

.compact .yu-dict-config .content-title {
  font-size: 14px;
  padding: 0 16px;
  height: 36px;
  line-height: 36px;
}

.yu-dict-config .yu-base-toolbar {
  padding-left: 24px;
  padding-right: 24px;
  text-align: center;
}

.yu-dict-config .yu-base-toolbar .icon {
  margin: 0 0 0 10px;
}

.yu-dict-config .yu-base-toolbar .handle-box .el-button,
.func-detail-dialog .el-button.icon {
  width: 30px;
  height: 30px;
  padding: 0;
}

.compact .yu-dict-config .handle-box .el-button,
.compact .func-detail-dialog .el-button.icon {
  width: 28px;
  height: 28px;
  padding: 0;
}

.compact .yu-dict-config .yu-base-toolbar {
  padding-left: 16px;
  padding-right: 16px;
}

.yu-dict-config .dict-tree {
  overflow-y: auto;
  border: none;
  padding: 0 24px;
  height: calc(100% - 64px);
}

.yu-dict-config .dict-tree .el-tree {
  overflow: hidden !important;
}

.yu-dict-config .dict-tree .el-tree-node .handle-box {
  position: absolute;
  right: 24px;
  opacity: 0;
  color: #666;
  transition: all 0.15s;
}

.compact .yu-dict-config .dict-tree {
  padding: 0 16px;
  height: calc(100% - 54px);
}

.compact .yu-dict-config .dict-tree .el-tree-node .handle-box {
  right: 16px;
}

.blue .yu-dict-config .dict-tree .el-tree-node .handle-box .icon:hover {
  color: #2877ff;
}

.orange .yu-dict-config .dict-tree .el-tree-node .handle-box .icon:hover {
  color: #fb8d12;
}

.purple .yu-dict-config .dict-tree .el-tree-node .handle-box .icon:hover {
  color: #5557b9;
}

.yu-dict-config
.dict-tree
.el-tree-node
.el-tree-node__content:hover
> .label-box
.handle-box {
  opacity: 1;
}

.yu-dict-config .dict-form .el-popover {
  right: 0;
  left: 0 !important;
}

.yu-dict-config .dict-form .form-tips,
.func-detail-dialog .func-form .form-tips {
  color: #999;
  font-size: 13px;
  line-height: 18px;
}

.compact .yu-dict-config .dict-form .form-tips,
.func-detail-dialog .func-form .form-tips {
  font-size: 12px;
  line-height: 13px;
}

.yu-dict-config .dict-form .button-group {
  margin: 22px 0 0 170px;
  font-size: 0;
}

.yu-dict-config .dict-form .dict-icon {
  vertical-align: middle;
}

.yu-dict-config .dict-form .dict-icon::before,
.func-detail-dialog .func-form .dict-icon::before {
  font-size: 18px;
  /*font-family: 'icomoon' !important;*/
}

.yu-dict-config .dict-form .dict-icon.pointer,
.func-detail-dialog .func-form .dict-icon.pointer {
  cursor: pointer;
  transition: 0.2s;
  vertical-align: middle;
}

.blue .yu-dict-config .dict-form .dict-icon.pointer:hover,
.blue .func-detail-dialog .func-form .dict-icon.pointer:hover {
  color: #2877ff;
}

.orange .yu-dict-config .dict-form .dict-icon.pointer:hover,
.orange .func-detail-dialog .func-form .dict-icon.pointer:hover {
  color: #fb8d12;
}

.purple .yu-dict-config .dict-form .dict-icon.pointer:hover,
.purple .func-detail-dialog .func-form .dict-icon.pointer:hover {
  color: #5557b9;
}

.yu-dict-config .dict-form .menu-order {
  display: inline-block;
  margin-right: 10px;
}

.yu-dict-config .dict-form .select-icon,
.func-detail-dialog .func-form .select-icon {
  display: inline-block;
  margin: 0 8px;
  color: #2877ff;
  cursor: pointer;
}

.yu-dict-config .dict-form .el-col-24:last-of-type .el-form-item {
  margin-bottom: 0;
}

.yu-menu-function-dialog .dialog-search {
  overflow: hidden;
}

.yu-menu-function-dialog .function-table .cell .el-button ~ .el-button {
  /**margin-left: 0;**/
}

.func-detail-dialog .el-button.icon {
  width: 36px;
  height: 36px;
  line-height: 36px;
  margin-left: 10px;
}

.compact .func-detail-dialog .el-button.icon {
  width: 28px;
  height: 28px;
  line-height: 26px;
}

.func-detail-dialog .select-icon-group .el-col-24 {
  width: calc(100% - 46px);
}

.compact .func-detail-dialog .select-icon-group .el-col-24 {
  width: calc(100% - 38px);
}

.yu-model-manage-dialog .el-table .cell .el-button ~ .el-button {
  margin-left: 15px;
}

.func-detail-dialog .yu-xform.el-form-details .el-form-item__content {
  word-break: break-all;
}

.content-title .el-button {
  float: right;
  padding: 13px 0px;
}

.compact .content-title .el-button {
  padding: 11px 0px;
}

.compact .yu-dict-config .content-title {
  padding: 0 16px;
}

.compact .yu-base-toolbar {
  padding-bottom: 16px !important;
}

/* .compact .yu-dict-config .dict-form .form-tips{
    margin-bottom: 16px;
  } */
.compact .yu-dict-config .dict-form .button-group {
  margin-top: 16px;
}

#changeContab .language {
  display: none;
}
</style>
