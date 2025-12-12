import React, { useMemo, useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
    AlertCircle as AlertCircleIcon,
    Printer as PrinterIcon,
    Mail as MailIcon,
    Download as DownloadIcon,
    Info as InfoIcon,
} from 'react-feather';
import { shape, string } from 'prop-types';
import { Form } from 'informed';

import { useToasts } from '@magento/peregrine/lib/Toasts';
import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useInvoicePage } from '../../talons/InvoicePage/useInvoicePage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import defaultClasses from './invoicePage.module.css';
import InvoiceRow from './invoiceRow';
import ResetButton from './resetButton';
import QuickLookups from '../QuickLookups';
import Field from '@magento/venia-ui/lib/components/Field';
import Select from '@magento/venia-ui/lib/components/Select';
import Checkbox from './checkbox';
import Pagination from '../Pagination';
import SelectSize from './selectSize';
import { getFormattedDate } from '../../talons/OrderHistoryPage/helper';
import DateRangePicker from '../OrderHistoryPage/DatePicker/datePicker';

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);

const printerIcon = <PrinterIcon size={18} />;
const mailIcon = <MailIcon size={18} />;
const downloadIcon = <DownloadIcon size={18} />;

const InvoicePage = props => {
    const talonProps = useInvoicePage();
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'orderHistoryPage.pageTitleText',
        defaultMessage: 'Invoices'
    });
    const {
        errorMessage,
        handleReset,
        handleSubmit,
        isBackgroundLoading,
        isLoadingWithoutData,
        pageInfo,
        dateFromText,
        setDateFromText,
        dateToText,
        setDateToText,
        invoices,
        options,
        pageControl,
        optionsSize,
        pageSize,
        setPageSize,
        isSearching,
        isResetBtn
    } = talonProps;

    const [checkedAll, setCheckedAll] = useState(false);
    const [checkedInvoices, setCheckedInvoices] = useState([]);
    const [isSearchClick, setIsSearchClick] = useState(false);

    const ordersCountMessage = formatMessage(
        {
            id: 'orderHistoryPage.ordersCount',
            defaultMessage: 'You have {count} Invoices.'
        },
        { count: invoices.length }
    );

    const handleDateChange = ({ startDate, endDate }) => {
        if (startDate) {
            setDateFromText(getFormattedDate(startDate));
        }
        if (endDate && getFormattedDate(endDate) !== getFormattedDate(startDate)) {
            setDateToText(getFormattedDate(endDate));
        }
        if (endDate && getFormattedDate(endDate) === getFormattedDate(startDate)) {
            setDateToText('');
        }
    };

    const resetDate = () => {
        setDateFromText('')
        setDateToText('');
    };

    const classes = useStyle(defaultClasses, props.classes);

    const invoiceRows = useMemo(() => {
        return invoices.map(invoice => {
            return <InvoiceRow
                key={invoice.invoice_number}
                invoice={invoice}
                checkedAll={checkedAll}
                checkedInvoices={checkedInvoices}
                setCheckedInvoices={setCheckedInvoices}
            />;
        });
    }, [invoices, checkedAll, checkedInvoices]);

    const handleChecked = () => {
        setCheckedAll(!checkedAll)
    }

    useEffect(() => {
        if (checkedAll) {
            const list = [];
            invoices.map((el) => list.push(el.invoice_number));
            setCheckedInvoices(list);
        } else {
            setCheckedInvoices([]);
        }
    }, [checkedAll]);

    const buttonsBlock = (
        <div className={classes.buttonsBlock}>
            <Button
                classes={classes.printButton}
                disabled={!checkedInvoices.length}
            >
                {printerIcon}
                <span>
                    <FormattedMessage
                        id={'invoicePage.print.btn'}
                        defaultMessage={'Print'}
                    />
                </span>
            </Button>
            <Button
                classes={classes.emailButton}
                disabled={!checkedInvoices.length}
            >
                {mailIcon}
                <span>
                    <FormattedMessage
                        id={'invoicePage.email.btn'}
                        defaultMessage={'Email'}
                    />
                </span>
            </Button>
            <Button
                classes={classes.downloadButton}
                disabled={!checkedInvoices.length}
            >
                {downloadIcon}
                <span>
                    <FormattedMessage
                        id={'invoicePage.download.btn'}
                        defaultMessage={'Download'}
                    />
                </span>
            </Button>
        </div>
    );

    const pageContents = useMemo(() => {
        if (isLoadingWithoutData) {
            return <LoadingIndicator />;
        } else if (!isBackgroundLoading && isSearching && !invoices.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'orderHistoryPage.invalidOrderNumber.new'}
                        defaultMessage={`There were no results matching your criteria`}
                    />
                </h3>
            );
        } else if (!isBackgroundLoading && !invoices.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'orderHistoryPage.emptyDataMessage.new'}
                        defaultMessage={"You don't have any invoices yet."}
                    />
                </h3>
            );
        } else {
            return (
                <div className={classes.orders_content}>
                    <div className="md_flex justify-between">
                        <SelectSize
                            optionsSize={optionsSize}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                        />
                        {buttonsBlock}
                    </div>
                    <ul
                        className={classes.orderHistoryTable}
                        data-cy="InvoicePage-orderHistoryTable"
                    >
                        <li className={classes.th}>
                            <div className={classes.invoiceCheckbox}>
                                <Checkbox checked={checkedAll} handleChange={handleChecked} label={'Select All'} />
                            </div>
                            <div>
                                <span className={classes.invoiceDateLabel}>
                                    <FormattedMessage
                                        id={'invoiceRow.orderDateText'}
                                        defaultMessage={'Invoice Date'}
                                    />
                                </span>
                            </div>
                            <div>
                                 <span className={classes.invoiceNumberLabel}>
                                    <FormattedMessage
                                        id={'invoiceRow.orderNumberText.new'}
                                        defaultMessage={'Invoice Number'}
                                    />
                                </span>
                            </div>
                            <div>
                                <span className={classes.invoiceTotalLabel}>
                                    <FormattedMessage
                                        id={'invoiceRow.poText'}
                                        defaultMessage={'Payment Due Date'}
                                    />
                                </span>
                            </div>
                            <div className={classes.invoiceTotalCell}>
                                <span className={classes.invoiceTotalLabel}>
                                    <FormattedMessage
                                        id={'invoiceRow.orderTotalText'}
                                        defaultMessage={'Total Amount'}
                                    />
                                </span>
                            </div>
                            {/*<div>*/}
                            {/*    <span className={classes.invoiceStatusLabel}>*/}
                            {/*        <FormattedMessage*/}
                            {/*            id={'invoiceRow.orderStatusText'}*/}
                            {/*            defaultMessage={'Status'}*/}
                            {/*        />*/}
                            {/*    </span>*/}
                            {/*</div>*/}
                        </li>
                        {invoiceRows}
                    </ul>
                </div>
            );
        }
    }, [
        classes.emptyHistoryMessage,
        classes.orderHistoryTable,
        isBackgroundLoading,
        isLoadingWithoutData,
        invoiceRows,
        invoices.length,
        checkedInvoices
    ]);

    const pageInfoLabel = pageInfo ? (
        <FormattedMessage
            defaultMessage={'Showing {current} of {total}'}
            id={'invoicePage.pageInfo'}
            values={pageInfo}
        />
    ) : null;

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: errorMessage,
                dismissable: true,
                timeout: 10000
            });
        }
    }, [addToast, errorMessage]);

    return (
        <OrderHistoryContextProvider>
            <div className={classes.root}>
                <div className={classes.sidebar}>
                    <QuickLookups />
                </div>
                <div className={classes.content}>
                    <StoreTitle>{PAGE_TITLE}</StoreTitle>
                    <div aria-live="polite" className={classes.heading}>
                        <h1
                            aria-live="polite"
                            data-cy="CartPage-heading"
                            className={classes.head_title}
                        >
                            <FormattedMessage
                                id={'order.heading.new'}
                                defaultMessage={'Invoices'}
                            />
                        </h1>
                        <div aria-live="polite" aria-label={ordersCountMessage} />
                    </div>

                    <div className={classes.filterRow}>
                        <h2
                            aria-live="polite"
                            data-cy="CartPage-heading"
                            className={classes.title}
                        >
                            <FormattedMessage
                                id={'order.history.block.new'}
                                defaultMessage={'Search Invoices'}
                            />
                        </h2>
                        <Form className={classes.search} onSubmit={handleSubmit}>
                            <Field
                                id={classes.invoice_field}
                                label={formatMessage({
                                    id: 'invoice.invoice',
                                    defaultMessage: 'Invoice Number'
                                })}
                            >
                                <TextInput
                                    field="invoice"
                                    id={classes.invoice}
                                    placeholder={'e.g., 000000035'}
                                />
                            </Field>
                            <Field
                                id={classes.search_field}
                                label={formatMessage({
                                    id: 'invoice.order.number',
                                    defaultMessage: 'Order Number'
                                })}
                            >
                                <TextInput
                                    field="order"
                                    id={classes.search}
                                    placeholder={'e.g., DL-000000003'}
                                />
                            </Field>
                            <div className={classes.total_container}>
                                <Field
                                    id={classes.total}
                                    label={formatMessage({
                                        id: 'invoice.total.from',
                                        defaultMessage: 'Total $'
                                    })}
                                >
                                    <TextInput
                                        field="total_from"
                                        id={classes.search}
                                        placeholder={'From: e.g., 145'}
                                    />
                                </Field>
                                <Field
                                    id={classes.total}
                                    label={formatMessage({
                                        id: 'invoice.total.to',
                                        defaultMessage: 'To'
                                    })}
                                >
                                    <TextInput
                                        field="total_to"
                                        id={classes.search}
                                        placeholder={'To: e.g., 3000'}
                                    />
                                </Field>
                            </div>
                            {/*<Field*/}
                            {/*    id={classes.status}*/}
                            {/*    label={formatMessage({*/}
                            {/*        id: 'status.code',*/}
                            {/*        defaultMessage: 'Status'*/}
                            {/*    })}*/}
                            {/*>*/}
                            {/*    <Select*/}
                            {/*        field="status"*/}
                            {/*        id={classes.select}*/}
                            {/*        items={options}*/}
                            {/*    />*/}
                            {/*</Field>*/}
                            <div className={classes.date_container}>
                                <Field
                                    className={classes.date}
                                    id={classes.date}
                                    label={formatMessage({
                                        id: 'invoice.date.field',
                                        defaultMessage: 'Date'
                                    })}
                                >
                                    <span className={classes.info}>
                                        <InfoIcon size={18} />
                                        <span className={classes.info_content}>
                                            <FormattedMessage
                                                id={'order.history.info.text'}
                                                defaultMessage={'Filter includes Invoice and Payment Due Dates'}
                                            />
                                        </span>
                                    </span>
                                    <DateRangePicker
                                        dateFromText={dateFromText}
                                        dateToText={dateToText}
                                        onChange={handleDateChange}
                                        resetDate={resetDate}
                                        isSearchClick={isSearchClick}
                                        setIsSearchClick={setIsSearchClick}
                                    />
                                </Field>
                            </div>
                            <div className={classes.btnContainer}>
                                <Button
                                    className={classes.searchButton}
                                    disabled={
                                        isBackgroundLoading || isLoadingWithoutData
                                    }
                                    priority={'high'}
                                    type="submit"
                                    aria-label="submit"
                                    onClick={() => setIsSearchClick(true)}
                                >
                                    <FormattedMessage
                                        id={'order.history.search.btn'}
                                        defaultMessage={'Search'}
                                    />
                                </Button>
                                {isResetBtn ? <ResetButton onReset={handleReset} /> : null}
                            </div>
                        </Form>
                    </div>
                    {pageContents}
                    {!!invoices.length && <>
                        <div className={classes.pageInfo_container}>
                            <span className={classes.pageInfo}>{pageInfoLabel}</span>
                        </div>
                        <section className={classes.pagination}>
                            <Pagination pageControl={pageControl} />
                        </section>
                    </>}
                </div>
            </div>
        </OrderHistoryContextProvider>
    );
};

export default InvoicePage;

InvoicePage.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        head_title: string,
        pageInfo_container: string,
        orders_content: string,
        emptyHistoryMessage: string,
        orderHistoryTable: string,
        invoiceDateLabel: string,
        invoiceNumberLabel: string,
        invoiceTotalCell: string,
        invoiceTotalLabel: string,
        invoiceStatusLabel: string,
        search: string,
        invoiceCheckbox: string,
        buttonsBlock: string,
        printButton: string,
        downloadButton: string,
        emailButton: string,
        searchButton: string,
        submitIcon: string,
        loadMoreButton: string,
        total_container: string,
        info_content: string,
        btnContainer: string,
        info: string,
        info_container: string,
        filterRow: string
    })
};
