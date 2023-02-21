"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppClusterService = void 0;
const cluster = require('cluster');
const os = __importStar(require("os"));
const common_1 = require("@nestjs/common");
const numCPUs = os.cpus().length;
let AppClusterService = class AppClusterService {
    static clusterize(callback) {
        if (cluster.isMaster) {
            common_1.Logger.log('Master cluster setting up ' + numCPUs + ' workers');
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }
            cluster.on('exit', (worker, code, signal) => {
                common_1.Logger.warn('Worker ' +
                    worker.process.pid +
                    ' died with code: ' +
                    code +
                    ', and signal: ' +
                    signal);
                common_1.Logger.log('Starting a new worker');
                cluster.fork();
            });
            cluster.on('online', function (worker) {
                common_1.Logger.log('Worker ' + worker.process.pid + ' is online');
            });
        }
        else {
            common_1.Logger.log(`Cluster server started on ${process.pid}`);
            callback();
        }
    }
};
AppClusterService = __decorate([
    (0, common_1.Injectable)()
], AppClusterService);
exports.AppClusterService = AppClusterService;
//# sourceMappingURL=cluster.service.js.map