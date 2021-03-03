import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import {logoutUser} from '../redux/actions/user_actions';
import Map from "./Map";
import BikeInfo from "./BikeInfo";
import {startRental, finishRental, resetRentalError} from "../redux/actions/rental_actions";
import {newBikes} from '../redux/actions/bike_actions';

class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            number: "",
            code: "",
            error: ""
        }
        this.logout = this.logout.bind(this);
        this.startRental = this.startRental.bind(this)
        this.finishRental = this.finishRental.bind(this)
        this.addBikes = this.addBikes.bind(this)
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

    finishRental(){
        this.props.finishRental(this.props.rental.rental.id, this.props.rental.rental.bikeId)
    }

    addBikes(e){
        e.preventDefault()
        this.props.newBikes(parseInt(this.state.number))
    }

    render() {
        if (this.props.user.authenticated) {
            if (this.props.user.user.isAdmin) {
                return(
                    <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
                        <Map/>
                        {this.props.bike.showBike ? <BikeInfo/> : null}
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
                        <div>
                            <h2>Inicio: {new Date(this.props.rental.rental.start).toLocaleTimeString()}</h2>
                            <button onClick={this.finishRental}>Finalizar viaje</button>
                        </div>
                    );
                } else {
                    return(
                        <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
                            <Map/>
                            {this.props.bike.showBike ? <BikeInfo/> : null}
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

export default connect(mapStateToProps, {logoutUser, startRental, finishRental, resetRentalError, newBikes})(Main);