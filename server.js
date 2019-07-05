import express from 'express';
import bodyparser from 'body-parser';
import cookieparser from 'cookie-parser';
import 'dotenv/config';
import api from './db/dbController';

const app = express();

app.use(bodyparser.json());
app.use(cookieparser());

app.use(
  bodyparser.urlencoded({
    extended: true,
  }),
);

app.post('/api/v1/auth/signup', api.createUser);

app.listen(process.env.PORT);

export default app;
