import { UserSchema, AccountSchema, TranscationSchema } from './schemas';
import { User } from "../models/users";
import { Account } from '../models/account';
import { Transcation } from '../models/transcation';

/**
 * 
 * @param resultSet Returns the result set from the database for Users
 */
export function mapUserResultSet(resultSet: UserSchema): User {
    
    //Returns an empty object so that an error can catch it later
    if (!resultSet) {
        return {} as User;
    }

    return new User(
        resultSet.id,
        resultSet.username,
        resultSet.password,
        resultSet.first_name,
        resultSet.last_name,
        resultSet.nickname,
        resultSet.email,
        resultSet.role_name
    );
}

/**
 * 
 * @param resultSet Returns the result set from the database for accounts
 */
export function mapAccountResultSet(resultSet: AccountSchema): Account {
    
    if (!resultSet) {
        return {} as Account;
    }

    return new Account(
        resultSet.id,
        resultSet.balance,
        resultSet.created_time,
        resultSet.account_type
    );
}

/**
 * 
 * @param resultSet Returns the result set from the database for transactions
 */
export function mapTranscationResultSet(resultSet: TranscationSchema): Transcation {
    
    if (!resultSet) {
        return {} as Transcation;
    }

    return new Transcation(
        resultSet.id,
        resultSet.deposit,
        resultSet.withdrawal,
        resultSet.amount,
        resultSet.balance
    );
}