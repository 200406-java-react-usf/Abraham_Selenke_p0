import { UserRepository } from './repos/user-repos';

const userRepo = UserRepository.getInstance();

console.log(userRepo.getAll());
