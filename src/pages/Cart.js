import * as React from 'react';
import { useState } from 'react';

import { Outlet, Link, useNavigate, Link as RouterLink } from "react-router-dom";


// import Carder from
import {Paper, Divider, Button, Typography, List, ListItem, ListItemText, Grid, IconButton} from '@mui/material';

import {
  Add as AddIcon ,
  Remove as RemoveIcon ,
  
} from "@mui/icons-material";
//
const cartItems = [
  {
    name: 'Product 1',
    desc: 'A nice thing',
    price: '$9.99',
  },
  {
    name: 'Product 2',
    desc: 'Another thing',
    price: '$3.45',
  },
  {
    name: 'Product 3',
    desc: 'Something else',
    price: '$6.51',
  },
  {
    name: 'Product 4',
    desc: 'Best thing of all',
    price: '$14.11',
  },
  { name: 'Shipping', desc: '', price: 'Free' },
];


export default function Cart() {

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  return (
    <Paper elevation={3} sx={{ p: 10 }}>
    <Typography variant="h6" gutterBottom>
      Shopping Cart
    </Typography>
    <Divider />
    <List>
      {cartItems.map((item, index) => (
        <ListItem key={index} divider>
          <ListItemText
            primary={item.name}
            secondary={`Quantity: ${item.quantity}`}
          />
          <Typography variant="body2">
            ${(item.price * item.quantity).toFixed(2)}

            <IconButton  size = "small" /*component={RouterLink} to={kParentRoute}*/ color="secondary" aria-label="add" onClick={increaseQuantity}>
                    <AddIcon />
                </IconButton>
           
            
              <IconButton   size = "small" /*component={RouterLink} to={kParentRoute}*/ color="secondary" aria-label="minus" onClick={decreaseQuantity}>
                    <RemoveIcon />
                </IconButton>


          </Typography>
        </ListItem>
      ))}
    </List>
    <Typography variant="h6">
      Total: $
      {cartItems
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2)}
    </Typography>  
    <Link to={`/checkout`}>
      <Button
          type ="button"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
                   Checkout
        </Button>
      </Link>
    
    </Paper>

    
  );

}
