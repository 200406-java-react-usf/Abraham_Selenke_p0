export class Transcation{
    
    transcationId: number;
    deposit: boolean;
	withdrawal: boolean;
	amount: number;
	accountId : number;

    constructor(tId: number, dep: boolean, witd: boolean, am: number, aId: number){
        
        this.transcationId = tId;
        this.deposit = dep;
        this.withdrawal = witd;
        this.amount = am;
        this.accountId = aId;
    }
}