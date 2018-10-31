'use strict'

class ApplyTokenRequestStep {
  constructor (inject) {
    this.inject = inject
  }

  /**
   * Returns true (successful), or throws an error
   */
  async execute (user, tokenType) {
    if (!this.inject.enumLibrary.isValidTokenType(tokenType)) {
      throw new Error('Unknown token type; Unable to identify email to send.')
    }

    const token = this.inject.TokenFactory.createToken(user.id, tokenType)
    await this.inject.dbService.getTokenDataMapper().persist(token)

    if (tokenType === this.inject.TokenTypes.registration) {
      this.inject.emailService.sendConfirmRegistrationRequest(user, token)
      this.inject.logService.info({ token: token }, 'Saved token; sent confirm registration email')
    } else {
      this.inject.emailService.sendResetPasswordRequest(user, token)
      this.inject.logService.info({ token: token }, 'Saved token; sent reset password email')
    }
    return true
  }
}

module.exports = ApplyTokenRequestStep
