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

import ManageProductsBase from "../base.js";

import productTypes from "../productTypes.js";

const kBaseUrl = "http://localhost:3001/products/";
const kParentRoute = "/manage/products";

// TODO: move to a utility function.
async function callApi(aUrl, aOptions, aEnqueue, aSuccessMessage) {
    const errorVariant = { variant: "error" };
    const successVariant = { variant: "success" };

    try {
        const response = await fetch(aUrl, aOptions)
        const jsonResponse = await response.json()
        
        if (response.ok) {
            if (aSuccessMessage) {
                aEnqueue(aSuccessMessage, successVariant);                        
            }
            return jsonResponse;
        } else if (jsonResponse?.data?.error) {
            aEnqueue(jsonResponse.data.error, errorVariant);
        } else {
            aEnqueue("Unknown API error.", errorVariant);
        }
    } catch (e) {
        aEnqueue(e.message, errorVariant);
    }
    return false;
}

async function doSubmit(aEvent, aSetters) {
    aEvent.preventDefault();

    const { enqueueSnackbar, navigate } = aSetters;
    const formData = new FormData(aEvent.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    const data = {
        name: formJson["in-name"],
        slug: formJson["in-slug"],
        type: productTypes.find((element) => element.label == formJson["in-type"]).value,
        description: formJson["in-description"]
    };
    const variantData = {
        name: formJson["in-variant-name"],
        price: formJson["in-variant-price"],
        stock: parseInt(formJson["in-variant-stock"])
    };

    const productResult = await callApi(`${kBaseUrl}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }, enqueueSnackbar, "Product was added successfully.");

    if (!productResult) {
        return;
    }

    const variantResult = await callApi(`${kBaseUrl}${productResult.data.id}/variants`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(variantData)
    }, enqueueSnackbar);

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
            <Stack
                component="form"
                spacing={2}
                onSubmit={(aEvent) => doSubmit(aEvent, setters)}>
                <ManageProductsBase hideFullInventory />
            </Stack>
        </Box>
    );
}
