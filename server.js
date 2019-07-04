import express from 'express';
import bodyparser from 'body-parser';
import 'dotenv/config';
import api from './db/dbController';

const app = express();

app.use(bodyparser.json());

app.use(
  bodyparser.urlencoded({
    extended: true,
  }),
);

app.get('/', (req, res) => res.status(200).send({ h: 'yay!' }));

app.post('/api/v1/auth/signup', api.createUser);

app.listen(process.env.PORT);

console.log(`hey ${process.env.PORT}`);
