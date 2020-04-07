'use strict'

//Getting the express library to create an app
const express = require('express');

//Getting the PG library
const pg = require('pg');

//Getting the superagent library to send request to an API
const superagent = require('superagent');

//Getting the cors library to handle errors
const cors = require('cors');

//So we can use variables from the .env file
require('dotenv').config();

//Creating a new client using the PG constructor function from the pg library
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => {
    throw new Error(err);
});

//Application Setup

const PORT = process.env.PORT || 4200;
const app = express();
app.use(cors());

//Handling different routes

app.get('/', (request, response) => {
    response.status(200).send('<h1>Hello and welcome to the homepage</h1>');
});
app.get('/location', locationRequestResponse);
app.get('/weather', weatherRequestResponse);
app.get('/trails', trailsRequestResponse);
app.use('*', notFoundHandler);
app.use(errorHandler);









//Handling Functions

function locationRequestResponse(request, response) {
    const requestCity = request.query.city;
    console.log(requestCity);
    const dataBaseCityQuery = 'SELECT search_query FROM locations WHERE search_query LIKE $1'
    client.query(dataBaseCityQuery, [requestCity]).then((result) => {
        if (result.rows.length !== 0) {
            const dataBaseData = 'SELECT search_query, formatted_query, latitude, longitude FROM locations WHERE search_query LIKE $1';

            client.query(dataBaseData, [requestCity]).then(result => {
                response.status(200).json(result.rows[0]);
            })
                .catch(err => {
                    response.status(500).send(err);
                })
            // response.status(200).send('City exists');
        }
        else {
            console.log('superagent')
            superagent(
                `https://eu1.locationiq.com/v1/search.php?key=${process.env.LOCATION_IQ_TOKEN}&q=${requestCity}&format=json`
            )
                .then((apiData) => {
                    // console.log(apiData.body)
                    const geoData = apiData.body;
                    const locationEnteries = new Location(requestCity, geoData);
                    const SQL = 'INSERT INTO locations(search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4)';
                    const safeValues = [locationEnteries.search_query, locationEnteries.formatted_query, locationEnteries.latitude, locationEnteries.longitude];
                    client.query(SQL, safeValues).then(result => {
                        response.status(200).json(locationEnteries);
                    })
                        .catch(err => {
                            response.status(500).send(err);
                        })
                })
                .catch((err) => {
                    errorHandler(err, request, response);
                });
        }
    })
    // superagent(
    //     `https://eu1.locationiq.com/v1/search.php?key=${process.env.LOCATION_IQ_TOKEN}&q=${requestCity}&format=json`
    // )
    //     .then((apiData) => {
    //         // console.log(apiData.body)
    //         const geoData = apiData.body;
    //         const locationEnteries = new Location(requestCity, geoData);
    //         const SQL = 'INSERT INTO locations(search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *';
    //         const safeValues = [locationEnteries.search_query, locationEnteries.formatted_query, locationEnteries.latitude, locationEnteries.longitude];
    //         client.query(SQL, safeValues).then(result => {
    //             response.status(200).json(result.rows);
    //         })
    //         .catch(err => {
    //             response.status(500).send(err);
    //         })
    //         // response.status(200).json(locationEnteries);
    //     })
    //     .catch((err) => {
    //         errorHandler(err, request, response);
    //     });
}



function weatherRequestResponse(request, response) {
    const requestCity = request.query.search_query;
    // console.log(request.query.search_query)
    superagent(
        `https://api.weatherbit.io/v2.0/forecast/daily?city=${request.query.search_query}&key=${process.env.WEATHER_BIT_TOKEN}`
    )
        .then((apiData) => {
            // console.log(apiData)
            // console.log(locationEnteries);
            let weatherDataArr = [];
            apiData.body.data.map(locWeath => {
                const weatherEnteries = new LocationWeather(locWeath);
                weatherDataArr.push(weatherEnteries);
            })
            response.status(200).json(weatherDataArr);
        })
        .catch((err) => {
            errorHandler(err, request, response);
        });
}

function trailsRequestResponse(request, response) {
    const latitude = request.query.latitude;
    const longitude = request.query.longitude;
    // console.log(latitude, longitude)
    superagent(
        `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxResults=10&key=${process.env.TRAILS_API_TOKEN}`
    )
        .then(apiData => {
            // console.log(apiData.body.trails);
            let trailsDataArr = [];
            apiData.body.trails.map(locTrails => {
                const trailsEnteries = new LocationTrails(locTrails);
                trailsDataArr.push(trailsEnteries);
            })
            // console.log(trailsDataArr[0])
            response.status(200).send(trailsDataArr);
        })
        .catch((err) => {
            errorHandler(err, request, response);
        });
}







//Constructor functions to form the data and make it ready for response

function Location(requestCity, geoData) {
    this.search_query = requestCity;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

function LocationWeather(weatherData) {
    // console.log(weatherData.valid_date)
    let dateString = new Date(weatherData.valid_date);
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: '2-digit' };
    let formattedTime = dateString.toLocaleDateString('en-US', options).split(',').join('');
    this.forecast = weatherData.weather.description;
    this.time = formattedTime;
}

function LocationTrails(trailData) {
    this.name = trailData.name;
    this.location = trailData.location;
    this.length = trailData.length;
    this.stars = trailData.stars;
    this.star_votes = trailData.starVotes;
    this.summary = trailData.summary;
    this.trail_url = trailData.url;
    this.conditions = trailData.conditionStatus;
    this.condition_date = trailData.conditionDate.slice(0, 10);
    this.condition_time = trailData.conditionDate.slice(11, 18);
    // console.log(this)
}





//Helper Functions

function notFoundHandler(request, response) {
    response.status(404).send('NOT FOUND!!');
}

function errorHandler(error, request, response) {
    response.status(500).send(error);
}





//To get the sever listening to a certain port and go live
client.connect().then(() => {
    app.listen(PORT, () => console.log(`We're Live on port ${PORT} BB ^ o ^`));
}).catch(err => {
    throw new Error(`startup error ${err}`);
})