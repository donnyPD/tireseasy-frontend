import React, { useEffect, useState } from 'react';
import { arrayOf, number, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './invoiceRow.module.css';
import Price from '@magento/venia-ui/lib/components/Price';
import Checkbox from './checkbox';

const InvoiceRow = props => {
    const { invoice, checkedAll, checkedInvoices, setCheckedInvoices } = props;
    const [checked, setChecked] = useState(false);
    const {
        grand_total,
        created_at,
        status,
        invoice_number,
        payment_due_date
    } = invoice;
    const invoiceNumber = invoice_number || '';
    const invoiceDate = created_at || '';
    const paymentDate = payment_due_date || '';

    // Convert date to ISO-8601 format so Safari can also parse it
    const isoFormattedDate = invoiceDate.replace(' ', 'T').split('T')[0];
    const { currency, value: invoiceTotal } = grand_total;

    useEffect(() => {
        setChecked(checkedAll)
    }, [checkedAll]);

    const orderTotalPrice =
        currency && invoiceTotal ? (
            <Price currencyCode={currency} value={invoiceTotal} />
        ) : (
            '-'
        );

    const classes = useStyle(defaultClasses, props.classes);

    const statusClasses = status && status === 'Paid'
        ? classes.invoiceStatusPaid : status === 'Open'
            ? classes.invoiceStatusOpen : status === 'Overdue'
                ? classes.invoiceStatusOverdue : classes.invoiceStatus;

    const handleChecked = () => {
        if (checked) {
            if (checkedInvoices.indexOf(invoiceNumber) !== -1) {
                setCheckedInvoices(checkedInvoices.filter(el => el !== invoiceNumber));
            }
        }
        else {
            setCheckedInvoices(invoices => [...invoices, invoiceNumber])
        }
        setChecked(!checked)
    };

    return (
        <li className={classes.root}>
            <div className={classes.invoiceCheckbox}>
                <Checkbox checked={checked} handleChange={handleChecked} />
            </div>
            <div className={classes.invoiceDateContainer}>
                <span className={classes.invoiceDateLabel}>
                    <FormattedMessage
                        id={'invoiceRow.orderDateText'}
                        defaultMessage={'Invoice Date'}
                    />
                </span>
                <span className={classes.invoiceDate}>{isoFormattedDate}</span>
            </div>
            <div className={classes.invoiceNumberContainer}>
                <span className={classes.invoiceNumber}>{invoiceNumber}</span>
            </div>
            <div className={classes.invoiceDateContainer}>
                <span className={classes.invoiceNumberLabel}>
                    <FormattedMessage
                        id={'invoiceRow.orderNumberText.new'}
                        defaultMessage={'Payment Due Date'}
                    />
                </span>
                <span className={`${classes.invoiceDate} ${status === 'Overdue' ? classes.invoiceDateOverdue : ''}`}>
                    {paymentDate}
                </span>
            </div>
            <div className={classes.invoiceTotalContainer}>
                <span className={classes.invoiceTotalLabel}>
                    <FormattedMessage
                        id={'invoiceRow.orderTotalText'}
                        defaultMessage={'Total Amount'}
                    />
                </span>
                <div className={classes.invoiceTotal}>{orderTotalPrice}</div>
            </div>
            <div className={classes.invoiceStatusContainer}>
                <span className={statusClasses}>
                    {status}
                </span>
            </div>
        </li>
    );
};

export default InvoiceRow;
InvoiceRow.propTypes = {
    classes: shape({
        root: string,
        root_label: string,
        cell: string,
        stackedCell: string,
        label: string,
        value: string,
        invoiceCheckbox: string,
        invoiceNumberContainer: string,
        invoiceDateContainer: string,
        invoiceTotalContainer: string,
        invoiceStatusContainer: string,
        invoiceItemsContainer: string,
        contentToggleContainer: string,
        orderNumberLabel: string,
        orderDateLabel: string,
        orderTotalLabel: string,
        invoiceNumber: string,
        invoiceDate: string,
        invoiceDateOverdue: string,
        invoiceTotal: string,
        invoiceStatus: string,
        invoiceStatusPaid: string,
        invoiceStatusOpen: string,
        invoiceStatusOverdue: string,
        content: string,
        content_collapsed: string
    }),
};
