import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {loginUser, resetUserError} from '../redux/actions/user_actions';
import {connect} from "react-redux";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: ""
        }
        this.login = this.login.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
    }

    login(e){
        e.preventDefault()
        const user = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(user)
    }

    closeAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.props.resetUserError()
    }

    render() {
        return(
            <div className="backgroundMain">
                <div className="loginForm">
                    <h1 className="formTitle">INICIAR SESIÓN</h1>
                    <form onSubmit={this.login} id="inputForm">
                        <div className="inputBox">
                            <label className="labelForm">Correo electrónico</label>
                            <input type="email" className="form-control" onChange={(e) => {this.setState({email: e.target.value})}} required/>
                        </div>
                        <div className="inputBox">
                            <label className="labelForm">Contraseña</label>
                            <input type="password" className="form-control" onChange={(e) => {this.setState({password: e.target.value})}} required/>
                        </div>
                        <input type="submit" value="Iniciar sesión" id="formButton"/>
                    </form>
                    <div id="loginAux"><h6>¿No tienes una cuenta? <Link id="loginAuxLink" to={'/register'}>Regístrate</Link></h6></div>
                </div>
                <Snackbar open={this.props.user.error !== ""} autoHideDuration={3000} onClose={this.closeAlert}>
                    <MuiAlert onClose={this.closeAlert} severity="error" variant="filled">
                        {this.props.user.error}
                    </MuiAlert>
                </Snackbar>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps, {loginUser, resetUserError})(Login);