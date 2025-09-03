import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_MODEL_LIST } from './quickLookupsQueries';

/**
 * Custom hook to get the list of models for a specific year and make
 * @param {number|null} year - Selected year
 * @param {string|null} make - Selected make
 * @returns {Object} Object with models data, loading state and errors
 */
export const useModelList = (year, make) => {
    const { data, loading, error } = useQuery(GET_MODEL_LIST, {
        variables: { 
            year: parseInt(year), 
            make: make 
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        errorPolicy: 'all',
        skip: !year || !make || isNaN(parseInt(year))
    });

    /**
     * Processed list of models, sorted alphabetically
     */
    const models = useMemo(() => {
        if (!data?.modelList?.models) {
            return [];
        }
        
        // Sort models alphabetically
        return [...data.modelList.models].sort((a, b) => a.localeCompare(b));
    }, [data]);

    return {
        models,
        loading,
        error,
        hasData: models.length > 0
    };
};


