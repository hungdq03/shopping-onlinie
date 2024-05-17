import { Form, Input, Modal } from 'antd';
import React, { useState } from 'react';

type Props = {
    button: JSX.Element;
    title: string;
};

type FormType = { id?: string; name?: string };

const BrandModal: React.FC<Props> = ({ button, title }) => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    return (
        <>
            <div onClick={() => setIsOpenModal(true)} role="presentation">
                {button}
            </div>
            <Modal
                onCancel={() => setIsOpenModal(false)}
                open={isOpenModal}
                title={title}
            >
                <Form>
                    <Form.Item<FormType>
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Brand name must be required!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default BrandModal;
