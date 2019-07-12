# WayFarer API
A backend **API** for a public bus transportation booking server, created with 
[Express](https://expressjs.com/).

## Getting Started
Fork and clone a copy on your local machine. Typing `npm install` in your terminal will
download all the necessary packages needed for the server to work effectively.

### Prerequisites
+ [node](https://nodejs.org/en/) shoule be installed on your local machine to run `npm install`.
+ [postgresql](https://www.postgresql.org/download/), the database needed to store data for API usage.
+ [postman](https://www.getpostman.com/), needed to view response from API endpoints.

## Usage
`npm start` in your terminal will get the app running on `localhost` port `3000`.
`npm test` will run a test to verify the veracity of the code.

You can modifly the variables in the `.env` file, to suit your needs.

## Server Endpoints
All server api endpoints are secured with a **JSON WEB TOKEN**.
### Sign Up User
This resource `/api/v1/auth/signup/` receives a `POST` **request** and sends an API **response** with the appropriate **HTTP** status code. Users can sign up to use resource
### Sign In User
This resource `/api/v1/auth/signin/` receives a `POST` **request** and sends an API **response** with the appropriate **HTTP** status code.  
### Create a trip
This resource `/api/v1/trips` receives a `POST` **request** and sends an API **response** with the appropriate **HTTP** status code. Admins can create trips.
### Get trips
This resource `/api/v1/auth/signup/` receives a `GET` **request** and sends an API **response** with the appropriate **HTTP** status code. Users can view all trips.
### Book a seat
This resource `/api/v1/bookings/` receives a `POST` **request** and sends an API **response** with the appropriate **HTTP** status code. users can a book a seat on a trip.
### View all bookings
This resource `/api/v1/bookings/` receives a `GET` **request** and sends an API **response** with the appropriate **HTTP** status code. Admins can view all bookings, while users can view his/her bookings.
### Delete bookings
This resource `/api/v1/bookings/:bookingId` receives a `DELETE` **request** and sends an API **response** with the appropriate **HTTP** status code. Users can delete his/her bookings.
### Cancel trip
This resource `/api/v1/trips/:tripId` receives a `PATCH` **request** and sends an API **response** with the appropriate **HTTP** status code. Admins can cancel trips.
### Filter trips By destination
This resource `/api/v1/trips/destination/:destination` receives a `GET` **request** and sends an API **response** with the appropriate **HTTP** status code. Users can get trips filtered by destination. 
### Filter trips By origin
This resource `/api/v1/trips/origin/:origin` receives a `GET` **request** and sends an API **response** with the appropriate **HTTP** status code. Users can get trips filtered by origin.
### Change seat
This resource `/api/v1/bookings/user/:bookingId` receives a `PATCH` **request** and sends an API **response** with the appropriate **HTTP** status code. Users can change seats after booking.

## Running the tests
The tests confirms if the endpoints deliver the appropriate response and **HTTP** code, when given a valid request, and also to know if the error message delivered connotes the error.
 *A user signing up with all required parameters field will get a response similar to this*
 ```
    {
        "status": "success",
        "data": {
            "user_id": 68,
            "is_admin": false,
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJraXl0IiwiZW1haWwiOiJrb2l5dEB5YWhvby5jb20iLCJsYXN0TmFtZSI6ImtvIiwicGFzc3dvcmQiOiJydHRyIiwiaWF0IjoxNTYyOTIxNzg4LCJleHAiOjE1NjI5MjIzOTJ9.MEStHWv_e5MHedALI35Po5La2OJXsgpkukBWS8Xnyhg"
        }
    }
```
*while a user trying to get trips without an authorized token gets a response similar to this*
```
    {
        "status": "error",
        "error": "User unauthorized"
    }
```
## Deployment
[App](https://safe-stream-26808.herokuapp.com/) is hosted on heroku

## Built With
+ [Express](https://expressjs.com/) - Backend server
+ [Postgresql](https://www.postgresql.org/download/) - Database
+ [Mocha](https://mochajs.org/) - To run test

## Acknowledgements
+ [Andela](https://andela.com/) - For the project guide
+ [Stack overflow](https://stackoverflow.com/) - For the numerous unblocking :)
