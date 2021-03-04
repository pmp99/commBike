import React, {Component} from 'react'
import {connect} from "react-redux";
import io from 'socket.io-client'
import * as turf from '@turf/turf'
import {getBike, updatePosition} from '../redux/actions/bike_actions';
import {updateRoute, finishRental} from '../redux/actions/rental_actions';
import {getZone} from '../assets/zone'

class Riding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zona: [],
            centro: turf.point([-3.684997, 40.432885]),
            error: "",
            interval: null
        }
        this.finishRental = this.finishRental.bind(this)
    }

    componentDidMount() {
        let interval = setInterval(() =>{
            this.updateBikePosition()
        }, 10000);
        this.setState({interval: interval})
        this.socket = io('/')
        this.socket.emit('refresh')
        this.props.getBike(this.props.rental.rental.bikeId)
        getZone()
            .then(zone => {
                this.setState({
                    zona: zone.geometry.coordinates[0]
                })
            })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.rental.error !== this.props.rental.error) {
            this.setState({
                error: this.props.rental.error
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.interval)
        this.socket.emit('refresh')
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

    render() {
        return(
            <div>
                <h2>Inicio: {new Date(this.props.rental.rental.start).toLocaleTimeString()}</h2>
                <button onClick={this.finishRental}>Finalizar viaje</button>
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

export default connect(mapStateToProps, {getBike, updatePosition, updateRoute, finishRental})(Riding);