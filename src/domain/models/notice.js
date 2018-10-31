'use strict'

class Notice {
  constructor () {
    this.id = null
    this.dateAdded = null
    this.dateApplies = null
    this.subject = null
    this.content = null
    this.isRead = false
    this.isDeleted = false
  }

  updateReadStatus (user) {
    this.isRead = !!user.noticesRead.find(noticeId => noticeId === this.id)
  }

  updateDeletedStatus (user) {
    this.isDeleted = !!user.noticesDeleted.find(noticeId => noticeId === this.id)
  }

  merge (notice) {
    this.id = notice.id || this.id
    this.dateAdded = notice.dateAdded || this.dateAdded
    this.dateApplies = notice.dateApplies || this.dateApplies
    this.subject = notice.subject || this.subject
    this.content = notice.content || this.content
    this.isRead = notice.isRead || this.isRead
    this.isDeleted = notice.isDeleted || this.isDeleted
  }

  toJSON () {
    const json = {
      id: this.id,
      dateAdded: this.dateAdded ? this.dateAdded.toISOString() : null,
      dateApplies: this.dateApplies ? this.dateApplies.toISOString() : null,
      subject: this.subject,
      content: this.content,
      isRead: this.isRead,
      isDeleted: this.isDeleted
    }
    return json
  }
}

module.exports = Notice
