'use strict'

// Describes the relationship between the Search schema and
// the corresponding Cause model. This is useful for creating
// Cause model objects from Search schema objects, as both
// can be passed to the CauseFactory which will do the rest.

// Cause (model) properties on the left
// Search schema properties on the right
const CauseFromSearchTypeMapping = {
  'id': '_source.causeId',
  'userId': '_source.userId',
  'isOnline': null,
  'path': true,
  'path.path': '_source.path',
  'name': '_source.name',
  'incorporationId': '_source.incorporationId',
  'incorporationDate': '_source.incorporationDate',
  'phone': '_source.phone',
  'email': '_source.email',
  'website': '_source.website',
  'address1': '_source.address1',
  'address2': '_source.address2',
  'address3': '_source.address3',
  'country': '_source.country',
  'desc': '_source.desc',
  'keywords': '_source.keywords',
  'dateAdded': '_source.dateAdded',
  'dateModified': '_source.dateModified',
  'primaryImage': '_source.primaryImage',
  'totalPayouts': '_source.totalPayouts'
}

module.exports = CauseFromSearchTypeMapping
