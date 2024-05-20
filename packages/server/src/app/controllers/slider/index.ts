import { Request, Response } from 'express';
import { db } from '../../../lib/db';

export const getListSlider = async (req: Request, res: Response) => {
    const { search } = req.query;

    try {
        const listSlider = await db.slider.findMany({
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
            data: listSlider,
            message: 'Get list slider successfully!',
            params: search,
        });
    } catch (error) {
        return res.send(500);
    }
};

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
        return res.send(500);
    }
};
