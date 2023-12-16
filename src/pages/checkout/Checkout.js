import * as React from 'react';
import {CssBaseline, AppBar, Box, Container, Toolbar,
  Paper, Stepper, Step, StepLabel, Button, Link,
  Typography} from '@mui/material';

import AddressForm from './AddressForm.js';
import PaymentForm from './DeliveryConfirmation.js';
import Review from './ReviewOrder.js';



const steps = ['Order and Delivery Details', 'Confirm Payment'];

//This will contain the 
function getStepContent(step) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <PaymentForm />;
    default:
      throw new Error('Unknown step');
  }
}

export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <React.Fragment>
      <CssBaseline />

      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
        
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1">
                Your order number is #2001539. We have emailed your order
                confirmation, and will send you an update when your order has
                shipped.
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>

          
                {/* @rfpramos : This returns the review so that we can show the product list. */}
            
                {activeStep == 0 && (
                  <Review />
                )}
              {getStepContent(activeStep)}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>


                

                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Paper>
   
      </Container>
    </React.Fragment>
  );
}
