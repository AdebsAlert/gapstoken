/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-var-requires */
const cluster = require('cluster');
import * as os from 'os';
import { Injectable, Logger } from '@nestjs/common';

const numCPUs: number = os.cpus().length;
@Injectable()
export class AppClusterService {
  static clusterize(callback: Function): void {
    if (cluster.isMaster) {
      Logger.log('Master cluster setting up ' + numCPUs + ' workers');
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on(
        'exit',
        (
          worker: { process: { pid: string } },
          code: string,
          signal: string,
        ) => {
          Logger.warn(
            'Worker ' +
              worker.process.pid +
              ' died with code: ' +
              code +
              ', and signal: ' +
              signal,
          );
          Logger.log('Starting a new worker');
          cluster.fork();
        },
      );

      cluster.on('online', function (worker: { process: { pid: string } }) {
        Logger.log('Worker ' + worker.process.pid + ' is online');
      });
    } else {
      Logger.log(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}
