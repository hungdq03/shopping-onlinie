import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
    Button,
    Checkbox,
    Form,
    FormProps,
    Input,
    InputNumber,
    Modal,
    Select,
    Spin,
    Tooltip,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import * as request from 'common/utils/http-request';
import { Brand } from '~/types/product';

type Props = {
    type: 'CREATE' | 'UPDATE';
    title: string;
};

type FormType = {
    name?: string;
    brandId?: string;
    categoryId?: string;
    size?: number;
    original_price?: number;
    discount_price?: number;
    quantity?: number;
    description?: string;
    isShow?: boolean;
};

const ProductFormModal: React.FC<Props> = ({ type, title }) => {
    const [form] = Form.useForm();

    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    const { data: listBrand, isLoading: getListBrandLoading } = useQuery({
        queryKey: ['brand'],
        queryFn: () => request.get('brand').then((res) => res.data),
        enabled: isOpenModal,
    });
    const { data: listCategory, isLoading: getListCategoryLoading } = useQuery({
        queryKey: ['category'],
        queryFn: () => request.get('category').then((res) => res.data),
        enabled: isOpenModal,
    });

    useEffect(() => {
        if (isOpenModal) {
            form.resetFields();
        }
    }, [isOpenModal]);

    const button = useMemo(() => {
        switch (type) {
            case 'CREATE':
                return (
                    <Button
                        icon={<PlusOutlined />}
                        onClick={() => setIsOpenModal(true)}
                        type="primary"
                    >
                        Create
                    </Button>
                );
            case 'UPDATE':
                return (
                    <Tooltip arrow={false} color="#108ee9" title="Edit brand">
                        <Button
                            icon={<EditOutlined />}
                            shape="circle"
                            type="link"
                        />
                    </Tooltip>
                );
            default:
                return null;
        }
    }, [type]);

    const onFinish: FormProps<FormType>['onFinish'] = (values) => {
        // eslint-disable-next-line no-console
        console.log(values);
    };

    return (
        <div>
            {button}
            <Modal
                footer={false}
                maskClosable={false}
                onCancel={() => setIsOpenModal(false)}
                open={isOpenModal}
                title={title}
                width={800}
            >
                <Spin spinning={getListBrandLoading || getListCategoryLoading}>
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item<FormType>
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Product name must be required!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="isShow" valuePropName="checked">
                            <Checkbox>Show product on client page</Checkbox>
                        </Form.Item>
                        <div className="grid grid-cols-2 gap-x-10">
                            <Form.Item<FormType>
                                label="Brand"
                                name="brandId"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Brand must be required!',
                                    },
                                ]}
                            >
                                <Select>
                                    {listBrand?.data?.map((item: Brand) => (
                                        <Select.Option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item<FormType>
                                label="Category"
                                name="categoryId"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Category must be required!',
                                    },
                                ]}
                            >
                                <Select>
                                    {listCategory?.data?.map((item: Brand) => (
                                        <Select.Option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item<FormType>
                                label="Size"
                                name="size"
                                rules={[
                                    {
                                        required: true,
                                        message: `Product${"'"}s size must be required!`,
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </Form.Item>
                            <Form.Item<FormType>
                                label="Quantity"
                                name="quantity"
                                rules={[
                                    {
                                        required: true,
                                        message: `Product${"'"}s quantity must be required!`,
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </Form.Item>
                            <Form.Item<FormType>
                                label="Original Price"
                                name="original_price"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Original price must be required!',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </Form.Item>
                            <Form.Item<FormType>
                                label="Discount Price"
                                name="discount_price"
                            >
                                <InputNumber
                                    min={0}
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </Form.Item>
                        </div>
                        <Form.Item<FormType>
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    max: 1000,
                                    message:
                                        'Description must be less than 100 characters!',
                                },
                            ]}
                        >
                            <Input.TextArea rows={5} />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" type="primary">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </div>
    );
};

export default ProductFormModal;
