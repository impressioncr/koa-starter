const router = require('koa-router')()
const homeController = require('../controller/home')

module.exports = (app) => {
  router.get('/home/index', homeController.index)

  router.get('/home', homeController.home)
  
  router.get('/home/:id/:name', homeController.homeParams)

  router.get('/home/login', homeController.login)
  
  router.post('/user/register', homeController.register)
  
  app.use(router.routes())
    .use(router.allowedMethods())
}