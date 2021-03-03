import { Provider } from 'react-redux';
import store from './Store';
import React from 'react';
import App from '../components/App';
import { setUser } from './actions/user_actions';

if(localStorage.session){
    let session = JSON.parse(localStorage.session);
    store.dispatch(setUser(session.user))
}


export default class ReduxProvider extends React.Component {
    render() {
        return (
            <Provider store={ store }>
                <div style={{ height: '100%' }} >
                    <App store={ this.store } />
                </div>
            </Provider>
        );
    }
}