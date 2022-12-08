require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

const userRouter = require('./routes/userRouter');
const sauceRouter = require('./routes/sauceRouter');

const connectDB = require('./db/connect');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(mongoSanitize());
app.use(express.json());
app.use(cors())
app.use(cookieParser('secret'));

app.use('/api/auth', userRouter);
app.use('/api/sauces', sauceRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();