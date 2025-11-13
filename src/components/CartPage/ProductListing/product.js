import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useProduct } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Price from '@magento/venia-ui/lib/components/Price';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Section from '@magento/venia-ui/lib/components/LegacyMiniCart/section';
import Quantity from './quantity';

import defaultClasses from './product.module.css';

import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql.js';
import { AvailableShippingMethodsCartFragment } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql.js';

const IMAGE_SIZE = 80;

const Product = props => {
    const { item } = props;

    const { formatMessage } = useIntl();
    const talonProps = useProduct({
        operations: {
            removeItemMutation: REMOVE_ITEM_MUTATION,
            updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        },
        ...props
    });

    const {
        addToWishlistProps,
        errorMessage,
        handleEditItem,
        handleRemoveFromCart,
        handleUpdateItemQuantity,
        isEditable,
        product,
        isProductUpdating
    } = talonProps;

    const {
        currency,
        image,
        name,
        options,
        quantity,
        stockStatus,
        unitPrice,
        urlKey,
        urlSuffix,
    } = product;

    const classes = useStyle(defaultClasses, props.classes);

    const itemClassName = isProductUpdating
        ? classes.root_disabled
        : classes.root;

    const editItemSection = isEditable ? (
        <Section
            text={formatMessage({
                id: 'product.editItem',
                defaultMessage: 'Edit item'
            })}
            data-cy="Product-Section-editItem"
            onClick={handleEditItem}
            icon="Edit2"
            classes={{
                text: classes.sectionText
            }}
        />
    ) : null;

    const itemLink = useMemo(
        () => resourceUrl(`/${urlKey}${urlSuffix || ''}`),
        [urlKey, urlSuffix]
    );

    const stockStatusMessage =
        stockStatus === 'OUT_OF_STOCK'
            ? formatMessage({
                  id: 'product.outOfStock',
                  defaultMessage: 'Out-of-stock'
              })
            : '';

    return (
        <li className={itemClassName} data-cy="Product-root">
            <div>
                <div className={classes.item}>
                    <Link
                        to={itemLink}
                        className={classes.imageContainer}
                        data-cy="Product-imageContainer"
                    >
                        <Image
                            alt={name}
                            classes={{
                                root: classes.imageRoot,
                                image: classes.image
                            }}
                            width={IMAGE_SIZE}
                            resource={image}
                            data-cy="Product-image"
                        />
                    </Link>
                    <div className={classes.details}>
                        <div className={classes.name} data-cy="Product-name">
                            <Link to={itemLink}>{name}</Link>
                        </div>
                        <div className={classes.attr}>
                            {item.product.size_label && <span>{'Size: ' + item.product.size_label}</span>}
                            {item.product.brand_name_label && <span>{'Brand: ' + item.product.brand_name_label}</span>}
                        </div>
                        <ProductOptions
                            options={options}
                            classes={{
                                options: classes.options,
                                optionLabel: classes.optionLabel
                            }}
                        />
                        <span className={classes.stockStatusMessage}>
                            {stockStatusMessage}
                        </span>
                        <div>
                            <span className={classes.errorText}>{errorMessage}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.price}>
                <span className={classes.price} data-cy="Product-price">
                        <Price currencyCode={currency} value={unitPrice} />
                </span>
            </div>
            <div className={classes.quantity}>
                <Quantity
                    itemId={item.id}
                    initialValue={quantity}
                    onChange={handleUpdateItemQuantity}
                />
            </div>
            <div className={classes.total}>
                <span className={classes.price} data-cy="Product-price">
                        <Price currencyCode={currency} value={unitPrice * quantity} />
                </span>
            </div>
            <div className={classes.total}>
                <div className={classes.eta_data}>
                    {item.estimated_delivery && <span>{item.estimated_delivery.estimatedDeliveryDate}</span>}
                </div>
            </div>
            <div className={classes.action}>
                <Section
                    text={formatMessage({
                        id: 'product.removeFromCart.new',
                        defaultMessage: 'Remove'
                    })}
                    data-cy="Product-Section-removeFromCart"
                    onClick={handleRemoveFromCart}
                    icon="Trash"
                    classes={{
                        text: classes.sectionText
                    }}
                />
            </div>
        </li>
    );
};

export default Product;

export const REMOVE_ITEM_MUTATION = gql`
    mutation removeItem($cartId: String!, $itemId: ID!) {
        removeItemFromCart(
            input: { cart_id: $cartId, cart_item_uid: $itemId }
        ) {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;

export const UPDATE_QUANTITY_MUTATION = gql`
    mutation updateItemQuantity(
        $cartId: String!
        $itemId: ID!
        $quantity: Float!
    ) {
        updateCartItems(
            input: {
                cart_id: $cartId
                cart_items: [{ cart_item_uid: $itemId, quantity: $quantity }]
            }
        ) {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;
