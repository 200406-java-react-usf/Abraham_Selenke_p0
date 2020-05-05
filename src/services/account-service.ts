import { Account } from "../models/account";
import { AccountRepository } from "../repos/account-repo";
import { ResourceNotFoundError, BadRequestError, AuthenticationError, ResourcePersistenceError } from "../errors/errors";
import { isValidMoney, isValidString, isPropertyOf, isValidId, isValidObject, isEmptyObject } from "../util/validator";

export class AccountService {

    constructor(private accountRepo: AccountRepository) {
        this.accountRepo = accountRepo;
    }

    async getAllAccounts(): Promise<Account[]> {

        let accounts = await this.accountRepo.getAll();

        if(accounts.length == 0) {
            throw new ResourceNotFoundError();
        }

        return accounts.map(this.removeTime);
    }

    async getAccountById(id: number): Promise<Account> {

        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let account = await this.accountRepo.getById(id);

        //Need to test line 33
        if(isEmptyObject(account)) {
            throw new ResourceNotFoundError();
        }

        return this.removeTime(account);
    }

    async addNewAccount(newAccount: Account): Promise<Account> {
        try{
            if(!isValidMoney(newAccount.balance)) {
                throw new BadRequestError('Invalid property value found in balance.')
            }
            
            if(!isValidString(newAccount.accountType)) {
                throw new BadRequestError('Invalid property value in account type.')
            }

            const accountCreated = await this.accountRepo.save(newAccount);

            return this.removeTime(accountCreated);
        } catch (e) {
            throw e
        }
    }

    async updateAccount(updateAccount: Account): Promise<boolean> {

        try {
            //Need to test line 61
            if(!isValidMoney(updateAccount.balance)) {
                throw new BadRequestError('Invalid property value found in balance.')
            }
            //Need to test line 65
            if(!isValidString(updateAccount.accountType)) {
                throw new BadRequestError('Invalid property value in account type.')
            }

            return await this.accountRepo.update(updateAccount);
        } catch (e) {
            throw e;
        }
    }

    async deleteById(id: number): Promise<boolean> {
        
        //Need to test lines 77-98
        try { 
            let keys = Object.keys(id);
            
            if(!keys.every(key => isPropertyOf(key, Account))) {
                throw new BadRequestError("id is the error");
            }
            
            let key = keys[0];
		    let accountId = +id[key];
        

            if(!keys.every(key => isPropertyOf(key, Account))) {
                throw new BadRequestError();
            }
            
		    if (!isValidId(accountId)) {
                throw new BadRequestError();
            }

            return await this.accountRepo.deleteById(accountId);
            
        } catch (e) {
            throw e;
        }

    }

    private removeTime(account: Account): Account {
        if(!account || !account.time) return account;
        let acc = {...account};
        delete acc.time;
        return acc;
    }
}