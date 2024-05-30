import { useQuery } from '@tanstack/react-query';
import React from 'react';
import * as request from 'common/utils/http-request';
import { useRouter } from 'next/router';
import { Spin } from 'antd';
import Header from '~/components/header';
import { Product } from '~/types/product';
import ProductDetailAll from './product-detail-all';

const ProductDetail = () => {
    const { query } = useRouter();

    const { data, isLoading } = useQuery<Product>({
        queryKey: ['product-detail'],
        queryFn: () =>
            request
                .get(`manage/product/${query?.id}`)
                .then((res) => res.data)
                .then((res) => res.data),
        enabled: !!query?.id,
    });

    return (
        <Spin spinning={isLoading}>
            <div>
                <Header isBack title="Product detail" />
                <div>
                    <ProductDetailAll data={data} />
                </div>
            </div>
        </Spin>
    );
};

export default ProductDetail;
