import axios from 'axios';

export const loginUser = user => dispatch => {
    let email = user.email;
    let password = user.password;

    axios.post('/user/login', {email, password})
        .then(res => {
            if (!res.data) {
                dispatch({
                    type: 'ERROR',
                    payload: "Datos de inicio de sesión incorrectos"
                })
            } else {
                const session = {
                    user: {
                        name: res.data.name,
                        email: res.data.email,
                        isAdmin: res.data.isAdmin,
                        id: res.data.id
                    }
                }
                localStorage.setItem("session", JSON.stringify(session))
                dispatch(setUser(session.user))
            }
        })
}

export const registerUser = user => dispatch => {
    const name = user.name;
    const password = user.password;
    const password2 = user.password2;
    const email = user.email;
    axios.post('/user/register', {name, password, password2, email})
        .then(res => {
            if(res.data.success){
                const session = {
                    user: {
                        name: res.data.data.name,
                        email: res.data.data.email,
                        isAdmin: res.data.data.isAdmin,
                        id: res.data.data.id
                    }
                }
                localStorage.setItem("session", JSON.stringify(session))
                dispatch(setUser(session.user))
            } else{
                dispatch({
                    type: 'ERROR',
                    payload: res.data.data
                })
            }
        })
}


export const setUser = user => {
    if(user.email === undefined){
        return {
            type: 'LOGIN',
            payload: {}
        }
    } else {
        return {
            type: 'LOGIN',
            payload: user
        }
    }
}

export const logoutUser = () => dispatch => {
    localStorage.removeItem('session');
    dispatch(setUser({}));
}

export const editUser = (user, id) => dispatch => {
    const name = user.name;
    const email = user.email;
    axios.put('/user/edit/'+id, {name, email})
        .then(res => {
            const session = {
                user: {
                    name: res.data.name,
                    email: res.data.email,
                    isAdmin: res.data.isAdmin,
                    id: res.data.id
                }
            }
            localStorage.setItem("session", JSON.stringify(session))
            dispatch(setUser(session.user));
        })
}

export const changePassword = (passwords, id) => dispatch => {
    const oldPassword = passwords.oldPassword;
    const newPassword = passwords.newPassword;
    const newPassword2 = passwords.newPassword2;
    axios.put('/user/password/'+id, {oldPassword, newPassword, newPassword2})
        .then(res => {
            if (!res.data.success) {
                dispatch({
                    type: 'ERROR',
                    payload: res.data.data
                })
            } else {
                const session = {
                    user: {
                        name: res.data.data.name,
                        email: res.data.data.email,
                        isAdmin: res.data.data.isAdmin,
                        id: res.data.data.id
                    }
                }
                localStorage.setItem("session", JSON.stringify(session))
                dispatch(setUser(session.user))
            }
        })
}

export const resetUserError = () => dispatch => {
    dispatch({
        type: 'ERROR',
        payload: ""
    })
}