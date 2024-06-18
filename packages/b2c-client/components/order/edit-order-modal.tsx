import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, Modal, Spin } from 'antd';
import * as request from 'common/utils/http-request';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
    orderId: string;
    address: string;
    name: string;
    gender: string;
    email: string;
    phoneNumber: string;
};

type FormType = {
    address: string;
    name: string;
    gender: string;
    email: string;
    phoneNumber: string;
};

const EditOrderModal: React.FC<Props> = ({
    orderId,
    address,
    name,
    gender,
    email,
    phoneNumber,
}) => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const { push } = useRouter();
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            address,
            name,
            gender,
            email,
            phoneNumber,
        });
    }, [isOpenModal, orderId]);

    const { mutate, isPending } = useMutation({
        mutationFn: () =>
            request.del(`product/delete/${orderId}`).then((res) => res.data),
        onSuccess: (res) => {
            toast.success(res?.message);
            setTimeout(() => {
                push('/my-page/my-order');
                setIsOpenModal(false);
            }, 500);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // const onFinish: FormProps<FormType>['onFinish'] = async (values) => {
    //     const { address, name, gender, email, phoneNumber } = values;
    // };

    return (
        <div>
            <div
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpenModal(true);
                }}
                role="presentation"
                style={{ width: '200px', zIndex: '20' }}
            >
                Sửa
            </div>

            <Modal
                cancelText="Trở lại"
                centered
                closable={!isPending}
                maskClosable={false}
                okText="Chỉnh sửa"
                onCancel={() => setIsOpenModal(false)}
                onOk={() => mutate()}
                open={isOpenModal}
                width={600}
            >
                <Spin spinning={isPending}>
                    <div className="max-h-[75vh] overflow-auto px-5">
                        <Form
                            disabled={isPending}
                            form={form}
                            layout="vertical"
                        >
                            <div className="grid grid-cols-2 gap-x-10">
                                <Form.Item<FormType>
                                    label="Người nhận"
                                    name="name"
                                >
                                    <Input size="large" />
                                </Form.Item>
                                <Form.Item<FormType>
                                    label="Giới tính"
                                    name="gender"
                                >
                                    <Input size="large" />
                                </Form.Item>
                                <Form.Item<FormType> label="Email" name="email">
                                    <Input size="large" />
                                </Form.Item>
                                <Form.Item<FormType> label="Email" name="email">
                                    <Input size="large" />
                                </Form.Item>
                                <Form.Item<FormType>
                                    label="Số điện thoại"
                                    name="phoneNumber"
                                >
                                    <Input size="large" />
                                </Form.Item>
                                <Form.Item<FormType>
                                    label="Địa chỉ"
                                    name="address"
                                >
                                    <Input size="large" />
                                </Form.Item>
                            </div>

                            <Form.Item>
                                <Button htmlType="submit" type="primary" />
                            </Form.Item>
                        </Form>
                    </div>
                </Spin>
            </Modal>
        </div>
    );
};

export default EditOrderModal;
