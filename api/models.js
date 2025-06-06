import mongoose from "mongoose";

// User mongoose model
const User = mongoose.model("User", {
    id: String,
    firstName: String,
    middleName: String,
    lastName: String,
    role: Number,
    email: String,
    username: String,
    password: String,
    address: String
}, "users");

// Product mongoose model
const Product = mongoose.model("Product", {
    id: String,
    name: String,
    slug: String,
    type: Number,
    description: String,
    variants: {
        type: [{
            id: String,
            name: String,
            price: Number,
            stock: Number,
            imageUrl: String
        }],
        default: []
    }
}, "products");

// Order mongoose model
const Order = mongoose.model("Order", {
    id: String,
    groupId: String,
    productId: String,
    variantId: String,
    quantity: Number,
    price: Number,
    userId: String,
    status: Number,
    date: Date
}, "orders");

// Cart item model
const Cart = mongoose.model("Cart", {
    id: String,
    items: [{
        productId: String,
        variantId: String,
        quantity: Number
    }]
}, "carts");

export { User, Product, Order, Cart };
