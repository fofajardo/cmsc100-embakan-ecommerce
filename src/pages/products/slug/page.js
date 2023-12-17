import * as React from "react";

import { Fragment, useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import {
    Grid, Typography, Divider, Button, Box,
    TextField, Snackbar, IconButton, MenuItem,
    FormControl, InputLabel, Select, Stack, Container
} from "@mui/material";

import api from "../../apiGlue.js";
import productTypes from "../../productTypes.js";

const kCurrencyFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
});

const kBaseUrl = "http://localhost:3001/products/";

export default function ProductDetailView() {
    const { slug } = useParams();
    const [product, setProduct] = useState();
    const [variant, setVariant] = useState({});
    const [quantity, setQuantity] = useState(1);

    useEffect(function() {
        api.get(`${kBaseUrl}by/${slug}`).then(function(aProduct) {
            setProduct(aProduct.data);
            if (aProduct.data?.variants.length > 0) {
                setVariant(aProduct.data?.variants[0]);
            }
        });
    }, [slug]);

    function addToCart(){
        // TO DO: Add a function that adds the product with its quantity to the cart.
        alert("added to cart");
    }

    return (
        <Container>
            <Grid
                container
                spacing={5}
                alignItems="top"
                justifyContent="space-evenly"
                sx={{ mt: 0 }}>

                <Grid item sx={7} alignItems="center">
                    <img
                        height={500}
                        width={500}
                        src="{product.Image}"
                        alt={product?.name} />
                </Grid>

                <Grid item sx={4}>
                    <Typography variant="subtitle1">
                        {
                            product ? (
                                productTypes.find(function(element) {
                                    return element.value == product?.type
                                }).label
                            ) : (
                                ""
                            )
                        }
                    </Typography>
                    <Box mt={2}>
                        <Typography variant="h3" fontWeight={"bold"}>{product?.name}</Typography>
                        <Typography variant="h4">{kCurrencyFormatter.format(variant?.price)}</Typography>
                        <Box mt={5}>
                            <Typography variant="subtitle1" sx={{
                                wordBreak: "break-word"
                            }}>
                                {product?.description}
                            </Typography>
                            <Divider />
                            <Box my={2}>
                                <Stack spacing={1}>
                                    <FormControl fullWidth>
                                        <InputLabel id="in-unit-label">Unit</InputLabel>
                                        <Select
                                            label="Unit"
                                            labelId="in-unit-label"
                                            name="in-unit"
                                            size="small"
                                            value={variant}
                                            onChange={function(aEvent) {
                                                setVariant(aEvent.target.value);
                                            }}>
                                            {
                                                product?.variants?.map(function(aVariant, aIndex) {
                                                    return (
                                                        <MenuItem key={aIndex} value={aVariant}>
                                                            {aVariant.name}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                    <Typography variant="subtitle1">Stock: {variant?.stock}</Typography>
                                    <TextField
                                        label="Quantity"
                                        size="small"
                                        value={quantity}
                                        onChange={function(aEvent) {
                                            setQuantity(aEvent.target.value);
                                        }}
                                        type="number"
                                        InputProps = {{
                                            inputProps: {
                                                min: 1,
                                                max: variant?.stock,
                                                step:1
                                            }
                                        }}>
                                    </TextField>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={addToCart}>
                                        Add to Cart
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}