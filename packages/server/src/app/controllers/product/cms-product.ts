/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from 'express';
import { db } from '../../../lib/db';
import { PAGE_SIZE } from '../../../constant';

type ProductFilter = {
    brandId?: string;
    categoryId?: string;
    rating?: number;
};

export const getListProductManage = async (req: Request, res: Response) => {
    const {
        search,
        pageSize,
        currentPage,
        sortBy,
        brandId,
        categoryId,
        rating,
    } = req.query;

    const pagination = {
        skip: (Number(currentPage ?? 1) - 1) * Number(pageSize ?? PAGE_SIZE),
        take: Number(pageSize ?? PAGE_SIZE),
    };

    try {
        const whereClause: ProductFilter = {};

        if (brandId) {
            whereClause.brandId = String(brandId);
        }
        if (categoryId) {
            whereClause.categoryId = String(categoryId);
        }
        if (rating) {
            whereClause.rating = Number(rating);
        }

        const select = {
            id: true,
            name: true,
            brand: {
                select: {
                    name: true,
                },
            },
            category: {
                select: { name: true },
            },
            createdAt: true,
            isShow: true,
            original_price: true,
            quantity: true,
            rating: true,
            size: true,
            sold_quantity: true,
            discount_price: true,
        };

        const total = await db.product.count({
            where: {
                name: {
                    contains: String(search || ''),
                },
                ...whereClause,
            },
        });

        let listProduct;

        switch (sortBy) {
            case 'LATEST':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
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
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
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
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: String(search ?? ''),
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        name: 'asc',
                    },
                    select,
                });
                break;
            case 'NAME_Z_TO_A':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: String(search ?? ''),
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        name: 'desc',
                    },
                    select,
                });
                break;
            case 'RATE_HIGHT_TO_LOW':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: String(search ?? ''),
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        rating: 'desc',
                    },
                    select,
                });
                break;
            case 'RATE_LOW_TO_HIGHT':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: String(search ?? ''),
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        rating: 'asc',
                    },
                    select,
                });
                break;
            case 'PRICE_LOW_TO_HIGHT':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: String(search ?? ''),
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        original_price: 'asc',
                    },
                    select,
                });
                break;
            case 'PRICE_HIGHT_TO_LOW':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: String(search ?? ''),
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        original_price: 'desc',
                    },
                    select,
                });
                break;
            default:
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
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
            data: listProduct,
            message: 'Get list product successfully!',
            pagination: {
                total,
            },
        });
    } catch (error) {
        return res.send(500);
    }
};

export const createProduct = async (req: Request, res: Response) => {
    const {
        name,
        brandId,
        original_price,
        discount_price,
        quantity,
        description,
        size,
        categoryId,
        thumbnail,
        isShow,
        product_image,
    } = req.body;

    try {
        const product = await db.product.create({
            data: {
                name,
                brandId,
                original_price,
                discount_price,
                quantity,
                description,
                size,
                categoryId,
                thumbnail,
                isShow,
                product_image: {
                    createMany: {
                        data: product_image,
                    },
                },
            },
        });

        return res.status(201).json({
            isOk: true,
            data: product,
            message: 'Create new product successfully!',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const category = await db.category.update({
            where: {
                id,
            },
            data: {
                name,
            },
        });

        return res.status(200).json({
            isOk: true,
            data: category,
            message: 'Update category successfully!',
        });
    } catch (error) {
        return res.send(500);
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const category = await db.category.delete({
            where: {
                id,
            },
        });

        return res.status(200).json({
            isOk: true,
            data: category,
            message: 'Delete category successfully!',
        });
    } catch (error) {
        return res.send(500);
    }
};
