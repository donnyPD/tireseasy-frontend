import { gql } from '@apollo/client';

export const GET_CUSTOMER_HEADER = gql`
    query GetCustomerForHeader($contactHash: String!) {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer(contact_hash: $contactHash) {
            email
            firstname
            lastname
            location_name
        }
    }
`;

export const GET_HEADER_CATEGORIES = gql`
    query GetHeaderCategories {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        categoryList {
            uid
            name
            url_path
            include_in_menu
            position
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            children {
                uid
                name
                url_path
                include_in_menu
                position
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                children {
                    uid
                    name
                    url_path
                    include_in_menu
                    position
                }
            }
        }
    }
`;

export const GET_STORE_CONFIG = gql`
    query GetStoreConfigForHeader {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            header_logo_src
            logo_alt
            logo_width
            logo_height
            base_media_url
            secure_base_media_url
        }
    }
`;

export default {
    getCustomerQuery: GET_CUSTOMER_HEADER,
    getCategoriesQuery: GET_HEADER_CATEGORIES,
    getStoreConfigQuery: GET_STORE_CONFIG
};
