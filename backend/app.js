require("dotenv").config();
require("express-async-errors");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// express
const express = require("express");
const app = express();

// database
const connectDB = require("./db/connect");

//  routers
const authRouter = require("./routes/authRoutes");
// const userRouter = require("./routes/userRoutes");
// const productRouter = require("./routes/productRoutes");
// const reviewRouter = require("./routes/reviewRoutes");
// const orderRouter = require("./routes/orderRoutes");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Page");
});

app.use("/api/vl/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// app.use();

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
