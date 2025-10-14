import { useState } from 'react';

const defaultSort = {
    sortText: 'Price: Low to High',
    sortId: 'sortItem.priceAsc',
    sortAttribute: 'price',
    sortDirection: 'ASC'
};

/**
 *
 * @param props
 * @returns {[{sortDirection: string, sortAttribute: string, sortText: string}, React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}>>]}
 */
export const useSort = (props = {}) => {
    const { sortFromSearch = false } = props;
    return useState(() =>
        Object.assign({}, defaultSort, props)
    );
};
