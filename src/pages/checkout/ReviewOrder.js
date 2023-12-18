import * as React from 'react';
import {Typography, List, ListItem, ListItemText, Grid} from '@mui/material';

// Reference/Tutorials : https://mui.com/material-ui/getting-started/


// This will be the component that will map the products that are going to be checkeout
export default function Review() {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <List disablePadding>
        {products?.map((product) => (
          <ListItem key={product.name} sx={{ py: 1, px: 0 }}>

            <ListItemText primary={product.name} secondary={product.desc} />
            <Typography variant="body2">{product.price}</Typography>
          </ListItem>
        ))}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            PHP 100000
          </Typography>
        </ListItem>
      </List>
     
    </React.Fragment>
  );
}
