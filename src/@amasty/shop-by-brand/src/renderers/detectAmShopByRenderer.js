import { WIDGET_CLASSNAME } from '../constants';
/**
 * Determine if the content is Amasty Custome Form or not
 *
 * @param content
 * @returns {boolean}
 */
export default function detectAmShopByRenderer(content) {
  return new RegExp(WIDGET_CLASSNAME).test(content);
}
