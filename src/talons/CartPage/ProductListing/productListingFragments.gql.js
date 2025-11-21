import { gql } from '@apollo/client';

export const ProductListingFragment = gql`
    fragment ProductListingFragment on Cart {
        id
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        items {
            uid
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            product {
                uid
                name
                sku
                url_key
                thumbnail {
                    url
                }
                small_image {
                    url
                }
                stock_status
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
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                            code
                            value_index
                        }
                        # eslint-disable-next-line @graphql-eslint/require-id-when-available
                        product {
                            uid
                            stock_status
                            small_image {
                                url
                            }
                        }
                    }
                }
            }
            prices {
                price {
                    currency
                    value
                }
                row_total {
                    value
                }
                total_item_discount {
                    value
                }
            }
            quantity
            ... on SimpleCartItem {
                estimated_delivery {
                    estimatedDeliveryDate
                    shippingMethodId
                    timeInTransit
                    cutoff
                }
            }
            errors {
                code
                message
            }
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            ... on ConfigurableCartItem {
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                configurable_options {
                    id
                    configurable_product_option_uid
                    option_label
                    configurable_product_option_value_uid
                    value_label
                    value_id
                }
            }
        }
    }
`;
