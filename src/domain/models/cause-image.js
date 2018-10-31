'use strict'

class CauseImage {
  constructor () {
    this.causeId = null
    this.publicId = null
    this.isPrimary = false
    this.imageThumb1 = null
    this.imageThumb2 = null
    this.imageFull = null
    this.dateAdded = null
    this.dateModified = null
  }

  toJSON () {
    return {
      causeId: this.causeId,
      publicId: this.publicId,
      isPrimary: this.isPrimary,
      imageThumb1: this.imageThumb1,
      imageThumb2: this.imageThumb2,
      imageFull: this.imageFull,
      dateAdded: this.dateAdded ? this.dateAdded.toISOString() : null,
      dateModified: this.dateModified ? this.dateModified.toISOString() : null
    }
  }
}

module.exports = CauseImage
