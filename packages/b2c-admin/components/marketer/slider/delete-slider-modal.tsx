import { DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    Alert,
    Button,
    Form,
    FormProps,
    Modal,
    Spin,
    Tooltip,
    UploadFile,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import * as request from 'common/utils/http-request';
import { toast } from 'react-toastify';

type Props = {
    type: 'DELETE';
    title: string;
    reload: () => void;
    sliderId?: string;
};

type FormType = {
    title: string;
    description?: string;
    productId: string;
    isShow: boolean;
    image: string;
    imageList?: UploadFile[];
};

const DeleteSliderFormModal: React.FC<Props> = ({
    type,
    title,
    reload,
    sliderId,
}) => {
    const [form] = Form.useForm();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    const { isLoading, data, error } = useQuery({
        queryKey: ['slider-detail'],
        queryFn: () =>
            request.get(`slider/${sliderId}`).then((res) => res.data),
        enabled: Boolean(sliderId) && isOpenModal,
    });

    const { mutate: deleteSliderTrigger, isPending: deleteSliderPending } =
        useMutation({
            mutationFn: (slider: { id: string }) =>
                request.del(`slider/delete/${slider.id}`),
            onSuccess: async (res) => {
                toast.success(res.data.message);
                setTimeout(() => {
                    setIsOpenModal(false);
                    reload();
                }, 500);
            },
            onError: async () => {
                toast.error('Delete slider failed!');
            },
        });

    useEffect(() => {
        if (sliderId) {
            form.setFieldsValue({ name: data?.data?.name });
        } else {
            form.resetFields();
        }
    }, [data, sliderId, form]);

    // eslint-disable-next-line consistent-return
    const button = useMemo(() => {
        if (type === 'DELETE') {
            return (
                <Tooltip arrow={false} color="#108ee9" title="Delete slider">
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        key="id"
                        onClick={() => setIsOpenModal(true)}
                        shape="circle"
                        type="link"
                    />
                </Tooltip>
            );
        }
    }, [type]);

    // eslint-disable-next-line consistent-return
    const onFinish: FormProps<FormType>['onFinish'] = () => {
        if (sliderId) {
            return deleteSliderTrigger({ id: sliderId });
        }
    };

    return (
        <div>
            {button}
            <Modal
                closable={!deleteSliderPending}
                footer={false}
                maskClosable={false}
                onCancel={() => setIsOpenModal(false)}
                open={isOpenModal}
                title={title}
                width={800}
            >
                <Spin spinning={isLoading}>
                    {error ? (
                        <div>Something went wrong!</div>
                    ) : (
                        <Form
                            className="flex flex-col gap-2"
                            disabled={deleteSliderPending}
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                        >
                            <Alert
                                description="Do you want to delete this slider"
                                message="Confirmation"
                                showIcon
                                type="warning"
                            />
                            <Form.Item>
                                <Button
                                    htmlType="submit"
                                    loading={deleteSliderPending}
                                    type="primary"
                                >
                                    Yes
                                </Button>
                            </Form.Item>
                        </Form>
                    )}
                </Spin>
            </Modal>
        </div>
    );
};

DeleteSliderFormModal.defaultProps = {
    sliderId: undefined,
};

export default DeleteSliderFormModal;
