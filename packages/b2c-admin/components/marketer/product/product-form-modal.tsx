/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/naming-convention */
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
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
    Upload,
    UploadFile,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import * as request from 'common/utils/http-request';
import { toast } from 'react-toastify';
import { RcFile } from 'antd/es/upload';
import { Brand } from '~/types/product';

type Props = {
    type: 'CREATE' | 'UPDATE';
    title: string;
    reload: () => void;
    productId?: string;
};

type FormType = {
    name: string;
    brandId: string;
    categoryId: string;
    size: number;
    original_price: number;
    discount_price?: number;
    quantity: number;
    description?: string;
    isShow: boolean;
    thumbnailList?: UploadFile[];
    productImageList?: UploadFile[];
};

type ProductRequestType = {
    name: string;
    brandId: string;
    categoryId: string;
    size: number;
    original_price: number;
    discount_price?: number;
    quantity: number;
    description?: string;
    isShow: boolean;
    thumbnail: string;
    product_image: string[];
};

const ProductFormModal: React.FC<Props> = ({
    type,
    title,
    reload,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    productId,
}) => {
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

    const { mutateAsync: uploadFileTrigger, isPending: uploadFileIsPending } =
        useMutation({
            mutationFn: (fileList: RcFile[]) => {
                const formData = new FormData();
                fileList.forEach((file) => formData.append('files', file));
                return request.post('upload', formData).then((res) => res.data);
            },
            onError: () => {
                toast.error('Upload file failed!');
            },
        });

    const { mutate: createProductTrigger, isPending: createProductIsPending } =
        useMutation({
            mutationFn: (data: ProductRequestType) => {
                return request
                    .post('product/create', data)
                    .then((res) => res.data);
            },
            onSuccess: (res) => {
                toast.success(res?.message);
                setTimeout(() => {
                    setIsOpenModal(false);
                    reload();
                }, 500);
            },
            onError: (error) => {
                toast.error(error?.message);
            },
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const onFinish: FormProps<FormType>['onFinish'] = async (values) => {
        const {
            name,
            isShow,
            brandId,
            categoryId,
            size,
            quantity,
            original_price,
            discount_price,
            description,
        } = values;

        const thumbnailList = values?.thumbnailList?.map(
            (file) => file.originFileObj
        );

        const productImageList = values?.productImageList?.map(
            (file) => file.originFileObj
        );

        const thumbnailListResponse = await uploadFileTrigger(
            (thumbnailList as RcFile[]) ?? []
        )?.then((res) => res.imageUrls);

        const productImageListResponse = await uploadFileTrigger(
            (productImageList as RcFile[]) ?? []
        )?.then((res) => res.imageUrls);

        const productImageListRequest = productImageListResponse?.map(
            (image: string) => ({ url: image })
        );

        createProductTrigger({
            name,
            isShow,
            brandId,
            categoryId,
            size,
            quantity,
            original_price,
            discount_price,
            description,
            thumbnail: thumbnailListResponse?.[0] ?? '',
            product_image: productImageListRequest ?? [],
        });
    };

    return (
        <div>
            {button}
            <Modal
                closable={!uploadFileIsPending || !createProductIsPending}
                footer={false}
                maskClosable={false}
                onCancel={() => setIsOpenModal(false)}
                open={isOpenModal}
                title={title}
                width={800}
            >
                <Spin spinning={getListBrandLoading || getListCategoryLoading}>
                    <div className="max-h-[75vh] overflow-auto px-5">
                        <Form
                            disabled={
                                uploadFileIsPending || createProductIsPending
                            }
                            form={form}
                            initialValues={{
                                isShow: true,
                                discount_price: null,
                                description: null,
                            }}
                            layout="vertical"
                            onFinish={onFinish}
                        >
                            <Form.Item<FormType>
                                label="Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Product name must be required!',
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
                                            message:
                                                'Category must be required!',
                                        },
                                    ]}
                                >
                                    <Select>
                                        {listCategory?.data?.map(
                                            (item: Brand) => (
                                                <Select.Option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        )}
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
                                        addonAfter="ML"
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
                                        addonAfter="VND"
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
                                        addonAfter="VND"
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
                            <Form.Item<FormType>
                                getValueFromEvent={normFile}
                                label="Thumbnail"
                                name="thumbnailList"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Thumbnail must be required!',
                                    },
                                ]}
                                valuePropName="fileList"
                            >
                                <Upload
                                    accept=".png, .jpg, .jpeg"
                                    beforeUpload={() => false}
                                    listType="picture-card"
                                    maxCount={1}
                                >
                                    <button
                                        style={{
                                            border: 0,
                                            background: 'none',
                                        }}
                                        type="button"
                                    >
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </button>
                                </Upload>
                            </Form.Item>
                            <Form.Item<FormType>
                                getValueFromEvent={normFile}
                                label="Product image"
                                name="productImageList"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Product image must be required!',
                                    },
                                ]}
                                valuePropName="fileList"
                            >
                                <Upload
                                    accept=".png, .jpg, .jpeg"
                                    beforeUpload={() => false}
                                    listType="picture-card"
                                    maxCount={8}
                                >
                                    <button
                                        style={{
                                            border: 0,
                                            background: 'none',
                                        }}
                                        type="button"
                                    >
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </button>
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" type="primary">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Spin>
            </Modal>
        </div>
    );
};

ProductFormModal.defaultProps = {
    productId: undefined,
};

export default ProductFormModal;
