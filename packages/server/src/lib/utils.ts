import { Request } from 'express';

export const getToken = (req: Request) => {
    const authorizationHeader = req.headers.authorization;
    const token: string = authorizationHeader.split(' ')[1];
    return token;
};
