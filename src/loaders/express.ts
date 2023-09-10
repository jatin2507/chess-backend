import express from 'express'
import cors from 'cors'
import serverAdapter from '../Bull/Queue'
function expressloader(app: express.Application) {
	// express loader
	app.use(express.json(
		{ limit: '50mb', type: ['application/json', 'text/plain'] }
	))
	app.use(express.urlencoded({ extended: true }))
	app.use(cors())
	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*')
		res.header('Access-Control-Allow-Methods', '*')
		res.header('Access-Control-Allow-Headers', '*')
		next()
	})
	const fileAttcachment = (req: any, res: any, next: any) => {
		res.header('Access-Control-Allow-Origin', '*')
		res.header('Content-Type', 'application/json;charset=UTF-8')
		res.header('Content-Disposition', 'attachment')
	}
	app.use('/upload', fileAttcachment)

	// app.use('/admin/bull', require('./routes'))
	app.use('/admin/queues', serverAdapter.getRouter())
	app.get('/', (req, res) => {
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.socket.remoteAddress
		const toSave = {
			ipAddress: ip,
			time: new Date()
		}
		res.send(toSave)
	})
}

export default expressloader