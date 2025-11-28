import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLazyQuery, useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { usePagination } from '@magento/peregrine/lib/hooks/usePagination';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import { useSort } from '../../../hooks/useSort';
import {
    getFiltersFromSearch,
    getFilterInput
} from '@magento/peregrine/lib/talons/FilterModal/helpers';
import { getCustomFiltersFromSearch, getCustomFilterInput } from './helpers';
import isObjectEmpty from '@magento/peregrine/lib/util/isObjectEmpty';

import DEFAULT_OPERATIONS from './category.gql';
const SKU_SIZE_REQUEST = 10;

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that
 * controls the logic for the Category Root Component.
 *
 * @kind function
 *
 * @param {object}      props
 * @param {String}      props.id - Category uid.
 * @param {GraphQLAST}  props.operations.getCategoryQuery - Fetches category using a server query
 * @param {GraphQLAST}  props.operations.getFilterInputsQuery - Fetches "allowed" filters using a server query
 * @param {GraphQLAST}  props.queries.getStoreConfig - Fetches store configuration using a server query
 *
 * @returns {object}    result
 * @returns {object}    result.error - Indicates a network error occurred.
 * @returns {object}    result.categoryData - Category data.
 * @returns {bool}      result.isLoading - Category data loading.
 * @returns {string}    result.metaDescription - Category meta description.
 * @returns {object}    result.pageControl - Category pagination state.
 * @returns {array}     result.sortProps - Category sorting parameters.
 * @returns {number}    result.pageSize - Category total pages.
 */
export const useCategory = props => {
    const {
        id,
        queries: { getPageSize }
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCategoryQuery, getFilterInputsQuery, getEstimatedDeliveryQuery } = operations;
    const [etaList, setEtaList] = useState([]);

    const { data: pageSizeData } = useQuery(getPageSize, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const pageSizeList = pageSizeData && pageSizeData.storeConfig.list_per_page_values.split(',');
    const [pageSize, setPageSize] = useState(pageSizeList && pageSizeList[0] || 10);
    const optionsSize = pageSizeList && pageSizeList.length ? pageSizeList.map(el => {
        return {
            value: Number(el),
            label: el,
        }
    }) : [];

    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const sortProps = useSort({ sortFromSearch: false });
    const [currentSort] = sortProps;

    // Keep track of the sort criteria so we can tell when they change.
    const previousSort = useRef(currentSort);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const [runQuery, queryResponse] = useLazyQuery(getCategoryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const [runEstimatedDelivery] = useLazyQuery(getEstimatedDeliveryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const {
        called: categoryCalled,
        loading: categoryLoading,
        error,
        data
    } = queryResponse;
    const { search } = useLocation();

    const isBackgroundLoading = !!data && categoryLoading;

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    // Keep track of the search terms so we can tell when they change.
    const previousSearch = useRef(search);

    // Get "allowed" filters by intersection of schema and aggregations
    const {
        called: introspectionCalled,
        data: introspectionData,
        loading: introspectionLoading
    } = useQuery(getFilterInputsQuery);

    // Create a type map we can reference later to ensure we pass valid args
    // to the graphql query.
    // For example: { category_id: 'FilterEqualTypeInput', price: 'FilterRangeTypeInput' }
    const filterTypeMap = useMemo(() => {
        const typeMap = new Map();
        if (introspectionData) {
            introspectionData.__type.inputFields.forEach(({ name, type }) => {
                typeMap.set(name, type.name);
            });
        }
        return typeMap;
    }, [introspectionData]);

    // Run the category query immediately and whenever its variable values change.
    useEffect(() => {
        // Wait until we have the type map to fetch product data.
        if (!filterTypeMap.size || !pageSize) {
            return;
        }

        const filters = getFiltersFromSearch(search);
        const customFilters = getCustomFiltersFromSearch(search);

        // Construct the filter arg object.
        const newFilters = {};
        const staggeredFilters = {};
        filters.forEach((values, key) => {
            newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
        });
        customFilters.forEach((values, key) => {
            staggeredFilters[key] = getCustomFilterInput(values);
        });

        // Use the category uid for the current category page regardless of the
        // applied filters. Follow-up in PWA-404.
        newFilters['category_uid'] = { eq: id };

        const variables = {
            currentPage: Number(currentPage),
            id: id,
            filters: newFilters,
            pageSize: Number(pageSize),
            sort: { [currentSort.sortAttribute]: currentSort.sortDirection }
        };

        if (!isObjectEmpty(staggeredFilters)) {
            variables.staggeredRequest = staggeredFilters;
        }

        runQuery({
            variables: variables
        });
    }, [
        currentPage,
        currentSort,
        filterTypeMap,
        id,
        pageSize,
        runQuery,
        search
    ]);

    const totalPagesFromData = data
        ? data.products.page_info.total_pages
        : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    // If we get an error after loading we should try to reset to page 1.
    // If we continue to have errors after that, render an error message.
    useEffect(() => {
        if (error && !categoryLoading && !data && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, error, categoryLoading, setCurrentPage, data]);

    // Reset the current page back to one (1) when the search string, filters
    // or sort criteria change.
    useEffect(() => {
        // We don't want to compare page value.
        const prevSearch = new URLSearchParams(previousSearch.current);
        const nextSearch = new URLSearchParams(search);
        prevSearch.delete('page');
        nextSearch.delete('page');

        if (
            prevSearch.toString() !== nextSearch.toString() ||
            previousSort.current.sortAttribute.toString() !==
                currentSort.sortAttribute.toString() ||
            previousSort.current.sortDirection.toString() !==
                currentSort.sortDirection.toString()
        ) {
            // The search term changed.
            setCurrentPage(1, true);
            // And update the ref.
            previousSearch.current = search;
            previousSort.current = currentSort;
        }
    }, [currentSort, previousSearch, search, setCurrentPage]);

    const categoryData = categoryLoading && !data ? null : data;
    const categoryNotFound =
        !categoryLoading && data && data.categories.items.length === 0;
    const metaDescription =
        data &&
        data.categories.items[0] &&
        data.categories.items[0].meta_description
            ? data.categories.items[0].meta_description
            : '';

    // When only categoryLoading is involved, noProductsFound component flashes for a moment
    const loading =
        (introspectionCalled && !categoryCalled) ||
        (categoryLoading && !data) ||
        introspectionLoading;

    const chunkArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    const skuList = useMemo(() => {
        if (!categoryData || !categoryData?.products?.items.length) {
            return [];
        }
        const list = [];
        categoryData?.products?.items.map((el) => el.sku ? list.push(el.sku) : null );
        return list;
    }, [data]);

    const estimatedDeliveryData = async (list) => {
        try {
            const chunks = chunkArray(list, SKU_SIZE_REQUEST);
            for (const item of chunks) {
                const result = await runEstimatedDelivery({
                    variables: {
                        skus: item
                    }
                });
                result?.data?.estimatedDelivery && setEtaList(items => [
                    ...items, ...result?.data?.estimatedDelivery
                ]);
            }
        } catch (err) {
            console.error(
                'An error occurred during when getting ETA delivery',
                err
            );
        }
    };

    useEffect(() => {
        if (skuList.length) {
            estimatedDeliveryData(skuList);
        }
        if (categoryLoading || !skuList.length) {
            setEtaList([]);
        }
    }, [skuList]);

    useScrollTopOnChange(currentPage);

    return {
        error,
        categoryData,
        loading,
        metaDescription,
        pageControl,
        sortProps,
        pageSize,
        categoryNotFound,
        optionsSize,
        setPageSize,
        etaList
    };
};
