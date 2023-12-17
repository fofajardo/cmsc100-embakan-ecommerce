import React from "react";

import { useLocation, useNavigate, Outlet } from "react-router-dom";

import {
    Box, ThemeProvider, createTheme
} from "@mui/material";

import { SnackbarProvider } from "notistack";

import Header from "./Header.js";
import api from "./apiGlue.js";

const theme = createTheme({
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderTopRightRadius: 24,
                    borderBottomRightRadius: 24
                },
            },
        },
    },
    palette: {
        mode: "light",
        primary: {
            main: "#517644",
        },
        secondary: {
            main: "#ffba4b",
        },
    },
});

const signRoutes = [
    "/sign-in",
    "/sign-up",
    "/sign-out"
];

export default function Root() {
    const location = useLocation();
    const navigate = useNavigate();
    const isSignPage = signRoutes.indexOf(location.pathname) >= 0;

    if (!isSignPage) {
        api.blockSignedOut(navigate);
    }

    return (
        <SnackbarProvider maxSnack={3}>
            <ThemeProvider theme={theme}>
                <Box>
                    {
                        isSignPage ? (
                            <></>
                        ) : (
                            <Header />
                        )
                    }
                    <Outlet />
                </Box>
            </ThemeProvider>
        </SnackbarProvider>
    )
}