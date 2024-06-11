import React from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Col, Layout, Row, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import * as request from 'common/utils/http-request';
import { Cart } from 'common/types/cart';
import { QueryResponseType } from 'common/types';
import Image from 'next/image';

const { Content, Sider } = Layout;

const CartDetails = () => {
    const { data, isLoading } = useQuery<QueryResponseType<Cart>>({
        queryKey: ['cart'],
        queryFn: () => request.get('cart').then((res) => res.data),
    });

    return (
        <Spin spinning={isLoading}>
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
                                        {data?.data?.map((item) => (
                                            <Layout>
                                                <Card
                                                    bordered={false}
                                                    extra={<DeleteOutlined />}
                                                    style={{
                                                        marginBottom: 10,
                                                        marginLeft: 10,
                                                    }}
                                                    title={item.product?.id}
                                                >
                                                    <Content>
                                                        <Row gutter={16}>
                                                            <Col span={6}>
                                                                <div>
                                                                    <Image
                                                                        alt={
                                                                            item.id ??
                                                                            ''
                                                                        }
                                                                        className="shadow-lg"
                                                                        layout="fill"
                                                                        objectFit="cover"
                                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${item.product?.thumbnail}`}
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col span={10}>
                                                                <div>
                                                                    <p>
                                                                        {
                                                                            item
                                                                                .product
                                                                                ?.name
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p>
                                                                        {
                                                                            item
                                                                                .product
                                                                                ?.quantity
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </Col>
                                                            <Col span={8}>
                                                                <div>
                                                                    <p>
                                                                        Price:{' '}
                                                                        {
                                                                            item
                                                                                .product
                                                                                ?.discount_price
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Content>
                                                </Card>
                                            </Layout>
                                        ))}
                                    </Col>
                                    <Col span={8}>
                                        <Card
                                            bordered={false}
                                            title="Total Price"
                                        >
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
        </Spin>
    );
};

export default CartDetails;
