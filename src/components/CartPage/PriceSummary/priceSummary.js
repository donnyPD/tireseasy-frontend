import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';
import { usePriceSummary } from '../../../talons/CartPage/PriceSummary/usePriceSummary';
import Button from '@magento/venia-ui/lib/components/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './priceSummary.module.css';
import DiscountSummary from './discountSummary';
import GiftCardSummary from './giftCardSummary';
import GiftOptionsSummary from './giftOptionsSummary';
import ShippingSummary from './shippingSummary';
import TaxSummary from './taxSummary';

/**
 * A child component of the CartPage component.
 * This component fetches and renders cart data, such as subtotal, discounts applied,
 * gift cards applied, tax, shipping, and cart total.
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides.
 * See [priceSummary.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import PriceSummary from "@magento/venia-ui/lib/components/CartPage/PriceSummary";
 */
const PriceSummary = props => {
    const { isUpdating, isCheckoutPage } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = usePriceSummary();

    const {
        handleProceedToCheckout,
        handleEnterKeyPress,
        hasError,
        hasItems,
        isCheckout,
        isLoading,
        flatData
    } = talonProps;
    const { formatMessage } = useIntl();

    if (hasError) {
        return (
            <div className={classes.root}>
                <span className={classes.errorText}>
                    <FormattedMessage
                        id={'priceSummary.errorText'}
                        defaultMessage={
                            'Something went wrong. Please refresh and try again.'
                        }
                    />
                </span>
            </div>
        );
    } else if (!hasItems) {
        return null;
    }

    const {
        subtotal,
        total,
        discounts,
        giftCards,
        giftOptions,
        taxes,
        fet,
        shipping
    } = flatData;

    const isPriceUpdating = isUpdating || isLoading;
    const priceClass = isPriceUpdating ? classes.priceUpdating : classes.price;
    const totalPriceClass = isPriceUpdating
        ? classes.priceUpdating
        : classes.totalPrice;
    const labelSubClass = isPriceUpdating
        ? classes.labelSubUpdating
        : classes.lineItemLabelSub;

    const totalPriceLabel = isCheckout
        ? formatMessage({
              id: 'priceSummary.total',
              defaultMessage: 'Total'
          })
        : formatMessage({
              id: 'priceSummary.estimatedTotal',
              defaultMessage: 'Estimated Total'
          });

    const proceedToCheckoutButton = !isCheckout ? (
        <div className={classes.checkoutButton_container}>
            <Button
                disabled={isPriceUpdating}
                priority={'high'}
                onClick={handleProceedToCheckout}
                onTouchStart={handleProceedToCheckout}
                onKeyDown={handleEnterKeyPress}
                data-cy="PriceSummary-checkoutButton"
            >
                <FormattedMessage
                    id={'priceSummary.checkoutButton'}
                    defaultMessage={'Proceed to Checkout'}
                />
            </Button>
        </div>
    ) : null;

    return (
        <div className={classes.root} data-cy="PriceSummary-root">
            <div>
                {isCheckoutPage ? (
                    <ul>
                        <li className={classes.lineItems}>
                            <span
                                data-cy="PriceSummary-totalLabel"
                                className={classes.lineItemLabel}
                            >
                                <FormattedMessage
                                    id={'priceSummary.lineItemLabel.total.new'}
                                    defaultMessage={'Order Total: '}
                                />
                            </span>
                            <span
                                data-cy="PriceSummary-totalValue"
                                className={totalPriceClass}
                            >
                                <Price
                                    value={total.value}
                                    currencyCode={total.currency}
                                />
                            </span>
                        </li>
                        {fet ? (
                            <li className={classes.lineItems}>
                                <span
                                    className={labelSubClass}
                                >
                                    <FormattedMessage
                                        id={'priceSummary.lineItemLabel.shipping'}
                                        defaultMessage={'Federal Excise Tax: '}
                                    />
                                    <Price
                                        value={fet.value}
                                        currencyCode={fet.currency}
                                    />
                                </span>
                            </li>
                        ) : (
                            <li className={classes.lineItems}>
                                <span
                                    className={labelSubClass}
                                >
                                    <FormattedMessage
                                        id={'priceSummary.lineItemLabel.checkout'}
                                        defaultMessage={'Includes estimated shipping & taxes.'}
                                    />
                                </span>
                            </li>
                        )}
                    </ul>
                ) : (
                    <ul>
                        <li className={classes.lineItems}>
                            <span
                                data-cy="PriceSummary-lineItemLabel"
                                className={classes.lineItemLabel}
                            >
                                <FormattedMessage
                                    id={'priceSummary.lineItemLabel.new'}
                                    defaultMessage={'Subtotal: '}
                                />
                            </span>
                            <span
                                data-cy="PriceSummary-subtotalValue"
                                className={priceClass}
                            >
                                <Price
                                    value={subtotal.value}
                                    currencyCode={subtotal.currency}
                                />
                            </span>
                        </li>
                        {fet ? (
                            <li className={classes.lineItems}>
                                <span
                                    className={labelSubClass}
                                >
                                    <FormattedMessage
                                        id={'priceSummary.lineItemLabel.shipping'}
                                        defaultMessage={'Federal Excise Tax: '}
                                    />
                                    <Price
                                        value={fet.value}
                                        currencyCode={fet.currency}
                                    />
                                </span>
                            </li>
                        ) : (
                            <li className={classes.lineItems}>
                                <span
                                    className={labelSubClass}
                                >
                                    <FormattedMessage
                                        id={'priceSummary.lineItemLabel.shipping'}
                                        defaultMessage={'Shipping calculated at checkout.'}
                                    />
                                </span>
                            </li>
                        )}
                    </ul>
                )}

            </div>
            {proceedToCheckoutButton}
        </div>
    );
};

export default PriceSummary;
