import { User } from '../models/users';
import {CrudRepository } from './crud-repo';

import { 
    ResourceNotFoundError, 
    ResourcePersistenceError, 
    InternalServerError,
    MethodImplementedError
} from '../errors/errors';

import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapUserResultSet } from '../util/result-set-mapper';


export class UserRepository implements CrudRepository<User> {
    
    baseQuery = `
        select
            au.id,
            au.username,
            au.password,
            au.first_name,
            au.last_name,
            au.email,
            ur.name as role_name
        from app_users au
        join user_roles ur
        on au.role_id = ur.id
    `;

    
    async getAll(): Promise<User[]> {
        
        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let resultSet = await client.query(sql);
            return resultSet.rows.map(mapUserResultSet);
           } catch (e) {
               throw new InternalServerError();  
           } finally {
               client && client.release();
           }
        }
}

