import { createReducer } from "@reduxjs/toolkit";

console.log('loooooooaded')

const test = createReducer(undefined, (builder) => {
    builder.addCase('counter/increment', (draft, action) => {
        draft.value++;
    })
})

export default test;
