import axios from 'axios';
import * as turf from '@turf/turf'
import {getZone} from '../../assets/zone'

export const startRental = (userId, code) => dispatch => {
    axios.post('/COMMBIKE-backend/rest/commBike/rental/new', {userId, code})
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
    axios.get('/COMMBIKE-backend/rest/commBike/bike/getBike/' + bikeId)
        .then(res => {
            const pos = turf.point([res.data.longitude, res.data.latitude])
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
    axios.put('/COMMBIKE-backend/rest/commBike/rental/finish/'+rentalId)
        .then(res => {
            dispatch({
                type: 'FINISH',
                payload: res.data
            })
        })
}

export const closeFinishScreen = () => dispatch => {
        dispatch({
            type: 'CLOSE_FINISH_SCREEN'
        })
}

export const getRentals = () => dispatch => {
    axios.get('/COMMBIKE-backend/rest/commBike/rental/getRentals')
        .then(res => {
            dispatch({
                type: 'GET_RENTALS',
                payload: res.data
            })
        })
}

export const getUserRentals = (userId) => dispatch => {
    axios.get('/COMMBIKE-backend/rest/commBike/rental/getRentals/'+userId)
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

export const updateRoute = (id, ruta) => dispatch => {
    const route = JSON.stringify(ruta)
    axios.put('/COMMBIKE-backend/rest/commBike/rental/updateRoute/'+id, {route})
        .then(res => {
            dispatch({
                type: 'GET_RENTAL',
                payload: res.data
            })
        })
}

export const checkActiveRental = (id) => dispatch => {
    axios.get('/COMMBIKE-backend/rest/commBike/rental/checkActiveRental/'+id)
        .then(res => {
            if (res.data.id !== undefined) {
                dispatch({
                    type: 'START',
                    payload: res.data
                })
            }
        })
}