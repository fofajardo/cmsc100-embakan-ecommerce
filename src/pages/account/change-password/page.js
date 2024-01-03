import React, { useState, useEffect } from "react";

import {
    Button, TextField, Stack,
    Link, Paper, Box, Grid, Typography, Container, IconButton
} from "@mui/material";

import {
    ArrowBack as ArrowBackIcon,
    HelpOutline as HelpOutlineIcon
} from "@mui/icons-material";

import { useSnackbar } from "notistack";

import { useNavigate, Link as RouterLink } from "react-router-dom";

import api from "../../apiGlue.js";

const kUsersUrl = `${api.host}users/`;
const kAuthUrl = `${api.host}auth/`;
const kParentRoute = "/account";

function HelpLink(aProps) {
    const { href, label, sx } = aProps;
    return (
        <Stack
            component={Link}
            href={href}
            target="blank"
            rel="noreferrer"
            underline="none"
            alignItems="center"
            direction="row"
            spacing={0.5}
            sx={{
                maxWidth: "fit-content",
                ...sx
            }}>
            <Typography>{label}</Typography>
            <HelpOutlineIcon fontSize="small" />
        </Stack>
    );
}

export default function ChangePassword() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(function() {
        api.identify().then(function(aResult) {
            if (!aResult.data) {
                return;
            }
            setUser(aResult.data);
        });
    }, []);

    const handleSubmit = async function(aEvent) {
        aEvent.preventDefault();

        const formData = new FormData(aEvent.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        if (formJson.password.trim() != formJson.passwordConfirm.trim()) {
            enqueueSnackbar("The passwords don't match!", { variant: "error" });
            return;
        }

        const changePasswordResult = await api.put(
            `${kUsersUrl}${user.id}`,
            {
                password: formJson.password.trim()
            },
            enqueueSnackbar,
            "Your password was changed successfully."
        );

        if (changePasswordResult.data) {
            await api.get(`${kAuthUrl}refresh`);
            navigate(kParentRoute);
            return;
        }

        enqueueSnackbar("Failed to change your password.");
    };

    return (
        <Container sx={{ py: 3}}>
            <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 3 }}>
                <IconButton component={RouterLink} to={kParentRoute} color="primary" aria-label="go back">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">
                    Password
                </Typography>
            </Stack>

            <Typography sx={{ mb: 1 }}>
                Choose a strong password and don&apos;t reuse it for other accounts.
            </Typography>
            <HelpLink href="https://support.google.com/accounts?p=pw_dont_reuse&hl=en" label="Learn more" sx={{ mb: 2 }} />
            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: {
                        xs: "auto",
                        md: "50%"
                    }
                }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="New password"
                                type="password"
                                id="password"
                                autoComplete="new-password"/>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Password strength: </strong>
                                <br/>
                            Use at least 8 characters. Don’t use a password from another site, or something too obvious like your pet’s name.
                                <HelpLink href="https://support.google.com/accounts?p=pw_signup&hl=en" label="Why?" />
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="passwordConfirm"
                                label="Confirm new password"
                                type="password"
                                id="password-confirm"
                                autoComplete="new-password"/>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3 }}>
                        Change Password
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}