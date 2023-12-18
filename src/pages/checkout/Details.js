import React, { useState } from 'react';
import {Grid, Typography, TextField, FormControlLabel, Checkbox}from '@mui/material';
// Reference/Tutorials : https://mui.com/material-ui/getting-started/
export default function AddressForm() {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [address, setAddress] = useState();
  const [postalCode, setPostalCode] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [province, setProvince] = useState();
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Receiver Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First Name"
            fullWidth
            autoComplete="given-name"
            variant="standard"
            value = {firstName}
            onChange = {e => setFirstName(e.target.value)}
            helperText = {!firstName ? "This field is required" : ' '}
            error = {!firstName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Last Name"
            fullWidth
            autoComplete="family-name"
            variant="standard"
            value = {lastName}
            onChange = {e => setLastName(e.target.value)}
            helperText = {!lastName ? "This field is required" : ' '}
            error = {!lastName}
          />
        </Grid>
        <Typography variant="h6" gutterBottom>
        Delivery Details
      </Typography>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Address line 1"
            fullWidth
            autoComplete="shipping address-line1"
            variant="standard"
            value = {address}
            onChange = {e => setAddress(e.target.value)}
            helperText = {!address ? "This field is required" : ' '}
            error = {!address}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            fullWidth
            autoComplete="shipping address-line2"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            variant="standard"
            value = {city}
            onChange = {e => setCity(e.target.value)}
            helperText = {!city ? "This field is required" : ' '}
            error = {!city}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            variant="standard"
            value = {province}
            onChange = {e => setProvince(e.target.value)}
            helperText = {!province ? "This field is required" : ' '}
            error = {!province}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            variant="standard"
            value = {postalCode}
            onChange = {e => setPostalCode(e.target.value)}
            helperText = {!postalCode ? "This field is required" : ' '}
            error = {!postalCode}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="shipping country"
            variant="standard"
            value = {country}
            onChange = {e => setCountry(e.target.value)}
            helperText = {!country ? "This field is required" : ' '}
            error = {!country}
          />
        </Grid>
       
      </Grid>
    </React.Fragment>
  );
}
