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




// Product mongoose model
const Product = mongoose.model("Product", {
    id: String,
    name: String,
    slug: String,
    type: Number,
    price: Number,
    description: String,
    quantity: Number
}, 'products');