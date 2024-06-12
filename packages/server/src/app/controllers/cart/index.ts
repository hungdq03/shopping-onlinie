import { Request, Response } from 'express';
import { db } from '../../../lib/db';

export const getListCart = async (req: Request, res: Response) => {
    try {
        const listCart = await db.cart.findMany({
            select: {
                id: true,
                quantity: true,
                product: true,
            },
            orderBy: {
                productId: 'asc',
            },
        });

        return res.status(201).json({
            isOk: true,
            data: listCart,
            message: 'Get list cart successfully!',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
};
