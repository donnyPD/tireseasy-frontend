export const CHANGE_ITEM_ACTION_TYPE = 'Am Change Item';

export const changeItemAction = (state, payload) => {
  const { group, item } = payload;
  const nextState = new Map(state);
  const nextSet = new Set(state.get(group));

  if (nextSet.size) {
    nextSet.clear();
  }

  nextSet.add(item);

  // if removing an item leaves a group empty, delete that group
  if (nextSet.size) {
    nextState.set(group, nextSet);
  } else {
    nextState.delete(group);
  }

  return nextState;
};
