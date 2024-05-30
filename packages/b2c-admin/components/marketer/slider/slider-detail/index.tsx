import { useQuery } from '@tanstack/react-query';
import React from 'react';
import * as request from 'common/utils/http-request';
import { useRouter } from 'next/router';
import { Spin } from 'antd';
import { AxiosError } from 'axios';
import Header from '~/components/header';
import { Slider } from '~/types/slider';
import SliderDetailAll from './slider-detail-all';

const SliderDetail = () => {
    const { query } = useRouter();

    const { data, isLoading, error } = useQuery<
        Slider,
        AxiosError<{
            isOk?: boolean | null;
            message?: string | null;
        }>
    >({
        queryKey: ['slider-detail', query?.id],
        queryFn: () =>
            request
                .get(`manage/slider/${query?.id}`)
                .then((res) => res.data)
                .then((res) => res.data),
        enabled: !!query?.id,
    });

    if (error) {
        return (
            <div>
                <Header isBack title="Slider Detail" />
                <div className="mt-16 text-center text-2xl font-semibold">
                    {error?.response?.data?.message}
                </div>
            </div>
        );
    }

    return (
        <Spin spinning={isLoading}>
            <div>
                <Header isBack title="Slider Detail" />
                <div>
                    <SliderDetailAll data={data} />
                </div>
            </div>
        </Spin>
    );
};

export default SliderDetail;
