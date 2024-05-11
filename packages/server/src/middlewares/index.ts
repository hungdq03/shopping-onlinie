import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { TOKEN_KEY } from '../constant';
import { getToken } from '../lib/utils';

export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = getToken(req);

    if (!accessToken) {
        res.sendStatus(401);
    }

    jwt.verify(accessToken, TOKEN_KEY, (err) => {
        if (err) res.sendStatus(403);
        next();
    });
};
