import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Replace with your actual API URL

const fetchProducts = async (page = 1, limit = 10, search = '') => {
    const response = await axios.get(`${API_URL}/products`, {
        params: { page, limit, search },
    });
    return response.data;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { page = 1, limit = 10, search = '' } = req.query;
    try {
        const data = await fetchProducts(
            Number(page),
            Number(limit),
            String(search)
        );
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}
