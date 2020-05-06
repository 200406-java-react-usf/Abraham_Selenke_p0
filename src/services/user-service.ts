import { User } from "../models/users";
import { UserRepository } from "../repos/user-repo";
import { isEmptyObject, isPropertyOf, isValidId, isValidString, isValidObject} from "../util/validator"
import { ResourceNotFoundError, BadRequestError, AuthenticationError, MethodImplementedError, ResourcePersistenceError, BadGatewayError } from "../errors/errors"

/**
 * All the services of a user
 */
export class UserService {
    /**
     * 
     * @param userRepo Calls the user repository
     */
    constructor(private userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    /**
     * Validates all users and removes password
     */
    async getAllUsers(): Promise<User[]> {
        
            let users = await this.userRepo.getAll();

            if(users.length == 0){
                throw new ResourceNotFoundError();
            }

            return users.map(this.removePassword);
    }

    /**
     * 
     * @param id The id of the user
     */
    async getUserById(id: number): Promise<User> {
        
        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let user = await this.userRepo.getById(id);

        if(isEmptyObject(user)) {
            throw new ResourceNotFoundError();
        }

        return this.removePassword(user);
    }

    /**
     * 
     * @param queryObj Any object within a User
     */
    async getUserByUniqueKey(queryObj: any): Promise<User> {

        try {

            let queryKeys = Object.keys(queryObj);
            //Need to test line 45
            if(!queryKeys.every(key => isPropertyOf(key, User))) {
                throw new BadRequestError();
            }

            //support single param searches...can we do better?
            let key = queryKeys[0];
            let val = queryKeys[key];
            //reuse the logic
            //Need to test line 54
            if (key === 'id') {
                return await this.getUserById(+val);
            }

            //is key valid?
            if(!isValidString(val)){
                throw new BadRequestError();
            }
            //Need to test lines 62-68
            let user = await this.userRepo.getUserByUniqueKey(key, val);

            if (isEmptyObject(user)) {
                throw new ResourceNotFoundError();
            }

            return this.removePassword(user);

        } catch (e) {
            throw e;
        }
    }

    /**
     * 
     * @param un Username of user
     * @param pw Password of user
     */
    async authenticateUser(un: string, pw: string): Promise<User> {

        try {
            //Need to test lines 79-95
            if (!isValidString(un, pw)) {
                throw new BadRequestError();
            }

            let authUser: User;
            
            authUser = await this.userRepo.getUserByCredentials(un, pw);
           

            if (isEmptyObject(authUser)) {
                throw new AuthenticationError('Bad credentials provided.');
            }

            return this.removePassword(authUser);

        } catch (e) {
            throw e;
        }

    }

    /**
     * 
     * @param newUser Creates a new user and Validates all information
     */
    async addNewUser(newUser: User): Promise<User> {
        
        try {

            if (!isValidObject(newUser, 'id')) {
                throw new BadRequestError('Invalid property values found in provided user.');
            }

            let usernameAvailable = await this.isUsernameAvailable(newUser.username);
            //Need to test line 111
            if (!usernameAvailable) {
                throw new ResourcePersistenceError('The provided username is already taken.');
            }
        
            let emailAvailable = await this.isEmailAvailable(newUser.email);
            //Need to test line 117
            if (!emailAvailable) {
                throw new  ResourcePersistenceError('The provided email is already taken.');
            }

            let nicknameAvailable = await this.isNicknameAvailable(newUser.nickname);
            
            //Need to test lines 123
            if (!nicknameAvailable) {
                throw new  ResourcePersistenceError('The provided nickname is already taken.');
            }

            newUser.role = 'user';
            const persistedUser = await this.userRepo.save(newUser);

            return this.removePassword(persistedUser);

        } catch (e) {
            throw e
        }

    }

    /**
     * 
     * @param updatedUser Updates a current user infromation
     */
    async updateUser(updatedUser: User): Promise<boolean> {
        
        try {
            //Need to test line 142
            if (!isValidObject(updatedUser)) {
                throw new BadRequestError('Invalid user provided (invalid values found).');
            }

            let usernameAvailable = await this.isUsernameAvailable(updatedUser.username);
            //Need to test line 148
            if (!usernameAvailable) {
                throw new ResourcePersistenceError('The provided username is already taken.');
            }
        
            let emailAvailable = await this.isEmailAvailable(updatedUser.email);
            //Need to test line 154
            if (!emailAvailable) {
                throw new  ResourcePersistenceError('The provided email is already taken.');
            }

            let nicknameAvailable = await this.isNicknameAvailable(updatedUser.nickname);
            //Need to test line 160
            if (!nicknameAvailable) {
                throw new  ResourcePersistenceError('The provided nickname is already taken.');
            }
            
            return await this.userRepo.update(updatedUser);

        } catch (e) {
            throw e;
        }

    }

    /**
     * 
     * @param id The id of user that will get deleted
     */
    async deleteById(id: number): Promise<boolean> {
        
        try {
            //Need to test lines 175-196
            let keys = Object.keys(id);
            
            if(!keys.every(key => isPropertyOf(key, User))) {
                throw new BadRequestError();
            }
            
            let key = keys[0];
		    let userId = +id[key];
        

            if(!keys.every(key => isPropertyOf(key, User))) {
                throw new BadRequestError();
            }
            
		    if (!isValidId(userId)) {
                throw new BadRequestError();
            }

            return await this.userRepo.deleteById(userId);
            
        } catch (e) {
            throw e;
        }

    }

    /**
     * 
     * @param username To check that the username is not taken
     */
    async isUsernameAvailable(username: string): Promise<boolean> {

        try {
            await this.getUserByUniqueKey({'username': username});
        } catch (e) {
            //console.log('username is available')
            return true;
        }
        //Need to test line 211
        //console.log('username is unavailable')
        return false;

    }

    /**
     * 
     * @param email To check that the email is not taken
     */
    async isEmailAvailable(email: string): Promise<boolean> {
        
        try {
            await this.getUserByUniqueKey({'email': email});
        } catch (e) {
            //console.log('email is available')
            return true;
        }
        //Need to test line 225
        //console.log('email is unavailable')
        return false;
    }

    /**
     * 
     * @param nickname To check that the nickname is not taken
     */
    async isNicknameAvailable(nickname: string): Promise<boolean> {
        
        try {
            await this.getUserByUniqueKey({'nickname': nickname});
        } catch (e) {
            //console.log('nickname is available')
            return true;
        }
        //Need to test line 238
        //console.log('nickname is unavailable')
        return false;
    }

    /**
     * 
     * @param user Removes passwords of user
     */
    private removePassword(user: User): User {
        if(!user || !user.password) return user;
        let usr = {...user};
        delete usr.password;
        return usr;
    }
}
