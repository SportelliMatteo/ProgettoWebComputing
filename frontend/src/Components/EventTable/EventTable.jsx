import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './EventTable.css';
import '../../Pages/Ristorante/Restaurant';
import Select from 'react-select';



export default function EventTable() {
  return (
    <div className='card'>
        <Card sx={{ maxWidth: "100%" }} style={{borderRadius:"20px", height:"100px", backgroundColor: '#272B30'}}>
            <CardContent className="cardContent">
              <div className="titoloTavolo">
              <p> Tavolo per 2 persone </p>
              </div>
              <button type="submit" className="buttonPrenota"  style={{backgroundColor: "#854D27", border:"none", color:"white", borderRadius:"5px", marginTop:"-10px"}}>
                PRENOTA
              </button>
            </CardContent>

        </Card>
    </div>
  );
}
