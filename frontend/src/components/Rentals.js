import React, {Component} from 'react'
import {connect} from "react-redux";
import io from 'socket.io-client'
import MapGL, {Source, Layer} from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf'
import {getRentals, getUserRentals} from '../redux/actions/rental_actions'

class Rentals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rentals: [],
            sort: 0
        }
    }

    componentDidMount() {
        if (this.props.user.user.isAdmin) {
            this.props.getRentals()
            this.socket = io('/')
            this.socket.on('refresh', () => {
                this.props.getRentals()
            })
        } else {
            this.props.getUserRentals(this.props.user.user.id)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.rental !== this.props.rental || prevState.sort !== this.state.sort) {
            this.setState({
                rentals: this.props.rental.rentals
            })
        }
    }

    sort(rentals, type) {
        switch (type) {
            case 0:
                rentals.sort((a, b) => {return a.end === null ? -1 : b.end === null ? 1 : b.end - a.end})
                return(rentals)
            case 1:
                rentals.sort((a, b) => {return a.end === null ? 1 : b.end === null ? -1 : a.end - b.end})
                return(rentals)
            case 2:
                rentals.sort((a, b) => {return b.price-a.price})
                return(rentals)
            case 3:
                rentals.sort((a, b) => {
                    if (JSON.parse(a.route).length < 2) {
                        return 1
                    }
                    if (JSON.parse(b.route).length < 2) {
                        return -1
                    }
                    return turf.length(turf.lineString(JSON.parse(b.route))) - turf.length(turf.lineString(JSON.parse(a.route)))})
                return(rentals)
            case 4:
                rentals.sort((a, b) => {
                    if (JSON.parse(a.route).length < 2) {
                        return -1
                    }
                    if (JSON.parse(b.route).length < 2) {
                        return 1
                    }
                    return turf.length(turf.lineString(JSON.parse(a.route))) - turf.length(turf.lineString(JSON.parse(b.route)))})
                return(rentals)
            case 5:
                rentals.sort((a, b) => {return a.user.name.toLowerCase().localeCompare(b.user.name.toLowerCase())})
                return(rentals)
            case 6:
                rentals.sort((a, b) => {return b.user.name.toLowerCase().localeCompare(a.user.name.toLowerCase())})
                return(rentals)
            default:
                return(rentals)
        }
    }

    render() {
        const rentals = this.sort(this.state.rentals, parseInt(this.state.sort))
        const rentalList = rentals.map((rental) => {
            const style = {
                backgroundColor: rental.end !== null ? '#54ca13' : '#ff920a'
            }
            const route = JSON.parse(rental.route)
            const line = route.length > 1 ? turf.lineString(route) : null
            const dist = line !== null ? turf.length(line) : null
            let dist2 = 0
            let bounds = []
            if (dist !== null) {
                dist2 = dist < 1 ? Math.round(1000*dist) : Math.round(100*dist)/100
                bounds = turf.bbox(line)
                const deltaX = bounds[2]-bounds[0]
                const deltaY = bounds[3]-bounds[1]
                bounds[0] -= deltaX*0.5
                bounds[2] += deltaX*0.5
                bounds[1] -= deltaY*0.5
                bounds[3] += deltaY*0.5
            }
            return (
                <tr key={rental.id} style={style}>
                    {route.length > 1 ?
                        <MapGL
                            style={{ width: '200px', height: '100px' }}
                            mapStyle='mapbox://styles/mapbox/streets-v11'
                            accessToken={'pk.eyJ1IjoicG1wOTkiLCJhIjoiY2tsbTkzYWNxMDZ3OTMzbzhobnNsZ3o1YSJ9.mCi3-eRyASTCvR--ws9Ncg'}
                            latitude={0}
                            longitude={0}
                            zoom={10}
                            bounds={bounds}
                        >
                            <Source id='route' type='geojson' data={line} />
                            <Layer
                                id='route'
                                type='line'
                                source='route'
                                layout={{
                                    'line-join': 'round',
                                    'line-cap': 'round'
                                }}
                                paint={{
                                    'line-color': '#003cb8',
                                    'line-width': 5
                                }}
                            />
                        </MapGL>
                        : null}
                    <h2>Usuario: {rental.user.name}</h2>
                    <h3>Bicicleta: {rental.bike.code}</h3>
                    Inicio: {new Date(rental.start).toLocaleString()} Fin: {rental.end !== null ? new Date(rental.end).toLocaleString() : "---"} Coste: {rental.price || "---"}
                    Distancia: {dist === null ? "---" : dist < 1 ? dist2+" m" : dist2+" km"}
                </tr>
            )
        })
        return(
            <div>
                <h7>Ordenar por: &nbsp;&nbsp;&nbsp;</h7>
                <select id="sortBy" onChange={(e) => this.setState({sort: e.target.value})} value={this.state.sort}>
                    <option value="0">Más reciente</option>
                    <option value="1">Más antiguo</option>
                    <option value="2">Coste</option>
                    <option value="3">Más largo</option>
                    <option value="4">Más corto</option>
                    {this.props.user.user.isAdmin ?
                        <option value="5">Usuario (a-z)</option>
                        : null
                    }
                    {this.props.user.user.isAdmin ?
                        <option value="6">Usuario (z-a)</option>
                        : null
                    }
                </select>
                <table>
                    <tbody>
                    {rentalList}
                    </tbody>
                </table>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps, {getRentals, getUserRentals})(Rentals);