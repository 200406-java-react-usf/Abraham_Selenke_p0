import { Transcation } from '../models/transcation';
import {CrudRepository } from './crud-repo';

import { 
    ResourceNotFoundError, 
    ResourcePersistenceError, 
    InternalServerError,
    MethodImplementedError
} from '../errors/errors';

import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapTranscationResultSet } from '../util/result-set-mapper';

//  export class TranscationRepository implements CrudRepository<Transcation> {

//     baseQuery = `
//         select
// 	        t.id,
// 	        t.deposit,
// 	        t.withdrawal,
// 	        t.amount,
// 	        b.balance as balance
//         from transcations t
//         join bank_account b
//         on b.id = t.account_trans_id
//     `;
 

// }