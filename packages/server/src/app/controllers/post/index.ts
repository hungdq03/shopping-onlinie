import { Request, Response } from 'express';
import { db } from '../../../lib/db';

export const getListPost = async (req: Request, res: Response) => {
    const { search } = req.query;

    try {
        const listPost = await db.post.findMany({
            where: {
                title: {
                    contains: String(search ?? ''),
                },
            },
            select: {
                id: true,
                title: true,
            },
            orderBy: {
                title: 'asc',
            },
        });

        return res.status(201).json({
            isOk: true,
            data: listPost,
            message: 'Get list post successfully!',
            params: search,
        });
    } catch (error) {
        return res.send(500);
    }
};

export const getPostById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const post = await db.post.findUnique({
            where: {
                id,
            },
        });

        return res.status(201).json({
            isOk: true,
            data: post,
            message: 'Get post successfully!',
        });
    } catch (error) {
        return res.send(500);
    }
};
