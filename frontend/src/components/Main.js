import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import io from 'socket.io-client'
import {logoutUser} from '../redux/actions/user_actions';
import Map from "./Map";
import BikeInfo from "./BikeInfo";
import Riding from "./Riding"
import {startRental, resetRentalError} from "../redux/actions/rental_actions";
import {newBikes} from '../redux/actions/bike_actions';
import * as turf from "@turf/turf";

class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            number: "",
            code: "",
            error: "",
            geolocation: []
        }
        this.logout = this.logout.bind(this);
        this.startRental = this.startRental.bind(this)
        this.addBikes = this.addBikes.bind(this)
    }

    componentDidMount() {
        this.socket = io('/')
        navigator.geolocation.getCurrentPosition((position) => {
            const long = position.coords.longitude
            const lat = position.coords.latitude
            this.setState({
                geolocation: [long, lat]
            })
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.rental.error !== this.props.rental.error) {
            this.setState({
                error: this.props.rental.error
            })
        }
    }

    logout(){
        this.props.logoutUser()
    }

    startRental(e){
        e.preventDefault()
        this.props.startRental(this.props.user.user.id, this.state.code)
    }

    addBikes(e){
        e.preventDefault()
        this.props.newBikes(parseInt(this.state.number))
        this.socket.emit('refresh')
    }

    render() {
        if (this.props.user.authenticated) {
            if (this.props.user.user.isAdmin) {
                return(
                    <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
                        <Map/>
                        {this.props.bike.showBike ? <BikeInfo geolocation={this.state.geolocation}/> : null}
                        <form onSubmit={this.addBikes} id="inputForm">
                            <div style={{paddingBottom: "20px"}}>
                                <label style={{fontWeight: "bold"}}>Número de bicicletas</label>
                                <input type="number" min="1" step="1" className="form-control" onChange={(e) => this.setState({number: e.target.value})} required/>
                            </div>
                            {this.state.number === "" ?
                                <input type="submit" value="Añadir" id="loginButtonDisabled"/> :
                                <input type="submit" value="Añadir" id="loginButton"/>}
                        </form>
                        <Link to="/bikes">Ver bicicletas</Link>
                        <Link to="/rentals">Ver alquileres</Link>
                        {this.props.user.user.name}
                        <button onClick={this.logout}>Cerrar sesión</button>
                        <Link to="/profile">Editar perfil</Link>
                    </div>
                    );
            } else {
                if (this.props.rental.started) {
                    return(
                        <Riding/>
                    );
                } else {
                    return(
                        <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
                            <Map/>
                            {this.props.bike.showBike ? <BikeInfo geolocation={this.state.geolocation}/> : null}
                            <form onSubmit={this.startRental} id="inputForm">
                                <div style={{paddingBottom: "20px"}}>
                                    <label style={{fontWeight: "bold"}}>Código de la bicicleta</label>
                                    <input type="number" className="form-control" onChange={(e) => {this.setState({code: e.target.value}); this.props.resetRentalError()}} required/>
                                </div>
                                {this.state.code === "" ?
                                    <input type="submit" value="Alquilar" id="loginButtonDisabled"/> :
                                    <input type="submit" value="Alquilar" id="loginButton"/>}
                            </form>
                            {this.state.error === "" ?
                                <div style={{height: "8vh", backgroundColor: "#f0f0f0"}}/>
                                :
                                <div id="error"><h5 style={{margin: "auto auto"}}>{this.state.error}</h5></div>
                            }
                            <Link to="/rentals">Mis alquileres</Link>
                            {this.props.user.user.name}
                            <button onClick={this.logout}>Cerrar sesión</button>
                            <Link to="/profile">Editar perfil</Link>
                        </div>
                    );
                }
            }
        } else {
            return(
                <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
                    <Link to="/login">Iniciar sesión</Link>
                    <Link to="/register">Registrarse</Link>
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps, {logoutUser, startRental, resetRentalError, newBikes})(Main);