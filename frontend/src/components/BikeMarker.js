import React, {Component} from 'react'
import { Marker } from '@urbica/react-map-gl';
import icon from '../assets/icon.svg'

export default class BikeMarker extends Component {
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
            color: '#fff',
            cursor: 'pointer',
            background: this.props.locked ? '#ff0606' : this.props.inUse ? '#ff920a' : '#54ca13',
            borderRadius: '50%',
            height: '25px',
            width: '25px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        return(
            <Marker
                longitude={this.props.longitude}
                latitude={this.props.latitude}
                onClick={this.onMarkerClick}
            >
                <div style={style}><img src={icon} style={{width: '75%', height: '75%'}}/></div>
            </Marker>
        );
    }
}