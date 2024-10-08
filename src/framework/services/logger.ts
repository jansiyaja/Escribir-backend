import { createLogger, format, transports } from "winston";
import DailyRotateFile from 'winston-daily-rotate-file';

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
