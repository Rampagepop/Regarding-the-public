import backend from '../../../src/config/constant/app.data.service'
import {CustomerList, CustomerStatic} from './data/data.customer'
import {AConstractList, monitoryRepayment, AConstractStatic, configList} from './data/data.approve.constract'
import {RiskWarningList} from './data/data.risk.warning'
import {CreditApproveList} from './data/data.credit.approve'

function dealSort(sort, data) {
  if (sort) {
    const prop = sort.split(" ")[0];
    const sortMode = sort.split(" ")[1];
    if (sortMode.toLowerCase() == "asc") {
      // 升序
      return data.sort((a, b) => a[prop] > b[prop] ? 1 : -1)
    } else {
      return data.sort((a, b) => b[prop] > a[prop] ? 1 : -1)
    }
  }
  return data
}

function portalAdvertisementInfoShow() {
  return {
    code: '0',
    data: {
      fileId: ''
    }
  }
}

function showBanner() {
  return {
    code: '0000',
    data: [{
      bannerfileDTOList: [{
        fileId: 'banner.png',
        fileNm: 'banner_logo.png',
        fileTypeCd: null,
        serialNo: 0
      }],
      caroTimeItrv: 5,
      dspRangeCd: '10',
      id: '40000000000000',
      issuTime: '2022-04-11 11:00:00',
      orgList: null,
      // rmk: '1、信贷管理、数据看板、个性定制报表主力信贷风险，业务全流程提速!',
      rmk: '',
      roleList: null,
      skpLink: 'test',
      statusCd: '20',
      // title: '智慧风控平台全新上线'
      title: ''
    },
      {
        bannerfileDTOList: [{
          fileId: 'banner.png',
          fileNm: 'banner_logo.png',
          fileTypeCd: null,
          serialNo: 0
        }],
        caroTimeItrv: 5,
        dspRangeCd: '10',
        id: '40000000000001',
        issuTime: '2022-04-11 11:00:00',
        orgList: null,
        rmk: '',
        roleList: null,
        skpLink: 'test',
        statusCd: '20',
        title: ''
      }]
  }
}

function findListLimitSix() {
  return {
    code: '0000',
    data: [{
      clckDate: '2022-04-11 11:00:00',
      clckTimes: 39,
      id: '40000',
      inputdate: null,
      inputorgid: null,
      inputuserid: null,
      menuCode: 'STATQUERY_0001_01_02',
      menuLink: '/kycr-query/queryNestedForm',
      menuName: '客户查询',
      orgCode: '9998',
      skpTypeCd: '0',
      sysId: '93700',
      updatedate: null,
      updateorgId: null,
      updateuserid: null,
      userCode: 'admin'
    }]
  }
}

function showTitle() {
  return {
    code: '0000',
    data: {
      count: true,
      filter: null,
      filterRules: {},
      orders: {},
      pageNumber: 0,
      pageSize: 0,
      pageable: false,
      pages: 0,
      result: [{
        id: '9000000000',
        impFlag: 'Y',
        type: '1',
        infTitle: '宇信科技一季度归母净利润同比增长106%，创新运营业务收入实现翻倍！',
        inputdate: null,
        inputorgid: null,
        inputuserid: null,
        issuOrgCode: '0798',
        issuOrgName: '成都分行',
        issuTime: '2022-04-11 11:00:00',
        msgRemindTimes: null,
        readFlag: 'N',
        readTotalNum: 6,
        remindFlag: 'Y',
        statusCd: null,
        updatedate: null,
        updateorgId: null,
        updateuserid: null,
        visibRangeTypeCd: null
      }, {
        id: '9000000001',
        impFlag: 'Y',
        type: '2',
        infTitle: '宇信科技2021年业绩稳健增长，研发投入创新高',
        inputdate: null,
        inputorgid: null,
        inputuserid: null,
        issuOrgCode: '0798',
        issuOrgName: '成都分行',
        issuTime: '2022-04-11 11:00:00',
        msgRemindTimes: null,
        readFlag: 'N',
        readTotalNum: 6,
        remindFlag: 'Y',
        statusCd: null,
        updatedate: null,
        updateorgId: null,
        updateuserid: null,
        visibRangeTypeCd: null
      }, {
        id: '9000000003',
        impFlag: 'Y',
        type: '2',
        infTitle: '上海证券报｜宇信科技完成定增融资11.15亿元，4.2倍认购体现市场信心！',
        inputdate: null,
        inputorgid: null,
        inputuserid: null,
        issuOrgCode: '0798',
        issuOrgName: '成都分行',
        issuTime: '2022-04-11 11:00:00',
        msgRemindTimes: null,
        readFlag: 'N',
        readTotalNum: 6,
        remindFlag: 'Y',
        statusCd: null,
        updatedate: null,
        updateorgId: null,
        updateuserid: null,
        visibRangeTypeCd: null
      }, {
        id: '9000000004',
        impFlag: 'Y',
        type: '3',
        infTitle: '宇信科技与腾讯云开启战略合作 携手推进金融科技发展',
        inputdate: null,
        inputorgid: null,
        inputuserid: null,
        issuOrgCode: '0798',
        issuOrgName: '成都分行',
        issuTime: '2022-04-11 11:00:00',
        msgRemindTimes: null,
        readFlag: 'N',
        readTotalNum: 6,
        remindFlag: 'Y',
        statusCd: null,
        updatedate: null,
        updateorgId: null,
        updateuserid: null,
        visibRangeTypeCd: null
      }, {
        id: '9000000005',
        impFlag: 'Y',
        type: '3',
        infTitle: '乘信创东风，宇信科技2021年上半年营利双升！',
        inputdate: null,
        inputorgid: null,
        inputuserid: null,
        issuOrgCode: '0798',
        issuOrgName: '成都分行',
        issuTime: '2022-04-11 11:00:00',
        msgRemindTimes: null,
        readFlag: 'N',
        readTotalNum: 6,
        remindFlag: 'Y',
        statusCd: null,
        updatedate: null,
        updateorgId: null,
        updateuserid: null,
        visibRangeTypeCd: null
      }],
      total: '107'
    }
  }
}

function myCustomer() {
  return {
    code: '0000',
    data: {
      leftDown: [{
        cnt: 19028,
        dataDate: '20220301',
        expoTotalBal: 11491.89,
        lowRiskCnt: 0
      }],
      leftUp: {
        cnt: 19028,
        expoTotalBal: 11491.89,
        lowRiskCnt: 0,
        totalBal: 16794.73
      },
      midden: {
        concernExpoAmt: 249.39,
        npExpoAmt: 28.52,
        ovd60ExpoAmt: 35.68,
        ovdExpoAmt: 59.64,
        probExpoAmt: 0
      },
      right: {
        inCrdtBal: 0,
        inCrdtCnt: 0,
        nonStdCrdtBal: 116.28,
        nonStdCrdtCnt: 19028,
        outCrdtBal: 0,
        outCrdtCnt: 0
      }
    }
  }
}

function rwsAmpsIsaApi() {
  return {
    code: '0',
    data: null
  }
}

function selectSystemSaveSecIcon() {
  return {
    data: [{
      browserSrcCd: '01',
      cardCode: '',
      cardLabel: 'sysFastEntry',
      cardName: 'KYCr1.0',
      crtTypeCd: 'Y',
      id: '200000',
      intfUrl: 'http://www.pbc.gov.cn/',
      nestLvl: '20',
      thumbnailRoute: 'kycr'
    }, {
      browserSrcCd: '00',
      cardCode: '',
      cardLabel: 'sysFastEntry',
      cardName: '客户评级',
      crtTypeCd: 'Y',
      id: '200001',
      intfUrl: 'http://www.pbc.gov.cn/',
      nestLvl: '20',
      thumbnailRoute: 'Irs'
    }, {
      browserSrcCd: '01',
      cardCode: '',
      cardLabel: 'sysFastEntry',
      cardName: '统一额度',
      crtTypeCd: 'Y',
      id: '200002',
      intfUrl: 'http://www.pbc.gov.cn/',
      nestLvl: '20',
      thumbnailRoute: 'uqms'
    }, {
      browserSrcCd: '00',
      cardCode: '',
      cardLabel: 'sysFastEntry',
      cardName: '风险资产处置',
      crtTypeCd: 'Y',
      id: '200003',
      intfUrl: 'http://www.pbc.gov.cn/',
      nestLvl: '20',
      thumbnailRoute: 'npam'
    }, {
      browserSrcCd: '00',
      cardCode: '',
      cardLabel: 'sysFastEntry',
      cardName: '智能预警',
      crtTypeCd: 'Y',
      id: '200010',
      intfUrl: 'http://www.pbc.gov.cn/',
      nestLvl: '20',
      thumbnailRoute: 'cmswarn'
    }, {
      browserSrcCd: '01',
      cardCode: '',
      cardLabel: 'sysFastEntry',
      cardName: '智能监控',
      crtTypeCd: 'Y',
      id: '200020',
      intfUrl: 'http://www.pbc.gov.cn/',
      nestLvl: '20',
      thumbnailRoute: 'isa'
    }, {
      browserSrcCd: '01',
      cardCode: '',
      cardLabel: 'sysFastEntry',
      cardName: '智慧分析',
      crtTypeCd: 'Y',
      id: '200030',
      intfUrl: 'http://www.pbc.gov.cn/',
      nestLvl: '20',
      thumbnailRoute: 'sign'
    }, {
      browserSrcCd: '01',
      cardCode: '',
      cardLabel: 'sysFastEntry',
      cardName: '客户风险全景视图',
      crtTypeCd: 'Y',
      id: '200050',
      intfUrl: 'http://www.pbc.gov.cn/',
      nestLvl: '20',
      thumbnailRoute: 'dist'
    }]
  }
}

function alertList() {
  return {
    data: null
  }
}

function selectMktSaveSecIcon() {
  return {
    code: '0',
    data: []
  }
}

function getToolsList() {
  return {
    code: '0',
    data: [
      {
        imgSrc: 'icon-repayment.svg',
        text: "还款计算器",
        path: "/content/portalManager/toolsManage/beforeCreditInfo",
      },
      {
        imgSrc: 'icon-capital.svg',
        text: "营运资金",
      },
      {
        imgSrc: 'icon-loan.svg',
        text: "贷款计算器",
      },
      {
        imgSrc: 'icon-manage.svg',
        text: "行政管理",
      },
      {
        imgSrc: 'icon-logistics.svg',
        text: "物流查询",
      },
      {
        imgSrc: 'icon-financial.svg',
        text: "财经天地",
      },
      {
        imgSrc: 'icon-ayth.svg',
        text: "授权查询",
      },
      {
        imgSrc: 'icon-calc.svg',
        text: "单位换算计算",
      },
    ]
  }
}

function getQuickEntranceAllList() {
  return {
    code: '0',
    data: [
      {id: '1', imgSrc: 'icon-bank.svg', text: '中央人民银行', path: 'http://www.pbc.gov.cn/'},
      {
        id: '2',
        imgSrc: 'icon-insurance.svg',
        text: '银保监会',
        path: 'http://www.cbirc.gov.cn/cn/view/pages/index/index.html'
      },
      {id: '3', imgSrc: 'icon-verify.svg', text: '信息核查'},
      {id: '4', imgSrc: 'icon-manage.svg', text: '行政管理'},
      {id: '5', imgSrc: 'icon-logistics.svg', text: '物流查询'},
      {id: '6', imgSrc: 'icon-financial.svg', text: '财经天地'},
      {id: '7', imgSrc: 'icon-ayth.svg', text: '授权查询'},
      {id: '8', imgSrc: 'icon-calc.svg', text: '单位换算计算'}
    ]
  }
}

function getQuickEntranceList() {
  return {
    code: '0',
    data: [
      {id: '1', imgSrc: 'icon-bank.svg', text: '中央人民银行', path: 'http://www.pbc.gov.cn/'},
      {
        id: '2',
        imgSrc: 'icon-insurance.svg',
        text: '银保监会',
        path: 'http://www.cbirc.gov.cn/cn/view/pages/index/index.html'
      },
      {id: '3', imgSrc: 'icon-verify.svg', text: '信息核查'},
      {id: '6', imgSrc: 'icon-financial.svg', text: '财经天地'},
      {id: '7', imgSrc: 'icon-ayth.svg', text: '授权查询'},
      {id: '8', imgSrc: 'icon-calc.svg', text: '单位换算计算'}
    ],
  }
}

function getAConstractList(config) {
  const { page = 1, size = 5, keyWord } = config.body
  let mockList = AConstractList.filter(item => {
    if (keyWord) {
      return item.customerName.indexOf(keyWord) > -1
    }
    return true
  })
  mockList = dealSort(config.body.sort, mockList)
  let pageList
  if (page && size) {
    pageList = mockList.filter((item, index) => {
      return index < size * page && index >= size * (page - 1)
    })
  }
  return {
    code: '0',
    total: mockList.length,
    data: pageList
  }
}

function getMonitoryRepayment(config) {
  const { page = 1, size = 10, keyWord } = config.body
  let mockList = monitoryRepayment.filter(item => {
    if (keyWord) {
      return item.customerName.indexOf(keyWord) > -1
    }
    return true
  })
  mockList = dealSort(config.body.sort, mockList)
  let pageList
  if (page && size) {
    pageList = mockList.filter((item, index) => {
      return index < size * page && index >= size * (page - 1)
    })
  }
  return {
    code: '0',
    total: mockList.length,
    data: pageList
  }
}

function getCustomerList(config) {
  const { page = 1, size = 10, keyWord } = config.body
  let mockList = CustomerList.filter(item => {
    if (keyWord) {
      return item.customerName.indexOf(keyWord) > -1
    }
    return true
  })
  mockList = dealSort(config.body.sort, mockList)
  let pageList
  if (page && size) {
    pageList = mockList.filter((item, index) => {
      return index < size * page && index >= size * (page - 1)
    })
  }
  return {
    code: '0',
    total: mockList.length,
    data: pageList
  }
}

function getCustomerStatic() {
  return {
    code: '0',
    data: CustomerStatic
  }
}

function getAConstractStatic() {
  return {
    code: '0',
    data: AConstractStatic
  }
}

function getAConstractConfig() {
  return {
    code: '0',
    data: [
      {
        tabName: '合规性',
        tabContent: ['贸易背景真实性审核，具有真实、合法的交易关系和债权 债务关系，能够提供合法、有效、真实的商品购销合同。']
      },
      {
        tabName: '完整性',
        tabContent: ['贸易背景真实性审核，具有真实、合法的交易关系和债权 债务关系，能够提供合法、有效、真实的商品购销合同。', '银行承兑汇票承兑期限和金额必须合理，必须与客户的经 营范围和经营规模相匹配，承兑汇票金额不得超过商品交易 合同金额。', '对不按银行授信后管理规定归档增值税发票复印件的承兑 申请人，在完成整改前暂停办理其银行承兑汇票业务。（申 请人须按照协议约定在承兑开出后2个月内提供与交易合同 相吻合的增值税发票）']
      },
      {
        tabName: '准确性',
        tabContent: ['银行承兑汇票承兑期限和金额必须合理，必须与客户的经 营范围和经营规模相匹配，承兑汇票金额不得超过商品交易 合同金额。', '对不按银行授信后管理规定归档增值税发票复印件的承兑 申请人，在完成整改前暂停办理其银行承兑汇票业务。（申 请人须按照协议约定在承兑开出后2个月内提供与交易合同 相吻合的增值税发票）']
      },
      {
        tabName: '合法性',
        tabContent: ['贸易背景真实性审核，具有真实、合法的交易关系和债权 债务关系，能够提供合法、有效、真实的商品购销合同。']
      },
      {
        tabName: '1111',
        tabContent: ['贸易背景真实性审核，具有真实、合法的交易关系和债权 债务关系，能够提供合法、有效、真实的商品购销合同。']
      },
      {
        tabName: '2222',
        tabContent: ['贸易背景真实性审核，具有真实、合法的交易关系和债权 债务关系，能够提供合法、有效、真实的商品购销合同。']
      },
      {
        tabName: '3333',
        tabContent: ['贸易背景真实性审核，具有真实、合法的交易关系和债权 债务关系，能够提供合法、有效、真实的商品购销合同。']
      },
    ]
    //configList
  }
}

function getRiskWarningList(config) {
  const {page = 1, size = 10} = config.query
  let pageList
  if (page && size) {
    pageList = RiskWarningList.filter((item, index) => {
      return index < size * page && index >= size * (page - 1)
    })
  }
  return {
    code: '0',
    total: RiskWarningList.length,
    data: pageList
  }
}

function getTaskTypeList() {
  return {
    code: '0',
    data: [
      {id: 1, label: '客户管理'},
      {id: 2, label: '授信管理'},
      {id: 3, label: '押品管理'},
      {id: 4, label: '合同管理'},
      {id: 5, label: '用信管理'},
      {id: 6, label: '放款管理'},
      {id: 7, label: '贷后管理'},
      {id: 11, label: "客户信息补充", pID: 1, icon: 'yu-icon-calendar'},
      {id: 12, label: "客户信息变更", pID: 1, icon: 'yu-icon-center'},
      {id: 13, label: "客户移交", pID: 1, icon: 'yu-icon-chart1'},
      {id: 21, label: "对公授信申请", pID: 2, icon: 'yu-icon-chart2'},
      {id: 22, label: "授信申请打回", pID: 2, icon: 'yu-icon-cloud-services'},
      {id: 23, label: "授信申请审批", pID: 2, icon: 'yu-icon-financial1'},
      {id: 31, label: "押品变更", pID: 3, icon: 'yu-icon-contacts1'},
      {id: 32, label: "押品管户移交", pID: 3, icon: 'yu-icon-group'},
      {id: 33, label: "权证出库", pID: 3, icon: 'yu-icon-loan'},
      {id: 41, label: "合同签订", pID: 4, icon: 'yu-icon-handbag'},
      {id: 42, label: "合同修改", pID: 4, icon: 'yu-icon-purse'},
      {id: 43, label: "合同新增", pID: 4, icon: 'yu-icon-setting1'},
      {id: 51, label: "展期申请", pID: 5, icon: 'yu-icon-measure'},
      {id: 52, label: "业务调查", pID: 5, icon: 'yu-icon-network'},
      {id: 61, label: "放款申请", pID: 6, icon: 'yu-icon-loop'},
      {id: 71, label: "定期检查", pID: 7, icon: 'yu-icon-guarantee'},
      {id: 72, label: "不定期检查", pID: 7, icon: 'yu-icon-funnel'},
    ]
  }
}

function getExpirationStatic() {
  return {
    code: '0',
    data: [
      {
        iconSrc: 'icon-xin',
        type: '授信到期',
        household: Math.ceil(Math.random() * 100),
        stroke: Math.ceil(Math.random() * 100)
      },
      {
        iconSrc: 'icon-yuqi',
        type: '还款到期',
        household: Math.ceil(Math.random() * 100),
        stroke: Math.ceil(Math.random() * 100)
      },
      {
        iconSrc: 'icon-daoqi',
        type: '到期收费',
        household: Math.ceil(Math.random() * 100),
        stroke: Math.ceil(Math.random() * 100)
      }],
  }
}

function getCreditApproveList(config) {
  const {page = 1, size = 10, keyWord} = config.body
  let mockList = CreditApproveList.filter(item => {
    if (keyWord) {
      return item.taskId.indexOf(keyWord) > -1 || item.cusId.indexOf(keyWord) > -1 || item.cusName.indexOf(keyWord) > -1
    }
    return true
  })
  mockList = dealSort(config.body.sort, mockList)
  let pageList
  if (page && size) {
    pageList = mockList.filter((item, index) => {
      return index < size * page && index >= size * (page - 1)
    })
  }
  return {
    code: '0',
    total: mockList.length,
    data: pageList
  }
}

export default [
  {
    url: '/api/xmhadvertisement/useradvert',
    type: 'get',
    response: portalAdvertisementInfoShow
  },
  {
    url: '/banner/showBanner',
    type: 'post',
    response: showBanner
  },
  {
    url: '/information/showTitle',
    type: 'post',
    response: showTitle
  },
  {
    url: '/menuClickrecord/findListLimit',
    type: 'post',
    response: findListLimitSix
  },
  {
    url: '/splcCustomerTeamView/myCustomer',
    type: 'post',
    response: myCustomer
  },
  {
    url: '/rwsAmpsIsaApi',
    type: 'post',
    response: rwsAmpsIsaApi
  },
  {
    url: '/portalWorkbenchCard/selectSystemSaveSecIcon',
    type: 'post',
    response: selectSystemSaveSecIcon
  },
  {
    url: '/msgCntr/alertList',
    type: 'post',
    response: alertList
  },
  {
    url: '/portalWorkbenchCard/selectMktSaveSecIcon',
    type: 'post',
    response: selectMktSaveSecIcon
  },
  {
    url: `${backend.mockService}/tools/list`,
    type: 'post',
    isprod: true,
    response: getToolsList
  },
  {
    url: `${backend.mockService}/quickEntrance/alllist`,
    type: 'post',
    isprod: true,
    response: getQuickEntranceAllList
  },
  {
    url: `${backend.mockService}/quickEntrance/list`,
    type: 'post',
    isprod: true,
    response: getQuickEntranceList
  },
  {
    url: `${backend.mockService}/customer/list`,
    type: 'post',
    isprod: true,
    response: getCustomerList
  },
  {
    url: `${backend.mockService}/customer/static`,
    type: 'post',
    isprod: true,
    response: getCustomerStatic
  },
  {
    url: `${backend.mockService}/approveConstract/list`,
    type: 'post',
    isprod: true,
    response: getAConstractList
  },
  {
    url: `${backend.mockService}/monitoryRepayment/list`,
    type: 'post',
    isprod: true,
    response: getMonitoryRepayment
  },
  {
    url: `${backend.mockService}/approveConstract/static`,
    type: 'post',
    isprod: true,
    response: getAConstractStatic
  },
  {
    url: `${backend.mockService}/approveConstract/getConfigById`,
    type: 'post',
    isprod: true,
    response: getAConstractConfig
  },
  {
    url: `${backend.mockService}/riskwarning/list`,
    type: 'post',
    isprod: true,
    response: getRiskWarningList
  }, {
    url: `${backend.mockService}/task/type`,
    type: 'post',
    isprod: true,
    response: getTaskTypeList
  }, {
    url: `${backend.mockService}/expiration/static`,
    type: 'post',
    isprod: true,
    response: getExpirationStatic
  }, {
    url: `${backend.mockService}/creditApprove/list`,
    type: 'post',
    isprod: true,
    response: getCreditApproveList
  },
]
