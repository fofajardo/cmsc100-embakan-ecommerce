import express from "express";
import mongoose from "mongoose";

import corsModifier from "./corsModifier.js";
import orderRouter from "./routes/orderRoutes.js";
import cartRouter from "./routes/cartRoutes.js";

const kDbHost = "127.0.0.1";
const kDbPort = "27017";
const kDbName = "aetos-commerce";
const kDbString = `mongodb://${kDbHost}:${kDbPort}/${kDbName}`;
const kPort = 3001;

const gApp = express();

await mongoose.connect(kDbString);

// Use appropriate parsers to access the request/response body directly.
gApp.use(express.json());
gApp.use(express.urlencoded({ extended: false }));
gApp.use(corsModifier);

// Set up the router, which handles the endpoints.
gApp.use("/orders", orderRouter);
gApp.use("/carts", cartRouter);

// Listen to the specified port.
gApp.listen(kPort);
