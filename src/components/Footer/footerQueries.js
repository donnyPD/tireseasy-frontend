import { gql } from '@apollo/client';

// This query should work with most Magento 2.4+ PWA setups
export const GET_STORE_CONFIG_QUERY = gql`
    query GetStoreConfig {
        storeConfig {
            id
            code
            website_id
            locale
            base_currency_code
            default_display_currency_code
            timezone
            weight_unit
            base_url
            base_link_url
            base_static_url
            base_media_url
            secure_base_url
            secure_base_link_url
            secure_base_static_url
            secure_base_media_url
        }
    }
`;

// This is a safer category query that should work
export const GET_ROOT_CATEGORY_QUERY = gql`
    query GetRootCategory {
        category(id: 2) {
            uid
            name
            children {
                uid
                name
                url_key
                url_path
                include_in_menu
                level
            }
        }
    }
`;

// Alternative query using categories if available
export const GET_CATEGORIES_QUERY = gql`
    query GetCategories {
        categories(filters: {}) {
            items {
                uid
                name
                url_key
                url_path
                level
                include_in_menu
            }
        }
    }
`;
