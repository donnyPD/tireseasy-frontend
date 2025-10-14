import React, { Fragment, useEffect, useState } from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';

import { useWindowSize, useToasts } from '@magento/peregrine';
import {
    CHECKOUT_STEP,
    useCheckoutPage
} from '../../talons/CheckoutPage/useCheckoutPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import StockStatusMessage from '@magento/venia-ui/lib/components/StockStatusMessage';
import FormError from '@magento/venia-ui/lib/components/FormError';
import AddressBook from '@magento/venia-ui/lib/components/CheckoutPage/AddressBook';
import GuestSignIn from '@magento/venia-ui/lib/components/CheckoutPage/GuestSignIn';
import OrderSummary from './OrderSummary';
import PaymentInformation from './PaymentInformation';
import payments from './PaymentInformation/paymentMethodCollection';
import PriceAdjustments from '@magento/venia-ui/lib/components/CheckoutPage/PriceAdjustments';
import ShippingMethod from '@magento/venia-ui/lib/components/CheckoutPage/ShippingMethod';
import ShippingInformation from '@magento/venia-ui/lib/components/CheckoutPage/ShippingInformation';
import ItemsReview from './ItemsReview';
import OrderConfirmationPage from './OrderConfirmationPage';
import GoogleReCaptcha from '@magento/venia-ui/lib/components/GoogleReCaptcha';
import CustomerAttributes from './customerAttributes';

import defaultClasses from './checkoutPage.module.css';
import ScrollAnchor from '@magento/venia-ui/lib/components/ScrollAnchor/scrollAnchor';
import QuickLookups from '../QuickLookups';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

const CheckoutPage = props => {
    const history = useHistory();
    const { classes: propClasses } = props;
    const { formatMessage } = useIntl();
    const talonProps = useCheckoutPage();
    const [addressFormActive, setAddressFormActive] = useState(false);
    const [placeLoading, setPlaceLoading] = useState(false);

    const {
        /**
         * Enum, one of:
         * SHIPPING_ADDRESS, SHIPPING_METHOD, PAYMENT, REVIEW
         */
        activeContent,
        availablePaymentMethods,
        cartItems,
        checkoutStep,
        customer,
        error,
        guestSignInUsername,
        handlePlaceOrder,
        handlePlaceOrderEnterKeyPress,
        hasError,
        isCartEmpty,
        isGuestCheckout,
        isLoading,
        isUpdating,
        orderDetailsLoading,
        orderDetailsData,
        orderNumber,
        placeOrderLoading,
        placeOrderButtonClicked,
        setCheckoutStep,
        setGuestSignInUsername,
        setIsUpdating,
        setShippingInformationDone,
        scrollShippingInformationIntoView,
        setShippingMethodDone,
        scrollShippingMethodIntoView,
        setPaymentInformationDone,
        shippingInformationRef,
        shippingMethodRef,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        handleReviewOrderEnterKeyPress,
        reviewOrderButtonClicked,
        recaptchaWidgetProps,
        toggleAddressBookContent,
        toggleSignInContent
    } = talonProps;

    const [, { addToast }] = useToasts();
    const orderCount = localStorage.getItem('orderCount');
    const [poAttributeError, setPoAttributeError] = useState(false);
    useEffect(() => {
        if (isGuestCheckout && !orderDetailsData) {
            if (orderCount === '1') {
                history.push('/');
                localStorage.setItem('orderCount', '0');
            }
        }
    }, [isGuestCheckout, history, orderDetailsData, orderCount]);
    useEffect(() => {
        if (hasError) {
            const message =
                error && error.message
                    ? error.message
                    : formatMessage({
                          id: 'checkoutPage.errorSubmit',
                          defaultMessage:
                              'Oops! An error occurred while submitting. Please try again.'
                      });
            addToast({
                type: 'error',
                icon: errorIcon,
                message,
                dismissable: true,
                timeout: 7000
            });

            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
        }
    }, [addToast, error, formatMessage, hasError]);
    useEffect(() => {
        if (checkoutStep === CHECKOUT_STEP.REVIEW) {
            handlePlaceOrder();
        }
    }, [checkoutStep]);
    useEffect(() => {
        if (reviewOrderButtonClicked) {
            setPlaceLoading(true);
        }
    }, [reviewOrderButtonClicked]);

    const classes = useStyle(defaultClasses, propClasses);

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 960;
    const shippingInformationClasses = addressFormActive
        ? classes.shipping_information_container_active
        : classes.shipping_information_container;

    let checkoutContent;

    const checkPoAttributeError = () => {
        if (!poAttributeError) {
            handleReviewOrder();
        }
    }

    const heading = isGuestCheckout
        ? formatMessage({
              id: 'checkoutPage.guestCheckout',
              defaultMessage: 'Guest Checkout'
          })
        : formatMessage({
              id: 'checkoutPage.checkout',
              defaultMessage: 'Checkout'
          });

    if (isGuestCheckout && orderDetailsData && orderNumber) {
        return (
            <OrderConfirmationPage
                data={orderDetailsData}
                orderNumber={orderNumber}
            />
        );
    } else if (isLoading) {
        return fullPageLoadingIndicator;
    } else if (isCartEmpty) {
        checkoutContent = (
            <div className={classes.empty_cart_container}>
                <div className={classes.heading_container}>
                    <h1
                        aria-live="polite"
                        className={classes.heading}
                        data-cy="ChekoutPage-heading"
                    >
                        {heading}
                    </h1>
                </div>
                <h3>
                    <FormattedMessage
                        id={'checkoutPage.emptyMessage'}
                        defaultMessage={'There are no items in your cart.'}
                    />
                </h3>
            </div>
        );
    } else {
        const signInContainerVisible =
            isGuestCheckout && checkoutStep !== CHECKOUT_STEP.REVIEW;
        const signInContainerElement = signInContainerVisible ? (
            <div className={classes.signInContainer}>
                <span className={classes.signInLabel}>
                    <FormattedMessage
                        id={'checkoutPage.signInLabel'}
                        defaultMessage={'Sign in for Express Checkout'}
                    />
                </span>
                <Button
                    className={classes.signInButton}
                    data-cy="CheckoutPage-signInButton"
                    onClick={toggleSignInContent}
                    onTouchStart={toggleSignInContent}
                    priority="normal"
                >
                    <FormattedMessage
                        id={'checkoutPage.signInButton'}
                        defaultMessage={'Sign In'}
                    />
                </Button>
            </div>
        ) : null;

        const shippingMethodSection =
            checkoutStep >= CHECKOUT_STEP.SHIPPING_METHOD ? (
                <ShippingMethod
                    pageIsUpdating={isUpdating}
                    onSave={setShippingMethodDone}
                    onSuccess={scrollShippingMethodIntoView}
                    setPageIsUpdating={setIsUpdating}
                />
            ) : (
                <h3 className={classes.shipping_method_heading}>
                    <FormattedMessage
                        id={'checkoutPage.shippingMethodStep'}
                        defaultMessage={'2. Shipping Method'}
                    />
                </h3>
            );

        const formErrors = [];
        const paymentMethods = Object.keys(payments);

        // If we have an implementation, or if this is a "zero" checkout,
        // we can allow checkout to proceed.
        const isPaymentAvailable = !!availablePaymentMethods.find(
            ({ code }) => code === 'free' || paymentMethods.includes(code)
        );

        if (!isPaymentAvailable) {
            formErrors.push(
                new Error(
                    formatMessage({
                        id: 'checkoutPage.noPaymentAvailable',
                        defaultMessage: 'Payment is currently unavailable.'
                    })
                )
            );
        }

        const paymentInformationSection =
            checkoutStep >= CHECKOUT_STEP.PAYMENT ? (
                <PaymentInformation
                    onSave={setPaymentInformationDone}
                    checkoutError={error}
                    resetShouldSubmit={resetReviewOrderButtonClicked}
                    setCheckoutStep={setCheckoutStep}
                    shouldSubmit={reviewOrderButtonClicked}
                />
            ) : (
                <h3 className={classes.payment_information_text}>
                    <FormattedMessage
                        id={'checkoutPage.paymentInformationStep.new'}
                        defaultMessage={'Please add Shipping Address to your '}
                    />
                    <span className={classes.address_link} onClick={() => setAddressFormActive(true)}>
                        <FormattedMessage
                            id={'checkoutPage.paymentInformationStep.link'}
                            defaultMessage={'Address List'}
                        />
                    </span>
                </h3>
            );

        const priceAdjustmentsSection =
            checkoutStep === CHECKOUT_STEP.PAYMENT ? (
                <div className={classes.price_adjustments_container}>
                    <PriceAdjustments setPageIsUpdating={setIsUpdating} />
                </div>
            ) : null;

        const reviewOrderButton =
            checkoutStep >= CHECKOUT_STEP.PAYMENT ? (
                <Button
                    onClick={handleReviewOrder}
                    onTouchStart={handleReviewOrder}
                    onKeyDown={handleReviewOrderEnterKeyPress}
                    priority="high"
                    className={classes.review_order_button}
                    data-cy="CheckoutPage-reviewOrderButton"
                    disabled={
                        reviewOrderButtonClicked ||
                        isUpdating ||
                        !isPaymentAvailable ||
                        placeLoading
                    }
                >
                    <FormattedMessage
                        id={'checkoutPage.reviewOrder.new'}
                        defaultMessage={'Place Order'}
                    />
                </Button>
            ) : null;

        const itemsReview =
            cartItems ? (
                <div className={classes.items_review_container}>
                    <ItemsReview items={cartItems} />
                </div>
            ) : null;

        const placeOrderButton =
            checkoutStep === CHECKOUT_STEP.REVIEW ? (
                <Button
                    onClick={handlePlaceOrder}
                    onTouchStart={handlePlaceOrder}
                    onKeyDown={handlePlaceOrderEnterKeyPress}
                    priority="high"
                    className={classes.place_order_button}
                    data-cy="CheckoutPage-placeOrderButton"
                    disabled={
                        isUpdating ||
                        placeOrderLoading ||
                        orderDetailsLoading ||
                        placeOrderButtonClicked
                    }
                >
                    <FormattedMessage
                        id={'checkoutPage.placeOrder'}
                        defaultMessage={'Place Order'}
                    />
                </Button>
            ) : null;

        const orderSummary = (
            <div
                className={
                    classes.summaryContainer +
                    (signInContainerVisible
                        ? ' ' + classes.signInContainerVisible
                        : '') +
                    (recaptchaWidgetProps.shouldRender
                        ? ' ' + classes.reCaptchaMargin
                        : '')
                }
            >
                <OrderSummary isUpdating={isUpdating} isCheckoutPage={true} />
            </div>
        );

        let headerText;

        if (isGuestCheckout) {
            headerText = formatMessage({
                id: 'checkoutPage.guestCheckout.new',
                defaultMessage: 'Checkout'
            });
        } else if (customer.default_shipping) {
            headerText = formatMessage({
                id: 'checkoutPage.reviewAndPlaceOrder.new',
                defaultMessage: 'Checkout'
            });
        } else {
            headerText = formatMessage(
                {
                    id: 'checkoutPage.greeting',
                    defaultMessage: 'Welcome {firstname}!'
                },
                { firstname: customer.firstname }
            );
        }

        const checkoutContentClass =
            activeContent === 'checkout'
                ? classes.checkoutContent
                : classes.checkoutContent_hidden;

        const stockStatusMessageElement = (
            <Fragment>
                <FormattedMessage
                    id={'checkoutPage.stockStatusMessage'}
                    defaultMessage={
                        'An item in your cart is currently out-of-stock and must be removed in order to Checkout. Please return to your cart to remove the item.'
                    }
                />
                <Link className={classes.cartLink} to={'/cart'}>
                    <FormattedMessage
                        id={'checkoutPage.returnToCart'}
                        defaultMessage={'Return to Cart'}
                    />
                </Link>
            </Fragment>
        );
        checkoutContent = (
            <div className={checkoutContentClass}>
                <div className={classes.heading_container}>
                    <FormError
                        classes={{
                            root: classes.formErrors
                        }}
                        errors={formErrors}
                    />
                    <StockStatusMessage
                        cartItems={cartItems}
                        message={stockStatusMessageElement}
                    />
                    <h1
                        className={classes.heading}
                        data-cy="ChekoutPage-headerText"
                    >
                        {headerText}
                    </h1>
                </div>
                <div className={classes.checkout_container}>
                    {itemsReview}
                    {signInContainerElement}
                    <div className={shippingInformationClasses}>
                        <ScrollAnchor ref={shippingInformationRef}>
                            <ShippingInformation
                                onSave={setShippingInformationDone}
                                onSuccess={scrollShippingInformationIntoView}
                                toggleActiveContent={toggleAddressBookContent}
                                toggleSignInContent={toggleSignInContent}
                                setGuestSignInUsername={setGuestSignInUsername}
                            />
                        </ScrollAnchor>
                    </div>
                    <div className={classes.shipping_method_container}>
                        <ScrollAnchor ref={shippingMethodRef}>
                            {shippingMethodSection}
                        </ScrollAnchor>
                    </div>
                    <div className={classes.payment_information_container}>
                        {paymentInformationSection}
                    </div>
                    {priceAdjustmentsSection}
                    {placeLoading
                        ? <LoadingIndicator />
                        : !isLoading && <CustomerAttributes />}
                    <div className={classes.summary_content}>
                        {orderSummary}
                        <div className={classes.summary_button}>
                            {reviewOrderButton}
                            {placeOrderButton}
                        </div>
                    </div>
                    <GoogleReCaptcha {...recaptchaWidgetProps} />
                </div>
            </div>
        );
    }

    const addressBookElement = !isGuestCheckout ? (
        <AddressBook
            activeContent={activeContent}
            toggleActiveContent={toggleAddressBookContent}
            onSuccess={scrollShippingInformationIntoView}
        />
    ) : null;

    const signInElement = isGuestCheckout ? (
        <GuestSignIn
            key={guestSignInUsername}
            isActive={activeContent === 'signIn'}
            toggleActiveContent={toggleSignInContent}
            initialValues={{ email: guestSignInUsername }}
        />
    ) : null;

    return (
        <div className={classes.root} data-cy="CheckoutPage-root">
            <div className={classes.sidebar}>
                <QuickLookups />
            </div>
            <div className={classes.content}>
                <StoreTitle>
                    {formatMessage({
                        id: 'checkoutPage.titleCheckout.new',
                        defaultMessage: 'Checkout'
                    })}
                </StoreTitle>
                {checkoutContent}
                {addressBookElement}
                {signInElement}
            </div>
        </div>
    );
};

export default CheckoutPage;

CheckoutPage.propTypes = {
    classes: shape({
        root: string,
        checkoutContent: string,
        checkoutContent_hidden: string,
        heading_container: string,
        checkout_container: string,
        summary_content: string,
        summary_button: string,
        heading: string,
        cartLink: string,
        stepper_heading: string,
        shipping_method_heading: string,
        payment_information_heading: string,
        signInContainer: string,
        signInLabel: string,
        signInButton: string,
        empty_cart_container: string,
        shipping_information_container: string,
        shipping_method_container: string,
        payment_information_container: string,
        price_adjustments_container: string,
        items_review_container: string,
        summaryContainer: string,
        formErrors: string,
        review_order_button: string,
        place_order_button: string,
        signInContainerVisible: string,
        reCaptchaMargin: string
    })
};
