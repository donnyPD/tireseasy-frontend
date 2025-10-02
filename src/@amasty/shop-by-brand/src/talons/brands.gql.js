import { gql } from '@apollo/client';
import {
  GET_FILTER_INPUTS,
  PRODUCT_SEARCH,
  GET_PAGE_SIZE
} from '../../../../talons/SearchPage/searchPage.gql';
import { GET_PRODUCT_FILTERS_BY_BRAND } from './productFilters.gql';

export const GET_BRAND_LIST = gql`
  query getBrandList(
    $imageWidth: Int
    $imageHeight: Int
    $showCount: Boolean
    $displayZero: Boolean
  ) {
    ambrandlist(
      imageWidth: $imageWidth
      imageHeight: $imageHeight
      showCount: $showCount
      displayZero: $displayZero
    ) {
      all_letters
      brand_attribute {
        attribute_code
      }
      items {
        brandId
        label
        url
        img
        image
        description
        short_description
        cnt
        alt
        letter
      }
    }
  }
`;

export const GET_BRANDS_SLIDER = gql`
  query getBrandsSlider(
    $imageWidth: Int
    $imageHeight: Int
    $sortBy: String
    $displayZero: Boolean
  ) {
    ambrandslider(
      imageWidth: $imageWidth
      imageHeight: $imageHeight
      sortBy: $sortBy
      displayZero: $displayZero
    ) {
      items {
        label
        url
        img
        position
        alt
      }
    }
  }
`;

export const GET_BRAND_CONFIG = gql`
  query getBrandsConfig {
    storeConfig {
      store_code
      amshopby_brand_general_topmenu_enabled
      amshopby_brand_general_menu_item_label
    }
  }
`;

export default {
  allBrandsPageQuery: GET_BRAND_LIST,
  getFilterInputsQuery: GET_FILTER_INPUTS,
  getProductFiltersByBrandQuery: GET_PRODUCT_FILTERS_BY_BRAND,
  productSearchQuery: PRODUCT_SEARCH,
  brandConfigQuery: GET_BRAND_CONFIG,
  brandsSliderQuery: GET_BRANDS_SLIDER,
  getPageSize: GET_PAGE_SIZE
};
