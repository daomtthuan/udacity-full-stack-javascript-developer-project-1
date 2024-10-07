import dotenv from 'dotenv';

import createServer from '~core/server';
import createLogger from '~utils/logger';

dotenv.config();

const logger = createLogger({
  dirname: process.env['LOGS_DIR'] ?? 'logs',
});

const server = createServer({
  host: process.env['HOST'] ?? 'localhost',
  port: Number(process.env['PORT'] ?? 3000),
  logger,
});

server.start();
