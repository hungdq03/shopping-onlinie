import React from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Col, Layout, Row } from 'antd';

const { Content, Sider } = Layout;

const CartDetails = () => {
    return (
        <div>
            <Layout>
                <Content style={{ padding: '0 48px' }}>
                    <Layout
                        style={{
                            padding: '24px 0',
                        }}
                    >
                        <Sider width={200}>
                            <p>Sider</p>
                        </Sider>

                        <Content>
                            <Row gutter={16}>
                                <Col span={16}>
                                    <Layout>
                                        <Card
                                            bordered={false}
                                            extra={<DeleteOutlined />}
                                            style={{
                                                marginBottom: 10,
                                                marginLeft: 10,
                                            }}
                                            title="Product ID:"
                                        >
                                            <Content>
                                                <Row gutter={16}>
                                                    <Col span={6}>
                                                        <div>
                                                            <p>Thumbnail</p>
                                                        </div>
                                                    </Col>
                                                    <Col span={10}>
                                                        <div>
                                                            <p>Product Name</p>
                                                        </div>
                                                        <div>
                                                            <p>Quantity</p>
                                                        </div>
                                                    </Col>
                                                    <Col span={8}>
                                                        <div>
                                                            <p>Price</p>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Content>
                                        </Card>
                                        <Card
                                            bordered={false}
                                            extra={<DeleteOutlined />}
                                            style={{
                                                marginBottom: 10,
                                                marginLeft: 10,
                                            }}
                                            title="Product ID:"
                                        >
                                            <Content>
                                                <Row gutter={16}>
                                                    <Col span={6}>
                                                        <div>
                                                            <p>Thumbnail</p>
                                                        </div>
                                                    </Col>
                                                    <Col span={10}>
                                                        <div>
                                                            <p>Product Name</p>
                                                        </div>
                                                        <div>
                                                            <p>Quantity</p>
                                                        </div>
                                                    </Col>
                                                    <Col span={8}>
                                                        <div>
                                                            <p>Price</p>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Content>
                                        </Card>
                                    </Layout>
                                </Col>
                                <Col span={8}>
                                    <Card bordered={false} title="Total Price">
                                        <Button
                                            block
                                            size="large"
                                            style={{ marginBottom: 20 }}
                                            type="primary"
                                        >
                                            Continue
                                        </Button>
                                        <Button
                                            block
                                            size="large"
                                            type="primary"
                                        >
                                            Checkout
                                        </Button>
                                    </Card>
                                </Col>
                            </Row>
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        </div>
    );
};

export default CartDetails;
