import React, {Component} from 'react'
import { Marker } from '@urbica/react-map-gl';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';

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
            cursor: 'pointer',
            background: this.props.locked ? '#ff0606' : this.props.inUse ? '#ff920a' : '#54ca13',
            borderRadius: '50%',
            height: '25px',
            width: '25px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: this.props.selected ? '3px solid black' : '0px solid black'
        };

        return(
            <Marker
                longitude={this.props.longitude}
                latitude={this.props.latitude}
                onClick={this.onMarkerClick}
            >
                <div style={style}><DirectionsBikeIcon fontSize="small"/></div>
            </Marker>
        );
    }
}