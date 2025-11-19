import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './invoicePage.gql';
import NEW_OPERATIONS from '../SearchPage/searchPage.gql';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import isObjectEmpty from '@magento/peregrine/lib/util/isObjectEmpty';

const PAGE_SIZE = 10;

export const useInvoicePage = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, NEW_OPERATIONS, props.operations);
    const { getCustomerInvoicesQuery, getPageSize } = operations;

    const [, { actions: { setPageLoading } }] = useAppContext();

    const { data: pageSizeData } = useQuery(getPageSize, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const pageSizeList = pageSizeData && pageSizeData.storeConfig.list_per_page_values.split(',');
    const [pageSize, setPageSize] = useState(pageSizeList && pageSizeList[0] || PAGE_SIZE);
    const optionsSize = pageSizeList && pageSizeList.length ? pageSizeList.map(el => {
        return {
            value: Number(el),
            label: el,
        }
    }) : [];
    const [currentPage, setCurrentPage] = useState(1);
    const [orderText, setOrderText] = useState('');
    const [statusText, setStatusText] = useState('');
    const [dateFromText, setDateFromText] = useState('');
    const [dateToText, setDateToText] = useState('');
    const [invoiceText, setInvoiceText] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const options = [
        { value: '', label: 'Select status' },
        { value: 'Open', label: 'Open' },
        { value: 'Overdue', label: 'Overdue' },
        { value: 'Paid', label: 'Paid' }
    ];

    const {
        data: invoiceData,
        error: getInvoiceError,
        loading: invoiceLoading
    } = useQuery(getCustomerInvoicesQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            filter: {
                order_number: {
                    like: orderText
                },
                created_at: {
                    from: dateFromText,
                    to: dateToText
                },
                invoice_number: {
                    like: invoiceText
                },
                status: {
                    eq: statusText
                }
            },
            pageSize,
            currentPage
        }
    });

    const invoices = invoiceData && invoiceData?.customer?.invoices?.items || [];

    const isLoadingWithoutData = !invoiceData && invoiceLoading;
    const isBackgroundLoading = !!invoiceData && invoiceLoading;

    const pageInfo = useMemo(() => {
        if (invoiceData && invoiceData.customer) {
            const { total_count } = invoiceData.customer.invoices;

            return {
                current: invoiceData.customer.invoices?.items?.length || '',
                total: total_count
            };
        }
        return null;
    }, [invoiceData, pageSize]);

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([getInvoiceError]),
        [getInvoiceError]
    );

    const handleReset = useCallback(() => {
        setOrderText('');
        setStatusText('');
        setDateFromText('');
        setDateToText('');
        setInvoiceText('');
        setIsSearching(false);
    }, [invoiceText]);

    const handleSubmit = useCallback((value) => {
        setOrderText(value?.order || '');
        setStatusText(value?.status || '');
        setDateFromText(value?.date_from || '');
        setDateToText(value?.date_to || '');
        setInvoiceText(value?.invoice || '');

        if (!isObjectEmpty(value)) {
            setIsSearching(true);
        }
    }, []);

    const pageControl = useMemo(() => {
        if (invoiceData && invoiceData.customer) {
            const { page_info } = invoiceData.customer.invoices;
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
    }, [invoiceData, pageSize]);

    // // Update the page indicator if the GraphQL query is in flight.
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
        pageInfo,
        invoiceText,
        orderText,
        statusText,
        dateFromText,
        dateToText,
        invoices,
        options,
        pageControl,
        optionsSize,
        pageSize,
        setPageSize,
        isSearching
    };
};
