import { gql } from '@apollo/client';

export const GET_MORE_FROM_THIS_BRAND = gql`
  query getMoreFromThisBrand($productId: Int!) {
    amBrandGetMoreFromThisBrandBlock(productId: $productId) {
      title
      items {
        __typename
        id
        uid
        name
        url_rewrites {
          url
        }
        sku
        price {
          regularPrice {
            amount {
              currency
              value
            }
          }
        }
        small_image {
          url
        }
        ... on ConfigurableProduct {
          configurable_options {
            attribute_code
            attribute_id
            id
            uid
            label
            values {
              default_label
              label
              store_label
              use_default_value
              value_index
              swatch_data {
                ... on ImageSwatchData {
                  thumbnail
                }
                value
              }
            }
          }
          variants {
            attributes {
              code
              value_index
            }
            product {
              id
              uid
              media_gallery_entries {
                id
                disabled
                file
                label
                position
              }
              sku
              stock_status
              price {
                regularPrice {
                  amount {
                    currency
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default {
  getMoreFromThisBrandQuery: GET_MORE_FROM_THIS_BRAND
};
