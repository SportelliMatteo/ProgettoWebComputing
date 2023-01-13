import React, { useEffect, useState } from 'react';
import './Home.css';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import {Link } from 'react-router-dom';
import { address } from '../../assets/globalVar';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import './Card.css';

import "../../Components/SearchBar/SearchBar.css";
import {BiSearch} from 'react-icons/bi';

//Owl Carousel Settings
const options = {
  margin: 30,
  responsiveClass: true,
  nav: true,
  autoplay: false,
  smartSpeed: 1000,
  responsive: {
      0: {
          items: 1,
      },
      200: {
          items: 1,
      },
      600:{
          items: 2,
      },
      700: {
          items: 2,
      },
      1080: {
          items: 3,
      },
      1920: {
        items: 4,
    }
  },
};

const filterRistorantiUrl = `http://${address}:8080/filterRistoranti`;
const getRistorantiConsigliatiUrl=`http://${address}:8080/filterRistorantiIntolleranze`; 
const allRestaurantsUrl= `http://${address}:8080/getRistoranti`;

const RistorantiConsigliati = (props) =>{

    const getRistorantiConsigliatiOptions = {
        method : 'POST',
        headers: { 
        'Content-Type': 'application/json',
        'Authorization' : localStorage.getItem('Auth Token')
        },
    }

    useEffect(() => {
        fetch(getRistorantiConsigliatiUrl, getRistorantiConsigliatiOptions)
            .then((res) => res.json()).then((result) => props.setRistorantiTollerantiUtente(result));
    
      }, []);

    

    return (
        <div>
        {props.ristorantiTollerantiUtente.length !== 0 &&( <h2 className='h2'> Consigliati per te</h2>  ) }
        {props.ristorantiTollerantiUtente.length !== 0 && (
        <OwlCarousel className="owl-theme" {...options} items={3} nav margin={8}>
            {props.ristorantiTollerantiUtente.map((item, val) => (
                <div className='card'>
                    <Card sx={{ maxWidth: "100%" }}>
                        <CardActionArea>
                            <Link to="/restaurant" state={[item.usernameRistoratore,item.nome]} style={{textDecoration:'none', color: 'black'}}>
                                <CardMedia
                                component="img"
                                height="240"
                                image={props.getCopertinaPic(item.copertina)} 
                                alt="Ristorante"
                                />
                            </Link>
                            <CardContent style={{backgroundColor: '#272B30', color: '#c5cfdb'}}>
                            
                            <Typography key={val} gutterBottom variant="h5" component="div">
                                {item.nome}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" style={{backgroundColor: '#272B30', color: '#c5cfdb', border: 'black'}}>
                                {item.descrizione}
                            </Typography>
                            
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>
            ))} 
        </OwlCarousel>
        )}
        </div>
    )
}

function Home(props) {

    const [allRestaurants, setAllRestaurants] = useState([]);
    
    const [searchedRestaurants,setSearchedRestaurants] = useState([]);
    const [ricerca,setRicerca] = useState(null);

    useEffect(() => {
        fetch(allRestaurantsUrl)
            .then((res) => res.json())
            .then((result) => setAllRestaurants(result));
      }, []);

    //Ricerca ristorante per nome
    const filterRistorantioptions ={
            method : 'POST',
            headers: { 
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            'Ricerca' : ricerca
        }),
    }
    
    function filterRistoranti(){
        fetch(filterRistorantiUrl, filterRistorantioptions)
        .then(res => {
            if(res.status === 200) {
                console.log("ristorante cercato correttamente");
                res.json().then(result => setSearchedRestaurants(result));
                }
            
        });
    }
    
    function aggiornaRicerca(val){
        setRicerca(val);
    }

    //Copertina
    const getCopertinaPic = (copertina) => {
        if(copertina === null || copertina === undefined || copertina === "")
            return require("../../Images/nessunImmagine.png");
        else
            return "data:image/png;base64," + copertina;
    }

    
  return (
    <div className='containerHome'>
        <div className="app-bar-search-field">
          <input className="app-bar-search" type="text" placeholder="Trova ristorante..." onChange={(e) => aggiornaRicerca(e.target.value)} />
          <BiSearch className="app-bar-search-icon" size={30} onClick={filterRistoranti} />
      </div>
        {searchedRestaurants.length != 0 && (<h2 className='h2'> Risultati ricerca </h2>)}
        {searchedRestaurants.length != 0 && (
            <OwlCarousel className="owl-theme" {...options} items={3}  nav margin={8}>
            {searchedRestaurants?.map((item, val) => (
                <div className='card'>
                    <Card sx={{ maxWidth: "100%" }}>
                        <CardActionArea>
                            <Link to="/restaurant" state={[item.usernameRistoratore,item.nome]} style={{textDecoration:'none', color: 'black'}} >
                                <CardMedia
                                component="img"
                                height="240"
                                image={getCopertinaPic(item.copertina)} 
                                alt="Ristorante"
                                />
                            </Link>
                            <CardContent style={{backgroundColor: '#272B30', color: '#c5cfdb'}}>
                            
                            <Typography key={val} gutterBottom variant="h5" component="div">
                                {item.nome}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" style={{backgroundColor: '#272B30', color: '#c5cfdb', border: 'black'}}>
                                {item.descrizione}
                            </Typography>
                            
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>
            ))} 
        </OwlCarousel>
        )}
        {searchedRestaurants.length === 0 && ( <h2 className='h2'>Tutti i ristoranti </h2>)}
        {searchedRestaurants.length === 0 && (
        <OwlCarousel className="owl-theme" {...options} items={3}  nav margin={8}>
            {allRestaurants.map((item, val) => (
                <div className='card'>
                    <Card sx={{ maxWidth: "100%" }}>
                        <CardActionArea>
                            <Link to="/restaurant" state={[item.usernameRistoratore,item.nome]} style={{textDecoration:'none', color: 'black'}} >
                                <CardMedia
                                component="img"
                                height="240"
                                image={getCopertinaPic(item.copertina)} 
                                alt="Ristorante"
                                />
                            </Link>
                            <CardContent style={{backgroundColor: '#272B30', color: '#c5cfdb'}}>
                            
                            <Typography key={val} gutterBottom variant="h5" component="div">
                                {item.nome}
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary" style={{backgroundColor: '#272B30', color: '#c5cfdb', border: 'black'}}>
                                {item.descrizione}
                            </Typography>
                            
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>
            ))} 
        </OwlCarousel>
        )}
       
                <RistorantiConsigliati 
                    accessToken = {props.accessToken}
                    getCopertinaPic = {getCopertinaPic}
                    ristorantiTollerantiUtente={props.ristorantiTollerantiUtente} 
                    setRistorantiTollerantiUtente={props.setRistorantiTollerantiUtente}
                />

    </div>
  );
}

export default Home;