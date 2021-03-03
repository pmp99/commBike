import {combineReducers} from 'redux';
import userReducer from './user_reducer'
import bike_reducer from "./bike_reducer";
import rental_reducer from "./rental_reducer";

const GlobalState = (combineReducers({
    user: userReducer,
    bike: bike_reducer,
    rental: rental_reducer
}))

export default GlobalState;