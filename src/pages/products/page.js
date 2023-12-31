import React, { useEffect, useState } from "react";

import { useSnackbar } from "notistack";
import { Link as RouterLink } from "react-router-dom";

import {
    Box, Stack, Grid, Card, CardContent, CardActionArea, CardActions, CardMedia,
    Button, Typography,
} from "@mui/material";

import {
    Add as AddIcon
} from "@mui/icons-material";

import api from "../apiGlue.js";
import { productTypes } from "../staticTypes.js";

const kBaseUrl = `${api.host}products/`;

function ProductCard(aProps) {
    const { index, variantIndex, product, variant } = aProps;
    const { enqueueSnackbar } = useSnackbar();
    
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
                                return;
                            }

                            product.variants.forEach(function(aVariant, aIndex) {
                                cards.push(
                                    <Grid key={`${i}-${aIndex}`} item xs={18} md={4}>
                                        <ProductCard product={product} index={i} variantIndex={aIndex} variant={aVariant} />
                                    </Grid>
                                );
                            });
                            return cards;
                        })
                    )
                }
            </Grid>
        </Box>
    );
}

export default function CustomerProductsList(aProps) {
    const { filterType } = aProps;

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
