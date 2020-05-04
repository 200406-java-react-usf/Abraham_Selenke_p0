import { Account } from '../models/account';
import {CrudRepository } from './crud-repo';

import { 
    ResourceNotFoundError, 
    ResourcePersistenceError, 
    InternalServerError,
    MethodImplementedError
} from '../errors/errors';

import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapAccountResultSet } from '../util/result-set-mapper';

export class AccountRepository implements CrudRepository<Account> {

    baseQuery = `
    select
        b.id,
        b.balance,
        b.created_time,
        a.name as account_type
    from bank_account b
    join account_type a
    on a.id = b.acc_type
    `;

    async getAll(): Promise<Account[]> {
        
        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;      
            let rs = await client.query(sql);
            return rs.rows.map(mapAccountResultSet);
        } catch (e) {
               throw new InternalServerError(); 
        } finally {
               client && client.release();
        }
    }

    async getById(id: number): Promise<Account> {
        
        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where b.id = $1`;         
            let rs = await client.query(sql, [id]);            
            return mapAccountResultSet(rs.rows[0]);
        } catch (e) {
               throw new InternalServerError();  
        } finally {
               client && client.release();
        } 
    }
}