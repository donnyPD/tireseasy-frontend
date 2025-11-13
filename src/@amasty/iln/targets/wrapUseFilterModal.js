import { useCallback, useMemo } from 'react';
import {
  stripHtml,
  getFiltersFromSearch,
  DELIMITER
} from '@magento/peregrine/lib/talons/FilterModal/helpers';
import { useIntl } from 'react-intl';
import { filterTypeConfig } from '@amasty/iln/src/components/FilterList/filterTypeConfig';
import { useLocation } from 'react-router-dom';
import { useAmIlnContext } from '../src/context';

const CATEGORY_ID_GROUP = 'category_uid';

const getTitle = ({
  title,
  label,
  value,
  displayMode,
  currencyCode,
  locale
}) => {
  const config = filterTypeConfig[displayMode];

  if (!title && config && config.optionTitle) {
    const { optionTitle } = config;

    return typeof optionTitle === 'function'
      ? optionTitle(value, { currencyCode, locale })
      : optionTitle;
  }

  return title || stripHtml(label);
};

const wrapUseFilterModal = original => props => {
  const defaultReturnData = original(props);
  const { filterApi, filterItems, filterNames, filterKeys } = defaultReturnData;
  const { filters } = props;

  const { formatMessage, locale } = useIntl();

  const { search } = useLocation();
  const { currencyCode } = useAmIlnContext() || {};

  const amShopByFilterData = useMemo(() => {
    const inputFilters = getFiltersFromSearch(search);
    const dataByGroup = new Map();

    for (const filter of filters) {
      const {
        attribute_code: group,
        label: name,
        amshopby_filter_data,
        options: defaultOptions
      } = filter;

      dataByGroup.set(group, amshopby_filter_data);

      if (filterItems.has(group) || group === CATEGORY_ID_GROUP) {
        filterNames.set(group, name);
        filterKeys.add(`${group}[filter]`);

        const groupItems = new Set(inputFilters.get(group));
        const options = [...defaultOptions];

        if (groupItems.size) {
          for (const item of groupItems) {
            const [title, value] = item.split(DELIMITER);
            const isIncluded = options.find(option => option.value === value);

            if (!isIncluded) {
              options.push({
                count: 1,
                label: title,
                value,
                custom: true
              });
            }
          }
        }

        const items = options.map(({ label, value, title, ...rest }) => {
          const formattedTitle = getTitle({
            title,
            label,
            value,
            displayMode: amshopby_filter_data?.display_mode_label,
            currencyCode,
            locale
          });

          return {
            ...rest,
            title:
              typeof formattedTitle === 'object'
                ? formatMessage(...formattedTitle)
                : formattedTitle,
            value
          };
        });

        filterItems.set(group, items);
      }
    }

    return dataByGroup;
  }, [
    filters,
    filterItems,
    filterNames,
    filterKeys,
    formatMessage,
    search,
    currencyCode,
    locale
  ]);

  const getAmFilterData = useCallback(group => amShopByFilterData.get(group), [
    amShopByFilterData
  ]);

  return {
    ...defaultReturnData,
    filterItems,
    filterNames,
    filterKeys,
    filterApi: {
      ...filterApi,
      getAmFilterData
    }
  };
};

export default wrapUseFilterModal;
