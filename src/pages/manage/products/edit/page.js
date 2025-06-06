import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";

import {
    Container, Stack, IconButton, Typography
} from "@mui/material";

import {
    ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

import { ManageProductsBase, ACTIONS } from "../base.js";

import api from "../../../apiGlue.js";

const kBaseUrl = `${api.host}products/`;
const kParentRoute = "/manage/products";

async function handleMainSubmit(aEvent, aSetters) {
    aEvent.preventDefault();

    const { enqueueSnackbar, navigate, id } = aSetters;
    const formData = new FormData(aEvent.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    const data = {
        name: formJson["in-name"],
        slug: formJson["in-slug"],
        type: formJson["in-type"],
        description: formJson["in-description"]
    };

    const productResult = await api.put(
        `${kBaseUrl}${id}`,
        data,
        enqueueSnackbar,
        "Product was edited successfully.");

    if (productResult) {
        navigate(kParentRoute);        
    }
}

async function handleDialogSubmit(aEvent, aSetters) {
    aEvent.preventDefault();

    const { enqueueSnackbar, id, setProductData } = aSetters;
    const formData = new FormData(aEvent.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    const data = {
        id: formJson["in-variant-id"],
        name: formJson["in-variant-name"],
        price: formJson["in-variant-price"],
        stock: formJson["in-variant-stock"],
        imageUrl: formJson["in-variant-image-url"],
    };

    var result = null;
    switch (parseInt(formJson["in-action"])) {
    case ACTIONS.ADD:
        result = await api.post(
            `${kBaseUrl}${id}/variants`,
            data,
            enqueueSnackbar,
            "Product unit was added successfully."
        );
        break;
    case ACTIONS.EDIT:
        result = await api.put(
            `${kBaseUrl}${id}/variants/${data.id}`,
            data,
            enqueueSnackbar,
            "Product unit was edited successfully."
        );
        break;
    case ACTIONS.DELETE:
        result = await api.del(
            `${kBaseUrl}${id}/variants/${data.id}`,
            null,
            enqueueSnackbar,
            "Product unit was deleted successfully."
        );
        break;
    }

    if (result) {
        setProductData(result.data);
    }
    
    return true;
}

export default function ManageProductsEdit() {
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useParams();
    const navigate = useNavigate();
    const [productData, setProductData] = useState();

    const setters = { enqueueSnackbar, navigate, id, setProductData };

    useEffect(function() {
        fetch(`${kBaseUrl}${id}`,
            {
                method: "GET",
            }
        ).then(response => response.json()
        ).then(body => { setProductData(body.data); });
    }, []);

    return (
        <Container sx={{ py: 3 }}>
            <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 3 }}>
                <IconButton component={RouterLink} to={kParentRoute} color="primary" aria-label="go back">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">
                    Edit Product
                </Typography>
            </Stack>
            <ManageProductsBase
                product={productData}
                onMainSubmit={(aEvent) => handleMainSubmit(aEvent, setters)}
                onDialogSubmit={(aEvent) => handleDialogSubmit(aEvent, setters)} />
        </Container>
    );
}
