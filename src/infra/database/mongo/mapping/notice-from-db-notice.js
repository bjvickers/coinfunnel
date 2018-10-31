'use strict'

// Describes the relationship between the (DB) NoticeSchema and
// the corresponding Notice model. This is useful for creating
// Notice model objects from NoticeSchema objects, as both
// can be passed to the NoticeFactory which will do the rest.

// Notice (model) properties on the left
// NoticeSchema (mongo) properties on the right
const NoticeFromDbNoticeMapping = {
  'id': 'id',
  'dateAdded': 'date_added',
  'dateApplies': 'date_applies',
  'subject': 'subject',
  'content': 'content',
  'isRead': null
}

module.exports = NoticeFromDbNoticeMapping
