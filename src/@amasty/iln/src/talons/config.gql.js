import { gql } from '@apollo/client';

const GET_ILN_CONFIG = gql`
  query storeConfigData {
    storeConfig {
      id
      store_code
      amshopby_slider_slider_style
      amshopby_general_unfolded_options_state
      default_display_currency_code
      amshopby_general_keep_single_choice_visible
    }
  }
`;

export default {
  getIlnConfigQuery: GET_ILN_CONFIG
};
