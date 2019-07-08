# WayFarer API
A backend **API** for a public bus transportation booking server, created with 
[Express](https://expressjs.com/).

## Getting Started
Fork and clone a copy on your local machine. Typing `npm install` in your terminal will
download all the necessary packages needed for the server to work effectively.

### Prerequisites
> [node](https://nodejs.org/en/) shoule be installed on your local machine to run `npm install`.
> [postgresql](https://www.postgresql.org/download/), the database needed to store data for API usage.
> [postman](https://www.getpostman.com/), needed to view response from API endpoints.

## Usage
`npm start` in your terminal will get the app running on `localhost` port `3000`.
`npm test` will run a test to verify the veracity of the code.

You can modifly the variables in the `.env` file, to suit your needs.

## Server Endpoints
All server api endpoints are secured with a **JSON WEB TOKEN**.
### Sign Up User
This resource `/api/v1/auth/signup/` receives a `POST` **request** and sends an API **response** with the appropriate **HTTP** status code. 
### Sign In User
This resource `/api/v1/auth/signin/` receives a `POST` **request** and sends an API **response** with the appropriate **HTTP** status code.  
### Create a trip
This resource `/api/v1/trips` receives a `POST` **request** and sends an API **response** with the appropriate **HTTP** status code. 
### Get trips
This resource `/api/v1/auth/signup/` receives a `GET` **request** and sends an API **response** with the appropriate **HTTP** status code.

