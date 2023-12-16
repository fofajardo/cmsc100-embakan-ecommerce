import * as React from 'react';
import {Typography,Checkbox, Grid, TextField, FormControlLabel} from '@mui/material';

export default function PaymentForm() {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Receiver's Name
      </Typography>
      <Typography variant="p" gutterBottom>
        Input the name of the receiver in the Delivery Address.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="nameOfReceiver"
            label="Name of Receiver"
            fullWidth
            autoComplete="Name"
            variant="standard"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
