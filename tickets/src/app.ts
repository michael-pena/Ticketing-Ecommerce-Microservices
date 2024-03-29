import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { updateTicketRouter } from './routes/update';
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
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

app.use(updateTicketRouter);
app.use(indexTicketRouter);
app.use(showTicketRouter);
app.use(createTicketRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);


export { app };