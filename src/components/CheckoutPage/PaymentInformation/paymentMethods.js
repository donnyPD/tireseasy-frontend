import React, { useEffect, useRef } from 'react';
import { shape, string, bool, func } from 'prop-types';
import { useIntl } from 'react-intl';
import { usePaymentMethods } from '../../../talons/CheckoutPage/PaymentInformation/usePaymentMethods';
import { useStyle } from '@magento/venia-ui/lib/classify';
import RadioGroup from '../../RadioGroup';
import Radio from '../../RadioGroup/radio';
import defaultClasses from './paymentMethods.module.css';
import payments from './paymentMethodCollection';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
const DEFAULT_METHOD = 'invoice';

const PaymentMethods = props => {
    const {
        classes: propClasses,
        onPaymentError,
        onPaymentSuccess,
        resetShouldSubmit,
        shouldSubmit
    } = props;

    const { formatMessage } = useIntl();

    const [{ cartId }] = useCartContext();
    const radioRef = useRef(null);

    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = usePaymentMethods({});

    const {
        availablePaymentMethods,
        currentSelectedPaymentMethod,
        handlePaymentMethodSelection,
        initialSelectedMethod,
        isLoading
    } = talonProps;

    useEffect(() => {
        if (!currentSelectedPaymentMethod && availablePaymentMethods?.length > 0) {
            const invoiceMethod = availablePaymentMethods.filter(el => el.code === DEFAULT_METHOD)[0];
            if (invoiceMethod) {
                handlePaymentMethodSelection({
                    target: {
                        value: invoiceMethod.code
                    }
                });
            }
            if (radioRef.current) {
                radioRef.current.click();
            }
        }
    }, [availablePaymentMethods, currentSelectedPaymentMethod, cartId]);

    if (isLoading) {
        return null;
    }

    const radios = availablePaymentMethods
        .map(({ code, title }) => {
            // If we don't have an implementation for a method type, ignore it.
            // Set invoice payment Method as the only one
            if (!Object.keys(payments).includes(code) || code !== DEFAULT_METHOD) {
                return;
            }
            const id = `paymentMethod--${code}`;
            const isSelected = currentSelectedPaymentMethod === code;
            const PaymentMethodComponent = code === DEFAULT_METHOD ? payments[code].component : payments[code];
            const renderedComponent = isSelected ? (
                <PaymentMethodComponent
                    onPaymentSuccess={onPaymentSuccess}
                    onPaymentError={onPaymentError}
                    resetShouldSubmit={resetShouldSubmit}
                    shouldSubmit={shouldSubmit}
                />
            ) : null;

            return (
                <div key={code} className={classes.payment_method}>
                    <Radio
                        id={id}
                        label={title}
                        value={code}
                        labelRef={code === DEFAULT_METHOD ? radioRef : null}
                        classes={{
                            label: classes.radio_label
                        }}
                        checked={isSelected}
                        onChange={handlePaymentMethodSelection}
                    />
                    {renderedComponent}
                </div>
            );
        })
        .filter(paymentMethod => !!paymentMethod);

    const noPaymentMethodMessage = !radios.length ? (
        <div className={classes.payment_errors}>
            <span>
                {formatMessage({
                    id: 'checkoutPage.paymentLoadingError',
                    defaultMessage: 'There was an error loading payments.'
                })}
            </span>
            <span>
                {formatMessage({
                    id: 'checkoutPage.refreshOrTryAgainLater',
                    defaultMessage: 'Please refresh or try again later.'
                })}
            </span>
        </div>
    ) : null;

    return (
        <div className={classes.root}>
            <RadioGroup
                classes={{ root: classes.radio_group }}
                field="selectedPaymentMethod"
                initialValue={initialSelectedMethod}
            >
                {radios}
            </RadioGroup>
            {noPaymentMethodMessage}
        </div>
    );
};

export default PaymentMethods;

PaymentMethods.propTypes = {
    classes: shape({
        root: string,
        payment_method: string,
        radio_label: string
    }),
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func,
    selectedPaymentMethod: string,
    shouldSubmit: bool
};
