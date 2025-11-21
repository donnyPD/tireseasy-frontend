import { gql } from '@apollo/client';

export const CategoryFragment = gql`
    # eslint-disable-next-line @graphql-eslint/require-id-when-available
    fragment CategoryFragment on CategoryTree {
        uid
        meta_title
        meta_keywords
        meta_description
    }
`;

export const ProductsFragment = gql`
    fragment ProductsFragment on Products {
        items {
            id
            uid
            name
            price_range {
                maximum_price {
                    final_price {
                        currency
                        value
                    }
                    regular_price {
                        currency
                        value
                    }
                    discount {
                        amount_off
                    }
                }
            }
            sku
            small_image {
                url
            }
            stock_status
            rating_summary
            __typename
            url_key
            ... on SimpleProduct {
                load_index
                speed_index
                load_range_ply_rating
                brand_name
                mileage_warranty
                size_cross_section_width
                size_aspect_ratio
                size_wheel_diameter
                size_label
                load_index_label
                speed_index_label
                load_range_ply_rating_label
                brand_name_label
                mileage_warranty_label
                available_quantity_label
                fet_amount
            }
        }
        page_info {
            total_pages
        }
        total_count
    }
`;
