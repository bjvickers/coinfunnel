'use strict'

const $ = require('jquery')

const exploreFormName = `form[name='explore']`
const exploreForm = $(exploreFormName)
const exploreSearchId = '#explore_search'
const exploreSearchCountry = '#cause-search-country'
const exploreSortId = '#explore_sort'
const exploreClearId = '#explore_clear'

const buildSimpleUri = () => {
  return exploreForm.attr('action')
}

const buildQueryUri = (page) => {
  const keyword = encodeURIComponent($('#cause-search').val())
  const country = $('#cause-search-country').val()
  const sort = $(exploreSortId).val()
  const resource = exploreForm.attr('action')
  return `${resource}?page=${page}&keyword=${keyword}&sort=${sort}&country=${country}`
}

const handleExplore = () => {
  exploreForm.submit((e) => e.preventDefault())

  $(exploreClearId).on('click', () => {
    window.location.replace(buildSimpleUri())
  })

  $(exploreSearchId).on('click', () => {
    window.location.replace(buildQueryUri(1))
  })

  $(exploreSortId).on('change', () => {
    window.location.replace(buildQueryUri(1))
  })

  $(exploreSearchCountry).on('change', () => {
    window.location.replace(buildQueryUri(1))
  })

  $('ul.pagination > li > a').on('click', function (e) {
    const pageQuery = $(this).attr('href')
    const pageNum = pageQuery ? pageQuery.match(/\d+/g) : 1
    window.location.replace(buildQueryUri(pageNum))
    return false
  })
}

module.exports = {
  handleExplore
}
