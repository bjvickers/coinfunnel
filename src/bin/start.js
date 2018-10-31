'use strict'

const appRootPath = require('app-root-path')
const config = require('config')
const http = require('http')
const webAppFramework = require(`${appRootPath}/src/waf`)
const invokeDiContainer = require(`${appRootPath}/src/bin/compose-root`)

// Normalize a port into a number, string, or false.
const normalizePort = (val) => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

// Event listener for HTTP server "error" event.
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.log(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.log(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

// Event listener for HTTP server "listening" event.
const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log(`Listening on ${bind}`)
}

// Configure cloud image service integration
const cloudinary = require('cloudinary')
cloudinary.config({
  cloud_name: config.get('images.cloudinary.cloud_name'),
  api_key: config.get('images.cloudinary.api_key'),
  api_secret: config.get('images.cloudinary.api_secret')
})

// Init dependency injection
const diContainer = invokeDiContainer()

// Start the services where necessary
diContainer.cradle.dbService.connect()

// Create an app instance, inject dependencies
const webAppInstance = webAppFramework(diContainer)

// Get port from environment and store in Express.
const port = normalizePort(config.get('app.private_port'))
webAppInstance.set('port', port)

// Wrap the app in a HTTP server and start the server.
const server = http.createServer(webAppInstance)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

// Start the crons
// require(`${appRootPath}/src/app/crons/payout`)(diContainer.cradle)
