import { useQuery } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import headerQueries from './headerQueries';

export const useCustomHeader = () => {
    const [{ isSignedIn }] = useUserContext();
    const [{ cartId }, { getCartDetails }] = useCartContext();
    const contact_hash = localStorage.getItem('customerContactHash') || null;
    const categoryPrimary = localStorage.getItem('categoryPrimary') || null;

    // Get customer data if user is signed in
    const { data: customerData, loading: customerLoading } = useQuery(
        headerQueries.getCustomerQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            skip: !isSignedIn,
            variables: {
                contactHash: contact_hash || ''
            },
            errorPolicy: 'all'
        }
    );

    // Get categories for navigation
    const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery(
        headerQueries.getCategoriesQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            errorPolicy: 'all'
        }
    );

    // Get store configuration including logo
    const { data: storeConfigData, loading: storeConfigLoading } = useQuery(
        headerQueries.getStoreConfigQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            errorPolicy: 'all'
        }
    );

    const handleCategoryClick = () => {
        if (!categoryPrimary) {
            localStorage.setItem('categoryPrimary', '1');
        }
    };

    // Debug store config data
    if (storeConfigData?.storeConfig) {
        console.log('Store Config Data:', storeConfigData.storeConfig);
    }

    // Process categories to only include menu items
    const processCategories = (categories) => {
        if (!categories || !categories.length) return [];

        return categories
            .filter(category => category.include_in_menu)
            .sort((a, b) => (a.position || 0) - (b.position || 0))
            .map(category => ({
                ...category,
                children: category.children
                    ? category.children
                        .filter(child => child.include_in_menu)
                        .sort((a, b) => (a.position || 0) - (b.position || 0))
                        .map(child => ({
                            ...child,
                            children: child.children
                                ? child.children
                                    .filter(grandchild => grandchild.include_in_menu)
                                    .sort((a, b) => (a.position || 0) - (b.position || 0))
                                : []
                        }))
                    : []
            }));
    };

    const menuCategories = categoriesData?.categoryList
        ? processCategories(categoriesData.categoryList[0]?.children || [])
        : [];

    const currentUser = customerData?.customer || null;
    const storeConfig = storeConfigData?.storeConfig || null;

    return {
        isSignedIn,
        currentUser,
        menuCategories,
        cartId,
        storeConfig,
        loading: customerLoading || categoriesLoading || storeConfigLoading,
        hasError: !!categoriesError,
        categoryPrimary,
        handleCategoryClick
    };
};
