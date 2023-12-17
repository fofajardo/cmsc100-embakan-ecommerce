import { useState } from "react";

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
    ReceiptLongOutlined as ReceiptLongOutlinedIcon
} from "@mui/icons-material";

export default function Header() {
    const location = useLocation();

    const [drawerOpen, setDrawerOpen] = useState(false);

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

    const drawerLinks = [
        {
            icon: <AccountCircleOutlinedIcon />,
            to: "/account",
            label: "Account"
        },
        {
            icon: <ReceiptLongOutlinedIcon />,
            to: "/orders",
            label: "Orders"
        },
        {
            icon: <LoginOutlinedIcon />,
            to: "/sign-in",
            label: "Sign In"
        },
        {
            icon: <LogoutOutlinedIcon />,
            to: "/sign-out",
            label: "Sign Out"
        },
        {
            divider: true
        },
        ...productLinks,
    ];

    const drawerList = drawerLinks.map(function(aLink, aIndex) {
        if (aLink.divider) {
            return(<Divider/>)
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
                    sx={{ display: { xs: "flex", sm: "none" } }}
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
                <Stack spacing={2} direction="row" sx={{ display: { xs: "none", sm: "flex" } }}>
                    {
                        productLinks.map(function(aLink, aIndex) {
                            return (
                                <Button
                                    key={aIndex}
                                    color="inherit"
                                    startIcon={aLink.icon}
                                    component={RouterLink}
                                    to={aLink.to}>
                                    {aLink.label}
                                </Button>
                            )
                        })
                    }
                </Stack>
                <Stack spacing={2} direction="row">
                    <IconButton
                        component={RouterLink}
                        to="/cart"
                        color="inherit"
                        aria-label="view shopping cart">
                        <ShoppingCartOutlinedIcon />
                    </IconButton>
                    <IconButton
                        component={RouterLink}
                        to="/account"
                        color="inherit"
                        aria-label="view account info"
                        sx={{ display: { xs: "none", sm: "flex" } }}>
                        <AccountCircleOutlinedIcon />
                    </IconButton>
                </Stack>
            </Toolbar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}>
                <Box
                    sx={{ width: 250 }}
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