import { LeftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Image, Layout, Spin } from 'antd';
import {
    gender,
    Order,
    orderPaymentMethod,
    orderStatus,
} from 'common/types/order';
import { currencyFormatter } from 'common/utils/formatter';
import { getImageUrl } from 'common/utils/getImageUrl';
import request from 'common/utils/http-request';
import moment from 'moment';
import { useRouter } from 'next/router';
import styles from '~/styles/Products.module.css';
import DeleteOrderAlert from './delete-order-alert';

const OrderDetail = () => {
    const { query, back } = useRouter();
    const { data: orderDetail, isLoading } = useQuery<Order>({
        queryKey: ['order-deta  il'],
        queryFn: () =>
            request
                .get(`/order-detail/${query.id}`)
                .then((res) => res.data)
                .then((res) => res.data),
    });

    return (
        <Layout className={styles.container}>
            <Spin spinning={isLoading}>
                <div className="flex w-full justify-center">
                    <div className="m-4 flex w-[1000px] flex-col gap-6 rounded-lg bg-white px-4 text-base">
                        <div className="flex w-full justify-between border-b-2 border-solid border-slate-200 py-4 text-lg">
                            <div
                                className="flex cursor-pointer items-center gap-2 "
                                onClick={() => back()}
                                role="presentation"
                            >
                                <LeftOutlined style={{ scale: '1.5' }} />
                                <span>Trở lại</span>
                            </div>
                            <div className="flex items-center gap-4 ">
                                <span>
                                    Mã đơn hàng:
                                    <span className=" ml-1">
                                        {orderDetail?.id}
                                    </span>
                                </span>
                                <span className=" text-gray-400">|</span>
                                <span>
                                    Trạng thái đơn hàng:
                                    <span className="text-primary ml-1">
                                        {
                                            orderStatus[
                                                orderDetail?.status as keyof typeof orderStatus
                                            ]
                                        }
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className=" flex items-center justify-between rounded-lg bg-orange-100 p-4">
                            <div>
                                <span className="text-lg">
                                    Ngày đặt hàng:
                                    <span className="text-primary ml-1">
                                        {moment(orderDetail?.createdAt).format(
                                            'YYYY-MM-DD'
                                        )}
                                    </span>
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {orderDetail?.status === 'PENDING' && (
                                    <>
                                        <Button
                                            size="large"
                                            style={{
                                                width: '200px',
                                            }}
                                            type="primary"
                                        >
                                            Cập nhật đơn hàng
                                        </Button>
                                        {/* <Button
                                            size="large"
                                            style={{
                                                width: '200px',
                                            }}
                                        >
                                            Huỷ đơn hàng
                                        </Button> */}
                                        {orderDetail &&
                                            orderDetail.orderDetail && (
                                                <DeleteOrderAlert
                                                    orderId={
                                                        orderDetail.id ?? ''
                                                    }
                                                    productName={
                                                        orderDetail?.orderDetail
                                                            ?.map(
                                                                (e) =>
                                                                    e.productName
                                                            )
                                                            .filter(
                                                                (name) =>
                                                                    name !==
                                                                    null
                                                            ) as string[]
                                                    }
                                                />
                                            )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Thông tin nhận hàng */}
                        <div className="flex items-center justify-center gap-20 divide-x-2 divide-solid divide-slate-500">
                            <span className="text-xl font-bold">
                                Thông tin nhận hàng
                            </span>
                            <div className="px-8 text-lg">
                                <p>
                                    Người nhận:{' '}
                                    <span className=" ml-1">
                                        {orderDetail?.name}
                                    </span>
                                </p>
                                <p>
                                    Giới tính:{' '}
                                    <span className=" ml-1">
                                        {
                                            gender[
                                                orderDetail?.gender as keyof typeof gender
                                            ]
                                        }
                                    </span>
                                </p>
                                <p>
                                    Email:{' '}
                                    <span className=" ml-1">
                                        {orderDetail?.email}
                                    </span>
                                </p>
                                <p>
                                    Số điện thoại:{' '}
                                    <span className=" ml-1">
                                        {orderDetail?.phoneNumber}
                                    </span>
                                </p>
                                <p>
                                    Địa chỉ:{' '}
                                    <span className=" ml-1">
                                        {orderDetail?.address}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Sản phẩm  */}
                        <div className="">
                            {orderDetail?.orderDetail?.map((detail) => (
                                <Card
                                    className="my-2"
                                    hoverable
                                    key={detail.id}
                                >
                                    <div className=" flex h-full items-center">
                                        <Image
                                            className="pr-4"
                                            height={80}
                                            preview={false}
                                            src={getImageUrl(
                                                detail.thumbnail
                                                    ? detail.thumbnail
                                                    : ''
                                            )}
                                        />
                                        <div className="flex h-full w-full justify-between">
                                            <div className="flex-col gap-8">
                                                <p className="text-xl">
                                                    {detail.productName}
                                                </p>
                                                <p className="text-base text-gray-500">
                                                    Phân loại hàng:{' '}
                                                    {detail?.category},{' '}
                                                    {detail?.size}
                                                    ml
                                                </p>
                                                <p className="text-base ">
                                                    x {detail?.quantity}
                                                </p>
                                            </div>
                                            <div className="flex  items-center justify-center gap-8">
                                                <div className="flex gap-2 text-base">
                                                    <span
                                                        className={
                                                            detail?.discountPrice
                                                                ? 'text-gray-400 line-through'
                                                                : ''
                                                        }
                                                    >
                                                        {detail?.originalPrice &&
                                                            currencyFormatter(
                                                                Number(
                                                                    detail?.originalPrice
                                                                )
                                                            )}
                                                    </span>
                                                    <span>
                                                        {detail?.discountPrice &&
                                                            currencyFormatter(
                                                                Number(
                                                                    detail?.discountPrice
                                                                )
                                                            )}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col gap-4">
                                                    <Button
                                                        size="large"
                                                        style={{
                                                            width: '140px',
                                                        }}
                                                        type="primary"
                                                    >
                                                        Mua lại
                                                    </Button>
                                                    <Button
                                                        size="large"
                                                        style={{
                                                            width: '140px',
                                                        }}
                                                        type="primary"
                                                    >
                                                        Đánh giá
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Thành tiền */}
                        <div className="flex flex-col items-end pb-4">
                            <div className="grid grid-cols-2 justify-items-end gap-x-2">
                                <span>Thành tiền:</span>
                                <span className="text-primary text-lg">
                                    {currencyFormatter(
                                        Number(orderDetail?.totalAmount)
                                    )}
                                </span>
                                <span>Phương thức thanh toán:</span>
                                <span className="">
                                    {
                                        orderPaymentMethod[
                                            orderDetail?.paymentMethod as keyof typeof orderPaymentMethod
                                        ]
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        </Layout>
    );
};

export default OrderDetail;
