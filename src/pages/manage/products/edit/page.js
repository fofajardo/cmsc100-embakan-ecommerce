import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";

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

async function doSubmit(aEvent, aSetters) {
    aEvent.preventDefault();

    const { enqueueSnackbar, navigate, id } = aSetters;
    const formData = new FormData(aEvent.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    const data = {
        name: formJson["in-name"],
        slug: formJson["in-slug"],
        type: productTypes.find((element) => element.label == formJson["in-type"]).value,
        description: formJson["in-description"]
    };
    const jsonData = JSON.stringify(data);

    const errorVariant = { variant: "error" };
    const successVariant = { variant: "success" };

    try {
        const response = await fetch(`${kBaseUrl}${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: jsonData
            }
        ).then(function(aResponse) {
            if (!aResponse.ok) {
                aResponse.json().then(function(aJson) {
                    if (aJson?.data?.error) {
                        enqueueSnackbar(aJson.data.error, errorVariant);
                        return;
                    }
                    enqueueSnackbar("API error.", errorVariant);
                });
            } else {
                aResponse.json().then(function(aJson) {
                    enqueueSnackbar("Product edited successfully.", successVariant);
                    navigate(kParentRoute);
                });
            }
        });
    } catch (e) {
        enqueueSnackbar(e.message, errorVariant);
    }
}

export default function ManageProductsEdit() {
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useParams();
    const navigate = useNavigate();

    const setters = { enqueueSnackbar, navigate, id };
    const [productData, setProductData] = useState([]);

    useEffect(function() {
        console.log(id);
        fetch(`${kBaseUrl}${id}`,
            {
                method: "GET",
            }
        ).then(response => response.json()
        ).then(body => { setProductData(body.data); console.log(body); });
    }, []);

    return (
        <Box component="section" maxWidth="62.5rem" position="relative" margin="auto" sx={{ p: 2 }}>
            <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 3 }}>
                <IconButton component={RouterLink} to={kParentRoute} color="primary" aria-label="go back">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5">
                    Edit Product
                </Typography>
            </Stack>
            <Stack
                component="form"
                spacing={2}
                onSubmit={(aEvent) => doSubmit(aEvent, setters)}>
                <ManageProductsBase data={productData} />
            </Stack>
        </Box>
    );
}
