import React, { useState, useEffect } from "react";

import { Link as RouterLink } from "react-router-dom";

import {
    Box, AppBar, Toolbar, IconButton, Typography,
    Stack, Link,
    Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Divider
} from "@mui/material";

import {
    Menu as MenuIcon,
    ShoppingCartOutlined as ShoppingCartOutlinedIcon,
    AccountCircleOutlined as AccountCircleOutlinedIcon,
    StoreOutlined as StoreOutlinedIcon,
    EggAltOutlined as EggAltOutlinedIcon,
    GrassOutlined as GrassOutlinedIcon,
    /* Search as SearchIcon, */
    LogoutOutlined as LogoutOutlinedIcon,
    ReceiptLongOutlined as ReceiptLongOutlinedIcon,
    LocalShippingOutlined as LocalShippingOutlinedIcon,

    People as PeopleIcon,
    BarChart as BarChartIcon,
    Dashboard as DashboardIcon,
} from "@mui/icons-material";

import api from "./apiGlue.js";

export default function Header() {
    const [user, setUser] = useState();
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(function() {
        api.identify().then(function(aUser) {
            setUser(aUser.data);
        });
    }, []);

    var drawerLinks = [
        {
            icon: <AccountCircleOutlinedIcon />,
            to: "/account",
            label: `${user?.firstName} ${user?.lastName}`,
        },
        {
            icon: <LocalShippingOutlinedIcon />,
            to: "/account/orders",
            label: "Order History",
            role: 0,
            isExclusive: true
        },
        {
            icon: <LogoutOutlinedIcon />,
            to: "/sign-out",
            label: "Sign Out"
        },
        {
            divider: true,
            role: 0,
            isExclusive: true
        },
        {
            title: "Products",
            role: 0,
            isExclusive: true
        },
        {
            icon: <StoreOutlinedIcon/>,
            to: "/products",
            label: "All",
            role: 0,
            isExclusive: true
        },
        {
            icon: <GrassOutlinedIcon/>,
            to: "/crops",
            label: "Crops",
            role: 0,
            isExclusive: true
        },
        {
            icon: <EggAltOutlinedIcon/>,
            to: "/poultry",
            label: "Poultry",
            role: 0,
            isExclusive: true
        },
        {
            divider: true,
            role: 1
        },
        {
            title: "Merchant",
            role: 1
        },
        {
            icon: <DashboardIcon />,
            to: "/manage/products",
            label: "Products",
            role: 1
        },
        {
            icon: <BarChartIcon />,
            to: "/manage/sales",
            label: "Sales",
            role: 1
        },
        {
            icon: <ReceiptLongOutlinedIcon />,
            to: "/manage/orders",
            label: "Order Fulfillment",
            role: 1
        },
        {
            icon: <PeopleIcon />,
            to: "/manage/accounts",
            label: "Accounts",
            role: 1
        }
    ];

    const drawerList = drawerLinks.map(function(aLink, aIndex) {
        if (aLink.role != null) {
            if (user?.role < aLink.role) {
                return;
            }
            if (aLink.isExclusive && user?.role != aLink.role) {
                return;
            }
        }
        if (aLink.divider) {
            return (<Divider key={aIndex}/>);
        }
        if (aLink.title) {
            return (
                <ListItem key={aIndex}>
                    <Typography
                        sx={{
                            fontWeight: "500",
                            mt: 0.5,
                        }}>
                        {aLink.title}
                    </Typography>
                </ListItem>
            );
        }
        return (
            <ListItem key={aIndex} disablePadding>
                <ListItemButton component={RouterLink} to={aLink.to}>
                    <ListItemIcon>
                        {aLink.icon}
                    </ListItemIcon>
                    <ListItemText primary={aLink.label} />
                </ListItemButton>
            </ListItem>
        );
    });

    const toggleDrawer = function(aEvent) {
        if (aEvent.type === "keydown" &&
            (aEvent.key === "Tab" || aEvent.key === "Shift")) {
            return;
        }

        setDrawerOpen(!drawerOpen);
    };

    return (
        <AppBar position="sticky" elevation={0}>
            <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <IconButton
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer}>
                    <MenuIcon />
                </IconButton>
                <Link component={RouterLink} to="/" underline="none" color="inherit">
                    <Stack spacing={1.5} direction="row">
                        <img
                            alt="E-mbakan Logo"
                            height={32}
                            width={32}
                            src="logos/logo_colored.svg" />
                        <Typography variant="h6">
                            e-mbakan
                        </Typography>                            
                    </Stack>
                </Link>
                <Stack spacing={2} direction="row">
                    <IconButton
                        component={RouterLink}
                        to="/cart"
                        color="inherit"
                        aria-label="view shopping cart"
                        sx={{
                            visibility: user?.role == 0
                                ? "visible"
                                : "hidden"
                        }}>
                        <ShoppingCartOutlinedIcon />
                    </IconButton>
                </Stack>
            </Toolbar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}>
                <Box
                    sx={{
                        width: 250,
                        overflowX: "hidden",
                    }}
                    role="presentation"
                    onClick={toggleDrawer}
                    onKeyDown={toggleDrawer}>
                    <List>
                        {drawerList}
                    </List>
                </Box>
            </Drawer>
        </AppBar>
    );
}