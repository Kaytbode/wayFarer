import express from 'express';
import bodyparser from 'body-parser';
import cookieparser from 'cookie-parser';
import 'dotenv/config';
import router from './routes/index';

const app = express();

app.use(bodyparser.json());
app.use(cookieparser());

app.use(
  bodyparser.urlencoded({
    extended: true,
  }),
);

app.use('/', router);

app.listen(process.env.PORT);

export default app;
