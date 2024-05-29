import { Request, Response } from 'express';
import { db } from '../../../lib/db';

export const getListProductSelect = async (req: Request, res: Response) => {
    const { search } = req.query;

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

        return res.status(201).json({
            isOk: true,
            data: listProduct,
            message: 'Get list product successfully!',
            params: search,
        });
    } catch (error) {
        return res.send(500);
    }
};
