/**
 * @description 全局后台API服务映射表
 */
const serviceNameList = {
    uaaService: '/yusp-uaa',  //用户认证uaa微服务
    creService: 'http://10.51.212.90:9080/ALS7Credit/login.do?', //老信贷服务地址
    staService: 'http://10.51.228.107:8889/portal/smartbi/report.do', //统计分析平台
    ncmService: 'http://10.51.48.65:80', //新信管服务地址
    productionurl: 'http://10.51.99.15:8102',
};

window.serviceName = serviceNameList