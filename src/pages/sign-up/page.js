import * as React from "react";

import {
    Avatar, Button, CssBaseline, TextField, FormControlLabel,
    Checkbox, Link, Paper, Box, Grid, Typography, Container
} from "@mui/material";

import { useSnackbar } from "notistack";

const kBaseUrl = "http://localhost:3001/users/";

import api from "../apiGlue.js";

//REFERENCE: mui.com documentations

export default function SignUp() {
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async function(aEvent) {
        aEvent.preventDefault();
        const formData = new FormData(aEvent.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);

        const userResult = await api.post(
            `${kBaseUrl}`,
            formJson,
            enqueueSnackbar,
            "Sign up test");

        if (userResult) {
            /*const signInResult = await api.post(    
                "http://localhost:3001/auth/sign-in",
                {
                    username: formJson.username,
                    password: formJson.password,
                },
                enqueueSnackbar,
                "test"
            );*/
            const bd = JSON.stringify({
                    username: formJson.username,
                    password: formJson.password,
                });
                console.log(bd);
            const signInResult = await fetch("http://localhost:3001/auth/sign-in",
            {
                method: "POST",
                body: bd,
            });

            console.log(signInResult);
            await api.get(
                "http://localhost:3001/auth/dump-session",
                enqueueSnackbar,
                ""
            );
            return;
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>

                <Typography component="h1" variant="h5">
                    Sign up
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
                            <Link href="#" variant="body2">
                                Sign in instead.
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}