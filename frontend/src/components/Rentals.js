import React, {Component} from 'react'
import {connect} from "react-redux";
import {getRentals} from '../redux/actions/rental_actions'

class Rentals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rentals: [],
            sort: 0
        }
    }

    componentDidMount() {
        this.props.getRentals()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.bike.update) {
            this.props.getRentals()
        }
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
                rentals.sort((a, b) => {return a.user.name.toLowerCase().localeCompare(b.user.name.toLowerCase())})
                return(rentals)
            case 4:
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
            return (
                <tr key={rental.id} style={style}>
                    <h2>Usuario: {rental.user.name}</h2>
                    <h3>Bicicleta: {rental.bike.code}</h3>
                    Inicio: {new Date(rental.start).toLocaleString()} Fin: {rental.end !== null ? new Date(rental.end).toLocaleString() : "---"} Coste: {rental.price || "---"}
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
                    <option value="3">Usuario (a-z)</option>
                    <option value="4">Usuario (z-a)</option>
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

export default connect(mapStateToProps, {getRentals})(Rentals);