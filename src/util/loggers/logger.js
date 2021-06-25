const { createLogger, format, transports } = require('winston');

const { printf, colorize: colorizer } = format;

const defaultFormat = info => colorizer().colorize(info.level, `[${info.level.toUpperCase()}] ${new Date().toISOString()} - ${info.message}`);

const logger = createLogger({
    transports: [
        new transports.Console({
            level: "debug"
        })
    ],
    exitOnError: false, // do not exit on handled exceptions
    format: printf(info => defaultFormat(info))
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write(message) {
        // use the 'info' log level so the output
        // will be picked up by both transports (file and console)
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    },
};

module.exports = logger;