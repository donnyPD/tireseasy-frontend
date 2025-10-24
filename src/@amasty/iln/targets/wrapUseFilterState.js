import { useCallback } from 'react';
import { CHANGE_ITEM_ACTION_TYPE } from '../src/actions/changeItemAction';

const wrapUseFilterState = original => props => {
  const [state, api] = original(props);

  const { dispatch } = api;

  api.changeItem = useCallback(
    payload => {
      dispatch({ payload, type: CHANGE_ITEM_ACTION_TYPE });
    },
    [dispatch]
  );

  return [state, api];
};

export default wrapUseFilterState;
