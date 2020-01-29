'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const winston = require('winston');
const winston_1 = __importDefault(require("winston"));
// const d = new Date()
// const minutes = d.getMinutes()
// const day = d.getDay()
// const hours = d.getHours()
// const month = d.getMonth()
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log` 
        // - Write all logs error (and below) to `error.log`.
        //
        // new winston.transports.File({ filename: `logs/${month}-${day}-${hours}${minutes}_error.log`, level: 'error', maxsize: 10000000 }),
        new winston_1.default.transports.File({ filename: `logs/tickswapbot.log`, maxsize: 10000000 })
    ]
});
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple()
    }));
}
exports.default = logger;
//# sourceMappingURL=logger.js.map