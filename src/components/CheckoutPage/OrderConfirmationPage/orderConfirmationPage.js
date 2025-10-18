import React, { useEffect, useState, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { object, shape, string } from 'prop-types';
import { useOrderConfirmationPage } from '../../../talons/CheckoutPage/OrderConfirmationPage/useOrderConfirmationPage';

import { Link, useLocation } from 'react-router-dom';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CreateAccount from '@magento/venia-ui/lib/components/CheckoutPage/OrderConfirmationPage/createAccount';
import ItemsReview from '../ItemsReview';
import defaultClasses from './orderConfirmationPage.module.css';
import QuickLookups from '../../QuickLookups';
import resourceUrl from "@magento/peregrine/lib/util/makeUrl";

const OrderConfirmationPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const location = useLocation();
    const data = props.data;
    const orderNumber = props.orderNumber || location.state.orderNumber;
    const cartItems = data ? data.cart.items : location.state.items;

    const talonProps = useOrderConfirmationPage({
        data,
        orderNumber
    });

    const { flatData, isSignedIn, loading, punchoutSuccessData } = talonProps;
    const formRef = useRef(null);

    useEffect(() => {
        const { scrollTo } = globalThis;

        if (typeof scrollTo === 'function') {
            scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
        }
    }, []);

    const [isPunchoutData, setIsPunchoutData] = useState(false);
    useEffect(() => {
        if (punchoutSuccessData && punchoutSuccessData?.success_redirect_url) {
            setIsPunchoutData(true);
        }
    }, [punchoutSuccessData]);
    useEffect(() => {
        if (isPunchoutData && punchoutSuccessData?.success_redirect_url) {
            const timer = setInterval(() => {
                if (formRef.current) {
                    setTimeout(() => {
                        formRef.current.submit();
                        setIsPunchoutData(false);
                    }, 1000);
                }
            }, 100);
            return () => clearInterval(timer);
        }
    }, [isPunchoutData, formRef.current]);

    if (!flatData || loading) {
        return fullPageLoadingIndicator;
    } else {
        const {
            city,
            country,
            email,
            firstname,
            lastname,
            postcode,
            region
        } = flatData;

        const createAccountForm = !isSignedIn ? (
            <CreateAccount
                firstname={firstname}
                lastname={lastname}
                email={email}
            />
        ) : null;

        return (
            <div className={classes.root} data-cy="OrderConfirmationPage-root">
                <div className={classes.sidebar}>
                    <QuickLookups />
                </div>
                <div className={classes.content}>
                    <h1
                        className={classes.heading}
                        data-cy="SuccessPage-headerText"
                    >
                        <FormattedMessage
                            id={'checkoutSuccessPage.heading'}
                            defaultMessage={'Order Confirmation'}
                        />
                    </h1>
                    <div className={classes.mainContainer}>
                        <h2
                            data-cy="OrderConfirmationPage-header"
                            className={classes.heading}
                        >
                            <FormattedMessage
                                id={'checkoutPage.thankYou.new'}
                                defaultMessage={'Thank You for Your Order!'}
                            />
                        </h2>
                        <span className={classes.text}>
                            <FormattedMessage
                                id={'checkoutPage.thankYou.text'}
                                defaultMessage={'Your order has been successfully and is now being processed.'}
                            />
                        </span>
                        <div
                            data-cy="OrderConfirmationPage-orderNumber"
                            className={classes.orderNumber}
                        >
                            <FormattedMessage
                                id={'checkoutPage.orderNumber.text'}
                                defaultMessage={'Order Confirmation Number: '}
                            />
                            <span className={classes.order_number}>
                                <FormattedMessage
                                    id={'checkoutPage.orderNumber.number'}
                                    defaultMessage={'{orderNumber}'}
                                    values={{ orderNumber }}
                                />
                            </span>
                        </div>
                        <div
                            data-cy="OrderConfirmationPage-additionalText"
                            className={classes.additionalText}
                        >
                            <FormattedMessage
                                id={'checkoutPage.additionalText.new'}
                                defaultMessage={
                                    'A detailed confirmation email with tracking information will be sent to your registered email address shortly.'
                                }
                            />
                        </div>
                        {createAccountForm}
                    </div>
                    <div className={classes.itemsReview}>
                        <ItemsReview items={cartItems} />
                    </div>
                    <div className={classes.button_container}>
                        <Link to={resourceUrl('/')} className={classes.link}>
                            <FormattedMessage id={'success.checkoutButton'} defaultMessage={'Continue Shopping'} />
                        </Link>
                    </div>
                    <div>
                        <form
                            ref={formRef}
                            id="cxml_form" method="POST"
                            action={punchoutSuccessData && punchoutSuccessData?.success_redirect_url
                                ? punchoutSuccessData?.success_redirect_url
                                : ''}
                            encType="application/x-www-form-urlencoded"
                        >

                            <input
                                type="hidden" name="cXML-base64"
                                value={punchoutSuccessData && punchoutSuccessData?.base64_order_cxml
                                    ? punchoutSuccessData?.base64_order_cxml
                                    : ''}
                            />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
};

export default OrderConfirmationPage;

OrderConfirmationPage.propTypes = {
    classes: shape({
        addressStreet: string,
        mainContainer: string,
        heading: string,
        orderNumber: string,
        shippingInfoHeading: string,
        shippingInfo: string,
        email: string,
        name: string,
        addressAdditional: string,
        shippingMethodHeading: string,
        shippingMethod: string,
        itemsReview: string,
        additionalText: string,
        button_container: string,
        sidebarContainer: string
    }),
    data: object,
    orderNumber: string
};
