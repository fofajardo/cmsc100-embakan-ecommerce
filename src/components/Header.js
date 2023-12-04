import { Link as RouterLink } from "react-router-dom";

import {
    Box, AppBar, Toolbar, Button, IconButton, Typography, ThemeProvider,
    Stack, createTheme, Link, OutlinedInput, InputAdornment, FormControl
} from "@mui/material";

import {
    Menu as MenuIcon,
    ShoppingCartOutlined as ShoppingCartOutlinedIcon,
    AccountCircleOutlined as AccountCircleOutlinedIcon,
    Search as SearchIcon
} from "@mui/icons-material";

export default function Header() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="sticky" color="" elevation={1}>
                <Toolbar sx={{ justifyContent: "space-between", }}>
                    <Link component={RouterLink} to="/" underline="none">
                        <Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
                            <img src="/logo.svg" width={48} height={48} />
                            <Typography variant="h6" sx={{ ml: 3 }}>
                            e-mbakan
                            </Typography>
                        </Stack>
                    </Link>
                    <OutlinedInput
                        id="outlined-adornment-weight"
                        startAdornment={<SearchIcon sx={{ mr: 1 }} />}
                        placeholder="Search"
                        variant="filled"
                        sx={{ m: 1, width: "55ch" }}
                        inputProps={{
                            "aria-label": "search",
                        }}
                    />
                    <Stack spacing={2} direction="row">
                        {
                            /* the home and products page are the same... include? */
                            true ? (<></>) : (
                                <>
                                    <Button color="inherit" component={RouterLink} to="/">Home</Button>
                                    <Button color="inherit" component={RouterLink} to="/products">Products</Button>
                                </>
                            )
                        }
                        <IconButton component={RouterLink} to="/cart" color="primary" aria-label="view shopping cart">
                            <ShoppingCartOutlinedIcon />
                        </IconButton>
                        <IconButton component={RouterLink} to="/account" color="primary" aria-label="view account info">
                            <AccountCircleOutlinedIcon />
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>
        </Box>
    )
}