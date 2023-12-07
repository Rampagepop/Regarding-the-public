import Mock from 'mockjs'

export const List = []
const count = 66

// 生成模拟数据
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    infTitle: '@ctitle(5, 10)',
    customerType: 'A类客户',
    certType: '组织机构代码证',
    certNo: '@natural'
  }))
}

/**
 * 查询数据
 * 默认条件过滤：type|title|createAt
 * @param {*} config 请求参数:
 * 1) post请求通过config.body
 * 2) get请求通过config.query
 */
const queryListFn = config => {
  const { keyWord, page, size } = config.query

  let mockList = List.filter(item => {
    // 模糊匹配
    if (keyWord && item.infTitle.indexOf(keyWord) < 0) return false
    return true
  })

  mockList = mockList.reverse()

  let pageList
  if (page && size) {
    pageList = mockList.filter((item, index) => {
      return index < size * page && index >= size * (page - 1)
    })
  }

  return {
    code: '0',
    total: mockList.length,
    data: {
      infoEntities: pageList,
      infosNum: mockList.length
    }
  }
}

/**
 * 导出服务，{url,type,response}
 */
export default [
  {
    url: '/customer/query',
    type: 'get',
    isprod: true,
    response: queryListFn
  }
]
