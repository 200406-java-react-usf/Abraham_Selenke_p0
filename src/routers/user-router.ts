import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator'
import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const UserRouter = express.Router();

const userService = AppConfig.userService;

UserRouter.get('', adminGuard, async (req, resp) => {
    try{
        
        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject<ParsedUrlQuery> (reqURL.query)) {
            //missing more information in the user repo
            //finishing repo before I start routers
        }
    }
})
