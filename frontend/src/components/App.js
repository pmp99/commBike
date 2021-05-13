import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Main from './Main';
import Login from './Login';
import Register from './Register';
import Profile from "./Profile";
import Bikes from "./Bikes";
import Rentals from "./Rentals";
import NavBar from "./NavBar";

class App extends React.Component {
    render(){
        return (
            <Router>
                <Route path="/*" component={NavBar}/>
                <Route exact path="/" component={Main}/>
                <Switch>
                    <Route exact path="/login" render={() => !this.props.user.authenticated ? <Login/> : <Redirect to="/" />}/>
                    <Route exact path="/register" render={() => !this.props.user.authenticated ? <Register/> : <Redirect to="/" />}/>
                    <Route exact path="/profile" render={() => this.props.user.authenticated ? <Profile/> : <Redirect to="/" />}/>
                    <Route exact path="/bikes" render={() => this.props.user.user.admin ? <Bikes/> : <Redirect to="/" />}/>
                    <Route exact path="/rentals" render={() => this.props.user.authenticated ? <Rentals/> : <Redirect to="/" />}/>
                    <Redirect to="/"/>
                </Switch>
            </Router>
        );
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps)(App);