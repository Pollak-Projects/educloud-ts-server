import { format } from 'date-fns';
import * as colors from 'ansi-colors';

class CustomLogger {
    private service: string;

    constructor(service: string) {
        this.service = service;
    }

    error(message: string, json?: any) {
        this.log('error', colors.red, message, json);
    }

    warn(message: string, json?: any) {
        this.log('warn', colors.yellow, message, json);
    }

    info(message: string, json?: any) {
        this.log('info', colors.blue, message, json);
    }

    http(message: string, json?: any) {
        this.log('http', colors.green, message, json);
    }

    verbose(message: string, json?: any) {
        this.log('verbose', colors.gray, message, json);
    }

    debug(message: string, json?: any) {
        this.log('debug', colors.cyan, message, json);
    }

    silly(message: string, json?: any) {
        this.log('silly', colors.magenta, message, json);
    }

    private log(
        level: string,
        color: (text: string) => string,
        message: string,
        json?: any,
    ) {
        const timestamp = format(new Date(), 'yyyy-MM-dd::HH:mm:ss');
        const logMessage = `${timestamp} [${color(level)}] [${this.service}]: ${message}`;
        console.log(logMessage);
        if (json !== undefined) {
            console.log(JSON.stringify(json, null, 2));
        }
    }
}

const serviceLogger = (serviceName: string) => {
    return new CustomLogger(serviceName);
};

export default serviceLogger;
