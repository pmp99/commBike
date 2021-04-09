const initialState = {
    rentals: [],
    rental: {},
    started: false,
    error: ""
}

export default function(state = initialState, action){
    switch(action.type){
        case 'GET_RENTALS':
            return {
                ...state,
                rentals: action.payload
            }
        case 'GET_RENTAL':
            return {
                ...state,
                rental: action.payload
            }
        case 'START':
            return {
                ...state,
                rental: action.payload,
                started: true
            }
        case 'FINISH':
            return {
                ...state,
                rental: action.payload,
                started: false
            }
        case 'RENTAL_ERROR':
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}