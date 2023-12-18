import { useSnackbar } from "notistack";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
    Paper, Box, Stack, Grid, Card,
    Button, IconButton, Typography,
    Link, FormControl, FormLabel, TextField, Input,
    Autocomplete, Snackbar
} from "@mui/material";

import {
    ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

import { ManageProductsBase } from "../base.js";

import productTypes from "../../../productTypes.js";

import api from "../../../apiGlue.js";

const kBaseUrl = "http://localhost:3001/products/";
const kParentRoute = "/manage/products";

async function doSubmit(aEvent, aSetters) {
    aEvent.preventDefault();

    const { enqueueSnackbar, navigate } = aSetters;
    const formData = new FormData(aEvent.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    const data = {
        name: formJson["in-name"],
        slug: formJson["in-slug"],
        type: productTypes.find(function(element) {
            return element.value == formJson["in-type"]
        }).value,
        description: formJson["in-description"]
    };

    const variantData = {
        name: formJson["in-variant-name"],
        price: formJson["in-variant-price"],
        stock: parseInt(formJson["in-variant-stock"]),
        imageUrl: formJson["in-variant-image-url"],
    };

    const productResult = await api.post(
        `${kBaseUrl}`,
        data,
        enqueueSnackbar,
        "Product was added successfully.");

    if (!productResult) {
        return;
    }

    const variantResult = await api.post(
        `${kBaseUrl}${productResult.data.id}/variants`,
        variantData,
        enqueueSnackbar);

    if (variantResult) {
        navigate(kParentRoute);
        return;
    }
    
    enqueueSnackbar("Failed to update inventory.");
}

export default function ManageProductsCreate() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const setters = { enqueueSnackbar, navigate };

    return (
        <Box component="section" maxWidth="62.5rem" position="relative" margin="auto" sx={{ p: 2 }}>
            <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 3 }}>
                <IconButton component={RouterLink} to={kParentRoute} color="primary" aria-label="go back">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5">
                    Create Product
                </Typography>
            </Stack>
            <ManageProductsBase
                isCreateProduct
                onMainSubmit={(aEvent) => doSubmit(aEvent, setters)} />
        </Box>
    );
}
