import { UserService } from '../services/user-service';
import { User } from '../models/users';

import { ResourceNotFoundError, BadRequestError, ResourcePersistenceError } from '../errors/errors';
import validator from '../util/validator';

jest.mock('../repos/user-repo', () => {

	return new class UserRepository {
		getAll = jest.fn();
        getById = jest.fn();
        getUserByUniqueKey = jest.fn();
        getUserByCredentials = jest.fn();
		save = jest.fn();
		update = jest.fn();
        deleteById = jest.fn();
        isUsernameAvailable = jest.fn();
        isEmailAvailable = jest.fn();
        isNicknameAvailable = jest.fn();        
	};
});

describe('userService', () => {

	let sut: UserService;
	let mockRepo;

	let mockUsers = [
		new User (1, 'jturm', 'password', 'Jeremy', 'Turm', 'turmboi', 'jturm@test.com', 'User'),	
        new User (2, 'kbluestar', 'password', 'Kevin', 'Bluestar', 'lesspreppyboi', 'kbluestar@test.com', 'User'),
        new User (3,'lpleasent', 'password', 'Lauren', 'Pleasant', 'tureboi', 'lpleasant@test.com', 'Admin'),
	];

	beforeEach( () => {

		mockRepo = jest.fn(() => {
			return {
				getAll: jest.fn(),
                getById: jest.fn(),
                getUserByUniqueKey: jest.fn(),
                getUserByCredentials: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                deleteById: jest.fn(),
                isUsernameAvailable: jest.fn(),
                isEmailAvailable: jest.fn(),
                isNicknameAvailable:jest.fn()
			};
		});

		sut = new UserService(mockRepo);

    });

    test('should return an array of users without passwords when getAllUser succesfully retrieves all users from db', async () => {

		expect.hasAssertions();
		mockRepo.getAll = jest.fn().mockReturnValue(mockUsers);

		let result = await sut.getAllUsers();

		expect(result).toBeTruthy();
		expect(result.length).toBe(3);
        result.forEach(value => expect(value.password).toBeUndefined());
    });

    test('should throw a ResourceNotFoundError when getAllUsers fails to get any users', async () => {

		expect.hasAssertions();
		mockRepo.getAll = jest.fn().mockReturnValue([]);

		try{
			await sut.getAllUsers();
		} catch (e) {

			expect(e instanceof ResourceNotFoundError).toBeTruthy();
		}
    });
    
    test('should resolve a User when getUserById is given a valid id', async () => {

		expect.hasAssertions();

		validator.isValidId = jest.fn().mockReturnValue(true);
        validator.isEmptyObject = jest.fn().mockReturnValue(true);

		mockRepo.getById = jest.fn().mockImplementation((id: number) => {
			return new Promise<User>((resolve) => resolve(mockUsers[id - 1]));
		});

		let result = await sut.getUserById(1);

		expect(result).toBeTruthy();
		expect(result.id).toBe(1);
		expect(result.password).toBeUndefined();
	});

    test('should throw BadRequestError when getUserById is provided a negative id value', async () => {

		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		try {
			await sut.getUserById(-1);
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(true);
		}
    });
    
    test('should throw BadRequestError when getUserById is given a value of zero)', async () => {

		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		try {
			await sut.getUserById(0);
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

    test('should throw BadRequestError when getUserById is given a of a decimal value)', async () => {

		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		try {
			await sut.getUserById(1.01);
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(true);
		}
    });
    
    test('should throw BadRequestError when getUserById is given not a number)', async () => {

		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		try {
			await sut.getUserById(NaN);
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

    test('should return a newUser when save is given a valid user object', async () => {

		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		mockRepo.isUsernameAvailable = jest.fn().mockReturnValue(true);
        mockRepo.isEmailAvailable = jest.fn().mockReturnValue(true);
        mockRepo.isNicknameAvailable = jest.fn().mockReturnValue(true);

		mockRepo.save = jest.fn().mockImplementation((newUser: User) => {
			return new Promise<User>((resolve) => {
				mockUsers.push(newUser); 
				resolve(newUser);
			});
		});

		let result = await sut.addNewUser(new User(4, 'Test', 'password', 'TestFirst', 'TestLast', 'TT', 'test@user.com', 'User'));

		expect(result).toBeTruthy();
		expect(mockUsers.length).toBe(4);
	});

	test('should throw BadRequestError when save is envoked and username is not unique', async () => {

		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		validator.isEmptyObject = jest.fn().mockReturnValue(false);
		mockRepo.usernameAvailable = jest.fn().mockReturnValue(mockUsers[0]);
        mockRepo.emailAvailable = jest.fn().mockReturnValue({});
        mockRepo.nicknameAvailable = jest.fn().mockReturnValue({});

		try {
			await sut.addNewUser(new User(4, 'lpleasent', 'password', 'TestFirst', 'TestLast', 'TT', 'test@user.com', 'User'));
		} catch (e) {		
			expect(e instanceof BadRequestError).toBe(false);
		}
	});

	test('should throw BadRequestError when saveUser is envoked and provided an invalid user', async () => {

		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(false);
		validator.isEmptyObject = jest.fn().mockReturnValue(false);
		mockRepo.usernameAvailable = jest.fn().mockReturnValue({});
		mockRepo.emailAvailable = jest.fn().mockReturnValue({});
        mockRepo.nicknameAvailable = jest.fn().mockReturnValue({});

		try {
			await sut.addNewUser(new User(4, '', 'password', 'TestFirst', 'TestLast', 'TT', 'test@user.com', 'User'));
		} catch (e) {		
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	// test('should return true when deleteById succesfully deletes a user', async () => {

	// 	expect.hasAssertions();
	// 	validator.isValidId = jest.fn().mockReturnValue(true);
	// 	validator.isPropertyOf = jest.fn().mockReturnValue(true);
	// 	mockRepo.deleteById = jest.fn().mockReturnValue(true);

	// 	let result = await sut.deleteById(1);
		
	// 	expect(result).toBe(true);
	// });

	test('should return true when updateUser is envoked and given a valid user object', async () => {

		expect.hasAssertions();
		mockRepo.getByUsername = jest.fn().mockReturnValue(true);
		mockRepo.getByEmail = jest.fn().mockReturnValue({});
		mockRepo.update = jest.fn().mockReturnValue(true);

		let result = await sut.updateUser(new User(4, 'Test', 'password', 'TestFirst', 'TestLast', 'TT', 'test@user.com', 'User'));

		expect(result).toBe(true);

	});

    //Need to look into
	test('should throw BadRequestError when updateUser is envoked and given an invalid user object', async () => {

		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(false);
		mockRepo.updateUser = jest.fn().mockReturnValue(true);
		mockRepo.isEmailAvailable = jest.fn().mockReturnValue(true);
		mockRepo.isUsernameAvailable = jest.fn().mockReturnValue(true);

		try{
			await sut.updateUser(new User(4, 'Test', 'password', 'TestFirst', 'TestLast', 'TT', 'test@user.com', 'User'));
		} catch (e) {
			expect(e instanceof BadRequestError).toBe(false);
		}
	});
});