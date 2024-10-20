import 'reflect-metadata';

import { container } from 'tsyringe';

import Server from '~core/modules/Server';

container.resolve(Server);
