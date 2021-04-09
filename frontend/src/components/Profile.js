import React from 'react';
import {connect} from 'react-redux';
import {editUser, changePassword, resetUserError, resetUserSuccess} from '../redux/actions/user_actions';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            email: "",
            oldPassword: "",
            newPassword: "",
            newPassword2: ""
        }
        this.editUser = this.editUser.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.closeAlertSuccess = this.closeAlertSuccess.bind(this)
    }

    componentDidMount() {
        this.setState({
            name: this.props.user.user.name,
            email: this.props.user.user.email
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user.success === "" && this.props.user.success !== "") {
            this.setState({
                oldPassword: "",
                newPassword: "",
                newPassword2: ""
            })
        }
    }

    closeAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.props.resetUserError()
    }

    closeAlertSuccess(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.props.resetUserSuccess()
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
            <div className="background">
                <div className="loginForm">
                    <h1 className="formTitle">EDITAR USUARIO</h1>
                    <form onSubmit={this.editUser} id="inputForm">
                        <div className="inputBox">
                            <label className="labelForm">Nombre</label>
                            <input type="text" className="form-control" onChange={(e) => this.setState({name: e.target.value})} value={this.state.name} required/>
                        </div>
                        <div className="inputBox">
                            <label className="labelForm">Correo electrónico</label>
                            <input type="email" className="form-control" onChange={(e) => this.setState({email: e.target.value})} value={this.state.email} required/>
                        </div>
                        <input type="submit" value="Guardar cambios" id="formButton" disabled={this.state.name === this.props.user.user.name && this.state.email === this.props.user.user.email}/>
                    </form>
                    <form onSubmit={this.changePassword} id="inputForm">
                        <div className="inputBox">
                            <label className="labelForm">Contraseña antigua</label>
                            <input type="password" className="form-control" onChange={(e) => this.setState({oldPassword: e.target.value})} value={this.state.oldPassword} required/>
                        </div>
                        <div className="inputBox">
                            <label className="labelForm">Nueva contraseña</label>
                            <input type="password" className="form-control" onChange={(e) => this.setState({newPassword: e.target.value})} value={this.state.newPassword} required/>
                        </div>
                        <div className="inputBox">
                            <label className="labelForm">Repita la contraseña</label>
                            <input type="password" className="form-control" onChange={(e) => this.setState({newPassword2: e.target.value})} value={this.state.newPassword2} required/>
                        </div>
                        <input type="submit" value="Modificar contraseña" id="formButton" disabled={this.state.newPassword === this.state.oldPassword}/>
                    </form>
                </div>
                <Snackbar open={this.props.user.error !== ""} autoHideDuration={3000} onClose={this.closeAlert}>
                    <MuiAlert onClose={this.closeAlert} severity="error" variant="filled">
                        {this.props.user.error}
                    </MuiAlert>
                </Snackbar>
                <Snackbar open={this.props.user.success !== ""} autoHideDuration={3000} onClose={this.closeAlertSuccess}>
                    <MuiAlert onClose={this.closeAlertSuccess} severity="success" variant="filled">
                        {this.props.user.success}
                    </MuiAlert>
                </Snackbar>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps, {editUser, changePassword, resetUserError, resetUserSuccess})(Profile);