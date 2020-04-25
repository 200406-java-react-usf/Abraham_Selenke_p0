export class Balance{

    start: number;
    save: number;
    spent: number;
    total: number;
    request: number;
    userId: number;

    constructor(init: number, sv: number, sp: number, tot: number, request: number, uid: number){
        this.start = init;
        this.save = sv;
        this.spent = sp;
        this.total = tot;
        this.request = request;
        this.userId = uid;
    }
}