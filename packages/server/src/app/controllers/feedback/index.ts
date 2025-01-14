import { PAGE_SIZE } from 'common/constant';
import { Request, Response } from 'express';
import { jwtDecode } from 'jwt-decode';
import { TokenDecoded } from 'types';

import { getToken } from '../../../lib/utils';
import { db } from '../../../lib/db';

type CreateFeedbackData = {
    productId: string;
    description?: string;
    rating?: number | null;
};

type FeedbackFilter = {
    description?: string;
    isShow?: boolean;
    productId?: string;
    userId?: string;
    rating?: number;
    userName?: string;
};

type SortOrder = 'desc' | 'asc';

type FeedbackItem = {
    id: string;
    description?: string;
    userName?: string;
    userId: string;
    productId: string;
    rating: number | null;
    createdAt: Date;
    updatedAt: Date;
};

export const addFeedback = async (req: Request, res: Response) => {
    const { productId, description, rating }: CreateFeedbackData = req.body;
    // const accessToken = req.headers.authorization?.split(' ')[1];

    // if (!accessToken) {
    //     return res.status(401).json({ message: 'No access token provided' });
    // }

    const accessToken = getToken(req);

    if (!accessToken) {
        return res.sendStatus(401);
    }

    const tokenDecoded = jwtDecode(accessToken) as TokenDecoded;
    try {
        // const decodedToken = jwtDecode<TokenDecoded>(accessToken);
        // const userId = decodedToken.id;

        // Thêm feedback mới
        const newFeedback: FeedbackItem = await db.feedback.create({
            data: {
                userId: tokenDecoded.id,
                productId,
                description,
                rating: rating ?? null, // Đặt giá trị mặc định là null nếu không có rating
            },
        });

        return res.status(201).json({
            isOk: true,
            data: newFeedback,
            message: 'Feedback added successfully!',
        });
    } catch (error) {
        return res
            .status(500)
            .json({ error: 'Internal Server Error', details: error });
    }
};

export const getFeedback = async (req: Request, res: Response) => {
    const { productId, rate, currentPage } = req.query;

    const pagination = {
        skip: (Number(currentPage ?? 1) - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
    };

    try {
        const total = await db.feedback.count({
            where: {
                productId: productId ? String(productId) : undefined,
                rating: rate ? Number(rate) : undefined,
            },
        });
        const listFeedback = await db.feedback.findMany({
            ...pagination,
            where: {
                productId: productId ? String(productId) : undefined,
                rating: rate ? Number(rate) : undefined,
            },
            select: {
                id: true,
                rating: true,
                description: true,
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
                image: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
                userId: true,
                createdAt: true,
                productId: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.status(200).json({
            isOk: true,
            data: listFeedback,
            message: 'Get list feedback successfully!',
            pagination: {
                total,
            },
        });
    } catch (error) {
        return res
            .status(500)
            .json({ error: 'Internal Server Error', details: error });
    }
};

export const getListFeedbackManage = async (req: Request, res: Response) => {
    const {
        search,
        pageSize,
        currentPage,
        productId,
        userId,
        rating,
        isShow,
        orderName,
        order,
        description,
        userName,
    } = req.query;

    const pagination = {
        skip: (Number(currentPage ?? 1) - 1) * Number(pageSize ?? PAGE_SIZE),
        take: Number(pageSize ?? PAGE_SIZE),
    };

    try {
        const whereClause: FeedbackFilter = {};

        let orderBy:
            | Record<string, SortOrder | Record<string, SortOrder>>
            | undefined;

        if (orderName && order) {
            if (orderName === 'productId' || orderName === 'user') {
                orderBy = {
                    [String(orderName)]: {
                        name: order as SortOrder,
                    },
                };
            } else {
                orderBy = {
                    [String(orderName)]: order as SortOrder,
                };
            }
        }

        if (productId) {
            whereClause.productId = String(productId);
        }
        if (userId) {
            whereClause.userId = String(userId);
        }
        if (isShow) {
            whereClause.isShow = isShow === 'true';
        }
        if (rating) {
            whereClause.rating = Number(rating);
        }
        if (description) {
            whereClause.description = String(description);
        }

        const select = {
            id: true,
            rating: true,
            description: true,
            isShow: true,
            image: {
                select: {
                    id: true,
                    url: true,
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            userId: true,
            product: {
                select: {
                    id: true,
                    name: true,
                },
            },
            createdAt: true,
            updatedAt: true,
        };

        const total = await db.feedback.count({
            where: {
                description: {
                    contains: String(search || ''),
                },
                user: {
                    name: {
                        contains: userName ? String(userName) : undefined,
                    },
                },
                ...whereClause,
            },
        });

        const listFeedback = await db.feedback.findMany({
            ...pagination,
            where: {
                description: {
                    contains: search ? String(search) : undefined,
                },
                user: {
                    name: {
                        contains: userName ? String(userName) : undefined,
                    },
                },
                ...whereClause,
            },
            orderBy: orderBy ?? {
                createdAt: 'desc',
            },
            select,
        });

        return res.status(200).json({
            isOk: true,
            data: listFeedback,
            message: 'Get list post successfully!',
            pagination: {
                total,
            },
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};

export const updateFeedbackStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isShow } = req.body;

    try {
        const feedback = await db.feedback.update({
            where: {
                id,
            },
            data: {
                isShow,
            },
        });

        return res.status(200).json({
            isOk: true,
            data: feedback,
            message: 'Change feedback status successfully!',
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};

export const getFeedbackById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const feedback = await db.feedback.findUnique({
            where: {
                id,
            },
            include: {
                image: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
                product: {
                    select: {
                        name: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });

        if (!feedback) {
            return res.status(400).json({
                isOk: false,
                data: null,
                message: 'This feedback does not exist!',
            });
        }

        return res.status(200).json({
            isOk: true,
            data: feedback,
            message: 'Get product successfully!',
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};
