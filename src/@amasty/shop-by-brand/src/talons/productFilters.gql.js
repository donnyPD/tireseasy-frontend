import { gql } from '@apollo/client';

const getQuery = () => {
  try {
    const ilnFragments = require('@amasty/iln/src/talons/amILNFragments.gql.js');

    if (ilnFragments) {
      const {
        AmShopbyFilterDataFragment,
        AggregationOptionFragment
      } = ilnFragments;

      return gql`
        query getProductFiltersByCategory(
          $brandFilter: ProductAttributeFilterInput!
        ) {
          products(filter: $brandFilter) {
            aggregations {
              label
              count
              attribute_code
              ...AmShopbyFilterDataFragment
              options {
                label
                value
                ...AggregationOptionFragment
              }
            }
          }
        }
        ${AmShopbyFilterDataFragment}
        ${AggregationOptionFragment}
      `;
    }
  } catch (e) {
    return gql`
      query getProductFiltersByCategory(
        $brandFilter: ProductAttributeFilterInput!
      ) {
        products(filter: $brandFilter) {
          aggregations {
            label
            count
            attribute_code
            options {
              label
              value
            }
          }
        }
      }
    `;
  }
};

export const GET_PRODUCT_FILTERS_BY_BRAND = getQuery();
