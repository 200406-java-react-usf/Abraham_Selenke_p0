import { User } from '../models/users'

//Counter id for number of users
let id = 1;

export default [
    new User(id++, 'Andy', 'Robert', 'arobert', 'password',	'Father', 'arobert@test.com', true),	
    new User(id++, 'John', 'Robert', 'jrobert', 'password', 'Son', 'jrobert@test.com', false),
    new User(id++, 'Lauren', 'Robert', 'lrobert2', 'password', 'Daughter', 'lrobert2@test.com', false),
    new User(id++, 'Lisa', 'Robert', 'lrobert', 'password', 'Mother', 'lrobert@test.com', true),
    new User(id++, 'Katie',	'Robert', 'krobert', 'password', 'Daughter', 'krobert@test.com', false),
    new User(id++, 'Beau', 'Robert', 'brobert',	'password', 'Son', 'brobert@test.com', false)
]
