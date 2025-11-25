import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './orderHistoryPage.gql';
import NEW_OPERATIONS from '../SearchPage/searchPage.gql';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import isObjectEmpty from '@magento/peregrine/lib/util/isObjectEmpty';

const PAGE_SIZE = 10;

export const useOrderHistoryPage = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, NEW_OPERATIONS, props.operations);
    const { getCustomerOrdersQuery, getPageSize } = operations;

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

    const selectOptions = [
        { value: '', label: 'Select status' },
        { value: 'CREATED', label: 'Created' },
        { value: 'CONFIRMED', label: 'Confirmed' },
        { value: 'SHIPPED', label: 'Shipped' }
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [dateFromText, setDateFromText] = useState('');
    const [dateToText, setDateToText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [brandTextHandle, setBrandTextHandle] = useState('');
    const [isResetBtn, setIsResetBtn] = useState(false);
    const [formData, setFormData] = useState({});

    const {
        data: orderData,
        error: getOrderError,
        loading: orderLoading
    } = useQuery(getCustomerOrdersQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            filter: {
                number: {
                    match: formData?.search || ''
                },
                created_at: {
                    from: formData?.date_from || '',
                    to: formData?.date_to || ''
                },
                invoice_number: {
                    like: formData?.invoice || ''
                },
                brand_name: {
                    like: formData?.brand || ''
                },
                po_number: {
                    like: formData?.po_number || ''
                },
                te_order_status: {
                    eq: formData?.status || ''
                }
            },
            pageSize,
            currentPage
        }
    });

    const orders = orderData && orderData.customer && orderData.customer.orders ? orderData.customer.orders.items : [];
    const brandList = orderData && orderData.customer && orderData.customer.orders.brand_list ? orderData.customer.orders.brand_list : [];

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
        setBrandTextHandle('');
        setDateFromText('');
        setDateToText('');
        setIsSearching(false);
        setFormData({});
    }, [formData]);

    const handleSubmit = useCallback((value) => {
        const data = {};
        value?.search ? data.search = value?.search : null;
        value?.po_number ? data.po_number = value?.po_number : null;
        value?.invoice ? data.invoice = value?.invoice : null;
        value?.status ? data.status = value?.status : null;
        dateFromText ? data.date_from = dateFromText : null;
        dateToText ? data.date_to = dateToText : null;
        brandTextHandle ? data.brand = brandTextHandle : null;

        setFormData(data);
        if (!isObjectEmpty(value)) {
            setIsSearching(true);
        }
    }, [brandTextHandle, dateFromText, dateToText]);

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
        orders,
        pageInfo,
        dateFromText,
        setDateFromText,
        dateToText,
        setDateToText,
        pageControl,
        optionsSize,
        pageSize,
        setPageSize,
        isSearching,
        isResetBtn,
        brandList,
        selectOptions,
        brandTextHandle,
        setBrandTextHandle
    };
};
