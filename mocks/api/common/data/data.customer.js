import Mock from 'mockjs'

export const CustomerList = []
const tmpCustomerCount = Mock.mock('@integer(10, 1000)')
const stockCustomerCount = Mock.mock('@integer(10, 1000)')
export const CustomerStatic = {
  total: tmpCustomerCount + stockCustomerCount + Mock.mock('@integer(10, 1000)'), // 该值没有必然的大于另外两个值之和
  temp: tmpCustomerCount,
  stock: stockCustomerCount
}
const count = 66

// 生成模拟数据
for (let i = 0; i < count; i++) {
  CustomerList.push(Mock.mock({
    certNo: '@upper(@guid()', // 91370285YC9WPT74X4
    'certType|1': ['Ent01', 'Ind01', 'Ind11'], // 证件类型 Ent01组织机构代码证、Ind01身份证、Ind11其他企业证件
    customerId: 'kh' + '@integer(10000000, 99999999)', // 客户编号
    customerName: '@ctitle(3, 10)' + '有限公司', // 客户名称
    'customerType|1': ['01', '0101', '0102', '0104'], // 客户类型 01单一(法人)客户、0101法人企业、0102非法人企业、0104事业单位
    'status|1': ['正式客户', '临时客户'], // 客户状态

    cusId: "CP20220921" + '@integer(100000, 999999)',
    cusName: '@ctitle(3, 10)' + '有限公司',
    'idTyp|1': ["营业执照"],
    idNo: '@upper(@guid()',
    'icCusTyp|1': ["其他自然人", "小微企业主", "个体工商户", "机关", "企业", "事业单位", "社会团体"], // 客户类型,
    'cusTyp|1': ['对公客户', '个人客户'], // 客户分类
    manMgrId: "zhangsan",
    manMgrName: "张三",
    mgrBch: "200009",
    mgrBchName: "宇信银行南京滨江支行",
    crtDt: "2022-09-21 14:42:23",
    'cusSts|1': ["正式客户", "正式客户", "正式客户", "临时客户", "临时客户", "正式客户(草稿)", "正式客户(草稿)", "被合并注销", "临时客户", "注销"],
    money: '@float(1000000.00, 9999999.99)', // money
  }))
}
