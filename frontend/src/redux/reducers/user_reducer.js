const initialState = {
    authenticated: false,
    user: {},
    error: ""
}

export default function(state = initialState, action){
    switch(action.type){
        case 'LOGIN':
            return {
                ...state,
                authenticated: !isEmpty(action.payload),
                user: action.payload
            }
        case 'ERROR':
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}


const isEmpty = value =>
    value === undefined || value === null || (typeof value === 'object' && Object.keys(value).length === 0) || (typeof value === 'string' && value.trim().length === 0);