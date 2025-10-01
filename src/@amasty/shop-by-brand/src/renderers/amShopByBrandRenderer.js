import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { WIDGET_CLASSNAME } from '../constants';
import AllBrandsPage from '../components/AllBrandsPage';
import BrandSlider from '../components/BrandSlider';
import { mapProps } from '../utils';

const widgetTypes = {
  BrandSlider,
  BrandList: AllBrandsPage
};

const transform = (node, index) => {
  if (
    node.type === 'tag' &&
    new RegExp(WIDGET_CLASSNAME).test(node.attribs.class) &&
    node.children &&
    node.children.length
  ) {
    const { children } = node;
    const scriptNode = children.find(child => child.type === 'script');
    const { data = '' } = scriptNode ? scriptNode.children[0] || {} : {};

    if (data.startsWith('var amBrandConfig')) {
      const configSting = data.split(' = ')[1].slice(1, -1);
      const props = JSON.parse(configSting);
      const type = props.type.replace(
        'Amasty\\ShopbyBrand\\Block\\Widget\\',
        ''
      );
      const WidgetComponent = widgetTypes[type] || null;

      return <WidgetComponent {...mapProps(props)} key={`amwidget-${index}`} />;
    }

    return null;
  }
};

const options = {
  decodeEntities: true,
  transform
};

export default function AmShopByBrandRenderer({ html, classes }) {
  // Even if empty, render a div with no content, for styling purposes.
  if (!html) {
    return <div className={classes.root} />;
  }

  return <div className={classes.root}>{ReactHtmlParser(html, options)}</div>;
}
