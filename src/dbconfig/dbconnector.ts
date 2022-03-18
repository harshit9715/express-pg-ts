import { Pool } from 'pg';
import * as fs from 'fs'
import * as path from 'path'
import * as AWS from 'aws-sdk'

const DB_USER = process.env.DB_USER
const DB_NAME = process.env.DB_NAME
const DB_PASS = process.env.DB_PASS
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT

const signer = new AWS.RDS.Signer({
    region: process.env.AWS_REGION,
    hostname: DB_HOST,
    port: 3306,
    username: DB_USER
});



const pool = process.env.IAM_AUTH === 'true' ? new Pool({
    max: 20,
    database: DB_NAME,
    host: DB_HOST,
    password: signer.getAuthToken({
        username: DB_USER
    }),
    user: DB_USER,
    port: +DB_PORT,
    idleTimeoutMillis: 30000,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, "cert.pem")),
        rejectUnauthorized: false,
    },
}): new Pool({
    max: 20,
    database: DB_NAME,
    host: DB_HOST,
    password: DB_PASS,
    user: DB_USER,
    port: +DB_PORT,
    idleTimeoutMillis: 30000,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, "cert.pem")),
        rejectUnauthorized: false,
    },
});

export default pool;