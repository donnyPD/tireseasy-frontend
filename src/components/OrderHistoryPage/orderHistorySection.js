import React, { useMemo, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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
import { Form } from 'informed';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Button from '@magento/venia-ui/lib/components/Button';
import ResetButton from './resetButton';
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
        dateFromText,
        setDateFromText,
        dateToText,
        setDateToText,
        isResetBtn,
        isSearching,
        brandList,
        selectOptions,
        brandTextHandle,
        setBrandTextHandle
    } = talonProps;
    const [, { addToast }] = useToasts();
    const { isHomepage } = props;
    const { formatMessage } = useIntl();

    const [isSearchClick, setIsSearchClick] = useState(false);

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
                <></>
            );
        } else {
            return (
                <div className={isHomepage ? classes.orders_content_section : classes.orders_content}>
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

    const showMoreButton = pageInfo && pageInfo.total > pageInfo.current ? (
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
                <h2
                    data-cy="CartPage-heading"
                    className={classes.title_section}
                >
                    <FormattedMessage
                        id={'order.history.block'}
                        defaultMessage={'Order History'}
                    />
                </h2>
                <div className={classes.filterRow}>
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
                                resetDate={resetDate}
                                isSearchClick={isSearchClick}
                                setIsSearchClick={setIsSearchClick}
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
