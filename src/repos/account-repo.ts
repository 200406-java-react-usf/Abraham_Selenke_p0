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
import { UserRepository } from './user-repo';
import { UserService } from '../services/user-service';
import { User } from '../models/users';

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

    async save(newAccount: Account): Promise<Account> {

        let client: PoolClient;

        try {            
            client = await connectionPool.connect();

            const userId = newAccount.accountId;

            let accountType = (await client.query('select id from account_type where name = $1',
                                [newAccount.accountType])).rows[0].id;

            let sql = `
            insert into bank_account (balance, acc_type)
            values ($1, $2)
            returning id;
            `;

            let rs = await client.query(sql, [newAccount.balance, accountType]);
            newAccount.accountId = rs.rows[0].id;
            let connectAccount = (await client.query('insert into user_accounts (user_id, bank_id) values ($1, $2);',
                [userId, newAccount.accountId]));
            return newAccount;

        } catch (e) {
            console.log(e);
            throw new InternalServerError('Invalid Account requirements');
        } finally {
            client && client.release();
        }
    }

    async update(updatedAccount: Account): Promise<boolean> {
        
        let client: PoolClient;
        try {
            client = await connectionPool.connect();

            let accountType = (await client.query('select id from account_type where name = $1',
                                [updatedAccount.accountType])).rows[0].id;
            
            let sql = `
            update bank_account
            set balance = $2, acc_type = $3 
            where id = $1`;
            let rs = await client.query(sql, [updatedAccount.accountId, updatedAccount.balance, accountType]);            
            return true;
        } catch (e) {
            
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async deleteById(id: number): Promise<boolean> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `
            delete from bank_account
            where id = $1`;
            let rs = await client.query(sql, [id]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }
}