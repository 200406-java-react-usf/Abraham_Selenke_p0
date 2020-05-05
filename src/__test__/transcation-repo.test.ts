import { TranscationRepository } from '../repos/transcation-repo';
import { Transcation } from '../models/transcation';
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
        mapTranscationResultSet: jest.fn()
    }
});

describe('transcationRepo Testing', () => {
    let sut = new TranscationRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {
        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                transcationId: 1,
                                deposit: true,
                                withdrawal: false,
                                amount: 10000,
                                accountId : 1
                            }
                        ]
                    }
                }),
                release: jest.fn()
            }
        });
        (mockMapper.mapTranscationResultSet as jest.Mock).mockClear(); 
    });

    test('Return the array of Transcation when getAll is called', async () => {
        expect.hasAssertions();

        let mockTranscation = new Transcation(1, true, false, 10000, 1);
        (mockMapper.mapTranscationResultSet as jest.Mock).mockReturnValue(mockTranscation);

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

    test('should resolve to a Transcation object when getById retrieves a record from data source', async () => {

        expect.hasAssertions();

        let mockTranscation = new Transcation(1, true, false, 10000, 1);
        (mockMapper.mapTranscationResultSet as jest.Mock).mockReturnValue(mockTranscation);

        let result = await sut.getById(mockTranscation.transcationId);

        expect(result).toBeTruthy();
        expect(result instanceof Transcation).toBe(true);

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
		let mockTranscation = new Transcation(1, true, false, 10000, 1);
		(mockConnect as jest.Mock).mockImplementation( () => {
			return {
				query: jest.fn().mockImplementation( () => { return false; }),
				release: jest.fn()
			};
		});

		try {
			await sut.getById(mockTranscation.accountId);
		} catch (e) {
			expect(e instanceof InternalServerError).toBe(true);
		}
    });    

    test('should return a newAccount when save works', async () => {

		expect.hasAssertions();
        let mockTranscation = new Transcation(1, true, false, 10000, 1);
        
		let result = await sut.save(mockTranscation);

		expect(result).toBeTruthy();
    });

    test('should throw InternalServerError when save is envoked but query is unsuccesful', async () => {

		expect.hasAssertions();
		let mockTranscation = new Transcation(1, true, false, 10000, 1);
		(mockConnect as jest.Mock).mockImplementation( () => {
			return {
				query: jest.fn().mockImplementation( () => { return false; }),
				release: jest.fn()
			};
		});

		try {
			await sut.save(mockTranscation);
		} catch (e) {
			expect(e instanceof InternalServerError).toBe(true);
		}
	});
    
    test('should return void when deleteById works', async () => {

		expect.hasAssertions();
		let mockTranscation = new Transcation(1, true, false, 10000, 1);
		(mockConnect as jest.Mock).mockImplementation( () => {
			return {
				query: jest.fn().mockImplementation( () => { return; }),
				release: jest.fn()
			};
		});

		let result = await sut.deleteById(mockTranscation.accountId);

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

		let mockTranscation = new Transcation(1, true, false, 10000, 1);
		(mockConnect as jest.Mock).mockImplementation( () => {
			return {
				query: jest.fn().mockImplementation( () => { return false; }),
				release: jest.fn()
			};
		});

		try {
			await sut.update(mockTranscation);
		} catch (e) {
			expect(e instanceof InternalServerError).toBe(true);
		}
    });
    
    test('should return Transcation when update works', async () => {

		let mockTranscation = new Transcation(1, true, false, 10000, 1);
		(mockConnect as jest.Mock).mockImplementation( () => {
			return {
				query: jest.fn().mockImplementation( () => { return; }),
				release: jest.fn()
			};
		});

		let result = await sut.update(mockTranscation);

        expect(result).toBeTruthy();
	});

});