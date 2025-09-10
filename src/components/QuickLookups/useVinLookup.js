import { useState, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_OPTIONS_BY_VIN } from './quickLookupsQueries';

/**
 * Validates VIN number format
 * @param {string} vin - VIN number to validate
 * @returns {boolean} True if VIN is valid
 */
export const validateVin = (vin) => {
    if (!vin || typeof vin !== 'string') {
        return false;
    }

    // VIN must be 17 characters
    if (vin.length !== 17) {
        return false;
    }

    // VIN cannot contain I, O, Q
    const invalidChars = /[IOQ]/i;
    if (invalidChars.test(vin)) {
        return false;
    }

    // VIN must contain only letters and numbers
    const validChars = /^[A-HJ-NPR-Z0-9]+$/i;
    if (!validChars.test(vin)) {
        return false;
    }

    return true;
};

/**
 * Custom hook for VIN lookup functionality
 * @returns {Object} Hook result object
 */
export const useVinLookup = () => {
    const [getOptionsByVinQuery, { data, loading, error }] = useLazyQuery(GET_OPTIONS_BY_VIN, {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all'
    });

    /**
     * Get vehicle options by VIN number
     * @param {string} vin - VIN number
     * @returns {Promise<Object>} Vehicle options data
     */
    const getOptionsByVin = useCallback(async (vin) => {
        if (!validateVin(vin)) {
            const vinError = new Error('Invalid VIN number');
            throw vinError;
        }

        try {
            const result = await getOptionsByVinQuery({
                variables: { vin }
            });

            // Log the response to console as requested
            if (result.data?.getOptionsByVin?.items) {
                console.log('VIN Options:', result.data.getOptionsByVin.items);
                console.log('Query executed with VIN:', vin);
            }

            return result;

        } catch (err) {
            console.error('Error fetching VIN options:', err);
            throw err;
        }
    }, [getOptionsByVinQuery]);

    /**
     * Reset hook state
     */
    const reset = useCallback(() => {
        // Reset is handled by Apollo Client's cache management
    }, []);

    return {
        getOptionsByVin,
        loading,
        error,
        data,
        reset,
        vinOptions: data?.getOptionsByVin?.items || []
    };
};
