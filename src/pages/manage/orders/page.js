import React, { useEffect, useState } from "react";

import { useSnackbar } from "notistack";

import {
    Container, Typography, Box, Grid, Stack, colors,
    Button,
    Card, CardActions, CardContent, CardHeader, Avatar
} from "@mui/material";

import {
    HourglassEmpty as HourglassEmptyIcon,
    Check as CheckIcon,
    NotInterested as NotInterestedIcon,
    Place as PlaceIcon,
    List as ListIcon
} from "@mui/icons-material";

import api from "../../apiGlue.js";

const kBaseUrl = `${api.host}orders/`;

export default function ManageOrders() {
    const { enqueueSnackbar } = useSnackbar();

    const [orders, setOrders] = useState([]);
    const [update, setUpdate] = useState(0);

    useEffect(function() {
        api.get(kBaseUrl, enqueueSnackbar).then(function(aResponse) {
            console.log(aResponse.data);
            setOrders(aResponse.data);
        });
    }, [update]);

    const handleOrdersChild = function(aOrder, aIndex) {
        const { id, product, quantity, price, status } = aOrder;
        const variant = product.variants.find(function(aElement) {
            return (aElement.id == aOrder.variantId);
        });
        var statusInfo = {};

        switch (status) {
            default:
            case 0:
                statusInfo.color = colors.yellow[800];
                statusInfo.icon = <HourglassEmptyIcon />;
                statusInfo.label = "Pending";
                break;
            case 1:
                statusInfo.color = colors.green[800];
                statusInfo.icon = <CheckIcon />;
                statusInfo.label = "Confirmed";
                break;
            case 2:
                statusInfo.color = colors.red[800];
                statusInfo.icon = <NotInterestedIcon />;
                statusInfo.label = "Cancelled";
                break;
        }

        const handleCancel = function() {
            const data = {
                status: 2,
            };
            api.put(
                `${kBaseUrl}${id}`,
                data,
                enqueueSnackbar,
                "Suborder was canceled.");
            setUpdate(update + 1);
        }

        const handleConfirm = function() {
            const data = {
                status: 1,
            };
            api.put(
                `${kBaseUrl}${id}`,
                data,
                enqueueSnackbar,
                "Suborder was confirmed.");
            setUpdate(update + 1);
        }

        return (
            <Grid key={id} item xs={18} md={4}>
                <Card variant="outlined">
                    <CardHeader
                        avatar={
                            <Avatar
                                sx={{ bgcolor: statusInfo.color }}
                                aria-label="status-icon">
                                {statusInfo.icon}
                            </Avatar>
                        }
                        title={`${statusInfo.label} suborder`}
                        titleTypographyProps={{ "variant": "h6" }} />
                    <CardContent>
                        <Grid container spacing={1} direction="column">
                            <Grid item>
                                <Typography variant="subtitle2">Product Unit</Typography>
                                <Typography>{product.name} - {variant?.name}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle2">Quantity</Typography>
                                <Typography>{quantity}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle2">Price at Checkout</Typography>
                                <Typography>{api.currency.format(price)}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                    {status === 0 && (
                        <>
                            <Button onClick={handleConfirm} variant="contained" color="primary">
                            Confirm
                            </Button>
                            <Button onClick={handleCancel} variant="outlined" color="primary">
                            Cancel
                            </Button>
                        </>
                    )}
                    </CardActions>
                </Card>
            </Grid>
        )
    };

    const handleOrdersGroup = function(aGroup, aIndex, aGroups) {
        const { user, date, totalPayment, children } = aGroup;

        return (
            <Card variant="outlined">
                <CardContent>
                    <Stack key={aIndex} spacing={2} useFlexGap>
                        <Typography variant="h5">Order #{aGroups.length - aIndex}: {new Date(date).toLocaleString()}</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={18} md={4}>
                                <Card variant="outlined">
                                    <CardHeader
                                        avatar={
                                            <Avatar
                                                sx={{ bgcolor: colors.blue[800] }}
                                                aria-label="status-icon">
                                                <ListIcon />
                                            </Avatar>
                                        }
                                        title="Details"
                                        titleTypographyProps={{ "variant": "h6" }} />
                                    <CardContent>
                                        <Grid container spacing={1} direction="column">
                                            <Grid item>
                                                <Typography variant="subtitle2">Total Payment</Typography>
                                                <Typography>{api.currency.format(totalPayment)}</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2">Total Suborders</Typography>
                                                <Typography>{children.length}</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={18} md={8}>
                                <Card variant="outlined">
                                    <CardHeader
                                        avatar={
                                            <Avatar
                                                sx={{ bgcolor: colors.blue[800] }}
                                                aria-label="status-icon">
                                                <PlaceIcon />
                                            </Avatar>
                                        }
                                        title="Delivery Address"
                                        titleTypographyProps={{ "variant": "h6" }} />
                                    <CardContent>
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
                                </Card>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            {children?.map(handleOrdersChild)}
                        </Grid>
                    </Stack>
                </CardContent>
            </Card>
        )
    };

    return (
        <Container sx={{ py: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Order Fulfillment</Typography>
            <Stack spacing={2} useFlexGap>
                {orders?.map(handleOrdersGroup)}
            </Stack>
        </Container>
    );
}
