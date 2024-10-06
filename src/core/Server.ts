import type { Express } from 'express';
import type { Server as HTTPServer } from 'http';

import express from 'express';

import { IServer, IServerConfiguration } from '~/core/types';

/** Application server. */
export default class Server implements IServer {
  #instance?: HTTPServer;

  private _host: string;
  private _port: number;
  private _app: Express;

  public constructor({ host, port }: IServerConfiguration) {
    this._host = host;
    this._port = port;

    this._app = express();
    this._configure();
  }

  public start() {
    if (this.#instance?.listening) {
      console.warn(`Server is already running on http://${this.host}:${this.port}`);
    }

    this.#instance = this.app.listen(this.port, () => {
      console.log(`Server running on http://${this.host}:${this.port}`);
    });
  }

  public stop(): void {
    if (!this.#instance?.listening) {
      return;
    }

    this.#instance.close();
  }

  public restart(): void {
    this.stop();
    this.start();
  }

  private _configure() {
    this.app.use(express.json());
  }

  public get host() {
    return this._host;
  }

  public get port() {
    return this._port;
  }

  public get app() {
    return this._app;
  }
}
