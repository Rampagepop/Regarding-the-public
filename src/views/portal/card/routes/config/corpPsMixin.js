import multiSystemCfg from "@/config/multisystem"
import backend from "@/config/constant/app.data.service";

export default {
  data() {
    const cusStsRender = (h, col, row) => h("yu-tag", {
      props: {
        type: col.tagTypeMap[row.cusSts],
        closeTransition: true
      }
    }, col.optionsMap ? col.optionsMap[row.cusSts] : row.cusSts)
    const data = {
      activeMode: "corp",
      modes: [
        {label: this.$t('card.cusMgr.corp'), value: "corp"},
        {label: this.$t('card.cusMgr.ps'), value: "ps"}],
      corpPsConfig: {
        corp: {
          fields: [
            // statDetField 为二级页面统计分析，后端返回的字段
            {prop: "cusTyp", label: "客户类型", value: "CORP_CUS_TYP", statDetField: "cusTypDtl"}, // 企业 事业单位 政府机关
            // {prop: "idTyp", label: "证件类型", value: "CORP_ID_TYP"}, //统一社会信用代码 其他证件（对公）
            {prop: 'cusCat', label: "客户分类", value: "CUS_CAT"}, // 对公 个人 同业
            {prop: "corpScal", label: "企业规模", value: "CORP_SCAL", statDetField: "epScalDtl"},
            {prop: "indyCat", label: "行业分类", value: "FNC_STAT_CUS_BIZ_TYP", statDetField: "indyClDtl"},
            {prop: "hldgTyp", label: "控股类型", value: "HLDG_TYP", statDetField: "hldgTypDtl"}, // 国有控股 非国有控股
            {prop: "nesLrgClss", label: "国民经济部门", value: "NES_LRG_CLSS"},
            {prop: "unitChr", label: "企业性质", value: "UNIT_CHR"}, // 国有 民营
            {prop: 'cusSts', label: "客户状态", value: "CUS_STS"} // 正式 临时 注销 合并注销
          ],
          tableDataUrl: backend.cdpCusService + "/api/xmhcus/v2/occp/list",
          // 统计数据
          statUrl: backend.cdpCusService + "/api/xmhcus/v2/occp/static",
          // 二级页面统计数据
          detStatUrl: backend.cdpCusService + "/api/xmhcus/v2/occp/static/detail",
          headerFields: [{
            label: "客户编号",
            prop: "cusId",
            // 默认显示
            show: true,
            // 不允许在列信息过滤中进行修改
            disabled: true,
            // 显示列过滤下拉按钮
            showColFilter: true,
            // 点击单元格直接复制
            copyEnabled: true,
            minWidth: 100,
          }, {
            label: "客户名称",
            prop: "cusName",
            show: true,
            disabled: true,
            showColFilter: true,
            // 超链接
            handleClick: this.getBtnFn("View", true),
            minWidth: 100,
          }, {
            label: "客户类型",
            prop: "cusTyp",
            show: true,
            filter: true,
            dataCode: 'CORP_CUS_TYP',
            isSel: true
          }, {
            label: "证件类型",
            prop: "idTyp",
            minWidth: 80,
            show: true,
            showOverflowTooltip: true,
            dataCode: 'CORP_ID_TYP'
          }, {
            label: '证件号码',
            prop: 'idNo',
            show: true,
            copyEnabled: true,
            sortEnabled: true
          }, {
            label: '客户分类',
            prop: 'cusCat',
            show: true,
            filter: true,
            dataCode: 'CUS_CAT',
            isSel: true
          }, {
            label: '企业规模',
            prop: 'corpScal',
            show: false,
            filter: true,
            dataCode: 'CORP_SCAL',
            isSel: true
          }, {
            label: '行业分类',
            prop: 'indyCat',
            show: false,
            filter: true,
            dataCode: 'FNC_STAT_CUS_BIZ_TYP',
            isSel: true
          }, {
            label: '控股类型',
            prop: 'hldgTyp',
            show: false,
            filter: true,
            dataCode: 'HLDG_TYP',
            isSel: true
          }, {
            label: '国民经济部门',
            prop: 'nesLrgClss',
            show: false,
            filter: true,
            dataCode: 'NES_LRG_CLSS',
            isSel: true
          }, {
            label: '主管客户经理',
            prop: 'manMgrName',
            show: true,
          }, {
            label: '主管机构',
            prop: 'mgrBchName',
            show: true,
          }, {
            label: '客户状态',
            prop: 'cusSts',
            show: true,
            filter: true,
            width: 82,
            showOverflowTooltip: false,
            //{99: '注销客户', 00: '临时客户', 01: '正式客户', 02: '合并注销'}
            tagTypeMap: {"00": "primary", "01": "success", "02": "gray", "99": "gray"},
            render: cusStsRender,
            dataCode: 'CUS_STS_QUERY',
            isSel: true
          }],
          buttons: [
            {
              label: this.$t('card.cusMgr.transFrml'),
              show: (row) => { return row.cusSts === "00" && row.cusCat !== '3'},
              handleClick: this.getBtnFn("Modify", true)
            },
            {label: this.$t('card.cusMgr.modify'), handleClick: this.getBtnFn("Modify", true)},
            {
              label: this.$t('card.cusMgr.logOut'),
              show: (row) => row.cusSts !== "00",
              handleClick: this.getBtnFn("LogOut")
            },
            {
              label: this.$t('card.cusMgr.relationGraph'), 
              show: (row) => {return row.cusSts !== "00"}, 
              handleClick: this.getBtnFn("RelationGraph")}
          ],
          subPage: {
            overview: {
              cusTypeAlzProps: ["cusTyp", "hldgTyp", "indyCat", "corpScal"],
            },
            cusSearch: {
              checkOptProps: ["cusTyp", "hldgTyp", "cusSts", "indyCat", "corpScal", "nesLrgClss"],
            }
          }
        },
        ps: {
          fields: [
            {prop: "cusTyp", label: "客户类型", value: "INDIV_CUS_TYP", statDetField: "cusTypDtl"}, // 个体工商户 小微企业主 其他自然人
            {prop: "idTyp", label: "证件类型", value: "INDIV_ID_TYP"}, // 二代居民身份证 临时身份证 ...
            {prop: "hgtEdu", label: "最高学历", value: "EDU", statDetField: "hgtEduTypDtl"},
            {prop: "nesLrg", label: "国民经济部门", value: "INDIV_NES_LRG"}, // 住户 外国居民
            {prop: "phInd", label: "是否农户", value: "YES_NO_YN"}, // 是 否
            {prop: "dfltInd", label: "违约标识", value: "YES_NO_YN"}, // 是 否
            // {prop: "nation", label: "名族", value: "NATION"}, // 是 否
            {prop: "occp", label: "职业", value: "OCCP", statDetField: "occpTypDtl"}, // 党的机关、国家机关、群众团体和社会组织、企事业单位负责人 专业技术人员 办事人员和有关人员 ...
            {prop: "unitChr", label: "单位性质", value: "UNIT_CHR"}, // 国有企业 集体企业 联营企业 国有联营 ...
            {prop: "indyCde", label: "单位所属行业", value: "FNC_STAT_CUS_BIZ_TYP", statDetField: "cusTypDtl"}, // 行业大类
            {prop: "cusSts", label: "客户状态", value: "CUS_STS"}, // 正式 临时 注销 合并注销
            {prop: "sex", label: "性别", value: "SEX", statDetField: "sexTypDtl"},
          ],
          tableDataUrl: backend.cdpCusService + "/api/xmhcus/v2/indiv/list",
          // 统计数据
          statUrl: backend.cdpCusService + "/api/xmhcus/v2/indiv/static",
          // 二级页面统计数据
          detStatUrl: backend.cdpCusService + "/api/xmhcus/v2/indiv/static/detail",
          headerFields: [{
            label: "客户编号",
            prop: "cusId",
            show: true,
            // 是否参与筛选，默认false
            filter: false,
            // 不允许在列信息过滤中进行修改
            disabled: true,
            // 显示列过滤下拉按钮
            showColFilter: true,
            // 点击单元格直接复制
            copyEnabled: true,
            minWidth: 100,
          }, {
            label: "客户名称",
            prop: "cusName",
            show: true,
            disabled: true,
            showColFilter: true,
            // 超链接
            handleClick: this.getBtnFn("View", true),
            minWidth: 100,
          }, {
            label: "客户类型",
            prop: "cusTyp",
            show: true,
            // 参与筛选, 上边下拉选择
            filter: true,
            dataCode: 'INDIV_CUS_TYP',
            isSel: true// 是否作为下拉选择维度
          }, {
            label: "证件类型",
            prop: "idTyp",
            show: true,
            filter: true,
            minWidth: 80,
            showOverflowTooltip: true,
            dataCode: 'INDIV_ID_TYP',
            isSel: true,
          }, {
            label: '证件号码',
            prop: 'idNo',
            show: true,
            copyEnabled: true,
            sortEnabled: true
          }, {
            label: '性别',
            prop: 'sex',
            show: true,
            dataCode: 'SEX'
          }, {
            label: '最高学历',
            prop: 'hgtEdu',
            show: false,
            filter: true,
            dataCode: 'EDU',
            isSel: true,
          }, {
            label: '国民经济部门',
            prop: 'nesLrg',
            show: false,
            filter: true,
            dataCode: 'INDIV_NES_LRG',
            isSel: true,
          }, {
            label: '是否农户',
            prop: 'phInd',
            show: false,
            filter: true,
            dataCode: 'YES_NO_YN',
            isSel: true,
          }, {
            label: '违约标识',
            prop: 'dfltInd',
            show: false,
            filter: true,
            dataCode: 'YES_NO_YN',
            isSel: true,
          }, {
            label: '民族',
            prop: 'nation',
            show: false,
            dataCode: 'NATION'
          }, {
            label: '职业',
            prop: 'occp',
            show: false,
            filter: true,
            dataCode: 'OCCP',
            isSel: true,
          }, {
            label: '单位性质',
            prop: 'unitChr',
            show: false,
            filter: true,
            dataCode: 'UNIT_CHR',
            isSel: true,
          }, {
            label: '单位所属行业',
            prop: 'indyCde',
            show: false,
            filter: true,
            dataCode: 'FNC_STAT_CUS_BIZ_TYP',
            isSel: true,
          }, {
            label: '主管客户经理',
            prop: 'manMgrName',
            show: true,
          }, {
            label: '主管机构',
            prop: 'mgrBchName',
            show: true,
          }, {
            label: '客户状态',
            prop: 'cusSts',
            show: true,
            filter: true,
            width: 82,
            showOverflowTooltip: false,
            //{99: '注销客户', 00: '临时客户', 01: '正式客户', 02: '合并注销'}
            tagTypeMap: {"00": "primary", "01": "success", "02": "gray", "99": "gray"},
            render: cusStsRender,
            dataCode: 'CUS_STS_QUERY',
            isSel: true,
          }],
          buttons: [
            {
              label: this.$t('card.cusMgr.transFrml'),
              show: (row) => { return row.cusSts === "00" && row.cusCat !== '3'},
              handleClick: this.getBtnFn("Modify", true)
            },
            {label: this.$t('card.cusMgr.modify'), handleClick: this.getBtnFn("Modify", true)},
            {
              label: this.$t('card.cusMgr.logOut'), 
              show: (row) => {return row.cusSts !== "00"}, 
              handleClick: this.getBtnFn("LogOut")
            },
            { 
              label: this.$t('card.cusMgr.relationGraph'),
              show: (row) => {return row.cusSts !== "00"}, 
              handleClick: this.getBtnFn("RelationGraph")
            }
          ],
          subPage: {
            overview: {
              cusTypeAlzProps: ["cusTyp", "sex", "hgtEdu", "occp"],
            },
            cusSearch: {
              checkOptProps: ["cusTyp", "cusSts", "sex", "hgtEdu", "occp", "unitChr", "indyCde", "dfltInd"],
            }
          }
        },
      }
    }
    // 处理字典，追加到headerFields上
    // 处理多语言，直接将prop作为key获取多语言的value
    Object.keys(data.corpPsConfig).forEach(type => {
      const fieldsMap = data.corpPsConfig[type].fields.reduce((obj, item) => {
        obj[item.prop] = item;
        // 处理多语言
        item.label = this.$t('card.cusMgr.fields.' + item.prop);
        return obj
      }, {});
      data.corpPsConfig[type].fieldsMap = fieldsMap;
      data.corpPsConfig[type].headerFields.forEach(field => {
        // 处理多语言
        field.label = this.$t('card.cusMgr.fields.' + field.prop);
        // headerFields中如果没有字典信息就添加
        // field.prop != "sex" 个人时，列表查询类型需要去除 性别查询条件
        if (fieldsMap[field.prop] && field.dataCode == undefined && field.prop != "sex") {
          field.dataCode = fieldsMap[field.prop].value
          field.optionsMap = {}
        }
        // 有字典则允许需要排序
        field.dataCode && (field.sortEnabled = true)
      });
    })
    return data
  },
  computed: {
    pageConfig() {
      return this.corpPsConfig[this.activeMode]
    },
    tableDataUrl() {
      return this.pageConfig.tableDataUrl
    },
    statUrl() {
      return this.pageConfig.statUrl
    },
    detStatUrl() {
      return this.pageConfig.detStatUrl
    },
    headerFields() {
      return this.pageConfig.headerFields
    },
    buttons() {
      return this.pageConfig.buttons
    },
    isCorp() {
      return this.activeMode === "corp"
    },
  },
  methods: {
    getBtnFn(key, addCusSts = false) {  
      return (row) => {
        // 为处理多次点击客户名称跳转后数据重复问题
        if (this.$refs.refTable) {
          this.$refs.refTable.remoteData()
        }else {
          this.$refs.xtableHeaderDrag.remoteData()
        }
        // 注销  对公-cancelCusCorp 同业-cusItckUnregister 风险客户-cusRskApplCancel 个人-cancelCusIndiv
        let name = this.activeMode;
        if (addCusSts) {
          if (row.cusSts === "01") {
            // 正式客户
            name += "Frml"
          } else if (row.cusSts === "00") {
            // 临时客户
            name += "Temp"
          } else {
            this.$message.warning("只支持正式01和临时客户00，请检查是否更新了字典CUS_STS_QUERY");
            return;
          }
          // 除了根据客户类型还要根据客户分类判断具体的跳转页面
          // 同业客户特殊处理
          if(row.cusCat === '3') {
            name += 'tyCustom'
          }
        }
        name += key;
        // 通过row.cusCat 跳到不同的注销和反注销页面// 1对公 2个人 3同业
        if(name === 'corpLogOut' || name === 'psLogOut') {
          if(row.cusCat === '3') {
            name = 'corpRegLogOut'
          }
        } 
        this.routeToCreditSys(name, row, key)
      }
    },
    // 路由跳转到中台页面
    routeToCreditSys(name, row, key) {
      // v1卡片中的按钮没有row数据 临时客户没有注销
      multiSystemCfg.routePush(multiSystemCfg.SYSTEM.CREDIT, "cusMgr", name, row != null ? {
        key: key + "" + row.cusId,
        pageKey: key + "" + row.cusId, //关系图谱使用
        // 大部分页面的参数是通过custRowData把row传进去
        custRowData: row,
        // 关系图谱是在pageParams中
        pageParams: {custData: row},
        // 当前路由
        curRoute: this.$route.path,
        soruce:this.$route.path
      } : null)
    },
  }
}
