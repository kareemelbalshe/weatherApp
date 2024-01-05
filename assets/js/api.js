/**
 * @license MIT
 * @fileoverview All api related stuff like api_key, api request etc.
 * @copyright KareemElbalshy 2024 All rights reserved
 */
'use strict';
const api_key="20fdfb76008f0d97399a7057b61972e9"||"4bd1babbb8987c4c6eab5697a08fd53b"

export const fetchData=(URL1,cb)=>{
    fetch(`${URL1}&appid=${api_key}`)
    .then(res=>res.json())
    .then(data=>cb(data))
}
export const url={
    currentWeather(lat,lon){
        return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`
    },
    forecast(lat,lon){
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`
    },
    airPollution(lat,lon){
        return `http://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`
    },
    reverseGeo(lat,lon){
        return `http://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`
    },
    geo(query){
        return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
    },
}