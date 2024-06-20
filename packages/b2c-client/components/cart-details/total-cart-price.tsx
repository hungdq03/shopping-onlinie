// total-cart-price.tsx

import { useQuery } from '@tanstack/react-query';
import * as request from 'common/utils/http-request';
import { QueryResponseGetOneType } from 'common/types';
import { currencyFormatter } from 'common/utils/formatter';
import React, { useEffect, useState } from 'react';
import { Product } from 'common/types/cart';

type TotalCartPriceProps = {
    productId: string;
    quantity: number;
};

const TotalCartPrice: React.FC<TotalCartPriceProps> = ({
    productId,
    quantity,
}) => {
    const { data } = useQuery<QueryResponseGetOneType<Product>>({
        queryKey: ['product-info-cart', productId],
        queryFn: () =>
            request
                .get(`productPublicInfo/${productId}`)
                .then((res) => res.data),
        enabled: !!productId,
    });

    const [totalCartPrice, setTotalCartPrice] = useState(0);

    useEffect(() => {
        if (data?.data) {
            const price =
                (data.data.discount_price ?? data.data.original_price ?? 0) *
                quantity;
            setTotalCartPrice(price);
        }
    }, [data, productId, quantity]);

    return <div>{currencyFormatter(totalCartPrice)}</div>;
};

export default TotalCartPrice;
