import React from "react";

import { Outlet } from "react-router-dom";

import {
    Box, ThemeProvider, createTheme
} from "@mui/material";

import { SnackbarProvider } from "notistack";

import Header from "../components/Header.js";

const theme = createTheme({
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    borderRadius: 0
                },
            },
        },
    },
    palette: {
        mode: "light",
        primary: {
            main: "#243516",
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
                <Box sx={{ background: "#fff8f4" }}>
                    <Header />
                    <Outlet />
                </Box>
            </ThemeProvider>
        </SnackbarProvider>
    )
}