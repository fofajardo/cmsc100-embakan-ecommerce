import * as React from 'react';
import { useState } from 'react';
import {Link, Typography, Table, TableBody, TableCell, TableHead, TableRow, Container, Card, CardContent} from '@mui/material';


const kBaseUrl = "http://localhost:3001/users/";



//https://stackoverflow.com/questions/16976904/javascript-counting-number-of-objects-in-object

function Counter( object ) {
  var length = 0;
  for( var i in object ) {
      if( object.hasOwnProperty(i) ) {
          ++length;
      }
  }
  return length;
};

// This will return the components for the accounts in the dashboard
export default function Accounts() {
  
    //Gets the content of the users using this GET method
    const [users, setUsers] = useState();

    const userResponse = fetch(kBaseUrl,
      {
          method: "GET",
      }
    ).then(response => response.json()
    ).then(body => setUsers(body.data));



  return (
    <Container>
        <Card sx={{ my: 2 }}>
        <CardContent>
      <Typography variant="h5" gutterBottom>
      Accounts
        </Typography>
        <Typography variant="body1" gutterBottom>
      Total Users: {Counter(users)}
        </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        
          {users?.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.firstName}</TableCell>
              <TableCell>{row.lastName}</TableCell>
              <TableCell>{row.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </CardContent>
     </Card>
    </Container>
  );
}
