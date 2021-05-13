import axios from 'axios';
import * as turf from '@turf/turf'
import {getZone} from '../../assets/zone'

export const getBikes = () => dispatch => {
    axios.get('/COMMBIKE-backend/rest/commBike/bike/getBikes')
        .then(res => {
            dispatch({
                type: 'GET_BIKES',
                payload: res.data
            })
        })
}

export const getBike = (id) => dispatch => {
    axios.get('/COMMBIKE-backend/rest/commBike/bike/getBike/'+id)
        .then(res => {
            dispatch({
                type: 'GET_BIKE',
                payload: res.data
            })
        })
}

export const resetBike = () => dispatch => {
        dispatch({
            type: 'GET_BIKE',
            payload: {}
        })
}

export const showBike = () => dispatch => {
        dispatch({
            type: 'SHOW_BIKE'
        })
}

export const hideBike = () => dispatch => {
    dispatch({
        type: 'HIDE_BIKE'
    })
}

export const newBikes = (number) => async dispatch => {
    let pos = []
    const zone = await getZone()
    const long = zone.geometry.coordinates[0].map((point) => {return point[0]})
    const lat = zone.geometry.coordinates[0].map((point) => {return point[1]})
    const minX = Math.min.apply(Math, long)
    const maxX = Math.max.apply(Math, long)
    const minY = Math.min.apply(Math, lat)
    const maxY = Math.max.apply(Math, lat)
    let i = 0
    while (i < number) {
        const point = turf.randomPoint(1, {bbox: [minX, minY, maxX, maxY]}).features[0]
        if (turf.booleanPointInPolygon(point, zone)) {
            pos.push(point.geometry.coordinates)
            i++
        }
    }
    axios.post('/COMMBIKE-backend/rest/commBike/bike/newBikes', {pos})
        .then(res => {
            dispatch({
                type: 'GET_BIKES',
                payload: res.data
            })
        })
}

export const toggleLockBike = (id) => dispatch => {
    axios.put('/COMMBIKE-backend/rest/commBike/bike/toggleLockBike/'+id)
        .then(res => {
            dispatch({
                type: 'TOGGLE_LOCK',
                payload: res.data
            })
        })
}

export const updatePosition = (id, pos) => dispatch => {
    axios.put('/COMMBIKE-backend/rest/commBike/bike/updatePos/'+id, {pos})
        .then(res => {
            dispatch({
                type: 'GET_BIKE',
                payload: res.data
            })
        })
}