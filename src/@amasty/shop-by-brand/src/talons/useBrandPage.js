import { useEffect, useMemo, useRef, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { usePagination, useSort } from '@magento/peregrine';
import {
  getFilterInput,
  getFiltersFromSearch
} from '@magento/peregrine/lib/talons/FilterModal/helpers';
import { useLocation } from 'react-router-dom';
import DEFAULT_OPERATIONS from './brands.gql';
import { getUrlKey } from '../utils';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useBrandPage = (props = {}) => {
  const { brand, isOpen, setIsOpen } = props;
  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

  const {
    getPageSize,
    productSearchQuery,
    allBrandsPageQuery,
    getFilterInputsQuery,
    getProductFiltersByBrandQuery
  } = operations;

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

  const sortProps = useSort();
  const [currentSort] = sortProps;

  // Keep track of the sort criteria so we can tell when they change.
  const previousSort = useRef(currentSort);

  const pageControl = {
    currentPage,
    setPage: setCurrentPage,
    totalPages
  };

  const { loading: allLoading, data: allBrandData } = useQuery(
    allBrandsPageQuery,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first'
    }
  );

  const [runQuery, queryResponse] = useLazyQuery(productSearchQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  });

  const { loading, error, data } = queryResponse;
  const { search } = useLocation();

  // Keep track of the search terms so we can tell when they change.
  const previousSearch = useRef(search);

  const brandInfo = useMemo(() => {
    const { ambrandlist } = allBrandData || {};
    const { items, brand_attribute } = ambrandlist || {};
    const res = Array.isArray(items)
      ? items.find(item => getUrlKey(item.url) === brand.toLowerCase())
      : null;

    return res
      ? { ...res, brandAttribute: brand_attribute.attribute_code }
      : null;
  }, [allBrandData, brand]);

  // Get "allowed" filters by intersection of schema and aggregations
  const { data: introspectionData, error: introspectionError } = useQuery(
    getFilterInputsQuery
  );

  useEffect(() => {
    if (introspectionError) {
      console.error(introspectionError);
    }
  }, [introspectionError]);

  useEffect(() => {
    if (isOpen) {
        setIsOpen(false);
    }
  }, [pageSize]);

  const filterTypeMap = useMemo(() => {
    const typeMap = new Map();
    if (introspectionData) {
      introspectionData.__type.inputFields.forEach(({ name, type }) => {
        typeMap.set(name, type.name);
      });
    }
    return typeMap;
  }, [introspectionData]);

  useEffect(() => {
    // Wait until we have the type map to fetch product data.
    if (!filterTypeMap.size || !brandInfo || !pageSize) {
      return;
    }

    const filtersFromSearch = getFiltersFromSearch(search);

    // Construct the filter arg object.
    const newFilters = {};
    filtersFromSearch.forEach((values, key) => {
      newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
    });

    const { brandAttribute, brandId } = brandInfo || {};
    newFilters[brandAttribute] = { eq: String(brandId) };

    runQuery({
      variables: {
        inputText: '',
        currentPage: Number(currentPage),
        filters: newFilters,
        onServer: false,
        pageSize: Number(pageSize),
        sort: { [currentSort.sortAttribute]: currentSort.sortDirection }
      }
    });

    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth'
    });
  }, [
    currentPage,
    currentSort,
    filterTypeMap,
    runQuery,
    brandInfo,
    search,
    pageSize
  ]);

  const totalPagesFromData = data ? data.products.page_info.total_pages : null;

  useEffect(() => {
    setTotalPages(totalPagesFromData);

    return () => {
      setTotalPages(null);
    };
  }, [setTotalPages, totalPagesFromData]);

  useEffect(() => {
    if (error && !loading && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, error, loading, setCurrentPage]);

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
      setCurrentPage(1);
      // And update the ref.
      previousSearch.current = search;
      previousSort.current = currentSort;
    }
  }, [currentSort, search, setCurrentPage]);

  const [
    getFilters,
    { data: filterData, error: filterError, loading: filterLoading }
  ] = useLazyQuery(getProductFiltersByBrandQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  });

  useEffect(() => {
    if (filterError) {
      console.error(filterError);
    }
  }, [filterError]);

  useEffect(() => {
    const { brandAttribute, brandId } = brandInfo || {};

    if (brandAttribute && brandId) {
      getFilters({
        variables: {
          brandFilter: {
            [brandAttribute]: { eq: String(brandId) }
          }
        }
      });
    }
  }, [getFilters, brandInfo]);

  const filters = useMemo(() => {
    const { products } = filterData || {};
    const { brandAttribute } = brandInfo || {};

    if (!products) {
      return null;
    }

    return products.aggregations.filter(
      ({ attribute_code }) => attribute_code !== brandAttribute
    );
  }, [filterData, brandInfo]);

  const { label, description, image } = brandInfo || {};
  const totalCount = data ? data.products.total_count : null;

  return {
    isLoading: allLoading || loading || filterLoading,
    error,
    data,
    pageControl,
    filters,
    items: data ? data.products.items : null,
    totalPagesFromData,
    sortProps,
    pageTitle: label || '',
    brandDescription: description,
    brandImage: image,
    totalCount,
    pageSize,
    optionsSize,
    setPageSize
  };
};
