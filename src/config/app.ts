import { UserRepository } from "../repos/user-repos";
import { UserService } from "../services/user-service";


const userRepo = new UserRepository();
const userService = new UserService(userRepo);

export default {
    userService
}
