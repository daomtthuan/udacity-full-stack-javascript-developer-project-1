import 'reflect-metadata';

import { container, Lifecycle } from 'tsyringe';
import { Logger } from 'winston';

import Configuration from '~core/Configuration';
import Server from '~core/Server';

container.register(Configuration, { useClass: Configuration }, { lifecycle: Lifecycle.Singleton });
container.register(Logger, { useClass: Logger }, { lifecycle: Lifecycle.Singleton });

container.resolve(Server);
