import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { jwtDecode } from 'jwt-decode';
import { TokenDecoded } from 'types';
import { TOKEN_KEY } from '../constant';
import { getToken } from '../lib/utils';
import { db } from '../lib/db';

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

export const isMarketer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = getToken(req);
    const tokenDecoded = jwtDecode(accessToken) as TokenDecoded;

    if (!accessToken) {
        res.sendStatus(401);
    }

    const user = await db.user.findUnique({
        where: {
            id: tokenDecoded.id,
        },
    });

    if (!user || user.role !== 'SELLER') {
        res.sendStatus(403);
    }

    if (user.role === 'MARKETER') {
        next();
    }
};

export const isSeller = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = getToken(req);
    const tokenDecoded = jwtDecode(accessToken) as TokenDecoded;

    if (!accessToken) {
        res.sendStatus(401);
    }

    const user = await db.user.findUnique({
        where: {
            id: tokenDecoded.id,
        },
    });

    if (!user || user.role !== 'SELLER') {
        res.sendStatus(403);
    }

    if (user.role === 'SELLER') {
        next();
    }
};

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = getToken(req);
    const tokenDecoded = jwtDecode(accessToken) as TokenDecoded;

    if (!accessToken) {
        res.sendStatus(401);
    }

    const user = await db.user.findUnique({
        where: {
            id: tokenDecoded.id,
        },
    });

    if (!user || user.role !== 'ADMIN') {
        res.sendStatus(403);
    }

    if (user.role === 'ADMIN') {
        next();
    }
};