import { createSlice, current } from "@reduxjs/toolkit";
import {increment as increment1 } from './counter';

const initialState = {
  value: 0,
  ids: [1, 2, 3, 4],
  entities: {
    1: { id: 1, children: [2, 3]},
    2: { id: 2, children: [], parentId: 1 },
    3: { id: 3, children: [4], parentId: 1 },
    4: { id: 4, children: [], parentId: 3 },
  }
}

const slice = createSlice({
  name: 'counter2',
  initialState,
  reducers: {
    increment(state, action) {
      state.value++
    },
    decrement(state) {
      state.value--
    },
    incrementByAmount(state, action) {
      state.value += action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(increment1, (draft, action) => {
        console.log('c2', current(draft), action);
        // draft.value++;
    })
  }
});

export const { increment, decrement, incrementByAmount } = slice.actions;
export default slice.reducer;
