import React, {Component} from 'react'
import {connect} from "react-redux";
import {toggleLockBike, getBikes} from '../redux/actions/bike_actions'
import io from 'socket.io-client'
import * as turf from '@turf/turf'
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import PaymentIcon from '@material-ui/icons/Payment';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogInfo from "./DialogInfo";

class BikeInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dist: 0,
            code: "",
            infoDialogOpen: false
        }
        this.toggleLockBike = this.toggleLockBike.bind(this)
        this.closeInfo = this.closeInfo.bind(this)
        this.openInfo = this.openInfo.bind(this)
    }

    componentDidMount() {
        this.socket = io('/')
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.bike.bike !== this.props.bike.bike) {
            const lat2 = this.props.bike.bike.lat
            const long2 = this.props.bike.bike.long
            let d = turf.distance(turf.point(this.props.geolocation), turf.point([long2, lat2]))
            this.setState({
                dist: d
            })
        }
    }

    toggleLockBike(id, e){
        e.preventDefault()
        this.props.toggleLockBike(id)
        this.socket.emit('refresh')
    }

    closeInfo() {
        this.setState({
            infoDialogOpen: false
        })
    }

    openInfo() {
        this.setState({
            infoDialogOpen: true
        })
    }

    render() {
        let bike = this.props.bike.bike
        let color = bike.locked ? '#ff0606' : bike.inUse ? '#ff920a' : '#54ca13'
        let borde = "4px solid " + color
        let shadow = "0 0 20px 1px " + color
        if (bike.id === undefined) {
            return(
                <div id="bikeInfo" style={{border: "4px solid gray", boxShadow: "0 0 20px 1px gray"}}>
                    <CircularProgress color="black" style={{margin: 'auto'}} />
                </div>
            );
        } else {
            return(
                <div id="bikeInfoContainer">
                    <div id="bikeInfo" style={{border: borde, boxShadow: shadow}}>
                        <h2 style={{margin: "auto"}}>{bike.code}</h2>
                        {this.state.dist < 1 ? <h3 style={{margin: "auto"}}>Distancia: {Math.round(1000*this.state.dist)} m</h3> :
                            <h3 style={{margin: "auto"}}>Distancia: {Math.round(10*this.state.dist)/10} km</h3>}
                        {!this.props.user.user.isAdmin ? <button className="infoButton" onClick={this.openInfo}><PaymentIcon fontSize="small"/>&nbsp;info</button> : null}
                    </div>
                    {this.props.user.user.isAdmin && !bike.inUse ? <button className="lockButton" onClick={(e) => this.toggleLockBike(bike.id, e)}>
                        {bike.locked ? <LockIcon fontSize="large"/> : <LockOpenIcon fontSize="large"/>}
                    </button> : null}
                    <DialogInfo open={this.state.infoDialogOpen} handleClose={this.closeInfo}/>
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps, {toggleLockBike, getBikes})(BikeInfo);