require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const mongoSanitize = require('express-mongo-sanitize');

const userRouter = require('./routes/userRouter');

const connectDB = require('./db/connect');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(mongoSanitize());
app.use(express.json());

app.use('/api', userRouter);

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