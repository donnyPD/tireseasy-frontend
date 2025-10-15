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
import QuickLookups from "../QuickLookups";
import Field from "@magento/venia-ui/lib/components/Field";

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);
const searchIcon = <Icon src={SearchIcon} size={24} />;

const OrderHistoryPage = props => {
    const talonProps = useOrderHistoryPage();
    const {
        errorMessage,
        loadMoreOrders,
        handleReset,
        handleSubmit,
        isBackgroundLoading,
        isLoadingWithoutData,
        orders,
        pageInfo,
        searchText,
        brandText,
        codeText,
        dateFromText,
        dateToText,
        invoiceText
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

    const classes = useStyle(defaultClasses, props.classes);

    const orderRows = useMemo(() => {
        return orders.slice().sort((a, b) => Date.parse(b.order_date) - Date.parse(a.order_date)).map(order => {
            return <OrderRow key={order.id} order={order} />;
        });
    }, [orders]);

    const pageContents = useMemo(() => {
        if (isLoadingWithoutData) {
            return <LoadingIndicator />;
        } else if (!isBackgroundLoading && searchText && !orders.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'orderHistoryPage.invalidOrderNumber.new'}
                        defaultMessage={`Order was not found.`}
                        values={{
                            number: searchText
                        }}
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
                    <h2
                        data-cy="CartPage-heading"
                        className={classes.title}
                    >
                        <FormattedMessage
                            id={'order.history.block'}
                            defaultMessage={'Recent Orders'}
                        />
                    </h2>
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
                            <div></div>
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
        orders.length,
        searchText
    ]);

    const resetButtonElement = searchText ? (
        <ResetButton onReset={handleReset} />
    ) : null;

    const submitIcon = (
        <Icon
            src={SubmitIcon}
            size={24}
            classes={{
                icon: classes.submitIcon
            }}
        />
    );

    const pageInfoLabel = pageInfo ? (
        <FormattedMessage
            defaultMessage={'Showing {current} of {total}'}
            id={'orderHistoryPage.pageInfo'}
            values={pageInfo}
        />
    ) : null;

    const loadMoreButton = loadMoreOrders ? (
        <Button
            classes={{ root_lowPriority: classes.loadMoreButton }}
            disabled={isBackgroundLoading || isLoadingWithoutData}
            onClick={loadMoreOrders}
            priority="low"
        >
            <FormattedMessage
                id={'orderHistoryPage.loadMore'}
                defaultMessage={'Load More'}
            />
        </Button>
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
                                    defaultMessage: 'Order Number'
                                })}
                            >
                                <TextInput
                                    field="search"
                                    id={classes.search}
                                    placeholder={'e.g., 003'}
                                />
                            </Field>
                            <Field
                                id={classes.brand_name}
                                label={formatMessage({
                                    id: 'history.brand.name',
                                    defaultMessage: 'Brand'
                                })}
                            >
                                <TextInput
                                    field="brand"
                                    id={classes.brand}
                                    placeholder={'e.g., Michelin'}
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
                                    placeholder={'e.g., 001'}
                                />
                            </Field>
                            <Field
                                id={classes.mfg_code}
                                label={formatMessage({
                                    id: 'history.mfg.code',
                                    defaultMessage: 'Product Number'
                                })}
                            >
                                <TextInput
                                    field="mfg_code"
                                    id={classes.code}
                                    placeholder={'e.g., 0123456'}
                                />
                            </Field>
                            <div className={classes.date_container}>
                                <Field
                                    className={classes.date}
                                    id={classes.date_from}
                                    label={formatMessage({
                                        id: 'history.date.field',
                                        defaultMessage: 'Date From'
                                    })}
                                >
                                    <TextInput
                                        type="date"
                                        field="date_from"
                                        name="calendar"
                                        id={classes.calendar}
                                    />
                                </Field>
                                <Field
                                    className={classes.date}
                                    id={classes.date_to}
                                    label={formatMessage({
                                        id: 'history.date.field',
                                        defaultMessage: 'Date To'
                                    })}
                                >
                                    <TextInput
                                        type="date"
                                        field="date_to"
                                        name="calendar"
                                        id={classes.calendar}
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
                                >
                                    <FormattedMessage
                                        id={'order.history.search.btn'}
                                        defaultMessage={'Search'}
                                    />
                                </Button>
                                {searchText || brandText || codeText || dateFromText || dateToText || invoiceText ? <ResetButton onReset={handleReset} /> : null}
                            </div>
                        </Form>
                    </div>
                    {pageContents}
                    <div className={classes.pageInfo_container}>
                        <span className={classes.pageInfo}>{pageInfoLabel}</span>
                    </div>
                    {loadMoreButton}
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
