import { User } from "../models/users";
import { UserRepository } from "../repos/user-repo";
import { isEmptyObject, isPropertyOf, isValidId, isValidString, isValidObject} from "../util/validator"
import { ResourceNotFoundError, BadRequestError, AuthenticationError, MethodImplementedError, ResourcePersistenceError, BadGatewayError } from "../errors/errors"

export class UserService {
    
    constructor(private userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    async getAllUsers(): Promise<User[]> {
        
            let users = await this.userRepo.getAll();

            if(users.length == 0){
                throw new ResourceNotFoundError();
            }

            return users.map(this.removePassword);
    }
       
    async getUserById(id: number): Promise<User> {
        
        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let user = await this.userRepo.getById(id);
        //Need to test line 32
        if(isEmptyObject(user)) {
            throw new ResourceNotFoundError();
        }

        return this.removePassword(user);
    }

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

    private removePassword(user: User): User {
        if(!user || !user.password) return user;
        let usr = {...user};
        delete usr.password;
        return usr;
    }
}
