import { Fragment, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
    Paper, Box, Stack, Grid, Card, CardContent, CardActionArea, CardActions,
    Button, IconButton, Typography,
    Link, FormControl, FormLabel, TextField, Input,
    Autocomplete, Snackbar
} from "@mui/material";

import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon
} from "@mui/icons-material";

import productTypes from "../../productTypes.js";

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
        <Card key={index}>
            <CardContent>
                <Typography variant="h5">
                <Link component={RouterLink} to={`/manage/products/get/${product.slug}`} underline="none">
                {product.name}
                </Link>
                </Typography>
                <Typography variant="body1">
                    
                </Typography>
                <Typography variant="body2">
                {
                    variant ? (
                        kCurrencyFormatter.format(variant?.price)
                    ) : (
                        ""
                    )
                }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {product.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary">
                View
                </Button>
                <Button size="small" color="primary" component={RouterLink} to={`edit/${product.id}`}>
                Edit
                </Button>
                <Button size="small" color="primary">
                Delete
                </Button>
            </CardActions>
        </Card>
    )
}

function ProductList(aProps) {
    const { index, type, products } = aProps;
    
    const productsFiltered = products.filter(function(aElement) {
        return aElement.type == type.value;
    });
    
    return (
        <Box key={index}>
            <Typography variant="h6" sx={{ mb: 2 }}>{type.label}</Typography>
            <Grid container
                spacing={2}>
                {
                    productsFiltered.length == 0 ? (
                        <Grid item xs={18} md={4}>
                            <Typography variant="body1">There are no products of this type.</Typography>
                        </Grid>
                    ) : (
                        productsFiltered.map(function(product, i) {
                            let cards = [];
                            if (product.variants.length == 0) {
                                return (
                                    <Grid item xs={18} md={4}>
                                        <ProductCard product={product} key={i} index={i} />
                                    </Grid>
                                );
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

export default function ManageProductsList() {
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
            <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 3 }}>
                <IconButton component={RouterLink} to={kParentRoute} color="primary" aria-label="go back">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5">
                    Products
                </Typography>
            </Stack>
            <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 3 }}>
            <Button startIcon={<AddIcon />} variant="outlined" component={RouterLink} to="/manage/products/create">
                New Product
            </Button>
            </Stack>
            <Stack spacing={2} useFlexGap>
            {
                productTypes.map(function(aType, aIndex) {
                    return (<ProductList key={aIndex} index={aIndex} type={aType} products={products} />)
                })
            }
            </Stack>
        </Box>
    );
}
