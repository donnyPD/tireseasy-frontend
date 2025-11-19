import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import operations from './addToCart.gql';
import { useMiniCustomCart } from '../../context/MiniCartContext';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';

/**
 * @param {String} props.item.uid - uid of item
 * @param {String} props.item.name - name of item
 * @param {String} props.item.stock_status - stock status of item
 * @param {String} props.item.__typename - product type
 * @param {String} props.item.url_key - item url key
 * @param {String} props.item.sku - item sku
 *
 * @returns {
 *      handleAddToCart: Function,
 *      isDisabled: Boolean,
 *      isInStock: Boolean
 * }
 *
 */
const UNSUPPORTED_PRODUCT_TYPES = [
    'VirtualProduct',
    'BundleProduct',
    'GroupedProduct',
    'DownloadableProduct'
];

export const useAddToCartButton = props => {
    const { item, urlSuffix, setErrors } = props;

    const [, { dispatch }] = useEventingContext();

    const { openCustomMiniCart } = useMiniCustomCart();

    const [isLoading, setIsLoading] = useState(false);

    const isInStock = item.stock_status === 'IN_STOCK';

    const productType = item
        ? item.__typename !== undefined
            ? item.__typename
            : item.type
        : null;

    const isUnsupportedProductType = UNSUPPORTED_PRODUCT_TYPES.includes(
        productType
    );

    const isDisabled = isLoading || !isInStock || isUnsupportedProductType;

    const history = useHistory();

    const [{ cartId }] = useCartContext();

    const [addToCart, { data: addToCartResponseData, error: errorAddToCart} ] = useMutation(operations.ADD_ITEM);

    const handleAddToCart = useCallback(async (qty) => {
        try {
            if (productType === 'SimpleProduct' || productType === 'simple') {
                setIsLoading(true);

                const quantity = qty || 1;
                let addToCartVar;

                if (item.uid) {
                    addToCartVar = await addToCart({
                        variables: {
                            cartId,
                            cartItem: {
                                quantity,
                                entered_options: [
                                    {
                                        uid: item.uid,
                                        value: item.name
                                    }
                                ],
                                sku: item.sku
                            }
                        }
                    });
                } else {
                    addToCartVar = await addToCart({
                        variables: {
                            cartId,
                            cartItem: {
                                quantity,
                                sku: item.sku
                            }
                        }
                    });
                }

                dispatch({
                    type: 'CART_ADD_ITEM',
                    payload: {
                        cartId,
                        sku: item.sku,
                        name: item.name,
                        pricing: {
                            regularPrice: {
                                amount:
                                    item.price_range.maximum_price.regular_price
                            }
                        },
                        priceTotal:
                            item.price_range.maximum_price.final_price.value,
                        currencyCode:
                            item.price_range.maximum_price.final_price.currency,
                        discountAmount:
                            item.price_range.maximum_price.discount.amount_off,
                        selectedOptions: null,
                        quantity
                    }
                });
                if (addToCartVar && !addToCartVar?.data?.addProductsToCart?.user_errors[0]) {
                    openCustomMiniCart();
                }
                setIsLoading(false);
            } else if (
                productType === 'ConfigurableProduct' ||
                productType === 'configurable'
            ) {
                const productLink = resourceUrl(
                    `/${item.url_key}${urlSuffix || ''}`
                );

                history.push(productLink);
            } else {
                console.warn('Unsupported product type unable to handle.');
            }
        } catch (error) {
            console.error(error);
        }
    }, [productType, addToCart, cartId, item, dispatch, history, urlSuffix]);

    const derivedErrorMessage = useMemo(
        () =>
            setErrors([
                ...(addToCartResponseData?.addProductsToCart?.user_errors || [])
            ]),
        [
            addToCartResponseData
        ]
    );

    return {
        handleAddToCart,
        isDisabled,
        isInStock
    };
};
