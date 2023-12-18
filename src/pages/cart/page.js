import * as React from 'react';
import { useState, useEffect } from 'react';

import { Outlet, useNavigate, Link as RouterLink } from "react-router-dom";

import {
    Card, CardContent, CardActions,
    Divider, Button, Typography,
    List, ListItem, ListItemText,
    Grid, IconButton, Container
} from '@mui/material';

import {
  Add as AddIcon ,
  Remove as RemoveIcon ,

} from "@mui/icons-material";

import api from "../apiGlue.js";

const kBaseUrl = "http://localhost:3001/products/";

const kCurrencyFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
});

function CartListItem(aProps) {
    const { data, update, setUpdate } = aProps;
    const [product, setProduct] = useState("");
    const [variant, setVariant] = useState();
    const [quantity, setQuantity] = useState(1);

    useEffect(function() {
        api.get(`${kBaseUrl}/${data.productId}`).then(function(aProduct) {
            setProduct(aProduct.data);
        });

        api.get(`${kBaseUrl}/${data.productId}/variants/${data.variantId}`).then(function(aVariant) {
            setVariant(aVariant.data);
        });
    }, [data]);

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleRemove = function() {
        setQuantity(0);
        api.handleCart(product.id, variant.id, 0).then(function() {
            setUpdate(update + 1);
        });
    }

    return (
        <ListItem divider>
            <ListItemText
                primary={product?.name}
                secondary={variant?.name}
            />
            <Typography variant="body2">
                {kCurrencyFormatter.format(variant?.price * data?.quantity)}
                <IconButton size="small" aria-label="add" onClick={increaseQuantity}>
                    <AddIcon />
                </IconButton>
                <IconButton size="small" aria-label="minus" onClick={decreaseQuantity}>
                    <RemoveIcon />
                </IconButton>
                <Button size="small" onClick={handleRemove}>Remove</Button>
            </Typography>
        </ListItem>
    )
}

export default function Cart() {
    const [cartItems, setCartItems] = useState();
    const [totalPrice, setTotalPrice] = useState(0);
    const [update, setUpdate] = useState(0);

    useEffect(function() {
        api.findCart().then(function(aCart) {
            setCartItems(aCart?.data?.items);

            setTotalPrice(0);
            var price = 0;
            aCart?.data?.items.forEach(function(aItem, aIndex) {
                api.get(`${kBaseUrl}/${aItem.productId}/variants/${aItem.variantId}`)
                .then(function(aVariant) {
                    price += aVariant?.data?.price * aItem.quantity;
                    setTotalPrice(kCurrencyFormatter.format(price));
                });
            });
        });
    }, [update]);

    return (
        <Container>
            <Card variant="outlined" sx={{ my: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                    Shopping Cart
                    </Typography>
                    <Divider />
                    <List>
                        {cartItems?.map((item, index) => (
                            <CartListItem key={index} data={item} update={update} setUpdate={setUpdate} />
                        ))}
                    </List>
                    <Typography variant="h6">
                    Total: { totalPrice }
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        component={RouterLink}
                        to={`/cart/checkout`}
                        type="button"
                        disabled={cartItems?.length == 0}
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
                        Checkout
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
}
