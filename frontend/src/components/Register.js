import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {registerUser, resetUserError} from '../redux/actions/user_actions';
import {connect} from "react-redux";

class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            password2: "",
            error: ""
        }
        this.register = this.register.bind(this);
    }

    componentDidUpdate(prevProps){
        if (this.props.user.error !== prevProps.user.error) {
            this.setState({
                error: this.props.user.error
            })
        }
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
    render() {
        return(
            <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <h1 style={{textAlign: "center", padding: "10px", marginBottom: "auto"}}>Crear una cuenta</h1>
                <div style={{marginBottom: "auto"}}>
                    <form onSubmit={this.register} id="inputForm">
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Nombre</label>
                            <input type="text" className="form-control" onChange={(e) => {this.setState({name: e.target.value}); this.props.resetUserError()}} required/>
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Correo electrónico</label>
                            <input type="email" className="form-control" onChange={(e) => {this.setState({email: e.target.value}); this.props.resetUserError()}} required/>
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Contraseña</label>
                            <input type="password" className="form-control" onChange={(e) => {this.setState({password: e.target.value}); this.props.resetUserError()}} required/>
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Repita la contraseña</label>
                            <input type="password" className="form-control" onChange={(e) => {this.setState({password2: e.target.value}); this.props.resetUserError()}} required/>
                        </div>
                        {this.state.name === "" || this.state.password === "" || this.state.password2 === "" || this.state.email === "" ?
                            <input type="submit" value="Crear cuenta" id="loginButtonDisabled"/> :
                            <input type="submit" value="Crear cuenta" id="loginButton"/>}
                    </form>
                    <div id="loginAux">
                        <div style={{margin: "auto auto"}}><h6>¿Ya tienes una cuenta?&nbsp;</h6><Link to={'/login'}>Inicia sesión</Link></div>
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

export default connect(mapStateToProps, {registerUser, resetUserError})(Register);