import React, {Component} from 'react';
import {connect} from "react-redux";
import {logoutUser} from '../redux/actions/user_actions';
import logo from '../assets/logo.png'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

class NavBar extends Component {
    constructor(props){
        super(props);
        this.logout = this.logout.bind(this)
        this.editProfile = this.editProfile.bind(this)
        this.drop = this.drop.bind(this)
    }

    logout(){
        document.getElementById("myDropdown").classList.remove("show")
        this.props.logoutUser()
    }

    editProfile(){
        document.getElementById("myDropdown").classList.remove("show")
        this.props.history.push('/profile')
    }

    drop(){
        if (!document.getElementById("myDropdown").classList.contains('show')) {
            document.getElementById("myDropdown").classList.add("show")
        }
    }

    render() {
        if (!this.props.user.authenticated) {
            return(
                <nav id="navBar">
                    <button id="homeButton" onClick={() => this.props.history.push('/')}><img src={logo} alt="Logo" style={{height: "100%"}}/></button>
                </nav>
            );
        } else {
            window.onmousemove = (e) => {
                if (document.getElementsByClassName('dropbtn')[0] !== undefined || document.getElementsByClassName('dropdown-content')[0] !== undefined) {
                    if (!document.getElementsByClassName('dropbtn')[0].contains(e.target) && !document.getElementsByClassName('dropdown-content')[0].contains(e.target)) {
                        let dropdown = document.getElementById("myDropdown")
                        if (dropdown.classList.contains('show')) {
                            dropdown.classList.remove('show')
                        }
                    }
                }
            }
            return(
                <nav id="navBar">
                    <button id="homeButton" onClick={() => this.props.history.push('/')}><img src={logo} alt="Logo" style={{height: "100%"}}/></button>
                    {this.props.user.user.admin ? <button className="navButton" onClick={() => this.props.history.push('/bikes')}><h5 className="navButtonText">Bicicletas</h5></button> : null}
                    <button className="navButton" style={{marginRight: "auto"}} onClick={() => this.props.history.push('/rentals')}><h5 className="navButtonText">{this.props.user.user.admin ? 'Viajes' : 'Mis viajes'}</h5></button>
                    <div className="dropdown">
                        <button className="dropbtn" onMouseEnter={this.drop}><div style={{display: "flex", justifyContent: "center"}}>{this.props.user.user.name}<ArrowDropDownIcon/></div></button>
                        <div className="dropdown-content" id="myDropdown">
                            <div className="navDrop"><button className="navButtonDrop" id="navDrop1" onClick={this.editProfile}><h5 id="navDrop1Text">Editar perfil</h5></button></div>
                            <div className="navDrop"><button className="navButtonDrop" id="navDrop2" onClick={this.logout}><h5 id="navDrop2Text">Cerrar sesión</h5></button></div>
                        </div>
                    </div>
                </nav>
            );
        }
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps, {logoutUser})(NavBar);