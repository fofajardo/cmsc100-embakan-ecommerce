import * as React from 'react';
import { Grid, Typography, Divider, Button, Box, TextField, 
        Snackbar, IconButton  } from "@mui/material";

import { ArrowBack } from '@mui/icons-material';

// crop product test case for product detail view.
const crop_product = {
    ID: 1,
    Name: "Bitter Melon (Ampalaya)",
    Type: "Crop",
    Description: "Harvested from Benguet, this is great for lowering blood sugar, reduce cholesterol, and aids in weight loss.",
    Price: 96,
    Stock: 50,
    Variant: "kg",
    Quantity: 1,
    Image: "products/Ampalaya.jpg"
};

// poultry product test case for product detail view.
const poultry_product = {
    ID: 2,
    Name: " Whole Chicken",
    Type: "Poultry",
    Description: "Born and raised from Bacolod, this is great for dishes like inasal, tinola, and more.", 
    Price: 175,
    Stock: 50,
    Variant: "Whole",
    Quantity: 1,
    Image:"products/chicken.png"
};

const kCurrencyFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
});
  

export default function ProductDetailView(){
    function back(){
        // TO DO: Add a function that goes back to the product listing when pressed.
        alert("back");
    }

    function addToCart(){
        // TO DO: Add a function that adds the product with its quantity to the cart.
        alert("added to cart");
    }
    return (
        <Grid 
        container 
        spacing={5}
        alignItems="top"
        justifyContent="space-evenly"
        mt="15px">

            <Box>
                <IconButton style={{bottom: 3, right: 3}} onClick={back}>
                    <ArrowBack />
                </IconButton>
            </Box>

            <Grid item sx={7} alignItems="center">
                <img 
                    height={500}
                    width={500}
                    src={poultry_product.Image} 
                    alt={poultry_product.Name} />
            </Grid>

            <Grid item sx={4} ml="25px">
                <Typography variant="subtitle1" fontStyle={'italic'}>{poultry_product.Type}</Typography>
                <Box mt={2}>
                    <Typography variant="h3" fontWeight={'bold'} sx={{width:'75%'}}>{poultry_product.Name}</Typography>
                    <Typography variant="h4">{kCurrencyFormatter.format(poultry_product.Price)}</Typography>
                    <Box mt={5} sx={{width: '75%'}}>
                        <Typography variant="subtitle1" sx={{wordBreak: 'break-word'}}>{poultry_product.Description}</Typography>
                        <Divider />
                        <Box mt={2}>
                            <Typography variant="h5">{poultry_product.Variant}</Typography>
                            <Typography variant="subtitle1" fontStyle={'italic'}>Stock: {poultry_product.Stock}</Typography>
                            <Box mt={5} display="flex" justifyContent="space-between" pb="25px" sx={{width:'60%'}}>
                                <TextField
                                    sx={{width:"30%"}}
                                    label="Quantity"
                                    placeholder={poultry_product.Quantity}
                                    type="number"
                                    InputProps = {{inputProps:{min: poultry_product.Quantity, max:poultry_product.Stock, step:1}}}>
                                </TextField>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={addToCart}>
                                    Add to Cart
                                </Button>
                            </Box>
                        </Box>
                    </Box>  
                </Box>
            </Grid>  
        </Grid>  
    );
}