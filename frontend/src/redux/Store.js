import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import GlobalState from "./reducers/reducers";

const initialState = {};
const middleware = [thunk];

const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({

}) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(...middleware)
);

const store = createStore(GlobalState, initialState, enhancer);

export default store;