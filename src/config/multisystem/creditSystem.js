// 信贷中台
export default {
  name: 'cdp-web', // jQuery示例
  devActiveRule: '#/cdpWeb',
  proActiveRule: '#/cdpWeb', //添加前缀
  routeRule: 'cdpWeb',
  url: '//192.168.50.33:31011',
  // port:'8102',
  // 这些路由会在menu中用到的时候动态加载
  dynamicRoutes: {
    pageFactory: {
      name: "pageFactory",
      path: '/pageFactory/:modelGroupNo/:key',
    },
    YuxpTabRouter: {
      name: "YuxpTabRouter",
      path: '/tab/:pageId/:pageKey',
      meta: {queryParams: {isOca: true}, noCache: false},
    },
    YuxpCacheTabRouter: {
      name: "YuxpCacheTabRouter",
      path: '/tab/cache/:pageId/:pageKey',
      meta: {queryParams: {isOca: true}, noCache: false},
    },
  },
  menu: {
    cusMgr: {
      addCorp: {
        title: '对公客户创建',
        path: "/schema/cust_pre_add/b1c78f71f8054e6cb1a4be000e6b0fcf"
      },
      addPs: {
        title: '个人客户创建',
        path: "/schema/cusIndivCreate/f76886a326e943e7adbf4a1553bfa348"
      },
      cusSharingApply: {
        title: '同业客户创建',
        path: '/schema/addCusItbk/50ef479a3b0c407887b558675ff7b560'
        // "/schema/cusShrAppl/ecefd146b58f48b894d31eb83e62d6b3"
      },
      groupCorpIdentify: {
        title: '风险客户导入',
        path: "/schema/cusRskList/38fdbf436545471d8ceba771cdc6e7e2"
      },
      corpFrmltyCustomModify: {
        name: 'pageFactory',
        params: {
          modelGroupNo: 'MG202208030000000010',
          key: Date.now(),
          custRowData: {},
          op: 'EDIT',
          title: '维护同业客户详情信息',
          btnList: [
            {
              funcName: 'save',
              name: '保存',
              show: true
            },
            {
              funcName: 'tempSave',
              show: false
            },
            {
              funcName: 'commit',
              show: false
            },
            {
              funcName: 'back',
              name: '取消',
              show: true
            }
          ]
        }
      },
      corpFrmltyCustomView: {
        name: 'pageFactory',
        params: {
          modelGroupNo: 'MG202208030000000010',
          key: Date.now(),
          custRowData: {},
          op: 'VIEW',
          title: '维护同业客户详情信息',
          btnList: [
            {
              funcName: 'save',
              name: '保存',
              show: false
            },
            {
              funcName: 'tempSave',
              show: false
            },
            {
              funcName: 'commit',
              show: false
            },
            {
              funcName: 'back',
              name: '取消',
              show: true
            }
          ]
        }
      },
      corpTemptyCustomModify: {
        name: 'pageFactory',
        params: {
          modelGroupNo: 'MG202208030000000010',
          key: Date.now(),
          custRowData: {},
          op: 'EDIT',
          title: '维护同业客户详情信息',
          btnList: [
            {
              funcName: 'save',
              name: '保存',
              show: false
            },
            {
              funcName: 'tempSave',
              show: true
            },
            {
              funcName: 'commit',
              show: true
            },
            {
              funcName: 'back',
              name: '取消',
              show: true
            }
          ]
        }
      },
      corpTemptyCustomView: {
        name: 'pageFactory',
        params: {
          modelGroupNo: 'MG202208030000000010',
          key: Date.now(),
          custRowData: {},
          op: 'VIEW',
          title: '维护同业客户详情信息',
          btnList: [
            {
              funcName: 'save',
              name: '保存',
              show: false
            },
            {
              funcName: 'tempSave',
              show: false
            },
            {
              funcName: 'commit',
              show: false
            },
            {
              funcName: 'back',
              name: '取消',
              show: true
            }
          ]
        }
      },
      corpFrmlView: {
        name: 'pageFactory',
        title: '对公正式客户查看',
        params: {
          modelGroupNo: 'MG202206010000000011',
          key: "", // cusId,
          custRowData: {}, // row,
          op: 'VIEW',
          title: '对公正式客户查看',
          btnList: [
            {
              funcName: 'save',
              show: false
            }, // 隐藏
            {
              funcName: 'tempSave',
              show: false
            },
            {
              funcName: 'commit',
              show: false
            },
            {
              funcName: 'back',
              name: '取消',
              show: true
            } // 重命名
          ],
        }
      },
      corpFrmlModify: {
        name: 'pageFactory',
        title: '对公正式客户修改',
        params: {
          modelGroupNo: 'MG202206010000000011',
          custRowData: {}, // row,
          op: 'EDIT',
          key: "", // cusId,
          title: '对公正式客户修改',
          btnList: [
            {
              funcName: 'save',
              name: '保存',
              show: true
            }, // 隐藏
            {
              funcName: 'tempSave',
              show: false
            },
            {
              funcName: 'commit',
              show: false
            },
            {
              funcName: 'back',
              name: '取消',
              show: true
            }
          ],
        }
      },
      corpTempView: {
        name: 'pageFactory',
        title: '对公临时客户查看',
        params: {
          modelGroupNo: 'MG202207270000000006',
          key: "", // cusId,
          custRowData: {}, // row,
          op: 'VIEW',
          title: '对公临时客户查看',
          btnList: [
            {
              funcName: 'save',
              show: false
            }, // 隐藏
            {
              funcName: 'tempSave',
              show: false
            },
            {
              funcName: 'commit',
              show: false
            },
            {
              funcName: 'trunRight',
              show: false
            }, // 自定义
            {
              funcName: 'back',
              name: '取消',
              show: true
            } // 重命名
          ]
        }
      },
      corpTempModify: {
        name: 'pageFactory',
        title: '对公临时客户修改',
        params: {
          modelGroupNo: 'MG202207270000000006',
          key: "", // cusId,
          custRowData: {}, // row,
          op: 'EDIT',
          title: '对公临时客户修改',
          btnList: [
            {
              funcName: 'tempSave',
              name: '暂存',
              show: true
            },
            {
              funcName: 'save',
              name: '转正',
              show: true
            },
            {
              funcName: 'commit',
              show: false
            },
            {
              funcName: 'back',
              name: '取消',
              show: true
            } // 重命名
          ]
        }
      },
      corpRelationGraph: {
        name: 'YuxpTabRouter',
        title: '对公客户关系图谱',
        params: {
          // 页签标题
          title: '对公客户关系图谱',
          // 页面编码
          pageId: 'intellRelationIndex',
          // 可选，同一页面要打开多次，这个值需要传递不同的值
          pageKey: '',
          // 传递的页面参数
          pageParams: {
            custData: {}, // row,
            level: '0'
          }
        }
      },
      //注销  对公-cancelCusCorp 同业-cusItckUnregister 风险客户-cusRskApplCancel 个人-cancelCusIndiv
      corpLogOut: {
        title: '对公客户注销',
        path: "/schema/cancelCusCorp/9bfd23fd777544e3ad443d0d8ff107cc"
      },
      corpRegLogOut: {
        title: '同业客户注销',
        path: "/schema/cusItckUnregister/e5145a3e6d3b4ee8b76872e57cad4330"
      },
      corpRskLogOut: {
        title: '风险客户注销',
        path: "/schema/cusRskApplCancel/7885f04d23054205bb3a7a4630e19b5c"
      },
      corpUnOwnLogOut: {
        title: '个人客户反注销',
        path: "/schema/uncancelCusIndiv/269da2bbb9dc430f8be1c21feeb272f5"
      },
      corpUnRegLogOut: {
        title: '同业客户反注销',
        path: "/schema/cusItckContraryUnregister/67badb983e0c40c58099b42b9d2dcd52"
      },
      corpUnLogOut: {
        title: '对公客户反注销',
        path: "/schema/uncancelCusCorp/9e77b6bb685149b19d3318b6604e0e0f"
      },
      psFrmlView: {
        name: 'pageFactory',
        title: '个人客户查看',
        params: {
          modelGroupNo: 'MG202208020000000008',
          key: "", // cusId,
          custRowData: {}, // row,
          op: 'VIEW',
          title: '个人客户查看',
          btnList: [
            {
              funcName: 'save',
              show: false
            }, // 隐藏
            {
              funcName: 'tempSave',
              show: false
            },
            {
              funcName: 'commit',
              show: false
            },
            {
              funcName: 'back',
              name: '取消',
              show: true
            } // 重命名
          ],
        }
      },
      psFrmlModify: {
        name: 'pageFactory',
        title: '个人正式客户维护',
        params: {
          modelGroupNo: 'MG202208020000000008',
          key: "", // cusId,
          custRowData: {}, // row,
          op: 'EDIT',
          title: '个人正式客户维护',
          btnList: [
            {
              funcName: 'save',
              show: true
            }, // 隐藏
            {
              funcName: 'tempSave',
              show: false
            },
            {
              funcName: 'commit',
              show: false
            },
            {
              funcName: 'back',
              name: '取消',
              show: true
            } // 重命名
          ]
        }
      },
      psTempView: {
        name: 'pageFactory',
        title: '个人客户查看',
        params: {
          modelGroupNo: 'MG202208020000000008',
          key: "", // cusId,
          custRowData: {}, // row,
          op: 'VIEW',
          title: '个人客户查看',
          btnList: [
            {
              funcName: 'save',
              show: false
            }, // 隐藏
            {
              funcName: 'tempSave',
              show: false
            },
            {
              funcName: 'commit',
              show: false
            },
            {
              funcName: 'back',
              name: '取消',
              show: true
            } // 重命名
          ],
        }
      },
      psTempModify: {
        name: 'pageFactory',
        title: '个人临时客户维护',
        params: {
          modelGroupNo: 'MG202208020000000009',
          key: "", // cusId,
          custRowData: {}, // row,
          op: 'EDIT',
          title: '个人临时客户维护',
          btnList: [
            {
              funcName: 'tempSave',
              name: '暂存',
              show: true
            },
            {
              funcName: 'save',
              name: '转正',
              show: true
            },
            {
              funcName: 'commit',
              show: false
            },
            {
              funcName: 'back',
              name: '关闭',
              show: true
            } // 重命名
          ]
        }
      },
      psRelationGraph: {
        name: 'YuxpTabRouter',
        title: '个人客户关系图谱',
        params: {
          // 页签标题
          title: '个人客户关系图谱',
          // 页面编码
          pageId: 'intellRelationIndex',
          // 可选，同一页面要打开多次，这个值需要传递不同的值
          pageKey: '',
          // 传递的页面参数
          pageParams: {
            custData: {}, // row,
            level: '0'
          }
        }
      },
      psLogOut: {
        title: '个人客户注销',
        path: "/schema/cancelCusIndiv/7d02a900c9ef459884959d31126c76bd"
      },
      psUnLogOut: {
        title: '个人客户反注销',
        path: "/schema/uncancelCusIndiv/269da2bbb9dc430f8be1c21feeb272f5"
      },
    }
  }
}
