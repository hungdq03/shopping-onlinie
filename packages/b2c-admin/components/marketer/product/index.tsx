/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
    Button,
    Form,
    FormProps,
    Input,
    Pagination,
    Rate,
    Select,
    Spin,
    Table,
    Tag,
} from 'antd';
import { useQuery } from '@tanstack/react-query';
import * as request from 'common/utils/http-request';
import { PAGE_SIZE, RATING_LIST } from 'common/constant';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { currencyFormatter } from 'common/utils/formatter';
import ProductFormModal from './product-form-modal';
import { Brand, Category, Product } from '~/types/product';
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
        id: 'NAME_A_TO_Z',
        name: 'Name: Z to A',
    },
    {
        id: 'RATE_LOW_TO_HIGHT',
        name: 'Rate: Low to Hight',
    },
    {
        id: 'RATE_HIGHT_TO_LOW',
        name: 'Rate: Hight to low',
    },
    {
        id: 'PRICE_LOW_TO_HIGHT',
        name: 'Price: Low to Hight',
    },
    {
        id: 'PRICE_HIGHT_TO_LOW',
        name: 'Price: Hight to low',
    },
];

type FormType = {
    brandId?: string;
    categoryId?: string;
    search?: string;
    rating?: string;
    sortBy?: string;
};

type SearchParams = FormType & {
    pageSize?: number;
    currentPage?: number;
};

const ProductList = () => {
    const [searchParams, setSearchParams] = useState<SearchParams>({
        pageSize: PAGE_SIZE,
        currentPage: 1,
    });

    const { data: categories, isLoading: categoryLoading } = useQuery({
        queryKey: ['category'],
        queryFn: () => request.get('category').then((res) => res.data),
    });
    const { data: brands, isLoading: brandLoading } = useQuery({
        queryKey: ['brand'],
        queryFn: () => request.get('brand').then((res) => res.data),
    });

    const {
        data: listProduct,
        isLoading: productLoading,
        refetch,
    } = useQuery({
        queryKey: ['product'],
        queryFn: () =>
            request
                .get('manage/product', { params: { ...searchParams } })
                .then((res) => res.data),
    });

    const columns = [
        {
            title: 'Index',
            dataIndex: 'id',
            key: 'id',
            render: (id: string, record: Product, index: number) => {
                return (
                    index +
                    1 +
                    ((searchParams?.currentPage ?? 1) - 1) *
                        (searchParams?.pageSize ?? 0)
                );
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'name',
            render: (_: any, record: Product) => <p>{record?.brand?.name}</p>,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'name',
            render: (_: any, record: Product) => (
                <p>{record?.category?.name}</p>
            ),
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Sold Quantity',
            dataIndex: 'sold_quantity',
            key: 'sold_quantity',
        },
        {
            title: 'Original Price',
            dataIndex: 'original_price',
            key: 'original_price',
            render: (_: any, record: Product) =>
                record?.original_price && (
                    <p>{currencyFormatter(record?.original_price)}</p>
                ),
        },
        {
            title: 'Discount Price',
            dataIndex: 'discount_price',
            key: 'discount_price',
            render: (_: any, record: Product) =>
                record?.discount_price && (
                    <p>{currencyFormatter(record?.discount_price)}</p>
                ),
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            width: '200px',
            render: (_: any, record: Product) => (
                <Rate disabled value={record?.rating ?? 0} />
            ),
        },
        {
            title: 'Show on Client',
            dataIndex: 'isShow',
            key: 'isShow',
            render: (id: string, record: Product) => {
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
            render: (_: any, record: Brand) => (
                <p>
                    {record?.createdAt &&
                        moment(record.createdAt).format('YYYY-MM-DD')}
                </p>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Product) => (
                <ProductFormModal
                    productId={record?.id ?? ''}
                    reload={() => refetch()}
                    title="Update product"
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
        <Spin spinning={categoryLoading || brandLoading || productLoading}>
            <Header title="Manage Product" />
            <div>
                <Form
                    className="flex gap-x-10"
                    labelCol={{ span: 6 }}
                    onFinish={onFinish}
                    wrapperCol={{ span: 18 }}
                >
                    <div className="grid flex-1 grid-cols-3 justify-end gap-x-5">
                        <Form.Item<FormType> label="Brand" name="brandId">
                            <Select
                                allowClear
                                filterOption={filterOption}
                                options={brands?.data?.map((item: Brand) => ({
                                    value: item.id,
                                    label: item.name,
                                }))}
                                showSearch
                            />
                        </Form.Item>
                        <Form.Item<FormType> label="Category" name="categoryId">
                            <Select
                                allowClear
                                filterOption={filterOption}
                                options={categories?.data?.map(
                                    (item: Category) => ({
                                        value: item.id,
                                        label: item.name,
                                    })
                                )}
                                showSearch
                            />
                        </Form.Item>
                        <Form.Item<FormType> label="Name" name="search">
                            <Input />
                        </Form.Item>
                        <Form.Item<FormType> label="Rate" name="rating">
                            <Select allowClear>
                                {RATING_LIST.map((item) => (
                                    <Select.Option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        <Rate disabled value={item.value} />
                                    </Select.Option>
                                ))}
                            </Select>
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
                <ProductFormModal
                    reload={() => {}}
                    title="Create product"
                    type="CREATE"
                />
            </div>
            <div>
                <Table
                    columns={columns}
                    dataSource={listProduct?.data}
                    pagination={false}
                />
                <div className="mt-5 flex justify-end">
                    {listProduct?.pagination?.total ? (
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
                            total={listProduct?.pagination?.total}
                        />
                    ) : null}
                </div>
            </div>
        </Spin>
    );
};

export default ProductList;
