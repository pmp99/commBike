import React, {Component} from 'react'
import {connect} from "react-redux";
import io from 'socket.io-client'
import {toggleLockBike, getBikes} from '../redux/actions/bike_actions'
import SortIcon from "@material-ui/icons/Sort";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";

class Bikes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bikes: [],
            sort: 0
        }
        this.toggleLockBike = this.toggleLockBike.bind(this)
    }

    componentDidMount() {
        this.props.getBikes()
        this.setState({
            bikes: this.props.bike.bikes
        })
        this.socket = io('/')
        this.socket.on('refresh', () => {
            this.props.getBikes()
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.bike.update) {
            this.props.getBikes()
        }
        if (prevProps.bike !== this.props.bike) {
            this.setState({
                bikes: this.props.bike.bikes
            })
        }
    }

    toggleLockBike(id, e){
        e.preventDefault()
        this.props.toggleLockBike(id)
        this.socket.emit('refresh')
    }

    sort(bikes, type) {
        switch (type) {
            case 0:
                bikes.sort((a, b) => {
                    if (a.locked) {
                        return -1
                    }
                    if (a.inUse && !b.locked) {
                        return -1
                    }
                    return 1
                })
                return(bikes)
            case 1:
                bikes.sort((a, b) => {
                    if (a.locked) {
                        return 1
                    }
                    if (a.inUse && !b.locked) {
                        return 1
                    }
                    return -1
                })
                return(bikes)
            case 2:
                bikes.sort((a, b) => {
                    return parseInt(a.code) - parseInt(b.code)
                })
                return(bikes)
            default:
                return(bikes)
        }
    }

    render() {
        const bikes = this.sort(this.state.bikes, parseInt(this.state.sort))
        const bikeList = bikes.map((bike) => {
            const backgroundColor = bike.locked ? '#ff0606' : bike.inUse ? '#ff920a' : '#54ca13'
            return (
                <div key={bike.id} className="bike" style={{backgroundColor: backgroundColor}}>
                    <div className="bikeLocation">
                        <h6 style={{margin: 'auto'}}>Lat: {bike.lat.toFixed(5)}</h6>
                        <h6 style={{margin: 'auto'}}>Long: {bike.long.toFixed(5)}</h6>
                    </div>
                    <div className="rentalBike">
                        <DirectionsBikeIcon/><h5 className="rentalBikeText">{bike.code}</h5>
                    </div>
                    {!bike.inUse ? <button className="lockButtonSmall" onClick={(e) => this.toggleLockBike(bike.id, e)}>
                        {bike.locked ? <LockIcon/> : <LockOpenIcon/>}
                    </button> : <div className="emptyButton"/>}
                </div>
            )
        })
        return(
            <div className="background">
                <div style={{display: "flex", justifyContent: "space-between", width: "80%", margin: "20px"}}>
                    <div className="sortByBox">
                        <SortIcon/>
                        <select className="sortBy" onChange={(e) => this.setState({sort: e.target.value})} value={this.state.sort}>
                            <option value="0">Disponibilidad (- a +)</option>
                            <option value="1">Disponibilidad (+ a -)</option>
                            <option value="2">Código</option>
                        </select>
                    </div>
                </div>
                {bikes.length === 0 ?
                    <h2>No hay bicicletas</h2> :
                    <div id="bikeGrid">
                        {bikeList}
                    </div>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps, {toggleLockBike, getBikes})(Bikes);