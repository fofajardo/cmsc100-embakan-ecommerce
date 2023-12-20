import { useEffect } from "react";

import {
    Avatar, Button, CssBaseline, TextField, FormControlLabel,
    Checkbox, Link, Paper, Box, Grid, Typography, Container,
    CircularProgress, Stack
} from "@mui/material";

import { useSnackbar } from "notistack";

import { useNavigate, Link as RouterLink } from "react-router-dom";

import api from "../apiGlue.js";

const kBaseUrl = `${api.kHost}users/`;
const kAuthUrl = `${api.kHost}auth/`;
const kTargetRoute = "/sign-in";

export default function SignOut() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(function() {
        api.get(`${kAuthUrl}sign-out`);
        navigate(kTargetRoute);
    }, []);

    return (
        <Container>
            <Stack
                direction="row"
                sx={{
                    alignItems: "center",
                    mt: 2
                }}
                spacing={1}>
                <CircularProgress />
                <Typography>
                    Signing out…
                </Typography>
            </Stack>
        </Container>
    );
}