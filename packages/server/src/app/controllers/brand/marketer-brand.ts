import { Request, Response } from 'express';
import { db } from '../../../lib/db';
import { PAGE_SIZE } from '../../../constant';

export const getListBrandManage = async (req: Request, res: Response) => {
    const { search, pageSize, currentPage } = req.query;

    try {
        const total = await db.brand.count({
            where: {
                name: {
                    contains: String(search || ''),
                },
            },
        });

        const listBrand = await db.brand.findMany({
            skip: (Number(currentPage) - 1) * Number(pageSize || PAGE_SIZE),
            take: Number(pageSize),
            where: {
                name: {
                    contains: String(search),
                },
            },
        });

        return res.status(200).json({
            isOk: true,
            data: listBrand,
            message: 'Get list brand successfully!',
            pagination: {
                totalPage: (total / Number(pageSize || PAGE_SIZE)).toFixed(),
            },
        });
    } catch (error) {
        return res.send(500);
    }
};

export const createBrand = async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        const brand = await db.brand.create({
            data: {
                name,
            },
        });

        return res.status(201).json({
            isOk: true,
            data: brand,
            message: 'Create new brand successfully!',
        });
    } catch (error) {
        return res.send(500);
    }
};

export const updateBrand = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const brand = await db.brand.update({
            where: {
                id,
            },
            data: {
                name,
            },
        });

        return res.status(200).json({
            isOk: true,
            data: brand,
            message: 'Update brand successfully!',
        });
    } catch (error) {
        return res.send(500);
    }
};

export const deleteBrand = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const brand = await db.brand.delete({
            where: {
                id,
            },
        });

        return res.status(200).json({
            isOk: true,
            data: brand,
            message: 'Delete brand successfully!',
        });
    } catch (error) {
        return res.send(500);
    }
};
