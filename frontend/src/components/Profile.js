import React from 'react';
import {connect} from 'react-redux';
import {editUser, changePassword} from '../redux/actions/user_actions';

class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            email: "",
            oldPassword: "",
            newPassword: "",
            newPassword2: "",
            error: ""
        }
        this.editUser = this.editUser.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    componentDidMount() {
        this.setState({
            name: this.props.user.user.name,
            email: this.props.user.user.email
        })
    }

    componentDidUpdate(prevProps){
        if (this.props.user.error !== prevProps.user.error) {
            this.setState({
                error: this.props.user.error
            })
        }
    }

    editUser(e){
        e.preventDefault();
        const id = this.props.user.user.id;
        const user = {
            name: this.state.name,
            email: this.state.email
        }
        this.props.editUser(user, id)
    }

    changePassword(e){
        e.preventDefault();
        const id = this.props.user.user.id;
        const passwords = {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
            newPassword2: this.state.newPassword2
        }
        this.props.changePassword(passwords, id)
    }

    render() {
        return(
            <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
                <div><h1 style={{textAlign: "center", padding: "10px", marginBottom: "auto"}}>Editar usuario</h1></div>
                <div style={{marginTop: "100px"}}>
                    <form onSubmit={this.editUser} id="inputForm">
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Nombre</label>
                            <input type="text" className="form-control" onChange={(e) => this.setState({name: e.target.value})} value={this.state.name} required/>
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Correo electrónico</label>
                            <input type="email" className="form-control" onChange={(e) => this.setState({email: e.target.value})} value={this.state.email} required/>
                        </div>
                        {this.state.name === this.props.user.user.name && this.state.email === this.props.user.user.email ?
                            <input type="submit" value="Guardar cambios" id="loginButtonDisabled"/> :
                            <input type="submit" value="Guardar cambios" id="loginButton"/>}
                    </form>
                    <form onSubmit={this.changePassword} id="inputForm">
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Contraseña antigua</label>
                            <input type="password" className="form-control" onChange={(e) => this.setState({oldPassword: e.target.value, error: ""})} required/>
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Nueva contraseña</label>
                            <input type="password" className="form-control" onChange={(e) => this.setState({newPassword: e.target.value, error: ""})} required/>
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Repita la contraseña</label>
                            <input type="password" className="form-control" onChange={(e) => this.setState({newPassword2: e.target.value, error: ""})} required/>
                        </div>
                        {this.state.oldPassword === "" || this.state.newPassword === "" || this.state.newPassword2 === "" || this.state.newPassword === this.state.oldPassword ?
                            <input type="submit" value="Modificar contraseña" id="loginButtonDisabled"/> :
                            <input type="submit" value="Modificar contraseña" id="loginButton"/>}
                    </form>
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

export default connect(mapStateToProps, {editUser, changePassword})(Profile);