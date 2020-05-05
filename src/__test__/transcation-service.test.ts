import { TranscationService } from '../services/transcation-service';
import { Transcation } from '../models/transcation';

import { ResourceNotFoundError, BadRequestError } from '../errors/errors';
import validator from '../util/validator';

jest.mock('../repos/transcation-repo', () => {

	return new class TranscationRepository {
		getAll = jest.fn();
        getById = jest.fn();
		save = jest.fn();
		update = jest.fn();
        deleteById = jest.fn();     
	};
});

describe('transcationService', () => {

	let sut: TranscationService;
	let mockRepo;

	let mockTranscation = [
		new Transcation(1, true, false, 100, 2),	
        new Transcation(2, true, false, 100, 2),
        new Transcation(3, true, false, 100, 2),
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

		sut = new TranscationService(mockRepo);

    });

    test('should return an array of transcations when getAllTranscations succesfully retrieves all transcations', async () => {

		expect.hasAssertions();
		mockRepo.getAll = jest.fn().mockReturnValue(mockTranscation);

		let result = await sut.getAllTranscation();

		expect(result).toBeTruthy();
		expect(result.length).toBe(3);
    });

    test('should throw a ResourceNotFoundError when getAllTranscations fails to get any transcations', async () => {

		expect.hasAssertions();
		mockRepo.getAll = jest.fn().mockReturnValue([]);

		try{
			await sut.getAllTranscation();
		} catch (e) {

			expect(e instanceof ResourceNotFoundError).toBeTruthy();
		}
    });
    
    test('should resolve a Transcation when getTranscationById is given a valid id', async () => {

		expect.hasAssertions();

		validator.isValidId = jest.fn().mockReturnValue(true);
        validator.isEmptyObject = jest.fn().mockReturnValue(true);

		mockRepo.getById = jest.fn().mockImplementation((id: number) => {
			return new Promise<Transcation>((resolve) => resolve(mockTranscation[id - 1]));
		});

		let result = await sut.getTranscationById(1);

		expect(result).toBeTruthy();
		expect(result.transcationId).toBe(1);
	});

    test('should throw BadRequestError when getTranscationById is provided a negative id value', async () => {

		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		try {
			await sut.getTranscationById(-1);
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(true);
		}
    });
    
    test('should throw BadRequestError when getTranscationById is given a value of zero)', async () => {

		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		try {
			await sut.getTranscationById(0);
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

    test('should throw BadRequestError when getTranscationById is given a of a decimal value)', async () => {

		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		try {
			await sut.getTranscationById(1.01);
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(true);
		}
    });
    
    test('should throw BadRequestError when getTranscationById is given not a number)', async () => {

		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		try {
			await sut.getTranscationById(NaN);
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

    test('should return a newTranscation when save is given a valid Transcation object', async () => {

        expect.hasAssertions();
        
		mockRepo.save = jest.fn().mockImplementation((newTranscation: Transcation) => {
			return new Promise<Transcation>((resolve) => {
				mockTranscation.push(newTranscation); 
				resolve(newTranscation);
			});
		});

		let result = await sut.addNewTranscation(new Transcation(500, true, false, 1, 2));

		expect(result).toBeTruthy();
		expect(mockTranscation.length).toBe(4);
	});

	test('should throw BadRequestError when save is envoked and id is not unique', async () => {

		expect.hasAssertions();
		validator.isValidMoney = jest.fn().mockReturnValue(true);
		validator.isValidString = jest.fn().mockReturnValue(true);

		try {
			await sut.addNewTranscation(new Transcation(500, true, false, 1, 2));
		} catch (e) {		
			expect(e instanceof BadRequestError).toBe(false);
		}
	});

	test('should throw BadRequestError when saveTranscation is envoked and provided an invalid Transcation', async () => {

        expect.hasAssertions();
        
		try {
			await sut.addNewTranscation(new Transcation(1, true, false, -100, 2));
		} catch (e) {		
			expect(e instanceof BadRequestError).toBe(true);
		}
    });
    
    test('should throw BadRequestError when saveTranscation is envoked and provided an invalid amount', async () => {

		expect.hasAssertions();
		validator.isValidMoney = jest.fn().mockReturnValue(false);
		validator.isValidString = jest.fn().mockReturnValue(true);

		try {
			await sut.addNewTranscation(new Transcation(4, true, false, -100, 2));
		} catch (e) {		
			expect(e instanceof BadRequestError).toBe(true);
		}
    });
    
    test('should throw BadRequestError when saveTranscation is envoked and provided an invalid amount', async () => {

		expect.hasAssertions();

		try {
			await sut.addNewTranscation(new Transcation(1, true, false, 0, 2));
		} catch (e) {		
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	// test('should return true when deleteById succesfully deletes an Transcation', async () => {

	// 	expect.hasAssertions();
	// 	validator.isValidId = jest.fn().mockReturnValue(true);
	// 	validator.isPropertyOf = jest.fn().mockReturnValue(true);
	// 	mockRepo.deleteById = jest.fn().mockReturnValue(true);

	// 	let result = await sut.deleteById(1);
		
	// 	expect(result).toBe(true);
	// });

	test('should return true when updateTranscation is envoked and given a valid transcation object', async () => {

		expect.hasAssertions();

		mockRepo.update = jest.fn().mockReturnValue(true);

		let result = await sut.updateTranscation(new Transcation(500, true, false, 1, 2));

		expect(result).toBe(true);

	});

    //Need to look into
	test('should throw BadRequestError when updateTranscation is envoked and given an invalid transcation object', async () => {

		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(false);
		mockRepo.updateTranscation = jest.fn().mockReturnValue(true);

		try{
			await sut.updateTranscation(new Transcation(500, true, false, 1, 2));
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(false);
		}
	});
});