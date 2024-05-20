import React, { useMemo, useState } from 'react';
import {
    Button,
    Form,
    FormProps,
    Input,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tooltip,
} from 'antd';
import { useQuery } from '@tanstack/react-query';
import * as request from 'common/utils/http-request';
import { EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import SliderModal from './slider-modal';
import { Slider } from '~/types/slider';

type FormType = {
    search?: string;
    sortBy?: string;
    sortOrder?: string;
};

const SORT_LIST = [
    {
        key: 'active',
        value: 'active',
        label: 'Active',
    },
    {
        key: 'inactive',
        value: 'inactive',
        label: 'Inactive',
    },
];

const ListSlider = () => {
    const [form] = Form.useForm<FormType>();
    const [paginationValue, setPaginationValue] = useState({
        pageSize: 5,
        currentPage: 1,
    });

    const [searchValue, setSearchValue] = useState<FormType>({
        search: '',
        sortBy: '',
        sortOrder: '',
    });

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['list-slider', searchValue, paginationValue],
        queryFn: async () =>
            request
                .get('/slider', {
                    params: {
                        ...searchValue,
                        pageSize: paginationValue.pageSize,
                        currentPage: paginationValue.currentPage,
                    },
                })
                .then((res) => res.data),
    });

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Create At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (_: undefined, record: Slider) => (
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
            render: (_: undefined, record: Slider) => (
                <p>
                    {record?.updatedAt &&
                        moment(record.updatedAt).format('YYYY-MM-DD')}
                </p>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: Slider) => (
                <Space size="middle">
                    <Tooltip arrow={false} color="#108ee9" title="Edit slider">
                        <SliderModal
                            button={
                                <Button
                                    icon={<EditOutlined />}
                                    size="small"
                                    type="primary"
                                />
                            }
                            reloadList={refetch}
                            sliderId={record.id ?? ''}
                            title="Edit Slider"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const dataSource = useMemo<Slider[]>(() => data?.data || [], [data]);

    if (error) {
        return <div>Something went wrong!</div>;
    }

    const onFinish: FormProps<FormType>['onFinish'] = (values) => {
        setSearchValue(values);
        setPaginationValue((prev) => ({ ...prev, currentPage: 1 }));
        setTimeout(() => {
            refetch();
        });
    };

    return (
        <Spin spinning={isLoading}>
            <div className="mb-5 flex justify-end">
                <Form
                    className="flex gap-5"
                    form={form}
                    initialValues={{ search: '', sortBy: '', sortOrder: '' }}
                    onFinish={onFinish}
                >
                    <div className="grid grid-cols-3 gap-5">
                        <Form.Item label="Sort by" name="sortBy">
                            <Select defaultValue="" style={{ width: 180 }}>
                                {SORT_LIST?.map((item) => (
                                    <Select.Option
                                        key={item.key}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </Select.Option>
                                ))}
                                <Select.Option default value="">
                                    Select a status
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Sort order" name="sortOrder">
                            <Select defaultValue="" style={{ width: 180 }}>
                                <Select.Option default value="">
                                    Select a order...
                                </Select.Option>
                                <Select.Option default value="asc">
                                    Ascending
                                </Select.Option>
                                <Select.Option default value="desc">
                                    Descending
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Name" name="search">
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="flex justify-end">
                        <Form.Item>
                            <Button
                                htmlType="submit"
                                icon={<SearchOutlined />}
                                type="primary"
                            >
                                Search
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
            <div className="mb-5 flex justify-end">
                <SliderModal
                    button={
                        <Button icon={<PlusOutlined />} type="primary">
                            Create slider
                        </Button>
                    }
                    reloadList={() => refetch()}
                    title="Create slider"
                />
            </div>
            <div>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                />
                <div className="mt-5 flex justify-end">
                    {data?.pagination?.total ? (
                        <Pagination
                            current={paginationValue?.currentPage}
                            defaultCurrent={1}
                            onChange={(page, pageSize) => {
                                setPaginationValue({
                                    currentPage: page,
                                    pageSize,
                                });
                                setTimeout(() => {
                                    refetch();
                                });
                            }}
                            pageSize={5}
                            total={data?.pagination?.total}
                        />
                    ) : null}
                </div>
            </div>
        </Spin>
    );
};

export default ListSlider;
