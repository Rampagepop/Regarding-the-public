/**
 * @created by helin3 2019-04-10
 * @updated by
 * @description 对原生部分方法进行重写,增加中间兼容操作
 */
const toParse = JSON.parse // 将json字符串转换成json对象
const toStringify = JSON.stringify // 将json对象转换成json字符串

/**
 * @description 对象toString字符串与类型对应map
 */
const class2type = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Object]': 'object',
}
/**
 * @description 获取值的原始类型字符串
 */
const _toString = Object.prototype.toString;
/**
 * @description 类型检测,相对typeof更精确
 * @param {*} obj
 * @returns 返回对象类型字符串
 */
function type (obj) {
    const type = _toString.call(obj);
    return obj === null ? String(obj) : class2type[type] || 'object'
}
// 判断值是否包含前缀
const SESSIONSTORAGE_TYPES = {
    stringType: '00',
    numberType: '01',
    booleanType: '02',
    jsonType: '03'
};
// 判断类型是否是存储类型
function isStoreType(val) {
    const keys = Object.keys(SESSIONSTORAGE_TYPES)
    for (let i = 0; i < keys.length; i++) {
        if (SESSIONSTORAGE_TYPES[keys[i]] === val) {
            return true
        }
    }
    return false
}
/**
 * @description 判断key是否符合规范
 * @param {*} key
 */
function isErrorKey(key) {
    if (typeof key !== 'string') {
        logger.error('YuStorage: The type of key must be a string')
        return true
    }
    return false
}
// 返回处理结果,取值结果前两个字符为存储类型,先判断类型在处理值
function returnResult(val, key, storage) {
    if (val === null || val === undefined) {
        return val
    }
    try {
        // 获取value类型
        const valueType = val.subString(0, 2);
        // 获取value
        let tmpVal = val.subString(2, val.length);
        // 整个字符串长度大于2
        if (isStoreType(valueType) && tmpVal.length > 0) {
            if (valueType === SESSIONSTORAGE_TYPES.jsonType) {
                tmpVal = toParse(tmpVal)
            } else if (valueType === SESSIONSTORAGE_TYPES.numberType) {
                tmpVal = Number(tmpVal)
            } else if (valueType === SESSIONSTORAGE_TYPES.booleanType) {
                tmpVal = Boolean(tmpVal)
            } else if (valueType === SESSIONSTORAGE_TYPES.stringType) {
                tmpVal = tmpVal + '';
            } else {
                tmpVal = valueType + tmpVal; // 将裁剪部分补齐
            }
        } else {
            tmpVal = val
        }
        return tmpVal
    } catch (e) {
        console.log(e);
    }
}
// 将对象转换成json字符串
function valueToJsonString(val) {
    // 只是将对象值转换成json字符串,其他不变化
    const _type = type(val);
    if (_type === 'object' || _type === 'array') {
        val = toStringify(val);
    }
    return val
}
// 由于localStorage 与 sessionStorage使用的均为Storage对象,因此,通过__proto__修改对应的方法会对localStorage和sessionStorage都进行修改了
const { getItem, setItem } = window.localStorage.__proto__
// 重写localStorage.getItem
window.localStorage.getItem = function (key) {
    if (isErrorKey(key)) {
        return void 0
    }
    return returnResult(getItem.call(this, key), key, 'localStorage')
}
// 重写localStorage.setItem
window.localStorage.setItem = function (key, val) {
    if (isErrorKey(key)) {
        return void 0
    }
    setItem.call(this, key, valueToJsonString(val))
}
