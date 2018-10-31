'use strict'

// Describes the relationship between the (DB) TokenSchema and
// the corresponding Token model. This is useful for creating
// Token model objects from TokenSchema objects, as both
// can be passed to the TokenFactory which will do the rest.

// Token (model) properties on the left
// TokenSchema (mongo) properties on the right
const TokenFromDbTokenMapping = {
  'userId': 'user_id',
  'token': 'token',
  'type': 'type'
}

module.exports = TokenFromDbTokenMapping
