import { Product } from './product';

export type Post = {
    id?: string | null | null;
    title?: string | null;
    description?: string | null;
    productId?: string | null;
    thumbnail?: string | null;
    isShow?: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    product?: Product | null;
};
