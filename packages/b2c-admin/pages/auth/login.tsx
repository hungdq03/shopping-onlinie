import { useMutation } from '@tanstack/react-query';
import {
    Button,
    Checkbox,
    Form,
    FormProps,
    Input,
    notification,
    Space,
    Spin,
} from 'antd';
import { post } from 'common/utils/http-request';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';

const Login = () => {
    const router = useRouter();
    type FieldType = {
        email?: string;
        password?: string;
        remember?: string;
    };

    // notification
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (msg: string) => {
        api.destroy();
        const key = `open${Date.now()}`;
        const btn = (
            <Space>
                <Button
                    className="bg-[#4096ff]"
                    onClick={() => api.destroy(key)}
                    size="small"
                    type="primary"
                >
                    Confirm
                </Button>
            </Space>
        );
        api.info({
            message: msg,
            placement: 'top',
            role: 'status',
            btn,
            key,
        });
    };

    const mutation = useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            return post('/auth/admin/login', data).then((res) => res.data);
        },
        onError: (error) => {
            openNotification(error.message);
        },
        onSuccess: (data) => {
            // Handle the response data
            Cookie.set('cmsUser', JSON.stringify(data.data));
            router.reload();
        },
    });

    const onFinish: FormProps<FieldType>['onFinish'] = (values: FieldType) => {
        mutation.mutate({
            email: values.email ?? '',
            password: values.password ?? '',
        });
    };

    return (
        <div>
            {mutation.isPending && mutation.isSuccess ? (
                <Spin
                    fullscreen
                    spinning={(mutation as { isPending: boolean }).isPending}
                />
            ) : (
                <>
                    {contextHolder}
                    <div className="flex h-dvh w-dvw flex-col items-center justify-center">
                        <div className="flex h-[600px] min-w-[400px] items-center justify-center rounded-lg border-2 border-solid border-sky-500 p-4 ">
                            <Form
                                className="no-scrollbar w-full overflow-auto"
                                initialValues={{ remember: true }}
                                labelCol={{ span: 8 }}
                                layout="vertical"
                                onFinish={onFinish}
                                style={{ maxWidth: 600 }}
                            >
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please input your username!',
                                        },
                                    ]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please input your password!',
                                        },
                                    ]}
                                >
                                    <Input.Password size="large" />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    name="remember"
                                    valuePropName="checked"
                                >
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        className="bg-[#4096ff]"
                                        htmlType="submit"
                                        type="primary"
                                    >
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Login;
