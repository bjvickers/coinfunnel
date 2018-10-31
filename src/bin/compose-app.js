'use strict'

/**
 * App models, enums, factories, usecases, policies, libraries
 */

const appRootPath = require('app-root-path')
const awilix = require('awilix')

// Models
const Token = require(`${appRootPath}/src/app/models/token`)
const CauseSearch = require(`${appRootPath}/src/app/models/cause-search`)
const CauseSearchContext = require(`${appRootPath}/src/app/models/cause-search-context`)
const PageSearch = require(`${appRootPath}/src/app/models/page-search`)
const KeywordSearch = require(`${appRootPath}/src/app/models/keyword-search`)
const CountrySearch = require(`${appRootPath}/src/app/models/country-search`)
const KeywordSearchContext = require(`${appRootPath}/src/app/models/keyword-search-context`)
const SortSearch = require(`${appRootPath}/src/app/models/sort-search`)

// Enums
const ACL = require(`${appRootPath}/src/app/enums/acl`)
const TokenTypes = require(`${appRootPath}/src/app/enums/token-types`)
const CauseSortTypes = require(`${appRootPath}/src/app/enums/cause-sort-types`)
const KeywordSortTypes = require(`${appRootPath}/src/app/enums/keyword-sort-types`)

// Factories
const invokeTokenFactory = require(`${appRootPath}/src/app/factories/token`)
const invokeCauseSearchFactory = require(`${appRootPath}/src/app/factories/cause-search`)
const invokePageSearchFactory = require(`${appRootPath}/src/app/factories/page-search`)
const invokeKeywordSearchFactory = require(`${appRootPath}/src/app/factories/keyword-search`)
const invokeCountrySearchFactory = require(`${appRootPath}/src/app/factories/country-search`)
const invokeSortSearchFactory = require(`${appRootPath}/src/app/factories/sort-search`)

// UseCases
const postCurrencyUseCase = require(`${appRootPath}/src/app/usecases/post-currency`)
const getCausePaymentsUseCase = require(`${appRootPath}/src/app/usecases/get-cause-payments`)
const getAllAPIV1UseCase = require(`${appRootPath}/src/app/usecases/get-all-api-v1`)
const postCauseActionAPIV1UseCase = require(`${appRootPath}/src/app/usecases/post-cause-action-api-v1`)
const getIndexUseCase = require(`${appRootPath}/src/app/usecases/get-index`)
const getFAQUseCase = require(`${appRootPath}/src/app/usecases/get-faq`)
const getExploreUseCase = require(`${appRootPath}/src/app/usecases/get-explore`)
const get404UseCase = require(`${appRootPath}/src/app/usecases/get-404`)
const getLoginUseCase = require(`${appRootPath}/src/app/usecases/get-login`)
const getRegisterUseCase = require(`${appRootPath}/src/app/usecases/get-register`)
const getCauseIndexUseCase = require(`${appRootPath}/src/app/usecases/get-cause-index`)
const getResetPasswordUseCase = require(`${appRootPath}/src/app/usecases/get-reset-password`)
const getResetPasswordConfirmUseCase = require(`${appRootPath}/src/app/usecases/get-reset-password-confirm`)
const getRegisterConfirmUseCase = require(`${appRootPath}/src/app/usecases/get-register-confirm`)
const postLoginUseCase = require(`${appRootPath}/src/app/usecases/post-login`)
const postRegisterUseCase = require(`${appRootPath}/src/app/usecases/post-register`)
const postResetPasswordUseCase = require(`${appRootPath}/src/app/usecases/post-reset-password`)
const postResetPasswordConfirmUseCase = require(`${appRootPath}/src/app/usecases/post-reset-password-confirm`)
const postCauseUseCase = require(`${appRootPath}/src/app/usecases/post-cause`)
const postCauseVerifyUseCase = require(`${appRootPath}/src/app/usecases/post-cause-verify`)
const postCauseOnlineStatusUseCase = require(`${appRootPath}/src/app/usecases/post-cause-online-status`)
const postWalletUseCase = require(`${appRootPath}/src/app/usecases/post-wallet`)
const getShowcaseUseCase = require(`${appRootPath}/src/app/usecases/get-showcase`)
const deleteAccountUseCase = require(`${appRootPath}/src/app/usecases/delete-account`)
const postChangePasswordUseCase = require(`${appRootPath}/src/app/usecases/post-change-password`)
const getNoticeUseCase = require(`${appRootPath}/src/app/usecases/get-notice`)
const deleteNoticeUseCase = require(`${appRootPath}/src/app/usecases/delete-notice`)
const postCauseImageUseCase = require(`${appRootPath}/src/app/usecases/post-cause-image`)
const deleteCauseImageUseCase = require(`${appRootPath}/src/app/usecases/delete-cause-image`)
const postCauseImagePrimaryUseCase = require(`${appRootPath}/src/app/usecases/post-cause-image-primary`)

// UseCase Preconditions
const postCurrencyPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/post-currency`)
const getCausePaymentsPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/get-cause-payments`)
const getAllAPIV1Precondition = require(`${appRootPath}/src/app/usecases/preconditions/get-all-api-v1`)
const postCauseActionAPIV1Precondition = require(`${appRootPath}/src/app/usecases/preconditions/post-cause-action-api-v1`)
const postCauseVerifyPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/post-cause-verify`)
const getFAQPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/get-faq`)
const deleteAccountPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/delete-account`)
const get404Precondition = require(`${appRootPath}/src/app/usecases/preconditions/get-404`)
const getCauseIndexPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/get-cause-index`)
const getExplorePrecondition = require(`${appRootPath}/src/app/usecases/preconditions/get-explore`)
const getIndexPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/get-index`)
const getLoginPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/get-login`)
const getRegisterConfirmPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/get-register-confirm`)
const getRegisterPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/get-register`)
const getResetPasswordConfirmPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/get-reset-password-confirm`)
const getResetPasswordPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/get-reset-password`)
const getShowcasePrecondition = require(`${appRootPath}/src/app/usecases/preconditions/get-showcase`)
const postCauseOnlineStatusPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/post-cause-online-status`)
const postCausePrecondition = require(`${appRootPath}/src/app/usecases/preconditions/post-cause`)
const postLoginPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/post-login`)
const postRegisterPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/post-register`)
const postResetPasswordConfirmPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/post-reset-password-confirm`)
const postResetPasswordPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/post-reset-password`)
const postWalletPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/post-wallet`)
const postChangePasswordPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/post-change-password`)
const getNoticePrecondition = require(`${appRootPath}/src/app/usecases/preconditions/get-notice`)
const deleteNoticePrecondition = require(`${appRootPath}/src/app/usecases/preconditions/delete-notice`)
const postCauseImagePrecondition = require(`${appRootPath}/src/app/usecases/preconditions/post-cause-image`)
const postCauseImagePrimaryPrecondition = require(`${appRootPath}/src/app/usecases/preconditions/post-cause-image-primary`)
const deleteCauseImagePrecondition = require(`${appRootPath}/src/app/usecases/preconditions/delete-cause-image`)

// UseCase Shared Steps
const identifyUserFromJWTTokenStep = require(`${appRootPath}/src/app/usecases/shared-steps/identify-user-from-jwt-token`)
const redirectToAuthorisedRouteStep = require(`${appRootPath}/src/app/usecases/shared-steps/redirect-to-authorised-route`)
const applyTokenRequestStep = require(`${appRootPath}/src/app/usecases/shared-steps/apply-token-request`)
const identifyUserFromTokenStep = require(`${appRootPath}/src/app/usecases/shared-steps/identify-user-from-token`)
const applyCriticalResourceAuthStep = require(`${appRootPath}/src/app/usecases/shared-steps/apply-critical-resource-auth`)
const toggleCauseOnlineStatusStep = require(`${appRootPath}/src/app/usecases/shared-steps/toggle-cause-online-status`)
const updateJwtUserStep = require(`${appRootPath}/src/app/usecases/shared-steps/update-jwt-user`)
const verifyRecaptchaStep = require(`${appRootPath}/src/app/usecases/shared-steps/verify-recaptcha`)

// Libraries
const invokeJwtLibrary = require(`${appRootPath}/src/app/lib/jwt`)
const invokeCookieLibrary = require(`${appRootPath}/src/app/lib/cookie`)
const invokeAclLibrary = require(`${appRootPath}/src/app/lib/acl`)
const invokeSeoLibrary = require(`${appRootPath}/src/app/lib/seo`)
const invokeMailLibrary = require(`${appRootPath}/src/app/lib/mail`)
const invokeEnumLibrary = require(`${appRootPath}/src/app/lib/enum`)
const invokeDateLibrary = require(`${appRootPath}/src/app/lib/date`)
const invokeCurrencyLibrary = require(`${appRootPath}/src/app/lib/currency`)

module.exports = () => {
  return {
    Token: awilix.asValue(Token),
    CauseSearch: awilix.asValue(CauseSearch),
    CauseSearchContext: awilix.asValue(CauseSearchContext),
    PageSearch: awilix.asValue(PageSearch),
    KeywordSearch: awilix.asValue(KeywordSearch),
    CountrySearch: awilix.asValue(CountrySearch),
    KeywordSearchContext: awilix.asValue(KeywordSearchContext),
    SortSearch: awilix.asValue(SortSearch),

    ACL: awilix.asValue(ACL),
    TokenTypes: awilix.asValue(TokenTypes),
    CauseSortTypes: awilix.asValue(CauseSortTypes),
    KeywordSortTypes: awilix.asValue(KeywordSortTypes),

    TokenFactory: awilix.asFunction(invokeTokenFactory),
    causeSearchFactory: awilix.asFunction(invokeCauseSearchFactory),
    pageSearchFactory: awilix.asFunction(invokePageSearchFactory),
    keywordSearchFactory: awilix.asFunction(invokeKeywordSearchFactory),
    countrySearchFactory: awilix.asFunction(invokeCountrySearchFactory),
    sortSearchFactory: awilix.asFunction(invokeSortSearchFactory),

    postCurrencyPrecondition: awilix.asClass(postCurrencyPrecondition),
    getCausePaymentsPrecondition: awilix.asClass(getCausePaymentsPrecondition),
    getAllAPIV1Precondition: awilix.asClass(getAllAPIV1Precondition),
    postCauseActionAPIV1Precondition: awilix.asClass(postCauseActionAPIV1Precondition),
    postCauseVerifyPrecondition: awilix.asClass(postCauseVerifyPrecondition),
    getFAQPrecondition: awilix.asClass(getFAQPrecondition),
    deleteAccountPrecondition: awilix.asClass(deleteAccountPrecondition),
    get404Precondition: awilix.asClass(get404Precondition),
    getCauseIndexPrecondition: awilix.asClass(getCauseIndexPrecondition),
    getExplorePrecondition: awilix.asClass(getExplorePrecondition),
    getIndexPrecondition: awilix.asClass(getIndexPrecondition),
    getLoginPrecondition: awilix.asClass(getLoginPrecondition),
    getRegisterConfirmPrecondition: awilix.asClass(getRegisterConfirmPrecondition),
    getRegisterPrecondition: awilix.asClass(getRegisterPrecondition),
    getResetPasswordConfirmPrecondition: awilix.asClass(getResetPasswordConfirmPrecondition),
    getResetPasswordPrecondition: awilix.asClass(getResetPasswordPrecondition),
    getShowcasePrecondition: awilix.asClass(getShowcasePrecondition),
    postCauseOnlineStatusPrecondition: awilix.asClass(postCauseOnlineStatusPrecondition),
    postCausePrecondition: awilix.asClass(postCausePrecondition),
    postLoginPrecondition: awilix.asClass(postLoginPrecondition),
    postRegisterPrecondition: awilix.asClass(postRegisterPrecondition),
    postResetPasswordConfirmPrecondition: awilix.asClass(postResetPasswordConfirmPrecondition),
    postResetPasswordPrecondition: awilix.asClass(postResetPasswordPrecondition),
    postWalletPrecondition: awilix.asClass(postWalletPrecondition),
    postChangePasswordPrecondition: awilix.asClass(postChangePasswordPrecondition),
    getNoticePrecondition: awilix.asClass(getNoticePrecondition),
    deleteNoticePrecondition: awilix.asClass(deleteNoticePrecondition),
    postCauseImagePrecondition: awilix.asClass(postCauseImagePrecondition),
    postCauseImagePrimaryPrecondition: awilix.asClass(postCauseImagePrimaryPrecondition),
    deleteCauseImagePrecondition: awilix.asClass(deleteCauseImagePrecondition),

    postCurrencyUseCase: awilix.asClass(postCurrencyUseCase),
    getCausePaymentsUseCase: awilix.asClass(getCausePaymentsUseCase),
    getAllAPIV1UseCase: awilix.asClass(getAllAPIV1UseCase),
    postCauseActionAPIV1UseCase: awilix.asClass(postCauseActionAPIV1UseCase),
    postCauseVerifyUseCase: awilix.asClass(postCauseVerifyUseCase),
    getIndexUseCase: awilix.asClass(getIndexUseCase),
    getFAQUseCase: awilix.asClass(getFAQUseCase),
    getExploreUseCase: awilix.asClass(getExploreUseCase),
    get404UseCase: awilix.asClass(get404UseCase),
    getLoginUseCase: awilix.asClass(getLoginUseCase),
    getRegisterUseCase: awilix.asClass(getRegisterUseCase),
    getResetPasswordUseCase: awilix.asClass(getResetPasswordUseCase),
    getCauseIndexUseCase: awilix.asClass(getCauseIndexUseCase),
    getRegisterConfirmUseCase: awilix.asClass(getRegisterConfirmUseCase),
    getResetPasswordConfirmUseCase: awilix.asClass(getResetPasswordConfirmUseCase),
    postLoginUseCase: awilix.asClass(postLoginUseCase),
    postRegisterUseCase: awilix.asClass(postRegisterUseCase),
    postResetPasswordUseCase: awilix.asClass(postResetPasswordUseCase),
    postResetPasswordConfirmUseCase: awilix.asClass(postResetPasswordConfirmUseCase),
    postCauseUseCase: awilix.asClass(postCauseUseCase),
    postCauseOnlineStatusUseCase: awilix.asClass(postCauseOnlineStatusUseCase),
    postWalletUseCase: awilix.asClass(postWalletUseCase),
    getShowcaseUseCase: awilix.asClass(getShowcaseUseCase),
    deleteAccountUseCase: awilix.asClass(deleteAccountUseCase),
    postChangePasswordUseCase: awilix.asClass(postChangePasswordUseCase),
    getNoticeUseCase: awilix.asClass(getNoticeUseCase),
    deleteNoticeUseCase: awilix.asClass(deleteNoticeUseCase),
    postCauseImageUseCase: awilix.asClass(postCauseImageUseCase),
    postCauseImagePrimaryUseCase: awilix.asClass(postCauseImagePrimaryUseCase),
    deleteCauseImageUseCase: awilix.asClass(deleteCauseImageUseCase),

    identifyUserFromJWTTokenStep: awilix.asClass(identifyUserFromJWTTokenStep),
    redirectToAuthorisedRouteStep: awilix.asClass(redirectToAuthorisedRouteStep),
    applyTokenRequestStep: awilix.asClass(applyTokenRequestStep),
    identifyUserFromTokenStep: awilix.asClass(identifyUserFromTokenStep),
    applyCriticalResourceAuthStep: awilix.asClass(applyCriticalResourceAuthStep),
    toggleCauseOnlineStatusStep: awilix.asClass(toggleCauseOnlineStatusStep),
    updateJwtUserStep: awilix.asClass(updateJwtUserStep),
    verifyRecaptchaStep: awilix.asClass(verifyRecaptchaStep),

    jwtLibrary: awilix.asFunction(invokeJwtLibrary),
    cookieLibrary: awilix.asValue(invokeCookieLibrary),
    dateLibrary: awilix.asValue(invokeDateLibrary),
    aclLibrary: awilix.asFunction(invokeAclLibrary),
    seoLibrary: awilix.asFunction(invokeSeoLibrary),
    enumLibrary: awilix.asFunction(invokeEnumLibrary),
    mailLibrary: awilix.asFunction(invokeMailLibrary),
    currencyLibrary: awilix.asValue(invokeCurrencyLibrary)
  }
}
