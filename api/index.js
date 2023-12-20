import express from "express";
import mongoose from "mongoose";

import session from "express-session";
import MongoStore from "connect-mongo";

import corsModifier from "./corsModifier.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import authRouter from "./routes/authRoutes.js";

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

gApp.set("trust proxy", 1)
gApp.use(session({
    secret: "b5f8bba4-e0a3-4127-b230-dc06968b65a5",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: kDbString
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: false
    }
}));

// Set up the router, which handles the endpoints.
gApp.use("/api/users", userRouter);
gApp.use("/api/products", productRouter);
gApp.use("/api/orders", orderRouter);
gApp.use("/api/carts", cartRouter);
gApp.use("/api/auth", authRouter);

// Listen to the specified port.
gApp.listen(kPort);
