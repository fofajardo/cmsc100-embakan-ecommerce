import React, { useEffect } from "react";

import {
    Container, Stack, CircularProgress, Typography
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import api from "../apiGlue.js";

const kAuthUrl = `${api.host}auth/`;
const kTargetRoute = "/sign-in";

export default function SignOut() {
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