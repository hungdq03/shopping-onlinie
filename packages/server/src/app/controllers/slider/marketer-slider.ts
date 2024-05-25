import { Request, Response } from 'express';
import { db } from '../../../lib/db';
import { PAGE_SIZE } from '../../../constant';

type SliderFilter = {
    productId?: string;
    title?: string;
    isShow?: boolean;
};

export const getListSliderManage = async (req: Request, res: Response) => {
    const { search, pageSize, currentPage, productId, sortBy, title, isShow } =
        req.query;

    const pagination = {
        skip: (Number(currentPage ?? 1) - 1) * Number(pageSize ?? PAGE_SIZE),
        take: Number(pageSize ?? PAGE_SIZE),
    };

    try {
        const whereClause: SliderFilter = {};
        if (productId) {
            whereClause.productId = String(productId);
        }
        if (title) {
            whereClause.title = String(title);
        }
        if (isShow) {
            whereClause.isShow = isShow === 'true';
        }
        const select = {
            id: true,
            title: true,
            product: {
                select: {
                    name: true,
                },
            },
            createdAt: true,
            updatedAt: true,
            isShow: true,
        };
        const total = await db.slider.count({
            where: {
                title: {
                    contains: String(search || ''),
                },
                ...whereClause,
            },
        });

        let listSlider;

        switch (sortBy) {
            case 'LATEST':
                listSlider = await db.slider.findMany({
                    ...pagination,
                    where: {
                        title: {
                            contains: String(search ?? ''),
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    select,
                });
                break;
            case 'OLDEST':
                listSlider = await db.slider.findMany({
                    ...pagination,
                    where: {
                        title: {
                            contains: String(search ?? ''),
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                    select,
                });
                break;
            case 'NAME_A_TO_Z':
                listSlider = await db.slider.findMany({
                    ...pagination,
                    where: {
                        title: {
                            contains: String(search ?? ''),
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        title: 'asc',
                    },
                    select,
                });
                break;
            case 'NAME_Z_TO_A':
                listSlider = await db.slider.findMany({
                    ...pagination,
                    where: {
                        title: {
                            contains: String(search ?? ''),
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        title: 'desc',
                    },
                    select,
                });
                break;
            case 'ACTIVE':
                listSlider = await db.slider.findMany({
                    ...pagination,
                    where: {
                        title: {
                            contains: String(search ?? ''),
                        },
                        ...whereClause,
                        isShow: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    select,
                });
                break;
            case 'INACTIVE':
                listSlider = await db.slider.findMany({
                    ...pagination,
                    where: {
                        title: {
                            contains: String(search ?? ''),
                        },
                        ...whereClause,
                        isShow: false,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    select,
                });
                break;

            default:
                listSlider = await prisma.slider.findMany({
                    ...pagination,
                    where: {
                        title: {
                            contains: String(search ?? ''),
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    select,
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
