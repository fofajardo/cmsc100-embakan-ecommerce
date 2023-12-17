import * as React from 'react';
import {Typography,Checkbox, Grid, TextField, FormControlLabel} from '@mui/material';

export default function PaymentForm() {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Remarks
      </Typography>
      <Typography variant="p" gutterBottom>
        If you need specific instructions regarding the door-to-door delivery. Input here.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="remarks"
            label="Remarks"
            fullWidth
            autoComplete="Comment..."
            variant="standard"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
