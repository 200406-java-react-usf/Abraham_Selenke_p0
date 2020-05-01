import dotenv from 'dotenv';
import express from 'express';
import { Pool } from 'pg';

import { sessionMiddleware } from './middleware/sessionMiddleware';
import { corsFilter } from './middleware/cors-filter'

import { UserRepository } from './repos/user-repos';

//Environment Configuration
dotenv.config();

//Database Configuration
export const connectionPool: Pool = new Pool({
    host: process.env['DB_HOST'],
    port: +process.env['DB_PORT'],
    database: process.env['DB_NAME'],
    user: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    max: 5
})

//Web Server Configuration
const app = express();


app.listen(8080, () => {
    console.log('Application running and listening at: http://localhost:8080');
})
