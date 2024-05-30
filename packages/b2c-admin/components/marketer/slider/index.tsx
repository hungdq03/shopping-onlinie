import React, { useState } from 'react';
import {
    Button,
    Flex,
    Form,
    FormProps,
    Input,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip,
} from 'antd';
import { useQuery } from '@tanstack/react-query';
import * as request from 'common/utils/http-request';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import Link from 'next/link';
import { FILTER_LIST, PAGE_SIZE } from 'common/constant';
import SliderModal from './slider-modal';
import { Product, Slider } from '~/types/slider';
import Header from '~/components/header';
import DeleteSliderFormModal from './delete-slider-modal';

type FormType = {
    search?: string;
    sortBy?: string;
    productId?: string;
    isShow?: boolean;
};

type SearchParams = FormType & {
    pageSize?: number;
    currentPage?: number;
};
const ListSlider: React.FC = () => {
    const [searchParams, setSearchParams] = useState<SearchParams>({
        pageSize: PAGE_SIZE,
        currentPage: 1,
    });

    const { data: products, isLoading: productLoading } = useQuery({
        queryKey: ['product'],
        queryFn: () => request.get('manage/product').then((res) => res.data),
    });

    const {
        data: listSlider,
        isLoading: sliderLoading,
        refetch,
    } = useQuery({
        queryKey: ['slider'],
        queryFn: () =>
            request
                .get('manage/slider', { params: { ...searchParams } })
                .then((res) => res.data),
    });

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id: string, record: Slider, index: number) => {
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_: any, record: Slider) => <p>{record?.product?.name}</p>,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_: any, record: Slider) => <p>{record.title}</p>,
        },
        {
            title: 'Show on Client',
            dataIndex: 'isShow',
            key: 'isShow',
            render: (value: boolean) => {
                return (
                    <Tag color={value ? 'blue' : 'red'}>
                        {value ? 'SHOW' : 'HIDE'}
                    </Tag>
                );
            },
        },
        {
            title: 'Create At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            ellipsis: true,
            render: (value: string) => (
                <p>{value && moment(value).format('YYYY-MM-DD')}</p>
            ),
        },
        {
            title: 'Update At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ellipsis: true,
            render: (value: string) => (
                <p>{value && moment(value).format('YYYY-MM-DD')}</p>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_: any, record: Slider) => (
                <Flex align="start" gap="middle" vertical>
                    <Space size="middle">
                        <SliderModal
                            reload={() => refetch()}
                            sliderID={record?.id ?? ''}
                            title="Update Slider"
                            type="UPDATE"
                        />
                        <DeleteSliderFormModal
                            reload={() => refetch()}
                            sliderId={record?.id ?? ''}
                            title="Delete slider"
                            type="DELETE"
                        />
                        <Tooltip arrow={false} color="#108ee9" title="Detail">
                            <Link href={`/marketer/slider/${record?.id}`}>
                                <EyeOutlined className="text-lg text-blue-500 hover:text-blue-400" />
                            </Link>
                        </Tooltip>
                    </Space>
                </Flex>
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
        <Spin spinning={productLoading || sliderLoading}>
            <Header title="Manage Slider" />
            <div>
                <Form
                    className="flex gap-x-10"
                    labelCol={{ span: 6 }}
                    onFinish={onFinish}
                    wrapperCol={{ span: 18 }}
                >
                    <div className="grid flex-1 grid-cols-2 justify-end gap-x-5 xl:grid-cols-3">
                        <Form.Item<FormType> label="Product" name="productId">
                            <Select
                                allowClear
                                filterOption={filterOption}
                                options={products?.data?.map(
                                    (item: Product) => ({
                                        value: item?.id,
                                        label: item?.name,
                                    })
                                )}
                                placeholder="Select a product..."
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
                        <Form.Item<FormType>
                            label="Show on client: "
                            name="isShow"
                        >
                            <Select allowClear>
                                <Select.Option value="true">
                                    <Tag color="blue">SHOW</Tag>
                                </Select.Option>
                                <Select.Option value="false">
                                    <Tag color="red">HIDE</Tag>
                                </Select.Option>
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
                <SliderModal
                    reload={() => {}}
                    title="Create Slider"
                    type="CREATE"
                />
            </div>
            <div>
                <Table
                    columns={columns}
                    dataSource={listSlider?.data}
                    pagination={false}
                    rowKey="id"
                    tableLayout="fixed"
                />
                <div className="mt-5 flex justify-end">
                    {listSlider?.pagination?.total ? (
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
                            total={listSlider?.pagination?.total}
                        />
                    ) : null}
                </div>
            </div>
        </Spin>
    );
};

export default ListSlider;
