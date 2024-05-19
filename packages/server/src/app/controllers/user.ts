import { Request, Response } from 'express';
import { jwtDecode } from 'jwt-decode';
import { SuccessResponseType } from '../../constant';
import { db } from '../../lib/db';
import { TokenDecoded } from '../../types';
import { getToken } from '../../lib/utils';

export const getUser = async (req: Request, res: Response) => {
    const accessToken = getToken(req);

    const tokenDecoded = jwtDecode(accessToken) as TokenDecoded;

    const user = await db.user.findUnique({
        where: {
            id: tokenDecoded.id,
        },
        select: {
            name: true,
            email: true,
            image: true,
            role: true,
        },
    });

    if (!user) {
        res.status(403).json({
            message: 'User not found!',
        });
    }

    const successObj: SuccessResponseType = {
        data: {
            data: user,
        },
        message: 'Get user successfully!',
    };

    return res.status(200).json(successObj);
};

export const getListUser = async (req: Request, res: Response) => {
    try {
        const listUser = await db.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                gender: true,
                address: true,
                phone: true,
                image: true,
                role: true,
                status: true,
            },
        });

        return res.status(201).json({
            isOk: true,
            data: listUser,
            message: 'Get list user successfully!',
        });
    } catch (error) {
        return res.send(500);
    }
};
