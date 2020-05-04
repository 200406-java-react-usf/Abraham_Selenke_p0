import { Transcation } from "../models/transcation";
import { TranscationRepository } from "../repos/transcation-repo";
import { ResourceNotFoundError, BadRequestError, AuthenticationError, ResourcePersistenceError } from "../errors/errors";
import { isValidBoolean, isValidMoney, isValidString, isPropertyOf, isValidId, isValidObject, isEmptyObject } from "../util/validator";

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

        if(isEmptyObject(transcation)) {
            throw new ResourceNotFoundError();
        }

        return this.removeAccountId(transcation);
    }

    async addNewTranscation(newTranscation: Transcation): Promise<Transcation> {
        try{
            if(!isValidBoolean(newTranscation.deposit)) {
                throw new BadRequestError('Invalid property value found in deposit of transcation.')
            }
            
            if(!isValidBoolean(newTranscation.withdrawal)) {
                throw new BadRequestError('Invalid property value found in withdrawal of transcation type.')
            }

            if(!isValidMoney(newTranscation.amount)) {
                throw new BadRequestError('Invalid property value found in amount.')
            }

            if(!isValidId(newTranscation.accountId)) {
                throw new BadRequestError();
            }

            const transcationCreated = await this.transcationRepo.save(newTranscation);

            return this.removeAccountId(transcationCreated);
        } catch (e) {
            throw e
        }
    }

    async updateTranscation(updateTranscation: Transcation): Promise<boolean> {

        try {
            if(!isValidBoolean(updateTranscation.deposit)) {
                throw new BadRequestError('Invalid property value found in deposit of transcation.')
            }
            
            if(!isValidBoolean(updateTranscation.withdrawal)) {
                throw new BadRequestError('Invalid property value found in withdrawal of transcation type.')
            }

            if(!isValidMoney(updateTranscation.amount)) {
                throw new BadRequestError('Invalid property value found in amount.')
            }

            if(!isValidId(updateTranscation.accountId)) {
                throw new BadRequestError();
            }

            return await this.transcationRepo.update(updateTranscation);
        } catch (e) {
            throw e;
        }
    }

    async deleteById(id: number): Promise<boolean> {
        
        try {
            
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