const path = require("path");
const resolve = dir => path.join(__dirname, dir); // 当前目录，即项目根目录解析
const PAGES_PATH = path.resolve(__dirname, "../src/pages");
const _toString = Object.prototype.toString;
const pages = {}
const glob = require("glob");

const SPLIT_CHUNKS_CACHE_GROUPDS = {
  libs: {
    name: 'chunk-libs',
    test: /[\\/]node_modules[\\/]/,
    priority: 10,
    chunks: 'initial' // only package third parties that are initially dependent
  },
  yuwpUI: {
    name: 'chunk-yuwpUI', // split elementUI into a single package
    priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
    test: /[\\/]node_modules[\\/]_?yuwp-ui(.*)/ // in order to adapt to cnpm
  },
  locale: {
    name: 'chunk-locale', // split elementUI into a single package
    priority: 30, // the weight needs to be larger than libs and app or it will be packaged into libs or app
    test: resolve('src/locale'), // in order to adapt to cnpm
    reuseExistingChunk: true
  },
  // echarts: {
  // 	name: 'chunk-echarts', // split elementUI into a single package
  // 	priority: -5, // the weight needs to be larger than libs and app or it will be packaged into libs or app
  // 	test: /[\\/]node_modules[\\/]_?echarts(.*)/ // in order to adapt to cnpm
  // },
  components: {
    name: 'chunk-components',
    test: resolve('src/components'), // can customize your rules
    minChunks: 3, //  minimum common number
    priority: -20,
    reuseExistingChunk: true
  }
}
/**
 * 开发模式，获取代理配置
 * 注: 若配置项VUE_APP_BASE_API包含协议、域名[IP]、端口[可选]，开发模式则默认配置代理
 */
function getProxyConfig() {
  const devEnv = process.env.NODE_ENV === "development"; // 开发环境
  let baseApi = process.env.VUE_APP_BASE_API; // 应用服务前缀URL
  let proxyPrefix = process.env.VUE_APP_PROXY_PREFIX; // 代理API前缀
  const match = /^(https?:\/\/[0-9a-z.-]+)(:[0-9]+)?([/0-9a-z.]+)?/i; // 匹配URL(协议+域名+端口)
  // 可数组配置多个
  if (_toString.call(proxyPrefix) === "[object String]") {
    proxyPrefix = proxyPrefix.split(",");
  }
  if (_toString.call(baseApi) === "[object String]") {
    baseApi = baseApi.split(",").filter(api => {
      return match.test(api);
    });
  }
  let devServerProxy = {}; // 配置的代理对象，默认false，为空
  let l = baseApi.length - 1;
  if (devEnv && l > -1) {
    // VUE_APP_BASE_API代理配置演示，/dev-proxy-api/xxx-api/* => https://172.16.20.92:8102/xxx-api/*
    // 详见: https://cli.vuejs.org/config/#devserver-proxy
    if (Array.isArray(proxyPrefix)) {
      proxyPrefix.forEach((item, idx) => {
        let matchResult = match.exec(baseApi[idx > l ? l : idx]);
        // let rewrite = {};
        // rewrite[item] = ''
        devServerProxy[item] = {
          target: `${matchResult.input}`, // + (matchResult[3] || '')}`, // 协议+域名
          changeOrigin: true
          // pathRewrite: rewrite
        };
      });
    }
  }

  devServerProxy = JSON.stringify(devServerProxy) == "{}" ? false : devServerProxy;
  console.log("配置代理", devServerProxy);
  return devServerProxy;
};

function getSplitChunks() {
  return SPLIT_CHUNKS_CACHE_GROUPDS;
}
function getChunksList() {
  const chunkList = []
  Object.keys(SPLIT_CHUNKS_CACHE_GROUPDS).forEach(chunk => {
    chunkList.push(SPLIT_CHUNKS_CACHE_GROUPDS[chunk].name)
  })
  return chunkList
}

/**
 * @description 获取多页配置
 * @returns Array 多页入口配置
 */
function getPages(defaultSettings) {
  const chunkList = getChunksList()
  // 多页应用配置
  if (defaultSettings.mpa) {
    //配置 pages 目录下的多页面，通过循环获取每一个 page 文件夹下的 html 和 js
    glob.sync(PAGES_PATH + "/*/main.js").forEach(filePath => {
      const pageName = path.basename(path.dirname(filePath));
      console.log("多页面路径", pageName, path.dirname(filePath));
      pages[pageName] = {
        entry: filePath,
        template: path.dirname(filePath) + "/index.html",
        filename: `${pageName}.html`,
        chunks: chunkList.concat([pageName, `manifest.${pageName}`])
      };
      if (pageName === "login") {
        pages[pageName].inject = false;
      }
    });
  }
  // 增加系统默认的index主页
  pages["index"] = {
    entry: "src/main.js",
    template: "public/index.html",
    filename: `index.html`,
    chunks: chunkList.concat(['index', `manifest.index`])
  };
  return pages
}


/**
 * @description 更新合并静态资源路径
 * @param {String} url 静态文件第hi
 * @param {String} resourcePath 原始文件路径
 * @param {String} context 文件内容
 * @returns 合并参数后的地址
 */
 const outputPathFn = (url, resourcePath, context) => {
  return url + '?a=123'
}
/**
 * @description 重置配置处理
 * @param {Object} config 配置参数对象
 * @param {Array<Object>} rules 重置处理规则列表 
 */
function resetChainWebpackRules (config, rules) {
  rules.forEach(rule => {
    const ModuleRule = config.module.rule(rule.name)
    ModuleRule.uses.clear()
    ModuleRule.test(rule.reg)
      .use('url-loader')
      .loader('url-loader')
      .tap((args) => {
        return {
          limit: 4096,
          fallback: {
            loader: 'file-loader',
            options: {
              name: `static/${rule.filePath}/[name].[hash:8].[ext]`,
              outputPath: outputPathFn
            }
          }
        }
      })
      .end()
  })
}

module.exports = {
  getProxyConfig,
  getPages,
  getSplitChunks,
  resetChainWebpackRules
}