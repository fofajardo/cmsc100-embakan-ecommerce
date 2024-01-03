import React, { useState } from "react";

import {
    Button, TextField, Backdrop, CircularProgress,
    Link, Paper, Box, Grid, Typography, Container,
    FormControlLabel, Checkbox
} from "@mui/material";

import { useSnackbar } from "notistack";

import { useNavigate, Link as RouterLink } from "react-router-dom";

import api from "../apiGlue.js";

const kUsersUrl = `${api.host}users/`;
const kAuthUrl = `${api.host}auth/`;
const kTargetRoute = "/";

export default function SignUp() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [backdropOpen, setBackdropOpen] = useState(false);
    const [userIsMerchant, setUserIsMerchant] = useState(false);

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
            setBackdropOpen(false);
            return;
        }

        if (userIsMerchant) {
            const userPromoteResult = await api.put(
                `${kUsersUrl}${userResult.data.id}`,
                {
                    role: 1
                },
                enqueueSnackbar,
                "Your account was promoted to seller/merchant."
            );
            
            if (!userPromoteResult) {
                setBackdropOpen(false);
                return;
            }
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
        setBackdropOpen(false);
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
                    Sign Up
                </Typography>
                <Typography variant="body1">
                    <em>E-mbakan: Palengke sa Palad ng Kamay Mo</em>
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
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox name="userIsMerchant" />
                                }
                                onChange={(aEvent) => setUserIsMerchant(aEvent.target.checked)}
                                label="I am signing up as a merchant." />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/sign-in" variant="body2">
                                Sign in instead.
                            </Link>
                        </Grid>
                    </Grid>
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