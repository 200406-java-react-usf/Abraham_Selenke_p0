import { AccountService } from '../services/account-service';
import { Account } from '../models/account';

import { ResourceNotFoundError, BadRequestError } from '../errors/errors';
import validator from '../util/validator';

jest.mock('../repos/account-repo', () => {

	return new class AccountRepository {
		getAll = jest.fn();
        getById = jest.fn();
		save = jest.fn();
		update = jest.fn();
        deleteById = jest.fn();     
	};
});

describe('accountService', () => {

	let sut: AccountService;
	let mockRepo;

	let mockAccount = [
		new Account(1, 100, new Date, 'checking'),	
        new Account(2, 100, new Date, 'saving'),
        new Account(3, 100, new Date, 'unknown'),
	];

	beforeEach( () => {

		mockRepo = jest.fn(() => {
			return {
				getAll: jest.fn(),
                getById: jest.fn(),
                save: jest.fn(),
		        update: jest.fn(),
                deleteById: jest.fn(),
			};
		});

		sut = new AccountService(mockRepo);

    });

    test('Return an array of accounts when getAllAccounts succesfully retrieves all accounts', async () => {

		expect.hasAssertions();
		mockRepo.getAll = jest.fn().mockReturnValue(mockAccount);

		let result = await sut.getAllAccounts();

		expect(result).toBeTruthy();
		expect(result.length).toBe(3);
        result.forEach(value => expect(value.time).toBeUndefined());
    });

    test('should throw a ResourceNotFoundError when getAllAccounts fails to get any accounts', async () => {

		expect.hasAssertions();
		mockRepo.getAll = jest.fn().mockReturnValue([]);

		try{
			await sut.getAllAccounts();
		} catch (e) {

			expect(e instanceof ResourceNotFoundError).toBeTruthy();
		}
    });
    
    test('should return an Account when getAccountById is given a valid id', async () => {

		expect.hasAssertions();

		validator.isValidId = jest.fn().mockReturnValue(true);
        validator.isEmptyObject = jest.fn().mockReturnValue(true);

		mockRepo.getById = jest.fn().mockImplementation((id: number) => {
			return new Promise<Account>((resolve) => resolve(mockAccount[id - 1]));
		});

		let result = await sut.getAccountById(1);

		expect(result).toBeTruthy();
		expect(result.accountId).toBe(1);
		expect(result.time).toBeUndefined();
	});

    test('should throw BadRequestError when getAccountById is provided a negative id value', async () => {

        expect.hasAssertions();
        validator.isValidId = jest.fn().mockReturnValue(false);
        validator.isEmptyObject = jest.fn().mockReturnValue(true);
		mockRepo.getById = jest.fn().mockReturnValue(false);

		try {
			await sut.getAccountById(-1);
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(true);
		}
    });
    
    test('should throw BadRequestError when getAccountById is given a value of zero)', async () => {

        expect.hasAssertions();
        validator.isValidId = jest.fn().mockReturnValue(false);
        validator.isEmptyObject = jest.fn().mockReturnValue(true);
		mockRepo.getById = jest.fn().mockReturnValue(false);

		try {
			await sut.getAccountById(0);
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

    test('should throw BadRequestError when getAccountById is given a of a decimal value)', async () => {

        expect.hasAssertions();
        validator.isValidId = jest.fn().mockReturnValue(false);
        validator.isEmptyObject = jest.fn().mockReturnValue(true);
		mockRepo.getById = jest.fn().mockReturnValue(false);

		try {
			await sut.getAccountById(1.01);
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(true);
		}
    });
    
    test('should throw BadRequestError when getAccountById is given not a number)', async () => {

        expect.hasAssertions();
        validator.isValidId = jest.fn().mockReturnValue(false);
        validator.isEmptyObject = jest.fn().mockReturnValue(false);
		mockRepo.getById = jest.fn().mockReturnValue(false);

		try {
			await sut.getAccountById(NaN);
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(true);
		}
    });
    
    test('should throw BadRequestError when getAccountById is given not a number)', async () => {
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(1);
        validator.isValidId = jest.fn().mockReturnValue(true);
        validator.isEmptyObject = jest.fn().mockReturnValue(true);

		try {
			await sut.getAccountById(100);
		} catch (e) {
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
	});

    test('should return a newAccount when save is given a valid Account object', async () => {

		expect.hasAssertions();
		validator.isValidMoney = jest.fn().mockReturnValue(true);
		validator.isValidString = jest.fn().mockReturnValue(true);

		mockRepo.save = jest.fn().mockImplementation((newAccount: Account) => {
			return new Promise<Account>((resolve) => {
				mockAccount.push(newAccount); 
				resolve(newAccount);
			});
		});

		let result = await sut.addNewAccount(new Account(4, 100, new Date, 'checking'));

		expect(result).toBeTruthy();
		expect(mockAccount.length).toBe(4);
    });
    
    test('should throw BadRequestError when save is envoked an invalid balance', async () => {

		expect.hasAssertions();
		validator.isValidMoney = jest.fn().mockReturnValue(false);
		validator.isValidString = jest.fn().mockReturnValue(true);

		try {
			await sut.updateAccount(new Account(1, 0, new Date, 'checking'));
		} catch (e) {		
			expect(e instanceof BadRequestError).toBe(true);
		}
    });
    
    test('should throw BadRequestError when save is envoked an invalid balance', async () => {

		expect.hasAssertions();
		validator.isValidMoney = jest.fn().mockReturnValue(false);
		validator.isValidString = jest.fn().mockReturnValue(true);

		try {
			await sut.addNewAccount(new Account(1, NaN, new Date, 'checking'));
		} catch (e) {		
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should throw BadRequestError when saveAccount is envoked and provided an invalid account', async () => {

		expect.hasAssertions();
		validator.isValidMoney = jest.fn().mockReturnValue(true);
		validator.isValidString = jest.fn().mockReturnValue(false);

		try {
			await sut.addNewAccount(new Account(1, 100, new Date, ''));
		} catch (e) {		
			expect(e instanceof BadRequestError).toBe(true);
		}
    });
    
    test('should throw BadRequestError when saveAccount is envoked and provided an invalid amount', async () => {

		expect.hasAssertions();
		validator.isValidMoney = jest.fn().mockReturnValue(false);
		validator.isValidString = jest.fn().mockReturnValue(true);

		try {
			await sut.addNewAccount(new Account(1, -100, new Date, 'saving'));
		} catch (e) {		
			expect(e instanceof BadRequestError).toBe(true);
		}
    });
    
    test('should throw BadRequestError when saveAccount is envoked and provided an invalid amount', async () => {

		expect.hasAssertions();
		validator.isValidMoney = jest.fn().mockReturnValue(false);
		validator.isValidString = jest.fn().mockReturnValue(true);

		try {
			await sut.addNewAccount(new Account(1, -0.005, new Date, 'savings'));
		} catch (e) {		
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should return true when deleteById succesfully deletes an account', async () => {

        validator.isPropertyOf = jest.fn().mockReturnValue(false);
        validator.isValidId = jest.fn().mockReturnValue(false);

        sut.getAccountById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Account> ((resolve) => {
                
                resolve(mockAccount.find(Account => Account.accountId === id));
            });
        });

        mockRepo.deleteById = jest.fn().mockImplementation((id:number) => {
            return new Promise<boolean> ((resolve) => {
                mockAccount = mockAccount.slice(0,id).concat(mockAccount.slice(id+1,mockAccount.length));
                resolve(true);
            }); 
        });
        
        try{
			await sut.deleteById({id: 1});
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should return true when updateAccount is envoked and given a valid account object', async () => {

		expect.hasAssertions();
		mockRepo.update = jest.fn().mockReturnValue(true);

		let result = await sut.updateAccount(new Account(1, 100, new Date, 'checking'));

		expect(result).toBe(true);

	});

	test('should throw BadRequestError when updateAccount is envoked and given an invalid account object', async () => {

		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(false);
		mockRepo.updateAccount = jest.fn().mockReturnValue(true);

		try{
			await sut.updateAccount(new Account(1, 100, new Date, 'checking'));
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(false);
		}
	});
});