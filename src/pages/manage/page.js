import React, { useState, useEffect } from "react";

import { Link as RouterLink } from "react-router-dom";

import {
    Container, Grid, colors,
    Typography, Card, CardContent, CardActionArea, CardHeader, Avatar,
    List, ListItem, ListItemText, Button, IconButton
} from "@mui/material";

import {
    People as PeopleIcon,
    BarChart as BarChartIcon,
    Dashboard as DashboardIcon,
    ReceiptLongOutlined as ReceiptLongOutlinedIcon
} from "@mui/icons-material";

import api from "../apiGlue.js";
import { getFriendlyRoleName } from "../staticTypes.js";

const kBaseUrl = `${api.host}users/`;

export default function Account() {
    const [user, setUser] = useState(null);

    useEffect(function() {
        api.identify().then(function(aResult) {
            if (!aResult.data) {
                return;
            }
            setUser(aResult.data);
        });
    }, []);

    const basicData = [
        {
            label: "First Name",
            data: user?.firstName,
            formName: "user-first-name",
            formCondition: true
        },
        {
            label: "Middle Name",
            data: user?.middleName,
            formName: "user-middle-name",
            formCondition: true
        },
        {
            label: "Last Name",
            data: user?.lastName,
            formName: "user-last-name",
            formCondition: true
        },
        {
            label: "Role",
            data: getFriendlyRoleName(user?.role),
            formCondition: user?.role == 2,
            formHandler: null
        },
    ];

    const contactData = [
        {
            label: "Username",
            data: user?.username,
            formCondition: user?.role == 2,
            formName: "user-username"
        },
        {
            label: "Email",
            data: user?.email,
            formCondition: true,
            formName: "user-email"
        },
        {
            label: "Address",
            data: user?.address,
            formCondition: true,
            formIsMulti: true,
            formName: "user-address"
        }
    ];

    const handleListItemMap = function(aItem, aIndex) {
        return (
            <ListItem disableGutters key={aIndex}>
                <ListItemText primary={aItem.label} primaryTypographyProps={{ variant: "subtitle2", sx: { whiteSpace: "pre-wrap" } }} />
                {aItem.data}
                {
                    aItem.formCondition ? (
                        <IconButton sx={{ ml: 1 }} size="small">
                            <EditIcon fontSize="small" />
                        </IconButton>
                    ) : (
                        <></>
                    )
                }
            </ListItem>
        )
    };

    return (
        <Container sx={{ py: 3 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Hi, {user?.firstName} {user?.lastName}!
            </Typography>
            <Typography>
                Navigate your e-commerce site with ease - a centralized dashboard for product, sales, order fulfillment, and account management.
            </Typography>
            <Grid container spacing={2} direction={{ xs: "column", md: "row" }} sx={{ my: 2 }}>
                <Grid item xs={6}>
                    <Card variant="outlined">
                        <CardActionArea component={RouterLink} to="products">
                            <CardHeader
                                avatar={
                                    <Avatar
                                        sx={{ bgcolor: colors.blue[800] }}
                                        aria-label="status-icon">
                                        <DashboardIcon />
                                    </Avatar>
                                }
                                title="Products"
                                titleTypographyProps={{ "variant": "h6" }}
                                subheader="See what's in stock, add new items, and keep your inventory flowing." />
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card variant="outlined">
                        <CardActionArea component={RouterLink} to="sales">
                            <CardHeader
                                avatar={
                                    <Avatar
                                        sx={{ bgcolor: colors.red[800] }}
                                        aria-label="status-icon">
                                        <BarChartIcon />
                                    </Avatar>
                                }
                                title="Sales"
                                titleTypographyProps={{ "variant": "h6" }}
                                subheader="View a summary of transactions: weekly, monthly and annual sales." />
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card variant="outlined">
                        <CardActionArea component={RouterLink} to="orders">
                            <CardHeader
                                avatar={
                                    <Avatar
                                        sx={{ bgcolor: colors.green[800] }}
                                        aria-label="status-icon">
                                        <ReceiptLongOutlinedIcon />
                                    </Avatar>
                                }
                                title="Order Fulfillment"
                                titleTypographyProps={{ "variant": "h6" }}
                                subheader="Approve orders, pick and pack, and get products to your customers." />
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card variant="outlined">
                        <CardActionArea component={RouterLink} to="accounts">
                            <CardHeader
                                avatar={
                                    <Avatar
                                        sx={{ bgcolor: colors.yellow[800] }}
                                        aria-label="status-icon">
                                        <PeopleIcon />
                                    </Avatar>
                                }
                                title="Accounts"
                                titleTypographyProps={{ "variant": "h6" }}
                                subheader="View a list of all your customers and their information." />
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
