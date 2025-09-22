import React, { useMemo, Fragment, Suspense, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';
import { Info } from 'react-feather';

import Price from '@magento/venia-ui/lib/components/Price';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Button from '@magento/venia-ui/lib/components/Button';
import Carousel from './ProductImageCarousel';
import FormError from '@magento/venia-ui/lib/components/FormError';
import QuantityStepper from '@magento/venia-ui/lib/components/QuantityStepper';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';
import { ProductOptionsShimmer } from '@magento/venia-ui/lib/components/ProductOptions';
import CustomAttributes from './CustomAttributes';
import defaultClasses from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.module.css';
import customClasses from './productFullDetail.module.css';

// const WishlistButton = React.lazy(() => import('@magento/venia-ui/lib/components/Wishlist/AddToListButton'));
const Options = React.lazy(() => import('@magento/venia-ui/lib/components/ProductOptions'));

// Correlate a GQL error message to a field. GQL could return a longer error
// string but it may contain contextual info such as product id. We can use
// parts of the string to check for which field to apply the error.
const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages for rendering.
const ERROR_FIELD_TO_MESSAGE_MAPPING = {
    quantity: 'The requested quantity is not available.'
};

const ProductFullDetail = props => {
    const { product } = props;
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const talonProps = useProductFullDetail({ product });

    function convertSnakeCaseToTitle(str) {
        return str
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase())
            .replace(/\s+label$/i, '');
    }

    console.log('111',product)
    const {
        size_label,
        load_index_label,
        speed_index_label,
        load_range_ply_rating_label,
        brand_name_label,
        mileage_warranty_label
    } = product;

    const attrs= [
        {size_label},
        {load_index_label},
        {speed_index_label},
        {load_range_ply_rating_label},
        {brand_name_label},
        {mileage_warranty_label}]

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

    const {
        breadcrumbCategoryId,
        errorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isEverythingOutOfStock,
        outOfStockVariants,
        isAddToCartDisabled,
        isSupportedProductType,
        mediaGalleryEntries,
        productDetails,
        customAttributes,
        wishlistButtonProps
    } = talonProps;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes, customClasses)

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={<ProductOptionsShimmer />}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
                isEverythingOutOfStock={isEverythingOutOfStock}
                outOfStockVariants={outOfStockVariants}
            />
        </Suspense>
    ) : null;

    const breadcrumbs = breadcrumbCategoryId ? (
        <Breadcrumbs
            categoryId={breadcrumbCategoryId}
            currentProduct={productDetails.name}
        />
    ) : null;

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        // Handle cases where a user token is invalid or expired. Preferably
        // this would be handled elsewhere with an error code and not a string.
        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorToken',
                        defaultMessage:
                            'There was a problem with your cart. Please sign in again and try adding the item once more.'
                    })
                )
            ]);
        }

        // Handle cases where a cart wasn't created properly.
        if (
            errorMessage.includes('Variable "$cartId" got invalid value null')
        ) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorCart',
                        defaultMessage:
                            'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                    })
                )
            ]);
        }

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorUnknown',
                        defaultMessage:
                            'Could not add item to cart. Please check required options and try again.'
                    })
                )
            ]);
        }
    }

    const customAttributesDetails = useMemo(() => {
        const list = [];
        const pagebuilder = [];
        const skuAttribute = {
            attribute_metadata: {
                uid: 'attribute_sku',
                used_in_components: ['PRODUCT_DETAILS_PAGE'],
                ui_input: {
                    ui_input_type: 'TEXT'
                },
                label: formatMessage({
                    id: 'global.sku',
                    defaultMessage: 'SKU'
                })
            },
            entered_attribute_value: {
                value: productDetails.sku
            }
        };
        if (Array.isArray(customAttributes)) {
            customAttributes.forEach(customAttribute => {
                if (
                    customAttribute.attribute_metadata.ui_input
                        .ui_input_type === 'PAGEBUILDER'
                ) {
                    pagebuilder.push(customAttribute);
                } else {
                    list.push(customAttribute);
                }
            });
        }
        list.unshift(skuAttribute);
        return {
            list: list,
            pagebuilder: pagebuilder
        };
    }, [customAttributes, productDetails.sku, formatMessage]);

    const cartCallToActionText =
        !isEverythingOutOfStock || !isOutOfStock ? (
            <FormattedMessage
                id="productFullDetail.addItemToCart"
                defaultMessage="Add to Cart"
            />
        ) : (
            <FormattedMessage
                id="productFullDetail.itemOutOfStock"
                defaultMessage="Out of Stock"
            />
        );
    // Error message for screen reader
    const cartActionContent = isSupportedProductType ? (
        <section className={classes.actButton}>
            <Button
                data-cy="ProductFullDetail-addToCartButton"
                disabled={isAddToCartDisabled}
                aria-disabled={isAddToCartDisabled}
                aria-label={
                    isEverythingOutOfStock
                        ? formatMessage({
                              id: 'productFullDetail.outOfStockProduct',
                              defaultMessage:
                                  'This item is currently out of stock'
                          })
                        : ''
                }
                priority="high"
                type="submit"
            >
                {cartCallToActionText}
            </Button>
        </section>
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'productFullDetail.unavailableProduct'}
                    defaultMessage={
                        'This product is currently unavailable for purchase.'
                    }
                />
            </p>
        </div>
    );

    const shortDescription = productDetails.shortDescription ? (
        <RichContent html={productDetails.shortDescription.html} />
    ) : null;

    const pageBuilderAttributes = customAttributesDetails.pagebuilder.length ? (
        <section className={classes.detailsPageBuilder}>
            <CustomAttributes
                classes={{ list: classes.detailsPageBuilderList }}
                customAttributes={customAttributesDetails.pagebuilder}
                showLabels={false}
            />

        </section>
    ) : null;

    /**
     * Toggle description expanded state
     */
    const toggleDescription = () => {
        setIsDescriptionExpanded(prev => !prev);
    };

    /**
     * Render expandable description with toggle button
     */
    const renderExpandableDescription = () => {
        if (!productDetails.description) return null;

        return (
            <div className={classes.expandableDescription}>
                <div
                    className={`${classes.descriptionContent} ${
                        isDescriptionExpanded ? classes.expanded : classes.collapsed
                    }`}
                >
                    <RichContent html={productDetails.description} />
                </div>
                <button
                    type="button"
                    className={classes.toggleButton}
                    onClick={toggleDescription}
                    aria-expanded={isDescriptionExpanded}
                    aria-label={
                        isDescriptionExpanded
                            ? formatMessage({
                                id: 'productFullDetail.showLess',
                                defaultMessage: 'Show less'
                            })
                            : formatMessage({
                                id: 'productFullDetail.showMore',
                                defaultMessage: 'Show more'
                            })
                    }
                >
                    <span className={classes.toggleText}>
                        {isDescriptionExpanded ? (
                            <FormattedMessage
                                id="productFullDetail.showLess"
                                defaultMessage="Show less"
                            />
                        ) : (
                            <FormattedMessage
                                id="productFullDetail.showMore"
                                defaultMessage="Show more"
                            />
                        )}
                    </span>
                    <span className={`${classes.toggleArrow} ${
                        isDescriptionExpanded ? classes.arrowUp : classes.arrowDown
                    }`}>
                        ▼
                    </span>
                </button>
            </div>
        );
    };

    return (
        <Fragment>
            {breadcrumbs}
            <Form
                className={classes.root}
                data-cy="ProductFullDetail-root"
                onSubmit={handleAddToCart}
            >
                <section className={classes.imageCarousel}>
                    <Carousel images={mediaGalleryEntries} />
                </section>

                <section className={classes.productInfo}>
                    <section className={classes.title}>
                        <h1
                            aria-live="polite"
                            className={classes.productName}
                            data-cy="ProductFullDetail-productName"
                        >
                            {productDetails.name}
                        </h1>
                        <p
                            data-cy="ProductFullDetail-productPrice"
                            className={classes.productPrice}
                        >
                            <Price
                                currencyCode={productDetails.price.currency}
                                value={productDetails.price.value}
                            />
                        </p>
                        {shortDescription}
                    </section>
                    <section className={classes.details}>
                        <span
                            data-cy="ProductFullDetail-detailsTitle"
                            className={classes.detailsTitle}
                        >
                            <FormattedMessage
                                id={'productFullDetail.details'}
                                defaultMessage={'Details'}
                            />
                        </span>
                        {renderAttr()}
                        <CustomAttributes
                            customAttributes={customAttributesDetails.list}
                        />

                    </section>
                    <FormError
                        classes={{
                            root: classes.formErrors
                        }}
                        errors={errors.get('form') || []}
                    />
                    <section className={classes.description}>
                        <span
                            data-cy="ProductFullDetail-descriptionTitle"
                            className={classes.descriptionTitle}
                        >
                            <FormattedMessage
                                id={'productFullDetail.description'}
                                defaultMessage={'Description'}
                            />
                        </span>
                        {renderExpandableDescription()}
                    </section>
                    <section className={classes.options}>{options}</section>
                    <section className={classes.quantity}>
                        <span
                            data-cy="ProductFullDetail-quantityTitle"
                            className={classes.quantityTitle}
                        >
                            <FormattedMessage
                                id={'global.quantity'}
                                defaultMessage={'Quantity'}
                            />
                        </span>
                        <QuantityStepper
                            classes={{ root: classes.quantityRoot }}
                            min={1}
                            message={errors.get('quantity')}
                        />
                    </section>
                    <section className={classes.actions}>
                        {cartActionContent}
                        {/*<Suspense fallback={null}>*/}
                        {/*    <WishlistButton {...wishlistButtonProps} />*/}
                        {/*</Suspense>*/}
                    </section>
                    {pageBuilderAttributes}
                </section>
            </Form>
        </Fragment>
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsPageBuilder: string,
        detailsPageBuilderList: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        quantityRoot: string,
        root: string,
        title: string,
        unavailableContainer: string
    }),
    product: shape({
        __typename: string,
        id: number,
        stock_status: string,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            }).isRequired
        }).isRequired,
        media_gallery_entries: arrayOf(
            shape({
                uid: string,
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: string,
        short_description: shape({
            html: string,
            __typename: string
        })
    }).isRequired
};

export default ProductFullDetail;
