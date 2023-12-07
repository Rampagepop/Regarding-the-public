import Mock from 'mockjs'

export const AConstractList = []
export const monitoryRepayment = []
export const configList = [] //根据id获取到相应的配置
const tmpCustomerCount = Mock.mock('@integer(10, 1000)')
const stockCustomerCount = Mock.mock('@integer(10, 1000)')
export const AConstractStatic = {
  total: tmpCustomerCount + stockCustomerCount + Mock.mock('@integer(10, 1000)'), // 该值没有必然的大于另外两个值之和
  temp: tmpCustomerCount,
  stock: stockCustomerCount
}
const count = 12
const num = 4
// 生成模拟数据
for (let i = 0; i < count; i++) {
  AConstractList.push(Mock.mock({
    businessNumber: '@integer(100000000, 999999999)',// 任务流水号 超链接
    id: '@upper(@guid()', // 91370285YC9WPT74X4
    customerId: 'kh' + '@integer(10000000, 99999999)', // 客户编号
    customerName: '@ctitle(3, 10)' + '有限公司', // 客户名称
    constractId: 'ct' + '@integer(10000000, 99999999)', // 合同编号
    'constractType|1': ['最高额担保合同', '普通贷款合同', '贴现协议', '贸易融资合同', '福费廷合同', '开证合同', '银承合同', '保函合同', '最高额担保合同', '一般担保合同'], // 合同类型
    'currency|1': ['人民币', '美元', '日元', '欧元', '英镑', '新台湾元', '香港元', '韩元', '澳元', '加元', '德国马克', '法国法郎', '澳门币', '瑞士法郎', '新加坡元', '卢布', '新西兰元'], // 金额（万）
    org: '@ctitle(3, 10)' + '机构', // 责任机构
    'momey|100-100000000': 100,
    entryTime: '@date("yyyy-MM-dd")', // 登记日期
  }))
}
for (let i = 0; i < num; i++) {
  configList.push(Mock.mock({
    'tabName|1': ['合规性', '完整性', '准确性', '合法性'], // 配置名称
    'tabContent|0-3': ['贸易背景真实性审核，具有真实、合法的交易关系和债权 债务关系，能够提供合法、有效、真实的商品购销合同。', '银行承兑汇票承兑期限和金额必须合理，必须与客户的经 营范围和经营规模相匹配，承兑汇票金额不得超过商品交易 合同金额。', '对不按银行授信后管理规定归档增值税发票复印件的承兑 申请人，在完成整改前暂停办理其银行承兑汇票业务。（申 请人须按照协议约定在承兑开出后2个月内提供与交易合同 相吻合的增值税发票）'], // 配置内容
  }))
}


for (let i = 0; i < count; i++) {
  monitoryRepayment.push(Mock.mock({
    id: '@upper(@guid()', // 91370285YC9WPT74X4
    'customerName|1': ['宇信科技', 'xx有限公司'], // 客户名称
    'ywpz|1': ['并购贷款', '担保类业务', '固定资产类贷款', '流动资金类贷款', '贸易融资', '票据贴现', '其他类'],
    'currency|1': ['人民币', '美元', '日元', '欧元', '英镑', '新台湾元', '香港元', '韩元', '澳元', '加元', '德国马克', '法国法郎', '澳门币', '瑞士法郎', '新加坡元', '卢布', '新西兰元'], // 金额（万）
    'ye|100-100000000': 100,
    'yhlxje|100-100000000': 100,
    'yhfqhbje|100-100000000': 100,
    ffr: '@date("yyyy-MM-dd")', // 发放日
    dqr: '@date("yyyy-MM-dd")', // 到期日
    'zhye|100-100000000': 10,
    'sfze|1': ['是', '否'],
    cusManager: '@name(3, 5)',
    ghfxjl: '@name(3, 5)',
    ghbm: '朝阳支行',
    org: '北京分行', // 责任机构
  }))
}
// configList.push(Mock.mock({
//     'tabList|0-6': [
//         {
//     'tabName|1': ['合规性','完整性','准确性','合法性'], // 配置名称
//     'tabContent|0-6': ['1. 贸易背景真实性审核，具有真实、合法的交易关系和债权 债务关系，能够提供合法、有效、真实的商品购销合同。', '2. 银行承兑汇票承兑期限和金额必须合理，必须与客户的经 营范围和经营规模相匹配，承兑汇票金额不得超过商品交易 合同金额。','3. 对不按银行授信后管理规定归档增值税发票复印件的承兑 申请人，在完成整改前暂停办理其银行承兑汇票业务。（申 请人须按照协议约定在承兑开出后2个月内提供与交易合同 相吻合的增值税发票）'], // 配置内容
//         }
//     ]
// }))
