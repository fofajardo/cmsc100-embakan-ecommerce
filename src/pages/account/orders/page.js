import React, { useEffect, useState } from "react";

import { useSnackbar } from "notistack";
import { Link as RouterLink } from "react-router-dom";

import {
    Container, Typography, Grid, Stack, colors,
    IconButton,
    Card, CardContent, CardHeader, Avatar
} from "@mui/material";

import {
    HourglassEmpty as HourglassEmptyIcon,
    Check as CheckIcon,
    NotInterested as NotInterestedIcon,
    Place as PlaceIcon,
    List as ListIcon,
    ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

import api from "../../apiGlue.js";

const kBaseUrl = `${api.host}orders/`;
const kParentRoute = "/account";

export default function CustomerOrders() {
    const { enqueueSnackbar } = useSnackbar();

    const [orders, setOrders] = useState([]);

    useEffect(function() {
        api.get(
            `${kBaseUrl}?isExclusive=1`,
            enqueueSnackbar)
            .then(function(aResponse) {
                setOrders(aResponse.data);
            });
    }, []);

    const handleOrdersChild = function(aOrder) {
        const { id, product, quantity, price, status } = aOrder;
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
                                <Typography>{product.name} - {product.variants.name}</Typography>
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
                </Card>
            </Grid>
        );
    };

    const handleOrdersGroup = function(aGroup, aIndex, aGroups) {
        const { user, date, totalPayment, children } = aGroup;

        return (
            <Card key={aIndex} variant="outlined">
                <CardContent>
                    <Stack spacing={2} useFlexGap>
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
        );
    };

    return (
        <Container sx={{ py: 3 }}>
            <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 3 }}>
                <IconButton component={RouterLink} to={kParentRoute} color="primary" aria-label="go back">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">
                    Order History
                </Typography>
            </Stack>
            <Stack spacing={2} useFlexGap>
                {
                    orders?.length > 0
                        ? orders?.map(handleOrdersGroup)
                        : <Typography>You haven&apos;t ordered anything yet.</Typography>
                }
            </Stack>
        </Container>
    );
}
