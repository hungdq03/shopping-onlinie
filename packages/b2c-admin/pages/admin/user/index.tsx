import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
    Button,
    Form,
    FormProps,
    Input,
    Pagination,
    Select,
    Spin,
    Table,
    TableColumnsType,
} from 'antd';
import { PAGE_SIZE } from 'common/constant';
import request from 'common/utils/http-request';
import { useState } from 'react';
import Header from '~/components/header';
import { User } from '~/types/user';
import UserFormModal from './user-form-modal';

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

const FILTER_LIST = [
    {
        id: 'NAME_A_TO_Z',
        name: 'Name: A to Z',
    },
    {
        id: 'NAME_Z_TO_A',
        name: 'Name: Z to A',
    },
    {
        id: 'EMAIL_A_TO_Z',
        name: 'Email: A to Z',
    },
    {
        id: 'EMAIL_Z_TO_A',
        name: 'Email: Z to A',
    },
    {
        id: 'GENDER_A_TO_Z',
        name: 'Gender: A to Z',
    },
    {
        id: 'GENDER_Z_TO_A',
        name: 'Gender: Z to A',
    },
    {
        id: 'PHONE_LOW_TO_HIGH',
        name: 'Phone: Low to High',
    },
    {
        id: 'PHONE_HIGH_TO_LOW',
        name: 'Phone: High to Low',
    },
    {
        id: 'ROLE_A_TO_Z',
        name: 'Role: A to Z',
    },
    {
        id: 'ROLE_Z_TO_A',
        name: 'Role: Z to A',
    },
    {
        id: 'STATUS_A_TO_Z',
        name: 'Status: A to Z',
    },
    {
        id: 'STATUS_Z_TO_A',
        name: 'Status: Z to A',
    },
];

const filterBy = [
    {
        id: 'role',
        name: 'Role',
    },
    {
        id: 'gender',
        name: 'Gender',
    },
    {
        id: 'status',
        name: 'Status',
    },
];

const filterRole = [
    {
        id: 'ADMIN',
        name: 'Admin',
    },
    {
        id: 'USER',
        name: 'User',
    },
    {
        id: 'MAKERTER',
        name: 'Marketer',
    },
    {
        id: 'SALER',
        name: 'Saler',
    },
];

const filterGender = [
    {
        id: 'MALE',
        name: 'Male',
    },
    {
        id: 'FEMALE',
        name: 'Female',
    },
];

const filterStatus = [
    {
        id: 'ACTIVE',
        name: 'Active',
    },
    {
        id: 'INACTIVE',
        name: 'Inactive',
    },
    {
        id: 'BANNED',
        name: 'Banned',
    },
    {
        id: 'NEWLY_REGISTER',
        name: 'Newly register',
    },
    {
        id: 'NEWLY_BOUGHT',
        name: 'Newly bought',
    },
];
type FormType = {
    brandId?: string;
    searchBy?: string;
    search?: string;
    filterBy?: string;
    filter?: string;
    sortBy?: string;
};

const searchBy = [
    {
        id: 'name',
        name: 'Name',
    },
    {
        id: 'email',
        name: 'Email',
    },
    {
        id: 'phone',
        name: 'Phone',
    },
];

type SearchParams = FormType & {
    pageSize?: number;
    currentPage?: number;
};

const ListUser = () => {
    const [searchParams, setSearchParams] = useState<SearchParams>({
        pageSize: PAGE_SIZE,
        currentPage: 1,
    });

    const {
        data: listUser,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['listUser'],
        queryFn: () =>
            request
                .get('/user/list', {
                    params: { ...searchParams },
                })
                .then((res) => res.data),
    });

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Id',
            key: 'id',
            dataIndex: 'id',
            width: '20%',
            render: (id: string, record: User, index: number) => {
                return (
                    index +
                    1 +
                    ((searchParams?.currentPage ?? 1) - 1) *
                        (searchParams?.pageSize ?? 0)
                );
            },
        },
        {
            title: 'Full name',
            key: 'name',
            dataIndex: 'name',
            width: '20%',
        },
        {
            title: 'Gender',
            key: 'gender',
            dataIndex: 'gender',
            width: '10%',
        },
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'email',
            width: '20%',
        },
        {
            title: 'Phone',
            key: 'phone',
            dataIndex: 'phone',
            width: '10%',
        },
        {
            title: 'Role',
            key: 'role',
            dataIndex: 'role',
            width: '10%',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            width: '10%',
        },
    ];

    const [filterOptions, setFilterOptions] = useState([{ id: '', name: '' }]);

    const handleFilterByChange = (value: string) => {
        switch (value) {
            case 'role':
                setFilterOptions(filterRole);
                break;
            case 'gender':
                setFilterOptions(filterGender);
                break;
            case 'status':
                setFilterOptions(filterStatus);
                break;
            default:
                setFilterOptions([]);
        }
    };

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
        <Spin spinning={isLoading}>
            <Header title="Manage User" />
            <div>
                <Form
                    className="flex gap-x-10"
                    labelCol={{ span: 6 }}
                    onFinish={onFinish}
                    wrapperCol={{ span: 18 }}
                >
                    <div className="grid flex-1 grid-cols-3 justify-end gap-x-5">
                        <Form.Item<FormType> label="Order by" name="sortBy">
                            <Select>
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
                        <Form.Item<FormType> label="Search by" name="searchBy">
                            <Select
                                filterOption={filterOption}
                                options={searchBy.map(
                                    (item: { id: string; name: string }) => ({
                                        value: item.id,
                                        label: item.name,
                                    })
                                )}
                                showSearch
                            />
                        </Form.Item>
                        <Form.Item<FormType> name="search">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Filter by" name="fillterBy">
                            <Select
                                onChange={handleFilterByChange}
                                options={filterBy.map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                }))}
                                showSearch
                            />
                        </Form.Item>
                        <Form.Item label="Filter" name="fillter">
                            <Select
                                options={filterOptions.map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                }))}
                                showSearch
                            />
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
                <UserFormModal
                    reload={() => {
                        refetch();
                    }}
                    title="Create user"
                    type="CREATE"
                />
            </div>
            <div>
                <Table
                    columns={columns}
                    dataSource={listUser?.data}
                    pagination={false}
                />
                <div className="mt-5 flex justify-end">
                    {listUser?.pagination?.total ? (
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
                            total={listUser?.pagination?.total}
                        />
                    ) : null}
                </div>
            </div>
        </Spin>
    );
};

export default ListUser;
