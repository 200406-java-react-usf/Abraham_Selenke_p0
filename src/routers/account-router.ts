import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator'
import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const AccountRouter = express.Router();

const accountService = AppConfig.accountService;

AccountRouter.get('/:id', async (req, resp) => {
    
    const id = +req.params.id;

    try{
        let payload = await accountService.getAccountById(id)
        return resp.status(200).json(payload)
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
})