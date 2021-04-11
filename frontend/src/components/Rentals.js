import React, {Component} from 'react'
import {connect} from "react-redux";
import io from 'socket.io-client'
import MapGL, {Source, Layer, Marker} from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf'
import {getRentals, getUserRentals} from '../redux/actions/rental_actions'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import TimerIcon from '@material-ui/icons/Timer';
import EventIcon from '@material-ui/icons/Event';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import SortIcon from '@material-ui/icons/Sort';
import FilterListIcon from '@material-ui/icons/FilterList';
import ScheduleIcon from '@material-ui/icons/Schedule';
import RoomIcon from '@material-ui/icons/Room';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

class Rentals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rentals: null,
            sort: 0,
            filterUser: "",
            loaded: [],
            showGoUpButton: false
        }
        this.goUp = this.goUp.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
    }

    componentDidMount() {
        if (this.props.user.user.isAdmin) {
            this.props.getRentals()
            this.socket = io('/')
            this.socket.on('refresh', () => {
                this.props.getRentals()
            })
        } else {
            this.props.getUserRentals(this.props.user.user.id)
        }
        window.addEventListener('scroll', this.handleScroll)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.rental !== this.props.rental) {
            this.setState({
                rentals: this.props.rental.rentals
            })
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
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
                rentals.sort((a, b) => {
                    if (JSON.parse(a.route).length < 2) {
                        return 1
                    }
                    if (JSON.parse(b.route).length < 2) {
                        return -1
                    }
                    return turf.length(turf.lineString(JSON.parse(b.route))) - turf.length(turf.lineString(JSON.parse(a.route)))})
                return(rentals)
            case 4:
                rentals.sort((a, b) => {
                    if (JSON.parse(a.route).length < 2) {
                        return -1
                    }
                    if (JSON.parse(b.route).length < 2) {
                        return 1
                    }
                    return turf.length(turf.lineString(JSON.parse(a.route))) - turf.length(turf.lineString(JSON.parse(b.route)))})
                return(rentals)
            case 5:
                rentals.sort((a, b) => {return a.user.name.toLowerCase().localeCompare(b.user.name.toLowerCase())})
                return(rentals)
            case 6:
                rentals.sort((a, b) => {return b.user.name.toLowerCase().localeCompare(a.user.name.toLowerCase())})
                return(rentals)
            default:
                return(rentals)
        }
    }

    filterUser(rentals) {
        let filter = this.state.filterUser
        return rentals.filter((rental) => {
            return rental.user.name.toLowerCase().includes(filter.trim().toLowerCase())
        })
    }

    loaded(id) {
        let loaded = this.state.loaded
        loaded[id] = true
        this.setState({
            loaded: loaded
        })
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

    goUp() {
        window.scrollTo({top: 0, behavior: "smooth"})
    }

    render() {
        if (this.state.rentals !== null) {
            let rentals = this.filterUser(this.state.rentals)
            rentals = this.sort(rentals, parseInt(this.state.sort))
            let totalDist = 0
            const rentalList = rentals.map((rental) => {
                const route = JSON.parse(rental.route)
                const line = route.length > 1 ? turf.lineString(route) : null
                const dist = line !== null ? turf.length(line) : null
                let roundedDist = 0
                let bounds = []
                if (dist !== null) {
                    roundedDist = parseFloat(dist.toFixed(2))
                    totalDist += roundedDist
                    bounds = turf.bbox(line)
                    const deltaX = bounds[2]-bounds[0]
                    const deltaY = bounds[3]-bounds[1]
                    bounds[0] -= deltaX*0.2
                    bounds[2] += deltaX*0.2
                    bounds[1] -= deltaY*0.2
                    bounds[3] += deltaY*0.2
                }
                const time = this.time(Math.round((rental.end - rental.start)/1000))
                const backgroundColor = rental.price !== null ? '#54ca13' : '#ff920a'
                const startHours = new Date(rental.start).getHours()
                const endHours = new Date(rental.end).getHours()
                let startMinutes = new Date(rental.start).getMinutes().toString()
                let endMinutes = new Date(rental.end).getMinutes().toString()
                startMinutes = startMinutes.length === 1 ? '0' + startMinutes : startMinutes
                endMinutes = endMinutes.length === 1 ? '0' + endMinutes : endMinutes
                const start = startHours + ':' + startMinutes
                const finish = endHours + ':' + endMinutes
                return (
                    <tr key={rental.id} className="rental" style={{backgroundColor: backgroundColor}}>
                        {route.length > 1 ?
                            <MapGL
                                style={{width: '300px', height: '100%', borderRadius: "10px 0 0 10px", borderRight: "1px solid black"}}
                                mapStyle='mapbox://styles/mapbox/streets-v11'
                                accessToken={'pk.eyJ1IjoicG1wOTkiLCJhIjoiY2tsbTkzYWNxMDZ3OTMzbzhobnNsZ3o1YSJ9.mCi3-eRyASTCvR--ws9Ncg'}
                                latitude={0}
                                longitude={0}
                                zoom={10}
                                bounds={bounds}
                                onLoad={this.loaded.bind(this, rental.id)}
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
                                        'line-width': 2
                                    }}
                                />
                                <Marker longitude={route[0][0]} latitude={route[0][1]}>
                                    <RoomIcon style={{color: "green"}} fontSize="small"/>
                                </Marker>
                                {rental.price !== null ?
                                    <Marker longitude={route[route.length-1][0]} latitude={route[route.length-1][1]}>
                                        <RoomIcon style={{color: "red"}} fontSize="small"/>
                                    </Marker>
                                    : null}
                            </MapGL>
                            : null}
                        {this.state.loaded[rental.id] ? null : <div className="rentalMapLoading"><CircularProgress style={{color: "black"}}/></div>}
                        <div style={{display: "flex", flexDirection: "column", flexGrow: "1", justifyContent: "space-between", position: "relative"}}>
                            {this.props.user.user.isAdmin ?
                                <div className="rentalUser">
                                    <PersonIcon/><h4 className="rentalUserText">{rental.user.name}</h4>
                                    <EmailIcon/><h4 className="rentalEmailText">{rental.user.email}</h4>
                                </div>
                                : null }
                            <div className="rentalDate">
                                <EventIcon/> <h4 className="rentalDateText">{new Date(rental.start).toLocaleDateString()}</h4>
                                <TimerIcon/> <h4 className="rentalTimeText">{rental.end !== null ? time : "---"}</h4>
                            </div>
                            <div className="rentalBike">
                                <ScheduleIcon/><h4 className="rentalDateText">{start} - {finish}</h4>
                                <DirectionsBikeIcon/><h4 className="rentalBikeText">{rental.bike.code}</h4>
                            </div>
                            <h5 className="rentalPrice">{rental.price ? rental.price + ' €' : '-'}</h5>
                            {dist ? <h5 className="rentalDist">{roundedDist + " km"}</h5> : null}
                        </div>
                    </tr>
                )
            })

            return(
                <div className="background">
                    <h1 className="pageTitle">{this.props.user.user.isAdmin ? 'Viajes' : 'Mis viajes'}</h1>
                    <div style={{display: "flex", justifyContent: "space-between", width: "80%", margin: "20px"}}>
                        <div className="sortByBox">
                            <SortIcon/>
                            <select className="sortBy" onChange={(e) => this.setState({sort: e.target.value})} value={this.state.sort}>
                                <option value="0">Más reciente</option>
                                <option value="1">Más antiguo</option>
                                <option value="2">Coste</option>
                                <option value="3">Más largo</option>
                                <option value="4">Más corto</option>
                                {this.props.user.user.isAdmin ?
                                    <option value="5">Usuario (a-z)</option>
                                    : null
                                }
                                {this.props.user.user.isAdmin ?
                                    <option value="6">Usuario (z-a)</option>
                                    : null
                                }
                            </select>
                        </div>
                        {this.props.user.user.isAdmin ?
                        <div className="sortByBox">
                            <input className="filter" placeholder="Usuario" onChange={(e) => this.setState({filterUser: e.target.value})} value={this.state.filterUser}/>
                            <FilterListIcon/>
                        </div>
                            :
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <div className="statsElement">
                                    <i className='fas fa-road' style={{color: '#3e5392'}}/>
                                    <h6 className="statsText">{totalDist.toFixed(2)} km</h6>
                                </div>
                                <div className="statsElement">
                                    <DirectionsBikeIcon style={{color: '#42a512', fontSize: '16'}}/>
                                    <h6 className="statsText">{this.state.rentals.length} viajes</h6>
                                </div>
                            </div>
                        }
                    </div>
                    {rentals.length === 0 ?
                        <h2>No hay alquileres</h2> :
                        <table style={{width: "80%", margin: "0 auto"}}>
                            <tbody>
                            {rentalList}
                            </tbody>
                        </table>
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

export default connect(mapStateToProps, {getRentals, getUserRentals})(Rentals);