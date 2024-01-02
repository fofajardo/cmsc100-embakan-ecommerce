import React, { useState, useEffect } from "react";

import { Link as RouterLink } from "react-router-dom";
import { useSnackbar } from "notistack";

import {
    Stack, AppBar, Toolbar,
    Card, CardContent,
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
    const { data, update, setUpdate, isLast } = aProps;
    const { enqueueSnackbar } = useSnackbar();
    const [product, setProduct] = useState("");
    const [variant, setVariant] = useState();
    const [quantity, setQuantity] = useState(1);

    useEffect(function() {
        if (!data) {
            return;
        }
        setProduct(data.product);
        setVariant(data.product.variants);
        setQuantity(data.quantity);
    }, [data]);

    const increaseQuantity = () => {
        api.handleCart(product.id, variant.id, 1, true, enqueueSnackbar).then(function() {
            setUpdate(update + 1);
            setQuantity(quantity + 1);
        });
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            api.handleCart(product.id, variant.id, quantity - 1, false, enqueueSnackbar).then(function() {
                setUpdate(update + 1);
                setQuantity(quantity - 1);
            });
        }
    };

    const handleRemove = function() {
        setQuantity(0);
        api.handleCart(product.id, variant.id, 0, false, enqueueSnackbar).then(function() {
            setUpdate(update + 1);
        });
    };

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
                primary={product?.name}
                secondary={variant?.name}
                sx={{
                    mb: isLast ? 0 : 0.75
                }}
            />
            <Typography variant="body2" align="left">
                {
                    (variant && data)
                        ? api.currency.format(variant?.price * data?.quantity)
                        : ""
                }
            </Typography>
            <Stack direction="row" sx={{
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center"
            }}>
                <IconButton size="small" aria-label="minus" onClick={decreaseQuantity}>
                    <RemoveIcon />
                </IconButton>
                <TextField
                    size="small"
                    value={quantity}
                    sx={{ px: 1, width: "30%" }}
                    onChange={function(aEvent) {
                        let value = parseInt(aEvent.target.value);
                        if (isNaN(value) || value <= 0) {
                            value = 1;
                            aEvent.target.value = 1;
                        }
                        if (value > variant?.stock) {
                            value = variant?.stock;
                            aEvent.target.value = variant?.stock;
                        }
                        api.handleCart(product.id, variant.id, value, enqueueSnackbar).then(function() {
                            setQuantity(value);
                            setUpdate(update + 1);
                        });
                    }}
                    type="number"
                    InputProps={{
                        inputProps: {
                            min: 1,
                            max: variant?.stock,
                            step:1
                        }
                    }}>
                </TextField>
                <IconButton size="small" aria-label="add" onClick={increaseQuantity}>
                    <AddIcon />
                </IconButton>
            </Stack>
            <Button size="small" variant="outlined" onClick={handleRemove}>Delete</Button>
        </ListItem>
    );
}

export default function Cart() {
    const [cartItems, setCartItems] = useState();
    const [totalPrice, setTotalPrice] = useState("");
    const [update, setUpdate] = useState(0);

    useEffect(function() {
        api.findCart().then(function(aCart) {
            const items = aCart?.data?.items;
            setCartItems(items);

            if (!items || items?.length == 0) {
                setTotalPrice(api.currency.format(0));
                return;
            }

            setTotalPrice(api.currency.format(aCart?.data?.totalPayment));
        });
    }, [update]);

    const handleCartItemsMap = function(item, index) {
        return (
            <CartListItem
                key={index}
                data={item}
                update={update}
                setUpdate={setUpdate}
                isLast={index == cartItems.length - 1} />
        );
    }

    return (
        <Container>
            <Card variant="outlined" sx={{ mt: 2, mb: 10 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                    Shopping Cart
                    </Typography>
                    <List sx={{ py: 0 }}>
                    {
                        cartItems?.length == 0 || !cartItems ? (
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
            <AppBar position="fixed" sx={{ top: "auto", bottom: 0 }} color="">
                <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">
                    Total: { totalPrice }
                    </Typography>
                    <Button
                        component={RouterLink}
                        to="/checkout"
                        type="button"
                        disabled={cartItems?.length == 0 || !cartItems}
                        variant="contained">
                        Checkout
                    </Button>
                </Toolbar>
            </AppBar>
        </Container>
    );
}
