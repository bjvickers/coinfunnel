'use strict'

/**
 * Domain models, enums, factories and libraries
 */

const appRootPath = require('app-root-path')
const awilix = require('awilix')

// Models
const User = require(`${appRootPath}/src/domain/models/user`)
const Password = require(`${appRootPath}/src/domain/models/password`)
const Cause = require(`${appRootPath}/src/domain/models/cause`)
const CauseImage = require(`${appRootPath}/src/domain/models/cause-image`)
const CausePath = require(`${appRootPath}/src/domain/models/cause-path`)
const Wallet = require(`${appRootPath}/src/domain/models/wallet`)
const Notice = require(`${appRootPath}/src/domain/models/notice`)
const Monero = require(`${appRootPath}/src/domain/models/monero`)

// Enums
const UserRoles = require(`${appRootPath}/src/domain/enums/user-roles`)
const UserRegistrationStates = require(`${appRootPath}/src/domain/enums/user-registration-states`)
const UserPasswordStates = require(`${appRootPath}/src/domain/enums/user-password-states`)
const WalletCreatorTypes = require(`${appRootPath}/src/domain/enums/wallet-creator-types`)
const SupportedCurrencies = require(`${appRootPath}/src/domain/enums/supported-currencies`)

// Factories
const CauseFactory = require(`${appRootPath}/src/domain/factories/cause`)
const CausePathFactory = require(`${appRootPath}/src/domain/factories/cause-path`)
const UserFactory = require(`${appRootPath}/src/domain/factories/user`)
const WalletFactory = require(`${appRootPath}/src/domain/factories/wallet`)
const NoticeFactory = require(`${appRootPath}/src/domain/factories/notice`)

// Libraries
const invokeUserLibrary = require(`${appRootPath}/src/domain/lib/user`)
const invokePasswordLibrary = require(`${appRootPath}/src/domain/lib/password`)
const invokeWalletLibrary = require(`${appRootPath}/src/domain/lib/wallet`)

module.exports = () => {
  return {
    User: awilix.asValue(User),
    Password: awilix.asValue(Password),
    Cause: awilix.asValue(Cause),
    CauseImage: awilix.asValue(CauseImage),
    CausePath: awilix.asValue(CausePath),
    Wallet: awilix.asValue(Wallet),
    Notice: awilix.asValue(Notice),
    Monero: awilix.asValue(Monero),

    UserRoles: awilix.asValue(UserRoles),
    UserRegistrationStates: awilix.asValue(UserRegistrationStates),
    UserPasswordStates: awilix.asValue(UserPasswordStates),
    WalletCreatorTypes: awilix.asValue(WalletCreatorTypes),
    SupportedCurrencies: awilix.asValue(SupportedCurrencies),

    CauseFactory: awilix.asFunction(CauseFactory),
    CausePathFactory: awilix.asFunction(CausePathFactory),
    UserFactory: awilix.asFunction(UserFactory),
    WalletFactory: awilix.asFunction(WalletFactory),
    NoticeFactory: awilix.asFunction(NoticeFactory),

    userLibrary: awilix.asFunction(invokeUserLibrary),
    passwordLibrary: awilix.asFunction(invokePasswordLibrary),
    walletLibrary: awilix.asFunction(invokeWalletLibrary)
  }
}
