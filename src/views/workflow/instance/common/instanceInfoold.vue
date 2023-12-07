<template>
  <div>
    <el-tabs v-model="tabValue" type="card" @tab-click="tabClick">
      <el-tab-pane :label="$t('wfinsinfo.tab1')" name="first">
        <el-collapse v-model="collapseValue">
          <el-collapse-item :title="$t('wfinsinfo.title1')" name="1">
            <div :id="nwfbiztypePage">
              <component :is="bizPage" :biz-page-data="bizPageData"></component>
            </div>
          </el-collapse-item>

          <el-collapse-item :title="$t('wfinsinfo.title2')" name="4">
            <el-form ref="commentForm" label-width="160px" :model="commentInfo" :rules="commentRules">
              <el-form-item :label="$t('wfinsinfo.comment')" prop="userComment">
                <el-input type="textarea" v-model="commentInfo.userComment" :disabled="button.signIn == 1"></el-input>
              </el-form-item>
              <el-form-item class="box-card">
                <el-button @click="cancel">{{ $t('wfinsinfo.butback') }}</el-button>
                <el-button type="primary" @click="saveComment" v-if="button.signIn !== '1'">{{ $t('wfinsinfo.butsave') }}</el-button>
                <el-button type="primary" @click="submitFn('O-12')" v-if="button.signIn !== '1'">{{ $t('wfinsinfo.butagree') }}</el-button>
                <el-button type="primary" @click="submitFn('O-8')" v-if="button.signIn !== '1' && button.refuse !== '0'">{{ $t('wfinsinfo.butrefuse') }}</el-button>
                <el-button type="primary" @click="submitFn('O-17')" v-if="button.signIn !== '1' && button.cancel !== '0'">{{ $t('wfinsinfo.butcancel') }}</el-button>
                <el-button type="primary" @click="signIn" v-if="button.signIn == '1'">{{ $t('wfinsinfo.butsignin') }}</el-button>
                <el-button type="primary" @click="unSignIn" v-if="button.unSignIn == '1'">{{ $t('wfinsinfo.butsignout') }}</el-button>
                <el-button type="primary" @click="callBackFn" v-if="button.signIn != '1' && button.callBack !== '0'">{{ $t('wfinsinfo.butdahui') }}</el-button>
                <el-button type="primary" @click="returnBackFn" v-if="button.signIn != '1' && button.returnBack !== '0'">{{ $t('wfinsinfo.buttuihui') }}</el-button>
                <el-button type="primary" @click="submitFn('O-9')" v-if="button.signIn != '1' && button.jump !== '0'">{{ $t('wfinsinfo.butjump') }}</el-button>
                <el-button type="primary" @click="submitFn('O-6')" v-if="button.signIn != '1' && button.change !== '0'">{{ $t('wfinsinfo.butchange') }}</el-button>
                <el-button type="primary" @click="submitFn('O-7')" v-if="button.signIn != '1' && button.assist !== '0'">{{ $t('wfinsinfo.butxieban') }}</el-button>
                <el-button type="primary" @click="submitFn('O-27')" v-if="button.signIn != '1' && button.addSign !== '0'">{{ $t('wfinsinfo.butjiaqian') }}</el-button>
                <!--el-button type="primary" @click="submitFn('O-26')" v-if="button.signIn != '1' && button.change == 0">补签</el-button-->
                <el-button type="primary" @click="wfGatherFn" v-if="button.signIn == '0' && button.gather !== '0'">{{ $t('wfinsinfo.buttogether') }}</el-button>
                <el-button type="primary" @click="unSignInTaskPool" v-if="button.taskPoolId != '0'">{{ $t('wfinsinfo.butbacktp') }}</el-button>
                <el-button type="primary" @click="subFlowStart" v-if="button.subFlow == '0' || button.subFlow == '1'">{{ $t('wfinsinfo.butsubflow') }}</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane :label="$t('wfinsinfo.tab2')" name="second">
        <div style="height: 20px" align="center">{{ commentinfo }}</div>
        <el-collapse accordion>
          <el-collapse-item v-for="(node, index1) in nodeHistory" :title="node.startTime + '  ' + node.nodeName" :key="index1" :name="index1">
            <el-card class="box-card">
              <yu-xform ref="refFormDemo" label-width="120px" form-type="details" disabled>
                <yu-xform-group :column="3">
                  <yu-xform-item :label="$t('wfinsinfo.nodename')" ctype="input" name="type" :value="node.nodeName"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.username')" ctype="input" name="author" :value="node.userName"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.nodestate')" ctype="input" name="tel" style="color: #00aa7f" :value="$t('wfnodestate.agree')" v-if="node.commentSign == 'O-12'"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.nodestate')" ctype="input" name="tel" style="color: #ff0000" :value="$t('wfnodestate.dahui')" v-if="node.commentSign == 'O-1'"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.nodestate')" ctype="input" name="tel" style="color: #ff5500" :value="$t('wfnodestate.tuihui')" v-if="node.commentSign == 'O-2'"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.nodestate')" ctype="input" name="tel" style="color: #ffaa00" :value="$t('wfnodestate.nahui')" v-if="node.commentSign == 'O-0'"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.nodestate')" ctype="input" name="tel" style="color: #ff0000" :value="$t('wfnodestate.cuiban')" v-if="node.commentSign == 'O-5'"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.nodestate')" ctype="input" name="tel" style="color: #00aaff" :value="$t('wfnodestate.xieban')" v-if="node.commentSign == 'O-7'"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.nodestate')" ctype="input" name="tel" style="color: #00aaff" :value="$t('wfnodestate.change')" v-if="node.commentSign == 'O-6'"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.nodestate')" ctype="input" name="tel" style="color: #00aa7f" :value="$t('wfnodestate.jump')" v-if="node.commentSign == 'O-9'"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.nodestate')" ctype="input" name="tel" style="color: #ff5500" :value="$t('wfnodestate.refuse')" v-if="node.commentSign == 'O-8'"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.nodestate')" ctype="input" name="tel" style="color: #ff5500" :value="$t('wfnodestate.chehui')" v-if="node.commentSign == 'O-15'"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.nodestate')" ctype="input" name="tel" style="color: #55aa00" :value="$t('wfnodestate.faqi')" v-if="node.commentSign == 'O-16'"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.nodestate')" ctype="input" name="tel" style="color: #00aaff" :value="$t('wfnodestate.end')" v-if="node.commentSign == 'O-14'"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.nodestate')" ctype="input" name="tel" style="color: #ffaa00" :value="$t('wfnodestate.jiaqian')" v-if="node.commentSign == 'O-27'"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.starttime')" name="time" :value="node.startTime"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.userid')" ctype="input" name="status" :value="node.userId"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.nodeid')" ctype="input" name="nodeID" :value="node.nodeId"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.usercomment')" colspan="24" name="content" ctype="textarea" :value="node.userComment"></yu-xform-item>
                  <yu-xform-item :label="$t('wfinsinfo.extcomment')" colspan="24" name="ext" ctype="textarea" :value="node.ext"></yu-xform-item>
                </yu-xform-group>
              </yu-xform>
            </el-card>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane :label="$t('wfinsinfo.tab3')" name="meetstart" v-if="button['gather'] != '0' && meetPageShow">
        <div :id="nwfmeetPage">
          <component :is="meetPage" :biz-page-data="gatherPageData" @cancel-fn="cancelMeet"></component>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('wfinsinfo.tab3')" name="4" v-if="button['gather'] != '0'">
        <div :id="gatherHandleId">
          <component :is="gatherPage" :biz-page-data="gatherPageData"></component>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('wfinsinfo.tab4')" name="5">
        <yu-timeline class="todo-process" v-if="timelineItems.length">
          <yu-timeline-item v-for="(item, indexh) in timelineItems" :key="indexh" :timeline-items="timelineItems">
            <div slot="title">
              {{ item.nodeName }}
              <span class="processTag" :class="'processTag' + item.processType">{{ item.commentSign }}</span>
            </div>
            <div slot="date">{{ item.startTime }}</div>
            <div slot="description">
              <ul>
                <li>
                  <span>{{ $t('wfinsinfo.spr') }}{{ item.userName }}&emsp;{{ $t('wfinsinfo.gh') }}{{ item.userId }}</span>
                </li>
                <li>
                  <span>{{ $t('wfinsinfo.spsc') }}{{ item.time }}({{ item.timeType }})</span>
                </li>
                <li style="word-break: break-all">
                  <span>{{ $t('wfinsinfo.spsm') }}{{ item.userComment }}</span>
                </li>
              </ul>
            </div>
          </yu-timeline-item>
        </yu-timeline>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="$t('wfinsinfo.titlety')" :visible.sync="agreeNodeSelect.showDialog" @close="agreeDialogClose">
      <el-form ref="form" label-width="20px" align="center">
        <el-radio-group v-model="agreeRadio" @change="agreeRadioChange" style="width: auto; padding-left: 20px" v-show="agreeShowRadio">
          <el-form-item v-for="(node, index1) in agreeNextNodes" style="min-width: 380px" align="left" :key="index1">
            <el-col :span="6">
              <el-radio :label="node.nodeId">{{ node.nodeName }}</el-radio>
            </el-col>
            <el-col :span="9">
              <el-row :gutter="2">
                <el-col :span="14">
                  <el-input v-model="node.userSelected" type="textarea" readonly autosize></el-input>
                </el-col>
                <el-col :span="8">
                  <el-button @click="agreeSelectNodeUser(node, index1)" v-if="node.isSysUser != true && node.selected == true">{{ $t('wfinsinfo.butselect') }}</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8" v-show="node.nodeType != 'E'">
              <el-row :gutter="2">
                <el-col :span="12">
                  <yu-tooltip :content="node.copyUser" :disabled="null == node.copyUser || '' == node.copyUser" placement="top">
                    <el-input v-model="node.copyUser" type="input" readonly autosize></el-input>
                  </yu-tooltip>
                </el-col>
                <el-col :span="8">
                  <el-button icon="message" @click="agreeSelectCopyUser(node, index1)">{{ $t('wfinsinfo.butcopy') }}</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-form-item>
        </el-radio-group>
        <el-checkbox-group v-model="agreeCheckBox" v-show="!agreeShowRadio" @change="agreeRadioChange">
          <el-form-item v-for="(node, index1) in agreeNextNodes" style="min-width: 380px" align="left" :key="index1">
            <el-col :span="6">
              <el-checkbox :label="node.nodeId" :key="node.nodeId" :checked="node.selected == true">{{ node.nodeName }}</el-checkbox>
            </el-col>
            <el-col :span="9">
              <el-row :gutter="2">
                <el-col :span="14">
                  <el-input v-model="node.userSelected" type="input" readonly autosize></el-input>
                </el-col>
                <el-col :span="8">
                  <el-button @click="agreeSelectNodeUser(node, index1)" v-if="node.isSysUser != true && node.selected == true">{{ $t('wfinsinfo.butselect') }}</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8" v-show="node.nodeType != 'E'">
              <el-row :gutter="2">
                <el-col :span="12">
                  <yu-tooltip :content="node.copyUser" :disabled="null == node.copyUser || '' == node.copyUser" placement="top">
                    <el-input v-model="node.copyUser" type="input" readonly autosize></el-input>
                  </yu-tooltip>
                </el-col>
                <el-col :span="8">
                  <el-button icon="message" @click="agreeSelectCopyUser(node, index1)">{{ $t('wfinsinfo.butcopy') }}</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-form-item>
        </el-checkbox-group>
        <el-checkbox-group>
          <el-form-item v-if="instanceIdInfo.handvarype == 5 || instanceIdInfo.handvarype == 6" style="min-width: 380px" align="left">
            <el-col style="width: auto; padding-left: 125px">
              <el-row>
                <el-radio v-model="agreeIsLastRadio" label="N">{{ $t('wfinsinfo.butislast') }}</el-radio>
                <el-radio v-model="agreeIsLastRadio" label="Y">{{ $t('wfinsinfo.butnolast') }}</el-radio>
              </el-row>
            </el-col>
          </el-form-item>
        </el-checkbox-group>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="agreeFn">{{ $t('wfinsinfo.butsubmit') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('wfinsinfo.titleuser')" :visible.sync="agreeNodeSelect.showUserDialog">
      <el-card class="box-card" v-show="agreeNextNodes[agreeIndex] != undefined">
        <el-tag v-for="tag in agreeNextNodes[agreeIndex].userInfos" :key="tag.userId" type="success" closable @close="agreeTagClose(tag)">
          {{ tag.userName }}
        </el-tag>
      </el-card>
      <el-table ref="agreeUserTableRef" :data="agreeNodeSelect.userTableData" @row-dblclick="agreeRowDbClick">
        <el-table-column prop="userId" :label="$t('wfinsinfo.login')"> </el-table-column>
        <el-table-column prop="userName" :label="$t('wfinsinfo.name')" width="180"> </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 30]" :page-size="pagesize" :current-page="currpage" :total="agreeNodeSelect.userTableData.length" @current-change="currpageChange" @size-change="pagesizeChange"> </el-pagination>
      <div style="margin-top: 20px">
        <el-button @click="agreeUserClose">{{ $t('wfbutton.xqfh') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('wfinsinfo.titledahui')" :visible.sync="callbackNodeSelect.showDialog" height="300px" @open="backDialogOpen" @close="wfCallBackClose">
      <el-tabs v-model="backActiveName" type="card">
        <el-tab-pane :label="$t('wfinsinfo.tab5')" name="first" align="center">
          <el-row style="margin-top: 20px" align="center">
            <el-col>
              <el-radio-group v-model="backNodeModel" @change="radioChange" style="width: 600px" align="left">
                <el-row :gutter="10" v-for="item in backNodes" :key="item.nodeId">
                  <el-col :span="8" font-size="14px">
                    <el-radio :label="item.nodeId" :key="item.nodeName">{{ item.nodeId + '-' + item.nodeName }} </el-radio>
                  </el-col>
                  <el-col :span="16">
                    <el-checkbox-group v-model="userModel" v-show="item.selected">
                      <el-checkbox v-for="item1 in item.usersList" :label="item1.userId" :key="item1.userName" font-size="14px">{{ item1.userName }}</el-checkbox>
                    </el-checkbox-group>
                  </el-col>
                </el-row>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane :label="$t('wfinsinfo.tab6')" name="second" align="center">
          <el-form ref="form" align="center">
            <el-form-item style="margin-bottom: 15px"></el-form-item>
            <el-form-item align="center">
              <el-radio-group v-model="backnode" align="center">
                <el-radio :label="0">{{ $t('wfinsinfo.msgdirect') }}</el-radio>
                <el-radio :label="1">{{ $t('wfinsinfo.msgonebyone') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" align="center">
        <el-button type="primary" @click="wfCallBack">{{ $t('wfbutton.sure') }}</el-button>
        <el-button type="primary" @click="wfCallBackClose">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('wfinsinfo.titlejump')" :visible.sync="jumpNodeSelect.showDialog" height="300px" @close="jumpClose">
      <el-form ref="form" label-width="120px">
        <el-radio-group v-model="jumpNodeModel" @change="jumpradioChange" style="width: 600px; margin-left: auto">
          <el-form-item v-for="(node, index1) in jumpNodes" style="margin: auto" :key="index1">
            <el-col :span="8">
              <el-radio :label="node.nodeId">{{ node.nodeId + '-' + node.nodeName }} </el-radio>
            </el-col>
            <el-col :span="12" v-show="node.selected">
              <el-input v-model="node.selectUser.userName" type="textarea" autosize></el-input>
            </el-col>
            <el-col :span="4" v-show="node.selected">
              <el-button @click="jumpSelectUser(node, index1)">{{ $t('wfinsinfo.butselect') }}</el-button>
            </el-col>
          </el-form-item>
        </el-radio-group>
      </el-form>
      <div slot="footer" align="center">
        <el-button type="primary" @click="jumpFn()">{{ $t('wfbutton.sure') }}</el-button>
        <el-button type="primary" @click="jumpClose">{{ $t('wfbutton.cancel') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="UserSelect[title]" :visible.sync="UserSelect.showUserDialog">
      <el-card class="box-card" v-show="true">
        <el-tag v-for="tag in UserSelect.SelectUsers" :key="tag.userId" type="success" closable @close="TagClose(tag)">
          {{ tag.userName }}
        </el-tag>
      </el-card>
      <el-table ref="UserTableRef" :data="UserSelect.Users" @row-dblclick="RowDbClick">
        <el-table-column prop="userId" :label="$t('wfinsinfo.login')"> </el-table-column>
        <el-table-column prop="userName" :label="$t('wfinsinfo.name')"> </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" :total="UserSelect.Users.length"> </el-pagination>
      <div style="margin-top: 20px">
        <el-button v-if="title == 'jump' || title == 'copy'" @click="UserDialogClose">{{ $t('wfbutton.xqfh') }}</el-button>
        <el-button type="primary" v-if="title == 'change'" @click="UserDialogClose">{{ $t('wfinsinfo.butsurechange') }}</el-button>
        <el-button type="primary" v-if="title == 'assist'" @click="UserDialogClose">{{ $t('wfinsinfo.butsureassist') }}</el-button>
        <el-button type="primary" v-if="title == 'jiaqian' || title == 'buqian'" @click="UserDialogClose">{{ $t('wfbutton.sure') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { validator } from '@/utils/validate';
import { sessionStore, extend } from '@/utils';
import { VIEW_SIZE } from '@/config/constant/app.data.common';
import { loadView } from '@/utils/loadView';
import { getI18nMessage } from '@/locale';
const loadType = process.env.VUE_APP_YUXP_LOADTYPE; // 加载方式，json , vue , database
var data = {};
export default {
  name: 'instanceInfo',
  data: function () {
    var _this = this;
    return {
      collapseValue: ['1', '4'],
      collapse2FormDisable: true,
      urls: {
        index: backend.workflowService + '/api/bench/todo',
        instanceInfo: backend.workflowService + '/api/core/instanceInfo',
        saveComment: backend.workflowService + '/api/core/saveComment/',
        signIn: backend.workflowService + '/api/core/signIn/',
        unSignIn: backend.workflowService + '/api/core/unSignIn/',
        getComments: backend.workflowService + '/api/core/getAllComments/',
        getNextNodeInfos: backend.workflowService + '/api/core/getNextNodeInfos/',
        submit: backend.workflowService + '/api/core/submit',
        returnBack: backend.workflowService + '/api/core/returnBack',
        refuse: backend.workflowService + '/api/core/refuse',
        cancel: backend.workflowService + '/api/core/cancel',
        callBack: backend.workflowService + '/api/core/callBack',
        jump: backend.workflowService + '/api/core/jump',
        assist: backend.workflowService + '/api/core/assist',
        change: backend.workflowService + '/api/core/change',
        getchangeUser: backend.workflowService + '/api/core/getChangeUsers',
        getassistUser: backend.workflowService + '/api/core/getAssistUsers',
        unSignInTaskPool: backend.workflowService + '/api/core/unsignTaskPool',
        subFlowStart: backend.workflowService + '/api/core/subFlowStart',
        nwfbiz: backend.workflowService + '/api/biz/',
        getCopyUser: backend.workflowService + '/api/core/getCopyUsers',
      },
      height: sessionStore.get(VIEW_SIZE).height - 103,
      currentOrgId: '',
      currentUserId: '',
      returnBackFuncId: '',
      returnBackRootId: '',
      instanceIdInfo: {},
      commentInfo: {
        instanceId: '',
        nodeId: '',
        userId: '',
        commentId: '',
        commentSign: 'O-12',
        userComment: '',
        ext: '无',
      },
      flowParam: [],
      bizParams: {},
      commentRules: {
        userComment: [
          {
            required: true,
            message: this.$t('wfinsinfo.msginputcomm'),
            trigger: 'blur',
          },
          {
            max: 500,
            message: this.$t('wfinsinfo.msgcdxz500'),
          },
          {
            validator: function (rule, value, callback) {
              var reg = new RegExp("[`~@#$^&*()=|{}'\\[\\]<>/~@#￥……&*（）——|{}【】'+]");
              if (value && reg.test(value)) {
                callback(new Error(getI18nMessage('component.valid_msg_001')));
              } else {
                callback();
              }
            },
          },
        ],
      },
      button: {
        // 按钮权限控制
        submit: '1',
        gather: '0',
        callBack: '0',
        entrust: '0',
        copy: '0',
        jump: '0',
        returnBack: '0',
        change: '0',
        unSignIn: '0',
        signIn: '0',
        assist: '0',
        refuse: '0',
        taskPoolId: '0',
        subFlowId: '0',
        subFlow: '',
        cancel: '0',
        addSign: '0',
      },
      agreeNodeSelect: {
        showDialog: false,
        nodeUrl: backend.workflowService + '/api/core/getNextNodeInfos/',
        showUserDialog: false,
        userUrl: backend.workflowService + '/api/core/getNodeUsers',
        userTableData: [],
      },
      callbackNodeSelect: {
        showDialog: false,
        nodeUrl: backend.workflowService + '/api/core/getCallBackNodes',
      },
      jumpNodeSelect: {
        showDialog: false,
        nodeUrl: backend.workflowService + '/api/core/getJumpNodes',
      },
      UserSelect: {
        jump: _this.$t('wfinsinfo.titlejumpuser'),
        assist: _this.$t('wfinsinfo.titleassist'),
        change: _this.$t('wfinsinfo.titlechange'),
        copy: _this.$t('wfinsinfo.titlecopy'),
        jiaqian: '加签用户选择',
        showUserDialog: false,
        userUrl: backend.workflowService + '/api/core/getNodeUsers',
        Users: [],
        SelectUsers: [],
      },
      jumpNodeModel: '',
      jumpNodes: [],
      input: '',
      title: '',
      index: 0,
      agreeIndex: 0,
      agreeNextNodes: [{}],
      agreeShowRadio: false,
      agreeRadio: '',
      agreeCheckBox: [],
      agreeIsLastRadio: 'N',
      backActiveName: 'first',
      backNodeModel: '',
      userModel: [],
      // usersList: [],
      backNodes: [],
      historyValue: [],
      nodeHistory: [],
      pagesize: 10,
      currpage: 1,
      backnode: 1,
      gatherHandleId: 'gatherHandleId',
      nwfbiztypePage: 'nwfbiztypePage' + Date.now(),
      endNodeId: '',
      isCopy: '1',
      copyUserName: '',
      commentinfo: '',
      bizPage: '',
      bizPageData: null,
      processDialogVisible: false,
      timelineItems: [],
      gatherPage: '',
      gatherPageData: [],
      nwfmeetPage: 'nwfmeetPage' + Date.now(),
      meetstart: '@/views/workflow/instance/metting/meetstart.vue',
      meetPageShow: false,
      meetData: null,
      meetPage: null,
      tabValue: 'first',
    };
  },
  computed: {
    ...mapGetters(['userCode', 'org']),
  },
  created() {
    this.currentOrgId = this.org.code;
    this.currentUserId = this.userCode;
  },
  mounted: function () {
    data = this.$route.params;
    // 进入初始化
    var param = {
      instanceId: data.instanceId,
      nodeId: data.nodeId,
      userId: data.userId,
    };
    this.instanceInfoFn(param);
    this.instanceIdInfo.instanceId = data.instanceId;
    this.instanceIdInfo.nodeId = data.nodeId;
    this.returnBackFuncId = data.returnBackFuncId;
    this.returnBackRootId = data.returnBackRootId;
    this.currentUserId = data.userId;
  },
  methods: {
    // 详情页Tab页点击事件
    tabClick: function (tab, event) {
      var _this = this;
      if (tab.name == 'second' || tab.name === '5') {
        // 获取流程历史数据
        _this
          .$request({
            method: 'POST',
            url: _this.urls.getComments,
            data: {
              mainInstanceId: _this.instanceIdInfo.mainInstanceId,
            },
          })
          .then(({ code, message, data }) => {
            if (code == 0) {
              if (data != null ? data.length > 0 : false) {
                _this.commentinfo = '';
                var nodeHistory = data;
                // commentSign翻译
                // for (var i = 0, length = nodeHistory.length; i < length; i++) {
                //   nodeHistory[i].commentSign = _this.$lookup.convertKey("OP_TYPE", nodeHistory[i].commentSign);
                // }
                // 判断是否为会办汇总后的节点
                // if (nodeHistory[nodeHistory.length - 1].userId == 'sign_user') {
                //   _this.isSignUser = true;
                //   _this.voterAdvicesList(nodeHistory[nodeHistory.length - 1].instanceId, _this.instanceIdInfo.bizId);
                // }
                _this.nodeHistory = nodeHistory;
                _this.convertTimeItems(data);
              } else {
                _this.commentinfo = _this.$t('wfinsinfo.msgnocomm');
              }
            }
          });
      } else if (tab.name == '4') {
        // 获取会办信息和页面
        var params = {
          bizId: _this.instanceIdInfo.bizId,
          instanceId: _this.instanceIdInfo.instanceId,
        };
        var meetId = _this.getLastMeetingId();
        if (meetId) {
          params['meetId'] = meetId;
        }
        _this.$nextTick(function () {
          try {
            _this.gatherPageData = params;
            _this.gatherPage = function () {
              return Promise.resolve(require('@/views/workflow/instance/metting/mettingPage.vue').default);
            };
          } catch (e) {}
        });
      }
      // else if (tab.name == "meetstart") {
      //   // 初始化会办信息和页面
      //   if (this.meetPageShow) {
      //     _this.checkGatherData();
      //   }
      // }
    },
    convertTimeItems: function (items) {
      items.forEach((item) => {
        this.trans(item);
        item.commentSign = item.commentSign ? yufp.lookup.convertKey('OP_TYPE', item.commentSign) : this.$t('wfinsinfo.msgwsp');
      });
      this.timelineItems = items;
    },
    trans: function (item) {
      var day = 86400,
        hour = 3600,
        d = 3;
      item.processType = item.commentSign;
      if (item.approvalTime) {
        var time = parseInt(item.approvalTime);
        if (time > day) {
          var a = time / day;
          item.time = a.toFixed(d);
          item.timeType = this.$t('wfinsinfo.msgday');
        } else {
          var a = time / hour;
          item.time = a.toFixed(d);
          item.timeType = this.$t('wfinsinfo.msghour');
        }
      } else {
        item.time = 0.0;
        item.timeType = this.$t('wfinsinfo.msghour');
      }
    },
    // 获取最近一次的会议ID
    getLastMeetingId() {
      var result;
      var _this = this;
      var params = {
        bizId: _this.instanceIdInfo.bizId,
        instanceId: _this.instanceIdInfo.instanceId,
        sort: 'start_time desc',
      };
      yufp.service.request({
        method: 'POST',
        data: params,
        async: false,
        url: backend.workflowService + '/api/metting/query',
        callback: function (code, message, response) {
          if (response.code == 0 && response.data && response.data.length > 0) {
            result = response.data[0].meetId;
          }
        },
      });
      return result;
    },
    // 初始化投票人信息
    voterAdvicesList(data1, data2) {
      var _this = this;
      var params = {
        instanceId: data1,
        bizId: data2,
      };
      var meetId = _this.getLastMeetingId();
      if (meetId) {
        params['meetId'] = meetId;
      }
      _this.$nextTick(function () {
        try {
          _this.gatherPageData = params;
          _this.gatherPage = function () {
            return Promise.resolve(require('@/views/workflow/instance/metting/mettingPage.vue').default);
          };
        } catch (e) {}
      });
    },
    instanceInfoFn: function (param) {
      // 初始化实例信息
      var _this = this;
      _this
        .$request({
          method: 'POST',
          url: _this.urls.instanceInfo,
          data: param,
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            _this.instanceIdInfo = data;
            if (data.comment != null) {
              // 设置评论反显
              _this.commentInfo = data.comment;
              if (_this.commentInfo.commentSign == null) {
                _this.commentInfo.commentId = '';
              }
            }
            _this.commentInfo.instanceId = _this.instanceIdInfo.instanceId;
            _this.commentInfo.nodeId = _this.instanceIdInfo.nodeId;
            _this.commentInfo.userId = _this.currentUserId;
            // 按钮权限
            if (data.opType != null) {
              for (var key in _this.button) {
                var value = data.opType[key];
                if (value != null && value != '') {
                  _this.button[key] = value;
                }
              }
            }
            if (data.param != null) {
              _this.bizParams = data.param;
              // 流程参数初始化
              for (var key in data.param) {
                var paramTT = {};
                paramTT.key = key;
                paramTT.value = data.param[key];
                _this.flowParam.push(paramTT);
              }
            }
            var nodestate = _this.instanceIdInfo.nodeState;
            if (nodestate != '') {
              // 翻译节点状态
              _this.instanceIdInfo.nodeStateName = _this.$lookup.convertKey('OP_TYPE', nodestate);
            }
            var bizPage = _this.instanceIdInfo.bizPage;
            if (bizPage == null ? false : bizPage.includes('?')) {
              var str = bizPage.split('?');
              bizPage = str[0];
              _this.convertParam(str[1]);
            }
            var paramT = {
              instanceInfo: _this.instanceIdInfo,
              flowParam: _this.bizParams,
            };
            // _this.bizPage = bizPage;
            _this.$nextTick(() => {
              try {
                _this.bizPage = loadView(bizPage);
                _this.bizPageData = paramT;
              } catch (e) {}
            });
            // 此节点有会办权限
            if (_this.button['gather'] !== '0') {
              // _this.meetPageShow = true;
              _this.checkGatherData();
            }
            if (!data.firstNode) {
              _this.button.cancel = '0';
            }
          } else {
            _this.$message({
              duration: 6000,
              message: message ? message : _this.$t('wfinsinfo.msginfoerror'),
              type: 'error',
            });
          }
        });
    },
    convertParam: function (params) {
      if (params == null) {
        return;
      }
      if (params.includes(',')) {
        params = params.split(',');
        for (var k = 0; k < params.length; k++) {
          var paramf = {};
          var item = params[k];
          paramf.key = item.split('=')[0];
          paramf.value = item.split('=')[1];
          this.bizParams[paramf.key] = paramf.value;
          var isHave = false;
          for (var i = 0; i < this.flowParam.length; i++) {
            if (this.flowParam[i].key === paramf.key) {
              this.flowParam[i].value = paramf.value;
              isHave = true;
            }
          }
          if (!isHave) {
            this.flowParam.push(paramf);
          }
        }
      } else {
        var paramf = {};
        paramf.key = params.split('=')[0];
        paramf.value = params.split('=')[1];
        this.bizParams[paramf.key] = paramf.value;
        var isHave = false;
        for (var i = 0; i < this.flowParam.length; i++) {
          if (this.flowParam[i].key === paramf.key) {
            this.flowParam[i].value = paramf.value;
            isHave = true;
          }
        }
        if (!isHave) {
          this.flowParam.push(paramf);
        }
      }
    },
    checkGatherData: function () {
      var _this = this;
      yufp.service.request({
        method: 'POST',
        data: { instanceId: _this.instanceIdInfo.instanceId, nodeId: _this.instanceIdInfo.nodeId },
        url: backend.workflowService + '/api/metting/checkMeet',
        callback: function (code, message, response) {
          if (response.code == 0) {
            if (response.data != null) {
              // 已发起会办
              _this.$nextTick(function () {
                try {
                  _this.meetData = response.data;
                  _this.meetPage = function () {
                    return Promise.resolve(require('@/views/workflow/instance/metting/meetstart.vue').default);
                  };
                  _this.meetPageShow = true;
                  _this.meetData.instanceInfo = _this.instanceIdInfo;
                  _this.gatherPageData = _this.meetData;
                  _this.tabValue = 'meetstart';
                } catch (e) {}
              });
            } else {
              // _this.gatherStartFn();
            }
          }
        },
      });
    },
    submitFn: function (opType) {
      // 功能方法实现接口
      var _this = this;
      _this.commentInfo.commentSign = opType;
      _this.$refs.commentForm.validate(function (vaild) {
        // 校验规则
        if (vaild) {
          _this.submitbefore();
          if (opType == 'O-6') {
            // 转办
            _this.title = 'change';
            _this.getChangeUser();
          } else if (opType == 'O-7') {
            // 协办
            _this.title = 'assist';
            _this.getAssistUser();
          } else if (opType == 'O-26') {
            // 补签
            _this.title = 'buqian';
            _this.getAssistUser();
          } else if (opType == 'O-27') {
            // 加签
            _this.title = 'jiaqian';
            _this.getAddSignUser();
          } else if (opType == 'O-8') {
            // 否决
            _this.refuse();
          } else if (opType == 'O-17') {
            // 作废
            _this.cancelFn();
          } else if (opType == 'O-9') {
            // 跳转
            _this.title = 'jump';
            _this.JumpDialogOpen();
            _this.jumpNodeSelect.showDialog = true;
          } else if (opType == 'O-12') {
            // 同意提交
            _this.agreeDialogOpen();
          }
        } else {
          _this.$message({
            duration: 6000,
            message: _this.$t('wfinsinfo.msginputillegal'),
            type: 'warning',
          });
        }
      });
    },
    cancel: function () {
      // 跳转到之前的页面
      this.$router.replace({
        name: this.returnBackFuncId,
      });
      this.flowId = '';
    },
    saveComment: function () {
      // 保存评论
      var _this = this;
      this.$refs['commentForm'].validate((valid) => {
        if (valid) {
          var data = _this.instanceIdInfo;
          extend(true, data, _this.commentInfo);
          //data.commentSign = 'O-12';
          data.commentSign = '';
          _this
            .$request({
              method: 'POST',
              data: data,
              url: _this.urls.saveComment,
            })
            .then(({ code, message, data }) => {
              if (code == 0) {
                if (data != null) {
                  _this.$message({
                    message: _this.$t('wfinsinfo.msgsavesuccess'),
                    type: 'success',
                    duration: 6000,
                  });
                  _this.$refs['commentForm'].resetFields(); // 重置表单
                  _this.commentInfo = data;
                } else {
                  _this.$message({
                    duration: 6000,
                    message: _this.$t('wfinsinfo.msgsavefail'),
                    type: 'error',
                  });
                }
              } else {
                _this.$message({
                  duration: 6000,
                  message: message ? message : _this.$t('wfinsinfo.msgsaveerror'),
                  type: 'error',
                });
              }
            });
        } else {
          _this.$message({
            duration: 6000,
            message: _this.$t('wfinsinfo.msginputillegal'),
            type: 'warning',
          });
        }
      });
    },
    signIn: function () {
      // 签收
      var _this = this;
      _this.instanceIdInfo.userId = _this.currentUserId;
      _this
        .$request({
          method: 'POST',
          data: _this.instanceIdInfo,
          url: _this.urls.signIn,
          callback: function (code, message, response) {},
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            _this.$message({
              duration: 6000,
              message: data.tip,
              type: 'success',
            });
            _this.$router.replace({ name: _this.returnBackFuncId });
          } else {
            _this.$message({
              duration: 6000,
              message: message ? message : _this.$t('wfinsinfo.msgqserror'),
              type: 'error',
            });
          }
        });
    },
    unSignIn: function () {
      var _this = this;
      _this.instanceIdInfo.userId = _this.currentUserId;
      _this
        .$request({
          method: 'POST',
          data: _this.instanceIdInfo,
          url: _this.urls.unSignIn,
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            // 跳转到之前的页面
            _this.$message(data.tip);
            _this.$router.replace({ name: _this.returnBackFuncId });
          } else {
            _this.$message({
              duration: 6000,
              message: message ? message : _this.$t('wfinsinfo.msgcxqserror'),
              type: 'error',
            });
          }
        });
    },
    refuse: function () {
      // 否决
      var _this = this;
      _this.$refs.commentForm.validate(function (valid) {
        if (valid) {
          _this
            .$confirm(_this.$t('wfinsinfo.msgsurerf'), _this.$t('wfinsinfo.tip'), {
              confirmButtonText: _this.$t('wfbutton.sure'),
              cancelButtonText: _this.$t('wfbutton.cancel'),
              type: 'warning',
              center: true,
            })
            .then(function () {
              var param = {};
              param.orgId = _this.currentOrgId;
              _this.commentInfo.commentSign = 'O-8';
              param.comment = _this.commentInfo;
              _this
                .$request({
                  method: 'POST',
                  data: param,
                  url: _this.urls.refuse,
                })
                .then(({ code, message, data }) => {
                  if (code == 0) {
                    // 跳转到之前的页面
                    _this.$message(data.tip + ';');
                    _this.$router.replace({ name: _this.returnBackFuncId });
                  } else {
                    _this.$message({
                      duration: 6000,
                      message: message ? message : _this.$t('wfinsinfo.msgrferror'),
                      type: 'error',
                    });
                  }
                });
            })
            .catch(function () {
              _this.$message({
                duration: 6000,
                type: 'info',
                message: _this.$t('wfinsinfo.msgcancel'),
              });
            });
        } else {
          _this.$message({
            duration: 6000,
            message: _this.$t('wfinsinfo.msginputillegal'),
            type: 'warning',
          });
        }
      });
    },
    // 作废
    cancelFn: function () {
      var _this = this;
      _this.$refs.commentForm.validate(function (valid) {
        if (valid) {
          _this
            .$confirm(_this.$t('wfinsinfo.msgsurezf'), _this.$t('wfinsinfo.tip'), {
              confirmButtonText: _this.$t('wfbutton.sure'),
              cancelButtonText: _this.$t('wfbutton.cancel'),
              type: 'warning',
              center: true,
            })
            .then(function () {
              var param = {};
              param.orgId = _this.currentOrgId;
              _this.commentInfo.commentSign = 'O-17';
              param.comment = _this.commentInfo;
              _this
                .$request({
                  method: 'POST',
                  data: param,
                  url: _this.urls.cancel,
                })
                .then(({ code, message, data }) => {
                  if (code === '0' && data.code === '0') {
                    // 跳转到之前的页面
                    _this.$message(data.tip + ';');
                    _this.$router.replace({ name: _this.returnBackFuncId });
                  } else {
                    _this.$message({ message: message ? message : _this.$t('wfinsinfo.msgzferror'), type: 'error' });
                  }
                });
            })
            .catch(function () {
              _this.$message({ type: 'info', message: _this.$t('wfinsinfo.msgcancel') });
            });
        } else {
          _this.$message({ message: _this.$t('wfinsinfo.msginputillegal'), type: 'warning' });
        }
      });
    },
    changeFn: function (userId) {
      // 转办
      var _this = this;
      var param = {};
      param.orgId = _this.currentOrgId;
      _this.commentInfo.commentSign = 'O-6';
      if (_this.commentInfo.userComment == '') {
        _this.commentInfo.userComment = _this.$t('wfinsinfo.butchange');
      }
      param.comment = _this.commentInfo;
      param.changeUserId = userId;
      _this
        .$request({
          method: 'POST',
          data: param,
          url: _this.urls.change,
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            // 跳转到之前的页面
            _this.$message(data.tip + ';');
            _this.$router.replace({ name: _this.returnBackFuncId });
          } else {
            _this.$message({ message: message ? message : _this.$t('wfinsinfo.msgzberror'), type: 'error' });
          }
        });
    },
    getAddSignUser: function () {
      // 获取转办可选的办理人员
      var _this = this;
      var param = {
        orgId: _this.currentOrgId,
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        userId: _this.currentUserId,
      };
      this.$request({
        method: 'POST',
        data: param,
        url: backend.workflowService + '/api/core/getAddSignUsers',
      }).then(({ code, message, data }) => {
        if (code == 0) {
          if (data != null) {
            // 跳转到之前的页面
            _this.UserSelect.Users = data;
            _this.UserSelect.showUserDialog = true;
          } else {
            _this.$message({
              duration: 6000,
              message: _this.$t('wfinsinfo.msggetnojqu'),
              type: 'warning',
            });
          }
        } else {
          _this.$message({ message: message ? message : _this.$t('wfinsinfo.msggetjquerror'), type: 'error' });
        }
      });
    },
    getChangeUser: function () {
      // 获取转办可选的办理人员
      var _this = this;
      var param = {
        orgId: _this.currentOrgId,
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        userId: _this.currentUserId,
      };
      this.$request({
        method: 'POST',
        data: param,
        url: _this.urls.getchangeUser,
      }).then(({ code, message, data }) => {
        if (code == 0) {
          if (data != null) {
            // 跳转到之前的页面
            _this.UserSelect.Users = data;
            _this.UserSelect.showUserDialog = true;
          } else {
            _this.$message({
              duration: 6000,
              message: _this.$t('wfinsinfo.msggetnozbu'),
              type: 'warning',
            });
          }
        } else {
          _this.$message({ message: message ? message : _this.$t('wfinsinfo.msggetzbuerror'), type: 'error' });
        }
      });
    },
    assistFn: function (userId) {
      // 协办
      var _this = this;
      var param = {};
      param.orgId = _this.currentOrgId;
      _this.commentInfo.commentSign = 'O-7';
      if (_this.commentInfo.userComment == '') {
        _this.commentInfo.userComment = _this.$t('wfinsinfo.butxieban');
      }
      param.comment = _this.commentInfo;
      param.assistUserId = userId;
      _this
        .$request({
          method: 'POST',
          data: param,
          url: _this.urls.assist,
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            // 跳转到之前的页面
            _this.$message(data.tip + ';');
            _this.$router.replace({ name: _this.returnBackFuncId });
          } else {
            _this.$message({ message: message ? message : _this.$t('wfinsinfo.msgxberror'), type: 'error' });
          }
        });
    },
    getAssistUser: function () {
      // 获取协办可选的办理人员
      var _this = this;
      var param = {
        orgId: _this.currentOrgId,
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        userId: _this.currentUserId,
      };
      _this
        .$request({
          method: 'POST',
          data: param,
          url: _this.urls.getassistUser,
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            if (data != null) {
              // 跳转到之前的页面
              _this.UserSelect.Users = data;
              _this.UserSelect.showUserDialog = true;
            } else {
              _this.$message({
                duration: 6000,
                message: _this.$t('wfinsinfo.msggetnoau'),
                type: 'warning',
              });
            }
          } else {
            _this.$message({ message: message ? message : _this.$t('wfinsinfo.msggetauerror'), type: 'error' });
          }
        });
    },
    agreeFn: function () {
      // 节点提交
      // 遍历选中节点
      var nodes = [];
      if (this.agreeRadio != '' && this.agreeShowRadio) {
        nodes.push(this.agreeRadio);
      }

      if (this.agreeCheckBox.length > 0 && !this.agreeShowRadio) {
        for (var i = 0; i < this.agreeCheckBox.length; i++) {
          nodes.push(this.agreeCheckBox[i]);
        }
      }
      // 处理选中的下一节点相关信息
      var nodeInfos = [];
      for (var i = 0; i < nodes.length; i++) {
        for (var j = 0; j < this.agreeNextNodes.length; j++) {
          if (this.agreeNextNodes[j].nodeId == nodes[i]) {
            var nodeInfo = {};
            nodeInfo.nextNodeId = nodes[i];
            var nextUser = [];
            var nextCopyUser = [];
            if (this.agreeNextNodes[j].userInfos != null && this.agreeNextNodes[j].userInfos != undefined) {
              for (var k = 0; k < this.agreeNextNodes[j].userInfos.length; k++) {
                // 去重
                nextUser.push(this.agreeNextNodes[j].userInfos[k].userId);
              }
            }
            if (this.agreeNextNodes[j].copyUserInfos != null && this.agreeNextNodes[j].copyUserInfos != undefined) {
              for (var l = 0; l < this.agreeNextNodes[j].copyUserInfos.length; l++) {
                // 去重
                nextCopyUser.push(this.agreeNextNodes[j].copyUserInfos[l].userId);
              }
            }
            nodeInfo.nextNodeUserIds = nextUser;
            nodeInfo.nextNodeCopyUserIds = nextCopyUser;
            nodeInfos.push(nodeInfo);
          }
        }
      }
      // 校验节点选择的处理人
      var _this = this;
      if (nodeInfos.length == 0) {
        _this.$message({ duration: 6000, message: _this.$t('wfinsinfo.msgselectnn'), type: 'warning' });
        return;
      } else {
        for (var i = 0; i < nodeInfos.length; i++) {
          if (nodeInfos[i].nextNodeUserIds.length == 0) {
            _this.$message({ duration: 6000, message: _this.$t('wfinsinfo.msgselectnu'), type: 'warning' });
            return;
          }
        }
      }
      var param = {};
      if (_this.agreeIsLastRadio == 'Y') {
        // 是否直接提交， 一般【办理类型】是[多人顺序可结束]或[多人并行可结束]时生效，可以选择true和false;
        param.lastOne = true;
      }
      param.orgId = _this.currentOrgId;
      param.nextNodeInfos = nodeInfos;
      // 流程评论提交
      if (_this.commentInfo.userComment == '') {
        _this.commentInfo.userComment = _this.$t('wfinsinfo.butagree');
        _this.commentInfo.commentSign = 'O-12';
      }
      param.comment = _this.commentInfo;
      var paramWF = {};
      for (var i = 0; i < _this.flowParam.length; i++) {
        // 流程参数提交
        paramWF[_this.flowParam[i].key] = _this.flowParam[i].value;
      }
      param.param = _this.bizParams;
      // param.param.nextNodeId = nodes;
      _this
        .$request({
          method: 'POST',
          data: param,
          url: _this.urls.submit,
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            // 跳转到之前的页面
            for (var i = 0; i < data.length; i++) {
              if (data[i].code === 'E') {
                // 正常结束
                _this.$message(data[i].tip);
              } else {
                _this.$message({ message: data[i].tip + ';' + data[i].nodeName + '@' + data[i].userNames, type: 'success' });
              }
            }
            _this.$router.replace({ name: _this.returnBackFuncId });
            _this.agreeDialogClose();
          } else {
            _this.$message({ message: message ? message : _this.$t('wfinsinfo.msgtjerror'), type: 'error' });
          }
        });
    },
    agreeDialogOpen: function () {
      // 提交窗口打开事件
      var _this = this;
      var param = {
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        userId: _this.currentUserId,
        param: {},
      };
      _this
        .$request({
          method: 'POST',
          data: param,
          url: _this.agreeNodeSelect.nodeUrl,
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            // 跳转到之前的页面
            if (data != null && data.length > 0) {
              _this.agreeNextNodes = data;
              var data = data;
              if (_this.instanceIdInfo.nodeType == '0' || _this.instanceIdInfo.nodeType == '1' || _this.instanceIdInfo.nodeType == '3') {
                _this.agreeShowRadio = true;
              } else {
                // 非单选节点
                _this.agreeShowRadio = false;
              }
              _this.agreeUserCheck(data);
            } else {
              _this.$message({
                duration: 6000,
                message: _this.$t('wfinsinfo.msggetnonn'),
                type: 'warning',
              });
            }
          } else {
            _this.$message({ message: message ? message : _this.$t('wfinsinfo.msggetnnerror'), type: 'error' });
          }
        });
    },
    agreeUserCheck: function (data) {
      // 判断节点是否是系统指定,并对其进行处理
      var _this = this;
      for (var i = 0; i < data.length; i++) {
        var users = data[i].users;
        if (_this.agreeNextNodes[i].isSysUser == undefined) {
          _this.$set(_this.agreeNextNodes[i], 'isSysUser', '');
        }
        if (_this.agreeNextNodes[i].selected == undefined) {
          _this.$set(_this.agreeNextNodes[i], 'selected', '');
        }
        if (_this.agreeNextNodes[i].userInfos == undefined) {
          _this.$set(_this.agreeNextNodes[i], 'userInfos', []);
        }
        // _this.copyUserCheck()

        for (var j = 0; j < users.length; j++) {
          var user = {
            userId: users[j].userId,
            userName: users[j].userName,
          };
          if (users[j].userId === 'system_user') {
            // 系统指定
            _this.agreeNextNodes[i].isSysUser = true;
            _this.agreeNextNodes[i].selected = false;
            _this.agreeNextNodes[i].userInfos.push(user);
          } else if (users.length === 1) {
            // 只有一个用户
            _this.agreeNextNodes[i].isSysUser = false;
            _this.agreeNextNodes[i].selected = true;
            _this.agreeNextNodes[i].userInfos.push(user);
          }
        }
        _this.agreeNodeSelect.showDialog = true;
        if (data.length === 1) {
          // 只有一个节点
          if (_this.agreeShowRadio) {
            _this.agreeRadio = data[i].nodeId;
            _this.agreeRadioChange(data[i].nodeId);
          } else {
            _this.agreeCheckBox.push(data[i].nodeId);
          }
        }
      }
      if (!_this.agreeShowRadio) {
        _this.agreeRadioChange(_this.agreeCheckBox);
      }
    },
    agreeRadioChange: function (val) {
      // 节点选择变化事件
      var _this = this;
      var nodeIds = [];
      var checked = false;
      if (_this.agreeShowRadio) {
        nodeIds.push(val);
      } else {
        if (!val) {
          _this.agreeCheckBox = [];
        }
        nodeIds = _this.agreeCheckBox;
      }
      // 未被选择的节点处理
      for (var i = 0; i < _this.agreeNextNodes.length; i++) {
        checked = false;
        for (var k = 0; k < nodeIds.length; k++) {
          if (nodeIds[k] === _this.agreeNextNodes[i].nodeId) {
            checked = true;
            _this.agreeNextNodes[i].selected = true;
            _this.agreeIndex = i;
            _this.agreeUserClose();
          }
        }
        if (!checked) {
          _this.agreeNextNodes[i].userSelected = '';
          _this.agreeNextNodes[i].selected = false;
        }
      }
      // 对选择的数据项进行处理
      // for (var k = 0; k < nodeIds.length; k++) {
      //   var nodeId = nodeIds[k];
      //   for (var i = 0; i < _this.agreeNextNodes.length; i++) {
      //     if (nodeId == _this.agreeNextNodes[i].nodeId) {
      //       _this.agreeNextNodes[i].selected = true;
      //       if (_this.agreeNextNodes[i].userInfos == undefined) {
      //         _this.$set(_this.agreeNextNodes[i], "userInfos", []);
      //       }
      //       var userInfosT = _this.agreeNextNodes[i].userInfos;
      //       var userName = "";
      //       for (var j = 0; j < userInfosT.length; j++) {
      //         userName = userName + userInfosT[j].userName + ";";
      //       }
      //       _this.agreeNextNodes[i].userSelected = userName;
      //     }
      //   }
      // }
    },
    agreeSelectNodeUser: function (node, index) {
      // 选择按钮
      this.agreeIndex = index;
      this.agreeUserDialogOpen(node.nodeId);
    },
    agreeUserDialogOpen: function (nodeId) {
      // 选择节点办理人员窗口打开事件处理
      var _this = this;
      var nodeInfo = {};
      nodeInfo.instanceId = _this.instanceIdInfo.instanceId;
      nodeInfo.nodeId = nodeId;
      nodeInfo.orgId = _this.currentOrgId;
      // var param = {
      //   condition: JSON.stringify(nodeInfo),
      // };
      _this
        .$request({
          method: 'POST',
          data: nodeInfo,
          url: _this.agreeNodeSelect.userUrl,
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            if (data != null) {
              _this.agreeNodeSelect.userTableData = data;
              _this.agreeNodeSelect.showUserDialog = true;
            } else {
              _this.$message({
                duration: 6000,
                message: _this.$t('wfinsinfo.msggetnonu'),
                type: 'warning',
              });
            }
          } else {
            _this.$message({ message: message ? message : _this.$t('wfinsinfo.msggetnuerror'), type: 'error' });
          }
        });
    },
    agreeRowDbClick: function (row, event) {
      // tag双击事件
      var user = {};
      user.userId = row.userId;
      user.userName = row.userName;
      if (this.agreeNextNodes[this.agreeIndex].userInfos == undefined) {
        this.$set(this.agreeNextNodes[this.agreeIndex], 'userInfos', []);
      }
      var userInfosT = this.agreeNextNodes[this.agreeIndex].userInfos;
      for (var i = 0; i < userInfosT.length; i++) {
        // 去重
        if (userInfosT[i].userId == user.userId) {
          return;
        }
      }
      userInfosT.push(user);
    },
    agreeTagClose: function (tag) {
      // tag关闭事件
      if (this.agreeNextNodes[this.agreeIndex].userInfos == undefined) {
        this.$set(this.agreeNextNodes[this.agreeIndex], 'userInfos', []);
      }
      var userInfosT = this.agreeNextNodes[this.agreeIndex].userInfos;
      userInfosT.splice(userInfosT.indexOf(tag), 1);
    },
    agreeUserClose: function () {
      // 选取返回
      this.agreeNodeSelect.showUserDialog = false;
      var userName = '';
      if (this.agreeNextNodes[this.agreeIndex].userInfos === undefined) {
        this.$set(this.agreeNextNodes[this.agreeIndex], 'userInfos', []);
      }
      var userInfosT = this.agreeNextNodes[this.agreeIndex].userInfos;
      for (var i = 0; i < userInfosT.length; i++) {
        userName = userName + userInfosT[i].userName + ';';
      }
      this.agreeNextNodes[this.agreeIndex].userSelected = userName;
    },
    agreeDialogClose: function () {
      // 提交窗口关闭事件
      this.agreeRadio = '';
      this.agreeCheckBox = [];
      this.agreeIsLastRadio = 'N';
      this.agreeNodeSelect.showDialog = false;
    },
    returnBackFn: function () {
      // 退回操作
      var _this = this;
      var param = {};
      _this.$refs.commentForm.validate(function (vaild) {
        // 校验规则
        if (vaild) {
          param.orgId = _this.currentOrgId;
          _this.commentInfo.commentSign = 'O-2';
          if (_this.commentInfo.userComment == '') {
            _this.commentInfo.userComment = _this.$t('wfinsinfo.buttuihui');
          }
          param.comment = _this.commentInfo;
          _this
            .$confirm(_this.$t('wfinsinfo.msgsurerb'), _this.$t('wfinsinfo.tip'), {
              confirmButtonText: _this.$t('wfbutton.sure'),
              cancelButtonText: _this.$t('wfbutton.cancel'),
              type: 'warning',
            })
            .then(function () {
              _this
                .$request({
                  method: 'POST',
                  data: param,
                  url: _this.urls.returnBack,
                })
                .then(({ code, message, data }) => {
                  if (code == 0) {
                    // 跳转到之前的页面
                    _this.$message(data.tip + ';' + data.nodeName + '@' + data.userNames);
                    _this.$router.replace({ name: _this.returnBackFuncId });
                  } else {
                    _this.$message({ message: message ? message : _this.$t('wfinsinfo.msgrberror'), type: 'error' });
                  }
                });
            })
            .catch(function () {
              _this.$message({
                duration: 6000,
                type: 'info',
                message: _this.$t('wfinsinfo.msgcancel'),
              });
            });
        } else {
          _this.$message({
            duration: 6000,
            message: _this.$t('wfinsinfo.msginputillegal'),
            type: 'warning',
          });
        }
      });
    },
    callBackFn: function () {
      // 打回操作
      var _this = this;
      _this.$refs.commentForm.validate(function (vaild) {
        // 校验规则
        if (vaild) {
          _this.backNodeModel = '';
          _this.callbackNodeSelect.showDialog = true;
        } else {
          _this.$message({
            duration: 6000,
            message: _this.$t('wfinsinfo.msginputillegal'),
            type: 'warning',
          });
        }
      });
    },
    backDialogOpen: function () {
      // 获取可打回节点的信息
      var _this = this;
      var param = {
        orgId: _this.instanceIdInfo.orgId,
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        userId: _this.currentUserId,
      };
      _this
        .$request({
          method: 'POST',
          data: param,
          url: _this.callbackNodeSelect.nodeUrl,
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            if (data != null) {
              var nodes = data;
              for (var i = 0; i < nodes.length; i++) {
                var node = {
                  nodeId: nodes[i].nodeId,
                  nodeName: nodes[i].nodeName,
                  selected: false,
                  usersList: [],
                };
                var users = nodes[i].users;
                if (users.length != 0) {
                  for (var k = 0; k < users.length; k++) {
                    var user = {
                      userId: users[k].userId,
                      userName: users[k].userName,
                    };
                    node.usersList.push(user);
                  }
                }
                _this.backNodes.push(node);
              }
            } else {
              _this.$message({
                duration: 6000,
                message: _this.$t('wfinsinfo.msggetnocbn'),
                type: 'warning',
              });
            }
          } else {
            _this.$message({ message: message ? message : _this.$t('wfinsinfo.msggetcbnerror'), type: 'error' });
          }
        });
    },
    radioChange: function (val) {
      // 打回节点选择
      this.userModel = [];
      for (var i = 0; i < this.backNodes.length; i++) {
        var id = this.backNodes[i].nodeId;
        this.backNodes[i].selected = false;
        if (id == val) {
          this.backNodes[i].selected = true;
        }
      }
    },
    wfCallBackClose: function () {
      // 打回界面关闭
      var _this = this;
      _this.backActiveName = 'first';
      _this.backnode = 1;
      _this.backNodes = [];
      _this.userModel = [];
      // _this.usersList = [];
      _this.callbackNodeSelect.showDialog = false;
    },
    wfCallBack: function () {
      // 打回接口调用
      var _this = this;
      if (!_this.backNodeModel) {
        _this.$message({
          duration: 6000,
          message: _this.$t('wfinsinfo.msgselectcbn'),
          type: 'error',
        });
        return false;
      }
      if (!_this.userModel || _this.userModel.length === 0) {
        _this.$message({
          duration: 6000,
          message: _this.$t('wfinsinfo.msgselectcbnu'),
          type: 'error',
        });
        return false;
      }
      var callbackUserIds = '';
      for (var id in _this.userModel) {
        callbackUserIds = callbackUserIds + _this.userModel[id] + ';';
      }
      _this.callbackNodeSelect.showDialog = false;
      var param = {
        callbackNodeId: _this.backNodeModel,
        callbackUserId: callbackUserIds,
        callbackModel: _this.backnode + '', // 打回模式 【 0-打回后提交直接给我，1-打回后提交沿流程路径（默认）】
        orgId: _this.currentOrgId,
      };
      _this.commentInfo.commentSign = 'O-1';
      if (_this.commentInfo.userComment == '') {
        _this.commentInfo.userComment = _this.$t('wfinsinfo.butdahui');
      }
      param.comment = _this.commentInfo;
      // 打回接口调用
      _this
        .$request({
          method: 'POST',
          data: param,
          url: _this.urls.callBack,
        })
        .then(({ code, message, data }) => {
          if (code === '0' && data.code === '0') {
            // 跳转到之前的页面
            _this.$message({
              message: data.tip,
              type: 'success',
            });
            _this.$router.replace({ name: _this.returnBackFuncId });
          } else {
            _this.$message({ message: message ? message : _this.$t('wfinsinfo.msgcberror'), type: 'error' });
          }
        });
      _this.wfCallBackClose();
    },
    // 跳转
    JumpDialogOpen: function () {
      // 获取可跳转节点
      var _this = this;
      var param = {
        orgId: _this.instanceIdInfo.orgId,
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        userId: _this.currentUserId,
      };
      _this
        .$request({
          method: 'POST',
          data: param,
          url: _this.jumpNodeSelect.nodeUrl,
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            if (data != null) {
              // 跳转到之前的页面
              var nodes = data;
              for (var i = 0; i < nodes.length; i++) {
                var n = {
                  nodeId: nodes[i].nodeId,
                  nodeName: nodes[i].nodeName,
                  selected: false,
                  selectUser: [],
                  usersList: nodes[i].users,
                };
                _this.jumpNodes.push(n);
              }
            } else {
              _this.$message({
                duration: 6000,
                message: _this.$t('wfinsinfo.msgnojn'),
                type: 'warning',
              });
            }
          } else {
            _this.$message({ message: message ? message : _this.$t('wfinsinfo.msggetjnerror'), type: 'error' });
          }
        });
    },
    jumpSelectUser: function (node, index) {
      // 获取选择的节点的人员
      var _this = this;
      _this.index = index;
      if (node.usersList.length == 1) {
        _this.$nextTick(function () {
          _this.jumpNodes[index].selectUser = node.usersList[0];
        });
      } else {
        _this.UserSelect.Users = node.usersList;
        _this.UserSelect.showUserDialog = true;
      }
    },
    jumpradioChange: function (val) {
      // 跳转节点选择
      for (var i = 0; i < this.jumpNodes.length; i++) {
        this.jumpNodes[i].selected = false;
        var id = this.jumpNodes[i].nodeId;
        if (id == val) {
          this.jumpNodes[i].selected = true;
        }
        this.jumpNodes[i].selectUser = [];
      }
      this.UserSelect.SelectUsers = [];
    },
    jumpFn: function () {
      // 跳转接口调用
      var _this = this;
      if (!_this.jumpNodes[_this.index].selectUser.userId) {
        _this.$message({ message: _this.$t('wfinsinfo.msgselectjnu'), type: 'warning' });
        return;
      }
      var param = {
        jumpNodeId: _this.jumpNodeModel,
        jumpUserId: _this.jumpNodes[_this.index].selectUser.userId,
        orgId: _this.instanceIdInfo.orgId,
      };
      _this.commentInfo.commentSign = 'O-9';
      if (_this.commentInfo.userComment == '') {
        _this.commentInfo.userComment = _this.$t('wfinsinfo.butjump');
      }
      param.comment = _this.commentInfo;
      _this
        .$request({
          method: 'POST',
          data: param,
          url: _this.urls.jump,
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            // 跳转到之前的页面
            _this.$message({
              duration: 6000,
              message: data.tip + ';',
              type: 'success',
            });
            _this.$router.replace({ name: _this.returnBackFuncId });
          } else {
            _this.$message({ message: message ? message : _this.$t('wfinsinfo.msgzferror'), type: 'error' });
          }
        });
      _this.jumpClose();
    },
    jumpClose: function () {
      // 跳转窗口 关闭
      this.jumpNodes = [];
      this.jumpNodeModel = '';
      this.jumpNodeSelect.showDialog = false;
    },

    // 人员选择弹框
    submitbefore: function () {
      // 弹框前处理
      this.UserSelect.Users = [];
      this.UserSelect.SelectUsers = [];
    },
    RowDbClick: function (row, event) {
      // 列表双击事件
      var user = {
        userId: row.userId,
        userName: row.userName,
      };
      if (this.UserSelect.SelectUsers == undefined) {
        this.$set(this.UserSelect, 'SelectUsers', []);
      }
      var userInfosT = this.UserSelect.SelectUsers;
      for (var i = 0; i < userInfosT.length; i++) {
        // 去重
        if (userInfosT[i].userId == row.userId) {
          return;
        }
      }
      userInfosT.push(user);
    },
    TagClose: function (tag) {
      // tag页签关闭事件
      if (this.UserSelect.SelectUsers == undefined) {
        this.$set(this.UserSelect, 'SelectUsers', []);
      }
      var userInfosT = this.UserSelect.SelectUsers;
      userInfosT.splice(userInfosT.indexOf(tag), 1);
    },
    UserDialogClose: function () {
      // 弹框关闭
      this.UserSelect.showUserDialog = false;

      if (this.UserSelect.SelectUsers == undefined) {
        this.$set(this.UserSelect, 'SelectUsers', []);
      }
      var userInfosT = this.UserSelect.SelectUsers;
      if (this.title == 'jump' || this.title == 'assist' || this.title == 'change') {
        if (userInfosT.length > 1) {
          this.$message({
            message: this.$t('wfinsinfo.msgonlyoneuser'),
            type: 'warning',
            duration: 6000,
          });
          return false;
        }
      }
      var userName = userInfosT[0].userName;
      var userId = userInfosT[0].userId;
      if (this.title == 'jump') {
        this.jumpNodes[this.index].selectUser.userName = userName;
        this.jumpNodes[this.index].selectUser.userId = userId;
      } else if (this.title == 'assist') {
        this.assistFn(userId);
      } else if (this.title == 'change') {
        this.changeFn(userId);
      } else if (this.title == 'buqian') {
        this.buqian(userId);
      } else if (this.title == 'jiaqian') {
        if (userId === this.currentUserId) {
          this.$message({ message: '不能选择当前登录用户！', type: 'warning' });
          return;
        }
        this.jiaqian(userId);
      } else if (this.title == 'copy') {
        userName = '';
        for (var i = 0; i < userInfosT.length; i++) {
          userName = userName + userInfosT[i].userName + ';';
        }
        this.agreeNextNodes[this.agreeIndex].copyUser = userName;
        this.agreeNextNodes[this.agreeIndex].copyUserInfos = userInfosT;
      }
    },
    // buqian: function (userId) {
    //   var _this = this;
    //   var param = {};
    //   param.orgId = _this.currentOrgId;
    //   _this.commentInfo.commentSign = "O-26";
    //   if (_this.commentInfo.userComment == "") {
    //     _this.commentInfo.userComment = "补签";
    //   }
    //   param.comment = _this.commentInfo;
    //   param.changeUserId = userId;
    //   _this.$request({
    //     method: "POST",
    //     data: param,
    //     url: backend.workflowService + '/api/core/ReplenishSign'
    //   }).then(({code, message, data}) => {
    //     if (code == 0) {
    //       // 跳转到之前的页面
    //       _this.$message(data.tip + ";");
    //       _this.$router.replace({ name: _this.returnBackFuncId });
    //     } else {
    //       _this.$message({message: message ? message : _this.$t('wfinsinfo.msgzferror'), type: "error"});
    //     }
    //   })
    // },
    jiaqian: function (userId) {
      var _this = this;
      var param = {};
      param.orgId = _this.currentOrgId;
      _this.commentInfo.commentSign = 'O-27';
      if (_this.commentInfo.userComment == '') {
        _this.commentInfo.userComment = '加签';
      }
      param.comment = _this.commentInfo;
      param.assistUserId = userId;
      _this
        .$request({
          method: 'POST',
          data: param,
          url: backend.workflowService + '/api/core/addSign',
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            // 跳转到之前的页面
            _this.$message(data.tip + ';');
            _this.$router.replace({ name: _this.returnBackFuncId });
          } else {
            _this.$message({
              duration: 6000,
              message: message ? message : _this.$t('wfinsinfo.msgjqerror'),
              type: 'error',
            });
          }
        });
    },
    // wfGatherFn: function () {
    //   // 会办功能实现
    //   var _this = this;
    //   var param = {
    //     instanceId: _this.instanceIdInfo.instanceId,
    //     userId: _this.currentUserId,
    //     nodeId: _this.instanceIdInfo.nodeId,
    //   };
    //   this.$confirm(_this.$t('wfinsinfo.msgsurehuiban'), _this.$t('wfinsinfo.tip'), {
    //     confirmButtonText: _this.$t('wfbutton.sure'),
    //     cancelButtonText: _this.$t('wfbutton.cancel'),
    //     type: "warning",
    //     center: true,
    //   }).then(function () {
    //     _this.$request({
    //       method: "GET",
    //       data: param,
    //       url: backend.workflowService + "/api/metting/start"
    //     }).then(({code, message, data}) => {
    //       if (data == true) {
    //         _this.$message({
    //           duration: 6000,
    //           message: _this.$t('wfinsinfo.msghuibanok'),
    //           type: "success",
    //         });
    //       } else {
    //         _this.$message({
    //           duration: 6000,
    //           message: _this.$t('wfinsinfo.msghavehuiban'),
    //           type: "warning",
    //         });
    //       }
    //       _this.$router.replace({ name: _this.returnBackFuncId });
    //     })
    //   }).catch(function () {
    //     _this.$message({ duration: 6000, type: "info", message: _this.$t('wfinsinfo.msgcancel') });
    //   });
    // },
    wfGatherFn: function () {
      // 会办功能实现
      var _this = this;
      this.$confirm(_this.$t('wfinsinfo.msgsurehuiban'), _this.$t('wfinsinfo.tip'), {
        confirmButtonText: _this.$t('wfbutton.sure'),
        cancelButtonText: _this.$t('wfbutton.cancel'),
        type: 'warning',
        center: true,
      })
        .then(function () {
          _this.gatherStartFn();
        })
        .catch(function () {
          _this.$message({ duration: 6000, type: 'info', message: _this.$t('wfinsinfo.msgcancel') });
        });
    },
    gatherStartFn: function () {
      var _this = this;
      var param = {
        instanceId: _this.instanceIdInfo.instanceId,
        userId: _this.currentUserId,
        nodeId: _this.instanceIdInfo.nodeId,
        orgId: _this.currentOrgId,
        orgName: _this.currentOrgName,
      };
      _this
        .$request({
          method: 'POST',
          data: param,
          url: backend.workflowService + '/api/metting/start',
        })
        .then((response) => {
          if (response.data !== null) {
            _this.$message({
              duration: 6000,
              message: _this.$t('wfinsinfo.msghuibanok'),
              type: 'success',
            });
            _this.$nextTick(function () {
              try {
                _this.meetPageShow = true;
                _this.tabValue = 'meetstart';
                _this.meetData = response.data;
                _this.meetPage = function () {
                  return Promise.resolve(require('@/views/workflow/instance/metting/meetstart.vue').default);
                };
                _this.meetData.instanceInfo = _this.instanceIdInfo;
                _this.gatherPageData = _this.meetData;
              } catch (e) {}
            });
          } else {
            _this.$message({ message: _this.$t('wfinsinfo.msghavehuiban'), type: 'warning' });
          }
        });
    },
    Select: function () {
      this.agreeNodeSelect.showUserDialog = true;
    },
    currpageChange: function (val) {
      this.currpage = val;
    },
    pagesizeChange: function (val) {
      this.pagesize = val;
    },
    unSignInTaskPool: function () {
      // 放回项目池
      var _this = this;
      var param = {
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        userId: _this.userCode,
        poolId: _this.button.taskPoolId,
      };
      _this
        .$confirm(_this.$t('wfinsinfo.msgsurefhxmc'), _this.$t('wfinsinfo.tip'), {
          confirmButtonText: _this.$t('wfbutton.sure'),
          cancelButtonText: _this.$t('wfbutton.cancel'),
          type: 'warning',
          center: true,
        })
        .then(function () {
          _this
            .$request({
              method: 'POST',
              data: param,
              url: _this.urls.unSignInTaskPool,
            })
            .then(({ code, message, data }) => {
              if (code == 0) {
                _this.$message({
                  duration: 6000,
                  message: data.tip,
                  type: 'success',
                });
              } else {
                _this.$message({
                  duration: 6000,
                  message: message ? message : _this.$t('wfinsinfo.msgfhxmcyc'),
                  type: 'warning',
                });
              }
              _this.$router.replace({ name: _this.returnBackFuncId });
            });
        })
        .catch(function () {
          _this.$message({ duration: 6000, type: 'info', message: _this.$t('wfinsinfo.msgcancel') });
        });
    },
    subFlowStart: function () {
      // 发起子流程功能
      var _this = this;
      _this.$refs.commentForm.validate(function (vaild) {
        // 校验规则
        if (vaild) {
          _this
            .$confirm(_this.$t('wfinsinfo.msgsuresub'), _this.$t('wfinsinfo.tip'), {
              confirmButtonText: _this.$t('wfbutton.sure'),
              cancelButtonText: _this.$t('wfbutton.cancel'),
              type: 'warning',
            })
            .then(function () {
              var param = {};
              param.orgId = _this.currentOrgId;
              param.systemId = 'cmis';
              param.bizType = _this.button.subFlowId;
              _this.commentInfo.commentSign = '';
              if (_this.commentInfo.userComment == '') {
                _this.commentInfo.userComment = _this.$t('wfinsinfo.msgsubflow');
              }
              param.comment = _this.commentInfo;
              _this
                .$request({
                  method: 'POST',
                  data: param,
                  url: _this.urls.subFlowStart,
                })
                .then(({ code, message, data }) => {
                  if (code == 0) {
                    // 跳转到之前的页面
                    _this.$message(data.tip + ';');
                    _this.$router.replace({ name: _this.returnBackFuncId });
                  } else {
                    _this.$message({
                      duration: 6000,
                      message: message ? message : _this.$t('wfinsinfo.msgsubflowerror'),
                      type: 'error',
                    });
                  }
                });
            })
            .catch(function () {
              this.$message({
                duration: 6000,
                type: 'info',
                message: _this.$t('wfinsinfo.msgcancel'),
              });
            });
        } else {
          _this.$message({
            duration: 6000,
            message: _this.$t('wfinsinfo.msginputillegal'),
            type: 'warning',
          });
        }
      });
    },
    agreeSelectCopyUser: function (node, index) {
      var _this = this;
      _this.agreeIndex = index;
      if (_this.agreeNextNodes[_this.agreeIndex].copyUserInfos == undefined) {
        _this.$set(_this.agreeNextNodes[_this.agreeIndex], 'copyUserInfos', []);
      }
      if (_this.agreeNextNodes[_this.agreeIndex].copyUser == undefined) {
        _this.$set(_this.agreeNextNodes[_this.agreeIndex], 'copyUser', '');
      }
      var param = {
        orgId: _this.currentOrgId,
        instanceId: _this.instanceIdInfo.instanceId,
        nodeId: _this.instanceIdInfo.nodeId,
        copyNodeId: node.nodeId,
      };
      _this
        .$request({
          method: 'POST',
          data: param,
          url: _this.urls.getCopyUser,
        })
        .then(({ code, message, data }) => {
          if (code == 0) {
            // 跳转到之前的页面
            if (data != null) {
              _this.UserSelect.Users = data;
              _this.title = 'copy';
              _this.UserSelect.showUserDialog = true;
            } else {
              _this.$message({
                duration: 6000,
                message: _this.$t('wfinsinfo.msgnocopyuser'),
                type: 'warning',
              });
            }
          } else {
            _this.$message({
              duration: 6000,
              message: message ? message : _this.$t('wfinsinfo.msgcopyerror'),
              type: 'warning',
            });
          }
        });
    },
    cancelMeet: function () {
      this.meetPageShow = false;
      this.tabValue = 'first';
    },
  },
};
</script>
<style lang="scss" scoped>
@import './instanceInfo.css';
</style>
