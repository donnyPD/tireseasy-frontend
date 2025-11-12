import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './orderHistoryPage.gql';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';

const PAGE_SIZE = 10;

export const useOrderHistoryPage = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCustomerOrdersQuery } = operations;

    const [, { actions: { setPageLoading } }] = useAppContext();

    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [brandText, setBrandText] = useState('');
    const [codeText, setCodeText] = useState('');
    const [dateFromText, setDateFromText] = useState('');
    const [dateToText, setDateToText] = useState('');
    const [invoiceText, setInvoiceText] = useState('');

    const optionsSize = [
        { value: 10, label: '10' },
        { value: 25, label: '25' },
        { value: 50, label: '50' },
        { value: 100, label: '100' }
    ];

    const {
        data: orderData,
        error: getOrderError,
        loading: orderLoading
    } = useQuery(getCustomerOrdersQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            filter: {
                number: {
                    match: searchText
                },
                created_at: {
                    from: dateFromText,
                    to: dateToText
                },
                invoice_number: {
                    like: invoiceText
                },
                brand_name: {
                    like: brandText
                },
                po_number: {
                    like: codeText
                }
            },
            pageSize,
            currentPage
        }
    });

    const orders = orderData && orderData.customer && orderData.customer.orders ? orderData.customer.orders.items : [];

    const isLoadingWithoutData = !orderData && orderLoading;
    const isBackgroundLoading = !!orderData && orderLoading;

    const pageInfo = useMemo(() => {
        if (orderData && orderData.customer) {
            const { total_count } = orderData.customer.orders;

            return {
                current: orderData.customer.orders?.items?.length || '',
                total: total_count
            };
        }

        return null;
    }, [orderData, pageSize]);

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([getOrderError]),
        [getOrderError]
    );

    const handleReset = useCallback(() => {
        setSearchText('');
        setBrandText('');
        setCodeText('');
        setDateFromText('');
        setDateToText('');
        setInvoiceText('');
    }, [searchText]);

    const handleSubmit = useCallback((value) => {
        setBrandText(value?.brand || '');
        setSearchText(value?.search || '');
        setCodeText(value?.po_number || '');
        setDateFromText(value?.date_from || '');
        setDateToText(value?.date_to || '');
        setInvoiceText(value?.invoice || '');
    }, []);

    const pageControl = useMemo(() => {
        if (orderData && orderData.customer) {
            const { page_info } = orderData.customer.orders;
            const { current_page, total_pages } = page_info;

            return {
                currentPage: currentPage !== current_page ? current_page : currentPage,
                setPage: setCurrentPage,
                totalPages: total_pages,
            };
        }

        return {
            currentPage: currentPage,
            setPage: setCurrentPage,
            totalPages: 1,
        };
    }, [orderData, pageSize]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    useEffect(() => {
        setCurrentPage(1);
    }, [pageSize]);

    useScrollTopOnChange(currentPage);

    return {
        errorMessage: derivedErrorMessage,
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
        invoiceText,
        pageControl,
        optionsSize,
        pageSize,
        setPageSize
    };
};
