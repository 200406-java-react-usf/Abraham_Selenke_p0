import { User } from "../models/users";
import { UserRepository } from "../repos/user-repos";
//import { isValidId, isValidObject, isValidString } from "../util/validator"
import { ResourceNotFoundError } from "../errors/errors"

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

    private removePassword(user: User): User {
        if(!user || !user.password) return user;
        let usr = {...user};
        delete usr.password;
        return usr;
    }
}
