import { Fragment, useState, useEffect } from "react";

import {
    Paper, Box, Stack, Grid, Card,
    Button, IconButton, Typography,
    FormControl, FormLabel, TextField, Input,
    Autocomplete, Divider,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";

import {
    Edit as EditIcon,
    Delete as DeleteIcon
} from "@mui/icons-material";

import productTypes from "./productTypes.js";

function ProductInventoryFormControl(aProps) {
    const { readOnly, index, data } = aProps;

    const [name, setName] = useState("Default");
    const [price, setPrice] = useState();
    const [stock, setStock] = useState();

    useEffect(function() {
        if (!data) {
            return;
        }
        setName(data.name);
        setPrice(data.price);
        setStock(data.stock);
    }, [data]);

    return (
        <Stack
            container
            gap={2}
            direction={{ sm: "column", md: "row" }}>
            <TextField
                label="Variant/Unit Name"
                name="in-variant-name"
                value={name}
                disabled={readOnly}
                onChange={function(event) {
                    setName(event.target.value);
                }}
                required
                fullWidth />
            <TextField
                label="Price"
                name="in-variant-price"
                value={price}
                type="number"
                disabled={readOnly}
                onChange={function(event) {
                    setPrice(event.target.value);
                }}
                required
                fullWidth />
            <TextField
                label="Stock"
                name="in-variant-stock"
                value={stock}
                type="number"
                disabled={readOnly}
                onChange={function(event) {
                    setStock(event.target.value);
                }}
                min={0}
                required
                fullWidth />
        </Stack>
    )
}

function ProductInventoryDisplayCard(aProps) {
    const { readOnly, index, data } = aProps;

    const [name, setName] = useState("Default");
    const [price, setPrice] = useState();
    const [stock, setStock] = useState();

    useEffect(function() {
        if (!data) {
            return;
        }
        setName(data.name);
        setPrice(data.price);
        setStock(data.stock);
    }, [data]);

    return (
        <Stack
            gap={2}
            direction={{ sm: "column", md: "row" }}>
            <FormControl fullWidth>
                <FormLabel>Variant/Unit Name</FormLabel>
                {name}
            </FormControl>
            <FormControl fullWidth>
                <FormLabel>Price</FormLabel>
                {price}
            </FormControl>
            <FormControl fullWidth>
                <FormLabel>Stock</FormLabel>
                {stock}
            </FormControl>
            <Stack
                gap={1}
                direction={{ sm: "column", md: "row" }}>
            <Button
                variant="outlined"
                startIcon={<EditIcon />}>
                Edit
            </Button>
            <Button
                variant="outlined"
                startIcon={<DeleteIcon />}>
                Delete
            </Button>
            </Stack>
        </Stack>
    )
}

function ProductInventoryListCard(aProps) {
    const { getter, hideFullInventory, readOnly } = aProps;

    return (
        <Card sx={{ p: 3 }} elevation={0}>
            <Typography variant="h6" sx={{ mb: 2 }}>Inventory</Typography>
            <Stack
                spacing={2}>
                {
                    hideFullInventory ? (
                        <Fragment>
                            <ProductInventoryFormControl
                                index={0}
                                {...aProps} />
                            <FormLabel>
                            You may add additional units/variants once the initial product is created.
                            </FormLabel>
                        </Fragment>
                    ) : (
                        getter?.map(function(aVariant, aIndex) {
                            let elements = [];
                            elements.push(
                                <ProductInventoryDisplayCard
                                    key={aIndex}
                                    index={aIndex}
                                    data={aVariant}
                                    {...aProps} />
                            );
                            if (aIndex != getter.length - 1) {
                                elements.push(
                                    <Divider />
                                );
                            }
                            return elements;
                        })
                    )
                }
            </Stack>
        </Card>
    )
}

export default function ManageProductsBase(aProps) {
    const { data, hideFullInventory, readOnly } = aProps;
    
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState(0);
    const [variants, setVariants] = useState([{}]);

    useEffect(function() {
        if (!data) {
            return;
        }
        setName(data.name);
        setSlug(data.slug);
        setDescription(data.description);
        setType(data.type);
        setVariants(data.variants);
    }, [data]);

    return (
        <Fragment>
            <Card sx={{ p: 3 }} elevation={0}>
                <Typography variant="h6" sx={{ mb: 2 }}>General</Typography>
                <Stack
                    spacing={2}>
                    <Stack
                        container
                        gap={2}
                        direction={{ sm: "column", md: "row" }}>
                        <TextField
                            label="Name"
                            name="in-name"
                            helperText="The user-facing name of the product."
                            value={name}
                            disabled={readOnly}
                            onChange={function(event) {
                                setName(event.target.value);
                            }}
                            required
                            fullWidth />
                        <TextField
                            label="Slug"
                            name="in-slug"
                            helperText="The name used to represent the product in the URL."
                            value={slug}
                            disabled={readOnly}
                            onChange={function(event) {
                                setSlug(event.target.value);
                            }}
                            required
                            fullWidth />
                    </Stack>
                    <Stack
                        container
                        gap={2}
                        direction={{ sm: "column", md: "row" }}>
                        <TextField
                            label="Description"
                            name="in-description"
                            value={description}
                            disabled={readOnly}
                            onChange={function(event) {
                                setDescription(event.target.value);
                            }}
                            required
                            multiline
                            fullWidth />
                    </Stack>
                    <Stack
                        container
                        gap={2}
                        direction={{ sm: "column", md: "row" }}>
                        <Autocomplete
                            disablePortal
                            id="in-type"
                            options={productTypes}
                            sx={{ width: "100%" }}
                            defaultValue={productTypes[0]}
                            value={productTypes[type]}
                            disabled={readOnly}
                            onChange={function(event, newValue) {
                                setType(newValue.value);
                            }}
                            renderInput={
                                (params) =>
                                    <TextField {...params}
                                        name="in-type"
                                        label="Type"
                                        required />
                                }
                            />
                    </Stack>
                </Stack>
            </Card>
            <ProductInventoryListCard
                getter={variants}
                hideFullInventory={hideFullInventory}
                readOnly={readOnly} />
            <Stack
                spacing={2}
                direction="row">
                <Button
                    variant="contained"
                    type="submit">
                    Submit
                </Button>
                <Button
                    type="reset">
                    Reset
                </Button>
            </Stack>
        </Fragment>
    )
}
