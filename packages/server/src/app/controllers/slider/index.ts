import { Request, Response } from 'express';
import { db } from '../../../lib/db';

export const getSliderById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const slider = await db.slider.findUnique({
            where: {
                id,
            },
        });
        return res.status(201).json({
            isOk: true,
            data: slider,
            message: 'Get slider successfully!',
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};

export const getListSliderSelect = async (req: Request, res: Response) => {
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
            message: 'Get list Slider successfully!',
            params: search,
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};
