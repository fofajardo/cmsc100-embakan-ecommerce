import { v4 as uuidv4 } from "uuid";
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

// TODO: move to a separate module.
const productTypes = [
    {
        label: "Unsorted",
        value: 0,
    },
    {
        label: "Crop",
        value: 1,
    },
    {
        label: "Poultry",
        value: 2,
    },
];

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
        type: productTypes.find((element) => element.label == formJson["in-type"]).value,
        description: formJson["in-description"],
        stock: parseInt(formJson["in-stock"]),
        variants: [{
            id: uuidv4(),
            name: formJson["in-variant-name"],
            price: formJson["in-variant-price"]
        }]
    };
    const jsonData = JSON.stringify(data);

    const errorVariant = { variant: "error" };
    const successVariant = { variant: "success" };

    try {
        const response = await fetch(`${kBaseUrl}`,
            {
                method: "POST",
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
                    enqueueSnackbar("Product added successfully.", successVariant);
                    navigate(kParentRoute);
                });
            }
        });
    } catch (e) {
        enqueueSnackbar(e.message, errorVariant);
    }
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
                                required
                                fullWidth />
                            <TextField
                                label="Slug"
                                name="in-slug"
                                helperText="The name used to represent the product in the URL."
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
                                renderInput={
                                    (params) =>
                                        <TextField {...params} name="in-type" label="Type" required />
                                    }
                                />
                            <TextField
                                label="Stock"
                                name="in-stock"
                                type="number"
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
                                required
                                fullWidth />
                            <TextField
                                label="Price"
                                name="in-variant-price"
                                type="number"
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
            </Stack>
        </Box>
    );
}
