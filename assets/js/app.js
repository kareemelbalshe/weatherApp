/**
 * @license MIT
 * @copyright KareemElbalshy 2024 All rights reserved
 * @author KareemElbalshy 
 */
'use strict';
import { fetchData, url } from "./api.js"
import * as module from "./module.js"

const addEventOnElements = (elements, eventType, callback) => {
    for (const element of elements)
        element.addEventListener(eventType, callback)
}
const searchView = document.querySelector("[data-searchView]")
const searchTogglers = document.querySelectorAll("[data-searchToggler]")
const toggleSearch = () => {
    searchView.classList.toggle("active")
}
addEventOnElements(searchTogglers, "click", toggleSearch)

const searchField = document.querySelector("[data-searchField]")
const searchResult = document.querySelector("[data-searchResult]")
let searchTimeout = null
const searchTimeoutDuration = 500

searchField.addEventListener('input', () => {
    searchTimeout ?? clearTimeout(searchTimeout)
    if (!searchField.value) {
        searchResult.classList.remove('active')
        searchResult.innerHTML = ''
        searchField.classList.remove("searching")
    }
    else {
        searchField.classList.add("searching")
    }

    if (searchField.value) {
        searchTimeout = setTimeout(() => {
            fetchData(url.geo(searchField.value), function (locations) {
                searchField.classList.remove("searching")
                searchResult.classList.add("active")
                searchResult.innerHTML =
                    `
                <ul class="viewList" data-searchList></ul>
                `
                const items = []
                for (const { name, lat, lon, country, state } of locations) {
                    const searchItem = document.createElement("li")
                    searchItem.classList.add("viewItem")
                    searchItem.innerHTML = `
                    <span class="m-icon">location_on</span>
                        <div class="">
                            <p class="itemTitle">${name}</p>
                            <p class="label-2 itemSubtitle">${state || ""} ${country}</p>
                        </div>
                        <a href="#/weather?lat=${lat}&lon=${lon}" class="itemLink hasState" aria-label="${name} weather" data-searchToggler></a>
                    `
                    searchResult.querySelector("[data-searchList]").appendChild(searchItem)
                    items.push(searchItem.querySelector("[data-searchToggler]"))
                }
                addEventOnElements(items, "click", () => {
                    toggleSearch()
                    searchResult.classList.remove('active')
                })
            })
        }, searchTimeoutDuration)
    }
})
const container = document.querySelector("[data-container]")
const errorContent = document.querySelector("[data-errorContent]")
const loading = document.querySelector("[data-loading]")
const currentLocationBtn = document.querySelector("[data-currentLocationBtn]")
export const updateWeather = (lat, lon) => {
    loading.style.display = "grid"
    container.style.overflowY = "hidden"
    container.classList.remove("fadeIn")
    errorContent.style.display = "none"

    const currentWeatherSection = document.querySelector("[data-currentWeather]")
    const highlightSection = document.querySelector("[data-highlights]")
    const hourlySection = document.querySelector("[data-hourlyForecast]")
    const forecastSection = document.querySelector("[data-5-dayForecast]")

    currentWeatherSection.innerHTML = ''
    highlightSection.innerHTML = ''
    hourlySection.innerHTML = ''
    forecastSection.innerHTML = ''

    if (window.location.hash === '#/current-location') {
        currentLocationBtn.setAttribute('disabled', '')
    }
    else {
        currentLocationBtn.removeAttribute("disabled")
    }

    fetchData(url.currentWeather(lat, lon), (currentWeather) => {
        const { weather,
            dt: dataUnix,
            sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
            main: { temp, feels_like, pressure, humidity },
            visibility,
            timezone
        } = currentWeather

        const [{ description, icon }] = weather
        const card = document.createElement("div")
        card.classList.add("card", "cardLg", "currentWeatherCard")
        card.innerHTML = `
        <h2 class="title-2 cardTitle">Now</h2>
        <div class="weapper">
            <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>
            <img
                src="./assets/images/weather_icons/${icon}.png"
                class="weatherIcon"
                width="64"
                height="64"
                alt="${description}"
            />
        </div>
        <p class="body-3">${description}</p>
        <ul class="metaList">
            <li class="metaItem">
                <span class="m-icon">calendar_today</span>
                <p class="title-3 metaText">${module.getDate(dataUnix, timezone)}</p>
            </li>
            <li class="metaItem">
                <span class="m-icon">location_on</span>
                <p class="title-3 metaText" data-location></p>
            </li>
        </ul>
        `
        currentWeatherSection.appendChild(card)

        fetchData(url.reverseGeo(lat, lon), ([{ name, country }]) => {
            card.querySelector("[data-location]").innerHTML = `${name}, ${country}`
        })

        fetchData(url.airPollution(lat, lon), (airPollution) => {
            const [{
                main: { aqi },
                components: { no2, o3, so2, pm2_5 }
            }] = airPollution.list

            const card = document.createElement("div")
            card.classList.add("card", "cardLg")
            card.innerHTML = `
            <h2 class="title-2" id="highlightsLabel">Todays Highlights</h2>
            <div class="highlightList">
                <div class="card cardSm highlightCard one">
                  <h3 class="title-3">Air Quality Index</h3>
                  <div class="wrapper">
                    <div class="m-icon">air</div>
                    <ul class="cardList">
                      <li class="cardItem">
                        <p class="title-1">${Number(pm2_5).toPrecision(3)}</p>
                        <p class="label-1">PM<sub>2.5</sub></p>
                      </li>
                      <li class="cardItem">
                        <p class="title-1">${Number(so2).toPrecision(3)}</p>
                        <p class="label-1">SO<sub>2</sub></p>
                      </li>
                      <li class="cardItem">
                        <p class="title-1">${Number(no2).toPrecision(3)}</p>
                        <p class="label-1">NO<sub>2</sub></p>
                      </li>
                      <li class="cardItem">
                        <p class="title-1">${Number(o3).toPrecision(3)}</p>
                        <p class="label-1">O<sub>3</sub></p>
                      </li>
                    </ul>
                  </div>
                  <span class="badge aqi-${aqi} label-${aqi}" title="${module.aqiText[aqi].message}"
                    >${module.aqiText[aqi].level}</span
                  >
                </div>
                <div class="card cardSm highlightCard two">
                  <h3 class="title-3">Sunrise & Sunset</h3>
                  <div class="cardList">
                    <div class="cardItem">
                      <span class="m-icon">clear_day</span>
                      <div class="">
                        <p class="label-1">Sunrise</p>
                        <p class="title-1">${module.getTime(sunriseUnixUTC,timezone)}</p>
                      </div>
                    </div>
                    <div class="cardItem">
                      <span class="m-icon">clear_day</span>
                      <div class="">
                        <p class="label-1">Sunset</p>
                        <p class="title-1">${module.getTime(sunsetUnixUTC,timezone)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card cardSm highlightCard">
                  <h3 class="title-3">Humidity</h3>
                  <div class="wrapper">
                    <span class="m-icon">humidity_percentage</span>
                    <p class="title-1">${humidity}<sub>%</sub></p>
                  </div>
                </div>
                <div class="card cardSm highlightCard">
                  <h3 class="title-3">Pressure</h3>
                  <div class="wrapper">
                    <span class="m-icon">airwave</span>
                    <p class="title-1">${pressure}<sub>hpa</sub></p>
                  </div>
                </div>
                <div class="card cardSm highlightCard">
                  <h3 class="title-3">Visibility</h3>
                  <div class="wrapper">
                    <span class="m-icon">visibility</span>
                    <p class="title-1">${visibility/1000}<sub>km</sub></p>
                  </div>
                </div>
                <div class="card cardSm highlightCard">
                  <h3 class="title-3">Feels Like</h3>
                  <div class="wrapper">
                    <span class="m-icon">thermostat</span>
                    <p class="title-1">${parseInt(feels_like)}&deg;<sup>c</sup></p>
                  </div>
                </div>
            </div>
            `
            highlightSection.appendChild(card)
        })
        fetchData(url.forecast(lat,lon),(forecast)=>{
            const{
                list:forecastList,
                city:{timezone}
            }=forecast
            hourlySection.innerHTML=`
            <h2 class="title-2">Today at</h2>
            <div class="sliderContainer">
              <ul class="sliderList" data-temp>
              </ul>
              <ul class="sliderList" data-wind>
              </ul>
            </div>`
            for(const [index,data]of forecastList.entries()){
                if(index>7)break
                const{
                    dt:dataTimeUnix,
                    main:{temp},
                    weather,
                    wind:{deg:windDirection,speed:windSpeed}
                }=data
                const [{icon,description}]=weather
                const tempLi=document.createElement("li")
                tempLi.classList.add("sliderItem")
                tempLi.innerHTML=`
                  <div class="card cardSm sliderCard">
                    <p class="body-3">${module.getHours(dataTimeUnix,timezone)}</p>
                    <img
                      src="./assets/images/weather_icons/${icon}.png"
                      alt="${description}"
                      width="48"
                      height="48"
                      loading="lazy"
                      class="weatherIcon"
                      title="${description}"
                    />
                    <p class="body-3">${parseInt(temp)}&deg;</p>
                  </div>`
                hourlySection.querySelector("[data-temp]").appendChild(tempLi)

                const windLi=document.createElement("li")
                windLi.classList.add("sliderItem")
                windLi.innerHTML=`
                <div class="card cardSm sliderCard">
                    <p class="body-3">${module.getHours(dataTimeUnix,timezone)}</p>
                    <img
                      src="./assets/images/weather_icons/direction.png"
                      alt=""
                      width="48"
                      height="48"
                      loading="lazy"
                      class="weatherIcon"
                      style="transform: rotate(${windDirection - 100}deg)"
                      title=""
                    />
                    <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km/h</p>
                  </div>`
                  hourlySection.querySelector("[data-wind]").appendChild(windLi)
            }
            forecastSection.innerHTML=`
            <h2 class="title-2" id="forecast-label">5 Days Forecast</h2>
            <div class="card cardLg forecastCard">
              <ul data-forecastList></ul>
            </div>`
            for(let i=7,len=forecastList.length;i<len;i+=8){
                const {
                    main:{temp_max},
                    weather,dt_txt
                }=forecastList[i]
                const[{icon,description}]=weather
                const data=new Date(dt_txt)

                const li=document.createElement("li")
                li.classList.add("cardItem")
                li.innerHTML=`
                <div class="iconWrapper">
                    <img
                      src="./assets/images/weather_icons/${icon}.png"
                      width="36"
                      height="36"
                      class="weatherIcon"
                      alt="${description}"
                      title="${description}"
                    />
                    <span class="span">
                      <p class="title-2">${parseInt(temp_max)}&deg;</p>
                    </span>
                  </div>
                  <p class="label-1">${data.getUTCDate()} ${module.monthNames[data.getUTCMonth()]}</p>
                  <p class="label-1">${module.weekDayNames[data.getUTCDay()]}</p>`
                  forecastSection.querySelector("[data-forecastList]").appendChild(li)
            }
            loading.style.display = "none"
            container.style.overflowY = "overlay"
            container.classList.add("fadeIn")
        })
    })
}

export const error404 = () => {
    errorContent.style.display="flex"
}