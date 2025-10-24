const extendIntercept = require('./extend-intercept');

module.exports = targets => {
  const peregrineTargets = targets.of('@magento/peregrine');
  const talonsTarget = peregrineTargets.talons;

  targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
    flags[targets.name] = {
      cssModules: true,
      esModules: true,
      graphqlQueries: true
    };
  });

  talonsTarget.tap(({ FilterModal, SearchPage, FilterSidebar, RootComponents }) => {
    RootComponents.Category.useCategoryContent.wrapWith(
      targets.name + '/targets/wrapUseCategoryContent.js'
    );

    FilterSidebar.useFilterSidebar.wrapWith(
      targets.name + '/targets/wrapUseFilterModal'
    );

    FilterModal.useFilterModal.wrapWith(
      targets.name + '/targets/wrapUseFilterModal'
    );

    FilterModal.useFilterState.wrapWith(
      targets.name + '/targets/wrapUseFilterState'
    );

    FilterModal.useFilterBlock.wrapWith(
      targets.name + '/targets/wrapUseFilterBlock'
    );

    SearchPage.useSearchPage.wrapWith(
        targets.name + '/src/talons/SearchPage/useSearchPage.js'
    );

    RootComponents.Category.useCategoryContent.wrapWith(
        targets.name + '/src/talons/RootComponents/Category/useCategoryContent.js'
    );
  });

  extendIntercept(targets);
};
