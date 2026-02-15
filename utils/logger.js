import winston from 'winston';
import path from 'path';

// Log folder
const logDir = path.join(process.cwd(), 'logs');

// Create logger
const logger = winston.createLogger({
  level: 'info', // default level
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [
    // Console output
    new winston.transports.Console(),
    // File output
    new winston.transports.File({ filename: path.join(logDir, 'test.log') })
  ],
  exitOnError: false,
});

export default logger;
