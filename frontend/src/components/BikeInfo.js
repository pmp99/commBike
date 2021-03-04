import React, {Component} from 'react'
import {connect} from "react-redux";
import * as turf from '@turf/turf'

class BikeInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dist: 0,
            code: ""
        }
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

    render() {
        return(
            <div>
                <h2>{this.props.bike.bike.code}</h2>
                {this.state.dist < 1 ? <h2>Distancia: {Math.round(1000*this.state.dist)} m</h2> :
                    <h2>Distancia: {Math.round(10*this.state.dist)/10} km</h2>}
                {this.props.bike.bike.locked && this.props.user.user.isAdmin ? <div>En uso por: ---</div> : null}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps)(BikeInfo);