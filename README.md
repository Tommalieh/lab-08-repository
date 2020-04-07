# city_explorer_api

**Author**: Muhammed Tommalieh
**Version**: 3.0.0 (increment the patch/fix version number if you make more commits past your first submission)

## Overview

**This projects aims on providing information such as (locations, weather, famous resturants, ...etc) to tourists who are willing to visit**.
<!-- Provide a high level overview of what this application is and why you are building it, beyond the fact that it's an assignment for this class. (i.e. What's your problem domain?) -->

## Getting Started

1. Build a local Server with proper dependencies and routes and getting it to live state.
2. Get the right data from an API using the superagent library and pass it in the right form using a constructor to the right route response.
3. Make the server handle various routes with proper respones depending on the requests.
4. Store the response data from the API into it's entity inside the table related to it in the database (PGSQL).
5. If the user enter a city requested before then respond with data stored in the database without hitting the API.
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->

## Architecture

* Languages Used:
  * JavaScript
  * SQL

* Runtime Used:
  * Node.js

* Libraries:
  * Express
  * Dotenv
  * Cors
  * Superagent
  * PG
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->

## Change Log

 * 04-05-2020 3:32pm - Application folders and files structure ready for deployment.

 * 04-05-2020 6:17pm - Added the features of getting the location and weather for the requested city.

 * 04-05-2020 6:27pm - Fixed a minor bug of weather forecast not showing to the user.

 * 04-05-2020 7:09pm - Added error handling feature for both the location and wearther functionalities.

 * 04-06-2020 4:22pm - Reformed the code to get the location and weather for the requested city from it's respected API provider.

 * 04-06-2020 6:19pm - Added the features of getting the trails available for the requested city from it's respected API provider.

 * 04-07-2020 5:42pm - Added the feature of storing response data in the data base if it's a new request.

 * 04-06-2020 7:45pm - Added retreiving data from the database and not the API if the request matches a database entry.




<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples:

01-01-2001 4:59pm - Application now has a fully-functional express server, with a GET route for the location resource.

## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->
-->

* Number and name of feature: Feature#1 Storing in Database
  * Estimate of time needed to complete: 2 hours
  * Start time: 3:00 PM
  * Finish time: 4:22 PM
  * Actual time needed to complete: 1 Hour and 22 Minutes


* Number and name of feature: Feature#2 Retreiving from Database
  * Estimate of time needed to complete: 4 hours
  * Start time: 5:30 PM
  * Finish time: 7:45 PM
  * Actual time needed to complete: 2 Hours and 15 Minutes


* Number and name of feature: Feature#3 Error Handling
  * ***This feature was added during the process of adding the previous features***.