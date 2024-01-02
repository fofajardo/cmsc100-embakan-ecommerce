import React, { useEffect, useState } from "react";

import { useSnackbar } from "notistack";
import { Link as RouterLink } from "react-router-dom";

import {
    Box, Stack, Grid, Card, CardContent, CardActionArea, CardActions, CardMedia,
    Button, Typography, FormControl, InputLabel, Select, MenuItem, Switch,
    FormGroup, FormControlLabel
} from "@mui/material";

import {
    Add as AddIcon,
} from "@mui/icons-material";

import api from "../apiGlue.js";
import { productTypes } from "../staticTypes.js";

const kBaseUrl = `${api.host}products/`;

const kSortName = 0;
const kSortType = 1;
const kSortPrice = 2;
const kSortStock = 3;

function ProductCard(aProps) {
    const { index, product } = aProps;
    const { enqueueSnackbar } = useSnackbar();
    
    const variantIndex = product?.variantIndex;
    const variant = product?.variants;
    
    var detailPageUrl = `/products/${product.slug}`;
    if (variantIndex > 0) {
        detailPageUrl += `/${variantIndex}`;
    }
    
    return (
        <Card
            key={`${index}-${variantIndex}`}
            variant="outlined"
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
                opacity: variant?.stock == 0 ? 0.45 : 1,
                pointerEvents: variant?.stock == 0 ? "none" : ""
            }}>
            <CardActionArea component={RouterLink} to={detailPageUrl}>
                <CardMedia
                    component="img"
                    height="140"
                    image={variant?.imageUrl ? variant?.imageUrl : "/assets/images/banner1.jpg"}
                    alt={`${product?.name} - ${variant?.name}`}
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
                            api.currency.format(variant?.price)
                        ) : (
                            ""
                        )
                    }
                </Typography>
                <Button
                    startIcon={<AddIcon/>}
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={async function() {
                        const result = await api.handleCart(product?.id, variant?.id, 1, true, enqueueSnackbar);
                        if (result.status == "OK") {
                            enqueueSnackbar("Product added to cart.");
                        }
                    }}>
                Add to Cart
                </Button>
            </CardActions>
        </Card>
    );
}

function SortSelect(aProps) {
    const { listAll, sortBy, setSortBy, sortAscending, setSortAscending } = aProps;

    const handleSortBy = function(aEvent) {
        setSortBy(aEvent.target.value);
    };

    const handleSortAscending = function(aEvent) {
        setSortAscending(aEvent.target.checked);
    };

    return (
        <Stack direction="row" spacing={1} alignItems="center" component={FormGroup}>
            <FormControlLabel
                control={
                    <Switch
                        checked={sortAscending}
                        onChange={handleSortAscending}
                        inputProps={{ "aria-label": "controlled" }} />                    
                }
                label={
                    sortAscending
                        ? "Ascending"
                        : "Descending"
                }
            />
            <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="sort-select-label">Sort by</InputLabel>
                <Select
                    labelId="sort-select-label"
                    id="sort-select"
                    value={sortBy}
                    label="Sort by"
                    onChange={handleSortBy}>
                    <MenuItem value={kSortName}>Name</MenuItem>
                    {
                        // There's no point in sorting by type if this product list
                        // is exclusive to a single product type.
                        listAll ? (
                            <MenuItem value={kSortType}>Type</MenuItem>
                        ) : (
                            null
                        )
                    }
                    <MenuItem value={kSortPrice}>Price</MenuItem>
                    <MenuItem value={kSortStock}>Stock</MenuItem>
                </Select>
            </FormControl>
        </Stack>
    );
}

function ProductList(aProps) {
    const { index, type, products, listAll } = aProps;

    const [sortBy, setSortBy] = React.useState(0);
    const [sortAscending, setSortAscending] = React.useState(true);
    const [productsFiltered, setProductsFiltered] = React.useState(products);

    useEffect(function() {
        var result = products.filter(function(aElement) {
            if (listAll) {
                return aElement.type != 0;
            }
            return aElement.type == type.value;
        });

        result.sort(function(aA, aB) {
            var a = aA;
            var b = aB;

            switch (sortBy) {
                case kSortName:
                    a = aA.name.toLowerCase() + aA.variants.name.toLowerCase();
                    b = aB.name.toLowerCase() + aB.variants.name.toLowerCase();
                    break;
                case kSortType:
                    a = aA.type;
                    b = aB.type;
                    break;
                case kSortPrice:
                    a = aA.variants.price;
                    b = aB.variants.price;
                    break;
                case kSortStock:
                    a = aA.variants.stock;
                    b = aB.variants.stock;
                    break;
                default:
                    a = 0;
                    b = 0;
                    break;
            }

            if (!sortAscending) {
                var tmp = a;
                a = b;
                b = tmp;
            }

            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });

        setProductsFiltered(result);
    }, [sortBy, sortAscending, products]);

    return (
        <Box key={index}>
            <Stack
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                sx={{ mb: 2 }}
                direction={{
                    xs: "column",
                    md: "row"
                }}>
                <Typography variant="h4">
                    {listAll ? "📃 All Products" : type?.label}
                </Typography>
                <SortSelect
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortAscending={sortAscending}
                    setSortAscending={setSortAscending}
                    listAll={listAll} />
            </Stack>
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
                        productsFiltered.map(function(aProduct, aIndex) {
                            return (
                                <Grid key={aIndex} item xs={18} md={4}>
                                    <ProductCard product={aProduct} index={aIndex} />
                                </Grid>
                            )
                        })
                    )
                }
            </Grid>
        </Box>
    );
}

export default function CustomerProductsList(aProps) {
    const { filterType } = aProps;
    const { enqueueSnackbar } = useSnackbar();

    const [products, setProducts] = useState([]);

    useEffect(function() {
        api.get(
            `${kBaseUrl}?flatten=1`,
            enqueueSnackbar)
            .then(function(aResponse) {
                setProducts(aResponse.data);
            });
    }, []);

    return (
        <Box component="section" maxWidth="62.5rem" position="relative" margin="auto" sx={{ p: 2 }}>
            <Stack spacing={2} useFlexGap sx={{ mb: 3, alignItems: "center" }}>
                <img
                    alt="3 Easy Steps"
                    style={{
                        maxWidth: "75%"
                    }}
                    src="/assets/images/banner-steps.png" />
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
                            return (<ProductList key={aIndex} index={aIndex} type={aType} products={products} />);
                        })
                    )
                }
            </Stack>
        </Box>
    );
}
