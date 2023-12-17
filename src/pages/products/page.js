import { Fragment, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
    Paper, Box, Stack, Grid, Card, CardContent, CardActionArea, CardActions, CardMedia,
    Button, IconButton, Typography,
    Link, FormControl, FormLabel, TextField, Input,
    Autocomplete, Snackbar
} from "@mui/material";

import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon
} from "@mui/icons-material";

import productTypes from "../productTypes.js";

const kBaseUrl = "http://localhost:3001/products/";
const kParentRoute = "/manage";
// Constant: used for formatting the price.
const kCurrencyFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
});

function ProductCard(aProps) {
    const { index, product, variant } = aProps;
    return (
        <Card
            key={index}
            variant="outlined"
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between"
            }}>
            <CardActionArea component={RouterLink} to={`/products/${product.slug}`}>
                <CardMedia
                    component="img"
                    height="140"
                    image="/assets/images/banner1.jpg"
                    alt="green iguana"
                />
                <CardContent>
                    <Typography variant="h5">
                    {product.name}
                    </Typography>
                    <Typography variant="h6">
                        {variant?.name}
                    </Typography>
                    <Typography variant="body1">
                        {variant?.stock} units left
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    {product.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h5">
                        {
                            variant ? (
                                kCurrencyFormatter.format(variant?.price)
                            ) : (
                                ""
                            )
                        }
                    </Typography>
                    <Button startIcon={<AddIcon/>} size="small" color="primary" variant="contained">
                    Add to Cart
                    </Button>
            </CardActions>
        </Card>
    )
}

function ProductList(aProps) {
    const { index, type, products, listAll } = aProps;
    
    const productsFiltered = products.filter(function(aElement) {
        if (listAll) {
            return aElement.type != 0;
        }
        return aElement.type == type.value;
    });
    
    return (
        <Box key={index}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                {listAll ? "📃 All Products" : type?.label}
            </Typography>
            <Grid
                container
                direction="row"
                spacing={2}>
                {
                    productsFiltered.length == 0 ? (
                        <Grid item xs={18} md={4}>
                            <Typography variant="body1">There are no products of this type.</Typography>
                        </Grid>
                    ) : (
                        productsFiltered.map(function(product, i) {
                            let cards = [];
                            // Hide products with no variants from view.
                            if (product.variants.length == 0) {
                                return (<Fragment></Fragment>);
                            }

                            product.variants.forEach(function(aVariant, aIndex) {
                                cards.push(
                                    <Grid item xs={18} md={4}>
                                        <ProductCard product={product} key={i} index={i} variant={aVariant} />
                                    </Grid>
                                );
                            });
                            return cards;
                        })
                    )
                }
            </Grid>
        </Box>
    )
}

export default function CustomerProductsList(aProps) {
    const { filterType } = aProps;
    const navigate = useNavigate();
    const setters = { navigate };

    const [products, setProducts] = useState([]);

    useEffect(function() {
        fetch(kBaseUrl,
            {
                method: "GET",
            }
        ).then(response => response.json()
        ).then(body => { setProducts(body.data); });
    }, []);

    return (
        <Box component="section" maxWidth="62.5rem" position="relative" margin="auto" sx={{ p: 2 }}>
            <Stack spacing={2} useFlexGap sx={{ mb: 3, alignItems: "center" }}>
                <img
                    style={{
                        maxWidth: "100%"
                    }}
                    src="/banners/E-mbakanShopBanner.svg" />
            </Stack>
            <Stack spacing={2} useFlexGap>
            {
                filterType == -1 ? (
                    <ProductList listAll products={products} />
                ) : (
                        productTypes.map(function(aType, aIndex) {
                            if (aType.isPrivate) {
                                return;
                            }
                            if (filterType && aType.value != filterType) {
                                return;
                            }
                            return (<ProductList key={aIndex} index={aIndex} type={aType} products={products} />)
                        })
                )
            }
            </Stack>
        </Box>
    );
}
