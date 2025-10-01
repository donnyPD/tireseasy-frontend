import { BRANDS_URL_KEY, PROP_TYPES } from './constants';

export const getBrandUrl = url => {
  const urlKey = getUrlKey(url);

  return `/${BRANDS_URL_KEY}/${urlKey}`;
};

export const getUrlKey = url => {
  const segments = url.replace('.html', '').split('/');
  const lastSegment = segments.pop();
  return lastSegment || segments.pop();
};

const { string, number, bool } = PROP_TYPES;

const propTypes = {
  autoplay: bool,
  autoplay_delay: number,
  buttons_show: bool,
  display_zero: bool,
  image_height: number,
  image_width: number,
  infinity_loop: bool,
  items_number: number,
  pagination_show: bool,
  pagintaion_clickable: bool,
  show_label: bool,
  simulate_touch: bool,
  slider_header_color: string,
  slider_title: string,
  slider_title_color: string,
  slider_width: number,
  sort_by: string,

  columns: number,
  filter_display_all: bool,
  show_count: bool,
  show_filter: bool,
  show_images: bool,
  show_search: bool
};

export const mapProps = props =>
  Object.keys(props).reduce((res, key) => {
    const type = propTypes[key] || string;
    let value = props[key];
    const intValue = parseInt(value);

    if ((type === number || type === bool) && !isNaN(intValue)) {
      value = type === bool ? Boolean(intValue) : intValue;
    }

    return {
      ...res,
      [key]: value
    };
  }, {});
