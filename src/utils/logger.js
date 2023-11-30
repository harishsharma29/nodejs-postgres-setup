import winston from 'winston';
import schedule from 'node-schedule';

const { DEBUG_NAMESPACE } = process.env;

class Logger {
    constructor() {
        this.isProduction = process.env.NODE_ENV === 'production';
        this.consoleOptions = {
            label: DEBUG_NAMESPACE,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf((info) => {
                    const message = info.message instanceof Error ? info.message.stack : info.message;
                    const meta = info.meta ? ` Meta: ${JSON.stringify(info.meta, null, 2)}` : '';
                    return `[${info.timestamp}][${info.level}] ${message} ${meta}`;
                })
            )
        };
        this.createLogger();
        schedule.scheduleJob('59 23 * * *', this.resetLogger.bind(this));
    }

    getDateForFileName() {
        return new Date().toISOString().slice(0, 10).replaceAll('-', '_');
    }

    resetLogger() {
        this.createLogger();
    }

    createLogger() {
        this.transports = [
            new winston.transports.File({ filename: `log/error/${this.getDateForFileName()}_error.log`, level: 0 }),
            new winston.transports.File({ filename: `log/warn/${this.getDateForFileName()}_warn.log`, level: 1 }),
            new winston.transports.File({ filename: `log/debug/${this.getDateForFileName()}_debug.log`, level: 5 })
        ];
        this.exceptionHandlers = [new winston.transports.Console(this.consoleOptions)];
        this.logFormat = winston.format.printf(
            ({ timestamp, level, message }) => `> [${timestamp}] [${level}] [${message}] ${JSON.stringify(message) ? JSON.stringify(message) : ''}`
        );
        this.logger = winston.createLogger({
            format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), this.logFormat),
            exitOnError: false,
            transports: this.transports,
            level: process.env.LOG_LEVEL,
            exceptionHandlers: this.exceptionHandlers
        });

        // Temporary workaround for exceptions
        this.logger.info = (_msg) => console.log(`> ${process.env.APP_NAME || 'winston'} | `, _msg);
        this.logger.warn = (_msg, _meta) => this.logger.log('warn', _msg, { meta: _meta });
        this.logger.debug = (_msg, _meta) => this.logger.log('debug', _msg, { meta: _meta });
        this.logger.error = (_err, _meta) => (this.isProduction ? this.logger.log('error', _err, { meta: _meta }) : this.logger.info(_err));
    }
}

export default new Logger().logger;
