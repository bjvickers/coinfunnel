'use strict'

// This is the web application framework
const appRootPath = require('app-root-path')
const bodyParser = require('body-parser')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const express = require('express')
const favicon = require('serve-favicon')

const setup = (diContainer) => {
  const instance = express()

  instance.use(compression())
  instance.use(favicon(`${appRootPath}/src/interface/public/favicon.ico`))

  // View engine setup and middleware
  instance.set('views', `${appRootPath}/src/interface/templates`)
  instance.set('view engine', 'ejs')

  // This app should focus on executing business logic as fast as possible,
  // and delegate compression and caching to Nginx/HAProxy/Varnish etc.
  // instance.use(compression())
  instance.use(express.static(`${appRootPath}/src/interface/public`))

  // Incoming data parsing, sanitizing and validation middleware
  instance.use(bodyParser.json())
  instance.use(bodyParser.urlencoded({ extended: false }))

  // Fast-access controllers which do not need to identify the user.
  const ACL = diContainer.cradle.ACL
  instance.use(ACL.GetAllAPIV1.resource, diContainer.cradle.getAllAPIV1Controller)
  instance.use(ACL.PostCauseActionAPIV1.resource, diContainer.cradle.postCauseActionAPIV1Controller)

  // Json webtoken parsing middleware. The jwt, if it exists, will
  // be stored in the cookie.
  instance.use(cookieParser())

  instance.use(ACL.GetIndex.resource, diContainer.cradle.getIndexController)
  instance.use(ACL.GetExplore.resource, diContainer.cradle.getExploreController)
  instance.use(ACL.GetFAQ.resource, diContainer.cradle.getFAQController)
  instance.use(ACL.GetShowcase.resource, diContainer.cradle.getShowcaseController)
  instance.use(ACL.GetLogin.resource, diContainer.cradle.getLoginController)
  instance.use(ACL.PostLogin.resource, diContainer.cradle.postLoginController)
  instance.use(ACL.GetRegister.resource, diContainer.cradle.getRegisterController)
  instance.use(ACL.PostRegister.resource, diContainer.cradle.postRegisterController)
  instance.use(ACL.GetRegisterConfirm.resource, diContainer.cradle.getRegisterConfirmController)
  instance.use(ACL.GetResetPassword.resource, diContainer.cradle.getResetPasswordController)
  instance.use(ACL.PostResetPassword.resource, diContainer.cradle.postResetPasswordController)
  instance.use(ACL.GetResetPasswordConfirm.resource, diContainer.cradle.getResetPasswordConfirmController)
  instance.use(ACL.PostResetPasswordConfirm.resource, diContainer.cradle.postResetPasswordConfirmController)
  instance.use(ACL.GetCauseIndex.resource, diContainer.cradle.getCauseIndexController)
  instance.use(ACL.GetCausePayments.resource, diContainer.cradle.getCausePaymentsController)
  instance.use(ACL.PostCause.resource, diContainer.cradle.postCauseController)
  instance.use(ACL.PostCurrency.resource, diContainer.cradle.postCurrencyController)
  instance.use(ACL.PostCauseVerify.resource, diContainer.cradle.postCauseVerifyController)
  instance.use(ACL.PostCauseOnlineStatus.resource, diContainer.cradle.postCauseOnlineStatusController)
  instance.use(ACL.PostCauseImage.resource, diContainer.cradle.postCauseImageController)
  instance.use(ACL.PostCauseImagePrimary.resource, diContainer.cradle.postCauseImagePrimaryController)
  instance.use(ACL.DeleteCauseImage.resource, diContainer.cradle.deleteCauseImageController)
  instance.use(ACL.PostWallet.resource, diContainer.cradle.postWalletController)
  instance.use(ACL.DeleteAccount.resource, diContainer.cradle.deleteAccountController)
  instance.use(ACL.PostChangePassword.resource, diContainer.cradle.postChangePasswordController)
  instance.use(ACL.GetNotice.resource, diContainer.cradle.getNoticeController)
  instance.use(ACL.DeleteNotice.resource, diContainer.cradle.deleteNoticeController)
  instance.use(diContainer.cradle.getNotFoundController)
  instance.use(diContainer.cradle.getErrorController)
  return instance
}

module.exports = (diContainer) => {
  return setup(diContainer)
}
