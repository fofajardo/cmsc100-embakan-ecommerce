import { useState, useEffect } from "react";

import { useLocation, Link as RouterLink } from "react-router-dom";

import {
    Box, AppBar, Toolbar, Button, IconButton, Typography, ThemeProvider,
    Stack, createTheme, Link, OutlinedInput, InputAdornment, FormControl,
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
    Search as SearchIcon,
    LoginOutlined as LoginOutlinedIcon,
    LogoutOutlined as LogoutOutlinedIcon,
    ReceiptLongOutlined as ReceiptLongOutlinedIcon,

    ShoppingCart as ShoppingCartIcon,
    People as PeopleIcon,
    BarChart as BarChartIcon,
    Layers as LayersIcon,
    Assignment as AssignmentIcon,
    Dashboard as DashboardIcon,
} from "@mui/icons-material";

import api from "./apiGlue.js";

export default function Header() {
    const location = useLocation();

    const [user, setUser] = useState();
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(function() {
        api.identify().then(function(aUser) {
            setUser(aUser.data);
        });
    }, []);

    const productLinks = [
        {
            icon: <StoreOutlinedIcon/>,
            to: "/products",
            label: "All"
        },
        {
            icon: <GrassOutlinedIcon/>,
            to: "/crops",
            label: "Crops"
        },
        {
            icon: <EggAltOutlinedIcon/>,
            to: "/poultry",
            label: "Poultry"
        }
    ];

    var drawerLinks = [
    /*
        {
            icon: <AccountCircleOutlinedIcon />,
            to: "/account",
            label: "Account"
        },
    */
        {
            icon: <LogoutOutlinedIcon />,
            to: "/sign-out",
            label: "Sign Out"
        },
        {
            divider: true
        },
        { title: "Products" },
        ...productLinks,
    ];

    if (user?.role > 0) {
        drawerLinks = [
            ...drawerLinks,
            { divider: true },
            { title: "Merchant" },
            {
                icon: <DashboardIcon />,
                to: "/manage/products",
                label: "Products"
            },
            {
                icon: <BarChartIcon />,
                to: "/manage/sales",
                label: "Sales"
            },
            {
                icon: <ReceiptLongOutlinedIcon />,
                to: "/manage/orders",
                label: "Order Fulfillment"
            },
            {
                icon: <PeopleIcon />,
                to: "/manage/accounts",
                label: "Accounts"
            },
        ];
    }

    const drawerList = drawerLinks.map(function(aLink, aIndex) {
        if (aLink.divider) {
            return(<Divider/>)
        }
        if (aLink.title) {
            return(
                <ListItem key={aIndex}>
                    <Typography
                        sx={{
                            fontWeight: "500",
                            mt: 0.5,
                        }}>
                        {aLink.title}
                    </Typography>
                </ListItem>
            )
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
        )
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
                        aria-label="view shopping cart">
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
    )
}