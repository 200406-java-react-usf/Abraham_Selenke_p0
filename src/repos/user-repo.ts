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
            au.nickname,
            au.email,
            ur.name as role_name
        from app_user au
        join user_roles ur
        on au.role_id = ur.id
    `;

    
    async getAll(): Promise<User[]> {
        
        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            console.log('Error');
            
            let rs = await client.query(sql);
            console.log(rs);
            
            return rs.rows;
        } catch (e) {
               throw new InternalServerError();  
        } finally {
               client && client.release();
        }
    }

    async getById(id: number): Promise<User> {
        
        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.id = $1`;
            let rs = await client.query(sql, [id]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
               throw new InternalServerError();  
        } finally {
               client && client.release();
        } 
    }

    async getUserByUniqueKey(key: string, val: string): Promise<User> {

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapUserResultSet(rs.rows[0]);
           } catch (e) {
               throw new InternalServerError();  
           } finally {
               client && client.release();
           } 
    }

    async getUserByCredentials(un: string, pw: string) {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.username = $1 and au.password = $2`;
            let rs = await client.query(sql, [un, pw]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async save(newUser: User): Promise<User> {
            
        let client: PoolClient;

        try {

            client = await connectionPool.connect();
            let sql = `
            insert into app_user (username, password, first_name, last_name, nickname, email)
            values ($1, $2, $3, $4, $5, $6) 
            returning id;
            `;
            let rs = await client.query(sql, [newUser.username, newUser.password, newUser.firstName, newUser.lastName, newUser.nickname, newUser.email]);
            newUser.id = rs.rows[0].id;
            return newUser;

        } catch (e) {
            console.log(e);
            throw new ResourceNotFoundError('Invalid User requirements');
        } finally {
            client && client.release();
        }
    
    }

    async update(updatedUser: User): Promise<boolean> {
        
        let client: PoolClient;
        try {
            client = await connectionPool.connect();

            let userId = (await client.query('select id from app_user where id = $1', [updatedUser.id])).rows[0].id;
            let sql = `
            update app_user
            set username = $2, password = $3, first_name = $4, last_name = $5, nickname = $6, email = $7 
            where id = $1`;
            let rs = await client.query(sql, [updatedUser.id, updatedUser.username, updatedUser.password, updatedUser.firstName, updatedUser.lastName, updatedUser.nickname, updatedUser.email]);
            
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
            delete from app_user
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