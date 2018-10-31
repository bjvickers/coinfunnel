'use strict'

const request = require('supertest')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const { inject, webAppInstance } = require('../steps/before-all')

const postUrl = (world, formSchema) => {
  return new Promise((resolve, reject) => {
    const req = request(webAppInstance).post(world.resource)
    
    if (world.user.role !== inject.UserRoles.guest) {
      req.set('Cookie', [`token=${world.jwt}`])
    }
    
    req.set('Content-Type', 'application/x-www-form-urlencoded')

    if (formSchema) {
      req.send(formSchema)
    }

    req.end((err, res) => {
      if (err) {
        inject.logService.error({}, err)
        return reject(err)
      }

      world.response = res
      const { window } = new JSDOM(world.response.text)
      world.$ = require('jquery')(window)
      return resolve()
    })
  })
}

const getUrl = (world) => {
  return new Promise((resolve, reject) => {
    const req = request(webAppInstance).get(world.resource)

    if (world.user.role !== inject.UserRoles.guest) {
      req.set('Cookie', [`token=${world.jwt}`])
    }

    req.end((err, res) => {
      if (err) {
        inject.logService.error({}, err)
        return reject(err)
      }

      // If necessary, set the new token which stores the updated User object which
      // indicates which notices the User has read.
      if (res['header'] && res['header']['set-cookie'] && res['header']['set-cookie'][0]) {
        let newToken = res['header']['set-cookie'][0]
        newToken = newToken.replace(/^token=/, '')
        newToken = newToken.replace(/;.*$/, '')
        world.jwt = newToken
      }
      
      world.response = res
      const { window } = new JSDOM(world.response.text)
      world.$ = require('jquery')(window)
      return resolve()
    })
  })
}

const deleteUrl = (world, formSchema) => {
  return new Promise((resolve, reject) => {
    const req = request(webAppInstance).delete(world.resource)

    if (world.user.role !== inject.UserRoles.guest) {
      req.set('Cookie', [`token=${world.jwt}`])
    }

    req.set('Content-Type', 'application/x-www-form-urlencoded')

    if (formSchema) {
      req.send(formSchema)
    }

    req.end((err, res) => {
      if (err) {
        inject.logService.error({}, err)
        return reject(err)
      }

      // If necessary, set the new token which stores the updated User object which
      // indicates which notices the User has read.
      if (res['header'] && res['header']['set-cookie'] && res['header']['set-cookie'][0]) {
        let newToken = res['header']['set-cookie'][0]
        newToken = newToken.replace(/^token=/, '')
        newToken = newToken.replace(/;.*$/, '')
        world.jwt = newToken
      }

      world.response = res
      const { window } = new JSDOM(world.response.text)
      world.$ = require('jquery')(window)
      return resolve()
    })
  })
}

module.exports = {
  getUrl,
  postUrl,
  deleteUrl
}
