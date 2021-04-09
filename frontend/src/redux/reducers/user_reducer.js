const initialState = {
    authenticated: false,
    user: {},
    error: "",
    success: ""
}

export default function(state = initialState, action){
    switch(action.type){
        case 'LOGIN':
            return {
                ...state,
                authenticated: !isEmpty(action.payload),
                user: action.payload
            }
        case 'USER_ERROR':
            return {
                ...state,
                error: action.payload
            }
        case 'USER_SUCCESS':
            return {
                ...state,
                success: action.payload
            }
        default:
            return state;
    }
}


const isEmpty = value =>
    value === undefined || value === null || (typeof value === 'object' && Object.keys(value).length === 0) || (typeof value === 'string' && value.trim().length === 0);