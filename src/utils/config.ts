import dotenv from 'dotenv'
dotenv.config()

export const config = {
    "port": process.env.port || 3000,
    "certKey": process.env.certKey || '',
    "cert": process.env.cert || '',
    "mongoUrl": process.env.mongoUrl || '',
    "mongoDbName": process.env.mongoDbName || '',
    "host": process.env.host || '',
    "env": process.env.env || '',
    redis:{
        host: String(process.env.redisHost || ''),
        port: Number(process.env.redisPort || 6379),
        password: String(process.env.redisPassword || ''),
        db: Number(process.env.redisDB || 0),
    },
    "privateKey": process.env.privateKey || '',
    "mongodbUrl": process.env.mongodbUrl || '',
}