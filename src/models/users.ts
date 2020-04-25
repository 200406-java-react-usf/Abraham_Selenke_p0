export class User{

    id: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    nickname: string;
    email: string;
    admin: boolean;
    
    constructor(id: number, fn: string, ln: string, un: string, pw: string, nn: string, em: string, admin: boolean){
        //To track each member
        this.id = id;
        //Personal information
        this.firstName = fn;              
        this.lastName = ln;
        this.email = em;
        //Login information
        this.username = un;
        this.password = pw;
        //Display name
        this.nickname = nn;
        //To check if they are an admin
        this.admin = admin;
    }

}