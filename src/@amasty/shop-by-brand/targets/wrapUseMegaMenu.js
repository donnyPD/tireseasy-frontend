import { useBrandSettings } from '@amasty/shop-by-brand/src/talons/useBrandSettings';

const wrapUseMegaMenu = original => props => {
  const defaultReturnData = original(props);

  const { label, topMenuPosition, urlKey, isEnabled } = useBrandSettings();

  const { megaMenuData, categoryUrlSuffix } = defaultReturnData;
  const getSuffix = cat => (!cat.isBrandLink ? categoryUrlSuffix : '');

  if (isEnabled) {
    const { children = [] } = megaMenuData;
    const randomId = 'brandId';

    const brandsItem = {
      uid: 'brandId',
      include_in_menu: 1,
      isActive: false,
      name: label || '',
      url_path: urlKey,
      children: [],
      path: [randomId],
      position: 0,
      isBrandLink: true
    };

    return {
      ...defaultReturnData,
      categoryUrlSuffix: getSuffix,
      megaMenuData: {
        ...megaMenuData,
        children:
          topMenuPosition === 1
            ? [brandsItem, ...children]
            : [...children, brandsItem]
      }
    };
  }

  return {
    ...defaultReturnData,
    categoryUrlSuffix: getSuffix
  };
};

export default wrapUseMegaMenu;
