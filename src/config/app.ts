import { UserRepository } from "../repos/user-repo";
import { UserService } from "../services/user-service";
import { AccountRepository } from "../repos/account-repo";
import { AccountService } from "../services/account-service";
import { TranscationRepository } from "../repos/transcation-repo";
import { TranscationService } from "../services/transcation-service";

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

const accountRepo = new AccountRepository();
const accountService = new AccountService(accountRepo)

const transcationRepo = new TranscationRepository;
const transcationService = new TranscationService(transcationRepo)

export default {
    userService,
    accountService,
    transcationService
}
