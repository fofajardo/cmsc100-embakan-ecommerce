import React, { useState, useEffect } from "react";

import { Link as RouterLink } from "react-router-dom";
import { useSnackbar } from "notistack";

import {
    Stack, AppBar, Toolbar,
    Card, CardContent, CardActions,
    Button, Typography, TextField,
    List, ListItem, ListItemText,
    IconButton, Container
} from "@mui/material";

import {
    Add as AddIcon ,
    Remove as RemoveIcon ,

} from "@mui/icons-material";

import api from "../apiGlue.js";

const kBaseUrl = `${api.host}products/`;

function CartListItem(aProps) {
    const { data, isHeader, isLast } = aProps;
    const { enqueueSnackbar } = useSnackbar();
    const [product, setProduct] = useState("");
    const [variant, setVariant] = useState();
    const [quantity, setQuantity] = useState(1);

    if (!isHeader) {
        useEffect(function() {
            api.get(`${kBaseUrl}${data.productId}`).then(function(aProduct) {
                setProduct(aProduct.data);
            });
            api.get(`${kBaseUrl}${data.productId}/variants/${data.variantId}`).then(function(aVariant) {
                setVariant(aVariant.data);
            });
            setQuantity(data?.quantity);
        }, [data]);
    }

    const colWidths = [
        {
            xs: "auto",
            md:"45%",
        },
        {
            xs: "auto",
            md: "20%"
        },
        {
            xs: "auto",
            md: "20%"
        },
        {
            xs: "auto",
            md: "15%"
        }
    ];

    return (
        <ListItem divider={!isLast} sx={{
            flexDirection: {
                xs: "column",
                md: "row"
            },
            alignItems: {
                xs: "start",
                md: "center"
            },
            pb: isLast ? 0 : 1
        }}>
            <ListItemText
                primary={isHeader ? "Name" : product?.name}
                secondary={variant?.name}
                sx={{
                    mb: isLast ? 0 : 0.75,
                    width: colWidths[0]
                }} />
            <ListItemText primary=
                {
                    (variant && data)
                        ? api.currency.format(variant?.price)
                        : isHeader
                            ? "Unit Price"
                            : ""
                }
                sx={{ width: colWidths[1] }} />
            <ListItemText
                primary={isHeader ? "Quantity" : quantity}
                sx={{ width: colWidths[2] }} />
            <ListItemText primary=
                {
                    (variant && data)
                        ? api.currency.format(variant?.price * data?.quantity)
                        : isHeader
                            ? "Item Subtotal"
                            : ""
                }
                sx={{ width: colWidths[3] }} />
        </ListItem>
    );
}

export default function Checkout() {
    const [user, setUser] = useState(null);

    useEffect(function() {
        api.identify().then(function(aResult) {
            if (!aResult.data) {
                return;
            }
            setUser(aResult.data);
        });
    }, []);

    const [cartItems, setCartItems] = useState();
    const [totalPrice, setTotalPrice] = useState("");

    useEffect(function() {
        api.findCart().then(function(aCart) {
            setCartItems(aCart?.data?.items);

            if (aCart?.data?.items?.length == 0) {
                setTotalPrice(api.currency.format(0));
                return;
            }

            setTotalPrice("");
            var price = 0;
            aCart?.data?.items.forEach(function(aItem) {
                api.get(`${kBaseUrl}${aItem.productId}/variants/${aItem.variantId}`)
                    .then(function(aVariant) {
                        price += aVariant?.data?.price * aItem.quantity;
                        setTotalPrice(api.currency.format(price));
                    });
            });
        });
    }, []);

    const handleCartItemsMap = function(item, index) {
        return (
            <CartListItem
                key={index}
                data={item}
                isLast={index == cartItems.length - 1} />
        );
    }

    return (
        <Container>
            <Stack spacing={2} sx={{ my: 2 }}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                        Delivery Address
                        </Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                        {user?.firstName} {user?.middleName} {user?.lastName}
                        </Typography>
                        <Typography>
                        {user?.email} ({user?.username})
                        </Typography>
                        <Typography component="p">
                        {user?.address}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button component={RouterLink} to="/account">Change address</Button>
                    </CardActions>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                        Products Ordered
                        </Typography>
                        <List sx={{ py: 0 }}>
                            <CartListItem isHeader={true} />
                        {
                            cartItems?.length == 0 ? (
                                <Typography>
                                    Your cart is empty.
                                </Typography>
                            ) : (
                                cartItems?.map(handleCartItemsMap)
                            )
                        }
                        </List>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                        <List>
                            <ListItem>
                                <ListItemText primary="Merchandise Subtotal:" />
                                <ListItemText primary={totalPrice} align="right" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Shipping Total:" />
                                <ListItemText primary={api.currency.format(0)} align="right" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Total Payment:" />
                                <ListItemText primary={totalPrice} align="right" />
                            </ListItem>
                        </List>
                    </CardContent>
                    <CardActions>
                        <Button
                            component={RouterLink}
                            to="/checkout/confirm"
                            type="button"
                            align="right"
                            disabled={cartItems?.length == 0}
                            size="large"
                            variant="contained"
                            sx={{ ml: "auto" }}>
                            Place Order
                        </Button>
                    </CardActions>
                </Card>
            </Stack>
        </Container>
    );
}
