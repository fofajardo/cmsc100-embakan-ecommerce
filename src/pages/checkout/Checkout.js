import * as React from 'react';
import {CssBaseline, AppBar, Box, Container, Toolbar,
  Paper, Stepper, Step, StepLabel, Button, Link,
  Typography, Link as RouterLink, Divider} from '@mui/material';

import Details from './Details.js';
import Review from './ReviewOrder.js';

// This is for the checking out
function handlePost(event) {
  return
}

export default function Checkout() {

  return (
   
    <React.Fragment>
      <CssBaseline />

      {/* Container that will contain the Checkout Component */}
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
        
       
            <React.Fragment>
              {/* COMPONENT 1: REVIEW
              Will contain the product overview */}
              <Review />
              <Divider />
              {/* COMPONENT 2: DETAILS
              Placeholder for the delivery Details */}
              <Details/>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>

           {/* Place Order Button */}
                  <Button onClick={handlePost} tosx={{ mt: 3, ml: 1}}>
                    Place Order
                  </Button>
          

              </Box>
            </React.Fragment>
        
        </Paper>
   
      </Container>
    </React.Fragment>
  );
}
