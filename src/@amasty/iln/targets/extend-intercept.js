const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
  const targetables = Targetables.using(targets);

  // add iln context provider
  const ContextProvider = targetables.reactComponent(
    '@magento/venia-ui/lib/components/App/contextProvider.js'
  );
  const AmIlnProvider = ContextProvider.addImport(
    "AmIlnProvider from '@amasty/iln/src/context'"
  );
  ContextProvider.insertBeforeSource(
    'const ContextProvider = ({ children }) => {',
    `contextProviders.push(${AmIlnProvider});\n`
  );

  // add new action type to filter state reducer
  const UseFilterState = targetables.esModule(
    '@magento/peregrine/lib/talons/FilterModal/useFilterState.js'
  );

  UseFilterState.addImport(
    "{ CHANGE_ITEM_ACTION_TYPE } from '@amasty/iln/src/actions/changeItemAction.js'"
  );
  UseFilterState.addImport(
    "{ changeItemAction } from '@amasty/iln/src/actions/changeItemAction.js'"
  );

  UseFilterState.insertBeforeSource(
    "case 'set items': {",
    'case CHANGE_ITEM_ACTION_TYPE: { return changeItemAction(state, payload); }\n'
  );

  // Add custom filter type to CONVERSION_FUNCTIONS
  targetables
    .esModule('@magento/peregrine/lib/talons/FilterModal/helpers.js')
    .insertAfterSource(
      'const CONVERSION_FUNCTIONS = {',
      '\nAmShopbyCustomFilterTypeInput: toEqualFilter, \n'
    );

  // replace filterList component
  targetables
    .reactComponent(
      '@magento/venia-ui/lib/components/FilterModal/FilterList/index.js'
    )
    .insertAfterSource(
      'export { default } from ',
      '"@amasty/iln/src/components/FilterList"',
      { remove: 25 }
    );

  // extend useCategory
  targetables
    .esModule(
      '@magento/peregrine/lib/talons/RootComponents/Category/useCategory.js'
    )
    .insertAfterSource(
      "newFilters['category_uid'] = ",
      "newFilters['category_uid'] || "
    );

  // add am shop by filter data to getProductFiltersByCategory query
  // lib/talons/RootComponents/Category/categoryContent.gql.js
  const CategoryContentGQL = targetables.esModule(
    '@magento/peregrine/lib/talons/RootComponents/Category/categoryContent.gql.js'
  );

  CategoryContentGQL.addImport(
    "import { AmShopbyFilterDataFragment } from '@amasty/iln/src/talons/amILNFragments.gql.js'"
  );

  CategoryContentGQL.addImport(
    "import { AggregationOptionFragment } from '@amasty/iln/src/talons/amILNFragments.gql.js'"
  );

  CategoryContentGQL.insertBeforeSource(
    'attribute_code',
    '...AmShopbyFilterDataFragment\n'
  )
    .insertBeforeSource(
      '`;',
      '${AmShopbyFilterDataFragment}\n${AggregationOptionFragment}\n'
    )
    .insertAfterSource('options {', '\n...AggregationOptionFragment\n');

  // search filters
  const SearchPageGQL = targetables.esModule(
    '@magento/peregrine/lib/talons/SearchPage/searchPage.gql.js'
  );

  SearchPageGQL.addImport(
    "import { AmShopbyFilterDataFragment } from '@amasty/iln/src/talons/amILNFragments.gql.js'"
  );

  SearchPageGQL.addImport(
    "import { AggregationOptionFragment } from '@amasty/iln/src/talons/amILNFragments.gql.js'"
  );

  SearchPageGQL.insertBeforeSource(
    'attribute_code',
    '...AmShopbyFilterDataFragment\n'
  )
    .insertAfterSource(
      'export const GET_PRODUCT_FILTERS_BY_SEARCH = gql`',
      '\n${AmShopbyFilterDataFragment}\n${AggregationOptionFragment}\n'
    )
    .insertAfterSource('options {', '\n...AggregationOptionFragment\n');

  // Add tooltip and expanded to FilterBlock
  const FilterBlock = targetables.reactComponent(
    '@magento/venia-ui/lib/components/FilterModal/filterBlock.js'
  );

  const Tooltip = FilterBlock.addImport(
    "Tooltip from '@amasty/iln/src/components/Tooltip'"
  );

  FilterBlock.insertAfterSource(
    ' const talonProps = useFilterBlock(',
    'props, '
  )
    .insertAfterSource(
      '= talonProps;',
      '\nif(talonProps.isHidden) return null;\n'
    )
    .appendJSX(
      'span className={classes.name}',
      `${Tooltip} {...talonProps.filterBlockSettings}`
    )
    .setJSXProps('FilterList', {
      filterBlockSettings: '{talonProps.filterBlockSettings}'
    });

  // current filters
  const CurrentFilters = targetables.reactComponent(
    '@magento/venia-ui/lib/components/FilterModal/CurrentFilters/currentFilters.js'
  );

  CurrentFilters.setJSXProps('li key={key} className={classes.item}', {
    className: '{props.getItemClassName(elements)}'
  })
    .insertAfterSource(
      '[classes.item, filterState, removeItem, onRemove',
      ', props.getItemClassName'
    )
    .wrapWithFile('@amasty/iln/targets/wrapCurrentFilters.js');

  // filterSidebar
  const FilterSidebar = targetables.esModule(
    '@magento/venia-ui/lib/components/FilterSidebar/filterSidebar.js'
  );

  FilterSidebar.wrapWithFile('@amasty/iln/targets/wrapFilterSidebar.js');
};
