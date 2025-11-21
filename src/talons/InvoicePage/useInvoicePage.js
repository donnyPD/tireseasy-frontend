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
    const [totalFromText, setTotalFromText] = useState('');
    const [totalToText, setTotalToText] = useState('');
    const [isResetBtn, setIsResetBtn] = useState(false);

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
                },
                grand_total: {
                    from: totalFromText,
                    to: totalToText
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
        setTotalFromText('');
        setTotalToText('');
        setIsSearching(false);
    }, [invoiceText]);

    const handleSubmit = useCallback((value) => {
        console.log(value)
        setOrderText(value?.order || '');
        setStatusText(value?.status || '');
        setDateFromText(value?.date_from || '');
        setDateToText(value?.date_to || '');
        setInvoiceText(value?.invoice || '');
        setTotalFromText(value?.total_from || '');
        setTotalToText(value?.total_to || '');

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

    useEffect(() => {
        if (invoiceText
            || orderText
            || statusText
            || dateFromText
            || dateToText
            || totalFromText
            || totalToText) {
            setIsResetBtn(true);
        } else {
            setIsResetBtn(false);
        }
    }, [
        invoiceText,
        orderText,
        statusText,
        dateFromText,
        dateToText,
        totalFromText,
        totalToText
    ]);

    useScrollTopOnChange(currentPage);

    return {
        errorMessage: derivedErrorMessage,
        handleReset,
        handleSubmit,
        isBackgroundLoading,
        isLoadingWithoutData,
        pageInfo,
        invoiceText,
        invoices,
        options,
        pageControl,
        optionsSize,
        pageSize,
        setPageSize,
        isSearching,
        isResetBtn
    };
};
