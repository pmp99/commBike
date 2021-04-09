import React, { Component } from 'react'
import {connect} from "react-redux";
import MapGL, { NavigationControl, GeolocateControl, ScaleControl, Source, Layer } from '@urbica/react-map-gl';
import Cluster from '@urbica/react-map-gl-cluster';
import 'mapbox-gl/dist/mapbox-gl.css';
import io from 'socket.io-client'
import BikeMarker from './BikeMarker'
import ClusterMarker from './ClusterMarker'
import {getBikes, getBike, showBike, hideBike, resetBike} from '../redux/actions/bike_actions';
import {getZone} from '../assets/zone'

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bikes: [],
            viewport: {
                latitude: 40.4474,
                longitude: -3.6799,
                zoom: 10
            },
            zona: []
        }
        this.setViewport = this.setViewport.bind(this)
        this.onMarkerClick = this.onMarkerClick.bind(this)
        this.onMapClick = this.onMapClick.bind(this)
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            let initialViewport = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                zoom: 12
            }
            this.setState({
                viewport: initialViewport
            })
        });
        this.props.getBikes()
        getZone()
            .then(zone => {
                this.setState({
                    zona: zone.geometry.coordinates[0]
                })
            })
        this.socket = io('/')
        this.socket.on('refresh', () => {
            this.props.getBikes()
            if (this.props.bike.bike.id !== undefined) {
                this.props.getBike(this.props.bike.bike.id)
            }
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.bike.update) {
            this.props.getBikes()
        }
        if (prevProps.bike.bikes !== this.props.bike.bikes) {
            this.setState({
                bikes: this.props.bike.bikes
            })
        }
        if ((this.props.bike.bike.locked || this.props.bike.bike.inUse) && !this.props.user.user.isAdmin && this.props.bike.showBike) {
            this.props.hideBike()
            this.props.resetBike()
        }
    }

    setViewport(viewport){
        this.setState({
            viewport: viewport
        })
    }

    onMarkerClick(id){
        this.props.getBike(id)
        this.props.showBike()
    }

    onMapClick(){
        this.props.hideBike()
        this.props.resetBike()
    }


    render() {
        const zona = {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]],
                    this.state.zona
                ]
            }
        };

        const bikeMarkers = this.state.bikes.map((bike) => {
            if (!(bike.locked || bike.inUse) || this.props.user.user.isAdmin) {
                let selected = this.props.bike.showBike && this.props.bike.bike.id === bike.id
                return(
                    <BikeMarker
                        key={bike.id + bike.locked.toString() + selected.toString()}
                        longitude={bike.long}
                        latitude={bike.lat}
                        id={bike.id}
                        locked={bike.locked}
                        inUse={bike.inUse}
                        selected={selected}
                        onMarkerClick={this.onMarkerClick}/>
                )
            } else {
                return null
            }
        })

        return (
            <MapGL
                style={{ width: '100%', height: '100%' }}
                mapStyle='mapbox://styles/mapbox/streets-v11'
                accessToken={'pk.eyJ1IjoicG1wOTkiLCJhIjoiY2tsbTkzYWNxMDZ3OTMzbzhobnNsZ3o1YSJ9.mCi3-eRyASTCvR--ws9Ncg'}
                latitude={this.state.viewport.latitude}
                longitude={this.state.viewport.longitude}
                zoom={this.state.viewport.zoom}
                onViewportChange={this.setViewport}
                onClick={this.onMapClick}
            >
                <NavigationControl showCompass showZoom position='top-right' />
                <GeolocateControl position='top-right' />
                <ScaleControl unit='metric' position='bottom-right' />
                <Source id='zone' type='geojson' data={zona} />
                <Layer
                    id='zone'
                    type='fill'
                    source='zone'
                    paint={{
                        'fill-color': '#000000',
                        'fill-opacity': 0.15
                    }}
                />
                <Cluster radius={60} extent={512} nodeSize={64} component={ClusterMarker}>
                    {bikeMarkers}
                </Cluster>
            </MapGL>
        );
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps, {getBikes, getBike, showBike, hideBike, resetBike})(Map);