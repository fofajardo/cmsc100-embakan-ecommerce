import * as React from 'react';
import { useState } from 'react';
import { put } from '../../apiGlue.js';
import {Link, Table, TableBody, TableCell, TableHead, TableRow, Typography, Box, Button, Divider} from '@mui/material';


const kBaseUrl = "http://localhost:3001/orders/";

function preventDefault(event) {
  event.preventDefault();
}
const testCases = [
  {
    productId: "123",
    variantId: "456",
    quantity: 5,
    price: 50.00,
    userId: "789",
    status: 0, // 0 for 'pending'
    date: new Date()
  },
  {
    productId: "456",
    variantId: "789",
    quantity: 3,
    price: 30.50,
    userId: "987",
    status: 2, // 2 for 'accomplished'
    date: new Date()
  },
  {
    productId: "789",
    variantId: "012",
    quantity: 2,
    price: 20.00,
    userId: "654",
    status: 1, // 1 for 'canceled'
    date: new Date()
  },
  {
    productId: "234",
    variantId: "567",
    quantity: 1,
    price: 15.75,
    userId: "321",
    status: 0, // 0 for 'pending'
    date: new Date()
  },
  {
    productId: "890",
    variantId: "123",
    quantity: 4,
    price: 40.00,
    userId: "456",
    status: 2, // 2 for 'accomplished'
    date: new Date()
  },
  {
    productId: "567",
    variantId: "890",
    quantity: 2,
    price: 25.50,
    userId: "012",
    status: 1, // 1 for 'canceled'
    date: new Date()
  },
  {
    productId: "123",
    variantId: "456",
    quantity: 3,
    price: 35.25,
    userId: "789",
    status: 0, // 0 for 'pending'
    date: new Date()
  },
  {
    productId: "456",
    variantId: "789",
    quantity: 1,
    price: 10.00,
    userId: "987",
    status: 2, // 2 for 'accomplished'
    date: new Date()
  },
  {
    productId: "789",
    variantId: "012",
    quantity: 5,
    price: 55.50,
    userId: "654",
    status: 1, // 1 for 'canceled'
    date: new Date()
  },
  {
    productId: "234",
    variantId: "567",
    quantity: 2,
    price: 20.75,
    userId: "321",
    status: 0, // 0 for 'pending'
    date: new Date()
  }
];

// async function put(aUrl, aData, aEnqueue, aSuccessMessage) {
//   if (!aData) {
//       aData = {};
//   }

//   return await base(aUrl, {
//       method: "PUT",
//       headers: {
//           "Content-Type": "application/json",
//       },
//       body: JSON.stringify(aData)
//   }, aEnqueue, aSuccessMessage);
// }

//Function for the canceling (put function containng the update of status)
async function toCancel (){
  const data = {
    status: formJson[0],
};
  const productResult = await api.put(
    `${kBaseUrl}${id}`,
    data,
    enqueueSnackbar,
    "Transaction Cancelled.");
}
//Function for the confirming (put function containng the update of status)
async function toConfirm (){
  const data = {
    status: formJson[1],
};
  const productResult = await api.put(
    `${kBaseUrl}${id}`,
    data,
    enqueueSnackbar,
    "Transaction Confirmed.");
}

export default function Orders() {

  const [orders, setOrders] = useState(testCases);
  // const orderLists = setOrders(testCases);

  // const orderLists = fetch(kBaseUrl,
  //   {
  //       method: "GET",
  //   }
  // ).then(response => response.json()
  // ).then(body => setOrders(body.data));


  return (
    <React.Fragment>
  
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>VariantID</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price at Checkout</TableCell>
            <TableCell>UserID</TableCell>
            <TableCell >Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

            
        {orders?.map((row) => (
            <TableRow key={row.productId}>
              <TableCell>{row.variantId}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.priceAtCheckout}</TableCell>
              <TableCell>{row.userId}</TableCell>
              <TableCell>{row.date.toLocaleString()}</TableCell>
              <TableCell>
              {/* Will display the status accordingly */}
                {row.status === 0 ? 'Pending' : row.status === 1 ? 'Accomplished' : 'Cancelled'}
              </TableCell>
              {/* If pednign, buttons will be returned too for the confirmation the canceling*/}
              {row.status === 0 && (
                <Box display="flex" flexDirection="column" >
                 
                  <Button onClick={toConfirm} variant="contained" color="primary" style={{ marginBottom: '8px' }}>
                    Confirm
                  </Button>
                
                  <Button onClick={toCancel}  variant="outlined" color="primary">
                    Cancel
                  </Button>
                </Box>
              )}

              

    
            </TableRow>
          ))}

{/*


 id: uuidv4(),
        productId: body.productId,
        variantId: body.variantId,
        quantity: body.quantity,
        price: priceAtCheckout,
        userId: body.userId,
        status: body.status,
        date: new Date()
        
        */}

        </TableBody>
      </Table>
      
    </React.Fragment>
  );
}
