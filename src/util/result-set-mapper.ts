import { UserSchema } from './schemas';
import { User } from "../models/users";

export function mapUserResultSet(resultSet: UserSchema): User {
    
    //Returns an empty object so that an error can catch it later
    if (!resultSet) {
        return {} as User;
    }

    return new User(
        resultSet.id,
        resultSet.username,
        resultSet.password,
        resultSet.first_name,
        resultSet.last_name,
        resultSet.nickname,
        resultSet.email,
        resultSet.role_name
    );
}