import React, { useState } from 'react';
import { Card, List, Pagination, Spin } from 'antd';
import useProducts from '../hooks/useProducts';
import { Product } from '../hooks/Product';

const ProductList: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { products, total, loading, error } = useProducts(currentPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (loading) return <Spin size="large" />;
    if (error) return <div>Error loading products: {error}</div>;

    return (
        <div>
            <List
                dataSource={products}
                grid={{ gutter: 16, column: 4 }}
                renderItem={(product: Product) => (
                    <List.Item>
                        <Card
                            cover={
                                <img
                                    alt={product.name}
                                    src={product.thumbnail}
                                />
                            }
                            hoverable
                        >
                            <Card.Meta
                                description={
                                    <>
                                        <p>{product.description}</p>
                                        <p>
                                            Original Price: $
                                            {product.original_price}
                                        </p>
                                        {product.discount_price && (
                                            <p>
                                                Sale Price: $
                                                {product.discount_price}
                                            </p>
                                        )}
                                    </>
                                }
                                title={product.name}
                            />
                        </Card>
                    </List.Item>
                )}
            />
            <Pagination
                current={currentPage}
                onChange={handlePageChange}
                pageSize={10}
                style={{ marginTop: '16px', textAlign: 'center' }}
                total={total}
            />
        </div>
    );
};

export default ProductList;
