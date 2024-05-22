/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/naming-convention */
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import {
    Button,
    DatePicker,
    Form,
    FormProps,
    Input,
    Modal,
    Select,
    Tooltip,
    Upload,
    UploadFile,
} from 'antd';
import { RcFile } from 'antd/es/upload';
import * as request from 'common/utils/http-request';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
    type: 'CREATE' | 'UPDATE';
    title: string;
    reload: () => void;
    userId?: string;
};

type FormType = {
    name: string;
    email: string;
    image: UploadFile[];
    role: string;
    gender: string;
    dob: string;
    phone: string;
    address: string;
    status: string;
};

type UserRequestType = {
    name: string;
    email: string;
    image: string;
    gender: string;
    role: string;
    dob: string;
    phone: string;
    address: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserFormModal: React.FC<Props> = ({ type, title, reload, userId }) => {
    const genderOptions = {
        MALE: 'Male',
        FEMALE: 'Female',
    };

    const roleOptions = {
        USER: 'User',
        ADMIN: 'Admin',
        SELLER: 'Seller',
        MARKETER: 'Marketer',
    };

    const [form] = Form.useForm();

    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

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

    const { mutate: createUser, isPending: createUserIsPending } = useMutation({
        mutationFn: (data: UserRequestType) => {
            return request.post('user/create', data).then((res) => res.data);
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
        const { name, email, image, role, gender, dob, phone, address } =
            values;

        const avatar = image?.map((file) => file.originFileObj);
        const imageResponse = await uploadFileTrigger(
            (avatar as RcFile[]) ?? []
        )?.then((res) => res.imageUrls);

        createUser({
            name,
            email,
            role,
            gender,
            dob,
            phone,
            address,
            image: imageResponse[0] ?? '',
        });
    };

    return (
        <div>
            {button}
            <Modal
                closable={!uploadFileIsPending || !createUserIsPending}
                footer={false}
                maskClosable={false}
                onCancel={() => setIsOpenModal(false)}
                open={isOpenModal}
                title={title}
                width={800}
            >
                <div className="max-h-[75vh] overflow-auto px-5">
                    <Form
                        disabled={uploadFileIsPending || createUserIsPending}
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <div className="grid grid-cols-2 gap-x-10">
                            <Form.Item<FormType>
                                label="Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'User name must be required!',
                                    },
                                ]}
                            >
                                <Input size="large" />
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email!',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Please enter a valid email!',
                                    },
                                ]}
                            >
                                <Input size="large" />
                            </Form.Item>
                            <Form.Item
                                label="Phone number"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please input your phone number!',
                                    },
                                    {
                                        pattern:
                                            /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                                        message:
                                            'Please enter a valid phone number!',
                                    },
                                ]}
                            >
                                <Input size="large" />
                            </Form.Item>
                            <Form.Item<FormType>
                                label="Role"
                                name="role"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Role must be required!',
                                    },
                                ]}
                            >
                                <Select size="large">
                                    {Object.values(roleOptions).map(
                                        (item: string) => (
                                            <Select.Option
                                                key={Object.values(
                                                    roleOptions
                                                ).indexOf(item)}
                                                value={
                                                    Object.keys(roleOptions)[
                                                        Object.values(
                                                            roleOptions
                                                        ).indexOf(item)
                                                    ]
                                                }
                                            >
                                                {item}
                                            </Select.Option>
                                        )
                                    )}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Address" name="address">
                                <Input size="large" />
                            </Form.Item>
                            <Form.Item<FormType> label="Gender" name="gender">
                                <Select size="large">
                                    {Object.values(genderOptions).map(
                                        (item: string) => (
                                            <Select.Option
                                                key={Object.values(
                                                    genderOptions
                                                ).indexOf(item)}
                                                value={
                                                    Object.keys(genderOptions)[
                                                        Object.values(
                                                            genderOptions
                                                        ).indexOf(item)
                                                    ]
                                                }
                                            >
                                                {item}
                                            </Select.Option>
                                        )
                                    )}
                                </Select>
                            </Form.Item>
                            <Form.Item<FormType>
                                label="Date of birth"
                                name="dob"
                            >
                                <DatePicker
                                    size="large"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </div>
                        <Form.Item<FormType>
                            getValueFromEvent={normFile}
                            label="Avatar"
                            name="image"
                            valuePropName="image"
                        >
                            <Upload
                                accept=".png, .jpg, .jpeg"
                                beforeUpload={() => false}
                                listType="picture-card"
                                maxCount={1}
                                name="image"
                            >
                                <button
                                    style={{
                                        border: 0,
                                        background: 'none',
                                    }}
                                    type="button"
                                >
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                htmlType="submit"
                                loading={createUserIsPending}
                                type="primary"
                            >
                                Create
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

UserFormModal.defaultProps = {
    userId: undefined,
};

export default UserFormModal;
