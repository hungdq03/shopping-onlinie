import React from 'react';
import ProductFormModal from './product-form-modal';

const ProductList = () => {
    return (
        <div>
            <div>
                <ProductFormModal title="Create product" type="CREATE" />
            </div>
        </div>
    );
};

export default ProductList;