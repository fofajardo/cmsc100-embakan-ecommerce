import * as React from 'react';
import { Grid, Typography, Divider, Button, Box, TextField, createTheme, 
    ThemeProvider } from "@mui/material";

// crop product test case for product detail view.
const crop_product = {
    ID: 1,
    Name: "Bitter Melon (Ampalaya)",
    Type: "Crop",
    Description: "Harvested from Benguet, this is great for lowering blood sugar, reduce cholesterol, and aids in weight loss.",
    Price: 96,
    Stock: 50,
    Variant: "kg (4-5 pcs)",
    Quantity: 1,
    Image: "products/Ampalaya.jpg"
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
    Image:"products/chicken.png"
};

const defaultTheme = createTheme();

export default function ProductDetailView(){
    return (
        <ThemeProvider theme = {defaultTheme}>
            <Grid 
            container 
            spacing = {2}
            alignItems= "top"
            mt = "15px"
            justifyContent="center"
            sx={{ minHeight: '100vh' }}>
                <Grid item sx = {7} alignItems = "center">
                   <img 
                        height={550}
                        width={400}
                        src = {crop_product.Image} />
                </Grid>
                <Grid item sx = {4} ml = "25px">
                    <Typography variant = "subtitle1" fontStyle = {'italic'}>{crop_product.Type}</Typography>
                    <Box mt ={2}>
                        <Typography variant = "h3" fontWeight = {'bold'}>{crop_product.Name}</Typography>
                        <Typography variant = "h4">{crop_product.Price}</Typography>
                        <Box mt = {5} sx = {{width: '70%'}}>
                            <Typography variant = "subtitle1" sx = {{wordBreak: 'break-word'}}>{crop_product.Description}</Typography>
                            <Divider />
                            <Box mt = {2}>
                                <Typography variant = "h5">{crop_product.Variant}</Typography>
                                <Typography variant = "subtitle1" fontStyle = {'italic'}>Stock: {crop_product.Stock}</Typography>
                                <Box mt = {5}>
                                    <TextField
                                        label = "Quantity"
                                        placeholder = {crop_product.Quantity}
                                        type = "number"
                                        InputProps = {{inputProps: {min: crop_product.Quantity, max: crop_product.Stock, step: 1}}}>

                                    </TextField>

                                    <Button
                                        variant = "contained"
                                        color = "success"
                                        onClick={() => {
                                            alert('clicked');
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                </Box>
                            </Box>
                        </Box>  
                    </Box>
                </Grid> 
            </Grid>
        </ThemeProvider>  
    );
}