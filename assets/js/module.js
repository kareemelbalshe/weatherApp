/**
 * @license MIT
 * @fileoverview All module functions
 * @copyright KareemElbalshy 2024 All rights reserved
 */
'use strict';
export const weekDayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]
export const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
]
export const getDate = (dataUnix, timezone) => {
    const data = new Date((dataUnix + timezone) * 1000)
    const weekDayName = weekDayNames[data.getUTCDay()]
    const monthName = monthNames[data.getUTCMonth()]
    return `${weekDayName} ${data.getUTCDate()}, ${monthName}`
}
export const getTime = (timeUnix, timezone) => {
    const data = new Date((timeUnix + timezone) * 1000)
    const hours = data.getUTCHours()
    const minutes = data.getUTCMinutes()
    const period = hours >= 12 ? "PM" : "AM"
    return `${hours % 12 || 12}:${minutes} ${period}`
}
export const getHours = (timeUnix, timezone) => {
    const data = new Date((timeUnix + timezone) * 1000)
    const hours = data.getUTCHours()
    const period = hours >= 12 ? "PM" : "AM"
    return `${hours % 12 || 12} ${period}`
}
export const mps_to_kmh = mps => {
    const mph = mps * 3600
    return mph / 1000
}
export const aqiText = {
    1: {
        level: "Good",
        message:"Air quality is considered satisfactory, and air pollution posses little or no risk"
    },
    2: {
        level: "Fair",
        message:"Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution."
    },
    3: {
        level: "Moderate",
        message:"Members of sensitive groups may experience health effects. The general public is not likely to be affected"
    },
    4: {
        level: "Poor",
        message:"Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects"
    },
    5: {
        level: "Very Poor",
        message:"Health warning of emergency conditions. The entire population is more likely to be affected"
    },
}