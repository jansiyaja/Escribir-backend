import { createLogger, format, transports } from "winston";
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

const logDirectory = path.resolve('./logs');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}
export const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new DailyRotateFile({
            filename: 'application-%DATE%.log',
            dirname: './logs',
            datePattern: 'DD-MM-YYY-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '60d'
        }),
        new transports.Console()
    ]
});
