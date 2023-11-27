import express from "express";
import router from "./router.js";

// Constants.
const kPort = 3001;
const gApp = express();

// Use appropriate parsers to access the request/response body directly.
gApp.use(express.json());
gApp.use(express.urlencoded({ extended: false }));

// Set up the router, which handles the endpoints.
router(gApp);

// Listen to the specified port.
gApp.listen(kPort);
