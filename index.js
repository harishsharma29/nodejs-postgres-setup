import os from 'os';
import cluster from 'cluster';
import { runMigrationsAndSeeders } from './src/database/services/run-migration-seeders.js';

const numberOfCpus = os.cpus().length

if (cluster.isPrimary) {
    await runMigrationsAndSeeders();
    let i = 0;
    while (i < numberOfCpus) {
        const worker = cluster.fork();
        worker.on('exit', (code) => {
            if (code !== 0) {
                cluster.fork();
            }
        })
        worker.on('message', (message) => {
            Object.values(cluster.workers).forEach(element => {
                element.send(message + worker.id)
            });
        })
        i++
    }
} else {
    await import('./src/index.js')
}