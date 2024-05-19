import { Request, Response } from 'express';
import { db } from '../../../lib/db';
import { PAGE_SIZE } from '../../../constant';

type SortOrder = 'asc' | 'desc';

export const getListPostManage = async (req: Request, res: Response) => {
    const { search, pageSize, currentPage, sortBy, sortOrder } = req.query;

    const prismaQuery = {
        skip: (Number(currentPage) - 1) * Number(pageSize || PAGE_SIZE),
        take: Number(pageSize),
        where: {
            title: {
                contains: String(search),
            },
        },
    };

    try {
        const total = await db.post.count({
            where: {
                title: {
                    contains: String(search || ''),
                },
            },
        });

        let listPost;

        switch (sortBy) {
            case 'title':
                listPost = await db.post.findMany({
                    ...prismaQuery,
                    orderBy: {
                        title: (sortOrder as SortOrder) || 'desc',
                    },
                });
                break;
            case 'createAt':
                listPost = await db.post.findMany({
                    ...prismaQuery,
                    orderBy: {
                        createdAt: (sortOrder as SortOrder) || 'desc',
                    },
                });
                break;
            case 'updateAt':
                listPost = await db.post.findMany({
                    ...prismaQuery,
                    orderBy: {
                        updatedAt: (sortOrder as SortOrder) || 'desc',
                    },
                });
                break;
            default:
                listPost = await db.post.findMany({
                    ...prismaQuery,
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
        }

        return res.status(200).json({
            isOk: true,
            data: listPost,
            message: 'Get list post successfully!',
            pagination: {
                total,
            },
        });
    } catch (error) {
        return res.send(500);
    }
};

export const createPost = async (req: Request, res: Response) => {
    const { title, description, productId, thumbnail, isShow } = req.body;

    try {
        const post = await db.post.create({
            data: {
                title,
                description,
                productId,
                thumbnail,
                isShow,
            },
        });

        return res.status(201).json({
            isOk: true,
            data: post,
            message: 'Create new post successfully!',
        });
    } catch (error) {
        return res.send(500);
    }
};

export const updatePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, productId, thumbnail, isShow } = req.body;

    try {
        const post = await db.post.update({
            where: {
                id,
            },
            data: {
                title,
                description,
                productId,
                thumbnail,
                isShow,
            },
        });

        return res.status(200).json({
            isOk: true,
            data: post,
            message: 'Update post successfully!',
        });
    } catch (error) {
        return res.send(500);
    }
};

export const deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const post = await db.post.delete({
            where: {
                id,
            },
        });

        return res.status(200).json({
            isOk: true,
            data: post,
            message: 'Delete post successfully!',
        });
    } catch (error) {
        return res.send(500);
    }
};
