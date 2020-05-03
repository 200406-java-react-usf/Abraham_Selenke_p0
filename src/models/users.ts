export class User{

    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    nickname: string;
    email: string;  
    role: string;
    
    constructor(id: number, un: string, pw: string, fn: string, ln: string, nn: string, email: string, role: string){
        //To track each member
        this.id = id;
        //Login information
        this.username = un;
        this.password = pw;
        //Personal information
        this.firstName = fn;              
        this.lastName = ln;
        //Display name
        this.nickname = nn;
        this.email = email;
        //To check if they are an admin or user
        this.role = role;
    }

}