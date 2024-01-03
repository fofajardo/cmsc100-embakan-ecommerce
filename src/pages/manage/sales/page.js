import React, { useState, useEffect } from "react";

import { useSnackbar } from "notistack";
import { Link as RouterLink } from "react-router-dom";

import {
    Typography, Table, TableBody, TableCell, Stack,
    TableContainer, TableHead, TableRow, TablePagination, Paper, Container,
    IconButton, Tabs, Tab
} from "@mui/material";

import {
    ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

import { getFriendlyTypeName } from "../../staticTypes.js";

import api from "../../apiGlue.js";

const columns = [
    {
        id: "product",
        label: "Product",
        minWidth: 170
    },
    {
        id: "variant",
        label: "Variant",
        minWidth: 170
    },
    {
        id: "type",
        label: "Type",
        minWidth: 100,
        format: getFriendlyTypeName
    },
    {
        id: "price",
        label: "Price",
        minWidth: 170,
        format: api.currency.format
    },
    {
        id: "unitsSold",
        label: "Units Sold",
        minWidth: 75,
        format: api.num.format
    },
    {
        id: "income",
        label: "Income",
        minWidth: 200,
        align: "right",
        format: api.currency.format
    }
];

const kBaseUrl = `${api.host}orders/`;
const kParentRoute = "/manage";

function getStartEndDates(aWhich) {
    const today = new Date();
    var dates = {
        start: null,
        end: null
    };

    switch (aWhich) {
    // Weekly
    default:
    case 0: {
        // Get the current day of the week (0 is Sunday, 6 is Saturday).
        const currentDay = today.getDay();
        // Calculate the day offset to reach the starting day of the week.
        const startOfWeekOffset = currentDay === 0 ? 6 : currentDay - 1;
        // Calculate the year and month for the start of the week.
        let startOfWeekYear = today.getFullYear();
        let startOfWeekMonth = today.getMonth();
        // Adjust year and month if necessary due to startOfWeekOffset.
        if (startOfWeekOffset > today.getDate()) {
            startOfWeekMonth--;
            if (startOfWeekMonth < 0) {
                startOfWeekMonth = 11;
                startOfWeekYear--;
            }
        }
        const firstDayCurrentWeek = new Date(
            startOfWeekYear,
            startOfWeekMonth,
            today.getDate() - startOfWeekOffset);
        const firstDayNextWeek = new Date(
            firstDayCurrentWeek.getFullYear(),
            firstDayCurrentWeek.getMonth(),
            firstDayCurrentWeek.getDate() + 7);
        dates.start = firstDayCurrentWeek.toISOString();
        dates.end = firstDayNextWeek.toISOString();
        break;
    }
    // Monthly
    case 1: {
        // Create Date objects for first day of current and next month.
        const firstDayCurrentMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1);
        const firstDayNextMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            1);
        dates.start = firstDayCurrentMonth.toISOString();
        dates.end = firstDayNextMonth.toISOString();
        break;
    }
    // Yearly
    case 2: {
        // Create Date objects for first day of current and next year.
        const firstDayCurrentYear = new Date(
            today.getFullYear(),
            0,
            1);
        const firstDayNextYear = new Date(
            today.getFullYear() + 1,
            0,
            1);
        dates.start = firstDayCurrentYear.toISOString();
        dates.end = firstDayNextYear.toISOString();
        break;
    }
    }

    return dates;
}

export default function ManageSales() {
    const { enqueueSnackbar } = useSnackbar();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orders, setOrders] = useState([]);
    const [tabValue, setTabValue] = React.useState(0);
    const [grossIncome, setGrossIncome] = React.useState(0);

    useEffect(function() {
        const dates = getStartEndDates(tabValue);

        api.get(
            `${kBaseUrl}?confirmedOnly=1&groupBy=variantId&startDate=${dates.start}&endDate=${dates.end}`,
            enqueueSnackbar)
            .then(function(aResponse) {
                const computedGrossIncome = aResponse.data.reduce(function(aAccumulator, aCurrentValue) {
                    return aAccumulator + aCurrentValue.totalPayment;
                }, 0);
                setOrders(aResponse.data);
                setGrossIncome(computedGrossIncome);
            });
    }, [tabValue]);

    const handleChangePage = function(aEvent, aNewPage) {
        setPage(aNewPage);
    };

    const handleChangeRowsPerPage = function(aEvent) {
        setRowsPerPage(+aEvent.target.value);
        setPage(0);
    };

    const handleColumnMap = function(aColumn) {
        return (
            <TableCell
                key={aColumn.id}
                align={aColumn.align}
                style={{ top: 57, minWidth: aColumn.minWidth }}>
                {aColumn.label}
            </TableCell>
        );
    };

    const handleRowMap = function(aRow, aRowIndex) {
        return (
            <TableRow hover role="checkbox" tabIndex={-1} key={aRowIndex}>
                {
                    columns.map(function(aColumn) {
                        var value = "Missing";
                        switch (aColumn.id) {
                        case "product":
                            value = aRow.children[0]?.product.name;
                            break;
                        case "variant":
                            value = aRow.children[0]?.product.variants.name;
                            break;
                        case "type":
                            value = aRow.children[0]?.product.type;
                            break;
                        case "price":
                            value = aRow.children[0]?.price;
                            break;
                        case "unitsSold":
                            value = aRow.totalUnits;
                            break;
                        case "income":
                            value = aRow.totalPayment;
                            break;
                        }
                        const shouldFormat = (aColumn.format && typeof value === "number");
                        return (
                            <TableCell key={aColumn.id} align={aColumn.align}>
                                {shouldFormat ? aColumn.format(value) : value}
                            </TableCell>
                        );
                    })
                }
            </TableRow>
        );
    };

    const handleTabChange = function(aEvent, aNewValue) {
        setTabValue(aNewValue);
    };

    return (
        <Container sx={{ py: 3 }}>
            <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 3 }}>
                <IconButton component={RouterLink} to={kParentRoute} color="primary" aria-label="go back">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">Sales Report</Typography>
            </Stack>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="nav tabs"
                role="navigation"
                variant="fullWidth"
                centered>
                <Tab label="Weekly" />
                <Tab label="Monthly" />
                <Tab label="Yearly" />
            </Tabs>
            <Paper variant="outlined" sx={{ width: "100%" }}>
                <TableContainer>
                    <Table aria-label="table">
                        <TableHead>
                            <TableRow>
                                {
                                    columns.map(handleColumnMap)
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                orders
                                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    ?.map(handleRowMap)
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={orders?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage} />
                <Stack 
                    direction="row"
                    justifyContent="flex-end"
                    sx={{ m: 2 }}>
                    <Typography>
                        Gross income: {api.currency.format(grossIncome)}
                    </Typography>
                </Stack>
            </Paper>
            <Typography sx={{ my: 2 }}>
                Only completed orders are counted in the sales report.
            </Typography>
        </Container>
    );
}
