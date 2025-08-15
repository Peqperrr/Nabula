/*
 * @author Maik
 * @version 1.0.0
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerUtils = void 0;
const winston_1 = require("winston");
class LoggerUtils {
    static init() {
        this.logger = (0, winston_1.createLogger)({
            level: 'info',
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
            defaultMeta: { service: 'nabula-bot' },
            transports: [
                new winston_1.transports.Console({
                    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple())
                }),
                new winston_1.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                    maxsize: 5242880, // 5MB
                    maxFiles: 5
                }),
                new winston_1.transports.File({
                    filename: 'logs/combined.log',
                    maxsize: 5242880, // 5MB
                    maxFiles: 5
                })
            ]
        });
        // Handle uncaught exceptions
        this.logger.exceptions.handle(new winston_1.transports.File({ filename: 'logs/exceptions.log' }));
    }
    static log(level, message, meta) {
        if (!this.logger) {
            this.init();
        }
        this.logger.log(level, message, meta);
    }
    static error(message, meta) {
        this.log('error', message, meta);
    }
    static warn(message, meta) {
        this.log('warn', message, meta);
    }
    static info(message, meta) {
        this.log('info', message, meta);
    }
    static debug(message, meta) {
        this.log('debug', message, meta);
    }
}
exports.LoggerUtils = LoggerUtils;
