#!/usr/bin/env node

/**
 * Module dependencies.
 */
const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routes = require('./routes/index');
const instagram = require('./controllers/instagram');
require('dotenv').config();

const app = express();

function expressServer() {
  /**
   * Create HTTP server.
   */

  const server = http.createServer(app);

  app.use(logger('dev'));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(cors());
  app.enable('trust proxy');
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, './client/build')));
  app.use('/', routes);

  /**
   * Normalize a port into a number, string, or false.
   */

  function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /**
   * Get port from environment and store in Express.
   */

  const port = normalizePort(process.env.PORT || '3001');
  app.set('port', port);

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        // spawn('taskkill.exe', ['/F', '/PID', `${process.pid}`]);
        break;
      default:
        throw error;
    }
  }
  // ===== Handling production mode:
  if (process.env.NODE_ENV === 'development') {
    console.log('YOU ARE IN THE DEVELOPMENT ENV');
    app.get('*', (req, res) => {
      console.log(req.path);
      res.sendFile('index.html', { root: path.resolve('./client/build') });
    });
  }
  // ===== Handling production mode:
  if (process.env.NODE_ENV === 'production') {
    console.log('YOU ARE IN THE PRODUCTION ENV');
    app.get('*', (req, res) => {
      console.log(req.path);
      res.sendFile('index.html', { root: path.resolve('./client/build') });
    });
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    instagram.hasActiveSession();
    const addr = server.address();
    const bind =
      typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`App listening on ${bind}`);
  }
  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

expressServer();
