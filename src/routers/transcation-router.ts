import express from 'express';
import AppConfig from '../config/app';

export const TranscationRouter = express.Router();

const transcationService = AppConfig.transcationService;

TranscationRouter.get('', async (req, resp) => {
    try{
        let payload = await transcationService.getAllTranscation()
        return resp.status(200).json(payload)
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

TranscationRouter.get('/:id', async (req, resp) => {
    
    const id = +req.params.id;

    try{
        let payload = await transcationService.getTranscationById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

TranscationRouter.post('', async (req, resp) => {

    try {
        let newUser = await transcationService.addNewTranscation(req.body);
        return resp.status(201).json(newUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

TranscationRouter.put('', async (req, resp) => {

    try {
        let updateUser = await transcationService.updateTranscation(req.body);
        return resp.status(201).json(updateUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

TranscationRouter.delete('', async (req, resp) => {

    try {
        let deleteUser = await transcationService.deleteById(req.body);
        return resp.status(202).json(deleteUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});