import * as React from 'react';
import { useState } from 'react';
import {Link, Typography, Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';


const kBaseUrl = "http://localhost:3001/users/";




const users1 = [
  {
    firstName: "Ramona",
    middleName: "Grace",
    lastName: "Garcia",
    email: "ramona.grace@email.com",
    password: "admin123"
  },
  {
    firstName: "Carlos",
    lastName: "Santos",
    email: "carlos.santos@email.com",
    password: "user456"
  },
  {
    firstName: "Sophia",
    middleName: "Marie",
    lastName: "Lopez",
    email: "sophia.lopez@email.com",
    password: "guest789"
  },
  {
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@email.com",
    password: "pass123"
  },
  {
    firstName: "Amanda",
    lastName: "Smith",
    email: "amanda.smith@email.com",
    password: "amanda789"
  },
  {
    firstName: "David",
    lastName: "Nguyen",
    email: "david.nguyen@email.com",
    password: "david456"
  },
  {
    firstName: "Emma",
    lastName: "Wong",
    email: "emma.wong@email.com",
    password: "emma789"
  },
  {
    firstName: "Daniel",
    lastName: "Rodriguez",
    email: "daniel.rodriguez@email.com",
    password: "daniel123"
  },
  {
    firstName: "Olivia",
    lastName: "Martinez",
    email: "olivia.martinez@email.com",
    password: "olivia456"
  },
  {
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@email.com",
    password: "alex789"
  }
];

function preventDefault(event) {
  event.preventDefault();
}
//https://stackoverflow.com/questions/16976904/javascript-counting-number-of-objects-in-object

function Counter( object ) {
  var length = 0;
  for( var key in object ) {
      if( object.hasOwnProperty(key) ) {
          ++length;
      }
  }
  return length;
};


export default function Accounts() {
  
    
    const [users, setUsers] = useState();

    const userResponse = fetch(kBaseUrl,
      {
          method: "GET",
      }
    ).then(response => response.json()
    ).then(body => setUsers(body.data));

  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom>
      Accounts
        </Typography>
        <Typography variant="h6" gutterBottom>
      Count: {Counter(users)}
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
     
    </React.Fragment>
  );
}
