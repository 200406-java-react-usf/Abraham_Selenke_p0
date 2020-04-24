export class Admin{

    id: number;
    username: string;
    password: string;
    nickname: string;
    
    constructor(id: number, un: string, pw: string, nn: string){
        this.id = id;
        this.username = un;
        this.password = pw;
        this.nickname = nn;
    }

}