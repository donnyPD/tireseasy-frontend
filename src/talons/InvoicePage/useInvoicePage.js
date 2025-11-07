import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './invoicePage.gql';

const PAGE_SIZE = 10;

export const useInvoicePage = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCustomerInvoicesQuery } = operations;

    const [, { actions: { setPageLoading } }] = useAppContext();

    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [orderText, setOrderText] = useState('');
    const [statusText, setStatusText] = useState('');
    const [dateFromText, setDateFromText] = useState('');
    const [dateToText, setDateToText] = useState('');
    const [invoiceText, setInvoiceText] = useState('');

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
            currentPage: 1
        }
    });

    const invoices = invoiceData && invoiceData?.customer?.invoices?.items || [];

    const isLoadingWithoutData = !invoiceData && invoiceLoading;
    const isBackgroundLoading = !!invoiceData && invoiceLoading;

    const pageInfo = useMemo(() => {
        if (invoiceData && invoiceData.customer) {
            const { total_count } = invoiceData.customer.invoices;

            return {
                current: pageSize < total_count ? pageSize : total_count,
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
    }, [invoiceText]);

    const handleSubmit = useCallback((value) => {
        setOrderText(value?.order || '');
        setStatusText(value?.status || '');
        setDateFromText(value?.date_from || '');
        setDateToText(value?.date_to || '');
        setInvoiceText(value?.invoice || '');
    }, []);

    const loadMoreInvoices = useMemo(() => {
        if (invoiceData && invoiceData.customer) {
            const { page_info } = invoiceData.customer.invoices;
            const { current_page, total_pages } = page_info;

            if (current_page < total_pages) {
                return () => setPageSize(current => current + PAGE_SIZE);
            }
        }

        return null;
    }, [invoiceData]);

    // // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    return {
        errorMessage: derivedErrorMessage,
        handleReset,
        handleSubmit,
        isBackgroundLoading,
        isLoadingWithoutData,
        loadMoreInvoices,
        pageInfo,
        invoiceText,
        orderText,
        statusText,
        dateFromText,
        dateToText,
        invoices
    };
};
