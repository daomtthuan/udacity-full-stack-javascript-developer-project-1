import type { Express } from 'express';
import type { Server as HTTPServer } from 'http';

import express from 'express';

import type { Server, ServerOptions } from '~core/server.type';

/**
 * Create the application.
 *
 * @param app The Application.
 *
 * @returns Application.
 */
function createApp(): Express {
  const instance: Express = express();
  instance.use(express.json());

  return instance;
}

/**
 * Creates the server.
 *
 * @param options The server options.
 *
 * @returns The server.
 */
export default function createServer({ host, port, logger }: ServerOptions): Server {
  let server: HTTPServer | undefined;

  const app = createApp();

  const instance: Server = {
    start() {
      if (server?.listening) {
        logger.warn(`Server is already running on http://${host}:${port}`);
      }

      server = app.listen(port, () => {
        logger.info(`Server running on http://${host}:${port}`);
      });
    },

    stop() {
      if (!server?.listening) {
        logger.warn('Server is not running');
        return;
      }

      server.close();
    },

    restart() {
      instance.stop();
      instance.start();
    },
  };

  return instance;
}
