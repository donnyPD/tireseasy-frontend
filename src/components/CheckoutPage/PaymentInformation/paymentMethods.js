import React, { useEffect, useRef } from 'react';
import { shape, string, bool, func } from 'prop-types';
import { useIntl } from 'react-intl';
import { usePaymentMethods } from '../../../talons/CheckoutPage/PaymentInformation/usePaymentMethods';
import { useStyle } from '@magento/venia-ui/lib/classify';
import RadioGroup from '../../RadioGroup';
import Radio from '../../RadioGroup/radio';
import defaultClasses from './paymentMethods.module.css';
import payments from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethodCollection';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

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
            const firstMethod = availablePaymentMethods[0];
            handlePaymentMethodSelection({
                target: {
                    value: firstMethod.code
                }
            });
            if (radioRef.current) {
                radioRef.current.click();
            }
        }
    }, [availablePaymentMethods, currentSelectedPaymentMethod, cartId]);

    if (isLoading) {
        return null;
    }

    const radios = availablePaymentMethods
        .map(({ code, title }, i) => {
            // If we don't have an implementation for a method type, ignore it.
            if (!Object.keys(payments).includes(code)) {
                return;
            }

            const id = `paymentMethod--${code}`;
            const isSelected = currentSelectedPaymentMethod === code;
            const PaymentMethodComponent = payments[code];
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
                        labelRef={i === 0 ? radioRef : null}
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
