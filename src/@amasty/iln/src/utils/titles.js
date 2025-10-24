export const formatPrice = (value, currency = 'USD', locale = 'en') => {
  const numberFormat = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  });

  return numberFormat.format(value);
};

export const getRatingTitle = value => {
  if (Number(value) === 5) {
    return [
      {
        id: 'filterItem.rating5',
        defaultMessage: '5 stars'
      }
    ];
  }

  return [
    {
      id: 'filterItem.rating',
      defaultMessage: '{value} stars & up'
    },
    {
      value
    }
  ];
};

export const getStockTitle = value => {
  const titles = new Map()
    .set('2', {
      id: 'filterItem.outOfStock',
      defaultMessage: 'Out of Stock'
    })
    .set('1', {
      id: 'filterItem.inStock',
      defaultMessage: 'In Stock'
    });

  return [titles.get(value)];
};

export const getYesNoTitle = value => {
  const titles = new Map()
    .set('0', {
      id: 'filterItem.no',
      defaultMessage: 'No'
    })
    .set('1', {
      id: 'filterItem.yes',
      defaultMessage: 'Yes'
    });

  return [titles.get(value)];
};

export const getRangeTitle = (value, options) => {
  const { currencyCode, locale } = options || {};
  const [from, to] = value.split('_');

  return [
    {
      id: 'filterItem.FromTo',
      defaultMessage: '{from} - {to}'
    },
    {
      from:
        from !== '' && from !== '*'
          ? formatPrice(from, currencyCode, locale)
          : '*',
      to: to !== '' && to !== '*' ? formatPrice(to, currencyCode, locale) : '*'
    }
  ];
};

export const getOnSaleTitle = value => {
  const titles = new Map()
    .set('0', {
      id: 'filterItem.no',
      defaultMessage: 'No'
    })
    .set('1', {
      id: 'filterItem.onSale',
      defaultMessage: 'On Sale'
    });

  return [titles.get(value)];
};

export const getIsNewTitle = value => {
  const titles = new Map()
    .set('0', {
      id: 'filterItem.no',
      defaultMessage: 'No'
    })
    .set('1', {
      id: 'filterItem.isNew',
      defaultMessage: 'New'
    });

  return [titles.get(value)];
};
