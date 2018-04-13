const access = require('./access')
const log4js = require('log4js')
const methods = ["trace", "debug", "info", "warn", "error", "fatal", "mark"]

const baseInfo = {
  appLogLevel: 'debug',
  dir: 'logs',
  env: 'dev',
  projectName: 'app',
  serveTp: '0.0.0.0'
}

module.exports = (options = {}) => {
  const ctxLogger = {}
  const appenders = {}

  const opts = Object.assign({}, baseInfo, options)
  const { env, appLogLevel, dir, serverIp, projectName } = opts
  const commonInfo = { projectName, serverIp }

  appenders.cheese = {
    type: 'dateFile', // 日志类型 
    filename: `${dir}/task`,  // 输出的文件名
    pattern: '-yyyy-MM-dd.log',  // 文件名增加后缀
    alwaysIncludePattern: true   // 是否总是有后缀名
  }

  if (env === 'dev' || env === 'local' || env === 'development') {
    appenders.out = {
      type: 'console'
    }
  }

  let config = {
    appenders,
    categories: {
      default: {
        appenders: Object.keys(appenders),
        level: appLogLevel
      }
    }
  }

  const logger = log4js.getLogger('cheese')

  log4js.configure(config)

  return async (ctx, next) => {
    const start = Date.now()

    methods.forEach((method, i) => {
      ctxLogger[method] = (message) => {
        logger[method](access(ctx, message, commonInfo))
      }
    })
    // 将方法挂载到ctx上
    ctx.log = ctxLogger
    await next()
    const responseTime = Date.now() - start
    logger.info(access(ctx, {
      responseTime: `响应时间为${responseTime/1000}s`
    }, commonInfo))
  }
}