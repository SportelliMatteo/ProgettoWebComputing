import React, { useEffect, useState }  from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import './Card.css';
import '../../Pages/Ristorante/Restaurant';
import {Link } from 'react-router-dom';



export default function ActionAreaCard(props) {
  
  return (
    <div className='card'>
        <Card sx={{ maxWidth: "100%" }}>
          <CardActionArea>
            <Link to="/restaurant" style={{textDecoration:'none', color: 'black'}}>
              <CardMedia
              component="img"
              height="240"
              image={require('../../Images/Hops.jpg')} 
              alt="Ristorante"
              />
            </Link>
            <CardContent style={{backgroundColor: '#272B30', color: '#c5cfdb'}}>
              <Typography gutterBottom variant="h5" component="div">
                ciao
              </Typography>
              <Typography variant="body2" color="text.secondary" style={{backgroundColor: '#272B30', color: '#c5cfdb', border: 'black'}}>
              Una varietà di prodotti per soddisfare tutte le vostre richieste. 
              </Typography>
            
            </CardContent>
          </CardActionArea>
        </Card>
    </div>
  );
}
