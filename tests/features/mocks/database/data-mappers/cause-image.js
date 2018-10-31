'use strict'

let causeImages = []

const findByCauseId = async (causeId) => {
  const found = causeImages.filter(causeImage => causeImage.causeId === causeId)
  return found
}

const findByPublicId = async (publicId) => {
  const found = causeImages.filter(causeImage => causeImage.publicId === publicId)
  return found.length ? found[0] : null
}

const findPrimaryByCauseId = async (causeId) => {
  const found = causeImages.filter(causeImage => causeImage.causeId === causeId && causeImage.isPrimary)
  return found.length ? found[0] : null
}

const persist = async (causeImage) => {
  causeImages.push(causeImage)
  return true
}

const remove = (publicId) => {
  causeImages = causeImages.filter(storedCauseImage => storedCauseImage.publicId !== publicId)
}

const removeAllForCause = (causeId) => {
  causeImages = causeImages.filter(storedCauseImage => storedCauseImage.causeId !== causeId)
}

const removeAll = () => {
  causeImages = []
}

module.exports = () => {
  return {
    findByCauseId,
    findPrimaryByCauseId,
    findByPublicId,
    persist,
    remove,
    removeAllForCause,
    removeAll
  }
}
