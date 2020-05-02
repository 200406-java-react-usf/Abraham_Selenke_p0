import { User } from "../models/users";
import { UserRepository } from "../repos/user-repos";
import { 
    isValidId, 
    isValidObject, 
    isValidString,
    isEmptyObject 
} from "../util/validator"
import { ResourceNotFoundError, BadRequestError } from "../errors/errors"

export class UserService {
    constructor(private userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    async getAllUsers(): Promise<User[]> {
        try{
            let users = await this.userRepo.getAll();

            if(users.length == 0){
                throw new ResourceNotFoundError();
            }
            return users.map(this.removePassword);
        }catch(e) {
            throw e;
        }
    }

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

    async getUserByUniqueKey(queryObj: any): Promise<User> {

        try {

            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.every(key => isPropertyOf(key, User))) {
                throw new BadRequestError();
            }

            //support single param searches...can we do better?
            let key = queryKeys[0];
            let val = queryKeys[key];

            //reuse the logic
            if (key === 'id') {
                return await this.getUserById(+val);
            }

            //is key valid?
            if(!isValidString(val)){
                throw new BadRequestError();
            }

            let user = await this.userRepo.getUserByUniqueKey(key, val);

            if (isEmptyObject(user)) {
                throw new ResourceNotFoundError();
            }

            return this.removePassword(user);
        } catch (e) {
            throw e;
        }
    }


    
    private removePassword(user: User): User {
        if(!user || !user.password) return user;
        let usr = {...user};
        delete usr.password;
        return usr;
    }
}
