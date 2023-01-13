import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import './CardRecensioni.css';
import '../../Pages/Ristorante/Restaurant';
import {IonIcon} from '@ionic/react';
import {star} from 'ionicons/icons';
import Rating from '@mui/material/Rating';
import {address} from '../../assets/globalVar';

export default function ActionAreaCard(props) {

  const nomeRistorante= props.ristorante;
  const utente=props.utente;
  const usernameRistoratore=props.ristoratore;
  const canDelete=(props.utente==props.userLogged);

  function deleteRecensione(){
    fetch(`http://${address}:8080/deleteRecensione`, {method : 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Authorization': props.accessToken
        },
        body: JSON.stringify({
          'ristorante': nomeRistorante
      }),})
          .then((res) => {
              if(res.status === 200) {
                props.getRecensioni();
              }
          });
    }
 

  return (
    <div className='card'>
        <Card sx={{ maxWidth: "70%"}}>
          <CardActionArea>
            <CardContent style={{backgroundColor: '#272B30', color: '#c5cfdb'}}>
                
              {props.immagine !== undefined && ( <img src={props.immagine}/> )}
              <Rating name="read-only" value={props.voto} readOnly />
              
              <Typography variant="body2" color="text.secondary" style={{backgroundColor: '#272B30', color: '#c5cfdb', border: 'black'}}>
                {props.testo} 
              </Typography>
              <Typography variant="body2" color="text.secondary" style={{backgroundColor: '#272B30', color: '#c5cfdb', border: 'black',fontFamily: "cursive",fontSize:"5"}}>
                scritto da {props.utente} 
              </Typography>
              { canDelete == true && (
                <button className="elimninaRecensione" onClick={deleteRecensione} type="submit" style={{backgroundColor: "#C41E3A", border:"none", width:"80px"}}>Elimina</button>
              )}
            </CardContent>
          </CardActionArea>
        </Card>
    </div>
  );
}
