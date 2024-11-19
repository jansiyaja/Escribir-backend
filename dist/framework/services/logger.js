"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
exports.logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        new winston_daily_rotate_file_1.default({
            filename: 'application-%DATE%.log',
            dirname: './logs',
            datePattern: 'DD-MM-YYY-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '60d'
        }),
        new winston_1.transports.Console()
    ]
});
