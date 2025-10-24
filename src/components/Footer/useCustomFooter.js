import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { GET_ROOT_CATEGORY_QUERY } from './footerQueries';

export const useCustomFooter = () => {
    const { data: categoriesData, loading: categoriesLoading } = useQuery(
        GET_ROOT_CATEGORY_QUERY,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    const categories = useMemo(() => {
        if (!categoriesData?.category?.children) {
            console.log('No root category children available');
            return [];
        }

        // Use children from root category
        const filteredCategories = categoriesData.category.children
            .filter(category => {
                // Basic validation checks
                if (!category || !category.name || !category.url_key) {
                    return false;
                }

                console.log('Checking category:', {
                    name: category.name,
                    url_key: category.url_key,
                    level: category.level,
                    include_in_menu: category.include_in_menu
                });

                // Only include categories that should be in menu
                return category.include_in_menu;
            })
            .map(category => ({
                id: category.uid, // Use uid as id for consistency
                uid: category.uid,
                name: category.name,
                urlKey: category.url_key,
                path: `/${category.url_path || category.url_key}.html`
            }));

        return filteredCategories;
    }, [categoriesData]);

    const companyInfo = {
        description: "DriveLine is a leading provider of high-quality automotive parts, committed to delivering exceptional products and services to our customers.",
        email: "support@driveline-auto.com",
        phone: "571-310-8075",
        address: "101 Continental Blvd. Suite 860 El Segundo, CA 90245"
    };

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Tires', path: '/tires.html' },
        { name: 'Wheels', path: '/wheels.html' },
        { name: 'Auto Parts', path: '/auto-parts.html' },
        { name: 'Account Settings', path: '/customer/account' },
        { name: 'Order History', path: '/customer/account/order/history' }
    ];

    return {
        categories,
        categoriesLoading,
        companyInfo,
        quickLinks
    };
};
// Updated with uid field
// Fixed null check error
// Added debugging logs
