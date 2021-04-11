import axios from 'axios';
import * as turf from '@turf/turf'
import {getZone} from '../../assets/zone'

export const startRental = (userId, code) => dispatch => {
    axios.post('/rental/new', {userId, code})
        .then(res => {
            if (!res.data) {
                dispatch({
                    type: 'RENTAL_ERROR',
                    payload: "El código introducido no es válido"
                })
            } else if (res.data === 'ERROR') {
                dispatch({
                    type: 'RENTAL_ERROR',
                    payload: "Esta bicicleta ya no está disponible"
                })
            } else {
                dispatch({
                    type: 'START',
                    payload: res.data
                })
            }
        })
}

const bikeInside = async (bikeId) => {
    const zone = await getZone()
    axios.get('/bike/getBike/' + bikeId)
        .then(res => {
            const pos = turf.point([res.data.long, res.data.lat])
            return turf.booleanPointInPolygon(pos, zone)
        })
}

export const finishRental = (rentalId, bikeId) => dispatch => {
    if (!bikeInside(bikeId)) {
        dispatch({
            type: 'RENTAL_ERROR',
            payload: "Zona no permitida"
        })
        return;
    }
    axios.put('/rental/finish/'+rentalId)
        .then(res => {
            dispatch({
                type: 'FINISH',
                payload: res.data
            })
        })
}

export const getRentals = () => dispatch => {
    axios.get('/rental/getRentals')
        .then(res => {
            dispatch({
                type: 'GET_RENTALS',
                payload: res.data
            })
        })
}

export const getUserRentals = (userId) => dispatch => {
    axios.get('/rental/getRentals/'+userId)
        .then(res => {
            dispatch({
                type: 'GET_RENTALS',
                payload: res.data
            })
        })
}

export const resetRentalError = () => dispatch => {
    dispatch({
        type: 'RENTAL_ERROR',
        payload: ""
    })
}

export const updateRoute = (id, route) => dispatch => {
    axios.put('/rental/updateRoute/'+id, {route})
        .then(res => {
            dispatch({
                type: 'GET_RENTAL',
                payload: res.data
            })
        })
}

export const checkActiveRental = (id) => dispatch => {
    axios.get('/rental/checkActiveRental/'+id)
        .then(res => {
            if (res.data.id !== undefined) {
                dispatch({
                    type: 'START',
                    payload: res.data
                })
            }
        })
}