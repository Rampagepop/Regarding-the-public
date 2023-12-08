// CBT
export default {
    name: 'crdt-bank-web',
    devActiveRule: '#/crdtBankWeb',
    proActiveRule: '#/crdtBankWeb',
    routeRule: 'crdtBankWeb',
    // 这些路由会在menu中用到的时候动态加载
    dynamicRoutes: {
        pageFactory: {
            name: "pageFactory",
            path: '/pageFactory/:modelGroupNo/:key'
        },
        YuxpTabRouter: {
            name: "YuxpTabRouter",
            path: '/tab/:pageId/:pageKey',
            meta: {queryParams: {isOca: true}, noCaChe: false},
        },
        YuxpCacheTabRouter: {
            name: "YuxpCacheTabRouter",
            path: '/tab/cache/:pageId/:pageKey',
            meta: {queryParams: {isOca: true}, noCaChe: false},
        }
    },
    menu: {
        cusMgr: {
            // ...List为菜单进入(不传参); ...Detail为数据列表跳转(传参)
            addCorpList: {
                id: 'NCM10004',
                title: '综合授信申请',
                path: "/newbj/crdtLimtMang/crdtLimtMangIndex",
                isEqueRoute: false, //是否和列表是一个路由 如果是一个路由的话要做特殊处理
                isadd: true //是否需要addrouter
            },
            addCorpDetail: {
                title: '综合授信申请',
                path: "/newbj/crdtLimtMang/crdtLimtMangIndex",
                isEqueRoute: true, //是否和列表是一个路由 如果是一个路由的话要做特殊处理
                isadd: true, //是否需要addrouter
                meta: {
                    menuId: 'NCM10004',
                    noCache: true
                }
            }
        }
    }
}