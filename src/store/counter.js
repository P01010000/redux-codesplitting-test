import { createSlice, current } from "@reduxjs/toolkit";

let lazyReducers = null;

const initialState = {
  value: 0,
  ids: [1, 2, 3, 4],
  entities: {
    1: { id: 1, children: [2, 3] },
    2: { id: 2, children: [], parentId: 1 },
    3: { id: 3, children: [4], parentId: 1 },
    4: { id: 4, children: [], parentId: 3 },
  }
}

const slice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state, action) {
      console.log('c1', current(state), action)
      // state.value++
    },
    decrement(state) {
      state.value--
    },
    incrementByAmount(state, action) {
      state.value += action.payload
    },
  },
});

const enhanceReducer = (reducer) => (state, action) => {
  let newState = reducer(state, action);
  if (typeof lazyReducers === 'function' && action.lazy !== false) {
    newState = lazyReducers(newState, action)
  } else {
    // add hint that lazy reducer was not loaded and therefor not used for this action
    // only needed when devtools are enabled, cause actions might be rerun after store.replaceReducer
    action.lazy = false;
  }
  return newState;
}

export const loadLazyCounterReducers = () => {
  console.log('lazy load it');
  import('./counterLazy').then((c) => {
    lazyReducers = c.default;
  });
}

export const { increment, decrement, incrementByAmount } = slice.actions;
export default enhanceReducer(slice.reducer);
