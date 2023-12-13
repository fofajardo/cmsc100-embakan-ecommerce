import { Fragment } from "react";

import {
    Paper, Box, Stack, Grid, Card,
    Button, IconButton, Typography,
    FormControl, FormLabel, TextField, Input,
    Autocomplete
} from "@mui/material";

import productTypes from "./productTypes.js";

export default function ManageProductsBase(aProps) {
    const { name, slug, description, type, stock, readOnly } = aProps;
    return (
        <Fragment>
            <Typography variant="h6" sx={{ mb: 2 }}>General</Typography>
            <Card sx={{ p: 3 }} elevation={0}>
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
                            required
                            fullWidth />
                        <TextField
                            label="Slug"
                            name="in-slug"
                            helperText="The name used to represent the product in the URL."
                            value={slug}
                            disabled={readOnly}
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
                            value={type}
                            disabled={readOnly}
                            renderInput={
                                (params) =>
                                    <TextField {...params}
                                        name="in-type"
                                        label="Type"
                                        required />
                                }
                            />
                        <TextField
                            label="Stock"
                            name="in-stock"
                            type="number"
                            value={stock}
                            disabled={readOnly}
                            min={0}
                            required
                            fullWidth />
                    </Stack>
                </Stack>
            </Card>
            <Typography variant="h6" sx={{ mb: 2 }}>Variants</Typography>
            <Card sx={{ p: 3 }} elevation={0}>
                <Stack
                    spacing={2}>
                    <Stack
                        container
                        gap={2}
                        direction={{ sm: "column", md: "row" }}>
                        <TextField
                            label="Variant Name"
                            name="in-variant-name"
                            value="Default"
                            disabled={readOnly}
                            required
                            fullWidth />
                        <TextField
                            label="Price"
                            name="in-variant-price"
                            type="number"
                            disabled={readOnly}
                            required
                            fullWidth />
                    </Stack>
                    <FormLabel>
                    You can add additional variants once the product is created. The price of a product is tied to its default variant. 
                    </FormLabel>
                    <FormLabel>
                    The variant selection is hidden if there is only one variant.
                    </FormLabel>
                </Stack>
            </Card>
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
