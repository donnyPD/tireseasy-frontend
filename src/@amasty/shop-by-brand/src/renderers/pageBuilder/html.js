import React from 'react';
import DefaultHTMLComponent from '@magento/pagebuilder/lib/ContentTypes/Html';
import BlockComponent from '@magento/pagebuilder/lib/ContentTypes/Block';
import { bool } from 'prop-types';

const Html = props => {
  const { isDefaultComponent, ...rest } = props;

  if (isDefaultComponent) {
    return <DefaultHTMLComponent {...rest} />;
  }

  return <BlockComponent {...rest} />;
};

Html.propTypes = {
  isDefaultComponent: bool
};

export default Html;
