import { Transcation } from '../models/transcation';
import {CrudRepository } from './crud-repo';

import {  InternalServerError } from '../errors/errors';

import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapTranscationResultSet } from '../util/result-set-mapper';

 export class TranscationRepository implements CrudRepository<Transcation> {

    baseQuery = `
        select
	        t.id,
	        t.deposit,
	        t.withdrawal,
            t.amount,
	        b.balance as balance
        from transcations t
        join bank_account b
        on b.id = t.account_trans_id
    `;
    
    async getAll(): Promise<Transcation[]> {
        
        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql);
            return rs.rows.map(mapTranscationResultSet);
        } catch (e) {
               throw new InternalServerError();  
        } finally {
               client && client.release();
        }
    }

    async getById(id: number): Promise<Transcation> {
        
        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where t.id = $1`;
            let rs = await client.query(sql, [id]);
            return mapTranscationResultSet(rs.rows[0]);
        } catch (e) {
               throw new InternalServerError();  
        } finally {
               client && client.release();
        } 
    }

    async save(newTranscation: Transcation): Promise<Transcation> {
            
        let client: PoolClient;

        try {

            client = await connectionPool.connect();
            let sql = `
            insert into transcations (deposit, withdrawal, amount, account_trans_id)
            values ($2, $3, $4, $1) 
            returning id`;
            let rs = await client.query(sql, [newTranscation.accountId, newTranscation.deposit, newTranscation.withdrawal, newTranscation.amount]);
            newTranscation.transcationId = rs.rows[0].id;
            return newTranscation;

        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async update(updatedTranscation: Transcation): Promise<boolean> {
        
        let client: PoolClient;
        try {
            client = await connectionPool.connect();

            let sql = `
            update transcations
            set deposit = $2, withdrawal = $3, amount = $4
            where id = $1`;
            let rs = await client.query(sql, [updatedTranscation.transcationId, updatedTranscation.deposit, updatedTranscation.withdrawal, updatedTranscation.amount]);
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
            delete from transcations
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