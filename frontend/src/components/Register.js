import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {registerUser, resetUserError} from '../redux/actions/user_actions';
import {connect} from "react-redux";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            password2: ""
        }
        this.register = this.register.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
    }

    register(e){
        e.preventDefault()
        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };
        this.props.registerUser(user)
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
                    <h1 className="formTitle">CREAR UNA CUENTA</h1>
                    <form onSubmit={this.register} id="inputForm">
                        <div className="inputBox">
                            <label className="labelForm">Nombre</label>
                            <input type="text" className="form-control" onChange={(e) => {this.setState({name: e.target.value})}} required/>
                        </div>
                        <div className="inputBox">
                            <label className="labelForm">Correo electrónico</label>
                            <input type="email" className="form-control" onChange={(e) => {this.setState({email: e.target.value})}} required/>
                        </div>
                        <div className="inputBox">
                            <label className="labelForm">Contraseña</label>
                            <input type="password" className="form-control" onChange={(e) => {this.setState({password: e.target.value})}} required/>
                        </div>
                        <div className="inputBox">
                            <label className="labelForm">Repita la contraseña</label>
                            <input type="password" className="form-control" onChange={(e) => {this.setState({password2: e.target.value})}} required/>
                        </div>
                        <input type="submit" value="Crear cuenta" id="formButton"/>
                    </form>
                    <div id="loginAux"><h6>¿Ya tienes una cuenta? <Link id="loginAuxLink" to={'/login'}>Inicia sesión</Link></h6></div>
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

export default connect(mapStateToProps, {registerUser, resetUserError})(Register);