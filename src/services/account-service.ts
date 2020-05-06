import { Account } from "../models/account";
import { AccountRepository } from "../repos/account-repo";
import { ResourceNotFoundError, BadRequestError, AuthenticationError, ResourcePersistenceError } from "../errors/errors";
import { isValidMoney, isValidString, isPropertyOf, isValidId, isValidObject, isEmptyObject } from "../util/validator";

/**
 * Services of an account
 */
export class AccountService {

    /**
     * 
     * @param accountRepo Calls the account repository
     */
    constructor(private accountRepo: AccountRepository) {
        this.accountRepo = accountRepo;
    }

    /**
     * Validates all accounts and removes time created
     */
    async getAllAccounts(): Promise<Account[]> {

        let accounts = await this.accountRepo.getAll();

        if(accounts.length == 0) {
            throw new ResourceNotFoundError();
        }

        return accounts.map(this.removeTime);
    }

    /**
     * 
     * @param id The id of the account
     */
    async getAccountById(id: number): Promise<Account> {

        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let account = await this.accountRepo.getById(id);

        if(isEmptyObject(account)) {
            throw new ResourceNotFoundError();
        }

        return this.removeTime(account);
    }

    /**
     * 
     * @param newAccount Creates a new account and Validates all information
     */
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

    /**
     * 
     * @param updateAccount Updates a current account infromations
     */
    async updateAccount(updateAccount: Account): Promise<boolean> {

        try {
            if(!isValidMoney(updateAccount.balance)) {
                throw new BadRequestError()
            }

            if(!isValidString(updateAccount.accountType)) {
                throw new BadRequestError()
            }

            return await this.accountRepo.update(updateAccount);
        } catch (e) {
            throw e;
        }
    }

    /**
     * 
     * @param id The id of account that will get deleted
     */
    async deleteById(id: Object): Promise<boolean> {
        
        try { 
            let keys = Object.keys(id);
            
            if(!keys.every(key => isPropertyOf(key, Account))) {
                throw new BadRequestError();
            }
            
            let key = keys[0];
		    let accountId = +id[key];
            
		    if (!isValidId(accountId)) {
                throw new BadRequestError();
            }

            return await this.accountRepo.deleteById(accountId);
            
        } catch (e) {
            throw e;
        }

    }

    /**
     * 
     * @param account removes time created of account
     */
    private removeTime(account: Account): Account {
        if(!account || !account.time) return account;
        let acc = {...account};
        delete acc.time;
        return acc;
    }
}