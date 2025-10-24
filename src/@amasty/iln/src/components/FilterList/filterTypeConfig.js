import PriceSlider from '../PriceSlider';
import Swatch from '../Swatch';
import Rating from '../Rating';
import Category from '../Category';
import defaultClasses from './filterList.css';
import Label from '../Label';
import FromTo from '../FromTo';
import {
  getRatingTitle,
  getStockTitle,
  getRangeTitle,
  getIsNewTitle,
  getOnSaleTitle
} from '../../utils/titles';

export const filterTypeConfig = {
  Slider: {
    listComponent: PriceSlider,
    optionTitle: getRangeTitle
  },
  Ranges: {
    itemComponent: Label,
    optionTitle: getRangeTitle
  },
  Images: {
    itemComponent: Swatch,
    classes: { items: defaultClasses.swatchList }
  },
  'Text Swatches': {
    itemComponent: Swatch,
    classes: { items: defaultClasses.swatchList },
    textOnly: true
  },
  'Images & Labels': {
    itemComponent: Label
  },
  rating: {
    itemComponent: Rating,
    optionTitle: getRatingTitle
  },
  stock: {
    itemComponent: Label,
    optionTitle: getStockTitle
  },
  category_ids: {
    listComponent: Category
  },

  'From-To Only': {
    listComponent: FromTo,
    optionTitle: getRangeTitle
  },

  am_on_sale: {
    itemComponent: Label,
    optionTitle: getOnSaleTitle
  },
  am_is_new: {
    itemComponent: Label,
    optionTitle: getIsNewTitle
  }
};

export default filterTypeConfig;
