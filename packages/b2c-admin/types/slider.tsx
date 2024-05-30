import { Brand, Category } from './product';

export type Product = {
    id?: string | null;
    name?: string | null;
    brandId?: string | null;
    categoryId?: string | null;
    original_price?: number | null;
    discount_price?: number | null;
    quantity?: number | null;
    sold_quantity?: number | null;
    description?: string | null;
    size?: number | null;
    category?: Category | null;
    thumbnail?: string | null;
    rating?: number | null;
    isShow?: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    brand?: Brand | null;
};
export type SliderImage = {
    id?: string | null;
    url?: string | null;
};

export type Slider = {
    id?: string | null;
    title?: string | null;
    image?: string | null;
    description?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    isShow?: boolean | null;
    slider_image?: SliderImage[] | null;
    product?: Product | null;
    productId?: string | null;
};
export type ResponseSliderById = {
    isOk?: boolean | null;
    data?: Slider | null;
    message?: string | null;
};
