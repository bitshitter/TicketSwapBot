'use strict';

// const winston = require('winston');
import winston from "winston"

// const d = new Date()
// const minutes = d.getMinutes()
// const day = d.getDay()
// const hours = d.getHours()
// const month = d.getMonth()


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    // new winston.transports.File({ filename: `logs/${month}-${day}-${hours}${minutes}_error.log`, level: 'error', maxsize: 10000000 }),
    new winston.transports.File({ filename: `logs/tickswapbot.log`, maxsize: 10000000 })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger