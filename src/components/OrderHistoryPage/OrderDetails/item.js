import React, { useMemo } from 'react';
import { shape, string, number, arrayOf } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { useOrderHistoryContext } from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Image from '@magento/venia-ui/lib/components/Image';
import Price from '@magento/venia-ui/lib/components/Price';
import defaultClasses from './item.module.css';
import PlaceholderImage from '@magento/venia-ui/lib/components/Image/placeholderImage';

const Item = props => {
    const {
        product_name,
        product_sale_price,
        product_url_key,
        quantity_ordered,
        selected_options,
        thumbnail,
        shipments
    } = props;
    const { currency, value: unitPrice } = product_sale_price;

    const orderHistoryState = useOrderHistoryContext();
    const { productURLSuffix } = orderHistoryState;
    const itemLink = `${product_url_key}${productURLSuffix}`;
    const mappedOptions = useMemo(
        () =>
            selected_options.map(option => ({
                option_label: option.label,
                value_label: option.value
            })),
        [selected_options]
    );
    const deliveredAt = shipments[0]?.delivered_at || null;
    const shippedAt = shipments[0]?.shipped_at || null;
    const trackingNumber = shipments[0]?.tracking_number || null;
    const classes = useStyle(defaultClasses, props.classes);

    const trackingElement = trackingNumber ? (
        <div className={classes.attrContainer}>
            <span className={classes.trackingRow}>
                <FormattedMessage
                    id="orderDetails.trackingInformation.new"
                    defaultMessage="<strong>Tracking number:</strong> {number}"
                    values={{
                        number: trackingNumber,
                        strong: chunks => <strong>{chunks}</strong>
                    }}
                />
            </span>
        </div>
    ) : null;

    const deliverElement = deliveredAt || shippedAt ? (
        <>
            {shippedAt && <div className={classes.attrContainer}>
                <span className={classes.trackingRow}>
                    <FormattedMessage
                        id="orderDetails.shippedAt"
                        defaultMessage="<strong>Shipped At:</strong> {shippedAt}"
                        values={{
                            shippedAt,
                            strong: chunks => <strong>{chunks}</strong>
                        }}
                    />
                </span>
            </div>}
            {deliveredAt && <div className={classes.attrContainer}>
                <span className={classes.trackingRow}>
                    <FormattedMessage
                        id="orderDetails.deliveredAt"
                        defaultMessage="<strong>Delivered At:</strong> {deliveredAt}"
                        values={{
                            deliveredAt,
                            strong: chunks => <strong>{chunks}</strong>
                        }}
                    />
                </span>
            </div>}
        </>
    ) : null;

    const thumbnailProps = {
        alt: product_name,
        classes: { root: classes.thumbnail },
        width: 50
    };
    const thumbnailElement = thumbnail ? (
        <Image {...thumbnailProps} resource={thumbnail.url} />
    ) : (
        <PlaceholderImage {...thumbnailProps} />
    );

    return (
        <div className={classes.root}>
            <Link className={classes.thumbnailContainer} to={itemLink}>
                {thumbnailElement}
            </Link>
            <div className={classes.nameContainer}>
                <Link to={itemLink}>{product_name}</Link>
            </div>
            <ProductOptions
                options={mappedOptions}
                classes={{
                    options: classes.options
                }}
            />
            <span className={classes.quantity}>
                <FormattedMessage
                    id="orderDetails.quantity"
                    defaultMessage="Qty : {quantity}"
                    values={{
                        quantity: quantity_ordered
                    }}
                />
            </span>
            <div className={classes.price}>
                <Price currencyCode={currency} value={unitPrice} />
            </div>
            {trackingElement}
            {deliverElement}
        </div>
    );
};

export default Item;

Item.propTypes = {
    classes: shape({
        root: string,
        thumbnailContainer: string,
        thumbnail: string,
        name: string,
        options: string,
        quantity: string,
        price: string,
        attrContainer: string,
        buyAgainButton: string
    }),
    product_name: string.isRequired,
    product_sale_price: shape({
        currency: string,
        value: number
    }).isRequired,
    product_url_key: string.isRequired,
    quantity_ordered: number.isRequired,
    selected_options: arrayOf(
        shape({
            label: string,
            value: string
        })
    ).isRequired,
    thumbnail: shape({
        url: string
    })
};
