import React, { Fragment, useState, useEffect } from "react";

//base.js - > cards for edit anc reate
import {
    Box, Stack, Card,
    Button, Typography,
    FormControl, FormLabel, TextField, InputLabel, MenuItem,
    Select, Divider,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    useTheme, useMediaQuery
} from "@mui/material";

import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from "@mui/icons-material";

import { productTypes } from "../../staticTypes.js";


const ACTIONS = {
    ADD: 0,
    EDIT: 1,
    DELETE: 2
};


//This can be used as editor of for number
function ProductInventoryFormControl(aProps) {
    const { isModal, useDefaultUnit, readOnly, data } = aProps;

    const [name, setName] = useState();
    const [price, setPrice] = useState();
    const [stock, setStock] = useState();
    const [imageUrl, setImageUrl] = useState();

    useEffect(function() {
        if (!data) {
            return;
        }
        setName(data.name);
        setPrice(data.price);
        setStock(data.stock);
        setImageUrl(data.imageUrl);
    }, [data]);

    return (
        <Stack
            gap={2}
            direction={
                isModal ? "column" : { sm: "column", md: "row" }
            }>
            <TextField
                label="Variant/Unit Name"
                name="in-variant-name"
                defaultValue={useDefaultUnit ? "One Unit" : ""}
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
                InputProps = {{
                    inputProps: {
                        min: 0
                    }
                }}
                min={0}
                required
                fullWidth />
            <TextField
                label="Image URL"
                name="in-variant-image-url"
                value={imageUrl}
                disabled={readOnly}
                onChange={function(event) {
                    setImageUrl(event.target.value);
                }}
                required
                fullWidth />
        </Stack>
    );
}

function ProductInventoryDisplayCard(aProps) {
    const { onOpenDialog, inventory } = aProps;

    const [name, setName] = useState("Default");
    const [price, setPrice] = useState();
    const [stock, setStock] = useState();

    useEffect(function() {
        if (!inventory) {
            return;
        }
        setName(inventory.name);
        setPrice(inventory.price);
        setStock(inventory.stock);
    }, [inventory]);

    const handleClickEdit = function() {
        onOpenDialog(ACTIONS.EDIT, "Edit", inventory);
    };

    const handleClickDelete = function() {
        onOpenDialog(ACTIONS.DELETE, "Delete", inventory);
    };

    return (
        <Stack
            gap={2}
            direction={{ sm: "column", md: "row" }}>
            <FormControl fullWidth>
                <FormLabel>Unit Name</FormLabel>
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
                    startIcon={<EditIcon />}
                    onClick={handleClickEdit}>
                Edit
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={handleClickDelete}>
                Delete
                </Button>
            </Stack>
        </Stack>
    );
}

function ProductInventoryListCard(aProps) {
    const { product, isCreateProduct, onDialogSubmit } = aProps;

    const [variants, setVariants] = useState([{}]);

    useEffect(function() {
        if (!product) {
            return;
        }
        setVariants(product.variants);
    }, [product]);

    const [open, setOpen] = useState(false);
    const [dialogType, setDialogType] = useState(ACTIONS.ADD);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogVariantData, setDialogVariantData] = useState();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleOpenDialog = function(aType, aTitle, aVariantData) {
        setDialogType(aType);
        setDialogTitle(aTitle);
        setDialogVariantData(aVariantData);
        setOpen(true);
    };

    const handleClose = function() {
        setOpen(false);
    };

    const handleClickAdd = function() {
        handleOpenDialog(ACTIONS.ADD, "Add New", null);
    };

    const handleDialogSubmit = async function(aEvent) {
        const result = await onDialogSubmit(aEvent);
        if (result) {
            setOpen(false);
        }
    };

    return (
        <Card sx={{ p: 3 }} elevation={0} variant="outlined">
            <Dialog
                id="dialog-form"
                component="form"
                onSubmit={handleDialogSubmit}
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                fullScreen={fullScreen}>
                <DialogTitle>{dialogTitle} Product Unit</DialogTitle>
                <DialogContent>
                    {
                        <Fragment>
                            <div style={{ display: "none" }}>
                                <input type="text" name="in-variant-id" value={dialogVariantData?.id} readOnly />
                                <input type="number" name="in-action" value={dialogType} readOnly />
                            </div>
                            {
                                dialogType == ACTIONS.DELETE ? (
                                    <DialogContentText>
                                Are you sure you want to delete this product unit?
                                    </DialogContentText>
                                ) : (
                                    <Fragment>
                                        <DialogContentText sx={{ mb: 4 }}>
                                    Your changes will take effect immediately. However, this will not affect the price for confirmed orders.
                                        </DialogContentText>
                                        <ProductInventoryFormControl isModal data={dialogVariantData} />
                                    </Fragment>
                                )
                            }
                        </Fragment>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        {
                            dialogType == ACTIONS.DELETE ? ("No") : ("Cancel")
                        }
                    </Button>
                    <Button type="submit" form="dialog-form">
                        {
                            dialogType == ACTIONS.DELETE ? ("Yes") : ("Save")
                        }
                    </Button>
                </DialogActions>
            </Dialog>
            <Typography variant="h6" sx={{ mb: 2 }}>Inventory</Typography>
            <Stack
                spacing={2}>
                {
                    isCreateProduct ? (
                        <Fragment>
                            <ProductInventoryFormControl
                                useDefaultUnit
                                {...aProps} />
                            <FormLabel>
                            You may add additional units once the initial product is created.
                            </FormLabel>
                        </Fragment>
                    ) : (
                        <Fragment>
                            {
                                variants?.map(function(aVariant, aIndex) {
                                    let elements = [];
                                    elements.push(
                                        <Fragment key={aIndex}>
                                            <ProductInventoryDisplayCard
                                                index={aIndex}
                                                inventory={aVariant}
                                                onOpenDialog={handleOpenDialog}
                                                {...aProps} />
                                            <Divider />
                                        </Fragment>
                                    );
                                    return elements;
                                })
                            }
                            <Box>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={handleClickAdd}>
                                    Add new unit
                                </Button>
                            </Box>
                        </Fragment>
                    )
                }
            </Stack>
        </Card>
    );
}

function ProductDetailCard(aProps) {
    const { product, readOnly, cardProps } = aProps;
    
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState(0);

    useEffect(function() {
        if (!product) {
            return;
        }
        setName(product.name);
        setSlug(product.slug);
        setDescription(product.description);
        setType(product.type);
    }, [product]);

    return (
        <Card
            {...cardProps}
            sx={{ p: 3 }}
            elevation={0}
            variant="outlined">
            <Typography variant="h6" sx={{ mb: 2 }}>General</Typography>
            <Stack
                spacing={2}>
                <Stack
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
                    gap={2}
                    direction={{ sm: "column", md: "row" }}>
                    <FormControl fullWidth>
                        <InputLabel id="in-type-label">Type</InputLabel>
                        <Select
                            label="Type"
                            labelId="in-type-label"
                            name="in-type"
                            defaultValue={0}
                            value={type}
                            disabled={readOnly}
                            onChange={function(event) {
                                setType(event.target.value);
                            }}>
                            {
                                productTypes.map(function(aType, aIndex) {
                                    return (
                                        <MenuItem key={aIndex} value={aType.value}>
                                            {aType.label}
                                        </MenuItem>
                                    );
                                })
                            }
                        </Select>
                    </FormControl>
                </Stack>
            </Stack>
        </Card>
    );
}

function ManageProductsBase(aProps) {
    const { isCreateProduct, onMainSubmit } = aProps;

    const mainFormProps = {
        id: "main-form",
        component: "form",
        onSubmit: onMainSubmit
    };
    const parentBoxProps = isCreateProduct ? mainFormProps : {};
    const detailBoxProps = isCreateProduct ? {} : mainFormProps;

    return (
        <Stack
            spacing={2}
            useFlexGap
            {...parentBoxProps}>
            <ProductDetailCard
                cardProps={detailBoxProps}
                {...aProps} />
            <ProductInventoryListCard
                {...aProps} />
            <Stack
                spacing={2}
                direction="row">
                <Button
                    variant="contained"
                    type="submit"
                    form="main-form">
                    Submit
                </Button>
                <Button
                    type="reset"
                    form="main-form">
                    Reset
                </Button>
            </Stack>
        </Stack>
    );
}

export { ManageProductsBase, ACTIONS };
