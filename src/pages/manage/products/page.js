import { Fragment, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { useSnackbar } from "notistack";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
    Container,
    Paper, Box, Stack, Grid, Card, CardContent, CardActionArea, CardActions,
    Button, IconButton, Typography,
    Link, FormControl, FormLabel, TextField, Input,
    Autocomplete, Snackbar,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    useTheme, useMediaQuery
} from "@mui/material";

import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon
} from "@mui/icons-material";

import productTypes from "../../productTypes.js";

import api from "../../apiGlue.js";

const kBaseUrl = `${api.kHost}products/`;
const kParentRoute = "/manage";
// Constant: used for formatting the price.
const kCurrencyFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
});

async function handleSubmit(aEvent, aSetters) {
    aEvent.preventDefault();

    const { enqueueSnackbar, reloadData } = aSetters;
    const formData = new FormData(aEvent.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    const productId = formJson["in-product-id"];
    const variantId = formJson["in-variant-id"];

    var result;
    if (productId) {
        if (variantId) {
            result = await api.del(
                `${kBaseUrl}${productId}/variants/${variantId}`,
                null,
                enqueueSnackbar,
                "Product variant was deleted successfully.");
        } else {
            result = await api.del(
                `${kBaseUrl}${productId}`,
                null,
                enqueueSnackbar,
                "Product was deleted successfully.");
        }
    }

    if (result) {
        reloadData();
        return true;
    }
    
    enqueueSnackbar("Failed to delete product.");    
}

function ProductCard(aProps) {
    const { index, product, variant, onOpenDialog } = aProps;

    const handleClickDelete = function() {
        onOpenDialog({
            productId: product?.id,
            variantId: variant?.id
        });
    };

    return (
        <Card key={index} variant="outlined">
            <CardContent>
                <Typography variant="h5">
                {product.name}
                </Typography>
                <Typography variant="body1">
                {variant?.name}
                </Typography>
                <Typography variant="body1">
                    {variant?.stock} units left
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
                <Button size="small" color="primary" component={RouterLink} to={`edit/${product.id}`}>
                Edit
                </Button>
                <Button size="small" color="primary" onClick={handleClickDelete}>
                Delete
                </Button>
            </CardActions>
        </Card>
    )
}

function ProductList(aProps) {
    const { index, type, products, onOpenDialog } = aProps;
    
    const productsFiltered = products?.filter(function(aElement) {
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
                                    <Grid key={i} item xs={18} md={4}>
                                        <ProductCard product={product} key={i} index={i} onOpenDialog={onOpenDialog} />
                                    </Grid>
                                );
                            }

                            product.variants.forEach(function(aVariant, aIndex) {
                                cards.push(
                                    <Grid key={`${i}-${aIndex}`} item xs={18} md={4}>
                                        <ProductCard product={product} key={i} index={i} variant={aVariant} onOpenDialog={onOpenDialog} />
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

function getAllProducts(aSetProducts) {
    const result = fetch(kBaseUrl,
        {
            method: "GET",
        }
    ).then(response => response.json()
    ).then(body => aSetProducts(body.data));
}

export default function ManageProductsList() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const reloadData = function() {
        getAllProducts(setProducts);
    }
    useEffect(function() {
        reloadData();
    }, []);

    const setters = { enqueueSnackbar, navigate, reloadData };

    const [open, setOpen] = useState(false);
    const [dialogData, setDialogData] = useState();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleOpenDialog = function(aDialogData) {
        setDialogData(aDialogData);
        setOpen(true);
    };

    const handleClose = function() {
        setOpen(false);
    };

    const handleDialogSubmit = async function(aEvent) {
        const result = await handleSubmit(aEvent, setters);
        if (result) {
            setOpen(false);
        }
    };

    return (
        <Container sx={{ py: 3 }}>
            <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4">
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
                    return (<ProductList
                        key={aIndex}
                        index={aIndex}
                        type={aType}
                        products={products}
                        onOpenDialog={handleOpenDialog} />)
                })
            }
            </Stack>
            <Dialog
                id="dialog-form"
                component="form"
                onSubmit={handleDialogSubmit}
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                fullScreen={fullScreen}>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogContent>
                    <div style={{ display: "none" }}>
                        <input type="text" name="in-product-id" value={dialogData?.productId} readOnly />
                        <input type="text" name="in-variant-id" value={dialogData?.variantId} readOnly />
                    </div>
                    <DialogContentText>
                    Are you sure you want to delete this product?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button type="submit" form="dialog-form">Yes</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
