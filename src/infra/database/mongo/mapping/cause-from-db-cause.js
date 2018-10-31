'use strict'

// Describes the relationship between the (DB) CauseSchema and
// the corresponding Cause model. This is useful for creating
// Cause model objects from CauseSchema objects, as both
// can be passed to the CauseFactory which will do the rest.

// Cause (model) properties on the left
// CauseSchema (mongo) properties on the right
const CauseFromDbCauseMapping = {
  'id': 'cause_id',
  'userId': 'user_id',
  'externalId': 'cause_external_id',
  'isOnline': 'is_online',
  'offlineNotice': 'offline_notice',
  'path': true,
  'path.path': 'path',
  'path.extension': 'path_extension',
  'path.combined': 'path_combined',
  'name': 'name',
  'incorporationId': 'incorporation_id',
  'incorporationDate': 'incorporation_date',
  'phone': 'phone',
  'email': 'email',
  'website': 'website',
  'address1': 'address1',
  'address2': 'address2',
  'address3': 'address3',
  'country': 'country',
  'desc': 'desc',
  'keywords': 'keywords',
  'dateAdded': 'date_added',
  'dateModified': 'date_modified',
  'primaryImage': 'primary_image',
  'totalPayouts': 'total_payouts',
  'totalMiners': 'total_miners',
  'verificationState': 'verification_state',
  'verificationOutcome': 'verification_outcome',
  'verificationOutcomeReason': 'verification_reason'
}

module.exports = CauseFromDbCauseMapping
