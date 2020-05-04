export interface UserSchema {
    id: number,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    nickname: string,
    email: string,
    role_name: string
}

export interface AccountSchema {
    id: number,
    balance: number,
    created_time: Date,
    account_type: string
}

export interface TranscationSchema {
    id: number,
    deposit: boolean,
	withdrawal: boolean,
    amount: number,
    balance: number
}
