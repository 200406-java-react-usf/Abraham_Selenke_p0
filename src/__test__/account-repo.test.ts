import { AccountRepository } from '../repos/account-repo';
import { Account } from '../models/account';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { InternalServerError } from '../errors/errors';

//Mocking Connection Pool
jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

//Mocking result set mapper
jest.mock('../util/result-set-mapper', () => {
    return {
        mapAccountResultSet: jest.fn()
    }
});

describe('accountRepo Testing', () => {
    let sut = new AccountRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {
        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                accountId: '1',
                                balance: '100',
                                time: Date,
                                accountType: '1'
                            }
                        ]
                    }
                }),
                release: jest.fn()
            }
        });
        (mockMapper.mapAccountResultSet as jest.Mock).mockClear(); 
    });

    test('Return the array of Accounts when getAll is called', async () => {
        expect.hasAssertions();

        let mockAccount = new Account(1, 150, new Date, 'checking');
        (mockMapper.mapAccountResultSet as jest.Mock).mockReturnValue(mockAccount);

        let result = await sut.getAll();

        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);
    })


    test('should resolve to an empty array when getAll retrieves no records from data source', async () => {

        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] } }), 
                release: jest.fn()
            }
        });

        let result = await sut.getAll();

        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to a Account object when getById retrieves a record from data source', async () => {

        expect.hasAssertions();

        let mockAccount = new Account(1, 150, new Date, 'checking');
        (mockMapper.mapAccountResultSet as jest.Mock).mockReturnValue(mockAccount);

        let result = await sut.getById(mockAccount.accountId);

        expect(result).toBeTruthy();
        expect(result instanceof Account).toBe(true);

    });

    test('should throw InternalServerError when getAll is envoked but query is unsuccesful', async () => {

		expect.hasAssertions();
		(mockConnect as jest.Mock).mockImplementation( () => {
			return {
				query: jest.fn().mockImplementation( () => { throw new Error(); }),
				release: jest.fn()
			};
		});

		try {
			await sut.getAll();
		} catch (e) {
			expect(e instanceof InternalServerError).toBe(true);
		}
	});

    test('should throw InternalServerError when getById is envoked but query is unsuccesful', async () => {

		expect.hasAssertions();
		let mockAccount = new Account(1, 150, new Date, 'checking');
		(mockConnect as jest.Mock).mockImplementation( () => {
			return {
				query: jest.fn().mockImplementation( () => { return false; }),
				release: jest.fn()
			};
		});

		try {
			await sut.getById(mockAccount.accountId);
		} catch (e) {
			expect(e instanceof InternalServerError).toBe(true);
		}
    });    

    test('should return a newAccount when save works', async () => {

		expect.hasAssertions();
        let mockAccount = new Account(1, 150, new Date, 'checking');
        
		let result = await sut.save(mockAccount);

		expect(result).toBeTruthy();
    });

    test('should throw InternalServerError when save is envoked but query is unsuccesful', async () => {

		expect.hasAssertions();
		let mockAccount = new Account(1, 150, new Date, 'checking');
		(mockConnect as jest.Mock).mockImplementation( () => {
			return {
				query: jest.fn().mockImplementation( () => { return false; }),
				release: jest.fn()
			};
		});

		try {
			await sut.save(mockAccount);
		} catch (e) {
			expect(e instanceof InternalServerError).toBe(true);
		}
	});
    
    test('should return void when deleteById works', async () => {

		expect.hasAssertions();
		let mockAccount = new Account(1, 150, new Date, 'checking');
		(mockConnect as jest.Mock).mockImplementation( () => {
			return {
				query: jest.fn().mockImplementation( () => { return; }),
				release: jest.fn()
			};
		});

		let result = await sut.deleteById(mockAccount.accountId);

		expect(result).toBeTruthy();

    });

    test('should throw InternalServerError when delete is envoked but query is unsuccesful', async () => {

		expect.hasAssertions();
		(mockConnect as jest.Mock).mockImplementation( () => {
			return {
				query: jest.fn().mockImplementation( () => { throw new Error(); }),
				release: jest.fn()
			};
		});

		try {
			await sut.deleteById(1);
		} catch (e) {
			expect(e instanceof InternalServerError).toBe(true);
		}
	});
    
    test('should throw InternalServerError when update is envoked but query is unsuccesful', async () => {

		expect.hasAssertions();
		let mockAccount = new Account(1, 150, new Date, 'checking');
		(mockConnect as jest.Mock).mockImplementation( () => {
			return {
				query: jest.fn().mockImplementation( () => { return false; }),
				release: jest.fn()
			};
		});

		try {
			await sut.update(mockAccount);
		} catch (e) {
			expect(e instanceof InternalServerError).toBe(true);
		}
    });
    
    // test('should return Account when update works', async () => {

	// 	expect.hasAssertions();
	// 	let mockAccount = new Account(1, 150, new Date, 'checking');
	// 	(mockConnect as jest.Mock).mockImplementation( () => {
	// 		return {
	// 			query: jest.fn().mockImplementation( () => { return false; }),
	// 			release: jest.fn()
	// 		};
	// 	});

	// 	let result = await sut.update(mockAccount);

    //     expect(result).toBe(false);
	// });

});