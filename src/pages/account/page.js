import React, { useState, useEffect } from "react";
import {
    Container, Grid,
    Typography, Card, CardContent, CardActions,
    List, ListItem, ListItemText, Button, IconButton
} from "@mui/material";
import {
    Edit as EditIcon
} from "@mui/icons-material";
import api from "../apiGlue.js";

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
            data: api.getFriendlyRoleName(user?.role),
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
            <ListItem disableGutters>
                <ListItemText primary={aItem.label} primaryTypographyProps={{ variant: "subtitle2" }} />
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
                My Account
            </Typography>
            <Typography>
                Info about you and your preferences.
            </Typography>
            <Grid container spacing={2} direction={{ xs: "column", md: "row" }} sx={{ my: 2 }}>
                <Grid item xs>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                            Basic info
                            </Typography>
                            <Typography>
                            Some info may be visible to people you transact with.
                            </Typography>
                            <List>
                            { basicData.map(handleListItemMap) }
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                            Contact info
                            </Typography>
                            <List>
                            { contactData.map(handleListItemMap) }
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={2} direction={{ xs: "column", md: "row" }}>
                <Grid item xs>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                            Password
                            </Typography>
                            <Typography>
                            A secure password helps secure your E-mbakan account.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">
                                Change password
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                            Order History
                            </Typography>
                            <Typography>
                            Past purchases are conveniently organized in your order history.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">
                                View Past Orders
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
