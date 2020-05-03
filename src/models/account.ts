export class Account{
    
    accountId: number;
	balance: number;
	time: Date;
	accountType: number;

    constructor(aId: number, bal: number, time: Date, atype: number){
        
        this.accountId = aId;
        this.balance = bal;
        this.time = time;
        this.accountType = atype;
    }
}