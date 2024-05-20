import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Form, FormProps, Input, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import * as request from 'common/utils/http-request';
import { toast } from 'react-toastify';

type Props = {
    button: JSX.Element;
    title: string;
    sliderId?: string;
    reloadList: () => void;
};
type FormType = { name?: string };

const SliderModal: React.FC<Props> = ({
    button,
    title,
    sliderId,
    reloadList,
}) => {
    const [form] = Form.useForm<FormType>();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const { isLoading, data, error } = useQuery({
        queryKey: ['slider-detail'],
        queryFn: () =>
            request.get(`slider/${sliderId}`).then((res) => res.data),
        enabled: Boolean(sliderId) && isOpenModal,
    });
    const { mutate: updateSliderTrigger, isPending: updateSliderPending } =
        useMutation({
            mutationFn: (slider: { id: string; name: string }) => {
                return request.put(`/slider/update/${slider.id}`, {
                    name: slider.name,
                });
            },
            onSuccess: async (res) => {
                toast.success(res.data.message);
                setTimeout(() => {
                    setIsOpenModal(false);
                    reloadList();
                }, 500);
            },
            onError: () => {
                toast.error('Update slider failed!');
            },
        });
    const { mutate: createSliderTrigger, isPending: createSliderPending } =
        useMutation({
            mutationFn: (slider: { name: string }) => {
                return request.post('/slider/create', {
                    name: slider.name,
                });
            },
            onSuccess: async (res) => {
                toast.success(res.data.message);
                setTimeout(() => {
                    setIsOpenModal(false);
                    reloadList();
                }, 500);
            },
            onError: () => {
                toast.error('Create slider failed!');
            },
        });
    useEffect(() => {
        if (sliderId) {
            form.setFieldsValue({ name: data?.data?.name });
        } else {
            form.resetFields();
        }
    }, [data, sliderId]);
    const onFinish: FormProps<FormType>['onFinish'] = (values) => {
        if (sliderId) {
            return updateSliderTrigger({
                id: sliderId,
                name: values.name || '',
            });
        }
        return createSliderTrigger({ name: values.name || '' });
    };

    return (
        <>
            <div onClick={() => setIsOpenModal(true)} role="presentation">
                {button}
            </div>
            <Modal
                closable={!updateSliderPending || !createSliderPending}
                footer={false}
                maskClosable={false}
                onCancel={() => setIsOpenModal(false)}
                open={isOpenModal}
                title={title}
            >
                <Spin spinning={isLoading}>
                    {error ? (
                        <div>Something went wrong!</div>
                    ) : (
                        <Form
                            className="flex flex-col gap-2"
                            disabled={
                                updateSliderPending || createSliderPending
                            }
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input name!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    htmlType="submit"
                                    loading={
                                        updateSliderPending ||
                                        createSliderPending
                                    }
                                    type="primary"
                                >
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    )}
                </Spin>
            </Modal>
        </>
    );
};

SliderModal.defaultProps = {
    sliderId: undefined,
};
export default SliderModal;
