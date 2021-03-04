import React, {Component} from 'react'
import {connect} from "react-redux";
import io from 'socket.io-client'
import {toggleLockBike, getBikes} from '../redux/actions/bike_actions'

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
            default:
                return(bikes)
        }
    }

    render() {
        const bikes = this.sort(this.state.bikes, parseInt(this.state.sort))
        const bikeList = bikes.map((bike) => {
            const style = {
                backgroundColor: bike.locked ? '#ff0606' : bike.inUse ? '#ff920a' : '#54ca13'
            }
            const text = bike.locked ? "Desbloquear" : "Bloquear"
            return (
                <tr key={bike.id} style={style}>
                    Long: {bike.long} Lat: {bike.lat} Código: {bike.code}
                    {!bike.inUse ? <button onClick={(e) => this.toggleLockBike(bike.id, e)}>{text}</button> : null}
                </tr>
            )
        })
        return(
            <div>
                <h7>Ordenar por: &nbsp;&nbsp;&nbsp;</h7>
                <select id="sortBy" onChange={(e) => this.setState({sort: e.target.value})} value={this.state.sort}>
                    <option value="0">Disponibilidad (- a +)</option>
                    <option value="1">Disponibilidad (+ a -)</option>
                </select>
                <table>
                    <tbody>
                    {bikeList}
                    </tbody>
                </table>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps, {toggleLockBike, getBikes})(Bikes);