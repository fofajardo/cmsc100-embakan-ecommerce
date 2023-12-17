import express from "express";
import mongoose from "mongoose";

import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

import corsModifier from "./corsModifier.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import cartRouter from "./routes/cartRoutes.js";

const kDbHost = "127.0.0.1";
const kDbPort = "27017";
const kDbName = "embakan";
const kDbString = `mongodb://${kDbHost}:${kDbPort}/${kDbName}`;
const kPort = 3001;

const gApp = express();

await mongoose.connect(kDbString);

// Use appropriate parsers to access the request/response body directly.
gApp.use(express.json());
gApp.use(express.urlencoded({ extended: false }));
gApp.use(corsModifier);

import authRouter from "./routes/authRoutes.js";

gApp.use(session({
    secret: "b5f8bba4-e0a3-4127-b230-dc06968b65a5",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: kDbString
    })
}));
gApp.use(passport.authenticate("session"));

// Set up the router, which handles the endpoints.
gApp.use("/users", userRouter);
gApp.use("/products", productRouter);
gApp.use("/orders", orderRouter);
gApp.use("/carts", cartRouter);
gApp.use("/auth", authRouter);

// Listen to the specified port.
gApp.listen(kPort);
