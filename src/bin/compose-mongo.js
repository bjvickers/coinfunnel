'use strict'

const appRootPath = require('app-root-path')
const awilix = require('awilix')
const config = require('config')

const invokeDataAccessLayer = require(`${appRootPath}/src/infra/database/mongo/data-access-layer`)

const TokenSchema = require(`${appRootPath}/src/infra/database/mongo/schemas/token-schema`)
const UserSchema = require(`${appRootPath}/src/infra/database/mongo/schemas/user-schema`)
const CauseSchema = require(`${appRootPath}/src/infra/database/mongo/schemas/cause-schema`)
const WalletSchema = require(`${appRootPath}/src/infra/database/mongo/schemas/wallet-schema`)
const NoticeSchema = require(`${appRootPath}/src/infra/database/mongo/schemas/notice-schema`)
const CauseImageSchema = require(`${appRootPath}/src/infra/database/mongo/schemas/cause-image-schema`)
const PayoutCronSchema = require(`${appRootPath}/src/infra/database/mongo/schemas/payout-cron-schema`)
const CausePayoutSchema = require(`${appRootPath}/src/infra/database/mongo/schemas/cause-payout-schema`)
const TotalsSchema = require(`${appRootPath}/src/infra/database/mongo/schemas/totals-schema`)

const TokenFromDbTokenMapping = require(`${appRootPath}/src/infra/database/mongo/mapping/token-from-db-token`)
const UserFromDbUserMapping = require(`${appRootPath}/src/infra/database/mongo/mapping/user-from-db-user`)
const CauseFromDbCauseMapping = require(`${appRootPath}/src/infra/database/mongo/mapping/cause-from-db-cause`)
const WalletFromDbWalletMapping = require(`${appRootPath}/src/infra/database/mongo/mapping/wallet-from-db-wallet`)
const NoticeFromDbNoticeMapping = require(`${appRootPath}/src/infra/database/mongo/mapping/notice-from-db-notice`)

const invokeTokenDataMapper = require(`${appRootPath}/src/infra/database/mongo/data-mappers/token`)
const invokeUserDataMapper = require(`${appRootPath}/src/infra/database/mongo/data-mappers/user`)
const invokeCauseDataMapper = require(`${appRootPath}/src/infra/database/mongo/data-mappers/cause`)
const invokeCauseImageDataMapper = require(`${appRootPath}/src/infra/database/mongo/data-mappers/cause-image`)
const invokeWalletDataMapper = require(`${appRootPath}/src/infra/database/mongo/data-mappers/wallet`)
const invokeNoticeDataMapper = require(`${appRootPath}/src/infra/database/mongo/data-mappers/notice`)
const invokePayoutCronDataMapper = require(`${appRootPath}/src/infra/database/mongo/data-mappers/payout-cron`)
const invokeCausePayoutDataMapper = require(`${appRootPath}/src/infra/database/mongo/data-mappers/cause-payout`)
const invokeTotalsDataMapper = require(`${appRootPath}/src/infra/database/mongo/data-mappers/totals`)
const invokeDataMapperDecorator = require(`${appRootPath}/src/infra/database/mongo/data-mappers/decorators/remove-all`)

module.exports = () => {
  const registerables = {
    dbService: awilix.asFunction(invokeDataAccessLayer),

    TokenSchema: awilix.asValue(TokenSchema),
    UserSchema: awilix.asValue(UserSchema),
    CauseSchema: awilix.asValue(CauseSchema),
    WalletSchema: awilix.asValue(WalletSchema),
    NoticeSchema: awilix.asValue(NoticeSchema),
    CauseImageSchema: awilix.asValue(CauseImageSchema),
    PayoutCronSchema: awilix.asValue(PayoutCronSchema),
    CausePayoutSchema: awilix.asValue(CausePayoutSchema),
    TotalsSchema: awilix.asValue(TotalsSchema),

    TokenFromDbTokenMapping: awilix.asValue(TokenFromDbTokenMapping),
    UserFromDbUserMapping: awilix.asValue(UserFromDbUserMapping),
    CauseFromDbCauseMapping: awilix.asValue(CauseFromDbCauseMapping),
    WalletFromDbWalletMapping: awilix.asValue(WalletFromDbWalletMapping),
    NoticeFromDbNoticeMapping: awilix.asValue(NoticeFromDbNoticeMapping),

    dbTokenDataMapper: awilix.asFunction(invokeTokenDataMapper),
    dbUserDataMapper: awilix.asFunction(invokeUserDataMapper),
    dbCauseDataMapper: awilix.asFunction(invokeCauseDataMapper),
    dbCauseImageDataMapper: awilix.asFunction(invokeCauseImageDataMapper),

    dbWalletDataMapper: awilix.asFunction(invokeWalletDataMapper),
    dbNoticeDataMapper: awilix.asFunction(invokeNoticeDataMapper),
    dbPayoutCronDataMapper: awilix.asFunction(invokePayoutCronDataMapper),
    dbCausePayoutDataMapper: awilix.asFunction(invokeCausePayoutDataMapper),
    dbTotalsDataMapper: awilix.asFunction(invokeTotalsDataMapper)
  }

  if (config.get('app.env').startsWith('test')) {
    registerables['dbDataMapperDecorator'] = awilix.asFunction(invokeDataMapperDecorator)
  }

  return registerables
}
