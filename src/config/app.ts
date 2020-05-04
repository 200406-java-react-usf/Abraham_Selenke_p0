import { UserRepository } from "../repos/user-repo";
import { UserService } from "../services/user-service";
import { AccountRepository } from "../repos/account-repo";
import { AccountService } from "../services/account-service";

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

const accountRepo = new AccountRepository();
const accountService = new AccountService(accountRepo)



export default {
    userService,
    accountService
}
