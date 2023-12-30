import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

import {
    Grid, Typography, Divider, Button, Box,
    TextField, MenuItem,
    FormControl, InputLabel, Select, Stack, Container
} from "@mui/material";

import api from "../../apiGlue.js";
import productTypes from "../../productTypes.js";

const kCurrencyFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
});

const kBaseUrl = `${api.kHost}products/`;

export default function ProductDetailView() {
    const { enqueueSnackbar } = useSnackbar();
    const { slug, variantIndex } = useParams();
    const [product, setProduct] = useState();
    const [variant, setVariant] = useState("");
    const [variantStock, setVariantStock] = useState(0);
    const [variantItems, setVariantItems] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(function() {
        api.get(`${kBaseUrl}by/${slug}`).then(function(aProduct) {
            const targetProduct = aProduct.data;
            setProduct(targetProduct);
            if (!targetProduct || targetProduct.variants.length == 0) {
                setVariant({});
                setVariantStock(0);
                setVariantItems(null);
                return;
            }

            const targetVariantIndex = variantIndex != null
                ? variantIndex
                : 0;
            const targetVariant = targetProduct.variants[targetVariantIndex];
            setVariant(targetVariant);
            setVariantStock(targetVariant.stock);
            setVariantItems(targetProduct.variants.map(
                function(aVariant, aIndex) {
                    return (
                        <MenuItem key={aIndex} value={aVariant}>
                            {aVariant.name}
                        </MenuItem>
                    );
                }
            ));
        });
    }, [slug, variantIndex]);

    async function addToCart() {
        const result = await api.handleCart(product?.id, variant?.id, quantity, true, enqueueSnackbar);
        if (result.status == "OK") {
            enqueueSnackbar("Product added to cart.");
        }
    }

    return (
        <Container>
            <Grid
                container
                spacing={{
                    xs: 2,
                    md: 5
                }}
                sx={{
                    flexDirection: {
                        xs: "column",
                        md: "row"
                    },
                    justifyContent: {
                        xs: "unset",
                        md: "space-between",
                    },
                    py: 5
                }}>

                <Grid item sx={{
                    alignSelf: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: "1",
                    width: "100%",
                    maxHeight: {
                        xs: "350px",
                        md: "450px",
                    },
                    mb: 3
                }}>
                    <img
                        src={variant?.imageUrl ? variant?.imageUrl : "/assets/images/banner1.jpg"}
                        alt={product?.name}
                        style={{
                            objectFit: "contain",
                            maxHeight: "inherit",
                            maxWidth: "100%"
                        }} />
                </Grid>

                <Grid item sx={{ flex: "1" }}>
                    <Typography variant="subtitle1">
                        {
                            product ? (
                                productTypes.find(function(element) {
                                    return element.value == product?.type;
                                }).label
                            ) : (
                                ""
                            )
                        }
                    </Typography>
                    <Box mt={2}>
                        <Typography variant="h3" fontWeight={"bold"}>{product?.name}</Typography>
                        <Typography variant="h4">{kCurrencyFormatter.format(variant?.price)}</Typography>
                        <Typography variant="subtitle1" sx={{
                            wordBreak: "break-word",
                            my: 2
                        }}>
                            {product?.description}
                        </Typography>
                        <Box>
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
                                                setVariantStock(aEvent.target.value.stock);
                                            }}>
                                            {variantItems}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="Stock"
                                        size="small"
                                        value={variantStock}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
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
                                        }} />
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