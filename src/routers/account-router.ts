import express from 'express';
import AppConfig from '../config/app';

export const AccountRouter = express.Router();

const accountService = AppConfig.accountService;

AccountRouter.get('/', async (req, resp) => {
    
    try{
        let payload = await accountService.getAllAccounts()
        return resp.status(200).json(payload)
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

AccountRouter.get('/:id', async (req, resp) => {
    
    const id = +req.params.id;

    try{
        let payload = await accountService.getAccountById(id)
        return resp.status(200).json(payload)
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

AccountRouter.post('', async (req, resp) => {
    
    try {
        let newAccount = await accountService.addNewAccount(req.body);
        return resp.status(201).json(newAccount);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

AccountRouter.put('', async (req, resp) => {

    try {
        let updatedAccount = await accountService.updateAccount(req.body);
        return resp.status(201).json(updatedAccount);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

AccountRouter.delete('', async (req, resp) => {

    try {
        let deleteAccount = await accountService.deleteById(req.body);
        return resp.status(202).json(deleteAccount);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});