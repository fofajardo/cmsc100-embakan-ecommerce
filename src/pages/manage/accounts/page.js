import React, { useState, useEffect } from "react";

import { Link as RouterLink } from "react-router-dom";

import {
    Typography, Stack, Paper,
    TableContainer, Table, TableBody, TableCell, TableHead, TableRow,
    Container, Card, CardContent,
    IconButton
} from "@mui/material";

import {
    ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

import api from "../../apiGlue.js";
import { getFriendlyRoleName } from "../../staticTypes.js";

const kBaseUrl = `${api.host}users/`;
const kParentRoute = "/manage";

// This will return the components for the accounts in the dashboard
export default function ManageAccounts() {
    const [users, setUsers] = useState();

    useEffect(function() {
        api.get(kBaseUrl).then(function(aResponse) {
            setUsers(aResponse.data);
        });
    }, []);

    return (
        <Container sx={{ py: 3 }}>
            <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 3 }}>
                <IconButton component={RouterLink} to={kParentRoute} color="primary" aria-label="go back">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">
                    Accounts
                </Typography>
            </Stack>
            <Paper variant="outlined" sx={{ width: "100%" }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users?.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.firstName}</TableCell>
                                    <TableCell>{row.lastName}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{getFriendlyRoleName(row.role)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack 
                    direction="row"
                    justifyContent="flex-end"
                    sx={{ m: 2 }}>
                    <Typography>
                    Total Users: {users ? users.length : 0}
                    </Typography>
                </Stack>
            </Paper>
        </Container>
    );
}
