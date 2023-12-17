import * as React from 'react';
import { Link as RouterLink } from "react-router-dom";


import {ListItemButton, ListItemIcon, ListItemText,
  ListSubheader} from '@mui/material';

import {
  ShoppingCart as ShoppingCartIcon ,
  People as PeopleIcon ,
  BarChart as BarChartIcon ,
  Layers  as LayersIcon,
  Assignment as AssignmentIcon,
  Dashboard as DashboardIcon ,
} from "@mui/icons-material";










export const mainListItems = (
  <React.Fragment>


    <ListItemButton component={RouterLink} to={"/manage/dashboard/merchant-view"}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton  component={RouterLink} to={"/manage/dashboard/orders"}>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItemButton>
    <ListItemButton  component={RouterLink} to={"/manage/dashboard/accounts"} >
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Accounts" />
    </ListItemButton>
    <ListItemButton component={RouterLink} to={"/manage/dashboard/sales"}>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Sales"  />
    </ListItemButton>
    
  </React.Fragment>
);

