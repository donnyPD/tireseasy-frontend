import React from 'react';
import { FormattedMessage } from 'react-intl';

import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Image from '@magento/venia-ui/lib/components/Image';
import { useStyle } from '@magento/venia-ui/lib/classify';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';

import defaultClasses from './item.module.css';
import Price from '@magento/venia-ui/lib/components/Price';

const Item = props => {
    const {
        classes: propClasses,
        product,
        quantity,
        configurable_options,
        isHidden,
        item,
        configurableThumbnailSource
    } = props;
    const currency = item?.prices?.price?.currency || null;
    const unitPrice = item?.prices?.price?.value || null;
    const total = item?.prices?.row_total?.value || null;
    const size = item.product.size_label || null;
    const brandName = item.product.brand_name_label || null;

    const classes = useStyle(defaultClasses, propClasses);
    const className = isHidden ? classes.root_hidden : classes.root_visible;
    const configured_variant = configuredVariant(configurable_options, product);
    return (
        <li className={className}>
            <div>
                <div className={classes.item}>
                    <Image
                        alt={product.name}
                        classes={{
                            root: classes.imageRoot,
                            image: classes.thumbnail
                        }}
                        width={80}
                        resource={
                            configurableThumbnailSource === 'itself' &&
                            configured_variant
                                ? configured_variant.thumbnail.url
                                : product.thumbnail.url
                        }
                    />
                    <div className={classes.details}>
                        <span className={classes.name}>{product.name}</span>
                        <div className={classes.attr}>
                            {size && <span>{'Size: ' + size}</span>}
                            {brandName && <span>{'Brand: ' + brandName}</span>}
                        </div>
                        <ProductOptions
                            options={configurable_options}
                            classes={{
                                options: classes.options
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className={classes.price}>
                <span className={classes.price} data-cy="Product-price">
                    {currency && unitPrice ? <Price currencyCode={currency} value={unitPrice} /> : null}
                </span>
            </div>
            <div className={classes.quantity}>
                <span className={classes.qty_value}>
                    <FormattedMessage
                        id={'checkoutPage.quantity.new'}
                        defaultMessage={'{quantity}'}
                        values={{ quantity }}
                    />
                </span>
            </div>
            <div className={classes.total}>
                <span className={classes.price} data-cy="Product-price">
                    {total && <Price currencyCode={currency} value={total} />}
                </span>
            </div>
        </li>
    );
};

export default Item;
