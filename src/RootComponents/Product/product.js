import React from 'react';
import { FormattedMessage } from 'react-intl';
import { string } from 'prop-types';

import { useProduct } from '../../talons/RootComponents/Product/useProduct';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
import mapProduct from '@magento/venia-ui/lib/util/mapProduct';

import ProductFullDetail from '../../components/ProductFullDetail/productFullDetail';
import ProductShimmer from './product.shimmer';
import QuickLookups from '../../components/QuickLookups';
import defaultClasses from './product.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

const Product = props => {

    const classes = useStyle(defaultClasses, props.classes);
    const { __typename: productType } = props;
    const talonProps = useProduct({
        mapProduct
    });

    const { error, loading, product } = talonProps;

    if (loading && !product)
        return <ProductShimmer productType={productType} />;
    if (error && !product) return <ErrorView />;
    if (!product) {
        return (
            <h1>
                <FormattedMessage
                    id={'product.outOfStockTryAgain'}
                    defaultMessage={
                        'This Product is currently out of stock. Please try again later.'
                    }
                />
            </h1>
        );
    }

    return (
        <div className={classes.layoutContainer}>
            <aside className={classes.sidebar}>
                <QuickLookups/>
            </aside>

            <main className={classes.mainContent}>
                <StoreTitle>{product.name}</StoreTitle>
                <Meta name="description" content={product.meta_description}/>
                <ProductFullDetail product={product}/>
            </main>
        </div>
    )
};

Product.propTypes = {
    __typename: string.isRequired
};

export default Product;
