import React, { useState, useEffect, useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {Link } from 'react-router-dom';
import LoggedAccount from './LoggedAccount.jsx';
import AccessAccount from './AccessAccount.jsx';
import { accessToken } from 'mapbox-gl';

const home = ['Home'];

function isEmptyObject(obj) {
  for(var prop in obj) {
      if(obj.hasOwnProperty(prop)){
          return false;
      }
  }
  return true;
}



function DropdownProfile(props) {
  return (
      <div className={"dropdown dropdown-profile " + props.class}>
          {!isEmptyObject(props.userLogged) ? <LoggedAccount  handleCloseUserMenu={props.handleCloseUserMenu} setAccessToken={props.setAccessToken} user={props.userLogged} doLogout={props.doLogout} accessToken={props.accessToken} /> 
                                          : <AccessAccount handleCloseUserMenu={props.handleCloseUserMenu} setAccessToken={props.setAccessToken}/> }
      </div>
  );
}

export default function ResponsiveAppBar(props) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const getProfilePic = () => {
    if(props.userLogged.avatar === null){
        return require("../../Images/avatar.png");
    }else if(props.accessToken === ""){
       return require("../../Images/avatar.png");
    }else 
        return "data:image/png;base64," + props.userLogged.avatar;
  }

  const [dropdownProfileActive, setDropdownProfileActive] = useState(false);

  const wrapperRefProfile = useRef(null);
  useOutsideAlerter(wrapperRefProfile, "Profile");

  function useOutsideAlerter(ref, component) {
      useEffect(() => {
          function handleClickOutside(event) {
              if(component === "Profile") {
                  if(ref.current && !ref.current.contains(event.target)){
                      setTimeout(() => setDropdownProfileActive(false), 100);
                  }
              }
          }

          // Bind the event listener
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
              // Unbind the event listener on clean up
              document.removeEventListener("mousedown", handleClickOutside);
          };
  }, [ref]);}

  return (
    <AppBar position="static" style={{ background: 'transparent'}}>
        <Container style={{maxWidth: "100%"}}>
          <Toolbar disableGutters>
          <Box component="img" src={require("../../Images/Logo.png")} alt="search icon" sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 , width:70, height: 50}}/>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {home.map((page) => (
                  <Link to="/" style={{textDecoration:'none'}} >
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center" color="black">{page}</Typography>
                    </MenuItem>
                  </Link>
                ))}
              </Menu>
            </Box>
            <Box component="img" src={require("../../Images/Logo2.png")} alt="search icon" sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 , width:70, height: 50}}/>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              RestBook
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {home.map((page) => (
                <Link to="/" style={{textDecoration:'none'}}>
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: '#dde5ef', display: 'block'}}>
                    <b>{page}</b>
                  </Button>
                </Link>
              ))}
            </Box>
            <div className="app-bar">
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Profilo">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <img src={getProfilePic()} alt="profile_icon"
                    width={42} height={42} style={{borderRadius: '100%'}}/>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px', p:'10px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                 <DropdownProfile handleCloseUserMenu={handleCloseUserMenu}
                  accessToken={props.accessToken} setAccessToken={props.setAccessToken}
                  userLogged={props.userLogged} setUserLogged={props.setUserLogged}
                  doLogout={props.doLogout}
                />
                </Menu>
              </Box>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
  );
}
