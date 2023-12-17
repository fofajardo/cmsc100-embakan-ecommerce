import React from "react";

import { Outlet } from "react-router-dom";

import {
    Box, ThemeProvider, createTheme
} from "@mui/material";

import { SnackbarProvider } from "notistack";

import Header from "../components/Header.js";

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

export default function Root() {
    return (
        <SnackbarProvider maxSnack={3}>
            <ThemeProvider theme={theme}>
                <Box>
                
                    <Header />
                    <Outlet />
                </Box>
            </ThemeProvider>
        </SnackbarProvider>
    )
}