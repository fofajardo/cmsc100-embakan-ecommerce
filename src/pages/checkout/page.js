import React, { useState, useEffect } from "react";

import { useSnackbar } from "notistack";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
    Stack, Card, CardContent, CardActions,
    Button, Typography, List, ListItem, ListItemText,
    Container, CircularProgress, Backdrop,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";

import api from "../apiGlue.js";

function CartListItem(aProps) {
    const { data, isHeader, isLast } = aProps;
    const [product, setProduct] = useState("");
    const [variant, setVariant] = useState();
    const [quantity, setQuantity] = useState(1);

    if (!isHeader) {
        useEffect(function() {
            if (!data) {
                return;
            }
            setProduct(data.product);
            setVariant(data.product.variants);
            setQuantity(data.quantity);
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
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

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
            const items = aCart?.data?.items;
            setCartItems(items);

            if (!items || items?.length == 0) {
                setTotalPrice(api.currency.format(0));
                return;
            }

            setTotalPrice(api.currency.format(aCart?.data?.totalPayment));
        });
    }, []);

    const handleCartItemsMap = function(item, index) {
        return (
            <CartListItem
                key={index}
                data={item}
                isLast={index == cartItems.length - 1} />
        );
    };

    const [promptOpen, setPromptOpen] = React.useState(false);
    const handlePromptClose = function() {
        setPromptOpen(false);
        navigate("/");
    };

    const [backdropOpen, setBackdropOpen] = useState(false);
    const handlePlaceOrder = function() {
        setBackdropOpen(true);
        api.placeOrder(enqueueSnackbar).then(function(aResult) {
            setBackdropOpen(false);
            if (aResult.status == "OK") {
                setPromptOpen(true);
                return;
            } 
        });
    };

    return (
        <Container>
            <Dialog
                open={promptOpen}
                onClose={handlePromptClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    Order Processed
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Your order has been processed and is awaiting confirmation from the seller/merchant.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePromptClose} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
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
                        <Typography component="p" sx={{ whiteSpace: "pre-wrap" }}>
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
                            {
                                cartItems?.length == 0 || !cartItems ? (
                                    <Typography>
                                    Your cart is empty.
                                    </Typography>
                                ) : (
                                    <>
                                        <CartListItem isHeader={true} />
                                        {cartItems?.map(handleCartItemsMap)}
                                    </>
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
                            onClick={handlePlaceOrder}
                            type="button"
                            disabled={cartItems?.length == 0 || !cartItems}
                            size="large"
                            variant="contained"
                            sx={{ ml: "auto" }}>
                            Place Order
                        </Button>
                    </CardActions>
                </Card>
            </Stack>
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: function(theme) {
                        return theme.zIndex.drawer + 1;
                    }
                }}
                open={backdropOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    );
}
