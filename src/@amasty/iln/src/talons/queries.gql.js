import {gql} from '@apollo/client';

const GET_DYNAMIC_FILTERS = gql`
    query getFiltersQuery(
        $category_uid: String, 
        $applied_filters: [AppliedFiltersInput]
    ) {
        getCategoryFilters(
            input: {
                category_uid: $category_uid, 
                applied_filters: $applied_filters
            }
        ) {
            filters {
                label
                attribute_code
                options {
                    value
                    label
                    count
                    title
                    image
                }
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
        }
    }
`;

const GET_DYNAMIC_SEARCH_FILTERS = gql`
    query getSearchFiltersQuery(
        $search: String,
        $applied_filters: [AppliedFiltersInput]
    ) {
        getSearchFilters(
            input: {
                search: $search, 
                applied_filters: $applied_filters
            }
        ) {
            filters {
                label
                attribute_code
                options {
                    value
                    label
                    count
                    title
                    image
                }
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
        }
    }
`;

export default {
    getDynamicFilters: GET_DYNAMIC_FILTERS,
    getDynamicSearchFilters: GET_DYNAMIC_SEARCH_FILTERS
};
