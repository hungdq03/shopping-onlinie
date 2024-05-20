import { Request, Response } from 'express';
import { jwtDecode } from 'jwt-decode';
import { hashSync } from 'bcrypt';
import {
    ERROR_RES,
    PAGE_SIZE,
    SALT,
    SuccessResponseType,
} from '../../constant';
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
    const {
        search,
        searchBy,
        pageSize,
        currentPage,
        sortBy,
        fillterBy,
        fillter,
    } = req.query;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (searchBy && search) {
        where[String(searchBy)] = { contains: String(search) };
    }

    if (fillterBy && fillter) {
        where[String(fillterBy)] = String(fillter);
    }

    const prismaQuery = {
        skip: (Number(currentPage) - 1) * Number(pageSize || PAGE_SIZE),
        take: Number(pageSize),
        where,
    };

    try {
        const total = await db.user.count({
            where: {
                name: {
                    contains: String(search || ''),
                },
            },
        });

        let listUser;

        switch (sortBy) {
            case 'LATEST':
                listUser = await db.user.findMany({
                    ...prismaQuery,
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
                break;
            case 'OLDEST':
                listUser = await db.user.findMany({
                    ...prismaQuery,
                    orderBy: {
                        createdAt: 'asc',
                    },
                });
                break;
            case 'NAME_A_TO_Z':
                listUser = await db.user.findMany({
                    ...prismaQuery,
                    orderBy: {
                        name: 'asc',
                    },
                });
                break;
            case 'NAME_Z_TO_A':
                listUser = await db.user.findMany({
                    ...prismaQuery,
                    orderBy: {
                        name: 'desc',
                    },
                });
                break;
            case 'EMAIL_A_TO_Z':
                listUser = await db.user.findMany({
                    ...prismaQuery,
                    orderBy: {
                        email: 'asc',
                    },
                });
                break;
            case 'EMAIL_Z_TO_A':
                listUser = await db.user.findMany({
                    ...prismaQuery,
                    orderBy: {
                        email: 'desc',
                    },
                });
                break;
            case 'GENDER_A_TO_Z':
                listUser = await db.user.findMany({
                    ...prismaQuery,
                    orderBy: {
                        gender: 'asc',
                    },
                });
                break;
            case 'GENDER_Z_TO_A':
                listUser = await db.user.findMany({
                    ...prismaQuery,
                    orderBy: {
                        gender: 'desc',
                    },
                });
                break;
            case 'PHONE_LOW_TO_HIGH':
                listUser = await db.user.findMany({
                    ...prismaQuery,
                    orderBy: {
                        phone: 'asc',
                    },
                });
                break;
            case 'PHONE_HIGH_TO_LOW':
                listUser = await db.user.findMany({
                    ...prismaQuery,
                    orderBy: {
                        phone: 'desc',
                    },
                });
                break;
            case 'ROLE_A_TO_Z':
                listUser = await db.user.findMany({
                    ...prismaQuery,
                    orderBy: {
                        role: 'asc',
                    },
                });
                break;
            case 'ROLE_Z_TO_A':
                listUser = await db.user.findMany({
                    ...prismaQuery,
                    orderBy: {
                        role: 'desc',
                    },
                });
                break;
            case 'STATUS_A_TO_Z':
                listUser = await db.user.findMany({
                    ...prismaQuery,
                    orderBy: {
                        status: 'asc',
                    },
                });
                break;
            case 'STATUS_Z_TO_A':
                listUser = await db.user.findMany({
                    ...prismaQuery,
                    orderBy: {
                        status: 'desc',
                    },
                });
                break;
            default:
                listUser = await db.user.findMany({
                    ...prismaQuery,
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
        }

        return res.status(200).json({
            isOk: true,
            data: listUser,
            message: 'Get list user successfully!',
            pagination: {
                total,
            },
        });
    } catch (error) {
        return res.send(500);
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { password, name, email, role, gender, address, dob, phone, image } =
        req.body;

    let user = await db.user.findFirst({
        where: { email },
    });

    if (user) {
        return res.status(400).json({
            ...ERROR_RES,
            errors: { message: 'Account already exist!' },
        });
    }

    user = await db.user.create({
        data: {
            name,
            email,
            hashedPassword: hashSync(password, SALT),
            phone,
            role,
            gender,
            address,
            image,
            dob,
            status: 'NEWLY_REGISTER',
        },
    });

    const successObj: SuccessResponseType = {
        data: {
            data: user,
            meta_data: undefined,
        },
        message: 'Create new user successfully!',
    };

    return res.status(200).json(successObj);
};
