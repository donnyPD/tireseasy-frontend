const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
  const targetables = Targetables.using(targets);

  // Add More From this Brand component to Product Full Detail page
  const ProductFullDetailComponent = targetables.reactComponent(
    '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.js'
  );
  const MoreFromBrand = ProductFullDetailComponent.addImport(
    "{ MoreFromBrand } from '@amasty/shop-by-brand'"
  );

  ProductFullDetailComponent.appendJSX(
    'Fragment',
    `<${MoreFromBrand} productId={product.id} />`
  );

  const MegaMenuComponent = targetables.reactComponent(
    '@magento/venia-ui/lib/components/MegaMenu/megaMenu.js'
  );
  MegaMenuComponent.setJSXProps('MegaMenuItem', {
    categoryUrlSuffix: '{categoryUrlSuffix(category)}'
  });

  const CategoryTreeComponent = targetables.reactComponent(
    '@magento/venia-ui/lib/components/CategoryTree/categoryTree.js'
  );
  CategoryTreeComponent.setJSXProps('Leaf', {
    categoryUrlSuffix: '{categoryUrlSuffix(category)}'
  });
};
