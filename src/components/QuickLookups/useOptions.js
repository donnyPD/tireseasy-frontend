import { useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_OPTIONS } from './quickLookupsQueries';

/**
 * Custom hook to get options for a specific year, make and model
 * @returns {Object} Object with getOptions function, data, loading state and errors
 */
export const useOptions = () => {
    const [getOptionsQuery, { data, loading, error }] = useLazyQuery(GET_OPTIONS, {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all'
    });

    /**
     * Execute options query with vehicle parameters
     * @param {number} year - Selected year
     * @param {string} make - Selected make
     * @param {string} model - Selected model
     * @param {string} [trim] - Selected trim (optional)
     * @returns {Promise} Query promise
     */
    const getOptions = useCallback(async (year, make, model, trim = null) => {
        try {
            const variables = {
                year: parseInt(year),
                make: make,
                model: model,
                trim: trim || null
            };

            const result = await getOptionsQuery({
                variables
            });

            // Log the response to console as requested
            if (result.data?.getOptions?.items) {
                console.log('Vehicle Options:', result.data.getOptions.items);
                console.log('Query executed with:', { year: parseInt(year), make, model, trim });
            }

            return result;

        } catch (err) {
            console.error('Error fetching options:', err);
            throw err;
        }
    }, [getOptionsQuery]);

    return {
        getOptions,
        data,
        loading,
        error,
        options: data?.getOptions?.items || []
    };
};

