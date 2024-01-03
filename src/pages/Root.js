import React, { useState, useEffect } from "react";

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
    "/sign-out",
    "/setup"
];

const userRoutes = [
    "/cart",
    "/checkout",
    "/products",
    "/crops",
    "/poultry"
];

export default function Root() {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname.toLowerCase();
    const isSignPage = signRoutes.indexOf(path) >= 0;

    const [authed, setAuthed] = useState(false);

    useEffect(function() {
        if (isSignPage) {
            setAuthed(true);
            return;
        }

        api.blockSignedOut(navigate).then(function(aResult) {
            if (aResult) {
                return;
            }
            api.blockUserRoute(navigate, path, userRoutes).then(function(aResult) {
                if (aResult) {
                    return;
                }
                setAuthed(true);
            });
        });
    }, [path]);

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
                    {
                        authed ? (
                            <Outlet />
                        ) : (
                            null
                        )
                    }
                </Box>
            </ThemeProvider>
        </SnackbarProvider>
    );
}