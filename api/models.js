import mongoose from "mongoose";

// User mongoose model
const User = mongoose.model("User", {
    firstName: String,
    middleName: String,
    role: Number,
    email: String,
    username: String,
    password: String
}, 'users');