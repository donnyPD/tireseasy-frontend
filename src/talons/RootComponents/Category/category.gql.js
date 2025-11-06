import { gql } from '@apollo/client';

import { CategoryFragment, ProductsFragment } from './categoryFragments.gql';

export const GET_CATEGORY = gql`
    query GetCategories(
        $id: String!
        $pageSize: Int!
        $currentPage: Int!
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput
        $staggeredRequest: StaggeredProductsFilter
    ) {
        categories(filters: { category_uid: { in: [$id] } }) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                uid
                ...CategoryFragment
            }
        }
        products(
            pageSize: $pageSize
            currentPage: $currentPage
            filter: $filters
            sort: $sort
            staggeredRequest: $staggeredRequest
        ) {
            ...ProductsFragment

        }
    }
    ${CategoryFragment}
    ${ProductsFragment}
`;

export const GET_FILTER_INPUTS = gql`
    query GetFilterInputsForCategory {
        __type(name: "ProductAttributeFilterInput") {
            inputFields {
                name
                type {
                    name
                }
            }
        }
    }
`;

export default {
    getCategoryQuery: GET_CATEGORY,
    getFilterInputsQuery: GET_FILTER_INPUTS
};
