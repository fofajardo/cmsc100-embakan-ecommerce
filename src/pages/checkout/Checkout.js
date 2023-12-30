import React, { Fragment } from "react";
import {
    Box, Container, Paper, Button, Typography, Divider
} from "@mui/material";

import Details from "./Details.js";
import Review from "./ReviewOrder.js";

// This is for the checking out
function handlePost(aEvent) {
    return aEvent;
}

export default function Checkout() {

    return (
   
        <Fragment>
            {/* Container that will contain the Checkout Component */}
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <Typography component="h1" variant="h4" align="center">
            Checkout
                    </Typography>
        
       
                    <Fragment>
                        {/* COMPONENT 1: REVIEW
              Will contain the product overview */}
                        <Review />
                        <Divider />
                        {/* COMPONENT 2: DETAILS
              Placeholder for the delivery Details */}
                        <Details/>

                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>

                            {/* Place Order Button */}
                            <Button onClick={handlePost} tosx={{ mt: 3, ml: 1}}>
                    Place Order
                            </Button>
          

                        </Box>
                    </Fragment>
        
                </Paper>
   
            </Container>
        </Fragment>
    );
}
