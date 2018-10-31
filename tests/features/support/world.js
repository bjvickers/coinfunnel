
var { setWorldConstructor } = require('cucumber')

class World {
  constructor () {
    // The resource is the url requested
    this.resource = null

    // If the query string is used to specify a sort, then
    // this wil be populated here.
    this.querySort = null

    // If the query string is used to specify a keyword search,
    // then this wil be populated here.
    this.queryKeyword = null

    // The response is the server response
    this.response = null

    // Holds keyword suggestions returned by the server
    this.suggestions = null

    // Current user, and their corresponding json web token.
    this.user = null
    this.jwt = null

    // Represents the user as they exist in the database
    this.dbUser = null

    // Represents the Cause as it exists in the database
    this.dbCause = null

    // Represents the register/password-reset url token
    this.token = null

    // Represents the type of user the guest wishes to register as
    this.registerAsUserType = null

    // System notices
    this.notices = []

    // Keeps the wallet addresses unique
    this.walletIncrement = 1

    // ID of the cause that the user/client is currently mining for.
    this.causeToMineID = null

    // ID of the volunteer's mining client
    this.clientID = null
  }

  reset () {
    this.resource = null
    this.querySort = null
    this.queryKeyword = null
    this.response = null
    this.suggestions = null
    this.user = null
    this.dbUser = null
    this.dbCause = null
    this.jwt = null
    this.token = null
    this.registerAsUserType = null
    this.notices = []
    this.walletIncrement = 1
    this.causeToMineID = null
    this.clientID = null
  }
}

setWorldConstructor(World)
