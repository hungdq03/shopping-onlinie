import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
    Button,
    Form,
    Input,
    Select,
    Spin,
    Table,
    TableColumnsType,
} from 'antd';
import request from 'common/utils/http-request';
import React, { useEffect, useMemo, useState } from 'react';

interface DataType {
    key: string;
    id: string;
    name: string;
    role: string;
    email: string;
    gender: string;
    phone: string;
    dob: string;
    status: string;
    address: string;
}

const ListUser = () => {
    const { data: listUser, isLoading } = useQuery({
        queryKey: ['listUser'],
        queryFn: () => request.get('/listUser').then((res) => res.data.data),
    });

    const originData: DataType[] = useMemo(() => {
        if (!listUser) {
            return [];
        }
        return listUser.map((e: DataType, i: number) => ({
            key: i.toString(),
            id: e.id,
            name: e.name,
            dob: e.dob,
            address: e.address,
            role: e.role,
            status: e.status,
            phone: e.phone,
            email: e.email,
            gender: e.gender,
        }));
    }, [listUser]);

    const [form] = Form.useForm();
    const [filterData, setData] = useState(originData);
    const [searchType, setSearchType] = useState<keyof DataType>('name');
    const [searchInput, setSearchInput] = useState('');

    const handleSearch = () => {
        if (searchInput !== '') {
            const newData = originData.filter((item) =>
                item[searchType]?.toLowerCase().includes(searchInput)
            );
            setData(newData);
            setSearchInput('');
        }
    };

    const handleReset = () => {
        setData(originData);
        setSearchInput('');
    };

    useEffect(() => setData(originData), [originData]);

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Id',
            key: 'id',
            dataIndex: 'id',
            width: '20%',
            sorter: (a, b) => {
                if (a.id && b.id) {
                    return a.id.length - b.id.length;
                }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Full name',
            key: 'name',
            dataIndex: 'name',
            width: '20%',
            sorter: (a, b) => {
                if (a.name && b.name) {
                    return a.name.length - b.name.length;
                }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Gender',
            key: 'gender',
            dataIndex: 'gender',
            width: '10%',
            filters: [
                { text: 'Male', value: 'MALE' },
                { text: 'Female', value: 'FEMALE' },
            ],
            onFilter: (value, record) =>
                record.gender.indexOf(value as string) === 0,
            sorter: (a, b) => {
                if (a.gender && b.gender) {
                    return a.gender.length - b.gender.length;
                }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'email',
            width: '20%',
            sorter: (a, b) => {
                if (a.email && b.email) {
                    return a.email.length - b.email.length;
                }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Phone',
            key: 'phone',
            dataIndex: 'phone',
            width: '10%',
            sorter: (a, b) => {
                if (a.phone && b.phone) {
                    return a.phone.length - b.phone.length;
                }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Role',
            key: 'role',
            dataIndex: 'role',
            width: '10%',
            filters: [
                { text: 'Admin', value: 'ADMIN' },
                { text: 'Marketer', value: 'MARKETER' },
                { text: 'Saler', value: 'SALER' },
                { text: 'User', value: 'USER' },
            ],
            onFilter: (value, record) =>
                record.role.indexOf(value as string) === 0,
            sorter: (a, b) => a.role.length - b.role.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            width: '10%',
            filters: [
                { text: 'ACTIVE', value: 'ACTIVE' },
                { text: 'INACTIVE', value: 'INACTIVE' },
                { text: 'NEWLY_REGISTER', value: 'NEWLY_REGISTER' },
                { text: 'NEWLY_BOUGHT', value: 'NEWLY_BOUGHT' },
                { text: 'BANNED', value: 'BANNED' },
            ],
            onFilter: (value, record) =>
                record.status.indexOf(value as string) === 0,
            sorter: (a, b) => a.status.length - b.status.length,
            sortDirections: ['descend', 'ascend'],
        },
    ];

    return (
        <Spin spinning={isLoading}>
            <div className="flex w-full items-center justify-between">
                <div className="button mb-6 flex w-full justify-between">
                    <Button type="primary">Create</Button>
                    <div className="flex gap-2">
                        <Button onClick={handleReset} type="primary">
                            Reset
                        </Button>

                        <Select
                            defaultValue="name"
                            onChange={setSearchType}
                            options={[
                                { value: 'name', label: 'Name' },
                                { value: 'email', label: 'Email' },
                                { value: 'phone', label: 'Phone' },
                            ]}
                            style={{ width: 120 }}
                        />
                        <Input
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search"
                            value={searchInput}
                        />
                        <Button
                            icon={<SearchOutlined />}
                            onClick={handleSearch}
                            type="primary"
                        >
                            Search
                        </Button>
                    </div>
                </div>
            </div>
            <Form component={false} form={form}>
                <Table
                    bordered
                    columns={columns}
                    dataSource={filterData}
                    rowClassName="editable-row"
                />
            </Form>
        </Spin>
    );
};

export default ListUser;
