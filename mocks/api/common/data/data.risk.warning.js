// 风险预警数据
import Mock from 'mockjs'

export const RiskWarningList = []
const count = 20

// 生成模拟数据
for (let i = 0; i < count; i++) {
  const item = Mock.mock({
    'statusRs|1': [1, 2, 3], // 风险预警 状态
    customerName: '宇信科技', // 客户名称
    updateOrg: '宇信科技', // 客户名称
    userName: '@cname', // 操作人员名称
    'content': '@cparagraph()', // 原因
    'update': '@date', // 处理时间
    'type|1': [1, 2, 3], // 类型---风险预警需要的字段

    bizUserId: 'kh' + '@integer(10000000, 99999999)', // 客户编号
    bizUserName: '宇信科技', // 客户名称
    'reason': '', // 原因
    'tipCon': '',
    'startTime': '@date',
    'endTime': '@date',
    'dueTime': '@date("2022-MM-dd")',
    'infoType|1': ["法律风险", "经营风险"],
    'level|1': ['一级', '二级', '三级'],
    'status|1': ['1', '0'], //
    'orgUserName': "@cname",
    'orgName': "宇信集团"
  })
  if (item.infoType == "法律风险") {
    item.tipCon = "该公司被上诉至上海市第一中级人民法院，案由：服务合同纠纷"
    item.reason = "该公司合法权益获得法院支持，案由：服务合同纠纷"
  } else if (item.infoType == "经营风险") {
    item.tipCon = "该公司投资的北京全联网络科技股份有限公司发生了法定代表人变更"
    item.reason = "该法定代表人变更不影响该公司日常经营"
  }
  if(item.status == "1") {
    item.endTime = ""
    item.reason = ""
    item.orgUserName = ""
    item.orgName = ""
  }
  RiskWarningList.push(item)
}
