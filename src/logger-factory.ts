import winston from 'winston'
import * as path from 'path';


class LoggerFactory {

    private readonly _logger: winston.Logger;

    private static _instance: LoggerFactory;

    private constructor() { 
        this._logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: path.join(__dirname, '../logs.log'), 
                    level: 'info',
                }),
            ],
        });        
    }

    static getInstance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new LoggerFactory();
        return this._instance;
    }

    public get logger() {
        return this._logger;
    }
}

export default LoggerFactory;