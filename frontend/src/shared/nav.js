"use client"
import PropTypes from "prop-types";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import InputAdornment from "@mui/material/InputAdornment";
import Drawer from "@mui/material/Drawer";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

function ListItemLink(props) {
  const { icon, primary, to } = props;

  return (
    <li>
      <ListItemButton component={Link} href={to}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItemButton>
    </li>
  );
}

ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};


const SideMenu = (props) => {
  // props:
  //  (optional) searchCallback(str): funtion to do search logic
  const username = useSelector((state) => state.user.user.username) ?? "Guest";
  const [search, setSearch] = useState("");
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Searching for:", search);
    if (props.searchCallback) {
      props.searchCallback(search);
    }
  };
  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
      anchor="left"
      variant="permanent"
    >
      <List
        component="nav"
        subheader={
          <ListSubheader sx={{ fontSize: 24, fontWeight: 600 }}>
            Welcome, {username ?? "Guest"}
          </ListSubheader>
        }
      >
        <Divider />
        <ListItem>
          <TextField
            size="small"
            label="search"
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearchSubmit}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </ListItem>
        <Divider />
        <ListItemLink to="/" primary="Home" />
        <ListItemLink to="/employee/profile" primary="Personal Information" />
        <ListItemLink to="/employee/visa-status" primary="Visa Status Management" />
      </List>
    </Drawer>
  );
};

export default SideMenu;