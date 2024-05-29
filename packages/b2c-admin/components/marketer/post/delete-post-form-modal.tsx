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
    postId?: string;
};

type FormType = {
    title: string;
    description?: string;
    productId: string;
    isShow: boolean;
    thumbnail: string;
    thumbnailList?: UploadFile[];
};

const DeletePostFormModal: React.FC<Props> = ({
    type,
    title,
    reload,
    postId,
}) => {
    const [form] = Form.useForm();

    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    const { isLoading, data, error } = useQuery({
        queryKey: ['post-detail'],
        queryFn: () => request.get(`post/${postId}`).then((res) => res.data),
        enabled: Boolean(postId) && isOpenModal,
    });

    const { mutate: deletePostTrigger, isPending: deletePostPending } =
        useMutation({
            mutationFn: (post: { id: string }) => {
                return request.del(`post/delete/${post.id}`);
            },
            onSuccess: async (res) => {
                toast.success(res.data.message);
                setTimeout(() => {
                    setIsOpenModal(false);
                    reload();
                }, 500);
            },
            onError: async () => {
                toast.error('Delete post failed!');
            },
        });

    useEffect(() => {
        if (postId) {
            form.setFieldsValue({ name: data?.data?.name });
        } else {
            form.resetFields();
        }
    }, [data, postId]);

    // eslint-disable-next-line consistent-return
    const button = useMemo(() => {
        if (type === 'DELETE') {
            return (
                <Tooltip arrow={false} color="red" title="Delete post">
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
        if (postId) {
            return deletePostTrigger({ id: postId });
        }
    };

    return (
        <div>
            {button}
            <Modal
                closable={!deletePostPending}
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
                            disabled={deletePostPending}
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                        >
                            <Alert
                                description="Do you want to delete this post"
                                message="Error"
                                showIcon
                                type="error"
                            />
                            <Form.Item>
                                <Button
                                    htmlType="submit"
                                    loading={deletePostPending}
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

DeletePostFormModal.defaultProps = {
    postId: undefined,
};

export default DeletePostFormModal;
