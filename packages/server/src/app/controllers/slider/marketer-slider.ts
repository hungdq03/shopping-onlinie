import { Request, Response } from 'express';
import { db } from '../../../lib/db';
import { PAGE_SIZE } from '../../../constant';

type SortOrder = 'asc' | 'desc';

export const getListSliderManage = async (req: Request, res: Response) => {
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
        const total = await db.slider.count({
            where: {
                title: {
                    contains: String(search || ''),
                },
            },
        });

        let listSlider;

        switch (sortBy) {
            case 'title':
                listSlider = await db.slider.findMany({
                    ...prismaQuery,
                    orderBy: {
                        title: (sortOrder as SortOrder) || 'desc',
                    },
                });
                break;
            case 'createAt':
                listSlider = await db.slider.findMany({
                    ...prismaQuery,
                    orderBy: {
                        createdAt: (sortOrder as SortOrder) || 'desc',
                    },
                });
                break;
            case 'updateAt':
                listSlider = await db.slider.findMany({
                    ...prismaQuery,
                    orderBy: {
                        updatedAt: (sortOrder as SortOrder) || 'desc',
                    },
                });
                break;
            default:
                listSlider = await db.slider.findMany({
                    ...prismaQuery,
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
        }

        return res.status(200).json({
            isOk: true,
            data: listSlider,
            message: 'Get list slider successfully!',
            pagination: {
                total,
            },
        });
    } catch (error) {
        return res.send(500);
    }
};

export const createSlider = async (req: Request, res: Response) => {
    const { title, description, productId, image, isShow } = req.body;

    try {
        const slider = await db.slider.create({
            data: {
                title,
                description,
                productId,
                image,
                isShow,
            },
        });

        return res.status(201).json({
            isOk: true,
            data: slider,
            message: 'Create new slider successfully!',
        });
    } catch (error) {
        return res.send(500);
    }
};

export const updateSlider = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, productId, image, isShow } = req.body;

    try {
        const slider = await db.slider.update({
            where: {
                id,
            },
            data: {
                title,
                description,
                image,
                productId,
                isShow,
            },
        });

        return res.status(200).json({
            isOk: true,
            data: slider,
            message: 'Update slider successfully!',
        });
    } catch (error) {
        return res.send(500);
    }
};

export const deleteSlider = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const slider = await db.slider.delete({
            where: {
                id,
            },
        });

        return res.status(200).json({
            isOk: true,
            data: slider,
            message: 'Delete slider successfully!',
        });
    } catch (error) {
        return res.send(500);
    }
};
