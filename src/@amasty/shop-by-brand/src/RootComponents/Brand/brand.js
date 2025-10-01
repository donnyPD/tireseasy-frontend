import React from 'react';
import { useParams } from 'react-router';
import MagentoRoute from '@magento/venia-ui/lib/components/MagentoRoute';
import BrandPage from '../../components/BrandPage';

const Brand = () => {
  const { slug } = useParams();

  if (!slug) {
    return <MagentoRoute />;
  }

  return <BrandPage brand={slug} />;
};

export default Brand;
