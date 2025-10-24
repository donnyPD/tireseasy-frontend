import { gql } from '@apollo/client';

export const AmShopbyFilterDataFragment = gql`
  fragment AmShopbyFilterDataFragment on Aggregation {
    amshopby_filter_data {
      is_multiselect
      display_mode
      display_mode_label
      slider_step
      units_label_use_currency_symbol
      units_label
      is_expanded
      show_product_quantities
      is_show_search_box
      number_unfolded_options
      tooltip
      is_tooltips_enabled
      tooltips_image
      add_from_to_widget
      visible_in_categories
      categories_filter
      slider_min
      slider_max
      category_tree_display_mode
      limit_options_show_search_box
      category_tree_depth
      subcategories_view
      subcategories_expand
      render_categories_level
      render_all_categories_tree
      sort_options_by
    }
  }
`;

export const AggregationOptionFragment = gql`
  fragment AggregationOptionFragment on AggregationOption {
    count
    title
    image
  }
`;
