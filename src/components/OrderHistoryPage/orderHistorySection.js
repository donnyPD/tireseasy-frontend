import React, { useMemo, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import {
    AlertCircle as AlertCircleIcon,
} from 'react-feather';
import { shape, string } from 'prop-types';

import { useToasts } from '@magento/peregrine/lib/Toasts';
import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useOrderHistoryPage } from '../../talons/OrderHistoryPage/useOrderHistoryPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import defaultClasses from './orderHistoryPage.module.css';
import OrderRow from './orderRow';

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);

const OrderHistorySection = props => {
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
    const { isHomepage } = props;

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
                <></>
            );
        } else {
            return (
                <div className={isHomepage ? classes.orders_content_section : classes.orders_content}>
                    <h2
                        data-cy="CartPage-heading"
                        className={classes.title_section}
                    >
                        <FormattedMessage
                            id={'order.history.block'}
                            defaultMessage={'Order History'}
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


    const showMoreButton = loadMoreOrders ? (
            <Link
                to={resourceUrl('/order-history')}
                className={classes.more}
                aria-label="Show More"
            >
                <FormattedMessage
                    id={'show.more.button'}
                    defaultMessage={'Show More'}
                />
            </Link>
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
            <div className={classes.section}>
                {pageContents}
                {showMoreButton}
            </div>
        </OrderHistoryContextProvider>
    );
};

export default OrderHistorySection;

OrderHistorySection.propTypes = {
    classes: shape({
        root: string,
        more: string,
        heading: string,
        head_title: string,
        pageInfo_container: string,
        orders_content: string,
        orders_content_section: string,
        emptyHistoryMessage: string,
        orderHistoryTable: string,
        search: string,
        title_section: string,
        searchButton: string,
        submitIcon: string,
        loadMoreButton: string
    })
};
