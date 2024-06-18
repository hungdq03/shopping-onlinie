import { Button, Card, Col, Layout, Radio, Row, Space } from 'antd';
import Link from 'next/link';
import type { RadioChangeEvent } from 'antd';
import { useState } from 'react';
import UserDetailAll from './user-contact';

const { Content, Sider } = Layout;

const CartContact = () => {
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
                                <UserDetailAll />
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
                                                    style={{
                                                        marginBottom: 20,
                                                    }}
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
