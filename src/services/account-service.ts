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

        return accounts.map(this.removeId);
    }

    async getAccountById(id: number): Promise<Account> {

        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let account = await this.accountRepo.getById(id);

        if(isEmptyObject(account)) {
            throw new ResourceNotFoundError();
        }

        return this.removeId(account);
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

            return this.removeId(accountCreated);
        } catch (e) {
            throw e
        }
    }

    private removeId(account: Account): Account {
        if(!account || !account.time) return account;
        let acc = {...account};
        delete acc.time;
        return acc;
    }
}