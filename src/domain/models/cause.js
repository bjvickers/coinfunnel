'use strict'

const _ = require('lodash')
const uuidv3 = require('uuid/v3')

class Cause {
  constructor () {
    this.id = null
    this.userId = null
    this.externalId = null
    this.isOnline = false
    this.offlineNotice = null
    this.path = null  // CausePath
    this.name = null
    this.incorporationId = null
    this.incorporationDate = null
    this.phone = null
    this.email = null
    this.website = null
    this.address1 = null
    this.address2 = null
    this.address3 = null
    this.country = null
    this.desc = null
    this.keywords = []
    this.dateAdded = null
    this.dateModified = null
    this.primaryImage = null
    this.totalPayouts = 0
    this.totalMiners = 0
    this.verificationState = null // null/Complete/Pending
    this.verificationOutcome = null // null/Passed/Failed/Pending
    this.verificationOutcomeReason = null // null/No response to email / No response to telephone /Unable to find charity on register
  }

  getIsVerifiable () {
    if (this.getIsComplete() && this.getIsIncorporated() && this.country === 'United Kingdom') {
      return true
    }
    return false
  }

  getIsVerificationComplete () {
    if (this.verificationState === 'Complete' &&
       (this.verificationOutcome === 'Passed' || this.verificationOutcome === 'Failed')) {
      return true
    }
    return false
  }

  getIsVerificationPending () {
    if (this.verificationState === 'Pending' && this.verificationOutcome === 'Pending') {
      return true
    }
    return false
  }

  getIsVerified () {
    return this.verificationState === 'Complete' && this.verificationOutcome === 'Passed'
  }

  getHasFailedVerification () {
    return this.verificationState === 'Complete' && this.verificationOutcome === 'Failed'
  }

  getTotalPayoutsString () {
    return this.totalPayouts ? `${this.totalPayouts}` : '0.000000000000'
  }

  getTruncatedDesc (maxLength) {
    if (!this.desc) {
      return ''
    }
    maxLength = maxLength || 240
    if (this.desc.length < maxLength) {
      return this.desc
    }
    return this.desc.substring(0, maxLength).concat('...')
  }

  getIsIncorporated () {
    if (this.incorporationId && this.incorporationDate) {
      return true
    }
    return false
  }

  getPrimaryImage () {
    return this.primaryImage || 'https://via.placeholder.com/150x100?text=No%20image'
  }

  getIsComplete () {
    if ((this.id) && (this.userId) && (this.path) && (this.name) &&
        (this.phone) && (this.address1) && (this.country) && (this.desc) &&
        (this.keywords.length) && (this.email) && (this.dateAdded) &&
        (this.dateModified)) {
      return true
    }
    return false
  }

  getIsDetailsComplete () {
    if ((this.id) && (this.userId) && (this.path) && (this.name) &&
        (this.phone) && (this.address1) && (this.country) && (this.email) &&
        (this.dateAdded) && (this.dateModified)) {
      return true
    }
    return false
  }

  getSingleLineAddress () {
    if (!this.address1) {
      return ''
    }
    if (!this.address2) {
      return this.address1
    }
    if (!this.address3) {
      return `${this.address1}, ${this.address2}`
    }
    return `${this.address1}, ${this.address2}, ${this.address3}`
  }

  setExternalId (namespace) {
    this.externalId = uuidv3(namespace, uuidv3.DNS).replace(/-/g, '')
  }

  addKeyword (keyword) {
    if (!keyword) {
      return
    }

    keyword = keyword.trim()
    if (keyword.length === 0) {
      return
    }

    keyword = keyword.toLowerCase()
    this.keywords.push(keyword)
    this.keywords = _.uniq(this.keywords)
  }

  addKeywords (keywords) {
    keywords.forEach((keyword) => this.addKeyword(keyword))
  }

  toJSON () {
    return {
      id: this.id,
      userId: this.userId,
      externalId: this.externalId,
      isComplete: this.getIsComplete(),
      isOnline: this.isOnline,
      offlineNotice: this.offlineNotice,
      path: (this.path) ? this.path.toJSON() : null,
      name: this.name,
      incorporationId: this.incorporationId,
      incorporationDate: this.incorporationDate,
      phone: this.phone,
      email: this.email,
      website: this.website,
      address1: this.address1,
      address2: this.address2,
      address3: this.address3,
      country: this.country,
      desc: this.desc,
      keywords: this.keywords,
      dateAdded: this.dateAdded ? this.dateAdded.toISOString() : null,
      dateModified: this.dateModified ? this.dateModified.toISOString() : null,
      primaryImage: this.primaryImage,
      totalPayouts: this.totalPayouts,
      totalMiners: this.totalMiners,
      isVerifiable: this.isVerifiable,
      verificationState: this.verificationState,
      verificationOutcome: this.verificationOutcome,
      verificationOutcomeReason: this.verificationOutcomeReason
    }
  }
}

module.exports = Cause
