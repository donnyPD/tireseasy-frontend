import {useState, useEffect, useRef} from 'react';
import {useLazyQuery} from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from '../queries.gql';
import {getFiltersFromSearch} from '@magento/peregrine/lib/talons/FilterModal/helpers';
import {useLocation} from 'react-router-dom';

const wrapUseSearchPage = (original) => {
    return function useSearchPage(props = {}, ...restArgs) {
        const operations = mergeOperations(DEFAULT_OPERATIONS, props?.operations);

        const {
            search
        } = useLocation();

        const {
            getDynamicSearchFilters
        } = operations;

        const { filters, data, searchTerm, ...restProps } = original(
            props,
            ...restArgs
        );

        const [getNewFilters] = useLazyQuery(
            getDynamicSearchFilters,
            {
                fetchPolicy: 'cache-and-network',
                nextFetchPolicy: 'cache-first'
            }
        );

        const [visibleFilters, setVisibleFilters] = useState(null);

        useEffect(() => {
            if (!data) return;

            const selectedFilters = getFiltersFromSearch(search);

            if (!selectedFilters.size) {
                setVisibleFilters(filters);
                return;
            }

            let planeSelectedFilters = Object.fromEntries(selectedFilters);

            Object.keys(planeSelectedFilters).forEach(function(key, index) {
                let res = '';

                planeSelectedFilters[key].forEach((value, i, q) => {
                    let partVal = value.split(',');
                    if (partVal.length > 1) {
                        value = partVal[1];
                    }

                    res += (value + ',');
                });

                planeSelectedFilters[key] = res.slice(0, -1);
            });

            planeSelectedFilters = Object.entries(
                planeSelectedFilters).map((e) => ({key: e[0], value: e[1]})
            );

            let changeForFilter = getNewFilters({
                variables: {
                    search: searchTerm,
                    applied_filters: planeSelectedFilters
                }
            });

            changeForFilter.then((data) => {
                setVisibleFilters(data.data?.getSearchFilters?.filters || filters);
            });
        }, [data]);

        return {
            ...restProps,
            data,
            searchTerm,
            filters: visibleFilters
        }
    };
};

export default wrapUseSearchPage;