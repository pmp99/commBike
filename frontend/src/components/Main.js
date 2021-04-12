import React, {Component} from 'react';
import {connect} from "react-redux";
import io from 'socket.io-client'
import Map from "./Map";
import BikeInfo from "./BikeInfo";
import Riding from "./Riding";
import Finish from "./Finish";
import DialogAddBikes from "./DialogAddBikes";
import DialogCode from "./DialogCode";
import {startRental, checkActiveRental, resetRentalError} from "../redux/actions/rental_actions";
import {newBikes, hideBike, resetBike} from '../redux/actions/bike_actions';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            number: "",
            code: "",
            geolocation: [],
            addBikesDialogOpen: false,
            codeDialogOpen: false
        }
        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
        this.startRental = this.startRental.bind(this)
        this.addBikes = this.addBikes.bind(this)
        this.handleCloseAddBikesDialog = this.handleCloseAddBikesDialog.bind(this)
        this.handleChangeNumber = this.handleChangeNumber.bind(this)
        this.handleCloseCodeDialog = this.handleCloseCodeDialog.bind(this)
        this.handleChangeCode = this.handleChangeCode.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
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
        if (this.props.user.authenticated) {
            this.props.checkActiveRental(this.props.user.user.id)
        }
    }

    componentWillUnmount() {
        this.props.hideBike()
        this.props.resetBike()
    }

    login(){
        this.props.history.push('/login')
    }

    register(){
        this.props.history.push('/register')
    }

    startRental(){
        this.setState({
            codeDialogOpen: true,
            code: ""
        })
    }

    addBikes(){
        this.setState({
            addBikesDialogOpen: true
        })
    }

    handleCloseAddBikesDialog(value){
        if (value) {
            this.setState({
                addBikesDialogOpen: false
            }, () => {
                this.props.newBikes(parseInt(this.state.number))
                this.socket.emit('refresh')
            })
        } else {
            this.setState({
                addBikesDialogOpen: false
            })
        }
    }

    handleChangeNumber(event){
        this.setState({
            number: event.target.value
        })
    }

    handleCloseCodeDialog(value){
        if (value) {
            this.setState({
                codeDialogOpen: false
            }, () => {
                this.props.startRental(this.props.user.user.id, this.state.code)
            })
        } else {
            this.setState({
                codeDialogOpen: false
            })
        }
    }

    handleChangeCode(event){
        this.setState({
            code: event.target.value
        })
    }

    closeAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.props.resetRentalError()
    }

    render() {
        if (this.props.user.authenticated) {
            if (this.props.user.user.isAdmin) {
                return(
                    <div className="backgroundMap">
                        <Map/>
                        {this.props.bike.showBike ? <BikeInfo geolocation={this.state.geolocation}/> : null}
                        <Fab color="primary" variant="extended" style={{position: "absolute", bottom: "0", left: "0", margin: "10px", zIndex: "10"}} onClick={this.addBikes}>
                            <AddIcon/>&nbsp; Añadir bicicletas
                        </Fab>
                        <DialogAddBikes open={this.state.addBikesDialogOpen}
                        number={this.state.number}
                        handleClose={this.handleCloseAddBikesDialog}
                        handleChangeNumber={this.handleChangeNumber}/>
                    </div>
                    );
            } else {
                if (this.props.rental.started) {
                    return (
                        <Riding/>
                    );
                } else if (this.props.rental.finished) {
                    return (
                        <Finish/>
                    );
                } else {
                    return(
                        <div className="backgroundMap">
                            <Map/>
                            {this.props.bike.showBike ? <BikeInfo geolocation={this.state.geolocation}/> : null}
                            <Fab color="primary" variant="extended" style={{position: "absolute", bottom: "0", left: "0", margin: "10px", zIndex: "10"}} onClick={this.startRental}>
                                Alquilar
                            </Fab>
                            <DialogCode open={this.state.codeDialogOpen}
                                            code={this.state.code}
                                            handleClose={this.handleCloseCodeDialog}
                                            handleChangeCode={this.handleChangeCode}/>
                            <Snackbar open={this.props.rental.error !== ""} autoHideDuration={3000} onClose={this.closeAlert}>
                                <MuiAlert onClose={this.closeAlert} severity="error" variant="filled">
                                    {this.props.rental.error}
                                </MuiAlert>
                            </Snackbar>
                        </div>
                    );
                }
            }
        } else {
            return(
                <div className="backgroundMain">
                    <h1 id="title">commBike</h1>
                    <div className="mainButtons">
                        <button onClick={this.login} className="mainButton">Iniciar sesión</button>
                        <button onClick={this.register} className="mainButton">Registrarse</button>
                    </div>
                    <h5 id="author">Creado por: ISST-Grupo 17</h5>
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps, {startRental, checkActiveRental, resetRentalError, newBikes, hideBike, resetBike})(Main);