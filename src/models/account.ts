export class Account{
    
    accountId: number;
	balance: number;
	time: Date;
	accountType: string;

    constructor(aId: number, bal: number, time: Date, atype: string){
        
        this.accountId = aId;
        this.balance = bal;
        this.time = time;
        this.accountType = atype;
    }
}