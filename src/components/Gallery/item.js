import React, { useState } from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import { Info, Minus as MinusIcon, Plus as PlusIcon } from 'react-feather';
import { string, number, shape } from 'prop-types';
import { Link } from 'react-router-dom';

import Price from '@magento/venia-ui/lib/components/Price';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import GalleryItemShimmer from '@magento/venia-ui/lib/components/Gallery/item.shimmer';
import defaultClasses from '@magento/venia-ui/lib/components/Gallery/item.module.css';

import customClasses from './item.module.css';
// import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';

import AddToCartButton from './addToCartButton';
import Icon from '@magento/venia-ui/lib/components/Icon';
// eslint-disable-next-line no-unused-vars
// import Rating from '../Rating';

// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map()
    .set(640, IMAGE_WIDTH)
    .set(UNCONSTRAINED_SIZE_KEY, 840);

const GalleryItem = props => {
    const {
        handleLinkClick,
        item,
        itemRef,
        isSupportedProductType
    } = useGalleryItem(props);

    const [itemQty, setItemQty] = useState(1);

    const { storeConfig } = props;

    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;

    const classes = useStyle(defaultClasses, props.classes, customClasses);

    const { formatMessage } = useIntl();

    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }

    // eslint-disable-next-line no-unused-vars
    const { name, price_range, small_image, url_key,
        rating_summary,
        size_label,
        load_index_label,
        speed_index_label,
        load_range_ply_rating_label,
        brand_name_label,
        mileage_warranty_label} = item;


    function convertSnakeCaseToTitle(str) {
        return str
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase())
            .replace(/\s+label$/i, '');
    }

    const handleChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setItemQty(value);
        }
    }

    const attrs= [
        {size_label},
        {load_index_label},
        {speed_index_label},
        {load_range_ply_rating_label},
        {brand_name_label},
        {mileage_warranty_label}]
    const { url: smallImageURL } = small_image;
    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);

    const renderAttr = () => {

        return <div className={classes.attrs}>
            {
                attrs
                    .filter(attr => {
                        const value = attr[Object.keys(attr)[0]];
                        return value != null && value !== '';
                    })
                    .map((attr, index) => {
                        const key = Object.keys(attr)[0];
                        const value = attr[key];
                        const displayKey = convertSnakeCaseToTitle(key);

                        return (
                            <div className={classes.attrs__item} key={index}>
                                <b>{displayKey}:</b> {value}
                            </div>
                        );
                    })
            }
        </div>
    };
    // const wishlistButton = wishlistButtonProps ? (
    //     <WishlistGalleryButton {...wishlistButtonProps} />
    // ) : null;

    const addButton = isSupportedProductType ? (
        <AddToCartButton item={item} urlSuffix={productUrlSuffix} qty={itemQty} />
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'galleryItem.unavailableProduct'}
                    defaultMessage={'Currently unavailable for purchase.'}
                />
            </p>
        </div>
    );
    const currencyCode =
        price_range?.maximum_price?.final_price?.currency ||
        item.price.regularPrice.amount.currency;

    // fallback to regular price when final price is unavailable
    const priceSource =
        (price_range?.maximum_price?.final_price !== undefined &&
        price_range?.maximum_price?.final_price !== null
            ? price_range.maximum_price.final_price
            : item.prices.maximum.final) ||
        (price_range?.maximum_price?.regular_price !== undefined &&
        price_range?.maximum_price?.regular_price !== null
            ? price_range.maximum_price.regular_price
            : item.prices.maximum.regular);
    const priceSourceValue = priceSource.value || priceSource;

    // Hide the Rating component until it is updated with the new look and feel (PWA-2512).
    // const ratingAverage = null;
    // // const ratingAverage = rating_summary ? (
    // //     <Rating rating={rating_summary} />
    // // ) : null;

    return (
        <div data-cy="GalleryItem-root" className={classes.root} ref={itemRef}>
            <Link
                aria-label={name}
                onClick={handleLinkClick}
                to={productLink}
                className={classes.images}
            >
                <Image
                    alt={name}
                    classes={{
                        image: classes.image,
                        loaded: classes.imageLoaded,
                        notLoaded: classes.imageNotLoaded,
                        root: classes.imageContainer
                    }}
                    height={IMAGE_HEIGHT}
                    resource={smallImageURL}
                    widths={IMAGE_WIDTHS}
                />
                {/*{ratingAverage}*/}
            </Link>
            <Link
                onClick={handleLinkClick}
                to={productLink}
                className={classes.name}
                data-cy="GalleryItem-name"
            >
                <span>{name}</span>
                {renderAttr()}
            </Link>
            <div className={classes.attributes}>
                {item?.available_quantity_label && <div className={classes.attrs__item}><b>{'Local Inv:'}</b> <span>{item?.available_quantity_label}</span></div>}
                {item?.national_quantity_label && <div className={classes.attrs__item}><b>{'National Inv:'}</b> <span>{item?.national_quantity_label}</span></div>}
                <div className={classes.qty_block}>
                    <button
                        aria-label={formatMessage({
                            id: 'quantity.buttonDecrement',
                            defaultMessage: 'Decrease Quantity'
                        })}
                        className={classes.button_decrement}
                        disabled={itemQty < 2}
                        onClick={() => setItemQty(itemQty - 1)}
                        type="button"
                    >
                        <Icon classes={classes.icon} src={MinusIcon} size={22} />
                    </button>
                    <input
                        className={classes.quantity}
                        id={`qty-${item.id}`}
                        type="number"
                        min={1}
                        value={itemQty}
                        onChange={handleChange}
                    />
                    <button
                        aria-label={formatMessage({
                            id: 'quantity.buttonIncrement',
                            defaultMessage: 'Increase Quantity'
                        })}
                        className={classes.button_increment}
                        // disabled={}
                        onClick={() => setItemQty(itemQty + 1)}
                        type="button"
                    >
                        <Icon classes={classes.icon} src={PlusIcon} size={20} />
                    </button>
                </div>
            </div>
            <div className={classes.actions}>
                <div data-cy="GalleryItem-price" className={classes.price}>
                    <Price
                        value={priceSourceValue}
                        currencyCode={currencyCode}
                    />
                </div>

                <div className={classes.actionsContainer}>{addButton}</div>
            </div>
        </div>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageLoaded: string,
        imageNotLoaded: string,
        imageContainer: string,
        images: string,
        name: string,
        price: string,
        root: string
    }),
    item: shape({
        id: number.isRequired,
        uid: string.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        stock_status: string.isRequired,
        __typename: string.isRequired,
        url_key: string.isRequired,
        sku: string.isRequired,
        price_range: shape({
            maximum_price: shape({
                final_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }),
                regular_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired,
                discount: shape({
                    amount_off: number.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    }),
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired,
        product_url_suffix: string
    })
};

export default GalleryItem;
