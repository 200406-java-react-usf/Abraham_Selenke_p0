import data from '../data/user-dp';
import { User } from '../models/users';
import {CrudRepository } from './crud-repo';
import Validator from '../util/validator';
import { ResourceNotFoundError } from '../errors/errors';


export class UserRepository implements CrudRepository<User> {
    
    private static instance: UserRepository;
    private constructor() {}

    static getInstance(){
        return !UserRepository.instance ? UserRepository.instance = new UserRepository() : UserRepository.instance;
    }

    getAll(): Promise<User[]> {
        return new Promise<User[]> ((resolve, reject) => {
            setTimeout(() => {
                
                let users = [];

                for (let user of data) {
                    users.push({...user});
                }

                if (users.length == 0) {
                    return reject(new ResourceNotFoundError());
                }

                resolve(users);

            }, 250);
        })
    }
}

