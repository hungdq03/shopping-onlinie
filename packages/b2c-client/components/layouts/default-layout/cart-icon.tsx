import { ShoppingCartOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';
import * as request from 'common/utils/http-request';
import { Badge } from 'antd';
import { QueryResponseType } from 'common/types';
import { Cart } from 'common/types/cart';
import { useAuth } from '~/hooks/useAuth';
import CartPopover from './cart-popover';

const CartIcon = () => {
    const router = useRouter();
    const auth = useAuth();

    const { data } = useQuery<QueryResponseType<Cart>>({
        queryKey: ['cart-latest'],
        queryFn: () => request.get('cart-latest').then((res) => res.data),
        enabled: !!auth,
    });

    return (
        <div>
            <CartPopover
                data={auth ? data?.data : []}
                total={data?.pagination?.total}
            >
                <Badge count={data?.pagination?.total}>
                    <ShoppingCartOutlined
                        className="cursor-pointer text-3xl text-slate-500"
                        onClick={() => router.push('/my-page/cart-details')}
                    />
                </Badge>
            </CartPopover>
        </div>
    );
};

export default CartIcon;
