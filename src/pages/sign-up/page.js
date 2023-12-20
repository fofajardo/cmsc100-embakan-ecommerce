import * as React from "react";

import {
    Avatar, Button, CssBaseline, TextField, FormControlLabel,
    Checkbox, Link, Paper, Box, Grid, Typography, Container
} from "@mui/material";

import { useSnackbar } from "notistack";

import { useNavigate, Link as RouterLink } from "react-router-dom";

import api from "../apiGlue.js";

const kBaseUrl = `${api.kHost}users/`;
const kAuthUrl = `${api.kHost}auth/`;
const kTargetRoute = "/";

export default function SignUp() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    api.blockSignedIn(navigate);

    const handleSubmit = async function(aEvent) {
        aEvent.preventDefault();
        const formData = new FormData(aEvent.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        const userResult = await api.post(
            `${kBaseUrl}`,
            formJson,
            enqueueSnackbar,
            "Your account was successfully created.");

        if (!userResult) {
            return;
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
            <CssBaseline />
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
        </Container>
    );
}