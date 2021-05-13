import React, {Component} from 'react'
import {connect} from "react-redux";
import * as turf from '@turf/turf'
import {getBike, updatePosition} from '../redux/actions/bike_actions';
import {updateRoute, finishRental, resetRentalError} from '../redux/actions/rental_actions';
import {getZone} from '../assets/zone'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

class Riding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zona: [],
            centro: turf.point([-3.684997, 40.432885]),
            time: "",
            interval: null,
            intervalTime: null
        }
        this.finishRental = this.finishRental.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
    }

    componentDidMount() {
        let interval = setInterval(() =>{
            this.updateBikePosition()
        }, 10000);
        let intervalTime = setInterval(() =>{
            this.updateTime()
        }, 1000);
        this.setState({
            interval: interval,
            intervalTime: intervalTime
        })
        this.props.getBike(this.props.rental.rental.bikeId)
        getZone()
            .then(zone => {
                this.setState({
                    zona: zone.geometry.coordinates[0]
                })
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.rental.error !== this.props.rental.error) {
            this.setState({
                error: this.props.rental.error
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.interval)
        clearInterval(this.state.intervalTime)
    }

    finishRental() {
        this.updateBikePosition()
        this.props.finishRental(this.props.rental.rental.id, this.props.rental.rental.bikeId)
    }

    updateBikePosition(){
        const route = JSON.parse(this.props.rental.rental.route)
        let prevAng
        if (route.length > 1) {
            prevAng = turf.rhumbBearing(turf.point(route[route.length-2]), turf.point(route[route.length-1]))
        } else {
            prevAng = turf.rhumbBearing(turf.point(route[route.length-1]), this.state.centro)
        }
        let nextAng = 0
        const p = 15
        for (let i=0; i<p; i++) {
            nextAng += Math.random()
        }
        nextAng = nextAng/p
        nextAng = prevAng-180 + nextAng*360
        if (nextAng > 180) {
            nextAng = nextAng - 360
        } else if (nextAng < -180) {
            nextAng = nextAng + 360
        }
        const dist = 0.04 + Math.random()*0.02
        const nextPos = turf.rhumbDestination(route[route.length-1], dist, nextAng).geometry.coordinates
        route.push(nextPos)
        this.props.updateRoute(this.props.rental.rental.id, route)
        this.props.updatePosition(this.props.rental.rental.bikeId, nextPos)
    }

    updateTime() {
        this.setState({
            time: this.timeSince(this.props.rental.rental.start)
        })
    }

    timeSince(date) {
        let now = Date.now()
        let time = Math.round((now - date)/1000)
        let h = Math.floor(time/3600)
        let m = Math.floor((time - h*3600)/60)
        let s = time - 3600*h - 60*m
        s = s < 10 ? '0'+s : s
        m = m < 10 ? '0'+m : m
        h = h < 10 ? '0'+h : h
        return (h === '00' ? (m+':'+s) : (h+':'+m+':'+s))
    }

    closeAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.props.resetRentalError()
    }

    render() {
        const route = JSON.parse(this.props.rental.rental.route)
        const line = route.length > 1 ? turf.lineString(route) : null
        const dist = line !== null ? parseFloat(turf.length(line).toFixed(2)) : null
        return(
            <div className="backgroundRiding">
                <h1 className="pageTitle">Viaje en progreso</h1>
                <div className="ridingInfoBlock">
                    <div className="ridingInfoElement">
                        <h3>Inicio</h3>
                        <h2 className="ridingInfoText">{new Date(this.props.rental.rental.start).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</h2>
                    </div>
                    <div className="ridingInfoElement">
                        <h3>Distancia</h3>
                        <h2 className="ridingInfoText">{dist} km</h2>
                    </div>
                    <div className="ridingInfoElement">
                        <h3>Tiempo</h3>
                        <h2 className="ridingInfoText">{this.state.time}</h2>
                    </div>
                </div>
                <button className="mainButton" onClick={this.finishRental}>Finalizar viaje</button>
                <Snackbar open={this.props.rental.error !== ""} autoHideDuration={3000} onClose={this.closeAlert}>
                    <MuiAlert onClose={this.closeAlert} severity="error" variant="filled">
                        {this.props.rental.error}
                    </MuiAlert>
                </Snackbar>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps, {getBike, updatePosition, updateRoute, finishRental, resetRentalError})(Riding);