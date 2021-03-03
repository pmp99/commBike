import React, {Component} from 'react'
import {connect} from "react-redux";
import {Marker} from '@urbica/react-map-gl';

class ClusterMarker extends Component {
    constructor(props) {
        super(props);
        this.onMarkerClick = this.onMarkerClick.bind(this);
    }

    onMarkerClick(event){
        event.stopPropagation();
        this.props.onMarkerClick(this.props.id, this.props.longitude, this.props.latitude)
    }

    render() {
        const style = {
            width: 30 + Math.round(30*this.props.pointCount/this.props.bike.bikes.length)+'px',
            height: 30 + Math.round(30*this.props.pointCount/this.props.bike.bikes.length)+'px',
            color: '#fff',
            background: '#268c00',
            borderRadius: '50%',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        return(
            <Marker longitude={this.props.longitude} latitude={this.props.latitude}>
                <div style={style}><h4>{this.props.pointCount}</h4></div>
            </Marker>
        );
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps)(ClusterMarker);