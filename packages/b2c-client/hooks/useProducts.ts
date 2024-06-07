import { useEffect, useState } from 'react';
import axios from 'axios';
import { Product } from './Product';

const API_URL = 'http://localhost:3000'; // Ensure this URL matches your backend URL

const useProducts = (
    page: number = 1,
    limit: number = 10,
    search: string = ''
) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/products`, {
                    params: { page, limit, search },
                });
                setProducts(response.data.data);
                setTotal(response.data.meta.total);
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, limit, search]);

    return { products, total, loading, error };
};

export default useProducts;
