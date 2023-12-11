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

// TODO: move to a separate module.
const productTypes = [
    {
        label: "Unsorted",
        value: 0,
    },
    {
        label: "Crop",
        value: 1,
    },
    {
        label: "Poultry",
        value: 2,
    },
];

const kBaseUrl = "http://localhost:3001/products/";
const kParentRoute = "/manage";
// Constant: used for formatting the price.
const kCurrencyFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
});

function ProductCard(aProps) {
    const { key, product, variant } = aProps;
    return (
        <Card key={key}>
            <CardContent>
                <Typography variant="h5">
                <Link component={RouterLink} to={`/manage/products/get/${product.slug}`} underline="none">
                {product.name}
                </Link>
                </Typography>
                <Typography variant="body1">
                {productTypes.find((element) => element.value == product.type).label}
                </Typography>
                <Typography variant="body2">
                {kCurrencyFormatter.format(variant.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {product.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary">
                View
                </Button>
                <Button size="small" color="primary">
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
    const { key, type, products } = aProps;
    
    const productsFiltered = products.filter(function(aElement) {
        return aElement.type == type.value;
    });
    
    return (
        <Box key={key}>
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
                            product.variants.forEach(function(aVariant, aIndex) {
                                cards.push(
                                    <Grid item xs={18} md={4}>
                                        <ProductCard product={product} key={i} variant={aVariant} />
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
        ).then(body => { setProducts(body.data); console.log(body); });
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
                    return (<ProductList key={aIndex} type={aType} products={products} />)
                })
            }
            </Stack>
        </Box>
    );
}
