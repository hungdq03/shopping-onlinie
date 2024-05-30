import React, { useMemo } from 'react';
import { Image } from 'antd';
import moment from 'moment';
import { Slider } from '~/types/slider';

type InfoItemProps = {
    render?: 'IMAGE';
    title?: string;
    value?: string | number | boolean | null;
};

const InfoItem: React.FC<InfoItemProps> = ({
    title,
    value,
    render,
}) => {
    const renderValue = useMemo(() => {
        switch (render) {
            case 'IMAGE':
                return (
                    <Image
                        alt=""
                        className="rounded-md border"
                        height={120}
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${value}`}
                        width={120}
                    />
                );

            default:
                return value;
        }
    }, [value, render, title]);

    return (
        <div className="grid grid-cols-8 space-x-10 border-b py-4">
            <div className="col-span-2 text-end text-lg font-bold">{title}</div>
            <div className="col-span-6">{renderValue}</div>
        </div>
    );
};

const SliderDetailAll: React.FC<{ data?: Slider }> = ({ data }) => {
    return (
        <div>
            <InfoItem title="Slider ID" value={data?.id} />
            <InfoItem title="Title" value={data?.title} />
            <InfoItem title="Description" value={data?.description} />
            <InfoItem key="image" render="IMAGE" title="Image" value={data?.image} />
            <InfoItem
                key="createdAt"
                title="Create At"
                value={
                    data?.createdAt &&
                    moment(data?.createdAt).format('YYYY-MMM-DD')
                }
            />
            <InfoItem
                key="updatedAt"
                title="Update At"
                value={
                    data?.updatedAt &&
                    moment(data?.updatedAt).format('YYYY-MMM-DD')
                }
            />
            <InfoItem 
                title="Status" 
                value={data?.isShow ? 'show' : 'hide'} 
            />
        </div>
    );
};

InfoItem.defaultProps = {
    title: undefined,
    value: undefined,
    render: undefined,
};

SliderDetailAll.defaultProps = {
    data: undefined,
};

export default SliderDetailAll;
