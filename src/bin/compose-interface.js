'use strict'

/**
 * Interface controllers, schemas, mappings, validation constraints
 */

const appRootPath = require('app-root-path')
const awilix = require('awilix')

// Controllers
const invokePostCurrencyController = require(`${appRootPath}/src/interface/controllers/account/post-currency`)
const invokeGetAllAPIV1Controller = require(`${appRootPath}/src/interface/controllers/api/v1/get-all`)
const invokePostCauseActionAPIV1Controller = require(`${appRootPath}/src/interface/controllers/api/v1/post-cause-action`)
const invokeGetFAQController = require(`${appRootPath}/src/interface/controllers/get-faq`)
const invokeGetIndexController = require(`${appRootPath}/src/interface/controllers/get-index`)
const invokeGetExploreController = require(`${appRootPath}/src/interface/controllers/get-explore`)
const invokeGetNotFoundController = require(`${appRootPath}/src/interface/controllers/get-not-found`)
const invokeGetErrorController = require(`${appRootPath}/src/interface/controllers/get-error`)
const invokeGetLoginController = require(`${appRootPath}/src/interface/controllers/get-login`)
const invokeGetRegisterController = require(`${appRootPath}/src/interface/controllers/get-register`)
const invokePostLoginController = require(`${appRootPath}/src/interface/controllers/post-login`)
const invokePostRegisterController = require(`${appRootPath}/src/interface/controllers/post-register`)
const invokeGetRegisterConfirmController = require(`${appRootPath}/src/interface/controllers/get-register-confirm`)
const invokeGetResetPasswordController = require(`${appRootPath}/src/interface/controllers/get-reset-password`)
const invokePostResetPasswordController = require(`${appRootPath}/src/interface/controllers/post-reset-password`)
const invokeGetResetPasswordConfirmController = require(`${appRootPath}/src/interface/controllers/get-reset-password-confirm`)
const invokePostResetPasswordConfirmController = require(`${appRootPath}/src/interface/controllers/post-reset-password-confirm`)
const invokeGetCauseIndexController = require(`${appRootPath}/src/interface/controllers/cause/get-cause-index`)
const invokeGetCausePaymentsController = require(`${appRootPath}/src/interface/controllers/cause/get-cause-payments`)
const invokePostCauseController = require(`${appRootPath}/src/interface/controllers/cause/post-cause`)
const invokePostCauseOnlineStatusController = require(`${appRootPath}/src/interface/controllers/cause/post-cause-online-status`)
const invokePostWalletController = require(`${appRootPath}/src/interface/controllers/wallet/post-wallet`)
const invokeGetShowcaseController = require(`${appRootPath}/src/interface/controllers/get-showcase`)
const invokeDeleteAccountController = require(`${appRootPath}/src/interface/controllers/account/delete`)
const invokePostChangePasswordController = require(`${appRootPath}/src/interface/controllers/account/post-change-password`)
const invokeGetNoticeController = require(`${appRootPath}/src/interface/controllers/account/get-notice`)
const invokeDeleteNoticeController = require(`${appRootPath}/src/interface/controllers/account/delete-notice`)
const invokePostCauseImageController = require(`${appRootPath}/src/interface/controllers/cause/post-cause-image`)
const invokeDeleteCauseImageController = require(`${appRootPath}/src/interface/controllers/cause/delete-cause-image`)
const invokePostCauseImagePrimaryController = require(`${appRootPath}/src/interface/controllers/cause/post-cause-image-primary`)
const invokePostCauseVerifyController = require(`${appRootPath}/src/interface/controllers/cause/post-cause-verify`)

// Schemas, mappings, validation constraints
const PostLoginSchema = require(`${appRootPath}/src/interface/forms/schema/post-login`)
const PostRegisterSchema = require(`${appRootPath}/src/interface/forms/schema/post-register`)
const PostResetPasswordSchema = require(`${appRootPath}/src/interface/forms/schema/post-reset-password`)
const PostResetPasswordConfirmSchema = require(`${appRootPath}/src/interface/forms/schema/post-reset-password-confirm`)

const PostCauseSchema = require(`${appRootPath}/src/interface/forms/schema/post-cause`)
const PostWalletSchema = require(`${appRootPath}/src/interface/forms/schema/post-wallet`)
const DeleteAccountSchema = require(`${appRootPath}/src/interface/forms/schema/delete-account`)
const PostChangePasswordSchema = require(`${appRootPath}/src/interface/forms/schema/post-change-password`)
const PostLoginConstraints = require(`${appRootPath}/src/interface/forms/constraints/post-login`)
const postRegisterConstraints = require(`${appRootPath}/src/interface/forms/constraints/post-register`)
const PostResetPasswordConstraints = require(`${appRootPath}/src/interface/forms/constraints/post-reset-password`)
const PostResetPasswordConfirmConstraints = require(`${appRootPath}/src/interface/forms/constraints/post-reset-password-confirm`)
const PostCauseConstraints = require(`${appRootPath}/src/interface/forms/constraints/post-cause`)
const postWalletConstraints = require(`${appRootPath}/src/interface/forms/constraints/post-wallet`)
const DeleteAccountConstraints = require(`${appRootPath}/src/interface/forms/constraints/delete-account`)
const PostChangePasswordConstraints = require(`${appRootPath}/src/interface/forms/constraints/post-change-password`)

const PostLoginMapping = require(`${appRootPath}/src/interface/forms/mapping/post-login`)
const PostRegisterMapping = require(`${appRootPath}/src/interface/forms/mapping/post-register`)
const PostResetPasswordMapping = require(`${appRootPath}/src/interface/forms/mapping/post-reset-password`)
const PostResetPasswordConfirmMapping = require(`${appRootPath}/src/interface/forms/mapping/post-reset-password-confirm`)
const PostCauseMapping = require(`${appRootPath}/src/interface/forms/mapping/post-cause`)
const PostWalletMapping = require(`${appRootPath}/src/interface/forms/mapping/post-wallet`)
const DeleteAccountMapping = require(`${appRootPath}/src/interface/forms/mapping/delete-account`)
const PostChangePasswordMapping = require(`${appRootPath}/src/interface/forms/mapping/post-change-password`)

module.exports = () => {
  return {
    postCurrencyController: awilix.asFunction(invokePostCurrencyController),
    getAllAPIV1Controller: awilix.asFunction(invokeGetAllAPIV1Controller),
    postCauseActionAPIV1Controller: awilix.asFunction(invokePostCauseActionAPIV1Controller),
    postCauseVerifyController: awilix.asFunction(invokePostCauseVerifyController),
    getFAQController: awilix.asFunction(invokeGetFAQController),
    getIndexController: awilix.asFunction(invokeGetIndexController),
    getExploreController: awilix.asFunction(invokeGetExploreController),
    getNotFoundController: awilix.asFunction(invokeGetNotFoundController),
    getErrorController: awilix.asFunction(invokeGetErrorController),
    getLoginController: awilix.asFunction(invokeGetLoginController),
    getRegisterController: awilix.asFunction(invokeGetRegisterController),
    postLoginController: awilix.asFunction(invokePostLoginController),
    postRegisterController: awilix.asFunction(invokePostRegisterController),
    getRegisterConfirmController: awilix.asFunction(invokeGetRegisterConfirmController),
    getResetPasswordController: awilix.asFunction(invokeGetResetPasswordController),
    postResetPasswordController: awilix.asFunction(invokePostResetPasswordController),
    getResetPasswordConfirmController: awilix.asFunction(invokeGetResetPasswordConfirmController),
    postResetPasswordConfirmController: awilix.asFunction(invokePostResetPasswordConfirmController),
    getCausePaymentsController: awilix.asFunction(invokeGetCausePaymentsController),
    getCauseIndexController: awilix.asFunction(invokeGetCauseIndexController),
    postCauseController: awilix.asFunction(invokePostCauseController),
    postCauseOnlineStatusController: awilix.asFunction(invokePostCauseOnlineStatusController),
    postWalletController: awilix.asFunction(invokePostWalletController),
    getShowcaseController: awilix.asFunction(invokeGetShowcaseController),
    deleteAccountController: awilix.asFunction(invokeDeleteAccountController),
    postChangePasswordController: awilix.asFunction(invokePostChangePasswordController),
    getNoticeController: awilix.asFunction(invokeGetNoticeController),
    deleteNoticeController: awilix.asFunction(invokeDeleteNoticeController),
    postCauseImageController: awilix.asFunction(invokePostCauseImageController),
    postCauseImagePrimaryController: awilix.asFunction(invokePostCauseImagePrimaryController),
    deleteCauseImageController: awilix.asFunction(invokeDeleteCauseImageController),

    PostLoginSchema: awilix.asValue(PostLoginSchema),
    PostLoginConstraints: awilix.asValue(PostLoginConstraints),
    PostLoginMapping: awilix.asValue(PostLoginMapping),
    PostWalletSchema: awilix.asValue(PostWalletSchema),
    PostWalletConstraints: awilix.asFunction(postWalletConstraints),
    PostWalletMapping: awilix.asValue(PostWalletMapping),
    PostRegisterSchema: awilix.asValue(PostRegisterSchema),
    PostRegisterConstraints: awilix.asFunction(postRegisterConstraints),
    PostRegisterMapping: awilix.asValue(PostRegisterMapping),
    PostResetPasswordSchema: awilix.asValue(PostResetPasswordSchema),
    PostResetPasswordConstraints: awilix.asValue(PostResetPasswordConstraints),
    PostResetPasswordMapping: awilix.asValue(PostResetPasswordMapping),
    PostResetPasswordConfirmSchema: awilix.asValue(PostResetPasswordConfirmSchema),
    PostResetPasswordConfirmConstraints: awilix.asValue(PostResetPasswordConfirmConstraints),
    PostResetPasswordConfirmMapping: awilix.asValue(PostResetPasswordConfirmMapping),
    DeleteAccountSchema: awilix.asValue(DeleteAccountSchema),
    DeleteAccountConstraints: awilix.asValue(DeleteAccountConstraints),
    DeleteAccountMapping: awilix.asValue(DeleteAccountMapping),
    PostChangePasswordSchema: awilix.asValue(PostChangePasswordSchema),
    PostChangePasswordConstraints: awilix.asValue(PostChangePasswordConstraints),
    PostChangePasswordMapping: awilix.asValue(PostChangePasswordMapping),
    PostCauseConstraints: awilix.asValue(PostCauseConstraints),
    PostCauseSchema: awilix.asValue(PostCauseSchema),
    PostCauseMapping: awilix.asValue(PostCauseMapping)
  }
}
