import React, { useEffect, useState, useRef } from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import { Form } from 'informed';
import { shape, string, } from 'prop-types';

import {
    useCheckoutPage,
} from '../../talons/CheckoutPage/useCheckoutPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './checkoutPage.module.css';
import Field from '@magento/venia-ui/lib/components/Field';


const CustomerAttributes = props => {
    const {
        classes: propClasses,
        poMessageError,
        setPoMessageError,
        setPoAttributeValidation,
    } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);
    const talonProps = useCheckoutPage();
    const { handleCustomAttributes, customAttributes } = talonProps;
    const [inputValue, setInputValue] = useState(customAttributes.poNumbers);
    const [textareaValue, setTextareaValue] = useState(customAttributes.customerComment);
    const [focusInput, setFocusInput] = useState(false);
    const [focusTextarea, setFocusTextarea] = useState(false);
    const inputRef = useRef(null);
    const textareaRef = useRef(null);
    const blockRef = useRef(null);
    const inputClasses = poMessageError ? classes.input_number_error : classes.input_number;

    useEffect(() => {
        if (inputRef.current !== document.activeElement && textareaRef.current !== document.activeElement) {
            if (inputValue !== customAttributes.poNumbers || textareaValue !== customAttributes.customerComment) {
                handleCustomAttributes(
                    {
                        po_number: inputValue,
                        customer_comment: textareaValue,
                    }
                );
            }
        }
    }, [inputValue, textareaValue, focusInput, focusTextarea]);
    useEffect(() => {
        if (inputValue !== '') {
            setPoAttributeValidation(false);
            setPoMessageError(false);
        } else {
            setPoAttributeValidation(true);
        }
    }, [inputValue]);

    const customerInput = (
        <div>
            <Field
                id="customer_po_number"
                label={formatMessage({
                    id: 'global.customer.number',
                    defaultMessage: 'Customer PO Number (Required)'
                })}
            >
                <input
                    className={inputClasses}
                    type="text"
                    id="customer_po_number"
                    ref={inputRef}
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onFocus={() => setFocusInput(true)}
                    onBlur={() => setFocusInput(false)}
                />
                {poMessageError && <div className={classes.message_error}>
                    <FormattedMessage
                        id={'checkoutPage.po.error.message'}
                        defaultMessage={'* Required field'}
                    />
                </div>}
            </Field>
        </div>
    );

    const customerTextarea = (
        <div>
            <Field
                id="customer_comment"
                label={formatMessage({
                    id: 'global.customer.comment',
                    defaultMessage: 'Order Comments'
                })}
            >
                <textarea
                    className={classes.textarea_comment}
                    id="customer_comment"
                    ref={textareaRef}
                    rows={5}
                    value={textareaValue}
                    onChange={(event) => setTextareaValue(event.target.value)}
                    onFocus={() => setFocusTextarea(true)}
                    onBlur={() => setFocusTextarea(false)}
                />
            </Field>
        </div>
    );

    return (
        <div className={classes.root_attr} ref={blockRef}>
            <Form>
                {customerInput}
                {customerTextarea}
            </Form>
        </div>
    );
};

export default CustomerAttributes;

CustomerAttributes.propTypes = {
    classes: shape({
        container: string,
        root_attr: string,
        input_number: string,
        textarea_comment: string,
        po_number: string
    })
};
