import {
  MessageBox,
  Message
} from 'yuwp-ui'
import XLSX from 'xlsx'
import {
  theme,
  menumodel,
  ssl,
  url,
  monitorAble
} from '@/config'
import {
  getToken
} from '@/utils/oauth'
import {
  storage
} from '@/utils/'
import frameConfig from '@/config/frame'

/**
 * 显示信息
 * @param {string} msg 待显示的信息
 * @param {String} type 显示信息类型 error|warning|info|success
 * @param {Integer} duration 显示信息长度,单位秒,默认5秒
 */
export function showMessage(msg, type = 'error', duration = 5) {
  msg && Message({
    message: msg,
    type: type,
    duration: duration * 1000
  });
}
/**
 * 显示信息
 * @param {string} msg 待显示的信息
 * @param {String} type 显示信息类型 error|waring|info|success
 */
export function showMessageAlert(msg, type = 'error') {
  msg && MessageBox({
    message: msg,
    type: type
  });
}

/**
 * 日期 - 替换成 年 月 
 * @param {string} date 待显示的信息
 */
export function formatDate(str) {
  if (str) {
    var arr = str.split(" ")
    var firstList = arr[0].split("-")
    if (arr.length > 1) {
      var lastList = arr[1].split(":")
      str = `${firstList[0]}-${firstList[1]}-${firstList[2]}`
    } else {
      str = `${firstList[0]}-${firstList[1]}-${firstList[2]}`
    }
    // str = `${firstList[0]}年${firstList[1]}月${firstList[2]}日 ${lastList[0]}时${lastList[1]}分${lastList[2]}秒`
  }
  return str
}

/**
 * 获取当前天日期
 */
export function getCurrentDate() {
  var date = new Date()
  const month = date.getMonth() + 1
  return date.getFullYear() + "-" + month + "-" + date.getDate()
};

/**
 * 本地导出excel
 * @param {Object} options 导出参数
 */
export function exportExcelByTable(options) {
  let tableRef = options.ref
  let colums = tableRef.tableColumns
  let tableColumns = colums.concat([])
  let collectionHtml = tableRef.$el.getElementsByClassName('el-table__header-wrapper')[0].getElementsByTagName('tr')
  let rowspanIndex = 1
  let maxrowspan = function (list, parList) {
    if (list && list instanceof Array === true) {
      for (let i = 0; i < list.length; i++) {
        const obj = list[i]
        if (obj.children && obj.children instanceof Array === true) {
          obj.colspan = obj.children.length - 1
          if (rowspanIndex < obj.children.length) {
            parList.map(function (obj_, index_) {
              if (obj.label !== obj_.label) {
                obj_.rowspan = (obj_.rowspan === undefined ? 0 : obj_.rowspan) + 1
              }
              return true
            })
            rowspanIndex += 1
          }
          maxrowspan(obj.children, obj.children) // fixed: This function expects 2 arguments, but 3 were provided
        }
      }
    }
  }
  maxrowspan(tableColumns, tableColumns)
  const getMerge = function (obj, index, rownum, cellNum) {
    const merges_ = {
      s: { // s为开始
        c: 0, // 开始列
        r: 0 // 开始取值范围
      },
      e: { // e结束
        c: 0, // 结束列
        r: 0 // 结束范围
      }
    }
    if (obj.colspan === 0 && !cellNum) {
      merges_.s.c = index
      merges_.e.c = index
    } else if (obj.colspan === 0 && cellNum) {
      merges_.s.c = cellNum
      merges_.e.c = cellNum
    } else if (obj.colspan !== 0 && !cellNum) {
      merges_.s.c = index
      merges_.e.c = parseInt(index + obj.colspan)
    } else if (obj.colspan !== 0 && cellNum) {
      merges_.s.c = cellNum
      merges_.e.c = parseInt(cellNum + obj.colspan)
    }
    merges_.s.r = rownum
    merges_.e.r = parseInt(rownum + obj.rowspan)
    return merges_
  }

  const head = []
  const merges = []
  const headSheel = []
  const letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let rownum = 0
  let rowspanIndex_ = 1
  let addIndex = 0
  let exportRule = function (list, parList, cellNum) {
    if (list && list instanceof Array === true) {
      for (let i = 0; i < list.length; i++) {
        const obj = list[i]
        head.push(obj.label)
        obj.rowspan = obj.rowspan === undefined ? 0 : obj.rowspan
        obj.colspan = obj.colspan === undefined ? 0 : obj.colspan
        if (obj.children && obj.children instanceof Array === true) {
          headSheel.push(letter.charAt(parseInt(i + rownum)) + '1')
          const mg = getMerge(obj, i, rownum)
          merges.push(mg)
          rowspanIndex_ += 1
          rownum = rownum + 1
          addIndex = 0
          exportRule(obj.children, obj.children, i)
          rownum = rownum - 1
          addIndex = parseInt(obj.children.length - 1)
        } else {
          const mg = getMerge(obj, i + addIndex, rownum, cellNum + i)
          merges.push(mg)
          if (cellNum) {
            headSheel.push(letter.charAt(cellNum + i) + rowspanIndex_)
          } else {
            headSheel.push(letter.charAt(parseInt(i + rowspanIndex_ - 1)) + '1')
          }
        }
      }
    }
  }
  exportRule(tableColumns, tableColumns)
  // 获取列的字段名称
  let getColumnsName = function (name, tableColumns) {
    let key
    for (let i = 0; i < tableColumns.length; i++) {
      if (tableColumns[i].children && tableColumns[i].children instanceof Array === true) {
        key = getColumnsName(name, tableColumns[i].children)
      } else if (name === tableColumns[i].label && tableColumns[i].prop) {
        key = tableColumns[i].prop
        break
      }
    }
    return key
  }
  const headList_ = []
  let key
  for (let i = 0; i < head.length; i++) {
    key = getColumnsName(head[i], tableColumns)
    if (key) {
      headList_[headList_.length] = key
    }
  }

  let getColumnsDataCode = function (column, tableColumns) {
    let code
    for (let i = 0; i < tableColumns.length; i++) {
      if (tableColumns[i].children && tableColumns[i].children instanceof Array === true) {
        key = getColumnsName(column, tableColumns[i].children)
      } else if (column === tableColumns[i].prop && tableColumns[i].prop) {
        code = tableColumns[i].dataCode
        break
      }
    }
    return code
  }
  let data = []
  let tableData = []
  if (options.importType === 'page') {
    tableData = tableRef.data
  } else if (options.importType === 'selected') {
    tableData = tableRef.selections
  } else if (options.importType === 'service') {
    yufp.service.request({
      url: options.url,
      async: false,
      data: options.param,
      method: options.method ? options.method : 'GET',
      callback: function (code, message, response) {
        if (options.jsonData) {
          const tmp = options.jsonData.split('.')
          let obj = response
          for (let z = 0; z < tmp.length; z++) {
            if (!obj) {
              break
            }
            obj = obj[tmp[z]]
          }
          tableData = obj
        } else {
          tableData = response.data
        }
      }
    })
  }
  for (let i = 0; i < tableData.length; i++) {
    const o = {}
    const rowData = tableData[i]
    for (let j = 0; j < headList_.length; j++) {
      const k = headList_[j]
      const code = getColumnsDataCode(k, tableColumns)
      if (code) {
        const val = yufp.lookup.convertKey(code, rowData[k])
        o['' + k + ''] = val
      } else {
        o['' + k + ''] = rowData[k]
      }
    }
    data.push(o)
  }

  for (let i = 1; i < collectionHtml.length; i++) {
    data.unshift({})
  }
  const wopts = {
    bookType: 'xlsx',
    bookSST: true,
    type: 'binary'
  } // 这里的数据是用来定义导出的格式类型
  let saveAs = function (obj, fileName) { // 当然可以自定义简单的下载文件实现方式
    const tmpa = document.createElement('a')
    tmpa.download = fileName || '下载'
    tmpa.href = URL.createObjectURL(obj) // 绑定a标签
    tmpa.click() // 模拟点击实现下载
    setTimeout(function () { // 延时释放
      URL.revokeObjectURL(obj) // 用URL.revokeObjectURL()来释放这个object URL
    }, 100)
  }
  let s2ab = function (s) {
    if (typeof ArrayBuffer !== 'undefined') {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF
      }
      return buf
    } else {
      const buf = new Array(s.length)
      for (let i = 0; i !== s.length; ++i) {
        buf[i] = s.charCodeAt(i) & 0xFF
      }
      return buf
    }
  }
  const wb = {
    SheetNames: ['Sheet1'],
    Sheets: {},
    Props: {}
  }
  data = XLSX.utils.json_to_sheet(data)
  for (let i = 0; i < headSheel.length; i++) {
    data[headSheel[i]] = {
      t: 's',
      v: head[i]
    }
  }
  data['!merges'] = merges
  wb.Sheets['Sheet1'] = data
  saveAs(new window.Blob([s2ab(XLSX.write(wb, wopts))], {
    type: 'application/octet-stream'
  }), options.fileName + '.' + (wopts.bookType === 'biff2' ? 'xls' : wopts.bookType))
  tableRef = colums = tableColumns = collectionHtml = maxrowspan = exportRule = getColumnsName = getColumnsDataCode = saveAs = s2ab = options = null
}

/**
 * 获取默认皮肤对象
 */
export function getDefaultTheme() {
  const themes = frameConfig.baseFrameOptions.themesList.filter(item => {
    return item.id === theme
  })
  return themes.length > 0 ? themes[0] : null
}
/**
 * 获取默认布局对象
 */
export function getDefaultMenuModel() {
  const model = frameConfig.baseFrameOptions.modelList.filter(item => {
    return item.id === menumodel
  })
  return model.length > 0 ? model[0] : null
}
/**
 * 获取当前选中系统名称
 */
export function getSystemName() {
  const systemName = frameConfig.baseFrameOptions.appOptions.filter(item => {
    return item.checked
  })
  if (systemName && systemName.length > 0) {
    return systemName[0]['applicationName']
  }
  return ''
}
/**
 * 获取全路径
 */
export function getUrl(param) {
  let paramUrl = param.url || param.name
  if (!paramUrl) {
    throw new Error('Yufp.service.request: 未设置请求URL')
  }
  const reg = /^(http|https):\/\//
  // url请求未附带http(s)://前缀，则按yufp.settings.url及ssl添加前缀
  if (!reg.test(paramUrl)) {
    let protocol
    let prefixUrl = url || ''
    // yufp.settings.url 非空，即非默认同源模式，计算服务端URL源路径
    if (prefixUrl) {
      if (reg.test(prefixUrl)) {
        protocol = ''
      } else if (ssl) {
        protocol = 'https://'
      } else {
        protocol = 'http://'
      }
      prefixUrl = protocol + prefixUrl
    }
    paramUrl = (`/${paramUrl}`).replace(/^\/\//, '/') // 添加前缀
    paramUrl = (window.yufp.basePath || '') + paramUrl // 添加basePath
    paramUrl = prefixUrl + paramUrl // 组合origin
  }
  return paramUrl
}

/**
 * 为url添加token信息
 * @param url
 * @returns {string}
 */
function addTokenInfo(path) {
  var token = 'access_token=';
  var _url = '';
  if (path === null || path === '') {
    return _url;
  }

  if (!path.indexOf(token) > -1) {
    _url = path + (path.indexOf('?') > -1 ? '&' : '?') + token + getToken().access_token;
  }
  return _url;
};
/**
 * 下载文件
 */
export function download(path) {
  if (path) {
    if (path.indexOf('http') <= -1) {
      // 当不包含http时拼接gateway地址
      path = getUrl({
        url: path
      });
    }
  } else {
    showMessage('必须设置请求url!', 'warning');
  }
  // url添加token
  path = addTokenInfo(path);
  // 模拟a标签进行下载
  const a = document.createElement('a');
  a.href = path;
  if (window.fireEvent) {
    window.open(a.href);
  } else {
    a.click();
  }
};

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className, oid) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  classString = classString.replace(/\s+/, '').replace(oid, '');
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += ' ' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * 切换皮肤
 * @param {String} theme 选中皮肤
 */
export function changeTheme(theme, oid) {
  const th = theme.id
  try {
    require(`@/assets/${th}/dist.min.css`)
    toggleClass(document.body, th, oid)
  } catch (error) {
    toggleClass(document.body, th, oid)
  }
}
/**
 * 更新界面是否紧凑模式
 * @param {Boolean} isCompact 是否紧凑模式
 */
export function changeSizeModel(isCompact) {
  const target = document.getElementsByTagName('link');
  // 如果切换为紧凑模式
  if (isCompact) {
    const link = document.createComment('link')
    link.href = '@/assets/common/compact.css'
    document.head.appendChild(link)
    const dom = document.querySelector('.yu-frame-body');
    let classname = dom.getAttribute('class');
    if (classname.indexOf('compact') === -1) {
      classname = classname + ' compact';
      dom.setAttribute('class', classname);
    }
  } else {
    for (let i = 0; i < target.length; i++) {
      const href = target[i].getAttribute('href');
      if (href.indexOf('compact') > -1) {
        target[i].parentNode.removeChild(target[i]);
      }
    }
  }
}
/**
 * 格式化时间
 */
export function parseTime(time, cFormat) {
  console.log("111111111")
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d}';
  let date = null;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (('' + time).length === 10) {
    } else {
      time = parseInt(time) * 1000;
    };
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, function (result, key) {
    let value = formatObj[key];
    if (key === 'a') {
      return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    };
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return timeStr;
}
/**
 * 将时间转成字符串
 */
export function formatTime(time) {
  return (time.hours < 10 ? '0' + time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' + time.minutes : time.minutes);
}
/**
 * 获取基础路径配置信息
 */
export function getBaseUrl() {
  const devEnv = process.env.NODE_ENV === 'development' // 开发环境
  const baseApi = process.env.VUE_APP_BASE_API // 应用服务前缀URL
  const proxyPrefix = ''; // process.env.VUE_APP_PROXY_PREFIX // 代理API前缀
  const match = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?/i // 匹配URL(协议+域名+端口)

  const matchResult = match.exec(baseApi)
  return devEnv && matchResult ? proxyPrefix + (matchResult[4] || '') : baseApi
}
/**
 * [获取URL中的参数名及参数值的集合]
 * 示例URL:getrequest.html?uid=admin&rid=1&fid=2&name=小明
 * @param {[string]} urlStr [当该参数不为空的时候，则解析该url中的参数集合]
 * @return {[string]}       [参数集合]
 */
export function getQueryParams(urlStr) {
  const url = decodeURI((urlStr && ('?' + urlStr)) || window.location.search)
  if (urlStr.indexOf('=') === -1) {
    return urlStr
  }
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    const strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
    }
  }
  return theRequest;
};
/**
 * 获取公钥字符串
 */
export function getRSAPublicKey() {
  return 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrDUHc85ADQVxXRP4M90nqttWoZctV6JJVVdPjIle5vd9G2/4kgIhNc78Jd+ENxg+n4Gj9UMwNhJmb2jnMaW3zyGB+qi/ZrMO5dEUhW8salirzRgGg/4Arz4ObPmCWlZsws3Ij/3IEsFD3vMdIZD2j8b33DAbj47PjcCcMbtHYuQIDAQAB';
}


/** 
 * 根据数组和对应属性返回满足el-tree的树形数据,
 *id: 对应id,
 *pid: 对应pid,
 *label: 对应展示字段,
 *root: 如果值为空或不存在则计算
 */
export function genTree(data, attr) {
  var root = {};
  if (data == null || data.length == 0) {
    return [attr.root];
  }
  if (attr.root == null || attr.root == undefined || attr.root == '') {
    root.id = getTreeRoot(data, attr)[attr.pid];
  } else if (typeof attr.root == 'object') {
    var root = attr.root;
    root.id = root[attr.id] === undefined ? root.id : root[attr.id];
    root.pid = root[attr.pid] === undefined ? root.pid : root[attr.pid];
    root.label = root[attr.label] === undefined ? root.label : root[attr.label];
  } else {
    for (var i in data) {
      if (data[i][attr.id] == attr.root) {
        root.id = data[i][attr.pid];
        break;
      }
    }
    root.id = root.id == undefined ? attr.root : root.id;
  }

  var genTreeData = function (data, attr) {
    var ckey = {},
      pkey = {};

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      row.id = row[attr.id];
      row.pid = row[attr.pid];
      row.label = row[attr.label];
      row.children = [];

      ckey[row.id] = row;
      if (pkey[row.pid]) {
        pkey[row.pid].push(row);
      } else {
        pkey[row.pid] = [row];
      }

      var c = pkey[row.id];
      if (c) {
        row.children = c.concat();
      }

      var p = ckey[row.pid];
      if (p) {
        p.children.push(row);
      }
    }
    return pkey;
  };

  if (root.label) {
    root.children = genTreeData(data, attr)[root.id];
    return [root];
  }
  return genTreeData(data, attr)[root.id];
}

/**
 * 获取对应数据的根节点
 * @param data
 * @param attr
 */
export function getTreeRoot(data, attributes) {
  var _root = {};
  if (data != null && data.length != 0) {
    _root = data[0];
    for (var k = 1; k < data.length; k++) {
      var i = 1;
      for (; i < data.length; i++) {
        if (data[i][attributes.id] == _root[attributes.pid]) {
          _root = data[i];
          break;
        }
      }
      if (i == data.length - 1) {
        break;
      }
    }
    return _root;
  }
}
/**
 * @created by zhangkun6
 * @updated by 2018/01/14
 * @description 数字金额格式化(千分位)
 */
export function moneyFormatter(money, num) {
  /*
   * 参数说明：
   * money：要格式化的数字
   * num：保留几位小数
   * */
  num = num >= 0 && num <= 20 ? num : 2;
  money = parseFloat((money + '').replace(/[^\d.-]/g, '')).toFixed(num) + '';
  const l = money.split('.')[0].split('').reverse(),
    r = money.split('.')[1];
  let t = '';
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '');
  }
  let formatNum = 0;
  if (num == 0) {
    formatNum = t.split('').reverse().join('');
  } else {
    formatNum = t.split('').reverse().join('') + '.' + r;
  }
  return formatNum;
};

export function nagitiveFormatter(money, num) {
  /*
   * 参数说明：
   * money：要格式化的数字
   * num：保留几位小数
   * */
  num = num >= 0 && num <= 20 ? num : 2;
  money = parseFloat((money + '').replace(/[^\d.-]/g, '')).toFixed(num) + '';
  const l = money.split('.')[0].split('').reverse(),
    r = money.split('.')[1];
  let t = '';
  for (let i = 0; i < l.length; i++) {
    if ((i + 1) % 3 === 0 && i + 1 !== l.length && l[i + 1] !== '-') {
      t += l[i] + ',';
    } else {
      t += l[i] + '';
    }
  }
  let formatNum = 0;
  if (num == 0) {
    formatNum = t.split('').reverse().join('');
  } else {
    formatNum = t.split('').reverse().join('') + '.' + r;
  }
  return formatNum;
};

/**
 * 日期大于、小于校验
 * date 选择日期
 * compaType 比较类型（大于/小于）
 * message 错误提示信息
 */
export function cmpaDate(date, compaType, message) {
  var current = new Date().getTime();
  if (compaType == "less") {
    if (date >= current) {
      showMessage(message + '应该小于当前日期！', 'error');
      return false;
    } else {
      return true;
    }
  } else {
    if (date <= current) {
      showMessage(message + '应该大于当前日期！', 'error');
      return false;
    } else {
      return true;
    }
  }
};

/**
 * 日期两者之间比较校验
 * date 选择日期
 * compaDate 需要比较日期
 * message 错误提示信息
 */
export function compaBtwnDate(date, message, strtDate, strtMsg, endDate, endMsg) {
  const current = new Date().getTime();
  if (typeof date == "object") {
    date = date.getTime();
  } else {
    date = new Date(date).getTime();
  }
  if (typeof strtDate == "object") {
    strtDate = strtDate.getTime();
  } else {
    strtDate = new Date(strtDate).getTime();
  }
  if (typeof endDate == "object") {
    endDate = endDate.getTime();
  } else {
    endDate = new Date(endDate).getTime();
  }
  if (strtDate <= date && date <= endDate) {
    return true;
  } else {
    showMessage(message + '应该在' + strtMsg + '与' + endMsg + '之间', 'error');
    return false;
  }
};


/**
 * 开始日期和结束日期比较
 * date 选择日期
 * compaDate 需要比较日期
 * message 错误提示信息
 * compMsg 比较日期提示信息
 * type 比较类型
 */
export function compaStrtToEndDate(date, message, compaDate, compMsg, type) {
  const current = new Date().getTime();
  let exdate = "";
  let precompaDate = "";
  if (typeof date == "object") {
    exdate = date.getTime();
  } else {
    exdate = new Date(date).getTime();
  }
  if (typeof compaDate == "object") {
    precompaDate = compaDate.getTime();
  } else {
    precompaDate = new Date(compaDate).getTime();
  }
  if ((type == "strt" && exdate <= precompaDate && exdate <= current) || (type == "end" && exdate >= precompaDate && exdate >= current ||
    (!compaDate || compaDate == "") && type == "strt" && exdate <= current)) {
    return true;
  } else {
    var tipsMsg = type == "strt" ? "应该小于" : "应该大于";
    showMessage(message + tipsMsg + compMsg, 'error');
    return false;
  }
};


/**
 * 地址赋值
 * date 选择日期
 * compaDate 需要比较日期
 * message 错误提示信息
 */
export function setAdd(prov, city, area, town, cntr) {
  return {
    prov: prov,
    city: city,
    area: area,
    town: town,
    cntr: cntr
  };
};


/**
 * 获取用户信息
 */
export function fetchUserInfo() {
  return {
    userCode: yufp.session.loginCode,
    userName: yufp.session.userName,
    orgId: yufp.session.org.id,
    orgName: yufp.session.org.name
  };
};


/**
 * 根据身份证号码获取出生日期
 * idCard 身份证号码
 */
export function fetchBirth(idCard) {
  var birthDay = "";
  if (idCard != null && idCard !== "") {
    birthDay = idCard.slice(6, 14);
    birthDay = birthDay.replace(/(.{4})(.{2})/, "$1-$2-");
  }
  return birthDay;
};

/**
 * 根据身份证号码获取性别
 * idCard 身份证号码
 */
export function fetchGend(idCard) {
  var sexStr = "";
  if (idCard != null && idCard !== "") {
    if (parseInt(idCard.slice(-2, -1) % 2) == 1) {
      sexStr = "01";
    } else {
      sexStr = "02";
    }
  }
  return sexStr;
};

/**
 * 通过证件类型证件号码查询客户信息
 * types 对公客户/个人客户
 * certType 证件类型
 * certCode 证件号码
 */

export function fetchCustInfo(certTypes, certCode, types, callback) {
  if (certTypes == "" || certCode == "" || certTypes == undefined || certCode == undefined) {
    showMessage("请选择证件类型和证件号码", 'error');
    return {};
  } else {
    const requestUrl = types == "corp" ? "/api/copuCust/q/custCorpDetail" : "/api/copuCust/q/custIndivDetail";
    // 调用接口查询详情
    yufp.service.request({
      method: "GET",
      async: false,
      url: backend.custService + requestUrl,
      data: {
        certType: certTypes,
        certNum: certCode
      },
      callback: function (code, message, response) {
        if (code == 0 && response.code == 0) {
          callback && callback(response.data);
        } else {
          showMessage(response.message);
        }
      }
    });
  }
};

/**
 * 判断列表是否选择数据
 * idCard 身份证号码
 */
export function judgeFn(selection) {
  if (selection.length > 0) {
    return true;
  } else {
    showMessage('请选择一条记录!', 'error');

    return false;
  }
};


/**
 * @created by zhangkun6
 * @updated by 2018/05/03
 * @description 数值百分比显示
 */
export function toPercent(money, num) {
  /*
   * 参数说明：
   * money：要格式化的数字
   * num：保留几位小数
   */
  // num = num > 0 && num <= 20 ? num : 2;
  money = parseFloat(money + '') + '%';
  return money;
};

/**
 * @created by zhangkun6
 * @updated by 2018/01/14
 * @description 数字金额转汉字金额
 */
export function moneyToUpper(money) {
  /*
   * 参数说明：
   * money：要转化的数字
   */
  // 汉字的数字
  var cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  // 基本单位
  var cnIntRadice = ['', '拾', '佰', '仟'];
  // 对应整数部分扩展单位
  var cnIntUnits = ['', '万', '亿', '兆'];
  // 对应小数部分单位
  var cnDecUnits = ['角', '分', '毫', '厘'];
  // 整数金额时后面跟的字符
  var cnInteger = '整';
  // 整型完以后的单位
  var cnIntLast = '元';
  // 最大处理的数字
  var maxNum = 999999999999999.9999;
  // 金额整数部分
  var integerNum;
  // 金额小数部分
  var decimalNum;
  // 输出的中文金额字符串
  var chineseStr = '';
  // 分离金额后用的数组，预定义
  var parts;
  if (money === '') {
    return '';
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    // 超出最大处理数字
    return '';
  }
  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  // 转换为字符串
  money = money.toString();
  if (money.indexOf('.') === -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    const IntLen = integerNum.length;
    for (let i = 0; i < IntLen; i++) {
      const n = integerNum.substr(i, 1);
      const p = IntLen - i - 1;
      const q = p / 4;
      const m = p % 4;
      if (n === '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        // 归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  // 小数部分
  if (decimalNum !== '') {
    const decLen = decimalNum.length;
    for (let i = 0; i < decLen; i++) {
      const n = decimalNum.substr(i, 1);
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum === '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
};

/**
 * @created by zhangkun6
 * @updated by 2018/01/19
 * @description 汉字金额转数字金额
 */
export function upperToMoney(upper) {
  /*
   * 参数说明：
   * upper：要转化的汉字
   */
  // 金额数值
  const num = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  // 汉字的数字
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  // 对应单位的乘积
  const upperMap = [10, 100, 1000];
  // 基本单位
  const cnIntRadice = ['拾', '佰', '仟'];
  // 对应整数部分扩展单位
  // var cnIntUnits = ['万', '亿', '兆'];
  // 对应小数部分单位乘积
  const cnDecMap = [0.1, 0.01];
  // 对应小数部分单位
  const cnDecUnits = ['角', '分'];
  // 金额单位亿之前的数值数组
  let maxArray = [];
  // 金额单位亿和万之间的数值数组
  let middleArray = [];
  // 金额单位万和元之间的数值数组
  let minArray = [];

  const part = upper.split('元');
  // 金额整数部分
  const integerNum = part[0];
  // 金额小数部分
  const decimalNum = part[1].split('');
  if (integerNum.indexOf('亿') !== -1) {
    maxArray = integerNum.split('亿')[0].split('');
    if (integerNum.indexOf('万') !== -1) {
      middleArray = integerNum.split('亿')[1].split('万')[0].split('');
      minArray = integerNum.split('亿')[1].split('万')[1].split('');
    } else {
      minArray = integerNum.split('亿')[1].split('');
    }
  } else if (integerNum.indexOf('万') !== -1) {
    middleArray = integerNum.split('万')[0].split('');
    minArray = integerNum.split('万')[1].split('');
  } else {
    minArray = integerNum.split('');
  }
  const getNum = function (upArray, cnNums, cnRadice, numArray, map) {
    const length = upArray.length;
    let num = 0;
    let sum = 0;
    for (let i = 0; i < length; i++) {
      const index = cnNums.indexOf(upArray[i]);
      const _index = cnRadice.indexOf(upArray[i]);
      if (index !== -1) {
        num += numArray[index];
        if (i === (length - 1)) {
          sum += num;
        }
      }
      if (_index !== -1) {
        num *= map[_index];
        sum += num;
        num = 0;
      }
    }
    return sum;
  };
  const maxSum = getNum(maxArray, cnNums, cnIntRadice, num, upperMap);
  const middleSun = getNum(middleArray, cnNums, cnIntRadice, num, upperMap);
  const minSun = getNum(minArray, cnNums, cnIntRadice, num, upperMap);
  const cesSum = getNum(decimalNum, cnNums, cnDecUnits, num, cnDecMap);
  // 输出的数字金额字符串
  return (maxSum * 100000000) + (middleSun * 10000) + minSun + cesSum;
};

export function object2url(params) {
  const queryStr = []
  Object.keys(params).forEach(p => {
    if (params.hasOwnProperty(p)) {
      queryStr.push(p + '=' + params[p])
    }
  })
  return queryStr.join('&')
};


/**
 * 地址组件赋值
 */
export function setAddVal(formdata, addVal, prov, city, area, town, ctnr) {
  formdata[prov] = addVal ? addVal[0] : '';
  formdata[city] = addVal ? addVal[1] : '';
  formdata[area] = addVal ? addVal[2] : '';
  formdata[town] = addVal ? addVal[3] : '';
  formdata[ctnr] = addVal ? addVal[4] : '';
};

/**
 * 数据码值排序
 */
export function sortData(obj1, obj2) {
  return obj1.key - obj2.key;
};

/**
 * 获取金融机构信息
 */
export function fetchFnaNum() {
  yufp.service.request({
    method: "GET",
    url: backend.appOcaService + "/api/tnatsinduparm/",
    data: {
      condition: JSON.stringify({
        parmClss: "FNA_CLL_TYP"
      })
    },
    callback: function (code, message, response) {
      if (code == 0 && response.code == 0) {
        storage.set("FNA", response.data);
      } else {
        Message({
          message: response.message,
          type: "warning"
        });
      }
    }
  });
};

/**
 * 获取国民经济部门信息
 */
export function fetchBrahNum() {
  yufp.service.request({
    method: "GET",
    url: backend.appOcaService + "/api/tnatsinduparm/",
    data: {
      condition: JSON.stringify({
        parmClss: "NAT_ECO_SEC"
      })
    },
    callback: function (code, message, response) {
      if (code == 0 && response.code == 0) {
        // _this.data = yufp.extend([], response.data);
        storage.set("BRAH", response.data);
      } else {
        Message({
          message: response.message,
          type: "warning"
        });
      }
    }
  });
}

/**
 * 精准加法计算
 */
export function accAdd(arg1, arg2) {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  /*return (arg1*m+arg2*m)/m */
  return (accMul(arg1, m) + accMul(arg2, m)) / m;
}
/**
 * 精准乘法法计算
 */
export function accMul(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) { }
  try {
    m += s2.split(".")[1].length
  } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
 * 精准减法法计算
 */
export function accSub(arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2));
  //last modify by deeka
  //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

/**
 * 精准除法计算
 */
export function accDiv(arg1, arg2) {
  var t1 = 0,
    t2 = 0,
    r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length
  } catch (e) { }
  try {
    t2 = arg2.toString().split(".")[1].length
  } catch (e) { }
  // with(Math) {
  r1 = Number(arg1.toString().replace(".", ""))
  r2 = Number(arg2.toString().replace(".", ""))
  return (r1 / r2) * Math.pow(10, t2 - t1);
  // }
}

/**
 * 数值类型转化为字符串
 */
export function numberToStr(val) {
  return val ? String(val) : val;
}

/**
 * 数值类型转化为字符串
 */
export function handleObj(data) {
  const resultObj = data;
  // 对象循环遍历 如果返回数值为null，赋值为""，为了避免刚进入页面调用校验规则
  for (const item in resultObj) {
    resultObj[item] = resultObj[item] === null ? "" : resultObj[item];
  }
  return resultObj;
}

/**
 * 流程提交
 */

export function flowSubmit(ref, url, params, callback1) {
  var validate = false;
  ref.validate(function (valid) {
    validate = valid;
  });
  if (!validate) {
    const obj = {
      message: "请输入完整的基本信息！",
      type: "warning"
    }
    callback1(false, obj)
    return;
  }
  // 向后台发送保存请求
  yufp.service.request({
    method: "POST",
    url,
    data: params,
    callback: function (code, message, response) {
      callback1(true, response.data)
    }
  })
}

/**
 * 证件号码脱敏处理
 */
export function desensite(val) {
  if (val) {
    val = val.replace(
      /(\w{10})\w*(\w{2})/,
      "$1******$2"
    );
  }
  return val
}
// 给日期增加年月日
/* type:类型
num:间隔个数
date:时间 */
export function dateAdd(type, num, date) {
  switch (type) {
    case "y": {
      date.setFullYear(date.getFullYear() + num);
      return date;
    }
    case "q": {
      date.setMonth(date.getMonth() + num * 3);
      return date;
    }
    case "m": {
      date.setMonth(date.getMonth() + num);
      return date;
    }
    case "w": {
      date.setDate(date.getDate() + num * 7);
      return date;
    }
    case "d": {
      date.setDate(date.getDate() + num);
      return date;
    }
    case "h": {
      date.setHours(date.getHours() + num);
      return date;
    }
    case "mi": {
      date.setMinutes(date.getMinutes() + num);
      return date;
    }
    case "s": {
      date.setSeconds(date.getSeconds() + num);
      return date;
    }
    default: {
      date.setDate(date.getDate() + num);
      return date;
    }
  }
}
