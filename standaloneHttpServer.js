'use strict';
const http = require('http');
const os = require('os');
const app = require('./app');

//// Get port from environment and store in Express.

const port = parseInt(process.argv[2], 10) || 999;
app.set('port', port);

//// Create HTTP server.

const httpServer = http.createServer(app);

//// Listen on provided port, on all network interfaces.

httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);
//// Used in logging

//// Event listener for HTTP httpServer "error" event.

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${port} port requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${port} port is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

//// Event listener for HTTP httpServer "listening" event.

function onListening() {
  const address = httpServer.address().address;
  console.info(`Listening port ${port} on ${address} (with os.hostname=${os.hostname()})`);
  const entryFqdn = getEntryFqdn(address, port);
  console.info(`Use browser to open: ${entryFqdn}`);
}

function getEntryFqdn(address, port) {
  let beautyAddress;
  if (address === '::') {
    beautyAddress = 'localhost';
  } else {
    beautyAddress = address;
  }
  let beautyPortSuffix;
  if (port === 80) {
    beautyPortSuffix = ''
  } else {
    beautyPortSuffix = `:${port}`
  }
  return(`http://${beautyAddress}${beautyPortSuffix}`);
}