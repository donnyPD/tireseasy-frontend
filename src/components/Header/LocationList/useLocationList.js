import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './locationList.gql';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useLocationList = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getLocationDataListQuery } = operations;
    const [{ token }] = useUserContext();
    const customerContactHash = token && localStorage.getItem('customerContactHash')
        ? localStorage.getItem('customerContactHash')
        : '';

    if (!token && localStorage.getItem('customerContactHash')) {
        localStorage.removeItem('customerContactHash');
    }

    const { data: getLocationDataList} = useQuery(getLocationDataListQuery, {
        variables: {
            contactHash: customerContactHash
        }
    });

    const locationList = useMemo(() => {
        if (getLocationDataList) {
            return getLocationDataList?.locationDataList;
        }
    }, [getLocationDataList]);

    return {
        locationList: locationList || []
    };
};
