import React from "react";

import { Outlet } from "react-router-dom";

import {
    ThemeProvider, createTheme
} from "@mui/material";

import Header from "../components/Header.js";

const theme = createTheme({
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
        <ThemeProvider theme={theme}>
            <Header />
            <Outlet />
        </ThemeProvider>
    )
}