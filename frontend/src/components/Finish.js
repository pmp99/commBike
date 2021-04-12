import React, {Component} from 'react'
import {connect} from "react-redux";
import * as turf from '@turf/turf'
import {closeFinishScreen} from '../redux/actions/rental_actions';
import MapGL, {Source, Layer, Marker} from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import RoomIcon from "@material-ui/icons/Room";

class Finish extends Component {
    constructor(props) {
        super(props);
        this.exit = this.exit.bind(this)
    }

    componentWillUnmount() {
        this.props.closeFinishScreen()
    }

    exit() {
        this.props.closeFinishScreen()
    }

    time(time) {
        let hours = Math.floor(time/3600)
        let minutes = Math.floor((time-hours*3600)/60)
        let seconds = time - hours*3600 - minutes*60
        let result = ''
        if (hours > 0) {
            result = result + hours + ' h'
        }
        if (minutes > 0) {
            result = result + (hours !== 0 ? ' ' : '') + minutes + ' min'
        }
        if (seconds > 0) {
            result = result + (minutes !== 0 ? ' ' : '') + seconds + ' s'
        }
        return result
    }

    render() {
        const rental = this.props.rental.rental
        const route = JSON.parse(rental.route)
        const line = route.length > 1 ? turf.lineString(route) : null
        const dist = line !== null ? parseFloat(turf.length(line).toFixed(2)) : null
        const time = this.time(Math.round((rental.end - rental.start)/1000))
        let bounds = []
        bounds = turf.bbox(line)
        const deltaX = bounds[2]-bounds[0]
        const deltaY = bounds[3]-bounds[1]
        bounds[0] -= deltaX*0.2
        bounds[2] += deltaX*0.2
        bounds[1] -= deltaY*0.2
        bounds[3] += deltaY*0.2
        return(
            <div className="backgroundFinish">
                <h1 className="pageTitle">Resumen de su viaje</h1>
                <MapGL
                    style={{width: '80%', height: '50%', margin: '10px', marginTop: '30px', borderRadius: '10px'}}
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
                            'line-width': 3
                        }}
                    />
                    <Marker longitude={route[0][0]} latitude={route[0][1]}>
                        <RoomIcon style={{color: "green"}} fontSize="small"/>
                    </Marker>
                    <Marker longitude={route[route.length-1][0]} latitude={route[route.length-1][1]}>
                        <RoomIcon style={{color: "red"}} fontSize="small"/>
                    </Marker>
                </MapGL>
                <div className="ridingInfoBlockFinish">
                    <div className="ridingInfoElement">
                        <h3>Duración</h3>
                        <h2 className="ridingInfoText">{time}</h2>
                    </div>
                    <div className="ridingInfoElement">
                        <h3>Distancia</h3>
                        <h2 className="ridingInfoText">{dist} km</h2>
                    </div>
                    <div className="ridingInfoElement">
                        <h3>Coste</h3>
                        <h2 className="ridingInfoText">{this.props.rental.rental.price} €</h2>
                    </div>
                </div>
                <button className="mainButtonFinish" onClick={this.exit}>Salir</button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps, {closeFinishScreen})(Finish);