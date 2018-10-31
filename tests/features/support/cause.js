'use strict'

const charityDefinitions = [
  { id: 1, name: 'Depression Charity', keywords: ['bipolar', 'dysthemia'], dateAdded: new Date(Date.now() + (1 * 60 * 60)) },
  { id: 2, name: 'Homeless Charity', keywords: ['homeless', 'homelessness', 'welfare'], dateAdded: new Date(Date.now() + (2 * 60 * 60)) },
  { id: 3, name: 'Cancer Charity', keywords: [], dateAdded: new Date(Date.now() + (3 * 60 * 60)) },
  { id: 4, name: 'Sense Charity', keywords: ['blindness', 'deafness', 'welfare'], dateAdded: new Date(Date.now() + (4 * 60 * 60)) },
  { id: 5, name: 'Legal Advice Charity', keywords: ['pension', 'debt', 'homeless', 'homelessness', 'employment tribunal'], dateAdded: new Date(Date.now() + (5 * 60 * 60)) },
  { id: 6, name: 'Citizens Charity for Welfare', keywords: ['unemployment', 'homeless', 'winter allowance'], dateAdded: new Date(Date.now() + (6 * 60 * 60)) },
  { id: 7, name: 'Heart Disease Charity', keywords: ['cardiovascular'], dateAdded: new Date(Date.now() + (7 * 60 * 60)) },
  { id: 8, name: 'Animal Welfare Charity', keywords: ['animal'], dateAdded: new Date(Date.now() + (8 * 60 * 60)) },
  { id: 9, name: 'Mental Health Charity', keywords: ['depression', 'bipolar'], dateAdded: new Date(Date.now() + (9 * 60 * 60)) },
  { id: 10, name: 'Age Concern Charity', keywords: ['old age', 'pension', 'isolation'], dateAdded: new Date(Date.now() + (10 * 60 * 60)) },
  { id: 11, name: 'Society For Bird-Protection', keywords: ['birds', 'animals', 'charity'], dateAdded: new Date(Date.now() + (11 * 60 * 60)) },
  { id: 12, name: 'A Better World in 100 Years', keywords: [], dateAdded: new Date(Date.now() + (12 * 60 * 60)) },
  { id: 13, name: 'Lots of     Space', keywords: [], dateAdded: new Date(Date.now() + (13 * 60 * 60)) }
]

const createValidName = function () {
  return 'Altruistic Research Computation And Donation Engine'
}

// The generated names are the same as createValidName() above, the difference being
// additional spaces. This creates unique Cause names in the database, but duplicate
// Cause paths, because the spaces will be reduced to single hyphens. We need to test
// that the system handles this correctly, and appends a unique digit to the end of 
// duplicate paths.
const createValidDuplicateName = function (index) {
  switch (index) {
    case 0: return 'Altruistic  Research Computation And Donation Engine'
    case 1: return 'Altruistic Research  Computation And Donation Engine'
    case 2: return 'Altruistic Research Computation  And Donation Engine'
    case 3: return 'Altruistic Research Computation And  Donation Engine'
    case 4: return 'Altruistic Research Computation And Donation  Engine'
    default:
      console.log('Unknown index given to createValidDuplicateName() in test. EXITING.')
      process.exit(0)
  }
  return 
}

const createValidSchema = function () {
  // The object returned needs to have the same shape as the PostCauseSchema
  return {
    cause_name: createValidName(),
    cause_country: 'United Kingdom',
    keywords: 'ARCADE,computation'
  }
}

const createInvalidCauseName = function (typeOfInvalidity) {
  let invalidName = null
  switch (typeOfInvalidity) {
    case 'empty': invalidName = ''; break
    case 'invalid': invalidName = '<@""*'; break
    case 'toolong': invalidName = (new Array(62)).join('a'); break
    case 'duplicate': invalidName = 'Duplicate Charity Name'; break
    default:
      console.log('Invalid cause name type not recognised in test. EXITING.')
      process.exit(0)
  }
  return invalidName
}

const createInvalidCauseKeyword = function (typeOfInvalidity) {
  let invalidKeyword = null
  switch (typeOfInvalidity) {
    case 'empty': invalidKeyword = ''; break
    case 'invalid': invalidKeyword = '<@""*'; break
    case 'toolong': invalidKeyword = (new Array(102)).join('a'); break
    case 'tooshort': invalidKeyword = 'aa'; break
    default:
      console.log('Invalid cause keyword type not recognised in test. EXITING.')
      process.exit(0)
  }
  return invalidKeyword
}

module.exports = {
  charityDefinitions,
  createValidName,
  createValidDuplicateName,
  createValidSchema,
  createInvalidCauseName,
  createInvalidCauseKeyword
}
