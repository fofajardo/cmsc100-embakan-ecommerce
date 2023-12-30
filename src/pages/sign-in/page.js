import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
    Button, CssBaseline, TextField,
    Link, Paper, Box, Grid, Typography, Container
} from "@mui/material";

import { useSnackbar } from "notistack";

import api from "../apiGlue.js";

const kAuthUrl = `${api.kHost}auth/`;
const kTargetRoute = "/";

export default function SignIn() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    api.blockSignedIn(navigate);

    const handleSubmit = async function(aEvent) {
        aEvent.preventDefault();
        const formData = new FormData(aEvent.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        const signInResult = await api.post(    
            `${kAuthUrl}sign-in`,
            {
                usernameOrEmail: formJson.usernameOrEmail,
                password: formJson.password,
            },
            enqueueSnackbar,
        );

        if (signInResult) {
            navigate(kTargetRoute);
            return;
        }
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
                    Sign In
                </Typography>
                <Typography variant="body1">
                    Use your E-mbakan Account
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="usernameOrEmail"
                                label="Email Address or Username"
                                name="usernameOrEmail"
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
                        Sign In
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/sign-up" variant="body2">
                                No account yet? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}