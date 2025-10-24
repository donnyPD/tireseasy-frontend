import {useState, useEffect, useRef} from 'react';
import {useLazyQuery} from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from '../../queries.gql';
import {getFiltersFromSearch} from '@magento/peregrine/lib/talons/FilterModal/helpers';
import {useLocation} from 'react-router-dom';

const wrapUseCategoryContent = (original) => {
    return function useCategoryContent(props, ...restArgs) {
        const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

        const {
            search
        } = useLocation();

        const {
            getDynamicFilters
        } = operations;

        const {
            categoryId,
            data
        } = props;

        const { filters, ...restProps } = original(
            props,
            ...restArgs
        );

        const [visibleFilters, setVisibleFilters] = useState(null);

        const [getNewFilters] = useLazyQuery(
            getDynamicFilters,
            {
                fetchPolicy: 'cache-and-network',
                nextFetchPolicy: 'cache-first'
            }
        );

        useEffect(() => {
            if (!data) return;

            const selectedFilters = getFiltersFromSearch(search);

            if (!selectedFilters.size) {
                setVisibleFilters(filters);
                return;
            }

            let planeSelectedFilters = Object.fromEntries(selectedFilters);

            Object.keys(planeSelectedFilters).forEach(function(key) {
                let res = '';

                planeSelectedFilters[key].forEach((value) => {
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
                    category_uid: categoryId,
                    applied_filters: planeSelectedFilters
                }
            });

            changeForFilter.then((data) => {
                setVisibleFilters(data.data?.getCategoryFilters?.filters || filters);
            });

        }, [data]);

        return {
            ...restProps,
            filters: visibleFilters
        }
    };
};

export default wrapUseCategoryContent;