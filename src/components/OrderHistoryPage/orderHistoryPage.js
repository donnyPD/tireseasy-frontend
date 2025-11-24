import React, { useMemo, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
    Search as SearchIcon,
    AlertCircle as AlertCircleIcon,
    ArrowRight as SubmitIcon
} from 'react-feather';
import { shape, string } from 'prop-types';
import { Form } from 'informed';

import { useToasts } from '@magento/peregrine/lib/Toasts';
import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useOrderHistoryPage } from '../../talons/OrderHistoryPage/useOrderHistoryPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import defaultClasses from './orderHistoryPage.module.css';
import OrderRow from './orderRow';
import ResetButton from './resetButton';
import QuickLookups from '../QuickLookups';
import Field from '@magento/venia-ui/lib/components/Field';
import Pagination from '../Pagination';
import SelectSize from '../InvoicesPage/selectSize';
import BrandSearch from './BrandSearch/brandSearch';
import Select from '@magento/venia-ui/lib/components/Select';
import DateRangePicker from './DatePicker/datePicker';
import { getFormattedDate } from '../../talons/OrderHistoryPage/helper';

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);

const OrderHistoryPage = props => {
    const talonProps = useOrderHistoryPage();
    const {
        errorMessage,
        handleReset,
        handleSubmit,
        isBackgroundLoading,
        isLoadingWithoutData,
        orders,
        pageInfo,
        dateFromText,
        setDateFromText,
        dateToText,
        setDateToText,
        isResetBtn,
        pageControl,
        optionsSize,
        pageSize,
        setPageSize,
        isSearching,
        brandList,
        selectOptions,
        brandTextHandle,
        setBrandTextHandle
    } = talonProps;
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'orderHistoryPage.pageTitleText',
        defaultMessage: 'Order History'
    });
    const SEARCH_PLACE_HOLDER = formatMessage({
        id: 'orderHistoryPage.search',
        defaultMessage: 'Search by Order Number'
    });

    const ordersCountMessage = formatMessage(
        {
            id: 'orderHistoryPage.ordersCount',
            defaultMessage: 'You have {count} orders in your history.'
        },
        { count: orders.length }
    );

    const handleDateChange = ({ startDate, endDate }) => {
        if (startDate) {
            setDateFromText(getFormattedDate(startDate))
        }
        if (endDate && getFormattedDate(endDate) !== getFormattedDate(startDate)) {
            setDateToText(getFormattedDate(endDate))
        }
    };

    const classes = useStyle(defaultClasses, props.classes);

    const orderRows = useMemo(() => {
        return orders.map(order => {
            return <OrderRow key={order.id} order={order} />;
        });
    }, [orders]);

    const pageContents = useMemo(() => {
        if (isLoadingWithoutData) {
            return <LoadingIndicator />;
        } else if (!isBackgroundLoading && isSearching && !orders.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'orderHistoryPage.invalidOrderNumber.new'}
                        defaultMessage={'There were no results matching your criteria'}
                    />
                </h3>
            );
        } else if (!isBackgroundLoading && !orders.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'orderHistoryPage.emptyDataMessage'}
                        defaultMessage={"You don't have any orders yet."}
                    />
                </h3>
            );
        } else {
            return (
                <div className={classes.orders_content}>
                    <div className="md_flex justify-between">
                        <h2
                            data-cy="CartPage-heading"
                            className={classes.title}
                        >
                            <FormattedMessage
                                id={'order.history.block'}
                                defaultMessage={'Recent Orders'}
                            />
                        </h2>
                        <SelectSize
                            optionsSize={optionsSize}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                        />
                    </div>
                    <ul
                        className={classes.orderHistoryTable}
                        data-cy="OrderHistoryPage-orderHistoryTable"
                    >
                        <li className={classes.th}>
                            <div>
                                <span className={classes.orderDateLabel}>
                                    <FormattedMessage
                                        id={'orderRow.orderDateText'}
                                        defaultMessage={'Order Date'}
                                    />
                                </span>
                            </div>
                            <div>
                                 <span className={classes.orderNumberLabel}>
                                    <FormattedMessage
                                        id={'orderRow.orderNumberText.new'}
                                        defaultMessage={'Confirmation #'}
                                    />
                                </span>
                            </div>
                            <div>
                                <span className={classes.orderTotalLabel}>
                                    <FormattedMessage
                                        id={'orderRow.poText'}
                                        defaultMessage={'Customer PO #'}
                                    />
                                </span>
                            </div>
                            <div>
                                <span className={classes.orderTotalLabel}>
                                    <FormattedMessage
                                        id={'orderRow.invoiceText'}
                                        defaultMessage={'Invoice #'}
                                    />
                                </span>
                            </div>
                            <div>
                                <span className={classes.orderTotalLabel}>
                                    <FormattedMessage
                                        id={'orderRow.orderTotalText'}
                                        defaultMessage={'Order Total'}
                                    />
                                </span>
                            </div>
                            <div>
                                <span className={classes.orderStatusLabel}>
                                    <FormattedMessage
                                        id={'orderRow.orderStatusText'}
                                        defaultMessage={'Status'}
                                    />
                                </span>
                            </div>
                            <div />
                        </li>
                        {orderRows}
                    </ul>
                </div>
            );
        }
    }, [
        classes.emptyHistoryMessage,
        classes.orderHistoryTable,
        isBackgroundLoading,
        isLoadingWithoutData,
        orderRows,
        orders.length
    ]);

    const pageInfoLabel = pageInfo ? (
        <FormattedMessage
            defaultMessage={'Showing {current} of {total}'}
            id={'orderHistoryPage.pageInfo'}
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
                                defaultMessage={'Your Order History'}
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
                                defaultMessage={'Search Orders'}
                            />
                        </h2>
                        <Form className={classes.search} onSubmit={handleSubmit}>
                            <Field
                                id={classes.search_field}
                                label={formatMessage({
                                    id: 'search.history.number',
                                    defaultMessage: 'Confirmation Number'
                                })}
                            >
                                <TextInput
                                    field="search"
                                    id={classes.search}
                                    placeholder={'e.g., DL-000000003'}
                                />
                            </Field>
                            <Field
                                id={classes.brand_name}
                                label={formatMessage({
                                    id: 'history.brand.name',
                                    defaultMessage: 'Brand'
                                })}
                            >
                                <BrandSearch
                                    brandList={brandList}
                                    brandTextHandle={brandTextHandle}
                                    setBrandTextHandle={setBrandTextHandle}
                                />
                            </Field>
                            <div className={classes.date_container}>
                                <Field
                                    id={classes.status}
                                    label={formatMessage({
                                        id: 'status.code',
                                        defaultMessage: 'Status'
                                    })}
                                >
                                    <Select
                                        field="status"
                                        id={classes.select}
                                        items={selectOptions}
                                    />
                                </Field>
                                <Field
                                    id={classes.invoice_field}
                                    label={formatMessage({
                                        id: 'history.invoice',
                                        defaultMessage: 'Invoice Number'
                                    })}
                                >
                                    <TextInput
                                        field="invoice"
                                        id={classes.invoice}
                                        placeholder={'e.g., 000000035'}
                                    />
                                </Field>
                            </div>
                            <Field
                                id={classes.mfg_code}
                                label={formatMessage({
                                    id: 'history.po.number',
                                    defaultMessage: 'Customer PO #'
                                })}
                            >
                                <TextInput
                                    field="po_number"
                                    id={classes.code}
                                    placeholder={'e.g., 1234'}
                                />
                            </Field>
                            <Field
                                className={classes.date}
                                id={classes.date}
                                label={formatMessage({
                                    id: 'history.date.field',
                                    defaultMessage: 'Date'
                                })}
                            >
                                <DateRangePicker
                                    dateFromText={dateFromText}
                                    dateToText={dateToText}
                                    onChange={handleDateChange}
                                />
                            </Field>
                            <div className={classes.btnContainer}>
                                <Button
                                    className={classes.searchButton}
                                    disabled={
                                        isBackgroundLoading || isLoadingWithoutData
                                    }
                                    priority={'high'}
                                    type="submit"
                                    aria-label="submit"
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
                    {!!orders.length && <>
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

export default OrderHistoryPage;

OrderHistoryPage.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        head_title: string,
        pageInfo_container: string,
        orders_content: string,
        emptyHistoryMessage: string,
        orderHistoryTable: string,
        search: string,
        searchButton: string,
        submitIcon: string,
        loadMoreButton: string
    })
};
