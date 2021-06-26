(async () => {
    try {
      const path = require('path');
      const express = require('express');
      const bodyParser = require('body-parser');
      const corsMiddleware = require('cors');
      const NodeCache = require('node-cache');

      global.nodeCache = new NodeCache();

      // Routes
      const routes = require('./src/routes');

      // Loggers
      const logger = require('./src/util/loggers/logger');
      const errorHandler = require('./src/util/loggers/errors');

      const app = express();
      app.disable('x-powered-by');
      app.use(bodyParser.json());
      app.use(express.static(path.join(__dirname, '/public')));

      const env = await process.env.NODE_ENV;
        
      // Do not allow CORS if not in development
      const allowedOrigins = async () => {
          return env === 'development' ? '*' : /.com$/;
      };

      const cors = corsMiddleware({
          maxAge: 5, // Optional
          origin: await allowedOrigins(),
          allowHeaders: ['Authorization']
      });
      app.use(cors);

      routes(app);

      // Error handling
      errorHandler(app);

      app.listen(process.env.PORT || 8085, () => {
          logger.info(`API server is running on port: ${process.env.PORT || 8000}`);
      });
    } catch (e) {
        console.log(e);
        // Do nothing
    }
})();