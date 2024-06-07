export interface Product {
    id: string;
    name: string;
    thumbnail?: string;
    description?: string;
    original_price: number;
    page: number;
    limit: number;
    search: string;
    discount_price?: number;
    updatedAt?: Date;
}
