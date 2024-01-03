import React, { useState, useEffect } from "react";

import { useSnackbar } from "notistack";
import { Link as RouterLink } from "react-router-dom";

import {
    Container, Grid,
    Typography, Card, CardContent, CardActions,
    List, ListItem, ListItemText, Button, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, useTheme, useMediaQuery
} from "@mui/material";

import {
    Edit as EditIcon
} from "@mui/icons-material";

import api from "../apiGlue.js";
import { getFriendlyRoleName } from "../staticTypes.js";

const kBaseUrl = `${api.host}users/`;

function FieldEditDialog(aProps) {
    const { enqueueSnackbar } = useSnackbar();
    const { onClose, dialogData, open, user } = aProps;
    const [value, setValue] = useState("");

    useEffect(function() {
        if (!user) {
            return;
        }
        if (dialogData.formName in user) {
            setValue(user[dialogData.formName]);
        } else {
            setValue("");
        }
    }, [user, dialogData]);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleDialogSubmit = async function(aEvent) {
        aEvent.preventDefault();

        const formData = new FormData(aEvent.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        const result = await api.put(
            `${kBaseUrl}${user.id}`,
            formJson,
            enqueueSnackbar,
            "User information was edited successfully."
        );

        if (result.data) {
            const refreshResult = await api.get(`${api.host}auth/refresh`);

            onClose();
        }
    };

    return (
        <Dialog
            id="dialog-form"
            component="form"
            onSubmit={handleDialogSubmit}
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            fullScreen={fullScreen}>
            <DialogTitle>Edit user information</DialogTitle>
            <DialogContent>
                <Typography sx={{ mb: 2 }}>
                    Your changes will take effect immediately.
                </Typography>
                <TextField
                    label={dialogData.label}
                    name={dialogData.formName}
                    value={value}
                    onChange={function(event) {
                        setValue(event.target.value);
                    }}
                    required
                    multiline={dialogData.formIsMulti}
                    fullWidth />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" form="dialog-form">Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default function Account() {
    const [user, setUser] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState({});

    const handleClose = function() {
        setDialogOpen(false);
    };

    useEffect(function() {
        api.identify().then(function(aResult) {
            if (!aResult.data) {
                return;
            }
            setUser(aResult.data);
        });
    }, [dialogOpen]);

    const basicData = [
        {
            label: "First Name",
            data: user?.firstName,
            formName: "firstName",
            formCondition: true
        },
        {
            label: "Middle Name",
            data: user?.middleName,
            formName: "middleName",
            formCondition: true
        },
        {
            label: "Last Name",
            data: user?.lastName,
            formName: "lastName",
            formCondition: true
        },
        {
            label: "Role",
            data: getFriendlyRoleName(user?.role),
            // Block role edit for now.
            /* formCondition: user?.role == 2,
            formHandler: null */
        },
    ];

    const contactData = [
        {
            label: "Username",
            data: user?.username,
        },
        {
            label: "Email",
            data: user?.email,
            formCondition: true,
            formName: "email"
        },
        {
            label: "Address",
            data: user?.address,
            formCondition: true,
            formIsMulti: true,
            formName: "address"
        }
    ];

    const handleListItemMap = function(aItem, aIndex) {
        const handleEdit = function(aEvent) {
            setDialogData(aItem);
            setDialogOpen(true);
        };

        return (
            <ListItem disableGutters key={aIndex}>
                <ListItemText primary={aItem.label} primaryTypographyProps={{ variant: "subtitle2", sx: { whiteSpace: "pre-wrap" } }} />
                {aItem.data}
                {
                    aItem.formCondition ? (
                        <IconButton sx={{ ml: 1 }} size="small" onClick={handleEdit}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    ) : (
                        <></>
                    )
                }
            </ListItem>
        )
    };

    return (
        <Container sx={{ py: 3 }}>
            <FieldEditDialog
                 onClose={handleClose}
                 dialogData={dialogData}
                 open={dialogOpen}
                 user={user} />
            <Typography variant="h4" sx={{ mb: 1 }}>
                My Account
            </Typography>
            <Typography>
                Info about you and your preferences.
            </Typography>
            <Grid container spacing={2} direction={{ xs: "column", md: "row" }} sx={{ my: 2 }}>
                <Grid item xs>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                            Basic info
                            </Typography>
                            <Typography>
                            Some info may be visible to people you transact with.
                            </Typography>
                            <List>
                            { basicData.map(handleListItemMap) }
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                            Contact info
                            </Typography>
                            <List>
                            { contactData.map(handleListItemMap) }
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={2} direction={{ xs: "column", md: "row" }}>
                <Grid item xs>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                            Password
                            </Typography>
                            <Typography>
                            A strong password helps secure your E-mbakan account.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" component={RouterLink} to="change-password">
                                Change password
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                            Order History
                            </Typography>
                            <Typography>
                            Past purchases are conveniently organized in your order history.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" component={RouterLink} to="orders">
                                View Past Orders
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
