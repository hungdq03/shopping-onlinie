import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    Button,
    Checkbox,
    Form,
    FormProps,
    Input,
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
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import { Product } from '~/types/slider';

type Props = {
    type: 'CREATE' | 'UPDATE';
    title: string;
    reload: () => void;
    sliderID?: string;
};
type FormType = {
    title: string;
    description?: string;
    productId: string;
    isShow: boolean;
    image: string;
    imageList?: UploadFile[];
};
type SliderRequestType = {
    title: string;
    description?: string;
    productId: string;
    isShow: boolean;
    image: string;
};
interface FileProps {
    uid: string;
    name: string;
    status: string;
    url?: string;
}
const SliderModal: React.FC<Props> = ({ type, title, reload, sliderID }) => {
    const [form] = Form.useForm<FormType>();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const { data: listProduct, isLoading: getListProductLoading } = useQuery({
        queryKey: ['product'],
        queryFn: () => request.get('product').then((res) => res.data),
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
    const { mutate: createSliderTrigger, isPending: createSliderIsPending } =
        useMutation({
            mutationFn: (data: SliderRequestType) => {
                return request
                    .post('slider/create', data)
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
    const { mutate: updateSliderTrigger, isPending: updateSliderPending } =
        useMutation({
            mutationFn: (slider: {
                id: string;
                title: string;
                description?: string;
                productId: string;
                isShow: boolean;
                image: UploadFile[];
            }) => {
                return request.put(`slider/update/${slider.id}`, {
                    title: slider.title,
                    description: slider.description,
                    productId: slider.productId,
                    isShow: slider.isShow,
                    image: slider.image,
                });
            },
            onSuccess: (res) => {
                toast.success(res.data.message);
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
                    <Tooltip arrow={false} color="#108ee9" title="Edit slider">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => setIsOpenModal(true)}
                            type="primary"
                        />
                    </Tooltip>
                );

            default:
                return null;
        }
    }, [type]);
    const normFile = (e: UploadChangeParam<UploadFile<FileProps>>) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList || [];
    };

    // eslint-disable-next-line consistent-return
    const onFinish: FormProps<FormType>['onFinish'] = async (values) => {
        const {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            title,
            description,
            productId,
            isShow,
        } = values;
        const imageList = values?.imageList?.map((file) => file.originFileObj);
        const imageListResponse = await uploadFileTrigger(
            (imageList as RcFile[]) ?? []
        )?.then((res) => res.imageUrls);
        switch (type) {
            case 'CREATE':
                createSliderTrigger({
                    title,
                    description,
                    productId,
                    isShow,
                    image: imageListResponse?.[0] ?? '',
                });
                break;
            case 'UPDATE':
                if (sliderID) {
                    return updateSliderTrigger({
                        id: sliderID!,
                        title: values.title || '',
                        description: values.description || '',
                        productId: values.productId || '',
                        isShow: values.isShow,
                        image: imageListResponse?.[0] ?? '',
                    });
                }

                break;
            default:
                return null;
        }
    };
    return (
        <div>
            {button}
            <Modal
                closable={
                    !uploadFileIsPending ||
                    !createSliderIsPending ||
                    !updateSliderPending
                }
                footer={false}
                maskClosable={false}
                onCancel={() => setIsOpenModal(false)}
                open={isOpenModal}
                title={title}
                width={800}
            >
                <Spin spinning={getListProductLoading}>
                    <div className="max-h-[75vh] overflow-auto px-5">
                        <Form
                            disabled={
                                uploadFileIsPending ||
                                createSliderIsPending ||
                                updateSliderPending
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
                                label="Title"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Title must be required!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name="isShow" valuePropName="checked">
                                <Checkbox>Show slider on client page</Checkbox>
                            </Form.Item>
                            <div className="grid grid-cols-2 gap-x-10">
                                <Form.Item<FormType>
                                    label="Product"
                                    name="productId"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Product must be required!',
                                        },
                                    ]}
                                >
                                    <Select>
                                        {listProduct?.data?.map(
                                            (item: Product) => (
                                                <Select.Option
                                                    key={item?.id}
                                                    value={item?.id}
                                                >
                                                    {item?.name}
                                                </Select.Option>
                                            )
                                        )}
                                    </Select>
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
                                label="image"
                                name="imageList"
                                rules={[
                                    {
                                        required: true,
                                        message: 'image must be required!',
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
SliderModal.defaultProps = {
    sliderID: undefined,
};
export default SliderModal;
