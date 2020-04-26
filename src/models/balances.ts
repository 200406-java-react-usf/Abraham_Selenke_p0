export class Balance{

    start: number;
    save: number;
    spent: number;
    total: number;
    request: number;
    userId: number;

    constructor(init: number, sv: number, sp: number, tot: number, request: number, uid: number){
        //Starting amount
        this.start = init;
        //How much money comes in and out
        this.save = sv;
        this.spent = sp;
        //Total amount remaining
        this.total = tot;
        //Money requested
        this.request = request;
        //Connects the user to a balance
        this.userId = uid;
    }
}