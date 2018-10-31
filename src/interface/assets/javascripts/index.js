'use strict'

const $ = require('jquery')
const Popper = require('popper.js')
require('bootstrap')

const handlers = require('./handlers')
const login = require('./login')
const register = require('./register')
const resetPassword = require('./reset-password')
const resetPasswordConfirm = require('./reset-password-confirm')
const explore = require('./explore')
const causeName = require('./cause-name')
const causeIncorporationId = require('./cause-incorporation-id')
const causeIncorporationDate = require('./cause-incorporation-date')
const causePhone = require('./cause-phone')
const causeEmail = require('./cause-email')
const causeWeb = require('./cause-website')
const causeAddress = require('./cause-address')
const causeDesc = require('./cause-desc')
const causeCountry = require('./cause-country')
const causeKeywords = require('./cause-keywords')
const causeOnlineStatus = require('./cause-online-status')
const causeVerify = require('./cause-verify')
const wallet = require('./wallet')
const deleteAccount = require('./delete-account')
const changePassword = require('./change-password')
const notices = require('./notices')
const image = require('./image')
const accountCurrency = require('./account-currency')

$(() => {
  handlers.handleLogout()
  login.handleLogin()
  register.handleRegister()
  resetPassword.handleResetPassword()
  resetPasswordConfirm.handleResetPasswordConfirm()
  explore.handleExplore()
  
  causeName.handleUpdate()
  causeIncorporationId.handleUpdate()
  causeIncorporationDate.handleUpdate()
  causePhone.handleUpdate()
  causeEmail.handleUpdate()
  causeWeb.handleUpdate()
  causeAddress.handleUpdate()
  causeDesc.handleUpdate()
  causeCountry.handleUpdate()
  causeKeywords.handleUpdate()
  causeVerify.handleVerify()
  
  causeOnlineStatus.handleToggleOnlineStatus()
  wallet.handleWalletAdd()
  deleteAccount.handleAccountDelete()
  changePassword.handleChangePassword()
  notices.handleNotices()
  image.handleImages()
  accountCurrency.handleUpdate()

  // Configure pop-up notices
  $('[data-toggle="popover"]').popover()
  $('.popover-dismiss').popover({
    trigger: 'focus'
  })
  $('.popover-links').on('click', (e) => {
    e.preventDefault()
  })

  // Disable Cause Index forms trigger on return
  $('form#cause :input').keypress(function (e) {
    if(e.keyCode === 13){
      e.preventDefault()
    }
  })
  $('form#wallet :input').keypress(function (e) {
    if(e.keyCode === 13){
      e.preventDefault()
    }
  })
  $('form#change-password-form :input').keypress(function (e) {
    if(e.keyCode === 13){
      e.preventDefault()
    }
  })
  $('form#account-delete-form :input').keypress(function (e) {
    if(e.keyCode === 13){
      e.preventDefault()
    }
  })
})
