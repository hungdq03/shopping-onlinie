import React, { useMemo } from 'react';
import { Button, Space, Spin, Table, Tooltip } from 'antd';
import { useQuery } from '@tanstack/react-query';
import * as request from 'common/utils/http-request';
import { EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Brand } from '~/types/product';
import BrandModal from './brand-modal';

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (_: any, record: Brand) => (
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (_: any, record: Brand) => (
            <p>
                {record?.updatedAt &&
                    moment(record.updatedAt).format('YYYY-MM-DD')}
            </p>
        ),
    },
    {
        title: 'Actions',
        key: 'actions',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (_: any, record: Brand) => (
            <Space size="middle">
                <Tooltip arrow={false} color="#108ee9" title="Edit brand">
                    <BrandModal
                        brandId={record.id}
                        button={
                            <Button
                                icon={<EditOutlined />}
                                shape="circle"
                                type="link"
                            />
                        }
                        title="Edit brand"
                    />
                </Tooltip>
            </Space>
        ),
    },
];

const ListBrand = () => {
    const { data, error, isLoading } = useQuery({
        queryKey: ['list-brand'],
        queryFn: () =>
            request
                .get('manage/brand', {
                    params: {
                        search: '',
                        pageSize: 5,
                        currentPage: 1,
                    },
                })
                .then((res) => res.data),
    });

    const dataSource = useMemo<Brand[]>(() => {
        return data?.data || [];
    }, [data]);

    if (error) {
        return <div>Something went wrong!</div>;
    }

    return (
        <Spin spinning={isLoading}>
            <div>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                />
            </div>
        </Spin>
    );
};

export default ListBrand;
