import { UserRepository } from '../repos/user-repo';
import { User } from '../models/users';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';

//Mocking Connection Pool
jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

//Mocking result set mapper
jest.mock('../until/result-set-mapper', () => {
    return {
        mapUserResultSet: jest.fn()
    }
});

describe('userRepo Testing', () => {
    let sut = new UserRepository();
    let mockConnection = mockIndex.connectionPool.connect;

    beforeEach(() => {
        (mockConnection as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                id: 1,
                                username: 'testUser',
                                password: 'password',
                                firstName: 'Test',
                                lastName: 'Tester',
                                nickname: '8080',
                                email: 'test8@email.com',  
                                role: 'Admin'
                            }
                        ]
                    }
                }),
                release: jest.fn()
            }
        });
        (mockMapper.mapUserResultSet as jest.Mock).mockClear(); 
    });

    test('Return the array of Users when getAll is called', async () => {
        expect.hasAssertions();

        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'nn', 'email', 'role');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        let result = await sut.getAll();

        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnection).toBeCalledTimes(1);
    })
})