import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counter from './counter';
import { pokemonApi } from './pokemon'

const staticReducers = {
    counter,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
};

// const rootReducer = combineReducers({
//     counter,
//     [pokemonApi.reducerPath]: pokemonApi.reducer,
// });

const createReducer = (asyncReducers) => combineReducers({
    ...staticReducers,
    ...asyncReducers,
});

const injectReducerEnhancer = (createStore) => (...args) => {
    // console.log('hilo from enhancer', ...args);
    const store = createStore(...args);
    store.asyncReducers = {};

    store.injectReducer = (key, asyncReducer) => {
        if (key in store.asyncReducers) return;

        store.asyncReducers[key] = asyncReducer;

        // fake "COMMIT" from devtools, but requires correct id (and setTimeout 0 for replaceReducer)
        // window.postMessage({
        //     id: "1",
        //     payload: { type: 'COMMIT', timestamp: Date.now() },
        //     source: '@devtools-extension',
        //     state: undefined,
        //     type: 'DISPATCH'
        // }, '*');

        // with devtools enabled every action will be rerun on the new combined reducer which can be undesired behavior
        // if devtools are disabled everything works as expected
        store.replaceReducer(createReducer(store.asyncReducers));
    };

    store.removeReducer = (key) => {
        delete store.asyncReducers[key];
        store.replaceReducer(createReducer(store.asyncReducers));
    }

    return store;
};


const store = configureStore({
    reducer: staticReducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(pokemonApi.middleware),
    enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(injectReducerEnhancer),
    // devTools: false,
});

export default store;
