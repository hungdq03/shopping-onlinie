import { Request, Response } from 'express';
import { db } from '../../../lib/db';

export const getListProductSelect = async (req: Request, res: Response) => {
    try {
        const listProduct = await db.product.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return res.status(200).json({
            isOk: true,
            data: listProduct,
            message: 'Get list product successfully!',
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};

export const getListProductFeatured = async (req: Request, res: Response) => {
    try {
        const listProduct = await db.product.findMany({
            select: {
                id: true,
                name: true,
                thumbnail: true,
                description: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return res.status(200).json({
            isOk: true,
            data: listProduct,
            message: 'Get list product featured successfully!',
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};
