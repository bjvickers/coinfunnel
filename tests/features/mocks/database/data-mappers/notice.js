'use strict'

let notices = []

const findById = async (noticeId) => {
  noticeId = Number(noticeId)
  return notices.find(notice => notice.id === noticeId) || null
}

const findAllExpired = () => {
  const expired = notices.filter(notice => {
    if (notice.noticeApplies && notice.noticeApplies < Date.now) {
      return true
    }
    return false
  })
  return expired
}

const findAll = async () => notices

const persist = async (notice) => {
  notices.push(notice)
  return notice
}

const remove = (notice) => {
  notices = notices.filter(storedNotice => storedNotice.id !== notice.id)
}

const removeAll = () => {
  notices = []
}

module.exports = () => {
  return {
    findById,
    findAllExpired,
    findAll,
    persist,
    removeAll
  }
}
