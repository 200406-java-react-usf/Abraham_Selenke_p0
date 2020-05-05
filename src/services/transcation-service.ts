import { Transcation } from "../models/transcation";
import { TranscationRepository } from "../repos/transcation-repo";
import { ResourceNotFoundError, BadRequestError } from "../errors/errors";
import { isValidMoney, isPropertyOf, isValidId, isEmptyObject } from "../util/validator";

export class TranscationService {

    constructor(private transcationRepo: TranscationRepository) {
        this.transcationRepo = transcationRepo;
    }

    async getAllTranscation(): Promise<Transcation[]> {

        let transcations = await this.transcationRepo.getAll();

        if(transcations.length == 0) {
            throw new ResourceNotFoundError();
        }

        return transcations.map(this.removeAccountId);
    }

    async getTranscationById(id: number): Promise<Transcation> {

        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let transcation = await this.transcationRepo.getById(id);
        //Need to test line 32
        if(isEmptyObject(transcation)) {
            throw new ResourceNotFoundError();
        }

        return this.removeAccountId(transcation);
    }

    async addNewTranscation(newTranscation: Transcation): Promise<Transcation> {
        try{


            if(!isValidMoney(newTranscation.amount)) {
                throw new BadRequestError('Invalid property value found in amount.')
            }

            const transcationCreated = await this.transcationRepo.save(newTranscation);

            return this.removeAccountId(transcationCreated);
        } catch (e) {
            throw e
        }
    }

    async updateTranscation(updateTranscation: Transcation): Promise<boolean> {
        //Need to test line 58
        try {
            if(!isValidMoney(updateTranscation.amount)) {
                throw new BadRequestError('Invalid property value found in amount.')
            }
            //Need to test line 62
            if(!isValidId(updateTranscation.transcationId)) {
                throw new BadRequestError();
            }

            return await this.transcationRepo.update(updateTranscation);
        } catch (e) {
            throw e;
        }
    }

    async deleteById(id: number): Promise<boolean> {
        
        try {
            //Need to test lines 75-98
            let keys = Object.keys(id);
            
            if(!keys.every(key => isPropertyOf(key, Transcation))) {
                throw new BadRequestError();
            }
            
            let key = keys[0];
		    let transcationId = +id[key];
        

            if(!keys.every(key => isPropertyOf(key, Transcation))) {
                throw new BadRequestError();
            }
            
		    if (!isValidId(transcationId)) {
                throw new BadRequestError();
            }

            return await this.transcationRepo.deleteById(transcationId);
            
        } catch (e) {
            throw e;
        }

    }

    private removeAccountId(transcation: Transcation): Transcation {
        if(!transcation || !transcation.accountId) return transcation;
        let trans = {...transcation};
        delete trans.accountId;
        return trans;
    }
}