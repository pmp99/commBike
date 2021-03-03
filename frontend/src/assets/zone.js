import axios from 'axios'
import * as turf from '@turf/turf'

export const getZone = async () => {
    const res = await axios.get('https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/madrid-districts.geojson')
    let barrios = res.data.features.map((barrio) => {
        return turf.polygon([barrio.geometry.coordinates[0][0]])
    })
    while (barrios.length > 1) {
        barrios[barrios.length - 2] = turf.union(barrios[barrios.length - 2], barrios[barrios.length - 1])
        barrios.pop()
    }
    return barrios[0]
}