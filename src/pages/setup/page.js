import React, { useState } from "react";

import {
    Button, TextField, Backdrop, CircularProgress,
    Link, Paper, Box, Grid, Typography, Container
} from "@mui/material";

import { useSnackbar } from "notistack";

import { useNavigate, Link as RouterLink } from "react-router-dom";

import api from "../apiGlue.js";
import sampleData from "./sampleData.js";

const kUsersUrl = `${api.host}users/`;
const kProductsUrl = `${api.host}products/`;
const kAuthUrl = `${api.host}auth/`;
const kTargetRoute = "/";

export default function SignUp() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [backdropOpen, setBackdropOpen] = useState(false);

    api.blockSignedIn(navigate);

    const handleSubmit = async function(aEvent) {
        aEvent.preventDefault();
        setBackdropOpen(true);
        const formData = new FormData(aEvent.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        const userResult = await api.post(
            `${kUsersUrl}`,
            formJson,
            enqueueSnackbar,
            "Your account was successfully created.");

        if (!userResult) {
            return;
        }

        const userPromoteResult = await api.put(
            `${kUsersUrl}${userResult.data.id}`,
            {
                role: 1
            },
            enqueueSnackbar,
            "Your account was promoted to seller/merchant."
        );

        for (let i = 0; i < sampleData.length; i++) {
            const product = sampleData[i];
            const productResult = await api.post(
                `${kProductsUrl}`,
                product,
                enqueueSnackbar,
                `Product sample "${product.name}" was added.`
            );
        }

        const signInResult = await api.post(    
            `${kAuthUrl}sign-in`,
            {
                usernameOrEmail: formJson.username,
                password: formJson.password,
            },
            enqueueSnackbar,
        );

        if (signInResult) {
            navigate(kTargetRoute);
            return;
        }

        enqueueSnackbar("Failed to create and sign in to your account.");
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper
                variant="outlined"
                sx={{
                    my: 8,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                <img
                    alt="E-mbakan Logo"
                    src="/logos/logo_colored.svg"
                    width="64"
                    height="64"
                    style={{
                        marginBottom: 10,
                    }}/>
                <Typography component="h1" variant="h5">
                    First Run Setup
                </Typography>
                <Typography variant="body1">
                    This wizard should only be run once.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="email" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"/>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}>
                        Create merchant account and product data
                    </Button>
                </Box>
            </Paper>
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