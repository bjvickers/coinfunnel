'use strict'

const cloudinary = require('cloudinary')
const EventEmitter = require('events').EventEmitter

class DeleteAccountUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'DeleteAccountUseCase'
    this.inject = inject
  }

  logSuccess (userId, userEmail) {
    this.inject.logService.info({
      usecaseName: this.name,
      userId: userId,
      userEmail: userEmail }, 'Success')
  }

  async deleteCause (cause) {
    if (cause) {
      await this.inject.dbService.getCauseDataMapper().remove(cause)
      this.inject.logService.info({}, 'Deleted Cause in database')
    }
  }

  deleteCauseImages (causeImages) {
    causeImages.forEach((causeImage) => {
      cloudinary.v2.uploader.destroy(causeImage.publicId, (err, result) => {
        if (err) {
          this.inject.logService.error({
            err: err,
            err_message: err.message,
            causeId: causeImage.causeId,
            publicId: causeImage.publicId },
            `Error deleting image in cloudinary`)
        }
      })
    })
  }

  async deleteCauseImageRecords (causeImages) {
    for (let i = 0; i < causeImages.length; i++) {
      await this.inject.dbService.getCauseImageDataMapper().remove(causeImages[i].publicId)
    }
  }

  async getAllWalletsForUser (user) {
    const currentWallet = await this.inject.dbService.getWalletDataMapper().findCurrentByUserId(user.id)
    const previousWallets = await this.inject.dbService.getWalletDataMapper().findPreviousByUserId(user.id)
    let allWallets = [ currentWallet ]
    if (previousWallets.length) {
      allWallets = allWallets.concat(previousWallets)
    }
    return allWallets
  }

  removeSystemWalletFromList (wallets) {
    return wallets.filter(wallet => wallet.creatorType === this.inject.WalletCreatorTypes.User)
  }

  getAllWalletAddresses (wallets) {
    const walletAddresses = []
    if (wallets.length) {
      for (let i = 0; i < wallets.length; i++) {
        walletAddresses.push(wallets[i].address)
      }
    }
    return walletAddresses
  }

  async deleteAllWallets (wallets) {
    for (let i = 0; i < wallets.length; i++) {
      await this.inject.dbService.getWalletDataMapper().remove(wallets[i])
    }
  }

  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.deleteAccountPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      // Make a note of the user id and email so that we can write these to
      // the log after deletion.
      const userId = res.locals.user.id
      const userEmail = res.locals.user.email

      const causeToDelete = await this.inject.dbService.getCauseDataMapper().findByUserId(res.locals.user.id)
      const causeImages = await this.inject.dbService.getCauseImageDataMapper().findByCauseId(causeToDelete.id)

      // Delete cause
      await this.deleteCause(causeToDelete)
      this.inject.logService.info({}, 'Deleted Cause in database')

      // Delete images on the CDN and their corresponding references in the database
      this.deleteCauseImages(causeImages)
      this.inject.logService.info({}, 'Deleted Cause images on CDN')
      await this.deleteCauseImageRecords(causeImages)
      this.inject.logService.info({}, 'Deleted Cause image records in database')

      // Delete wallets
      const allWallets = await this.getAllWalletsForUser(res.locals.user)
      const userWallets = this.removeSystemWalletFromList(allWallets)
      const allUserWalletAddresses = this.getAllWalletAddresses(userWallets)
      await this.deleteAllWallets(allWallets)
      this.inject.logService.info({}, 'Deleted wallets in database')

      // Delete user
      await this.inject.dbService.getUserDataMapper().remove(res.locals.user)
      this.inject.logService.info({}, 'Deleted user in database')

      // Send deletion email
      await this.inject.emailService.sendDeleteAccountRequest(res.locals.user, allUserWalletAddresses)
      this.inject.logService.info({}, 'Sent delete account email')

      // Destroy the JWT token to log the user out of the system.
      this.inject.cookieLibrary.unsetCookie(res)
      this.inject.logService.info({}, 'Logged user out of system')

      this.logSuccess(userId, userEmail)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = DeleteAccountUseCase
