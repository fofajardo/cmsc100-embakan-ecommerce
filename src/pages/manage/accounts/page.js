import React, { useState } from "react";

import { Link as RouterLink } from "react-router-dom";

import {
    Typography, Stack,
    Table, TableBody, TableCell, TableHead, TableRow,
    Container, Card, CardContent,
    IconButton
} from "@mui/material";

import {
    ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

import api from "../../apiGlue.js";

const kBaseUrl = `${api.host}users/`;
const kParentRoute = "/manage";

// This will return the components for the accounts in the dashboard
export default function ManageAccounts() {
  
    //Gets the content of the users using this GET method
    const [users, setUsers] = useState();

    fetch(kBaseUrl,
        {
            method: "GET",
        }
    ).then(response => response.json()
    ).then(body => setUsers(body.data));



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
            <Card sx={{ my: 2 }} variant="outlined">
                <CardContent>
                    <Typography variant="body1" gutterBottom>
                        Total Users: {users ? users.length : 0}
                    </Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
        
                            {users?.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.firstName}</TableCell>
                                    <TableCell>{row.lastName}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Container>
    );
}
