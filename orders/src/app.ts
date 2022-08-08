import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { deleteOrderRouter } from './routes/delete';
import { indexOrderRouter } from './routes';
import { showOrderRouter } from './routes/show';
import { newOrderRouter } from './routes/new';

import { errorHandler, NotFoundError, currentUser } from '@mpena/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false
  })
);

app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);


export { app };