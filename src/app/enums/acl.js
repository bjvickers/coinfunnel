'use strict'

const ACL = {
  GetIndex: {
    resource: '/',
    permission: 'get',
    roles: ['guest', 'cause', 'donator', 'admin']
  },
  GetExplore: {
    resource: '/explore',
    permission: 'get',
    roles: ['guest', 'cause', 'donator', 'admin']
  },
  GetShowcase: {
    resource: '/causes',
    permission: 'get',
    roles: ['guest', 'cause', 'donator', 'admin']
  },
  GetFAQ: {
    resource: '/faq',
    permission: 'get',
    roles: ['guest', 'cause', 'donator', 'admin']
  },
  GetAllAPIV1: {
    resource: '/api/v1',
    permission: 'get',
    roles: ['guest']
  },
  PostCauseActionAPIV1: {
    resource: '/api/v1/cause/action',
    permission: 'post',
    roles: ['guest']
  },

  GetLogin: {
    resource: '/login',
    permission: 'get',
    roles: ['guest']
  },
  PostLogin: {
    resource: '/login',
    permission: 'post',
    roles: ['guest']
  },

  GetRegister: {
    resource: '/register',
    permission: 'get',
    roles: ['guest']
  },
  PostRegister: {
    resource: '/register',
    permission: 'post',
    roles: ['guest']
  },
  GetRegisterConfirm: {
    resource: '/register/confirm',
    permission: 'get',
    roles: ['guest']
  },
  DeleteAccount: {
    resource: '/user/account',
    permission: 'delete',
    roles: ['cause', 'donator']
  },

  GetResetPassword: {
    resource: '/reset-password',
    permission: 'get',
    roles: ['guest']
  },
  PostResetPassword: {
    resource: '/reset-password',
    permission: 'post',
    roles: ['guest']
  },
  GetResetPasswordConfirm: {
    resource: '/reset-password/confirm',
    permission: 'get',
    roles: ['guest']
  },
  PostResetPasswordConfirm: {
    resource: '/reset-password/confirm',
    permission: 'post',
    roles: ['guest']
  },

  GetLogout: {
    resource: '/logout',
    permission: 'get',
    roles: ['cause', 'donator', 'admin']
  },

  GetCauseIndex: {
    resource: '/dashboard/cause',
    permission: 'get',
    roles: ['cause']
  },
  GetCausePayments: {
    resource: '/cause/payments',
    permission: 'get',
    roles: ['cause']
  },
  PostCauseVerify: {
    resource: '/dashboard/cause/verify',
    permission: 'post',
    roles: ['cause']
  },
  PostCause: {
    resource: '/dashboard/cause',
    permission: 'post',
    roles: ['cause']
  },
  PostCauseOnlineStatus: {
    resource: '/dashboard/cause/online-status',
    permission: 'post',
    roles: ['cause']
  },
  PostCurrency: {
    resource: '/account/currency',
    permission: 'post',
    roles: ['cause', 'donator']
  },
  PostWallet: {
    resource: '/user/wallet',
    permission: 'post',
    roles: ['cause']
  },
  PostCauseImage: {
    resource: '/dashboard/cause/image',
    permission: 'post',
    roles: ['cause']
  },
  PostCauseImagePrimary: {
    resource: '/dashboard/cause/primary-image',
    permission: 'post',
    roles: ['cause']
  },
  DeleteCauseImage: {
    resource: '/dashboard/cause/image',
    permission: 'delete',
    roles: ['cause']
  },
  PostChangePassword: {
    resource: '/user/change-password',
    permission: 'post',
    roles: ['cause', 'donator']
  },
  GetNotice: {
    resource: '/user/notice',
    permission: 'get',
    roles: ['cause', 'donator']
  },
  DeleteNotice: {
    resource: '/user/notice',
    permission: 'delete',
    roles: ['cause', 'donator']
  },

  GetAdminIndex: {
    resource: '/dashboard/admin',
    permission: 'get',
    roles: ['admin']
  },
  GetDonatorIndex: {
    resource: '/dashboard/donator',
    permission: 'get',
    roles: ['donator']
  },

  Get404: {
    resource: '/404',
    permission: 'get',
    roles: ['guest', 'cause', 'donator', 'admin']
  },
  Get500: {
    resource: '/500',
    permission: 'get',
    roles: ['guest', 'cause', 'donator', 'admin']
  },

  PostResetPasswordUseCase: {
    resource: 'PostResetPasswordUseCase',
    permission: 'use',
    roles: ['cause', 'donator']
  },
  PostResetPasswordConfirmUseCase: {
    resource: 'PostResetPasswordConfirmUseCase',
    permission: 'use',
    roles: ['cause', 'donator']
  }
}

module.exports = ACL
