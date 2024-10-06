import dotenv from 'dotenv';

import Server from '~/core/AServer';

dotenv.config();

const server = new Server({
  host: process.env['HOST'] ?? 'localhost',
  port: Number(process.env['PORT'] ?? 3000),
});

server.start();
