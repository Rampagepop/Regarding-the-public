/**
* Desc:&emsp;&ensp;授信申请
* @author  柳鸣威&emsp;liyuan7@yusys.com.cn
* @date    2023/12/9
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-wrap :card-name="cardName">
    <div slot="topCenter" class="top-center">
        <div class="search">
            <yu-input class="search-item search-input" placeholer="客户名称" v-model.trim="cbTableParams.condition.custName" suffix-icon="el-icon-search" clearable @suffix-click="searchChangeHandler()"></yu-input>
            <yu-select class="search-item search-select" v-model="cbTableParams.condition.creditType" @change="optioOpts">
                <yu-option v-for="item in searchDimOpts" :key="item.value" :label="item.label" :value="item.value"></yu-option>
            </yu-select>
        </div>
    </div>
    <xtableHeaderDrag ref="cbTable" v-on="$listeners" v-bind="$attrs" :data-url="dataUrl" :base-params="cbTableParams" :headerFields="headerFieldsCS" :default-load="false" no-page-sizes :page-size="5" :page-sizes="[5]" :buttons="buttons" :tableId="credit"></xtableHeaderDrag>
  </card-wrap>
</template>

<script>
import { sessionStore, lookup } from '@/utils'
import { COMMON_TOKEN } from "@/config/constant/app.data.common";
import cardWrap from "@/views/portal/card/components/card-wrap";
import config from "@/config";
import multiSystemCfg from "@/config/multisystem";
import xtableHeaderDrag from "@/views/portal/card/components/xtableHeaderDrag";
import { mapGetters } from "vuex";
lookup.reg("CORP_CUS_TYP,CUS_TYPE,CUS_STS,CREDIT_APPLY_TYPE");

export default {
    name: "credit",
    components: {
        cardWrap,
        xtableHeaderDrag
    },
    data: function() {
        return {
            // 表格头部显示
            headerFieldsZH:[
                {
                    label: '申请编号',
                    prop: 'apltNum',
                    tabletype: 'headerFieldsZH',
                    show: true,
                    showColFilter: true,
                    minWidth:110,
                    disabled: true,
                    handleClick: this.apltDetailFn
                },
                {
                    label: '客户编号',
                    prop: 'custNum',
                    tabletype: 'headerFieldsZH',
                    minWidth:100,
                    show: false,
                    draggable: true
                },
                {
                    label: '客户名称',
                    prop: 'custName',
                    tabletype: 'headerFieldsZH',
                    minWidth:120,
                    show: true,
                    draggable: true
                },
                {
                    label: '业务类型',
                    prop: 'crdtTypeName',
                    tabletype: 'headerFieldsZH',
                    minWidth:90,
                    show: true,
                    draggable: true
                },
                {
                    label: '发生类型',
                    prop: 'crdtBusiTypeName',
                    tabletype: 'headerFieldsZH',
                    minWidth:80,
                    show: true,
                    draggable: true
                },
                {
                    label: '币种',
                    prop: 'limtCcyName',
                    tabletype: 'headerFieldsZH',
                    minWidth:80,
                    show: true,
                    draggable: true
                },
                {
                    label: '金额（元）',
                    prop: 'apltAmt',
                    tabletype: 'headerFieldsZH',
                    minWidth:100,
                    show: true,
                    draggable: true
                },
                {
                    label: '申请状态',
                    prop: 'stageSts',
                    tabletype: 'headerFieldsZH',
                    minWidth:100,
                    show: true,
                    draggable: true,
                    dataCode: 'CREDIT_APPLY_TYPE'
                },
                {
                    label: '登记日期',
                    prop: 'regrTime',
                    tabletype: 'headerFieldsZH',
                    minWidth:100,
                    show: true,
                    draggable: true,
                    sortable: true
                },
                {
                    label: '主管客户经理',
                    prop: 'custMagrName',
                    tabletype: 'headerFieldsZH',
                    minWidth:100,
                    show: true,
                    draggable: true
                },
            ],
            headerFieldsDB:[
                {
                    label: '申请编号',
                    prop: 'apltNum',
                    tabletype: 'headerFieldsDB',
                    show: true,
                    showColFilter: true,
                    minWidth:110,
                    disabled: true,
                    handleClick: this.apltDetailFn
                },
                {
                    label: '客户编号',
                    prop: 'custNum',
                    tabletype: 'headerFieldsDB',
                    minWidth:100,
                    show: false,
                    draggable: true
                },
                {
                    label: '客户名称',
                    prop: 'custName',
                    tabletype: 'headerFieldsDB',
                    minWidth:120,
                    show: true,
                    draggable: true
                },
                {
                    label: '业务类型',
                    prop: 'crdtTypeName',
                    tabletype: 'headerFieldsDB',
                    minWidth:90,
                    show: true,
                    draggable: true
                },
                {
                    label: '发生类型',
                    prop: 'crdtBusiTypeName',
                    tabletype: 'headerFieldsDB',
                    minWidth:80,
                    show: true,
                    draggable: true
                },
                {
                    label: '币种',
                    prop: 'limtCcyName',
                    tabletype: 'headerFieldsDB',
                    minWidth:80,
                    show: true,
                    draggable: true
                },
                {
                    label: '金额（元）',
                    prop: 'apltAmt',
                    tabletype: 'headerFieldsDB',
                    minWidth:100,
                    show: true,
                    draggable: true
                },
                {
                    label: '期限',
                    prop: 'apltTerm',
                    tabletype: 'headerFieldsDB',
                    minWidth:100,
                    show: true,
                    draggable: true
                },
                {
                    label: '申请状态',
                    prop: 'stageSts',
                    tabletype: 'headerFieldsDB',
                    minWidth:100,
                    show: true,
                    draggable: true,
                    dataCode: 'CREDIT_APPLY_TYPE'
                },
                {
                    label: '登记日期',
                    prop: 'regrTime',
                    tabletype: 'headerFieldsDB',
                    minWidth:100,
                    show: true,
                    draggable: true,
                    sortable: true
                },
                {
                    label: '主管客户经理',
                    prop: 'custMagrName',
                    tabletype: 'headerFieldsDB',
                    minWidth:100,
                    show: true,
                    draggable: true
                },
            ],
            headerFieldsXE:[
                {
                    label: '申请编号',
                    prop: 'apltNum',
                    tabletype: 'headerFieldsXE',
                    show: true,
                    showColFilter: true,
                    minWidth:110,
                    disabled: true,
                    handleClick: this.apltDetailFn
                },
                {
                    label: '客户编号',
                    prop: 'custNum',
                    tabletype: 'headerFieldsXE',
                    minWidth:100,
                    show: false,
                    draggable: true
                },
                {
                    label: '客户名称',
                    prop: 'custName',
                    tabletype: 'headerFieldsXE',
                    minWidth:120,
                    show: true,
                    draggable: true
                },
                {
                    label: '业务类型',
                    prop: 'crdtTypeName',
                    tabletype: 'headerFieldsXE',
                    minWidth:90,
                    show: true,
                    draggable: true
                },
                {
                    label: '金额（元）',
                    prop: 'apltAmt',
                    tabletype: 'headerFieldsXE',
                    minWidth:100,
                    show: true,
                    draggable: true
                },
                {
                    label: '申请状态',
                    prop: 'stageSts',
                    tabletype: 'headerFieldsXE',
                    minWidth:100,
                    show: true,
                    draggable: true,
                    dataCode: 'CREDIT_APPLY_TYPE'
                },
                {
                    label: '登记日期',
                    prop: 'regrTime',
                    tabletype: 'headerFieldsXE',
                    minWidth:100,
                    show: true,
                    draggable: true,
                    sortable: true
                },
                {
                    label: '主管客户经理',
                    prop: 'custMagrName',
                    tabletype: 'headerFieldsXE',
                    minWidth:100,
                    show: true,
                    draggable: true
                },
            ],
            headerFieldsTZ:[
                {
                    label: '申请编号',
                    prop: 'apltNum',
                    tabletype: 'headerFieldsTZ',
                    show: true,
                    showColFilter: true,
                    minWidth:110,
                    disabled: true,
                    handleClick: this.apltDetailFn
                },
                {
                    label: '客户编号',
                    prop: 'custNum',
                    tabletype: 'headerFieldsTZ',
                    minWidth:100,
                    show: false,
                    draggable: true
                },
                {
                    label: '客户名称',
                    prop: 'custName',
                    tabletype: 'headerFieldsTZ',
                    minWidth:120,
                    show: true,
                    draggable: true
                },
                {
                    label: '业务类型',
                    prop: 'crdtTypeName',
                    tabletype: 'headerFieldsTZ',
                    minWidth:90,
                    show: true,
                    draggable: true
                },
                {
                    label: '发生类型',
                    prop: 'crdtBusiTypeName',
                    tabletype: 'headerFieldsTZ',
                    minWidth:80,
                    show: true,
                    draggable: true
                },
                {
                    label: '金额（元）',
                    prop: 'apltAmt',
                    tabletype: 'headerFieldsTZ',
                    minWidth:100,
                    show: true,
                    draggable: true
                },
                {
                    label: '申请状态',
                    prop: 'stageSts',
                    tabletype: 'headerFieldsTZ',
                    minWidth:100,
                    show: true,
                    draggable: true,
                    dataCode: 'CREDIT_APPLY_TYPE'
                },
                {
                    label: '登记日期',
                    prop: 'regrTime',
                    tabletype: 'headerFieldsTZ',
                    minWidth:100,
                    show: true,
                    draggable: true,
                    sortable: true
                },
                {
                    label: '主管客户经理',
                    prop: 'custMagrName',
                    tabletype: 'headerFieldsTZ',
                    minWidth:100,
                    show: true,
                    draggable: true
                },
            ],
            headerFieldsQY:[
                {
                    label: '申请编号',
                    prop: 'apltNum',
                    tabletype: 'headerFieldsQY',
                    show: true,
                    showColFilter: true,
                    minWidth:110,
                    disabled: true,
                    handleClick: this.apltDetailFn
                },
                {
                    label: '客户编号',
                    prop: 'custNum',
                    tabletype: 'headerFieldsQY',
                    minWidth:100,
                    show: false,
                    draggable: true
                },
                {
                    label: '客户名称',
                    prop: 'custName',
                    tabletype: 'headerFieldsQY',
                    minWidth:120,
                    show: true,
                    draggable: true
                },
                {
                    label: '业务类型',
                    prop: 'crdtTypeName',
                    tabletype: 'headerFieldsQY',
                    minWidth:90,
                    show: true,
                    draggable: true
                },
                {
                    label: '币种',
                    prop: 'limtCcyName',
                    tabletype: 'headerFieldsQY',
                    minWidth:80,
                    show: true,
                    draggable: true
                },
                {
                    label: '金额（元）',
                    prop: 'apltAmt',
                    tabletype: 'headerFieldsQY',
                    minWidth:100,
                    show: true,
                    draggable: true
                },
                {
                    label: '申请状态',
                    prop: 'stageSts',
                    tabletype: 'headerFieldsQY',
                    minWidth:100,
                    show: true,
                    draggable: true,
                    dataCode: 'CREDIT_APPLY_TYPE'
                },
                {
                    label: '登记日期',
                    prop: 'regrTime',
                    tabletype: 'headerFieldsQY',
                    minWidth:100,
                    show: true,
                    draggable: true,
                    sortable: true
                },
                {
                    label: '主管客户经理',
                    prop: 'custMagrName',
                    tabletype: 'headerFieldsQY',
                    minWidth:100,
                    show: true,
                    draggable: true
                },
            ],
            headerFieldsXX:[
                {
                    label: '申请编号',
                    prop: 'apltNum',
                    tabletype: 'headerFieldsXX',
                    show: true,
                    showColFilter: true,
                    minWidth:110,
                    disabled: true,
                    handleClick: this.apltDetailFn
                },
                {
                    label: '客户编号',
                    prop: 'custNum',
                    tabletype: 'headerFieldsXX',
                    minWidth:100,
                    show: false,
                    draggable: true
                },
                {
                    label: '客户名称',
                    prop: 'custName',
                    tabletype: 'headerFieldsXX',
                    minWidth:120,
                    show: true,
                    draggable: true
                },
                {
                    label: '业务类型',
                    prop: 'crdtTypeName',
                    tabletype: 'headerFieldsXX',
                    minWidth:90,
                    show: true,
                    draggable: true
                },
                {
                    label: '发生类型',
                    prop: 'crdtBusiTypeName',
                    tabletype: 'headerFieldsXX',
                    minWidth:80,
                    show: true,
                    draggable: true
                },
                {
                    label: '币种',
                    prop: 'limtCcyName',
                    tabletype: 'headerFieldsXX',
                    minWidth:80,
                    show: true,
                    draggable: true
                },
                {
                    label: '金额（元）',
                    prop: 'apltAmt',
                    tabletype: 'headerFieldsXX',
                    minWidth:100,
                    show: true,
                    draggable: true
                },
                {
                    label: '申请状态',
                    prop: 'stageSts',
                    tabletype: 'headerFieldsXX',
                    minWidth:100,
                    show: true,
                    draggable: true,
                    dataCode: 'CREDIT_APPLY_TYPE'
                },
                {
                    label: '登记日期',
                    prop: 'regrTime',
                    tabletype: 'headerFieldsXX',
                    minWidth:100,
                    show: true,
                    draggable: true,
                    sortable: true
                },
                {
                    label: '主管客户经理',
                    prop: 'custMagrName',
                    tabletype: 'headerFieldsXX',
                    minWidth:100,
                    show: true,
                    draggable: true
                },
            ],
            headerFieldsSQ:[
                {
                    label: '申请编号',
                    prop: 'apltNum',
                    tabletype: 'headerFieldsSQ',
                    show: true,
                    showColFilter: true,
                    minWidth:110,
                    disabled: true,
                    handleClick: this.apltDetailFn
                },
                {
                    label: '客户编号',
                    prop: 'custNum',
                    tabletype: 'headerFieldsSQ',
                    minWidth:100,
                    show: false,
                    draggable: true
                },
                {
                    label: '客户名称',
                    prop: 'custName',
                    tabletype: 'headerFieldsSQ',
                    minWidth:120,
                    show: true,
                    draggable: true
                },
                {
                    label: '业务类型',
                    prop: 'crdtTypeName',
                    tabletype: 'headerFieldsSQ',
                    minWidth:90,
                    show: true,
                    draggable: true
                },
                {
                    label: '发生类型',
                    prop: 'crdtBusiTypeName',
                    tabletype: 'headerFieldsSQ',
                    minWidth:80,
                    show: true,
                    draggable: true
                },
                {
                    label: '币种',
                    prop: 'limtCcyName',
                    tabletype: 'headerFieldsSQ',
                    minWidth:80,
                    show: true,
                    draggable: true
                },
                {
                    label: '金额（元）',
                    prop: 'apltAmt',
                    tabletype: 'headerFieldsSQ',
                    minWidth:100,
                    show: true,
                    draggable: true
                },
                {
                    label: '申请状态',
                    prop: 'stageSts',
                    tabletype: 'headerFieldsSQ',
                    minWidth:100,
                    show: true,
                    draggable: true,
                    dataCode: 'CREDIT_APPLY_TYPE'
                },
                {
                    label: '登记日期',
                    prop: 'regrTime',
                    tabletype: 'headerFieldsSQ',
                    minWidth:100,
                    show: true,
                    draggable: true,
                    sortable: true
                },
                {
                    label: '主管客户经理',
                    prop: 'custMagrName',
                    tabletype: 'headerFieldsSQ',
                    minWidth:100,
                    show: true,
                    draggable: true
                },
            ],
            headerFieldsCS: this.headerFieldsZH,
            credit: 'credit2ZH',
            cardName: '授信申请',
            searchDimOpts: [
                { value: '01', label: '单笔授信'},
                { value: '02', label: '综合授信'},
                { value: '26', label: '集团内部限额授信'},
                { value: '80', label: '额度启用'},
                { value: '04', label: '申请调整审批意见'},
                { value: '03', label: '综合授信项下'},
                { value: '29', label: '集团风险限额调整'}
            ],
            cbTableParams: { condition: { custName: '', creditType: '02', custMagr: sessionStore.get(COMMON_TOKEN).username, orgNo: ''}},
            dataaUrl: bakend.portalService + '/api/creditApply/queryPage',
        }
    },
    computed: {
        ...mapGetters(["userCode","selectedRoles"]),
        // 表头操作方法名
        buttons() {
            return [
                { label: "修改",handleClick: this.apltuploadFn}
            ]
        }
    },
    created() {
        this.cbTableParams.condition.orgNo = this.selectedRoles.orgId
        this.headerFieldsCS = this.headerFieldsZH
    },
    mouted() {
        if (config.isdebug) {
            setTimeout(() => {
                window.debugV2 = this;
            },100)
        }
    },
    methods: {
        // 点击字段排序
        sortChange(sortObj) {
            this.$refs.cbTable.remoteData({})
        },
        // 下拉选择
        optioOpts (val) {
            if (val === 26) {
                this.credit = 'credit2XE'
                this.$set(this,"headerFieldsCS", this.headerFieldsXE)
            } else if (val === '02') {
                this.credit = 'credit2ZH'
                this.$set(this,"headerFieldsCS", this.headerFieldsZH)
            } else if (val === '01') {
                this.credit = 'credit2DB'
                this.$set(this,"headerFieldsCS", this.headerFieldsDB)
            } else if (val === '80') {
                this.credit = 'credit2QY'
                this.$set(this,"headerFieldsCS", this.headerFieldsQY)
            } else if (val === '03') {
                this.credit = 'credit2XX'
                this.$set(this,"headerFieldsCS", this.headerFieldsXX)
            } else if (val === '29') {
                this.credit = 'credit2TZ'
                this.$set(this,"headerFieldsCS", this.headerFieldsTZ)
            } else if (val === '04') {
                this.credit = 'credit2SQ'
                this.$set(this,"headerFieldsCS", this.headerFieldsSQ)
            }
            this.$refs.cbTable.remoteData({})
        },
        // 查询方法
        searchChangeHandler() {
            var reg = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？+]');
            if (this.cbTableParams.condition.custName && reg.test(this.cbTableParams.condition.custName)) {
                this.$message({
                    message: this.$t('component.valid_msg_001'),
                    type: 'warning'
                });
            } else {
                this.$refs.cbTable.remoteData({});
            }
        },
        // 点击编号跳转第三方详情页面
        apltDetailFn (row) {
            let id = { 'loginOrgCode': this.selectedRoles.orgId }
            if (row.creditType === "02") {  // 综合授信
                multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", 'addCorpDetail', { microParams:{microData:{'limtApltNum': row.apltNum, ...row}, microType: '02', microView: 'detail'} }, id)
            } else if (row.creditType === "01") {    // 单笔授信
                multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", 'addPsDetail', { microParams:{microData:{...row}, microType: '02', microView: 'detail'} }, id)
            } else if (row.creditType === "26") {   // 集团客户风险限额
                multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", 'cusSharingApplyDetail', { microParams:{microData:{'applNo': row.apltNum, ...row}, microType: '02', microView: 'detail'} }, id)
            } else if (row.creditType === "80") {   // 授信额度启用
                multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", 'eduqiyongDetail', { microParams:{microData:{'applNo': row.apltNum, ...row}, microType: '02', microView: 'detail'} }, id)
            } else if (row.creditType === "04") {   // 业务调整申请
                multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", 'yewutiaozhengDetail', { microParams:{microData:{'applNo': row.apltNum, ...row}, microType: '02', microView: 'detail'} }, id)
            } else if (row.creditType === "03") {   // 综合授信项下
                multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", 'zonghexiangxiaDetail', { microParams:{microData:{'applNo': row.apltNum, ...row}, microType: '02', microView: 'detail'} }, id)
            } else if (row.creditType === "29") {   // 集团客户风险限额调整
                multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", 'jituanfengxianDetail', { microParams:{microData:{'applNo': row.apltNum, ...row}, microType: '02', microView: 'detail'} }, id)
            }
        },
        // 点击编号跳转第三方处理页面
        apltuploadFn(row) {
            let id = { 'loginOrgCode': this.selectedRoles.orgId }
            if (row.creditType === "02") {  // 综合授信
                multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", 'addCorpDetail', { microParams:{microData:{'limtApltNum': row.apltNum, ...row}, microType: '02', microView: 'edit'} }, id)
            } else if (row.creditType === "01") {    // 单笔授信
                multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", 'addPsDetail', { microParams:{microData:{...row}, microType: '02', microView: 'edit'} }, id)
            } else if (row.creditType === "26") {   // 集团客户风险限额
                multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", 'cusSharingApplyDetail', { microParams:{microData:{'applNo': row.apltNum, ...row}, microType: '02', microView: 'edit'} }, id)
            } else if (row.creditType === "80") {   // 授信额度启用
                multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", 'eduqiyongDetail', { microParams:{microData:{'applNo': row.apltNum, ...row}, microType: '02', microView: 'edit'} }, id)
            } else if (row.creditType === "04") {   // 业务调整申请
                multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", 'yewutiaozhengDetail', { microParams:{microData:{'applNo': row.apltNum, ...row}, microType: '02', microView: 'edit'} }, id)
            } else if (row.creditType === "03") {   // 综合授信项下
                multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", 'zonghexiangxiaDetail', { microParams:{microData:{'applNo': row.apltNum, ...row}, microType: '02', microView: 'edit'} }, id)
            } else if (row.creditType === "29") {   // 集团客户风险限额调整
                multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", 'jituanfengxianDetail', { microParams:{microData:{'applNo': row.apltNum, ...row}, microType: '02', microView: 'edit'} }, id)
            }
        }
    }
}
</script>
