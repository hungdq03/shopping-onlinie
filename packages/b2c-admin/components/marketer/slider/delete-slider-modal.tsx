/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/naming-convention */
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sliderId,
}) => {
    const [form] = Form.useForm();

    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    const { isLoading, data, error } = useQuery({
        queryKey: ['brand-detail'],
        queryFn: () =>
            request.get(`slider/${sliderId}`).then((res) => res.data),
        enabled: Boolean(sliderId) && isOpenModal,
    });

    const { mutate: deleteSliderTrigger, isPending: deleteSliderPending } =
        useMutation({
            mutationFn: (slider: { id: string }) => {
                return request.del(`slider/delete/${slider.id}`);
            },
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
    }, [data, sliderId]);
    const button = useMemo(() => {
        switch (type) {
            case 'DELETE':
                return (
                    <Tooltip
                        arrow={false}
                        color="#108ee9"
                        title="Delete slider"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            key="id"
                            onClick={() => setIsOpenModal(true)}
                            type="primary"
                        />
                    </Tooltip>
                );
            default:
                return null;
        }
    }, [type]);
    const onFinish: FormProps<FormType>['onFinish'] = () => {
        if (sliderId) {
            return deleteSliderTrigger({ id: sliderId });
        }
        return Promise.resolve();
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
                                message="Error"
                                showIcon
                                type="error"
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
