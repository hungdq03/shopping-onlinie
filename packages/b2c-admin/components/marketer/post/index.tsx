/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
    Button,
    Form,
    FormProps,
    Input,
    Pagination,
    Select,
    Spin,
    Table,
    Tag,
} from 'antd';
import { useQuery } from '@tanstack/react-query';
import * as request from 'common/utils/http-request';
import { PAGE_SIZE } from 'common/constant';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import PostFormModal from './post-form-modal';
import { Post, Product } from '~/types/post';
import Header from '~/components/header';

const FILTER_LIST = [
    {
        id: 'LATEST',
        name: 'Latest Create Date',
    },
    {
        id: 'OLDEST',
        name: 'Oldest Create Date',
    },
    {
        id: 'NAME_A_TO_Z',
        name: 'Name: A to Z',
    },
    {
        id: 'NAME_Z_TO_A',
        name: 'Name: Z to A',
    },
];

type FormType = {
    search?: string;
    sortBy?: string;
    productId?: string;
};

type SearchParams = FormType & {
    pageSize?: number;
    currentPage?: number;
};

const PostList = () => {
    const [searchParams, setSearchParams] = useState<SearchParams>({
        pageSize: PAGE_SIZE,
        currentPage: 1,
    });

    const { data: products, isLoading: productLoading } = useQuery({
        queryKey: ['product'],
        queryFn: () => request.get('manage/product').then((res) => res.data),
    });

    const {
        data: listPost,
        isLoading: postLoading,
        refetch,
    } = useQuery({
        queryKey: ['post'],
        queryFn: () =>
            request
                .get('manage/post', { params: { ...searchParams } })
                .then((res) => res.data),
    });

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id: string, record: Post, index: number) => {
                return (
                    index +
                    1 +
                    ((searchParams?.currentPage ?? 1) - 1) *
                        (searchParams?.pageSize ?? 0)
                );
            },
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
            render: (_: any, record: Post) => <p>{record?.product?.name}</p>,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (_: any, record: Post) => <p>{record.title}</p>,
        },

        {
            title: 'Show on Client',
            dataIndex: 'isShow',
            key: 'isShow',
            render: (id: string, record: Post) => {
                return (
                    <Tag color={record?.isShow ? 'blue' : 'red'}>
                        {record?.isShow ? 'SHOW' : 'HIDE'}
                    </Tag>
                );
            },
        },
        {
            title: 'Create At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (_: any, record: Post) => (
                <p>
                    {record?.createdAt &&
                        moment(record.createdAt).format('YYYY-MM-DD')}
                </p>
            ),
        },
        {
            title: 'Update At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (_: any, record: Post) => (
                <p>
                    {record?.updatedAt &&
                        moment(record.updatedAt).format('YYYY-MM-DD')}
                </p>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Product) => (
                <PostFormModal
                    postId={record?.id ?? ''}
                    reload={() => refetch()}
                    title="Update post"
                    type="UPDATE"
                />
            ),
        },
    ];

    const filterOption = (
        input: string,
        option?: { value: string; label: string }
    ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const onFinish: FormProps<FormType>['onFinish'] = (values) => {
        setSearchParams((prev) => ({ ...prev, ...values, currentPage: 1 }));
        setTimeout(() => {
            refetch();
        });
    };

    return (
        <Spin spinning={productLoading || postLoading}>
            <Header title="Manage Post" />
            <div>
                <Form
                    className="flex gap-x-10"
                    labelCol={{ span: 6 }}
                    onFinish={onFinish}
                    wrapperCol={{ span: 18 }}
                >
                    <div className="grid flex-1 grid-cols-3 justify-end gap-x-5">
                        <Form.Item<FormType> label="Product" name="productId">
                            <Select
                                allowClear
                                filterOption={filterOption}
                                options={products?.data?.map(
                                    (item: Product) => ({
                                        value: item.id,
                                        label: item.name,
                                    })
                                )}
                                showSearch
                            />
                        </Form.Item>

                        <Form.Item<FormType> label="Order by" name="sortBy">
                            <Select allowClear>
                                {FILTER_LIST.map((item) => (
                                    <Select.Option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item<FormType> label="Title" name="search">
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <Button
                            htmlType="submit"
                            icon={<SearchOutlined />}
                            type="primary"
                        >
                            Search
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="mb-10 flex justify-end">
                <PostFormModal
                    reload={() => {}}
                    title="Create post"
                    type="CREATE"
                />
            </div>
            <div>
                <Table
                    columns={columns}
                    dataSource={listPost?.data}
                    pagination={false}
                    rowKey="id"
                />
                <div className="mt-5 flex justify-end">
                    {listPost?.pagination?.total ? (
                        <Pagination
                            current={searchParams?.currentPage}
                            defaultCurrent={1}
                            onChange={(page, pageSize) => {
                                setSearchParams((prev) => ({
                                    ...prev,
                                    currentPage: page,
                                    pageSize,
                                }));
                                setTimeout(() => {
                                    refetch();
                                });
                            }}
                            pageSize={searchParams?.pageSize}
                            pageSizeOptions={[5, 10, 20, 50]}
                            showSizeChanger
                            total={listPost?.pagination?.total}
                        />
                    ) : null}
                </div>
            </div>
        </Spin>
    );
};

export default PostList;
