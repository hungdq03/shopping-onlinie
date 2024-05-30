import { useQuery } from '@tanstack/react-query';
import React from 'react';
import * as request from 'common/utils/http-request';
import { useRouter } from 'next/router';
import { Spin } from 'antd';
import { AxiosError } from 'axios';
import Header from '~/components/header';
import { Post } from '~/types/post';
import PostDetailAll from './post-detail-all';

const PostDetail = () => {
    const { query } = useRouter();

    const { data, isLoading, error } = useQuery<
        Post,
        AxiosError<{
            isOk?: boolean | null;
            message?: string | null;
        }>
    >({
        queryKey: ['post-detail'],
        queryFn: () =>
            request
                .get(`post/${query?.id}`)
                .then((res) => res.data)
                .then((res) => res.data),
        enabled: !!query?.id,
    });

    if (error) {
        return (
            <div>
                <Header isBack title="Post detail" />
                <div className="mt-16 text-center text-2xl font-semibold">
                    {error?.response?.data?.message}
                </div>
            </div>
        );
    }
    return (
        <Spin spinning={isLoading}>
            <div>
                <Header isBack title="Post detail" />
                <div>
                    <PostDetailAll data={data} />
                </div>
            </div>
        </Spin>
    );
};

export default PostDetail;
