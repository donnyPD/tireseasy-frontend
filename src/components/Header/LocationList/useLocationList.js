import { useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './locationList.gql';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useLocationList = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const {
        getLocationDataListQuery,
        generateLocationChangeMutation,
    } = operations;
    const customerContactHash = localStorage.getItem('customerContactHash') || '';

    console.log(customerContactHash);

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

    const generateLocationChangeMutationResult = useMutation(generateLocationChangeMutation, {
        fetchPolicy: 'no-cache'
    });
    const [ locationChange ] = generateLocationChangeMutationResult;

    const getRedirectUrl = async (locationId) => {
        const locationChangeResponse = await locationChange({
            variables: {
                locationId,
                contactHash: customerContactHash,
            }
        });

        if (locationChangeResponse && locationChangeResponse?.data?.generateLocationChange?.location_url_change) {
            window.location.replace(locationChangeResponse?.data?.generateLocationChange?.location_url_change);
        }
    }

    return {
        getRedirectUrl,
        locationList: locationList || []
    };
};
