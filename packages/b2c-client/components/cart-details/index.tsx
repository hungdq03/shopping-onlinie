import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Checkbox, Col, Layout, Row, Spin } from 'antd';
import { QueryResponseType } from 'common/types';
import { Cart } from 'common/types/cart';
import * as request from 'common/utils/http-request';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { currencyFormatter } from 'common/utils/formatter';
import { useRouter } from 'next/router';
import DeleteCartProductFormModal from './delete-cart-product';
import { useAuth } from '~/hooks/useAuth';
import useCartStore from '~/hooks/useCartStore';

const { Content, Sider } = Layout;

const CartDetails = () => {
    const auth = useAuth();
    const router = useRouter();
    const { query } = useRouter();

    const itemKeysQuery = query.itemKeys as string;
    const [selectedItems, setSelectedItems] = useState<
        {
            id: string;
            quantity: string;
        }[]
    >([]);

    const {
        data: cartData,
        isLoading: isCartLoading,
        refetch: refetchCart,
    } = useQuery<QueryResponseType<Cart>>({
        queryKey: ['cart'],
        queryFn: () => {
            if (auth) {
                return request.get('cart').then((res) => res.data);
            }
            return Promise.resolve({ data: null }); // Return a dummy response or handle as needed
        },
        enabled: !!auth, // Only fetch data when auth is true
    });

    const { mutate: updateCartTrigger } = useMutation({
        mutationFn: ({ id, quantity }: { id: string; quantity: number }) => {
            return request
                .put(`cart/updateQuantity/${id}`, { quantity })
                .then((res) => res.data);
        },
    });

    const { mutate: addCart } = useMutation({
        mutationFn: async (dataAddCart: {
            productId: string;
            quantity: number;
        }) => {
            return request.post('/cart/add', dataAddCart);
        },
        onSuccess: () => {
            refetch();
        },
    });

    // const { mutate: updateOrder } = useMutation({
    //     mutationFn: async (dataOrder: {
    //         quantity: number;
    //         originalPrice: number;
    //         discountPrice: number;
    //         totalPrice: number;
    //         thumbnail: string;
    //         brand: string;
    //         size: number;
    //         category: string;
    //         productId: string;
    //         productName: string;
    //     }) => {
    //         return request.post(`/my-order/update/${query.orderId}`, dataOrder);
    //     },
    //     onSuccess: () => {
    //         push('/my-page/my-order');
    //     },
    // });

    // Initialize cartItems from localStorage or default to empty array
    const [cartItems, setCartItems] = useState<Cart[]>([]);
    const {
        data: cartStorage,
        deleteProduct,
        updateProductQuantity,
    } = useCartStore();

    useEffect(() => {
        if (auth) {
            if (cartData?.data) {
                setCartItems(cartData.data);
            }
        } else {
            setCartItems(cartStorage);
        }
    }, [cartData, cartStorage, auth]);

    const updateCartQuantity = (id: string, type: 'plus' | 'minus') => {
        const updatedCartItems = cartItems.map((item) => {
            if (item.id === id) {
                let newQuantity =
                    type === 'plus'
                        ? (item.quantity ?? 0) + 1
                        : (item.quantity ?? 0) - 1;
                // Ensure quantity doesn't go below 1
                newQuantity = Math.max(newQuantity, 1);
                updateCartTrigger({
                    id: id || '',
                    quantity: newQuantity,
                });
                return { ...item, quantity: newQuantity };
            }

            return item;
        });

        setCartItems(updatedCartItems); // Update state
        // localStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Update localStorage
    };

    const totalPrice = cartItems.reduce(
        (total, item) =>
            total +
            (item.quantity ?? 0) *
                (item.product?.discount_price ??
                    item.product?.original_price ??
                    0),
        0
    );

    useEffect(() => {
        if (itemKeysQuery) {
            const product = itemKeysQuery.split(',');
            product.forEach((e: string) => {
                const [id, quantity] = e.split(':');

                if (!cartItems.some((item) => item.product?.id === id)) {
                    addCart({
                        productId: id,
                        quantity: Number(quantity),
                    });
                    refetch();
                }

                setSelectedItems((prevSelectedItems) => [
                    ...prevSelectedItems,
                    { id, quantity },
                ]);
            });
        }
    }, [itemKeysQuery]);

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setSelectedItems((prevSelectedItems) => {
            if (checked) {
                return [...prevSelectedItems, { id, quantity: '1' }];
            }
            return prevSelectedItems.filter((item) => item.id !== id);
        });
    };

    // const handleCheckout = () => {
    //     selectedItems.forEach((item) => {
    //         cartItems.map((cart) => {
    //             if (cart.product?.id === item.id) {
    //                 updateOrder({
    //                     quantity: Number(cart.quantity),
    //                     originalPrice: cart.product?.original_price ?? 0,
    //                     discountPrice: cart.product?.discount_price ?? 0,
    //                     totalPrice: cart.product?.discount_price ?? 0,
    //                     thumbnail: cart.product?.thumbnail ?? '',
    //                     brand: cart.product?.brand?.name ?? '',
    //                     size: cart.product?.size ?? 0,
    //                     category: cart.product?.category?.name ?? '',
    //                     productId: cart.product?.id ?? '',
    //                     productName: cart.product?.name ?? '',
    //                 });
    //             }
    //         });
    //     });
    // };

    return (
        <Spin spinning={isCartLoading}>
            <Layout>
                <Content style={{ padding: '0 48px' }}>
                    <Layout style={{ padding: '24px 0' }}>
                        <Sider width={200}>
                            <p>Sider</p>
                        </Sider>
                        <Content>
                            <Row gutter={16}>
                                <Col span={16}>
                                    {cartItems.map((item) => (
                                        <Layout key={item.id}>
                                            <Card
                                                bordered={false}
                                                extra={
                                                    auth ? (
                                                        <DeleteCartProductFormModal
                                                            cartId={
                                                                item.id ?? ''
                                                            }
                                                            productId={
                                                                item.product
                                                                    ?.id ?? ''
                                                            }
                                                            reload={refetchCart}
                                                        />
                                                    ) : (
                                                        <Button
                                                            danger
                                                            icon={
                                                                <DeleteOutlined />
                                                            }
                                                            onClick={() =>
                                                                deleteProduct(
                                                                    item.productId ??
                                                                        ''
                                                                )
                                                            }
                                                        />
                                                    )
                                                }
                                                style={{
                                                    marginBottom: 10,
                                                    marginLeft: 10,
                                                }}
                                                title={
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={selectedItems.some(
                                                                (e) =>
                                                                    e.id ===
                                                                    item.product
                                                                        ?.id
                                                            )}
                                                            onChange={(e) =>
                                                                handleCheckboxChange(
                                                                    item.product
                                                                        ?.id ??
                                                                        '',
                                                                    e.target
                                                                        .checked
                                                                )
                                                            }
                                                            value={
                                                                item.product?.id
                                                            }
                                                        />
                                                        {` Mã sản phẩm: ${auth ? item.product?.id : item.productId}`}
                                                    </div>
                                                }
                                            >
                                                <Content>
                                                    <Row gutter={16}>
                                                        <Col span={6}>
                                                            <div
                                                                style={{
                                                                    height: 150,
                                                                }}
                                                            >
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
                                                        <Col span={8}>
                                                            <div className="relative flex justify-center text-xl font-semibold">
                                                                {
                                                                    item.product
                                                                        ?.name
                                                                }
                                                            </div>
                                                            <div className="relative top-2 flex justify-center">
                                                                <div>
                                                                    <div className="text-center">
                                                                        Quantity
                                                                    </div>
                                                                    <div
                                                                        className="max-sm: relative top-1 flex border-spacing-2 justify-evenly backdrop-brightness-90"
                                                                        style={{
                                                                            borderRadius: 10,
                                                                            width: 100,
                                                                        }}
                                                                    >
                                                                        <Button
                                                                            block
                                                                            icon={
                                                                                <MinusOutlined />
                                                                            }
                                                                            onClick={() =>
                                                                                auth
                                                                                    ? updateCartQuantity(
                                                                                          item.id ??
                                                                                              '',
                                                                                          'plus'
                                                                                      )
                                                                                    : updateProductQuantity(
                                                                                          {
                                                                                              productId:
                                                                                                  item.productId ??
                                                                                                  '',
                                                                                              quantity:
                                                                                                  (item.quantity ??
                                                                                                      0) -
                                                                                                  1,
                                                                                          }
                                                                                      )
                                                                            }
                                                                        />
                                                                        <span className="mx-2 flex items-center">
                                                                            {item.quantity ??
                                                                                0}
                                                                        </span>
                                                                        <Button
                                                                            block
                                                                            icon={
                                                                                <PlusOutlined />
                                                                            }
                                                                            // onClick={() =>
                                                                            //     updateCartQuantity(
                                                                            //         item.id ??
                                                                            //             '',
                                                                            //         'plus'
                                                                            //     )
                                                                            // }
                                                                            onClick={() =>
                                                                                auth
                                                                                    ? updateCartQuantity(
                                                                                          item.id ??
                                                                                              '',
                                                                                          'plus'
                                                                                      )
                                                                                    : updateProductQuantity(
                                                                                          {
                                                                                              productId:
                                                                                                  item.productId ??
                                                                                                  '',
                                                                                              quantity:
                                                                                                  (item.quantity ??
                                                                                                      0) +
                                                                                                  1,
                                                                                          }
                                                                                      )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col span={8}>
                                                            <div
                                                                style={{
                                                                    marginTop: 38,
                                                                }}
                                                            >
                                                                <div className="flex justify-evenly">
                                                                    <div>
                                                                        <div>
                                                                            Price
                                                                        </div>
                                                                        <div className="text-lg font-semibold">
                                                                            {currencyFormatter(
                                                                                item
                                                                                    .product
                                                                                    ?.discount_price ??
                                                                                    item
                                                                                        .product
                                                                                        ?.original_price ??
                                                                                    0
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div>
                                                                            Total
                                                                        </div>
                                                                        <div className="text-lg font-semibold">
                                                                            {currencyFormatter(
                                                                                (item.quantity ??
                                                                                    0) *
                                                                                    (item
                                                                                        .product
                                                                                        ?.discount_price ??
                                                                                        item
                                                                                            .product
                                                                                            ?.original_price ??
                                                                                        0)
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
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
                                        title={
                                            <div>
                                                Total Price:
                                                <span>
                                                    {currencyFormatter(
                                                        totalPrice
                                                    )}
                                                </span>
                                            </div>
                                        }
                                    >
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
                                        <Button
                                            block
                                            onClick={() =>
                                                router.push('/cart-contact')
                                            }
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
        </Spin>
    );
};

export default CartDetails;
