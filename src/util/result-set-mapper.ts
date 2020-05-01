import { UserSchema } from './schemas';
import { User } from "../models/users";

export function mapUserResultSet(resultSet: UserSchema): User {
    
    //Returns an empty object so that an error can catch it later
    if (!resultSet) {
        return {} as User;
    }

    return new User(
        resultSet.id,
        resultSet.first_name,
        resultSet.last_name,
        resultSet.username,
        resultSet.password,
        resultSet.nickname,
        resultSet.eamil,
        resultSet.role_name
    );
}