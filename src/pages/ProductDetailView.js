import React from 'react';
import { Grid, Typography, Divider, Button, Box } from "@mui/material";

// crop product test case for product detail view.
const crop_product = {
    ID: 1,
    Name: "Bitter Melon (Ampalaya)",
    Type: "Crop",
    Description: "Harvested from Benguet.",
    Price: 96,
    Stock: 50,
    Variant: "KG (4-5 pcs)",
    Quantity: 1,
    Image:"./components/products/crops/Ampalaya.jpg"
};

// poultry product test case for product detail view.
const poultry_product = {
    ID: 2,
    Name: " Whole Chicken",
    Type: "Poultry",
    Description: "Born and raised from Bacolod.", 
    Price: 175,
    Stock: 50,
    Variant: "Whole",
    Quantity: 1,
    Image:"./components/products/poultry/chicken.png"
};

export default function ProductDetailView(){
    return (
        <Grid container spacing = {2}>
            <Grid item sx = {8}>
                <Typography>{ crop_product.Name }</Typography>
            </Grid>
        </Grid>
    )
}