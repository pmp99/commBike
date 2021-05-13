import React, {Component} from 'react'
import {connect} from "react-redux";
import {toggleLockBike, getBikes} from '../redux/actions/bike_actions'
import SortIcon from "@material-ui/icons/Sort";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

class Bikes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bikes: null,
            sort: 0,
            showGoUpButton: false,
            interval: null
        }
        this.toggleLockBike = this.toggleLockBike.bind(this)
        this.goUp = this.goUp.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
    }

    componentDidMount() {
        this.props.getBikes()
        let interval = setInterval(() =>{
            this.refresh()
        }, 3000);
        this.setState({
            interval: interval
        })
        window.addEventListener('scroll', this.handleScroll)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.bike.update) {
            this.props.getBikes()
        }
        if (prevProps.bike !== this.props.bike) {
            this.setState({
                bikes: this.props.bike.bikes
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.interval)
        window.removeEventListener('scroll', this.handleScroll)
    }

    refresh(){
        this.props.getBikes()
    }

    handleScroll() {
        if (window.scrollY > 0 && !this.state.showGoUpButton) {
            this.setState({
                showGoUpButton: true
            })
        } else if (window.scrollY === 0 && this.state.showGoUpButton) {
            this.setState({
                showGoUpButton: false
            })
        }
    }

    toggleLockBike(id, e){
        e.preventDefault()
        this.props.toggleLockBike(id)
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

    goUp() {
        window.scrollTo({top: 0, behavior: "smooth"})
    }

    render() {
        if (this.state.bikes !== null) {
            const bikes = this.sort(this.state.bikes, parseInt(this.state.sort))
            const bikeList = bikes.map((bike) => {
                const backgroundColor = bike.locked ? '#ff0606' : bike.inUse ? '#ff920a' : '#54ca13'
                return (
                    <div key={bike.id} className="bike" style={{backgroundColor: backgroundColor}}>
                        <div className="bikeLocation">
                            <h6 style={{margin: 'auto'}}>Lat: {bike.latitude.toFixed(5)}</h6>
                            <h6 style={{margin: 'auto'}}>Long: {bike.longitude.toFixed(5)}</h6>
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
                    <h1 className="pageTitle">Bicicletas</h1>
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
                    {this.state.showGoUpButton ?
                        <button className="goUpButton" onClick={this.goUp}>
                            <ExpandLessIcon/>
                        </button>
                        : null}
                </div>
            );
        } else {
            return (
                <Backdrop style={{color: "white", zIndex: "1"}} open={true}>
                    <CircularProgress style={{color: "black"}} size={80} />
                </Backdrop>
            );
        }

    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps, {toggleLockBike, getBikes})(Bikes);