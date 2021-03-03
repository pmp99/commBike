import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {loginUser, resetUserError} from '../redux/actions/user_actions';
import {connect} from "react-redux";

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            error: ""
        }
        this.login = this.login.bind(this);
    }

    componentDidUpdate(prevProps){
        if (this.props.user.error !== prevProps.user.error) {
            this.setState({
                error: this.props.user.error
            })
        }
    }

    login(e){
        e.preventDefault()
        const user = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(user)
    }
    render() {
        return(
            <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <h1 style={{textAlign: "center", padding: "10px", marginBottom: "auto"}}>Iniciar sesión</h1>
                <div style={{marginBottom: "auto"}}>
                    <form onSubmit={this.login} id="inputForm">
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Correo electrónico</label>
                            <input type="email" className="form-control" onChange={(e) => {this.setState({email: e.target.value}); this.props.resetUserError()}} required/>
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Contraseña</label>
                            <input type="password" className="form-control" onChange={(e) => {this.setState({password: e.target.value}); this.props.resetUserError()}} required/>
                        </div>
                        {this.state.email === "" || this.state.password === "" ?
                            <input type="submit" value="Iniciar sesión" id="loginButtonDisabled"/> :
                            <input type="submit" value="Iniciar sesión" id="loginButton"/>}
                    </form>
                    <div id="loginAux">
                        <div style={{margin: "auto auto"}}><h6>¿No tienes una cuenta?&nbsp;</h6><Link to={'/register'}>Regístrate</Link></div>
                    </div>
                </div>
                {this.state.error === "" ?
                    <div style={{height: "8vh", backgroundColor: "#f0f0f0"}}/>
                    :
                    <div id="error"><h5 style={{margin: "auto auto"}}>{this.state.error}</h5></div>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps, {loginUser, resetUserError})(Login);