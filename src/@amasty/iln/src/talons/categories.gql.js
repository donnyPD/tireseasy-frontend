import { gql } from '@apollo/client';

const categoryFragment = gql`
  fragment categoryFragment on CategoryInterface {
    id
    uid
    name
    product_count
    url_path
    url_suffix
    level
    position
    products {
      total_count
    }
  }
`;

export const GET_CATEGORY_LIST = gql`
  query getCategoryList($filters: CategoryFilterInput) {
    categoryList(filters: $filters) {
      id
      uid
      name
      children {
        ...categoryFragment
        children {
          ...categoryFragment
          children {
            ...categoryFragment
            children {
              ...categoryFragment
              children {
                ...categoryFragment
              }
            }
          }
        }
      }
    }
  }
  ${categoryFragment}
`;

export default {
  getCategoryListQuery: GET_CATEGORY_LIST
};
