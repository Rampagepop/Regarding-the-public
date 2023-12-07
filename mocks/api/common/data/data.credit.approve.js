import Mock from 'mockjs'

export const CreditApproveList = []
const count = 120

// 生成模拟数据
for (let i = 0; i < count; i++) {
  CreditApproveList.push(Mock.mock({
    taskId: "CA20220921" + '@integer(100000, 999999)',
    cusId: 'kh' + '@integer(10000000, 99999999)', // 客户编号
    cusName: '宇信科技', // 客户名称
    'creditTyp|1': ['综合授信', '单笔单批'],
    'bizTyp|1': ['并购贷款', '担保类业务', '固定资产类贷款', '流动资金类贷款', '贸易融资', '票据贴现', '其他类'],
    'creditApplyTyp|1': ['新增', '续作', '再议', '复议', '展期'],
    'creditAmt|1000-120000': 100,
    'ddl|1': ["1个月", "2个月", "6个月", "1年", "2年"],
    org: "宇信银行",
    approveTime: '@float(1,80)',
  }))
}
