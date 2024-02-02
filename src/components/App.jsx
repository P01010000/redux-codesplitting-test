import React, { Suspense, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increment, loadLazyCounterReducers } from '../store/counter';
import { createSelector } from '@reduxjs/toolkit';
import { pokemonApi, useGetPokemonByNameQuery, useLazyGetPokemonByNameQuery } from '../store/pokemon';
import store from '../store';
// import Counter from './Counter';
const Counter = React.lazy(() => import('./Counter'));

const makeSelector = () => createSelector(
    [(state, id) => {
        // console.log('input', state, id)
        return state.counter.entities;
    }, (_, id) => id],
    (entities, id) => {
        const list = [];
        
        const stack = [id];
        while(stack.length) {
            const id = stack.pop();
            const element = { ...entities[id] };
            list.push(element);
            stack.push(...element.children);
            delete element.children;
        }

        // console.log('entities', id, entities);
        return list;
    },
)

const useTest = (id) => {
    // console.log('useTest', id);
    const selector = useMemo(makeSelector, []);

    const res = useSelector((state) => selector(state, id));

    return res;
}


const App = () => {
    const dispatch = useDispatch();
    const c = useSelector((state) => state.counter.value);
    const test = useTest((Math.floor(c / 4) % 4) + 1);
    const pokemon = useGetPokemonByNameQuery('bulbasaur');

    // console.log('test', pokemonApi.util.getRunningQueriesThunk());

    // console.log('c', c, test);
    // console.log('pokemon', pokemon);

    const handleClick = useCallback(() => {
        dispatch(increment());
    }, [dispatch]);

    // const handleClick2 = useCallback(async () => {
    //     const a = await import('../store/counter2');
    //     console.log('a', a);
    //     store.injectReducer('counter2', a.default);
    // }, []);

    // const handleClick3 = useCallback(() => {
    //     store.removeReducer('counter2');
    // }, []);

    return (
        <>
            <h1>Hi! Welcome to your newly created chayns application!</h1>
            <div>Count: {c}</div>
            <button onClick={handleClick}>+</button>
            <button onClick={loadLazyCounterReducers}>Lazy</button>
            {/* <button onClick={handleClick2}>Add Async Reducer</button> */}
            {/* <button onClick={handleClick3}>Remove Async Reducer</button> */}
            {Math.floor(c / 3) % 2 === 1 && (
                <Suspense>
                    <Counter/>
                </Suspense>
            )}
        </>
    )
};

export default App;
