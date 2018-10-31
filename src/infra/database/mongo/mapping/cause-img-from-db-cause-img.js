'use strict'

// CauseImage (model) properties on the left
// CauseImageSchema (mongo) properties on the right
const CauseImageFromDbCauseImageMapping = {
  'causeId': 'cause_id',
  'publicId': 'public_id',
  'isPrimary': 'is_primary',
  'imageThumb1': 'image_thumb_1',
  'imageThumb2': 'image_thumb_2',
  'imageFull': 'image_full',
  'dateAdded': 'date_added',
  'dateModified': 'date_modified'
}

module.exports = CauseImageFromDbCauseImageMapping
