import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Layout,
    Radio,
    Row,
    Select,
    Space,
} from 'antd';
import Link from 'next/link';
import type { RadioChangeEvent } from 'antd';
import { useState } from 'react';

const { Content, Sider } = Layout;

const CartContact = () => {
    const genderOptions = {
        MALE: 'Male',
        FEMALE: 'Female',
    };

    const [value, setValue] = useState(1);

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };
    return (
        <Layout>
            <Content style={{ padding: '0 48px' }}>
                <Layout style={{ padding: '24px 0' }}>
                    <Sider width={200}>
                        <p>Sider</p>
                    </Sider>
                    <Content>
                        <Row gutter={16}>
                            <Col span={10}>
                                <Card
                                    bordered={false}
                                    title={
                                        <div className="font-bold">
                                            Thông tin mua hàng
                                        </div>
                                    }
                                >
                                    <div className="max-h-[75vh] overflow-auto px-5">
                                        <Form>
                                            <Form.Item
                                                name="name"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Họ và tên không được để trống!',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Họ và tên" />
                                            </Form.Item>

                                            <Form.Item
                                                name="email"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Email không được để trống!',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Email" />
                                            </Form.Item>
                                            <Form.Item name="gender">
                                                <Select
                                                    placeholder="Giới tính"
                                                    size="large"
                                                >
                                                    {Object.values(
                                                        genderOptions
                                                    ).map((item: string) => (
                                                        <Select.Option
                                                            key={Object.values(
                                                                genderOptions
                                                            ).indexOf(item)}
                                                            value={
                                                                Object.keys(
                                                                    genderOptions
                                                                )[
                                                                    Object.values(
                                                                        genderOptions
                                                                    ).indexOf(
                                                                        item
                                                                    )
                                                                ]
                                                            }
                                                        >
                                                            {item}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
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
                                                <Input
                                                    placeholder="Số điện thoại"
                                                    size="large"
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name="address"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Địa chỉ không được để trống!',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Địa chỉ" />
                                            </Form.Item>
                                            <Form.Item
                                                name="Note"
                                                rules={[
                                                    {
                                                        max: 1000,
                                                        message:
                                                            'Brief Infomation must be less than 100 characters!',
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea
                                                    placeholder="Ghi chú"
                                                    rows={5}
                                                />
                                            </Form.Item>

                                            <Form.Item>
                                                <Button
                                                    htmlType="submit"
                                                    type="primary"
                                                >
                                                    Submit
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card
                                    bordered={false}
                                    title={
                                        <div className="font-bold">
                                            Hình thức thanh toán
                                        </div>
                                    }
                                >
                                    <Radio.Group
                                        onChange={onChange}
                                        value={value}
                                    >
                                        <Space direction="vertical">
                                            <Radio className="mb-2" value={1}>
                                                <div className="font-semibold ">
                                                    Thanh toán khi nhận
                                                    hàng(COD)
                                                </div>
                                            </Radio>
                                            <Radio value={2}>
                                                <div className="font-semibold">
                                                    Thanh toán qua VNPAY-QR
                                                </div>
                                            </Radio>
                                        </Space>
                                    </Radio.Group>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    bordered={false}
                                    title={
                                        <div className="font-bold">
                                            Đơn hàng
                                        </div>
                                    }
                                >
                                    <Card className="m-2">
                                        <Content>
                                            <Row gutter={16}>
                                                <Col span={6}>
                                                    <div>anh</div>
                                                </Col>
                                                <Col span={6}>
                                                    <div className="text-lg font-semibold">
                                                        ten
                                                    </div>
                                                </Col>
                                                <Col span={6}>
                                                    <div className="font-semibol text-lg">
                                                        x1
                                                    </div>
                                                </Col>
                                                <Col span={6}>
                                                    <div className="font-semibol text-lg">
                                                        1000
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Content>
                                    </Card>
                                    <Card className="m-2">
                                        <Content>
                                            <Row gutter={16}>
                                                <Col span={6}>
                                                    <div>anh</div>
                                                </Col>
                                                <Col span={6}>
                                                    <div>ten</div>
                                                </Col>
                                                <Col span={6}>
                                                    <div>x1</div>
                                                </Col>
                                                <Col span={6}>
                                                    <div>1000</div>
                                                </Col>
                                            </Row>
                                        </Content>
                                    </Card>
                                    <div className="text-end text-xl font-bold">
                                        Tổng đơn hàng: 10000000
                                    </div>
                                    <div className="m-10 flex justify-evenly">
                                        <div>
                                            <Link href="/product">
                                                <Button
                                                    block
                                                    size="large"
                                                    style={{ marginBottom: 20 }}
                                                    type="primary"
                                                >
                                                    Continue
                                                </Button>
                                            </Link>
                                        </div>
                                        <div>
                                            <Button
                                                block
                                                size="large"
                                                type="primary"
                                            >
                                                Checkout
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    );
};

export default CartContact;
