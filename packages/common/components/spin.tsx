import React from 'react';
import { Spin as Spinner } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

type Props = {
    spinning?: boolean;
};

export const Spin: React.FC<Props> = ({ spinning }) => {
    return (
        <div>
            {spinning && (
                <>
                    <div
                        aria-label="advertisement"
                        className="fixed bottom-0 left-0 right-0 top-0 z-[1010] bg-[#fff] bg-opacity-50"
                        role="button"
                        tabIndex={0}
                    />
                    <div className="fixed left-[50%] top-[50%] z-[2000] flex translate-x-[-50%] translate-y-[-50%] flex-col  ">
                        <Spinner
                            indicator={
                                <LoadingOutlined style={{ fontSize: 40 }} />
                            }
                        />
                    </div>
                </>
            )}
        </div>
    );
};

Spin.defaultProps = {
    spinning: true,
};
