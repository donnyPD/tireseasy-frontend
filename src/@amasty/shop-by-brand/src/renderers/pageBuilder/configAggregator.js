import htmlConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Html/configAggregator.js';
import detectAmCustomFormRenderer from '../detectAmShopByRenderer.js';

export default (node, props) => {
  const defaultReturnData = htmlConfigAggregator(node, props);

  const richContent = node.innerHTML
    ? node.innerHTML
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
    : '';

  return {
    isDefaultComponent: !detectAmCustomFormRenderer(richContent),
    richContent,
    ...defaultReturnData
  };
};
