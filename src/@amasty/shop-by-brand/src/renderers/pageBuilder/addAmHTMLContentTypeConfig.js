import React from 'react';
import configAggregator from './configAggregator';
import { setContentTypeConfig } from '@magento/pagebuilder/lib/config';

const config = {
  configAggregator,
  component: React.lazy(() => import('./html'))
};

export default () => setContentTypeConfig('html', config);
