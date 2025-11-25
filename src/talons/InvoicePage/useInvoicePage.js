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
    const [dateFromText, setDateFromText] = useState('');
    const [dateToText, setDateToText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isResetBtn, setIsResetBtn] = useState(false);
    const [formData, setFormData] = useState({});

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
                    like: formData?.order || ''
                },
                created_at: {
                    from: formData?.date_from || '',
                    to: formData?.date_to || ''
                },
                invoice_number: {
                    like: formData?.invoice || ''
                },
                status: {
                    eq: formData?.status || ''
                },
                grand_total: {
                    from: formData?.total_from || '',
                    to: formData?.total_to || ''
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
        setDateFromText('');
        setDateToText('');
        setIsSearching(false);
        setFormData({});
    }, [formData]);

    const handleSubmit = useCallback((value) => {
        const data = {};
        value?.order ? data.order = value?.order : null;
        value?.status ? data.status = value?.status : null;
        value?.invoice ? data.invoice = value?.invoice : null;
        value?.total_from ? data.total_from = value?.total_from : null;
        value?.total_to ? data.total_to = value?.total_to : null;
        dateFromText ? data.date_from = dateFromText : null;
        dateToText ? data.date_to = dateToText : null;

        setFormData(data);
        if (!isObjectEmpty(value)) {
            setIsSearching(true);
        }
    }, [dateFromText, dateToText]);

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
        if (isObjectEmpty(formData)) {
            setIsResetBtn(false);
        } else {
            setIsResetBtn(true);
        }
    }, [formData]);

    useScrollTopOnChange(currentPage);

    return {
        errorMessage: derivedErrorMessage,
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
    };
};
