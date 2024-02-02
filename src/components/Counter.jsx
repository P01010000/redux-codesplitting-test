import { useCallback, useEffect, useRef, useState } from "react";
import { increment } from "../store/counter2";
import store from "../store";
import { useDispatch, useSelector } from "react-redux";
import counter2 from '../store/counter2';

const useWillMount = (callback) => {
    const mountedRef = useRef(false);

    if (!mountedRef.current) {
        mountedRef.current = true;
        callback();
    }
};

const Counter = () => {
    const dispatch = useDispatch();
    
    useWillMount(() => {
        store.injectReducer('counter2', counter2);
    });

    // useEffect(() => () => store.removeReducer('counter2'), []);

    const c = useSelector((state) => state.counter2.value);

    const handleClick = useCallback(() => {
        dispatch(increment());
    }, [dispatch]);

    return (
        <div>
            <h2>Counter</h2>
            <div>Count2: {c}</div>
            <button onClick={handleClick}>+</button>
        </div>
    )
}

export default Counter;
