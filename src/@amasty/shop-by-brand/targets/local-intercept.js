const extendIntercept = require('./extend-intercept');

module.exports = targets => {
  targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
    flags[targets.name] = {
      cssModules: true,
      esModules: true,
      graphqlQueries: true,
      rootComponents: true
    };
  });

  const venia = targets.of('@magento/venia-ui');
  const peregrineTargets = targets.of('@magento/peregrine');

  venia.richContentRenderers.tap(richContentRenderers => {
    richContentRenderers.add({
      componentName: 'AmShopByBrandRenderer',
      importPath: targets.name
    });
  });

  const routes = venia.routes;

  routes.tap(routesArray => {
    routesArray.push({
      name: 'Brand Page',
      pattern: '/brands/:slug?',
      path: targets.name + '/src/RootComponents/Brand'
    });

    return routesArray;
  });

  const talonsTarget = peregrineTargets.talons;

  talonsTarget.tap(({ MegaMenu, CategoryTree, App }) => {
    MegaMenu.useMegaMenu.wrapWith(targets.name + '/targets/wrapUseMegaMenu');
    CategoryTree.useCategoryTree.wrapWith(
      targets.name + '/targets/wrapUseCategoryTree'
    );
    App.useApp.wrapWith(targets.name + '/targets/wrapUseApp');
  });

  extendIntercept(targets);
};
