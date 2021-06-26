// Libraries
const errors = require('http-errors');
const _ = require('lodash')

// Loggers
const logger = require('./logger');

function handler(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }

    const status = err.status ? err.status : 500;

    res.status(status);

    res.json({
        status: err.status,
        // If err.message is already an array, return it as is, else, return it as array.
        errors: _.isArray(err.message) ? err.message : [{
            message: err.message
        }]
    });
}

module.exports = (app) => {
    app.use(handler);

    app.on('NotFound', (req, res, err) => {
        if (err instanceof errors.HttpError) res.send(err);
        res.send(new errors.NotFoundError('The requested resource could not be found.'));
    });

    app.on('VersionNotAllowed', (req, res) => {
        res.send(new errors.NotFoundError('Unsupported API version requested.'));
    });

    app.on('InvalidVersion', (req, res) => {
        res.send(new errors.NotFoundError('Unsupported API version requested.'));
    });

    app.on('UnsupportedMediaType', (req, res) => {
        res.send(new errors.UnsupportedMediaTypeError('Unsupported Media type requested.'));
    });

    app.on('MethodNotAllowed', (req, res) => {
        res.send(new errors.MethodNotAllowedError('Method not implemented.'));
    });

    app.on('uncaughtException', (req, res, route, err) => {
        logger.error('v *************  EXCEPTION EXCEPTION EXCEPTION  *****************v');
        logger.error('Uncaught exception:', err);
        logger.error(err.stack);
        logger.error('^ ***************************************************************^');
        res.send(
            new errors.InternalServerError('A runtime error has been logged. Request probably failed.'),
        );
    });

    // Handle any process-level errors
    process.on('uncaughtException', (err) => {
        logger.error('[Uncaught Exception]!', err);
        logger.error('A reply has probably not been sent to the client.');
        logger.error(err);
    });
    process.on('unhandledRejection', (error) => {
        logger.error(`[Unhandled Rejection] ${error.message}`);
        logger.error('A reply has probably not been sent to the client.');
    });

    // 404 route error handler
    app.use(function (req, res, next) {
        const err = new errors.NotFound('The requested resource could not be found.');
        handler(err, req, res, next);
    })
};