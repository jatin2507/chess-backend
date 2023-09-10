import expressloader from './loaders/express';
import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { config } from './utils/config';
import logger from './loaders/logger';
import socket from './loaders/socket';
import { handler } from './utils/ErrorHandler';
import { redisClient, setKey } from './loaders/redis';
import mongodb from './loaders/mongodb';
let app = express();
let server = http.createServer(app);
if (fs.existsSync(config.certKey) && fs.existsSync(config.cert)) {
	const privateKey = fs.readFileSync(config.cert, 'utf8');
	const certificate = fs.readFileSync(config.certKey, 'utf8');
	const credentials = {
		key: privateKey,
		cert: certificate,
	};
	server = https.createServer(credentials, app);
}
logger.info(`---------------------------------	`);
Promise.all([expressloader(app), redisClient(), mongodb()])
	.then((app) => {
		server.listen(config.port, () => {
			logger.info(`Server running on port ${config.port}`);
			logger.info(`---------------------------------	`);
		});
		handler(socket)(server);
	})
	.catch((err) => {
		logger.error('Error On Server Page');
		logger.error(err);
	});
