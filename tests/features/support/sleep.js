'use strict'

/**
 * Busy sleep, to wait whilst elasticsearch indexes new documents.
 * @param {int} time 
 */
const sleep = (time) => {
  let stop = new Date().getTime()
  while(new Date().getTime() < stop + time) {
      ;
  }
}

module.exports = {
  sleep
}
