const initialState = {
    bikes: [],
    bike: {},
    showBike: false,
    update: false
}

export default function(state = initialState, action){
    switch(action.type){
        case 'GET_BIKES':
            return {
                ...state,
                bikes: action.payload,
                update: false,
                showBike: false
            }
        case 'GET_BIKE':
            return {
                ...state,
                bike: action.payload
            }
        case 'SHOW_BIKE':
            return {
                ...state,
                showBike: true
            }
        case 'START':
            return {
                ...state,
                showBike: false
            }
        case 'HIDE_BIKE':
            return {
                ...state,
                showBike: false
            }
        case 'RENTAL_ERROR':
            return {
                ...state,
                update: true
            }
        default:
            return state;
    }
}